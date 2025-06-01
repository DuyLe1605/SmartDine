"use client";

import { getAccessTokenFromLs, getRefreshTokenFromLs } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
    const { mutateAsync } = useLogoutMutation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const mutateRef = useRef<any>(null);
    const refreshTokenFromUrl = searchParams.get("refreshToken");
    const accessTokenFromUrl = searchParams.get("accessToken");
    useEffect(() => {
        // mutateRef.current: Tránh bị duplicate request
        // (!accessTokenFromURL) || (!refreshTokenFromURL) : Tránh trường hợp khi không có refreshToken mà người dùng vào link Logout
        //  (accessTokenFromURL && getAccessTokenFromLs() !== accessTokenFromURL) : Kiểm tra trường hợp logout do lỗi 401 (ở server component hoặc route handler)
        //  (refreshTokenFromURL && getRefreshTokenFromLs() !== refreshTokenFromURL): Kiểm tra trường hợp access token bị xóa khỏi cookie
        if (
            mutateRef.current ||
            (!accessTokenFromUrl && !refreshTokenFromUrl) ||
            (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLs()) ||
            (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLs())
        ) {
            console.log("return");
            return;
        }

        console.log("pass");
        mutateRef.current = mutateAsync;
        mutateAsync().then((res) => {
            setTimeout(() => {
                mutateRef.current = null;
            }, 2000);
            router.push("/login");
        });
    }, [mutateAsync, refreshTokenFromUrl, router]);

    return <div className="text-center">Logout...</div>;
}
