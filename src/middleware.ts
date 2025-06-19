import { Role } from "@/constants/type";
import { decodeToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Các path cơ bản (không có locale)
const baseManagePaths = ["/manage"];
const baseGuestPaths = ["/guest"];
const baseOnlyOwnerPaths = ["/manage/accounts"];
const baseAuthPaths = ["/login", "/tables"];

// Hàm thêm locale vào mỗi path
function withLocales(paths: string[]): string[] {
    return routing.locales.flatMap((locale) => paths.map((path) => `/${locale}${path}`));
}

// Paths sau khi thêm locale
const managePaths = withLocales(baseManagePaths);
const guestPaths = withLocales(baseGuestPaths);
const onlyOwnerPaths = withLocales(baseOnlyOwnerPaths);
const authPaths = withLocales(baseAuthPaths);
const protectedPaths = [...managePaths, ...guestPaths];

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
// HOW TO : https://stackoverflow.com/questions/77040517/how-to-rewrite-request-after-next-intl-middleware-receives-it

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing);

    const response = handleI18nRouting(request);

    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Chưa đăng nhập thì không cho vào protectedPaths
    if (protectedPaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL("/login", request.url);
        url.searchParams.set("clearToken", "true");
        // return NextResponse.redirect(url);
        response.headers.set("x-middleware-rewrite", url.toString());
        return response;
    }

    // Đăng nhập rồi
    if (refreshToken) {
        const role = decodeToken(refreshToken).role;

        // Đăng nhập rồi thì không cho vào trang login nữa
        if (authPaths.some((path) => pathname.startsWith(path))) {
            // return NextResponse.redirect(new URL("/", request.url));
            const url = new URL("/", request.url);
            response.headers.set("x-middleware-rewrite", url.toString());
            return response;
        }

        if (protectedPaths.some((path) => pathname.startsWith(path)) && !accessToken) {
            const url = new URL("/refresh-token", request.url);
            url.searchParams.set("refreshToken", refreshToken);
            url.searchParams.set("redirect", pathname);
            // return NextResponse.redirect(url);
            response.headers.set("x-middleware-rewrite", url.toString());
            return response;
        }

        // Ngăn cho Guest không truy cập được vào trang quản lí
        // Ngăn quản lí hoặc nhân viên vào trang của khách hàng
        const isGuestGoToManagePaths = managePaths.some((path) => pathname.startsWith(path)) && role === Role.Guest;
        const isNotGuestGoToGuestPaths = guestPaths.some((path) => pathname.startsWith(path)) && role !== Role.Guest;
        const isNotOwnerGoToOwnerPaths =
            onlyOwnerPaths.some((path) => pathname.startsWith(path)) && role !== Role.Owner;

        if (isGuestGoToManagePaths || isNotGuestGoToGuestPaths || isNotOwnerGoToOwnerPaths) {
            // return NextResponse.redirect(new URL("/", request.url));
            const url = new URL("/", request.url);
            response.headers.set("x-middleware-rewrite", url.toString());
            return response;
        }

        if (pathname === "/manage") {
            // return NextResponse.redirect(new URL("/manage/dashboard", request.url));
            const url = new URL("/manage/dashboard", request.url);
            response.headers.set("x-middleware-rewrite", url.toString());
            return response;
        }
        if (pathname === "/guest") {
            // return NextResponse.redirect(new URL("/guest/menu", request.url));
            const url = new URL("/guest/menu", request.url);
            response.headers.set("x-middleware-rewrite", url.toString());
            return response;
        }

        // return NextResponse.next();
        return response;
    }

    // Nếu không nhảy vào if ở trên,cũng phải trả về 1 cái response

    return response;
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        // Match tất cả các route trừ static assets và API
        "/((?!api|_next|_vercel|.*\\..*).*)",
    ],
};

// // Và đảm bảo không loại trừ những route bạn muốn như /vi/manage, /en/login,...
// "/([\\w-]+)?/manage/:path*",
// "/([\\w-]+)?/guest/:path*",
// "/([\\w-]+)?/tables/:path*",
// "/([\\w-]+)?/login",
