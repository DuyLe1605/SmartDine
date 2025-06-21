import OrderCart from "@/app/[locale]/guest/orders/order-cart";
import { Locale } from "@/i18n/config";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "GuestOrders" });

    return {
        title: t("title"),
        description: t("description"),
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
