import { useQuery } from "@tanstack/react-query";

import { getAllDataTanaman } from "@/service/DashboardAdmin/index/dashboard-table";
import {
  TanamanApiResponse,
  TanamanQueryParams,
} from "@/types/dashboard/tableTanaman";

export const useTanamanData = (params: TanamanQueryParams = {}) => {
  // ✅ QUERY KEY - include search in query key untuk proper caching
  const queryKey = [
    "tanamanData",
    {
      poktan_id: params.poktan_id || "undefined",
      limit: params.limit || 10,
      page: params.page || 1,
      sortBy: params.sortBy || "id",
      sortType: params.sortType || "DESC",
      search: params.search || "", // ✅ Include search in cache key
      isExport: params.isExport || false,
    },
  ];

  console.log("🔧 TanStack Query Key:", queryKey);

  return useQuery<TanamanApiResponse, Error>({
    queryKey,
    queryFn: () => getAllDataTanaman(params),
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on client errors (4xx)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 2;
    },
    staleTime: 30 * 1000, // 30 seconds

    // ✅ ENABLED - always enabled, even with empty search
    enabled: true,

    // ✅ KEEP PREVIOUS DATA - smooth transition saat search

    // ✅ REFETCH ON SEARCH CHANGE
    refetchOnMount: true,
  });
};
