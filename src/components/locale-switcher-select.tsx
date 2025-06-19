"use client";
import { Avatar } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale } from "@/i18n/config";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
    value: string;
    children: React.ReactNode;
    label: string;
};

export default function LocaleSwitcherSelect({ value, children, label }: Props) {
    const router = useRouter();

    const locale = useLocale();
    const pathname = usePathname();
    const params = useParams();
    const searchParams = useSearchParams();

    function onChange(value: string) {
        const nextLocale = value as Locale;
        console.log(pathname, params, searchParams, value, nextLocale);

        const newPathname = pathname.replace(`/${locale}`, `/${value}`);
        const fullUrl = `${newPathname}?${searchParams.toString()}`;
        router.replace(fullUrl);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 flex items-center justify-center mr-5">
                    <Languages className="" />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="">{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
                    {children}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
