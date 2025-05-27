import accountApiRequest from "@/apiRequests/account";
import { useQuery } from "@tanstack/react-query";

export const useAccountProfile = () =>
    useQuery({
        queryKey: ["account-profile"],
        queryFn: accountApiRequest.getProfile,
    });
