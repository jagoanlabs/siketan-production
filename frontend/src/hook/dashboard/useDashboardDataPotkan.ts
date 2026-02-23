import { useQuery } from "@tanstack/react-query";

import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";
import { getPoktanDashboard } from "@/service/DashboardAdmin/index/dashboard-poktan";

export const useDashboardDataPotkan = (search: string) => {
  return useQuery<DashoardDataPotkan[], Error>({
    queryKey: ["dashboardDataPotkan", search],
    queryFn: () => getPoktanDashboard(search),
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
