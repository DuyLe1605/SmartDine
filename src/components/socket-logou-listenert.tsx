"use client";

import { handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import useAppStore from "@/zustand/useAppStore";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];

export default function SocketLogoutListener() {
    const pathname = usePathname();
    const router = useRouter();
    const { mutateAsync, isPending } = useLogoutMutation();
    const socket = useAppStore((state) => state.socket);
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);

    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return;

        async function onLogout() {
            if (isPending) return;
            try {
                await mutateAsync();
                setRole();
                disconnectSocket();
                router.push("/");
            } catch (error: any) {
                handleErrorApi({ error });
            }
        }

        socket?.on("logout", onLogout);
        return () => {
            socket?.off("logout", onLogout);
        };
    }, [pathname, router, mutateAsync, isPending, socket, setRole, disconnectSocket]);
    return null;
}
