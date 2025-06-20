import LocaleSwitcherSelect from "@/components/locale-switcher-select";
import { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";

export default function LocaleSwitcher() {
    const t = useTranslations("LocaleSwitcher");
    const locale = useLocale();

    return (
        // Vì cái locale switcher select dùng search params nên cần bọc lai bằng suspense
        <Suspense>
            <LocaleSwitcherSelect value={locale} label={t("label")}>
                {routing.locales.map((cur) => (
                    // <option key={cur} value={cur}>
                    //     {t("locale", { locale: cur })}
                    // </option>
                    <DropdownMenuRadioItem key={cur} value={cur}>
                        <span className="">{t("locale", { locale: cur })}</span>
                    </DropdownMenuRadioItem>
                ))}
            </LocaleSwitcherSelect>
        </Suspense>
    );
}
