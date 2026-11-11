// hooks/statistika/useStatistikaData.ts
import type { Row } from "write-excel-file/browser";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import writeXlsxFile from "write-excel-file/browser";

import { axiosClient } from "@/service/app-service";
import {
  StatistikaResponse,
  CreateStatistikaFormData,
  CreateStatistikaPayload,
} from "@/types/Statistika/statistika.d";

interface UseStatistikaDataParams {
  poktanId: number | null;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortType?: "ASC" | "DESC";
  search?: string;
}

export const useStatistikaData = ({
  poktanId,
  page = 1,
  limit = 10,
  sortBy = "",
  sortType = "ASC",
  search = "",
}: UseStatistikaDataParams) => {
  return useQuery({
    queryKey: [
      "statistika-data",
      poktanId,
      page,
      limit,
      sortBy,
      sortType,
      search,
    ],
    queryFn: async (): Promise<StatistikaResponse> => {
      if (!poktanId) {
        return {
          message: "No poktan selected",
          data: {
            data: [],
            total: 0,
            currentPages: 1,
            limit: 10,
            maxPages: 1,
            from: 0,
            to: 0,
            sortBy: "id",
            sortType: "ASC",
          },
        };
      }

      const params = new URLSearchParams({
        poktan_id: poktanId.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sortBy: sortBy || "id",
        sortType,
        search,
      });

      const response = await axiosClient.get(`/statistik?${params.toString()}`);

      return response.data;
    },
    enabled: !!poktanId,
  });
};

export const useCreateStatistika = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStatistikaFormData) => {
      // Transform form data to API payload format
      const payload: CreateStatistikaPayload = {
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
        realisasiLuasPanen: 0,
        realisasiHasilPanen: 0,
        realisasiBulanPanen: "",
        fk_kelompokId: data.fk_kelompokId,
      };

      const response = await axiosClient.post("/statistik", payload, {
        headers: { "X-Skip-Toast": "true" },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Data statistika berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal menambahkan data statistika";

      toast.error(message);
    },
  });
};

export const useUpdateStatistika = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateStatistikaFormData>;
    }) => {
      const response = await axiosClient.put(`/statistika/${id}`, data, {
        headers: { "X-Skip-Toast": "true" },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Data statistika berhasil diupdate!");
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengupdate data statistika";

      toast.error(message);
    },
  });
};

export const useDeleteStatistika = (isBulkAction?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosClient.delete(`/statistik/${id}`, {
        headers: { "X-Skip-Toast": "true" },
      });

      return response.data;
    },
    onSuccess: (variables) => {
      if (!isBulkAction) {
        toast.success("Data statistika berhasil dihapus!");
      }
      queryClient.invalidateQueries({
        queryKey: ["tanaman-data"], // Sesuaikan dengan key di useTanamanData
        exact: false,
      });

      // Invalidate semua query statistika-data (dengan parameter apapun)
      queryClient.invalidateQueries({
        queryKey: ["statistika-data"],
        exact: false, // Akan invalidate semua query yang dimulai dengan key ini
      });

      // Invalidate detail queries
      queryClient.invalidateQueries({ queryKey: ["statistika-detail"] });

      // Remove specific detail dari cache
      queryClient.removeQueries({
        queryKey: ["statistika-detail", variables],
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal menghapus data statistika";

      toast.error(message);
      console.error("Delete error:", error);
    },
  });
};

