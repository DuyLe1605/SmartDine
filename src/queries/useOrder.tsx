import orderApiRequest from "@/apiRequests/order";
import {
    GetOrdersQueryParamsType,
    PayGuestOrdersBodyType,
    UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
    return useQuery({
        queryKey: ["orders", queryParams],
        queryFn: () => orderApiRequest.getOrderList(queryParams),
    });
};

export const useGetOrderDetailQuery = ({ id, enabled }: { id: number; enabled: boolean }) =>
    useQuery({ queryKey: ["order", id], queryFn: () => orderApiRequest.getOrder(id), enabled });

export const useUpdateOrderMutation = () => {
    return useMutation({
        mutationFn: ({ orderId, ...body }: { orderId: number } & UpdateOrderBodyType) =>
            orderApiRequest.updateOrder(orderId, body),
    });
};

export const usePayOrderMutation = () => {
    return useMutation({
        mutationFn: orderApiRequest.pay,
    });
};
