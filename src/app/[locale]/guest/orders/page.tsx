import OrderCart from "@/app/[locale]/guest/orders/order-cart";
import { Locale } from "@/i18n/config";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);

    // Enable static rendering
    setRequestLocale(locale as Locale);

    const t = useTranslations("GuestOrders");
    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">🍕 {t("title")}</h1>
            <OrderCart />
        </div>
    );
}
