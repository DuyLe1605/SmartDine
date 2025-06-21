import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { getIdFromSlugUr, serverApiWrapper } from "@/lib/utils";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DishPage({ params }: Props) {
    // Từ Next 15, các Dynamic APIs trờ thành Asynchronous(Bất đồng bộ)
    const { slug } = await params;
    const id = getIdFromSlugUr(slug);
    const data = await serverApiWrapper(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload.data;

    return <DishDetail dish={dish} />;
}
