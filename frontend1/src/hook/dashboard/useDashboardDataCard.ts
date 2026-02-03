// hooks/useDashboardData.ts
import { useQuery } from "@tanstack/react-query";

import { getDashboardData } from "@/service/DashboardAdmin/index/dashboard-service";
import { DashboardCard } from "@/types/dashboard/dashboardCard";

export const useDashboardData = () => {
  return useQuery<DashboardCard, Error>({
    queryKey: ["dashboardData"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
