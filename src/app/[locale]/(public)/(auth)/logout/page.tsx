"use client";

import { useRouter } from "@/i18n/navigation";
import { getAccessTokenFromLs, getRefreshTokenFromLs } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import useAppStore from "@/zustand/useAppStore";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function Logout() {
    const { mutateAsync } = useLogoutMutation();
    const searchParams = useSearchParams();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mutateRef = useRef<any>(null);
    const refreshTokenFromUrl = searchParams.get("refreshToken");
    const accessTokenFromUrl = searchParams.get("accessToken");
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);
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
            return;
        }

        mutateRef.current = mutateAsync;
        mutateAsync().then((res) => {
            setTimeout(() => {
                mutateRef.current = null;
            }, 2000);
            setRole();
            disconnectSocket();
            router.push("/login");
        });
    }, [mutateAsync, refreshTokenFromUrl, router, accessTokenFromUrl, disconnectSocket, setRole]);
    return null;
}

export default function LogoutPage() {
    return (
        <Suspense fallback={<div className="text-center">Logout...</div>}>
            <Logout />
        </Suspense>
    );
}
