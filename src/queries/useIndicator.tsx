import indicatorApiRequest from "@/apiRequests/indicator";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetIndicatorQuery = (queryParams: DashboardIndicatorQueryParamsType) =>
    useQuery({ queryKey: ["indicators", queryParams], queryFn: () => indicatorApiRequest.getData(queryParams) });
