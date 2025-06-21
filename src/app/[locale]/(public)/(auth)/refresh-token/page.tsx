import RefreshToken from "@/app/[locale]/(public)/(auth)/refresh-token/refesh-token";
import { Suspense } from "react";

export default function RefreshTokenPage() {
    return (
        <Suspense>
            <RefreshToken />
        </Suspense>
    );
}
