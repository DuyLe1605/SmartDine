"use client";

import { useRouter } from "@/i18n/navigation";
import { generateSocketInstance } from "@/lib/socket";
import { decodeToken } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import useAppStore from "@/zustand/useAppStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function OAuth() {
    const setRole = useAppStore((state) => state.setRole);
    const setSocket = useAppStore((state) => state.setSocket);
    const { mutateAsync } = useSetTokenToCookieMutation();
    const count = useRef(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const message = searchParams.get("message");

    useEffect(() => {
        if (accessToken && refreshToken) {
            if (count.current === 0) {
                const { role } = decodeToken(accessToken);

                mutateAsync({ accessToken, refreshToken })
                    .then((res) => {
                        setRole(role);
                        setSocket(generateSocketInstance(accessToken));
                        router.push("/manage/dashboard");
                    })
                    .catch((error) => toast(error.message || "Đã có lỗi xảy ra khi đăng nhập bằng Google"));
            }
            count.current++;
        } else {
            if (count.current === 0) {
                // SetTimeout để fix lỗi không toast khi vào trang
                setTimeout(() => {
                    toast(message || "Đã có lỗi xảy ra khi đăng nhập bằng Google");
                });

                router.push("/login");
            }
            count.current++;
        }
    }, [accessToken, refreshToken, setRole, router, message, setSocket, mutateAsync]);

    return null;
}
