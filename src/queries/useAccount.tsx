import accountApiRequest from "@/apiRequests/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useQuery } from "@tanstack/react-query";

// Truyền thêm unique key để có thể tránh caching
export const useAccountProfile = (uniqueKey?: any, onSuccess?: (data: AccountResType) => void) =>
    useQuery({
        queryKey: ["account-profile", uniqueKey],
        queryFn: () =>
            accountApiRequest.getProfile().then((res) => {
                if (onSuccess) {
                    onSuccess(res.payload);
                }
                return res;
            }),
    });
