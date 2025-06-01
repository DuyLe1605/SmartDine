"use client";

import { checkAndRefreshToken, getRefreshTokenFromLs } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const refreshTokenFromUrl = searchParams.get("refreshToken");
    const redirectPathname = searchParams.get("redirect");

    useEffect(() => {
        if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLs()) {
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirectPathname || "/");
                },
            });
        }
    }, [refreshTokenFromUrl, router]);

    return <div className="text-center">Refreshing Token...</div>;
}
