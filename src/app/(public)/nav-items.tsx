"use client";

import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useGuestLogoutMutation } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import useAppStore from "@/zustand/useAppStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const menuItems: {
    title: string;
    href: string;
    role?: RoleType[];
    hiddenWhenLogin?: boolean;
}[] = [
    {
        title: "Trang chủ",
        href: "/",
    },
    {
        title: "Món ăn",
        href: "/guest/menu",
        role: [Role.Guest],
    },
    {
        title: "Đăng nhập",
        href: "/login",
        hiddenWhenLogin: true,
    },
    {
        title: "Quản lý",
        href: "/manage/dashboard",
        role: [Role.Employee, Role.Owner],
    },
];

export default function NavItems({ className }: { className?: string }) {
    const logoutMutation = useLogoutMutation();
    const guestLogoutMutation = useGuestLogoutMutation();
    const router = useRouter();

    const role = useAppStore((state) => state.role);
    const setRole = useAppStore((state) => state.setRole);

    const handleLogout = async () => {
        if (logoutMutation.isPending) return;
        try {
            const result =
                role === Role.Guest ? await guestLogoutMutation.mutateAsync() : await logoutMutation.mutateAsync();
            setRole();
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
                            {item.title}
                        </Link>
                    );
                }
                return null;
            })}
            {role && (
                <button className={cn(className, "cursor-pointer")} onClick={handleLogout}>
                    Đăng xuất
                </button>
            )}
        </>
    );
}
