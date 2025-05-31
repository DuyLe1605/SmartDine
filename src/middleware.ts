import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/manage/dashboard"];
const authPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Chưa đăng nhập thì không cho vào protectedPaths
    if (protectedPaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Đăng nhập rồi thì không cho vào trang login
    if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname === "/manage" && refreshToken) {
        return NextResponse.redirect(new URL("/manage/dashboard", request.url));
    }

    if (protectedPaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
        const url = new URL("/logout", request.url);
        url.searchParams.set("refreshToken", refreshToken);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/manage/:path*", "/login"],
};
