import ThemeToggle from "@/components/theme-toggle";
import DropdownAvatar from "@/app/[locale]/manage/dropdown-avatar";
import NavLinks from "@/app/[locale]/manage/nav-links";
import MobileNavLinks from "@/app/[locale]/manage/mobile-nav-links";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { Locale } from "@/i18n/config";

export default async function Layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}>) {
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    setRequestLocale(locale);
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <NavLinks />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <MobileNavLinks />
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <div className="flex justify-end">
                            <ThemeToggle />
                        </div>
                    </div>
                    <DropdownAvatar />
                </header>
                {children}
            </div>
        </div>
    );
}
