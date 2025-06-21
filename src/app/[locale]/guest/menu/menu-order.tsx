"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useGetDishList } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useState } from "react";
import { DishStatus } from "@/constants/type";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import Quantity from "@/app/[locale]/guest/menu/quantity";
import { useTranslations } from "next-intl";

export default function MenuOrder() {
    const t = useTranslations("GuestMenu.orders");
    const router = useRouter();
    const { data } = useGetDishList();
    const dishes = data?.payload.data ?? [];
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

    const totalPrice = orders.reduce((total, currentOrder) => {
        const currentPrice = dishes.find((dish) => dish.id === currentOrder.dishId)?.price ?? 0;

        return (total += currentOrder.quantity * currentPrice);
    }, 0);
    const guestOrderMutation = useGuestOrderMutation();

    const handleChange = (dishId: number, quantity: number) => {
        setOrders((prevOrders) => {
            // Nếu quantity bằng không thì xóa khỏi danh sách gọi món
            if (quantity === 0) {
                return prevOrders.filter((order) => order.dishId !== dishId);
            }
            const index = prevOrders.findIndex((order) => order.dishId === dishId);
            // Nếu không tìm thấy index tức có nghĩa là món mới => tiến hành thêm vào mảng
            if (index === -1) {
                return [...prevOrders, { dishId, quantity }];
            }

            const newOrders = [...orders];
            newOrders[index] = { ...newOrders[index], quantity };
            return newOrders;
        });
    };

    const handleOrder = async () => {
        if (guestOrderMutation.isPending) return;
        try {
            const res = await guestOrderMutation.mutateAsync(orders);
            toast(res.payload.message);
            router.push("/guest/orders");
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    return (
        <>
            {dishes
                .filter((dish) => dish.status !== DishStatus.Hidden)
                .map((dish) => (
                    <div
                        key={dish.id}
                        className={cn("flex gap-4", {
                            "pointer-events-none": dish.status === DishStatus.Unavailable,
                        })}
                    >
                        <div className="flex-shrink-0 relative ">
                            {dish.status === DishStatus.Unavailable && (
                                <div className="absolute inset-0 z-10 bg-background/70 flex  items-center justify-center select-none rounded-md border-1 border-foreground">
                                    <span className="text-foreground text-md font-bold ">{t("outOfStock")}</span>
                                </div>
                            )}

                            <Image
                                src={dish.image}
                                alt={dish.name}
                                height={100}
                                width={100}
                                quality={100}
                                className="object-cover w-[80px] h-[80px] rounded-md relative"
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
                <Button className="w-full justify-between" disabled={orders.length === 0} onClick={handleOrder}>
                    <span>
                        {t("order")} · {orders.length} {t("item")}
                    </span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}
