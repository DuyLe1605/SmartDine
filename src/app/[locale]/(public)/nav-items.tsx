/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useGuestLogoutMutation } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import useAppStore from "@/zustand/useAppStore";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

const menuItems: {
    title: string;
    href: string;
    role?: RoleType[];
    hiddenWhenLogin?: boolean;
}[] = [
    {
        title: "home",
        href: "/",
    },
    {
        title: "menu",
        href: "/guest/menu",
        role: [Role.Guest],
    },
    {
        title: "orders",
        href: "/guest/orders",
        role: [Role.Guest],
    },
    {
        title: "login",
        href: "/login",
        hiddenWhenLogin: true,
    },
    {
        title: "dashboard",
        href: "/manage/dashboard",
        role: [Role.Employee, Role.Owner],
    },
];

export default function NavItems({ className }: { className?: string }) {
    const t = useTranslations("NavItem");
    const logoutMutation = useLogoutMutation();
    const guestLogoutMutation = useGuestLogoutMutation();
    const router = useRouter();

    const role = useAppStore((state) => state.role);
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);

    const handleLogout = async () => {
        if (logoutMutation.isPending) return;
        try {
            const result =
                role === Role.Guest ? await guestLogoutMutation.mutateAsync() : await logoutMutation.mutateAsync();
            setRole();
            disconnectSocket();
            router.push("/");

            toast.success(result.payload.message);
        } catch (error: any) {
            console.error(error);
            handleErrorApi({ error });
        }
    };

    return (
        <>
            {menuItems.map((item) => {
                const isAuth = role && item.role && item.role.includes(role);

                const canShow = (item.role === undefined && !item.hiddenWhenLogin) || (!role && item.hiddenWhenLogin);

                if (isAuth || canShow) {
                    return (
                        <Link href={item.href} key={item.href} className={className}>
                            {t(item.title as any)}
                        </Link>
                    );
                }
                return null;
            })}
            {role && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className={cn(className, "cursor-pointer")}>{t("logout")}</button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("logoutDialog.alertTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("logoutDialog.alertDescription")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t("logoutDialog.cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>{t("logoutDialog.confirm")}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
