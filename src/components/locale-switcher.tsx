import LocaleSwitcherSelect from "@/components/locale-switcher-select";
import { DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
    const t = useTranslations("LocaleSwitcher");
    const locale = useLocale();

    return (
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
    );
}
