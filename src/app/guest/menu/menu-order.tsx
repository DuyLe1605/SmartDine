"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useGetDishList } from "@/queries/useDish";
import { formatCurrency } from "@/lib/utils";
import Quantity from "@/app/guest/menu/quantity";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useState } from "react";

export default function MenuOrder() {
    const { data } = useGetDishList();
    const dishes = data?.payload.data ?? [];
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

    const totalPrice = orders.reduce((total, currentOrder) => {
        const currentPrice = dishes.find((dish) => dish.id === currentOrder.dishId)?.price ?? 0;

        return (total += currentOrder.quantity * currentPrice);
    }, 0);
    const handleChange = (dishId: number, quantity: number) => {
        setOrders((prevOrders) => {
            // Nếu quantity bằng không thì xóa khỏi danh sách gọi món
            if (quantity === 0) {
                return prevOrders.filter((order) => order.dishId !== dishId);
            }
            const index = orders.findIndex((order) => order.dishId === dishId);
            // Nếu không tìm thấy index tức có nghĩa là món mới => tiến hành thêm vào mảng
            if (index === -1) {
                return [...prevOrders, { dishId, quantity }];
            }

            const newOrders = [...orders];
            newOrders[index] = { ...newOrders[index], quantity };
            return newOrders;
        });
    };
    console.log(orders);
    console.log(totalPrice);
    return (
        <>
            {dishes.map((dish) => (
                <div key={dish.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className="object-cover w-[80px] h-[80px] rounded-md"
                        />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm">{dish.name}</h3>
                        <p className="text-xs">{dish.description}</p>
                        <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
                    </div>
                    <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                        <Quantity
                            onChange={(value) => handleChange(dish.id, value)}
                            value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                        />
                    </div>
                </div>
            ))}
            <div className="sticky bottom-0">
                <Button className="w-full justify-between">
                    <span>Giỏ hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}
