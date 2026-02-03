// hooks/statistika/useStatistikaData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
        `/statistik?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      // Create blob dan download file
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;

      // Generate filename dengan timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");

      link.download = `data-statistika-${timestamp}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup URL
      window.URL.revokeObjectURL(url);

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
