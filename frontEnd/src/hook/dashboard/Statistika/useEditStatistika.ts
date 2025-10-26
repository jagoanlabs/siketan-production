// hook/dashboard/Statistika/useEditStatistika.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  StatistikaDetailResponse,
  KelompokTaniResponse,
  EditStatistikaFormData,
  UpdateStatistikaPayload,
} from "@/types/Statistika/editStatistika.d";

// Hook untuk get statistika detail by ID
export const useStatistikaDetail = (id: number | string) => {
  return useQuery({
    queryKey: ["statistika-detail", id],
    queryFn: async (): Promise<StatistikaDetailResponse> => {
      const response = await axiosClient.get(`/statistik/${id}`);

      return response.data;
    },
    enabled: !!id,
    staleTime: 0, // Always refetch when component mounts
    // cacheTime: 0   // Don't cache the result
  });
};

// Hook untuk get kelompok tani detail by ID
export const useKelompokTaniDetail = (id: number) => {
  return useQuery({
    queryKey: ["kelompok-tani-detail", id],
    queryFn: async (): Promise<KelompokTaniResponse> => {
      const response = await axiosClient.get(`/kelompok-tani/${id}`);

      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    // cacheTime: 10 * 60 * 1000   // Keep in cache for 10 minutes
  });
};

// Hook untuk update statistika
export const useUpdateStatistika = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      kelompokData,
    }: {
      id: number;
      data: EditStatistikaFormData;
      kelompokData: any;
    }): Promise<any> => {
      // Transform form data to API payload format sesuai requirement
      const payload: UpdateStatistikaPayload = {
        id: data.id,
        kategori: data.kategoriTanaman,
        komoditas:
          data.jenisTanaman === "semusim"
            ? data.komoditasSemusim
            : data.komoditasTahunan,
        periodeTanam: data.periodeTanam,
        luasLahan: data.luasLahanTanam,
        prakiraanLuasPanen: data.prakiraanLuasPanen,
        prakiraanHasilPanen: data.prakiraanHasilPanen,
        prakiraanBulanPanen: data.prakiraanBulanPanen,
        realisasiLuasPanen: data.realisasiLuasPanen,
        realisasiHasilPanen: data.realisasiHasilPanen,
        realisasiBulanPanen: data.realisasiBulanPanen || null,
        fk_kelompokId: data.fk_kelompokId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        kelompok: {
          id: kelompokData.id,
          gapoktan: kelompokData.gapoktan,
          namaKelompok: kelompokData.namaKelompok,
          desa: kelompokData.desa,
          kecamatan: kelompokData.kecamatan,
          penyuluh: kelompokData.penyuluh,
          createdAt: kelompokData.createdAt,
          updatedAt: kelompokData.updatedAt,
          kecamatanId: kelompokData.kecamatanId,
          desaId: kelompokData.desaId,
        },
      };

      const response = await axiosClient.put(`/statistik/${id}`, payload);

      return response.data;
    },
    onSuccess: (variables) => {
      toast.success("Data statistika berhasil diupdate!");

      queryClient.invalidateQueries({
        queryKey: ["tanaman-data"], // Sesuaikan dengan key di useTanamanData
        exact: false,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
      queryClient.invalidateQueries({
        queryKey: ["statistika-detail", variables.id],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengupdate data statistika";

      toast.error(message);
      console.error("Update error:", error);
    },
  });
};
