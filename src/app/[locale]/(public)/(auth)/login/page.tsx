import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { WavyBackgroundDemo } from "@/app/[locale]/(public)/(auth)/login/wavy";
import envConfig from "@/config";
import { Locale } from "@/i18n/config";
import { baseOpenGraph } from "@/sharedMetadata";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Login" });

    const url = `${envConfig.NEXT_PUBLIC_URL}/${locale}/login`;

    return {
        title: t("title"),
        description: t("description"),
        openGraph: {
            ...baseOpenGraph,
            title: t("title"),
            description: t("description"),
            url,
        },
    };
}

export default function Login({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = use(params);

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <div className="h-[80vh] flex items-center justify-center">
            <LoginForm />
        </div>
    );
}
