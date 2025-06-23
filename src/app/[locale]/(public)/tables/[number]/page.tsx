import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import envConfig from "@/config";
import { Locale } from "@/i18n/config";
import { baseOpenGraph } from "@/sharedMetadata";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; number: string }> }) {
    const { locale, number } = await params;
    const t = await getTranslations({ locale, namespace: "GuestLogin" });

    const url = (localeInput: Locale) => `${envConfig.NEXT_PUBLIC_URL}/${localeInput}/tables/${number}`;

    return {
        title: `No ${number} | ${t("title")}`,
        description: t("description"),
        openGraph: {
            ...baseOpenGraph,
            title: `No ${number} | ${t("title")}`,
            description: t("description"),
            url: url(locale),
        },
        alternates: {
            canonical: url(locale),
            languages: {
                en: url("en"),
                vi: url("vi"),
            },
        },
    };
}

export default function TableNumberPage() {
    return <GuestLoginForm />;
}
