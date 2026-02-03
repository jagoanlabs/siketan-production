// hook/dashboard/Statistika/useDetailStatistika.ts
import { useQuery } from "@tanstack/react-query";

import {
  StatistikaDetailResponse,
  KelompokTaniDetailResponse,
  DetailStatistikaDisplayData,
  StatistikaMetrics,
} from "@/types/Statistika/detailStatistika.d";
import axiosClient from "@/service/app-service";

// Hook untuk get statistika detail by ID
export const useStatistikaDetailView = (id: number | string) => {
  return useQuery({
    queryKey: ["statistika-detail-view", id],
    queryFn: async (): Promise<StatistikaDetailResponse> => {
      const response = await axiosClient.get(`/statistik/${id}`);

      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    // cacheTime: 10 * 60 * 1000   // Keep in cache for 10 minutes
  });
};

// Hook untuk get kelompok tani detail by ID
export const useKelompokTaniDetailView = (id: number) => {
  return useQuery({
    queryKey: ["kelompok-tani-detail-view", id],
    queryFn: async (): Promise<KelompokTaniDetailResponse> => {
      const response = await axiosClient.get(`/kelompok-tani/${id}`);

      return response.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    // cacheTime: 30 * 60 * 1000   // Keep in cache for 30 minutes
  });
};

// Hook untuk get combined detail data dengan metrics calculation
export const useStatistikaDetailComplete = (id: number | string) => {
  const statistikaQuery = useStatistikaDetailView(id);
  const kelompokQuery = useKelompokTaniDetailView(
    statistikaQuery.data?.data?.fk_kelompokId || 0,
  );

  return useQuery({
    queryKey: ["statistika-detail-complete", id],
    queryFn: async (): Promise<DetailStatistikaDisplayData> => {
      if (!statistikaQuery.data?.data || !kelompokQuery.data?.kelompokTani) {
        throw new Error("Missing required data");
      }

      const statistika = statistikaQuery.data.data;
      const kelompokTani = kelompokQuery.data.kelompokTani;

      // Calculate metrics
      const metrics: StatistikaMetrics = {
        totalLuasLahan: statistika.luasLahan,
        totalPrakiraanLuasPanen: statistika.prakiraanLuasPanen,
        totalPrakiraanHasilPanen: statistika.prakiraanHasilPanen,
        totalRealisasiLuasPanen: statistika.realisasiLuasPanen || 0,
        totalRealisasiHasilPanen: statistika.realisasiHasilPanen || 0,
        selisihLuasPanen:
          (statistika.realisasiLuasPanen || 0) - statistika.prakiraanLuasPanen,
        selisihHasilPanen:
          (statistika.realisasiHasilPanen || 0) -
          statistika.prakiraanHasilPanen,
        persentaseRealisasiLuas:
          statistika.prakiraanLuasPanen > 0
            ? ((statistika.realisasiLuasPanen || 0) /
                statistika.prakiraanLuasPanen) *
              100
            : 0,
        persentaseRealisasiHasil:
          statistika.prakiraanHasilPanen > 0
            ? ((statistika.realisasiHasilPanen || 0) /
                statistika.prakiraanHasilPanen) *
              100
            : 0,
      };

      // Determine status
      const isPrakiraanComplete = !!(
        statistika.prakiraanLuasPanen &&
        statistika.prakiraanHasilPanen &&
        statistika.prakiraanBulanPanen
      );

      const isRealisasiComplete = !!(
        statistika.realisasiLuasPanen &&
        statistika.realisasiHasilPanen &&
        statistika.realisasiBulanPanen
      );

      // Check if overdue (simplified logic - you can adjust based on business rules)
      const currentMonth = new Date().getMonth() + 1;
      const prakiraanMonth = getMonthNumber(statistika.prakiraanBulanPanen);
      const isOverdue = currentMonth > prakiraanMonth && !isRealisasiComplete;

      return {
        statistika,
        kelompokTani,
        metrics,
        status: {
          isPrakiraanComplete,
          isRealisasiComplete,
          isOverdue,
        },
      };
    },
    enabled: !!(statistikaQuery.data?.data && kelompokQuery.data?.kelompokTani),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    // cacheTime: 10 * 60 * 1000   // Keep in cache for 10 minutes
  });
};

// Helper function to convert month name to number
function getMonthNumber(monthName: string): number {
  const months = {
    Januari: 1,
    Februari: 2,
    Maret: 3,
    April: 4,
    Mei: 5,
    Juni: 6,
    Juli: 7,
    Agustus: 8,
    September: 9,
    Oktober: 10,
    November: 11,
    Desember: 12,
  };

  return months[monthName as keyof typeof months] || 0;
}
