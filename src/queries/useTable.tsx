import tableApiRequest from "@/apiRequests/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () => useQuery({ queryKey: ["tables"], queryFn: tableApiRequest.list });

export const useGetTable = ({ number, enabled }: { number: number; enabled: boolean }) =>
    useQuery({
        queryKey: ["table", number],
        queryFn: () => tableApiRequest.getTable(number),
        enabled,
    });

export const useAddTableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tableApiRequest.addTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tables"],
            });
        },
    });
};

export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ number, ...body }: { number: number } & UpdateTableBodyType) =>
            tableApiRequest.updateTable(number, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tables"],
            });
        },
    });
};
export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tableApiRequest.deleteTable,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tables"],
            });
        },
    });
};
