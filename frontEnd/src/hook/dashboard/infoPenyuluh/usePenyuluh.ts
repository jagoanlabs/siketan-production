// hooks/usePenyuluh.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  PenyuluhResponse,
  PenyuluhQueryParams,
} from "@/types/DataPenyuluh/penyuluh";
import axiosClient from "@/service/app-service";

// API functions
const fetchPenyuluh = async (
  params: PenyuluhQueryParams,
): Promise<PenyuluhResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

  const response = await axiosClient.get(
    `/daftar-penyuluh?${queryParams.toString()}`,
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch penyuluh data");
  }

  return response.data;
};

const deletePenyuluh = async (id: number): Promise<void> => {
  const response = await axiosClient.delete(`/daftar-penyuluh/${id}`);

  if (response.status !== 200) {
    throw new Error("Failed to delete penyuluh");
  }
};

const uploadPenyuluhExcel = async (file: File): Promise<any> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosClient.post("/upload-data-penyuluh", formData);

  if (response.status !== 200) {
    throw new Error("Failed to upload excel file");
  }

  return response.data;
};

// Custom hooks
export const usePenyuluh = (params: PenyuluhQueryParams) => {
  return useQuery({
    queryKey: ["penyuluh", params],
    queryFn: () => fetchPenyuluh(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeletePenyuluh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePenyuluh,
    onSuccess: () => {
      // Invalidate and refetch penyuluh queries
      queryClient.invalidateQueries({ queryKey: ["penyuluh"] });
    },
    onError: (error) => {
      console.error("Error deleting penyuluh:", error);
    },
  });
};

export const useUploadPenyuluhExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPenyuluhExcel,
    onSuccess: () => {
      // Invalidate and refetch penyuluh queries
      queryClient.invalidateQueries({ queryKey: ["penyuluh"] });
    },
    onError: (error) => {
      console.error("Error uploading excel:", error);
    },
  });
};
