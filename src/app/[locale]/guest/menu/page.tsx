import MenuOrder from "@/app/[locale]/guest/menu/menu-order";
import { Locale } from "@/i18n/config";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "GuestMenu" });

    return {
        title: t("title"),
        description: t("description"),
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
