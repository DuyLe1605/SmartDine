"use client";

import { useRouter } from "@/i18n/navigation";
import { checkAndRefreshToken, getRefreshTokenFromLs } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RefreshToken() {
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

export default function RefreshTokenPage() {
    return (
        <Suspense>
            <RefreshToken />
        </Suspense>
    );
}
