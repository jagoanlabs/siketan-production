// hooks/useEditKelompokTani.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/service/app-service";
import {
  DesaResponse,
  KecamatanResponse,
  KelompokDetailResponse,
  UpdateKelompokData,
  UpdateKelompokResponse,
} from "@/types/KelompokTani/editKelompokTani";

const fetchKelompokDetail = async (
  id: string,
): Promise<KelompokDetailResponse> => {
  const { data } = await axiosClient.get(`/kelompok/${id}`);

  return data;
};

const fetchKecamatanList = async (): Promise<KecamatanResponse> => {
  const { data } = await axiosClient.get("/wilayah/kecamatan");

  return data;
};

const fetchDesaByKecamatan = async (
  kecamatanId: number,
): Promise<DesaResponse> => {
  const { data } = await axiosClient.get(
    `/wilayah/desa?kecamatanId=${kecamatanId}`,
  );

  return data;
};

const updateKelompok = async (
  id: string,
  updateData: UpdateKelompokData,
): Promise<UpdateKelompokResponse> => {
  const { data } = await axiosClient.put(`/kelompok/${id}`, updateData);

  return data;
};

export const useKelompokDetail = (id: string) => {
  return useQuery({
    queryKey: ["kelompok-detail", id],
    queryFn: () => fetchKelompokDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

export const useKecamatanList = () => {
  return useQuery({
    queryKey: ["kecamatan-list"],
    queryFn: fetchKecamatanList,
    staleTime: 30 * 60 * 1000, // 30 minutes - data wilayah jarang berubah
    refetchOnWindowFocus: false,
  });
};

export const useDesaByKecamatan = (kecamatanId: number | null) => {
  return useQuery({
    queryKey: ["desa-by-kecamatan", kecamatanId],
    queryFn: () => fetchDesaByKecamatan(kecamatanId!),
    enabled: !!kecamatanId && kecamatanId > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateKelompok = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKelompokData }) =>
      updateKelompok(id, data),
    onSuccess: (data, { id }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["kelompok-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["kelompok-tani"] });
      console.log("Update success:", data);
    },
    onError: (error: any) => {
      console.error("Update error:", error);
    },
  });
};
