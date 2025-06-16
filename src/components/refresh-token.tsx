"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { AccountResType } from "@/schemaValidations/account.schema";

import useAppStore from "@/zustand/useAppStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];
export default function RefreshToken() {
    const pathname = usePathname();
    const router = useRouter();
    const socket = useAppStore((state) => state.socket);
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);
    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
        let interval: any = null;

        //     // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
        //     // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
        //     // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
        //     const accessToken = getAccessTokenFromLs();
        //     const refreshToken = getRefreshTokenFromLs();

        //     if (!accessToken || !refreshToken) return;

        //     // Tiến hành decode accessToken và refreshToken ra và lấy phần exp, giá trị exp tính bằng giây
        //     const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number };
        //     const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number };

        //     // Thời điểm hết hạn của token là tính theo epoch time (s)Add commentMore actions
        //     // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
        //     const now = Math.round(new Date().getTime() / 1000);
        //     // trường hợp refresh token hết hạn thì không xử lý nữa
        //     if (decodedRefreshToken.exp <= now) return;
        //     // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
        //     // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
        //     // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
        //     // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat

        //     if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        //         try {
        //             const res = await authApiRequest.refreshToken();
        //             const { accessToken, refreshToken } = res.payload.data;
        //             saveAccessTokenToLS(accessToken);
        //             saveRefreshTokenToLS(refreshToken);
        //         } catch (error) {
        //             clearInterval(interval);
        //         }
        //     }
        // };

        // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
        const onRefreshToken = (force?: boolean, onSuccess?: () => void) => {
            checkAndRefreshToken({
                onError: () => {
                    clearInterval(interval);
                    toast.error("refreshToken hết hạn, vui lòng đăng nhập lại !", { duration: 4000 });
                    disconnectSocket();
                    setRole();
                    router.push("/login");
                },
                onSuccess,
                force,
            });
        };
        onRefreshToken();
        // Timeout interval phải bé hơn thời gian hết hạn của access token
        // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
        // vì server backend quy định thời gian hết hạn là 15p (có thể chỉnh) nên mình sẽ check 3p 1 lần
        // const TIMEOUT = 1000 * 60 * 3;
        const TIMEOUT = 1000 * 60 * 3;
        interval = setInterval(onRefreshToken, TIMEOUT);

        // Socket lắng nghe sự kiện refresh Token

        if (socket?.connected) {
            onConnect();
        }

        function onConnect() {
            console.log("socket.id: ", socket?.id);
        }

        function onDisconnect() {
            console.log("disconnected");
        }
        function onRefreshTokenSocket(data: AccountResType["data"]) {
            // Server sẽ trả về data, trong đó có role và mình sẽ tiến hành set lại Role

            const { role } = data;
            onRefreshToken(true, () => {
                setRole(role);
            });
        }

        socket?.on("connect", onConnect);
        socket?.on("disconnect", onDisconnect);
        socket?.on("refresh-token", onRefreshTokenSocket);
        return () => {
            clearInterval(interval);
            // Nhớ phải clean up
            socket?.off("connect", onConnect);
            socket?.off("disconnect", onDisconnect);
            socket?.off("refresh-token", onRefreshTokenSocket);
        };
    }, [pathname, router, socket, disconnectSocket]);
    return null;
}
