"use client";

import useAppStore from "@/zustand/useAppStore";
import Link from "next/link";

const menuItems = [
    {
        title: "Món ăn",
        href: "/menu",
    },
    {
        title: "Đơn hàng",
        href: "/orders",
        authRequired: true,
    },
    {
        title: "Đăng nhập",
        href: "/login",
        authRequired: false,
    },
    {
        title: "Quản lý",
        href: "/manage/dashboard",
        authRequired: true,
    },
];

export default function NavItems({ className }: { className?: string }) {
    const isAuth = useAppStore((state) => state.isAuth);
    console.log(isAuth);
    return menuItems.map((item) => {
        if ((item.authRequired === true && !isAuth) || (item.authRequired === false && isAuth)) return null;
        return (
            <Link href={item.href} key={item.href} className={className}>
                {item.title}
            </Link>
        );
    });
}
