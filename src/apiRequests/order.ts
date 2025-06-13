import http from "@/lib/http";
import queryString from "query-string";
import {
    GetOrderDetailResType,
    GetOrdersQueryParamsType,
    GetOrdersResType,
    PayGuestOrdersBodyType,
    PayGuestOrdersResType,
    UpdateOrderBodyType,
    UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const prefix = "/orders";
const orderApiRequest = {
    // Nên truyền kiểu IO String
    getOrderList: (queryParams: GetOrdersQueryParamsType) =>
        http.get<GetOrdersResType>(
            `${prefix}?${queryString.stringify({
                fromDate: queryParams.fromDate?.toISOString(),
                toDate: queryParams.toDate?.toISOString(),
            })}`
        ),
    getOrder: (orderId: number) => http.get<GetOrderDetailResType>(`${prefix}/${orderId}`),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
        http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),
    pay: (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>(`${prefix}/pay`, body),
};

export default orderApiRequest;
