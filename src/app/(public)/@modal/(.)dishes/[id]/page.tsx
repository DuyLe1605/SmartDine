import dishApiRequest from "@/apiRequests/dish";
import DishModal from "@/app/(public)/@modal/(.)dishes/[id]/dish-modal";

import { formatCurrency, serverApiWrapper } from "@/lib/utils";
import Image from "next/image";

interface Props {
    params: {
        id: string;
    };
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
                    <Image
                        src={dish.image}
                        width={700}
                        height={700}
                        quality={100}
                        alt={dish.name}
                        className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
                    />
                    <p>{dish.description}</p>
                </div>
            )}
        </DishModal>
    );
}
