import OrderCart from "@/app/[locale]/guest/orders/order-cart";

export default function OrdersPage() {
    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">🍕 Giỏ hàng</h1>
            <OrderCart />
        </div>
    );
}
