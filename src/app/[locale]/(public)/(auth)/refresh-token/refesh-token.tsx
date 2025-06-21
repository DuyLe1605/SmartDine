"use client";

import { checkAndRefreshToken, getRefreshTokenFromLs, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import useAppStore from "@/zustand/useAppStore";
import { Metadata } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export const metadata: Metadata = {
    title: "Refresh Token Redirect",
    description: "Refresh Token Redirect",
};

export default function RefreshToken() {
    const searchParams = useSearchParams();
    // redirectPathname ở đây sẽ là /[locale]/...
    // vậy nên nếu import từ @/i18n thì sẽ bị redirect tới /[locale]/[locale]/...
    const router = useRouter();

    const refreshTokenFromUrl = searchParams.get("refreshToken");
    const redirectPathname = searchParams.get("redirect");
    const { mutateAsync, isPending } = useLogoutMutation();
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);
    const count = useRef(0);

    useEffect(() => {
        if (count.current === 0) {
            if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLs()) {
                checkAndRefreshToken({
                    onSuccess: () => {
                        router.push(redirectPathname || "/");
                    },
                });
            } else if (refreshTokenFromUrl && !getRefreshTokenFromLs()) {
                const handleLogout = async () => {
                    if (isPending) return;
                    try {
                        await mutateAsync();
                        setRole();
                        disconnectSocket();
                        router.push("/");
                        toast("Bạn bị logout do lỗi không xác định,hãy báo admin về bug này (STATUS_CODE:16)");
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } catch (error: any) {
                        console.error(error);
                        handleErrorApi({ error });
                    }
                };
                handleLogout();
            }
        }

        count.current++;
    }, [refreshTokenFromUrl, router, redirectPathname, disconnectSocket, setRole, mutateAsync, isPending]);

    return <div className="text-center">Refreshing Token...</div>;
}
