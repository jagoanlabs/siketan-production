import { axiosClient } from "@/service/app-service";
import { DashboardCard } from "@/types/dashboard/dashboardCard";

export const getDashboardData = async (): Promise<DashboardCard> => {
  try {
    const response = await axiosClient.get("/dashboard");

    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
