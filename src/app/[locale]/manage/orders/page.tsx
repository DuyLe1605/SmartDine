import OrderTable from "@/app/[locale]/manage/orders/order-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Locale } from "@/i18n/config";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Suspense } from "react";

export default function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    // Enable static rendering
    setRequestLocale(locale as Locale);

    const t = useTranslations("Orders");
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense>
                            <OrderTable />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
