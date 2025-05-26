import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const authApiRequest = {
    login: (body: LoginBodyType) => http.post<LoginResType>("/api/auth/login", body, { baseUrl: "" }),
    serverLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
};

export default authApiRequest;
