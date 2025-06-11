import orderApiRequest from "@/apiRequests/order";
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOrderListQuery = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: orderApiRequest.getOrderList,
    });
};

export const updateOrderMutation = () =>
    useMutation({
        mutationFn: ({ orderId, ...body }: { orderId: number } & UpdateOrderBodyType) =>
            orderApiRequest.updateOrder(orderId, body),
    });
