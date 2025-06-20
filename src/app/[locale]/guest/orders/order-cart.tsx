"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/constants/type";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGetGuestOrderListQuery, useGuestLogoutMutation } from "@/queries/useGuest";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema";

import useAppStore from "@/zustand/useAppStore";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderCart() {
    const { data, refetch } = useGetGuestOrderListQuery();
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);
    const socket = useAppStore((state) => state.socket);
    const { mutateAsync } = useGuestLogoutMutation();

    const router = useRouter();
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
        if (socket?.connected) {
            onConnect();
        }

        function onConnect() {
            console.log("socket.id: ", socket?.id);
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

        function onPayment(data: PayGuestOrdersResType["data"]) {
            toast(
                <div className="flex gap-2 items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex flex-col">
                        <span className="font-medium">Thanh toán thành công</span>
                        <span className="text-xs text-gray-500">
                            Nhà hàng Smart Dine xin cảm ơn và hẹn gặp lại quý khách !
                        </span>
                    </div>
                </div>,
                { duration: 5000 }
            );
            toast("Hệ thống sẽ tự động đăng xuất bạn ra khỏi nhà hàng ");
            refetch();

            setTimeout(async () => {
                await mutateAsync();
                setRole();
                disconnectSocket();
                router.push("/");
            }, 1000 * 10);
        }

        socket?.on("update-order", onUpdateOrder);
        socket?.on("connect", onConnect);
        socket?.on("disconnect", onDisconnect);
        socket?.on("payment", onPayment);
        return () => {
            // Nhớ phải clean up
            socket?.off("connect", onConnect);
            socket?.off("disconnect", onDisconnect);
            socket?.off("update-order", onUpdateOrder);
            socket?.off("payment", onPayment);
        };
    }, [refetch, mutateAsync, setRole, router, disconnectSocket, socket]);

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
                    <div className="bg-background/88 border-3 border-foreground/70 rounded-md  px-2 py-4">
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
