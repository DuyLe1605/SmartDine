"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGetGuestOrderListQuery } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import socket from "@/socket";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function OrderCart() {
    const { data, refetch } = useGetGuestOrderListQuery();
    const dishes = data?.payload.data || [];
    const totalPrice = dishes.reduce((total, currentDish) => {
        return (total += currentDish.dishSnapshot.price * currentDish.quantity);
    }, 0);

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
            refetch();
        }

        socket.on("update-order", onUpdateOrder);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return (
        <>
            {dishes.map((dish) => (
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
                {dishes.length === 0 ? (
                    <div>
                        <h2>Bạn chưa gọi món !</h2>
                        <Link href="/guest/menu">
                            <Button> Bấm để gọi ngay</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="w-full justify-between flex font-semibold text-xl">
                        <p>Tổng · {dishes.length} món</p>
                        <p>{formatCurrency(totalPrice)}</p>
                    </div>
                )}
            </div>
        </>
    );
}
