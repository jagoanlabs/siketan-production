import { useQuery } from "@tanstack/react-query";

import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";
import { getPoktanDashboard } from "@/service/DashboardAdmin/index/dashboard-poktan";

export const useDashboardDataPotkan = (search: string, kecamatan?: string) => {
  return useQuery<DashoardDataPotkan[], Error>({
    queryKey: ["dashboardDataPotkan", search, kecamatan || ""],
    queryFn: () => getPoktanDashboard(search, kecamatan),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