export const useExportStatistika = () => {
  return useMutation({
    mutationFn: async ({
      poktanId,
      tahun,
      kategori,
      komoditas,
      prakiraanMin,
      prakiraanMax,
      kecamatan,
    }: {
      poktanId?: string | number | null;
      tahun?: string | null;
      kategori?: string | null;
      komoditas?: string | null;
      prakiraanMin?: string | null;
      prakiraanMax?: string | null;
      kecamatan?: string | null;
    } = {}) => {
      const params = new URLSearchParams({
        isExport: "true",
      });

      // Tambahkan poktan_id jika ada filter
      if (poktanId) {
        params.append("poktan_id", poktanId.toString());
      }

      // Tambahkan tahun jika ada filter tahun
      if (tahun) {
        params.append("tahun", tahun);
      }

      // Tambahkan kategori jika ada filter
      if (kategori) {
        params.append("kategori", kategori);
      }

      // Tambahkan komoditas jika ada filter
      if (komoditas) {
        params.append("komoditas", komoditas);
      }

      // Tambahkan prakiraan min/max jika ada filter
      if (prakiraanMin) {
        params.append("prakiraanMin", prakiraanMin);
      }
      if (prakiraanMax) {
        params.append("prakiraanMax", prakiraanMax);
      }

      // Tambahkan kecamatan jika ada filter
      if (kecamatan) {
        params.append("kecamatan", kecamatan);
      }

      const response = await axiosClient.get(
        `/statistik?${params.toString()}`
      );

      return response.data;
    },
    onSuccess: async (responseBody) => {
      const rawData = responseBody?.data?.data || [];

      if (rawData.length === 0) {
        toast.error("Tidak ada data untuk diexport");
        return;
      }

      const headers: Row = [
        "ID",
        "ID Poktan",
        "Nama Poktan",
        "Gapoktan",
        "Kecamatan",
        "Desa",
        "Kategori",
        "Komoditas",
        "Periode Tanam (Bulan)",
        "Luas Lahan Tanam (Ha)",
        "Prakiraan Luas Panen (Ha)",
        "Prakiraan Hasil Panen (Ton)",
        "Prakiraan Bulan Panen",
        "Realisasi Luas Panen (Ha)",
        "Realisasi Hasil Panen (Ton)",
        "Realisasi Bulan Panen",
        "Created At",
        "Updated At",
      ];

      const rows: Row[] = rawData.map((item: any) => [
        item.id,
        item.kelompok?.id || item.fk_kelompokId || "",
        item.kelompok?.namaKelompok || "",
        item.kelompok?.gapoktan || "",
        item.kelompok?.kecamatan || "",
        item.kelompok?.desa || "",
        item.kategori || "",
        item.komoditas || "",
        item.periodeTanam || "",
        item.luasLahan ?? "",
        item.prakiraanLuasPanen ?? "",
        item.prakiraanHasilPanen ?? "",
        item.prakiraanBulanPanen || "",
        item.realisasiLuasPanen ?? "",
        item.realisasiHasilPanen ?? "",
        item.realisasiBulanPanen || "",
        item.createdAt ? new Date(item.createdAt).toLocaleString("id-ID") : "",
        item.updatedAt ? new Date(item.updatedAt).toLocaleString("id-ID") : "",
      ]);

      const sheetData: Row[] = [headers, ...rows];

      // Auto column widths
      const columns = [
        { width: 8 },  // ID
        { width: 12 }, // ID Poktan
        { width: 25 }, // Nama Poktan
        { width: 25 }, // Gapoktan
        { width: 20 }, // Kecamatan
        { width: 20 }, // Desa
        { width: 15 }, // Kategori
        { width: 25 }, // Komoditas
        { width: 22 }, // Periode Tanam (Bulan)
        { width: 22 }, // Luas Lahan Tanam (Ha)
        { width: 24 }, // Prakiraan Luas Panen (Ha)
        { width: 26 }, // Prakiraan Hasil Panen (Ton)
        { width: 22 }, // Prakiraan Bulan Panen
        { width: 24 }, // Realisasi Luas Panen (Ha)
        { width: 26 }, // Realisasi Hasil Panen (Ton)
        { width: 22 }, // Realisasi Bulan Panen
        { width: 22 }, // Created At
        { width: 22 }, // Updated At
      ];

      // Generate filename dengan timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const filename = `data-statistika-pertanian-${timestamp}.xlsx`;

      // Download file
      try {
        await writeXlsxFile(sheetData, {
          sheet: "Statistika",
          columns,
        }).toFile(filename);
        toast.success(`Data berhasil diexport: ${filename}`);
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Gagal mengexport data statistika");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengexport data statistika";

      toast.error(message);
      console.error("Export error:", error);
    },
  });
};

// Hook untuk import statistika
export const useImportStatistika = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axiosClient.post("/statistik/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Data berhasil diimport!");

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
      queryClient.invalidateQueries({ queryKey: ["tanaman-data"] });
      queryClient.invalidateQueries({ queryKey: ["statistika"] });
      queryClient.invalidateQueries({ queryKey: ["tanaman"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengimport data statistika";

      toast.error(message);
      console.error("Import error:", error);
    },
  });
};

// Hook untuk bulk update realisasi statistika
export const useUpdateRealisasiBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axiosClient.post(
        "/statistik/update-realisasi",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000,
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Data realisasi berhasil diperbarui!");

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
      queryClient.invalidateQueries({ queryKey: ["tanaman-data"] });
      queryClient.invalidateQueries({ queryKey: ["statistika"] });
      queryClient.invalidateQueries({ queryKey: ["tanaman"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengupdate data realisasi";

      toast.error(message);
      console.error("Update realisasi error:", error);
    },
  });
};

export const useStatistikaYears = () => {
  return useQuery({
    queryKey: ["statistika-years"],
    queryFn: async (): Promise<string[]> => {
      const response = await axiosClient.get("/statistik/years");
      return (response.data.data || []).map((year: any) => year.toString());
    },
    staleTime: 300000, // 5 minutes cache
  });
};

