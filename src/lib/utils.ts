/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import { TokenPayload } from "@/types/jwt.types";
import guestApiRequest from "@/apiRequests/guest";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const generateAvatarName = (name: string | undefined, fallbackName?: string) => {
    return name
        ? name
              .trim()
              .split(" ")
              .slice(-3)
              .map((word) => word.slice(0, 1))
              .join("")
              .toUpperCase()
        : fallbackName;
};

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
        toast.error(error?.payload?.message ?? "Lỗi không xác định", {
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

export const clearTokensFormLS = () => {
    if (isClient) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
};

export const checkAndRefreshToken = async (params?: {
    onError?: () => void;
    onSuccess?: () => void;
    force?: boolean;
}) => {
    // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
    // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta se có một access và refresh token mới
    // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
    const accessToken = getAccessTokenFromLs();
    const refreshToken = getRefreshTokenFromLs();

    if (!accessToken || !refreshToken) return;

    // Tiến hành decode accessToken và refreshToken ra và lấy phần exp, giá trị exp tính bằng giây
    const decodedAccessToken = decodeToken(accessToken);
    const decodedRefreshToken = decodeToken(refreshToken);

    // Thời điểm hết hạn của token là tính theo epoch time (s)Add commentMore actions
    // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
    const now = new Date().getTime() / 1000 - 1;
    // trường hợp refresh token hết hạn thì cho logout và xóa Tokens ra khỏi local storage
    // Không cần xóa trong cookie vì nó sẽ tự xóa sau khi hết hạn
    if (decodedRefreshToken.exp <= now) {
        clearTokensFormLS();

        return params?.onError && params.onError();
    }

    // Trường hợp force refresh khi lắng nghe được sự kiện refreshToken do socket IO bắn ra

    // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
    // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
    // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
    // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat

    if (params?.force || decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        try {
            const role = decodedRefreshToken.role;
            const res =
                role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken();
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
export const formatCurrency = (number: number) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(number);
};

export const getVietnameseRoleName = (name: (typeof Role)[keyof typeof Role]) => {
    switch (name) {
        case Role.Employee:
            return "Nhân viên";
        case Role.Owner:
            return "Quản lý";
        default:
            return "Khách";
    }
};

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
    switch (status) {
        case DishStatus.Available:
            return "Có sẵn";
        case DishStatus.Unavailable:
            return "Không có sẵn";
        default:
            return "Ẩn";
    }
};

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
    switch (status) {
        case OrderStatus.Delivered:
            return "Đã phục vụ";
        case OrderStatus.Paid:
            return "Đã thanh toán";
        case OrderStatus.Pending:
            return "Chờ xử lý";
        case OrderStatus.Processing:
            return "Đang Chế biến";
        default:
            return "Từ chối";
    }
};
export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
    switch (status) {
        case TableStatus.Available:
            return "Có sẵn";
        case TableStatus.Reserved:
            return "Đã đặt";
        default:
            return "Ẩn";
    }
};

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
    return envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token;
};

export const decodeToken = (token: string) => jwt.decode(token) as TokenPayload;

export function removeAccents(str: string) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
    return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()));
};
export const formatDateTimeToLocaleString = (date: string | Date) => {
    return format(date instanceof Date ? date : new Date(date), "HH:mm:ss dd/MM/yyyy");
};

export const formatDateTimeToTimeString = (date: string | Date) => {
    return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const OrderStatusIcon = {
    [OrderStatus.Pending]: Loader,
    [OrderStatus.Processing]: CookingPot,
    [OrderStatus.Rejected]: BookX,
    [OrderStatus.Delivered]: Truck,
    [OrderStatus.Paid]: HandCoins,
};

export const serverApiWrapper = async <T>(fn: () => Promise<T>) => {
    let result = null;
    try {
        result = await fn();
    } catch (error: any) {
        if (error.digest?.includes("NEXT_REDIRECT")) {
            throw error;
        }
    }
    return result;
};
