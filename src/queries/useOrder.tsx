import orderApiRequest from "@/apiRequests/order";
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
    return useQuery({
        queryKey: ["orders", queryParams],
        queryFn: () => orderApiRequest.getOrderList(queryParams),
    });
};

export const useGetOrderQuery = ({ id }: { id: number }) =>
    useQuery({ queryKey: ["order", id], queryFn: () => orderApiRequest.getOrder(id), enabled: Boolean(id) });

export const updateOrderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, ...body }: { orderId: number } & UpdateOrderBodyType) =>
            orderApiRequest.updateOrder(orderId, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
    });
};
