// hook/dashboard/Statistika/useRealisasiStatistika.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  RealisasiStatistikaFormData,
  UpdateRealisasiPayload,
} from "@/types/Statistika/realsiasiStatistika";
import { StatistikaDetailData } from "@/types/Statistika/editStatistika.d";
import { KelompokTaniDetailData } from "@/types/Statistika/detailStatistika";
import axiosClient from "@/service/app-service";

// Hook untuk update realisasi statistika
export const useUpdateRealisasiStatistika = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      realisasiData,
      statistikaData,
      kelompokData,
    }: {
      id: number;
      realisasiData: RealisasiStatistikaFormData;
      statistikaData: StatistikaDetailData;
      kelompokData: KelompokTaniDetailData;
    }): Promise<any> => {
      // Transform form data to API payload format sesuai requirement
      const payload: UpdateRealisasiPayload = {
        id: statistikaData.id,
        kategori: statistikaData.kategori,
        komoditas: statistikaData.komoditas,
        periodeTanam: statistikaData.periodeTanam,
        luasLahan: statistikaData.luasLahan,
        prakiraanLuasPanen: statistikaData.prakiraanLuasPanen,
        prakiraanHasilPanen: statistikaData.prakiraanHasilPanen,
        prakiraanBulanPanen: statistikaData.prakiraanBulanPanen,
        realisasiLuasPanen: realisasiData.realisasiLuasPanen,
        realisasiHasilPanen: realisasiData.realisasiHasilPanen,
        realisasiBulanPanen: realisasiData.realisasiBulanPanen || null,
        fk_kelompokId: statistikaData.fk_kelompokId,
        createdAt: statistikaData.createdAt,
        updatedAt: statistikaData.updatedAt,
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
    onSuccess: () => {
      toast.success("Data realisasi berhasil disimpan!");

      queryClient.invalidateQueries({
        queryKey: ["tanaman-data"], // Sesuaikan dengan key di useTanamanData
        exact: false,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
      queryClient.invalidateQueries({ queryKey: ["statistika-detail"] });
      queryClient.invalidateQueries({
        queryKey: ["statistika-detail-complete"],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal menyimpan data realisasi";

      toast.error(message);
      console.error("Update realisasi error:", error);
    },
  });
};
