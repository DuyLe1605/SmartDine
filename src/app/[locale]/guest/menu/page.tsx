import MenuOrder from "@/app/[locale]/guest/menu/menu-order";
import envConfig from "@/config";
import { Locale } from "@/i18n/config";
import { baseOpenGraph } from "@/sharedMetadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "GuestMenu" });
    const url = (localeInput: Locale) => envConfig.NEXT_PUBLIC_URL + `/${localeInput}/guest/menu`;
    return {
        title: t("title"),
        description: t("description"),
        openGraph: {
            ...baseOpenGraph,
            title: t("title"),
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
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function MenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations("GuestMenu");
    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">🍕 {t("title")}</h1>
            <MenuOrder />
        </div>
    );
}
