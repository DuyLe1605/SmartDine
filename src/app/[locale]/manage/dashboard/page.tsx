import DashboardMain from "@/app/[locale]/manage/dashboard/dashboard-main";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Dashboard" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations("Dashboard");
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DashboardMain />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
