import accountApiRequest from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

// Truyền thêm unique key để có thể tránh caching
export const useAccountMe = (body: { uniqueKey?: any; onSuccess?: (data: AccountResType) => void }) =>
    useQuery({
        queryKey: ["account-me", body.uniqueKey],
        queryFn: () =>
            accountApiRequest.getMe().then((res) => {
                if (body.onSuccess) {
                    body.onSuccess(res.payload);
                }
                return res;
            }),
    });

export const useUpdateMeMutation = () =>
    useMutation({
        mutationFn: accountApiRequest.updateMe,
    });

export const useChangePasswordMutation = () =>
    useMutation({
        mutationFn: accountApiRequest.changePasswordV2,
    });
