import http from "@/lib/http";
import {
    AccountResType,
    ChangePasswordV2BodyType,
    ChangePasswordV2ResType,
    UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const prefix = "/accounts";
const accountApiRequest = {
    getMe: () => http.get<AccountResType>(`${prefix}/me`),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(`${prefix}/me`, body),
    changePasswordV2: (body: ChangePasswordV2BodyType) =>
        http.put<ChangePasswordV2ResType>(`/api${prefix}/change-password-v2`, body, { baseUrl: "" }),
    serverChangePasswordV2: (accessToken: string, body: ChangePasswordV2BodyType) =>
        http.put<ChangePasswordV2ResType>(`${prefix}/change-password-v2`, body, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }),
};

export default accountApiRequest;
