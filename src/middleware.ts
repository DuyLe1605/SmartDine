import { Role } from "@/constants/type";
import { decodeToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const protectedPaths = [...managePaths, ...guestPaths];
const authPaths = ["/login", "/tables"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Chưa đăng nhập thì không cho vào protectedPaths
    if (protectedPaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL("/login", request.url);
        url.searchParams.set("clearToken", "true");
        return NextResponse.redirect(url);
    }

    // Đăng nhập rồi
    if (refreshToken) {
        const role = decodeToken(refreshToken).role;

        // Đăng nhập rồi thì không cho vào trang login nữa
        if (authPaths.some((path) => pathname.startsWith(path))) {
            console.log(pathname, authPaths);
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (protectedPaths.some((path) => pathname.startsWith(path)) && !accessToken) {
            const url = new URL("/refresh-token", request.url);
            url.searchParams.set("refreshToken", refreshToken);
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        // Ngăn cho Guest không truy cập được vào trang quản lí
        // Ngăn quản lí hoặc nhân viên vào trang của khách hàng
        const isGuestGoToManagePaths = managePaths.some((path) => pathname.startsWith(path)) && role === Role.Guest;
        const isNotGuestGoToGuestPaths = guestPaths.some((path) => pathname.startsWith(path)) && role !== Role.Guest;

        if (isGuestGoToManagePaths || isNotGuestGoToGuestPaths) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (pathname === "/manage") {
            return NextResponse.redirect(new URL("/manage/dashboard", request.url));
        }
        if (pathname === "/guest") {
            return NextResponse.redirect(new URL("/guest/menu", request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/manage/:path*", "/guest/:path*", "/tables/:path*", "/login"],
};
