// services/tanaman-petani.service.ts
import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/service/app-service";
import {
  DataTanamanTopResponse,
  TanamanPetaniParams,
} from "@/types/komoditas-tertinggi";

export const topKomoditasApi = {
  // Get data komoditas tertinggi (prakiraan/realisasi) dari dataTanaman
  getTopKomoditas: async (
    params: TanamanPetaniParams,
  ): Promise<DataTanamanTopResponse> => {
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.append("type", params.type);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await axiosClient.get<DataTanamanTopResponse>(
      `/top-komoditas?${queryParams.toString()}`,
    );

    return response.data;
  },
};

export const useTopKomoditas = (params: TanamanPetaniParams) => {
  return useQuery({
    queryKey: ["top-komoditas", params],
    queryFn: () => topKomoditasApi.getTopKomoditas(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
