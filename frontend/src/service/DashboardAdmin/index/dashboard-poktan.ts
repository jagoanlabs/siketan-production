import { axiosClient } from "@/service/app-service";
import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";

export const getPoktanDashboard = async (
  search: string,
  kecamatan?: string,
): Promise<DashoardDataPotkan[]> => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (kecamatan) params.append("kecamatan", kecamatan);

    const response = await axiosClient.get(`/search/poktan?${params.toString()}`);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
