import http from "@/lib/http";
import {
    AccountIdParamType,
    AccountListResType,
    AccountResType,
    ChangePasswordV2BodyType,
    ChangePasswordV2ResType,
    CreateEmployeeAccountBodyType,
    CreateGuestBodyType,
    CreateGuestResType,
    GetGuestListQueryParamsType,
    GetListGuestsResType,
    UpdateEmployeeAccountBodyType,
    UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import queryString from "query-string";

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
    list: () => http.get<AccountListResType>(prefix),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(prefix, body),
    getEmployee: (id: AccountIdParamType["id"]) => http.get<AccountResType>(`${prefix}/detail/${id}`),
    updateEmployee: (id: AccountIdParamType["id"], body: UpdateEmployeeAccountBodyType) =>
        http.put<AccountResType>(`${prefix}/detail/${id}`, body),
    deleteEmployee: (id: AccountIdParamType["id"]) => http.delete<AccountResType>(`${prefix}/detail/${id}`),
    getGuestList: (queryParams: GetGuestListQueryParamsType) =>
        http.get<GetListGuestsResType>(
            `${prefix}?${queryString.stringify({
                fromDate: queryParams.fromDate?.toISOString(),
                toDate: queryParams.toDate?.toISOString(),
            })}`
        ),

    createGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>(`${prefix}/guests`, body),
};

export default accountApiRequest;
