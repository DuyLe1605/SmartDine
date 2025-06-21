import OAuth from "@/app/[locale]/(public)/(auth)/login/oauth/oauth";
import { Suspense } from "react";

export default function OAuthPage() {
    return (
        <Suspense>
            <OAuth />
        </Suspense>
    );
}
