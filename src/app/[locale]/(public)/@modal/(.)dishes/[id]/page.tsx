import dishApiRequest from "@/apiRequests/dish";
import DishModal from "@/app/[locale]/(public)/@modal/(.)dishes/[id]/dish-modal";

import { formatCurrency, serverApiWrapper } from "@/lib/utils";
import Image from "next/image";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function InterceptingDishPage({ params }: Props) {
    const { id } = await params;
    const data = await serverApiWrapper(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload.data;

    return (
        <DishModal>
            {!dish && (
                <div>
                    <h1 className="text-2xl lg:text-3xl font-semibold">Món ăn không tồn tại</h1>
                </div>
            )}
            {dish && (
                <div className="space-y-4 container mx-auto">
                    <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
                    <div className="font-semibold">Giá: {formatCurrency(dish.price)}</div>

                    <div className="w-full  aspect-square overflow-hidden rounded-md mx-auto relative">
                        <Image src={dish.image} alt={dish.name} fill quality={100} className="object-cover" />
                    </div>

                    <p>{dish.description}</p>
                </div>
            )}
        </DishModal>
    );
}
