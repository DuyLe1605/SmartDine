import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/components/app-provder";
import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";
import type { Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/footer";

const roboto = Roboto({
    subsets: ["vietnamese", "latin"],
});

// export const metadata: Metadata = {
//     title: "Smart Dine",
//     description: "The best restaurant in the world",
// };

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Brand" });

    return {
        title: { template: `%s | ${t("title")}`, default: t("defaultTitle") },
        icons: [
            { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon/favicon-16x16.png" },
            { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon/favicon-32x32.png" },
            { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicon/favicon-96x96.png" },
            { rel: "icon", type: "image/png", sizes: "192x192", url: "/favicon/android-icon-192x192.png" },

            { rel: "apple-touch-icon", sizes: "57x57", url: "/favicon/apple-icon-57x57.png" },
            { rel: "apple-touch-icon", sizes: "60x60", url: "/favicon/apple-icon-60x60.png" },
            { rel: "apple-touch-icon", sizes: "72x72", url: "/favicon/apple-icon-72x72.png" },
            { rel: "apple-touch-icon", sizes: "76x76", url: "/favicon/apple-icon-76x76.png" },
            { rel: "apple-touch-icon", sizes: "114x114", url: "/favicon/apple-icon-114x114.png" },
            { rel: "apple-touch-icon", sizes: "120x120", url: "/favicon/apple-icon-120x120.png" },
            { rel: "apple-touch-icon", sizes: "144x144", url: "/favicon/apple-icon-144x144.png" },
            { rel: "apple-touch-icon", sizes: "152x152", url: "/favicon/apple-icon-152x152.png" },
            { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon/apple-icon-180x180.png" },
        ],
        manifest: "/favicon/manifest.json",

        other: {
            "msapplication-TileColor": "#ffffff",
            "msapplication-TileImage": "/favicon/ms-icon-144x144.png",
        },
    };
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    setRequestLocale(locale);
    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${roboto.className} antialiased`}>
                <NextTopLoader showSpinner={false} height={3} />
                <NextIntlClientProvider>
                    <AppProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            {children}
                            <Footer />
                            <Toaster />
                        </ThemeProvider>
                    </AppProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
