import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  KelompokTaniQueryParams,
  KelompokTaniResponse,
  DeleteKelompokResponse,
  UploadResponse,
} from "@/types/KelompokTani/kelompokTani";

const fetchKelompokTaniData = async (
  params: KelompokTaniQueryParams,
): Promise<KelompokTaniResponse> => {
  const { data } = await axiosClient.get("/kelompok", { params });

  return data;
};

const deleteKelompokTani = async (
  id: number,
): Promise<DeleteKelompokResponse> => {
  const { data } = await axiosClient.delete(`/kelompok/${id}`);

  return data;
};

const metaKelompokTani = async (): Promise<any> => {
  const { data } = await axiosClient.get(`/kelompok/meta`);

  return data;
};

const uploadKelompokTaniFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await axiosClient.post("/kelompok/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const useKelompokTaniData = (params: KelompokTaniQueryParams) => {
  return useQuery({
    queryKey: ["kelompok", params],
    queryFn: () => fetchKelompokTaniData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

export const useDeleteKelompokTani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteKelompokTani,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelompok"] });
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
    },
  });
};

export const useUploadKelompokTaniFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadKelompokTaniFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kelompok"] });
    },
    onError: (error: any) => {
      console.error("Upload error:", error);
    },
  });
};

export const useMetaKelompokTani = () => {
  return useQuery({
    queryKey: ["metaKelompokTani"],
    queryFn: metaKelompokTani,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    refetchOnWindowFocus: false, // biar ga refetch tiap ganti tab
  });
};

// Hook untuk import statistika
export const useImportKelompokTani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axiosClient.post("/kelompok/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data berhasil diimport!");

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["kelompok"] });

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
