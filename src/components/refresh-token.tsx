"use client";

import { getAccessTokenFromLs, getRefreshTokenFromLs, saveAccessTokenToLS, saveRefreshTokenToLS } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

const UNAUTHENTICATED_PATHS = ["/login", "/register", "/refresh-token"];
export default function RefreshToken() {
    const pathname = usePathname();

    useEffect(() => {
        if (UNAUTHENTICATED_PATHS.includes(pathname)) return;
        let interval: any = null;
        const checkAndRefreshToken = async () => {
            // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
            // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
            // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
            const accessToken = getAccessTokenFromLs();
            const refreshToken = getRefreshTokenFromLs();

            if (!accessToken || !refreshToken) return;

            // Tiến hành decode accessToken và refreshToken ra và lấy phần exp, giá trị exp tính bằng giây
            const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number };
            const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number };

            // Thời điểm hết hạn của token là tính theo epoch time (s)Add commentMore actions
            // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
            const now = Math.round(new Date().getTime() / 1000);
            // trường hợp refresh token hết hạn thì không xử lý nữa
            if (decodedRefreshToken.exp <= now) return;
            // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
            // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
            // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
            // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat

            if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
                try {
                    const res = await authApiRequest.refreshToken();
                    const { accessToken, refreshToken } = res.payload.data;
                    saveAccessTokenToLS(accessToken);
                    saveRefreshTokenToLS(refreshToken);
                } catch (error) {
                    clearInterval(interval);
                }
            }
        };

        // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUTAdd commentMore actions
        checkAndRefreshToken();
        // Timeout interval phải bé hơn thời gian hết hạn của access token
        // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
        const TIMEOUT = 1000;
        interval = setInterval(checkAndRefreshToken, TIMEOUT);
        return () => {
            clearInterval(interval);
        };
    }, [pathname]);
    return null;
}
