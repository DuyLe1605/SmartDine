import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AppProvider from "@/components/app-provder";
import { Toaster } from "sonner";

const roboto = Roboto({
    subsets: ["vietnamese", "latin"],
});

export const metadata: Metadata = {
    title: "Smart Dine",
    description: "The best restaurant in the world",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body className={`${roboto.className} antialiased`}>
                <AppProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </AppProvider>
            </body>
        </html>
    );
}
