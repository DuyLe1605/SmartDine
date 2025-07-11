import accountApiRequest from "@/apiRequests/account";
import {
    AccountResType,
    GetGuestListQueryParamsType,
    UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Truyền thêm unique key để có thể tránh caching
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const useGetAccountList = () => useQuery({ queryKey: ["accounts"], queryFn: accountApiRequest.list });

// Dùng như vậy nghĩa là nó sẽ lấy ra id từ obj truyền vào, để lỡ như sau này obj có nhiều thuộc tính thì k bị lỗi
export const useGetAccount = ({ id, enabled }: { id: number; enabled: boolean }) =>
    useQuery({ queryKey: ["accounts", id], queryFn: () => accountApiRequest.getEmployee(id), enabled });

export const useAddAccountMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });
        },
    });
};
export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...body }: { id: number } & UpdateEmployeeAccountBodyType) =>
            accountApiRequest.updateEmployee(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });
        },
    });
};
export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountApiRequest.deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });
        },
    });
};

// Guest
export const useAddGuestMutation = () => useMutation({ mutationFn: accountApiRequest.createGuest });

export const useGuestListQuery = (queryParams: GetGuestListQueryParamsType) =>
    useQuery({
        queryKey: ["guest", queryParams],
        queryFn: () => accountApiRequest.getGuestList(queryParams),
    });
