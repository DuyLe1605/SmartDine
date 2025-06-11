import http from "@/lib/http";
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
    GuestCreateOrdersBodyType,
    GuestCreateOrdersResType,
    GuestGetOrdersResType,
    GuestLoginBodyType,
    GuestLoginResType,
} from "@/schemaValidations/guest.schema";

const prefix = "/guest";
const guestApiRequest = {
    refreshTokenRequest: null as Promise<{ status: number; payload: RefreshTokenResType }> | null,
    login: (body: GuestLoginBodyType) =>
        http.post<GuestLoginResType>(`/api${prefix}/auth/login`, body, { baseUrl: "" }),
    serverLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(`${prefix}/auth/login`, body),
    logout: () => http.post<MessageResType>(`/api${prefix}/auth/logout`, null, { baseUrl: "" }),
    serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post<MessageResType>(
            `${prefix}/auth/logout`,
            { refreshToken: body.refreshToken },
            {
                // Vì backend yêu cầu phải truyền accessToken thông qua Authorization
                headers: { Authorization: `Bearer ${body.accessToken}` },
            }
        ),
    async refreshToken() {
        if (this.refreshTokenRequest) return this.refreshTokenRequest;

        this.refreshTokenRequest = http.post<RefreshTokenResType>(`/api${prefix}/auth/refresh-token`, null, {
            baseUrl: "",
        });
        const result = await this.refreshTokenRequest;
        this.refreshTokenRequest = null;
        return result;
    },
    serverRefreshToken: (body: RefreshTokenBodyType) =>
        http.post<RefreshTokenResType>(`${prefix}/auth/refresh-token`, body),
    order: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>(`${prefix}/orders`, body),
    getOrderList: () => http.get<GuestGetOrdersResType>(`${prefix}/orders`),
};

export default guestApiRequest;
