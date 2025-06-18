import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/components/app-provder";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const roboto = Roboto({
    subsets: ["vietnamese", "latin"],
});

export const metadata: Metadata = {
    title: "Smart Dine",
    description: "The best restaurant in the world",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${roboto.className} antialiased`}>
                <NextIntlClientProvider>
                    <AppProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </AppProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
