import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { Locale } from "@/i18n/config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Login" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function Login({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = use(params);

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    );
}
