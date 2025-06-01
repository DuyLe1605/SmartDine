import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
    refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,
    login: (body: LoginBodyType) => http.post<LoginResType>("/api/auth/login", body, { baseUrl: "" }),
    serverLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
    logout: () => http.post<MessageResType>("/api/auth/logout", null, { baseUrl: "" }),
    serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post<MessageResType>(
            "/auth/logout",
            { refreshToken: body.refreshToken },
            {
                // Vì backend yêu cầu phải truyền accessToken thông qua Authorization
                headers: { Authorization: `Bearer ${body.accessToken}` },
            }
        ),
    async refreshToken() {
        if (this.refreshTokenRequest) return this.refreshTokenRequest;

        this.refreshTokenRequest = http.post<RefreshTokenResType>("/api/auth/refresh-token", null, { baseUrl: "" });
        const result = await this.refreshTokenRequest;
        this.refreshTokenRequest = null;
        return result;
    },
    serverRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>("/auth/refresh-token", body),
};

export default authApiRequest;
