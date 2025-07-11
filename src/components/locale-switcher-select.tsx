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

import { Languages } from "lucide-react";
import { useLocale } from "next-intl";

// Chỗ này nên giữ nguyên, không nên đổi sang dùng ở thu mục i18n vì sẽ bị lỗi
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
    value: string;
    children: React.ReactNode;
    label: string;
};

export default function LocaleSwitcherSelect({ value, children, label }: Props) {
    const router = useRouter();

    const locale = useLocale();
    const pathname = usePathname();

    const searchParams = useSearchParams();

    function onChange(value: string) {
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
