import OrderCart from "@/app/[locale]/guest/orders/order-cart";
import envConfig from "@/config";
import { Locale } from "@/i18n/config";
import { baseOpenGraph } from "@/sharedMetadata";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "GuestOrders" });

    const url = (localeInput: Locale) => envConfig.NEXT_PUBLIC_URL + `/${localeInput}/guest/orders`;
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

export default function OrdersPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = use(params);

    // Enable static rendering
    setRequestLocale(locale);

    const t = useTranslations("GuestOrders");
    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">🍕 {t("title")}</h1>
            <OrderCart />
        </div>
    );
}
