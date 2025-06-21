"use client";

import Logout from "@/app/[locale]/(public)/(auth)/logout/logout";
import { Suspense } from "react";

export default function LogoutPage() {
    return (
        <Suspense fallback={<div className="text-center">Logout...</div>}>
            <Logout />
        </Suspense>
    );
}
