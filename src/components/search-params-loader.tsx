import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

type SearchParamsLoaderProps = {
    onParamsReceived: (params: ReadonlyURLSearchParams) => void;
};

function SearchParamsLoader(props: SearchParamsLoaderProps) {
    return (
        <Suspense>
            <Suspendend {...props} />
        </Suspense>
    );
}

function Suspendend({ onParamsReceived }: SearchParamsLoaderProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        onParamsReceived(searchParams);
    });

    return null;
}

export const useSearchParamsLoader = () => {
    const [searchParams, setSearchParams] = useState<ReadonlyURLSearchParams | null>(null);
    return { searchParams, setSearchParams };
};

export default SearchParamsLoader;

// Chúng ta nên thay đổi những page nào thực sự cần Static Rendering. Ví dụ như những page public cần SEO như login, trang chủ,...
