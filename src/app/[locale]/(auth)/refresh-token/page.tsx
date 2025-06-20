"use client";

import { checkAndRefreshToken, getRefreshTokenFromLs } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RefreshToken() {
    const searchParams = useSearchParams();
    // redirectPathname ở đây sẽ là /[locale]/...
    // vậy nên nếu import từ @/i18n thì sẽ bị redirect tới /[locale]/[locale]/...
    const router = useRouter();

    const refreshTokenFromUrl = searchParams.get("refreshToken");
    const redirectPathname = searchParams.get("redirect");

    useEffect(() => {
        console.log("refreshToken CPN");
        if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLs()) {
            console.log("rt-component");
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirectPathname || "/");
                },
            });
        } else {
        }
    }, [refreshTokenFromUrl, router, redirectPathname]);

    return <div className="text-center">Refreshing Token...</div>;
}

export default function RefreshTokenPage() {
    return (
        <Suspense>
            <RefreshToken />
        </Suspense>
    );
}
