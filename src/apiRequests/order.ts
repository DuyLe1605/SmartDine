import http from "@/lib/http";
import {
    GetOrderDetailResType,
    GetOrdersResType,
    PayGuestOrdersBodyType,
    PayGuestOrdersResType,
    UpdateOrderBodyType,
    UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const prefix = "/orders";
const orderApiRequest = {
    getOrderList: () => http.get<GetOrdersResType>(prefix),
    getOrder: (orderId: number) => http.get<GetOrderDetailResType>(`${prefix}/${orderId}`),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
        http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),
    pay: (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>(`${prefix}/pay`, body),
};

export default orderApiRequest;
