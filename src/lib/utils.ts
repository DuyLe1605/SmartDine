import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";

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

const isClient = typeof window !== undefined;

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
