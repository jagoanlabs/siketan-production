import { axiosClient } from "@/service/app-service";
import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";

export const getPoktanDashboard = async (
  search: string,
): Promise<DashoardDataPotkan[]> => {
  try {
    const response = await axiosClient.get("/search/poktan?search=" + search);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
