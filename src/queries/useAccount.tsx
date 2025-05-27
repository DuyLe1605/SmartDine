import accountApiRequest from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

// Truyền thêm unique key để có thể tránh caching
export const useAccountMe = (uniqueKey?: any, onSuccess?: (data: AccountResType) => void) =>
    useQuery({
        queryKey: ["account-me", uniqueKey],
        queryFn: () =>
            accountApiRequest.getMe().then((res) => {
                if (onSuccess) {
                    onSuccess(res.payload);
                }
                return res;
            }),
    });

export const useUpdateMeMutation = () =>
    useMutation({
        mutationFn: accountApiRequest.updateMe,
    });
