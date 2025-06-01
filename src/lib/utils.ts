import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
    error,
    setError,
    duration,
}: {
    error: any;
    setError?: UseFormSetError<any>;
    duration?: number;
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field, {
                type: "server",
                message: item.message,
            });
        });
    } else {
        toast(error?.payload?.message ?? "Lỗi không xác định", {
            duration: duration ?? 5000,
        });
    }
};

const isClient = typeof window !== "undefined";

export const getAccessTokenFromLs = () => (isClient ? localStorage.getItem("accessToken") : null);
export const getRefreshTokenFromLs = () => (isClient ? localStorage.getItem("refreshToken") : null);

export const saveAccessTokenToLS = (accessToken: string) =>
    isClient && localStorage.setItem("accessToken", accessToken);
export const saveRefreshTokenToLS = (refreshToken: string) =>
    isClient && localStorage.setItem("refreshToken", refreshToken);

export const clearToken = () => {
    isClient && localStorage.removeItem("accessToken");
    isClient && localStorage.removeItem("refreshToken");
};

export const checkAndRefreshToken = async (params?: { onError?: () => void; onSuccess?: () => void }) => {
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
            if (params?.onSuccess) {
                params.onSuccess();
            }
        } catch (error) {
            if (params?.onError) {
                params.onError();
            }
        }
    }
};
