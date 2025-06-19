import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
    // I18N
    const t = await getTranslations("HomePage");

    let dishList: DishListResType["data"] = [];
    try {
        const result = await dishApiRequest.list();
        const { data } = result.payload;
        dishList = data;
    } catch (error: any) {
        console.error(error.message ?? "Có lỗi xảy ra");
    }

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
                <Image
                    src="/banner.png"
                    width={400}
                    height={200}
                    quality={100}
                    alt="Banner"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
                    <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">{t("title")}</h1>
                    <p className="text-center text-sm sm:text-base mt-4">{t("desc")}</p>
                </div>
            </div>
            <section className="space-y-10 py-16">
                <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {dishList &&
                        dishList.map((item, index) => (
                            <div className="flex gap-4 w" key={index}>
                                <div className="flex-shrink-0">
                                    <Link href={`/dishes/${item.id}`}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={150}
                                            height={150}
                                            className="w-[150px] h-[150px] object-cover rounded-md"
                                        />
                                    </Link>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <p className="">{item.description}</p>
                                    <p className="font-semibold">{formatCurrency(item.price)}</p>
                                </div>
                            </div>
                        ))}
                    {!dishList &&
                        Array(4)
                            .fill(0)
                            .map((_, index) => (
                                <div className="flex gap-4 w" key={index}>
                                    <Skeleton className="w-[150px] h-[150px] rounded-md"></Skeleton>
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-[150px]" />
                                        <Skeleton className="h-4 w-[200px] mt-5" />
                                        <Skeleton className="h-4 w-[170px]" />
                                    </div>
                                </div>
                            ))}
                </div>
            </section>
        </div>
    );
}
