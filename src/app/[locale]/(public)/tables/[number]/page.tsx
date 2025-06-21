import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import { Locale } from "@/i18n/config";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; number: string }> }) {
    const { locale, number } = await params;
    const t = await getTranslations({ locale, namespace: "GuestLogin" });

    return {
        title: `No ${number} | ${t("title")}`,
        description: t("description"),
    };
}

export default function TableNumberPage() {
    return <GuestLoginForm />;
}
