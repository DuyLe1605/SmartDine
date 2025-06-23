import dishApiRequest from "@/apiRequests/dish";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import envConfig from "@/config";
import { Locale } from "@/i18n/config";
import { generateSlugUrl, getIdFromSlugUr, serverApiWrapper } from "@/lib/utils";
import { baseOpenGraph } from "@/sharedMetadata";
import { getTranslations } from "next-intl/server";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: "DishDetail" });
    const id = getIdFromSlugUr(slug);
    const data = await serverApiWrapper(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload.data;
    if (!dish) {
        return {
            title: t("notFound"),
            description: t("notFound"),
        };
    }
    const url = (localeInput: Locale) =>
        `${envConfig.NEXT_PUBLIC_URL}/${localeInput}/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`;

    return {
        title: dish.name,
        description: dish.description,
        openGraph: {
            ...baseOpenGraph,
            title: dish.name,
            description: dish.description,
            url: url(locale),
        },
        alternates: {
            canonical: url(locale),
            languages: {
                en: url("en"),
                vi: url("vi"),
            },
        },
    };
}

export default async function DishPage({ params }: Props) {
    // Từ Next 15, các Dynamic APIs trờ thành Asynchronous(Bất đồng bộ)
    const { slug } = await params;
    const id = getIdFromSlugUr(slug);
    const data = await serverApiWrapper(() => dishApiRequest.getDish(Number(id)));
    const dish = data?.payload.data;

    return <DishDetail dish={dish} />;
}
