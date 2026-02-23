import { axiosClient } from "@/service/app-service";
import {
  TanamanApiResponse,
  TanamanQueryParams,
} from "@/types/dashboard/tableTanaman";

export const getAllDataTanaman = async (
  params: TanamanQueryParams = {},
): Promise<TanamanApiResponse> => {
  try {
    const queryParams = new URLSearchParams();

    // ✅ REQUIRED PARAMETERS - selalu ada
    queryParams.append(
      "poktan_id",
      params.poktan_id ? params.poktan_id.toString() : "undefined",
    );
    queryParams.append("limit", (params.limit || 10).toString());
    queryParams.append("page", (params.page || 1).toString());
    queryParams.append("sortBy", params.sortBy || "id");
    queryParams.append("sortType", params.sortType || "DESC");

    // ✅ SEARCH PARAMETER - pastikan selalu dikirim
    queryParams.append("search", params.search || "");

    // ✅ OPTIONAL PARAMETERS
    if (params.isExport !== undefined) {
      queryParams.append("isExport", params.isExport.toString());
    }

    const url = `/statistik?${queryParams.toString()}`;

    // ✅ DEBUG LOG
    console.log("🚀 API Request:", {
      url,
      params,
      hasSearch: !!params.search,
      searchTerm: params.search,
    });

    const response = await axiosClient.get(url);

    console.log("✅ API Response:", {
      dataCount: response.data?.data?.data?.length || 0,
      total: response.data?.data?.total || 0,
      searchTerm: params.search,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tanaman data:", {
      error: error as Error,
      params,
      searchTerm: params.search,
    });
    throw error;
  }
};
