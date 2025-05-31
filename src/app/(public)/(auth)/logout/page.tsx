"use client";

import { getRefreshTokenFromLs } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
    const { mutateAsync } = useLogoutMutation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const mutateRef = useRef<any>(null);
    const refreshTokenFromURL = searchParams.get("refreshToken");

    useEffect(() => {
        if (mutateRef.current || getRefreshTokenFromLs() !== refreshTokenFromURL) return;

        mutateRef.current = mutateAsync;
        mutateAsync().then((res) => {
            setTimeout(() => {
                mutateRef.current = null;
            }, 2000);
            router.push("/login");
        });
    }, [mutateAsync, refreshTokenFromURL, router]);

    return <div></div>;
}
