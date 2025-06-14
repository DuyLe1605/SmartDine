"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/constants/type";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGetGuestOrderListQuery } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import socket from "@/socket";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderCart() {
    const { data, refetch } = useGetGuestOrderListQuery();
    const orders = data?.payload.data || [];
    const { unPaid, paid } = orders.reduce(
        (total, currentDish) => {
            // Chưa thanh toán

            if (
                currentDish.status === OrderStatus.Delivered ||
                currentDish.status === OrderStatus.Pending ||
                currentDish.status === OrderStatus.Processing
            )
                return {
                    ...total,
                    unPaid: {
                        total: total.unPaid.total + currentDish.dishSnapshot.price * currentDish.quantity,
                        quantity: total.unPaid.quantity + currentDish.quantity,
                    },
                };

            // Các đơn bị từ chối
            if (currentDish.status === OrderStatus.Rejected) return total;

            // Các đơn đã thanh toán

            return {
                ...total,
                paid: {
                    total: total.paid.total + currentDish.dishSnapshot.price * currentDish.quantity,
                    quantity: total.paid.quantity + currentDish.quantity,
                },
            };
        },
        { unPaid: { total: 0, quantity: 0 }, paid: { total: 0, quantity: 0 } }
    );

    // Socket IO
    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log("socket.id: ", socket.id);
        }

        function onDisconnect() {
            console.log("disconnected");
        }

        function onUpdateOrder(data: UpdateOrderResType["data"]) {
            const {
                dishSnapshot: { name },
            } = data;
            toast(`Món ${name} được cập nhật sang trạng thái "${getVietnameseOrderStatus(data.status)}"`);
            refetch();
        }

        socket.on("update-order", onUpdateOrder);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            // Nhớ phải clean up
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("update-order", onUpdateOrder);
        };
    }, [refetch]);

    return (
        <>
            {orders.map((dish) => (
                <div key={dish.id} className="flex gap-4 ">
                    <div className="flex-shrink-0">
                        <Image
                            src={dish.dishSnapshot.image}
                            alt={dish.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={100}
                            className="object-cover w-[80px] h-[80px] rounded-md"
                        />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm">{dish.dishSnapshot.name}</h3>
                        <p className="text-xs">{dish.dishSnapshot.description}</p>
                        <p className="text-xs font-semibold flex items-end gap-2">
                            {formatCurrency(dish.dishSnapshot.price)}{" "}
                            <span className="text-[14px] text-shadow-pink-300 text-shadow-md">x</span>
                            {dish.quantity}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Badge variant="outline">{getVietnameseOrderStatus(dish.status)}</Badge>
                    </div>
                </div>
            ))}
            <div className="sticky bottom-0">
                {orders.length === 0 ? (
                    <div>
                        <h2>Bạn chưa gọi món !</h2>
                        <Link href="/guest/menu">
                            <Button> Bấm để gọi ngay</Button>
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="w-full justify-between flex font-semibold text-xl">
                            <p>Chưa thanh toán · {unPaid.quantity} món</p>
                            <p>{formatCurrency(unPaid.total)}</p>
                        </div>
                        <div className="w-full justify-between flex font-semibold text-xl">
                            <p>Đã thanh toán · {paid.quantity} món</p>
                            <p>{formatCurrency(paid.total)}</p>
                        </div>
                        <div className="my-2 bg-white h-[1px] " />
                        <div className="w-full justify-between flex font-semibold text-xl">
                            <p>Tổng cộng · {paid.quantity + unPaid.quantity} món</p>
                            <p>{formatCurrency(paid.total + unPaid.total)}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
