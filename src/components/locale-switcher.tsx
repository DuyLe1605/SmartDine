import LocaleSwitcherSelect from "@/components/locale-switcher-select";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
    const t = useTranslations("LocaleSwitcher");
    const locale = useLocale();

    return (
        <LocaleSwitcherSelect
            value={locale}
            items={[
                {
                    value: "en",
                    label: t("en"),
                },
                {
                    value: "vi",
                    label: t("vi"),
                },
            ]}
            label={t("label")}
        />
    );
}
