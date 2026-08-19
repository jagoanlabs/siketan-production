import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/service/app-service";
import {
  KelompokTaniQueryParams,
  PublicKelompokResponse,
  PublicStatistikKelompokResponse,
} from "@/types/KelompokTani/kelompokTani";

const fetchPublicKelompokData = async (
  params: KelompokTaniQueryParams,
): Promise<PublicKelompokResponse> => {
  const { data } = await axiosClient.get("/kelompok/public", { params });

  return data;
};

export const usePublicKelompok = (params: KelompokTaniQueryParams) => {
  return useQuery({
    queryKey: ["publicKelompok", params],
    queryFn: () => fetchPublicKelompokData(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

export const usePublicStatistikKelompok = () => {
  return useQuery({
    queryKey: ["publicStatistikKelompok"],
    queryFn: async (): Promise<PublicStatistikKelompokResponse> => {
      const { data } = await axiosClient.get("/kelompok/public-statistik");

      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
