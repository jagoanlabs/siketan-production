// hooks/statistika/useStatistikaData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  StatistikaResponse,
  CreateStatistikaFormData,
  CreateStatistikaPayload,
} from "@/types/Statistika/statistika.d";
import * as XLSX from "xlsx";

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

      const response = await axiosClient.post("/statistik", payload);

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
      const response = await axiosClient.put(`/statistika/${id}`, data);

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
      const response = await axiosClient.delete(`/statistik/${id}`);

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
    mutationFn: async (poktanId?: number | null) => {
      const params = new URLSearchParams({
        isExport: "true",
      });

      // Tambahkan poktan_id jika ada filter
      if (poktanId) {
        params.append("poktan_id", poktanId.toString());
      }

      const response = await axiosClient.get(
        `/statistik?${params.toString()}`
      );

      return response.data;
    },
    onSuccess: (responseBody) => {
      const rawData = responseBody?.data?.data || [];

      if (rawData.length === 0) {
        toast.error("Tidak ada data untuk diexport");
        return;
      }

      const headerRow1 = [
        "NO POKTAN", "KECAMATAN", "DESA", "LAHAN BAKU", "GAPOKTAN", "NAMA POKTAN",
        "TANAMAN PANGAN", "", "", "", "", "", "", "",
        "TANAMAN PERKEBUNAN SEMUSIM", "", "", "", "", "", "", "",
        "TANAMAN PERKEBUNAN TAHUNAN", "", "", "", "", "", "", "",
        "TANAMAN HORTIKULTURA SEMUSIM", "", "", "", "", "", "", "",
        "TANAMAN HORTIKULTURA TAHUNAN", "", "", "", "", "", "", ""
      ];

      const sectionFields = [
        "KOMODITAS", "LUAS LAHAN(HA)", "BULAN TANAM", "PRAKIRAAN BULAN PANEN",
        "PRAKIRAAN LUAS PANEN (HA)", "PRAKIRAAN HASIL PANEN (TON)",
        "REALISASI LUAS PANEN (HA)", "REALISASI PRODUKSI PANEN (TON)"
      ];

      const headerRow2 = [
        "", "", "", "", "", "",
        ...sectionFields,
        ...sectionFields,
        ...sectionFields,
        ...sectionFields,
        ...sectionFields
      ];

      const aoaData: any[][] = [headerRow1, headerRow2];

      rawData.forEach((item: any) => {
        let sectionIndex = -1;
        const kat = item.kategori?.toLowerCase() || "";
        const komoditas = item.komoditas || "";

        if (kat === "pangan") {
          sectionIndex = 0;
        } else if (kat === "perkebunan") {
          const semusimList = ["Kopi", "Kakao", "Cengkeh", "Teh", "Karet", "Kelapa"];
          const tahunanList = ["Perkebunan Tembakau", "Perkebunan Tebu"];

          if (semusimList.includes(komoditas)) {
            sectionIndex = 1;
          } else if (tahunanList.includes(komoditas)) {
            sectionIndex = 2;
          } else {
            sectionIndex = 1; // Default
          }
        } else if (kat === "buah" || kat === "sayur") {
          const semusimList = [
            "Melon", "Semangka", "Pisang", "Blewah",
            "Cabe Kecil", "Cabe Besar", "Bawang Merah", "Tomat", "Terong",
            "Pare", "Gambas", "Bayam", "Kangkung", "Sawi", "Kacang Panjang", "Timun"
          ];
          const tahunanList = [
            "Mangga", "Durian", "Manggis", "Alpukat", "Rambutan", "Jeruk Lemon",
            "Jeruk Nipis", "Jeruk Keprok", "Jeruk Besar", "Nangka", "Jambu Biji",
            "Jambu Air", "Sukun", "Sirsak", "Sawo", "Duku"
          ];

          if (semusimList.includes(komoditas)) {
            sectionIndex = 3;
          } else if (tahunanList.includes(komoditas)) {
            sectionIndex = 4;
          } else {
            sectionIndex = 3; // Default
          }
        }

        const row = [
          item.kelompok?.id || "-",
          item.kelompok?.kecamatan || "-",
          item.kelompok?.desa || "-",
          item.luasLahan || "-",
          item.kelompok?.gapoktan || "-",
          item.kelompok?.namaKelompok || "-"
        ];

        for (let i = 0; i < 5; i++) {
          if (i === sectionIndex) {
            row.push(
              item.komoditas || "-",
              item.luasLahan || "-",
              item.periodeTanam || "-",
              item.prakiraanBulanPanen || "-",
              item.prakiraanLuasPanen || "-",
              item.prakiraanHasilPanen || "-",
              item.realisasiLuasPanen ?? "-",
              item.realisasiHasilPanen ?? "-"
            );
          } else {
            row.push("-", "-", "-", "-", "-", "-", "-", "-");
          }
        }

        aoaData.push(row);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(aoaData);

      worksheet["!merges"] = [
        { s: { r: 0, c: 6 }, e: { r: 0, c: 13 } },
        { s: { r: 0, c: 14 }, e: { r: 0, c: 21 } },
        { s: { r: 0, c: 22 }, e: { r: 0, c: 29 } },
        { s: { r: 0, c: 30 }, e: { r: 0, c: 37 } },
        { s: { r: 0, c: 38 }, e: { r: 0, c: 45 } },
        { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
        { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } },
        { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 1, c: 4 } },
        { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Statistika");

      // Generate filename dengan timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");

      XLSX.writeFile(workbook, `data-statistika-${timestamp}.xlsx`);

      toast.success("Data berhasil diexport!");
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
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data berhasil diimport!");

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["statistika-data"] });
      queryClient.invalidateQueries({ queryKey: ["tanaman-data"] });

      // Log hasil import jika ada informasi
      if (data.imported_count) {
        console.log(`Successfully imported ${data.imported_count} records`);
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengimport data statistika";

      toast.error(message);
      console.error("Import error:", error);
    },
  });
};
