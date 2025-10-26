// services/tanaman-petani.service.ts
import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/service/app-service";
import {
  TanamanPetaniResponse,
  TanamanPetaniParams,
} from "@/types/komoditas-tertinggi";

export const tanamanPetaniApi = {
  // Get data tanaman petani dengan pagination dan search
  getTanamanPetani: async (
    params: TanamanPetaniParams,
  ): Promise<TanamanPetaniResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await axiosClient.get<TanamanPetaniResponse>(
      `/tanaman-petani?${queryParams.toString()}`,
    );

    return response.data;
  },
};

export const useKategoriTanamanTertinggi = (params: TanamanPetaniParams) => {
  return useQuery({
    queryKey: ["tanaman-petani", params],
    queryFn: () => tanamanPetaniApi.getTanamanPetani(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
