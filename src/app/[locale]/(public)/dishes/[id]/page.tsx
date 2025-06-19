import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[id]/dish-detail";
import { serverApiWrapper } from "@/lib/utils";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function DishPage({ params }: Props) {
    // Từ Next 15, các Dynamic APIs trờ thành Asynchronous(Bất đồng bộ)
    const { id } = await params;
    const data = await serverApiWrapper(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload.data;

    return <DishDetail dish={dish} />;
}
