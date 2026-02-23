// hooks/useEditBerita.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/service/app-service";
import {
  BeritaDetailResponse,
  EditBeritaPayload,
  EditBeritaResponse,
} from "@/types/InfoPertanian/updateBerita.d";

// Fetch berita detail by ID
const fetchBeritaDetail = async (id: number): Promise<BeritaDetailResponse> => {
  const { data } = await axiosClient.get(`/info-tani/${id}`);

  return data;
};

// Update berita
const updateBerita = async (
  payload: EditBeritaPayload,
): Promise<EditBeritaResponse> => {
  const formData = new FormData();

  // Append form fields
  formData.append("judul", payload.judul);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  formData.append("isi", payload.isi);

  if (payload.status) {
    formData.append("status", payload.status);
  }

  // Append new file if exists (optional for edit)
  if (payload.file) {
    formData.append("fotoBeritaBaru", payload.file, payload.file.name);
  }

  // Debug log
  console.log("Update FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const { data } = await axiosClient.put(`/info-tani/${payload.id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 30000,
  });

  return data;
};

// Hook untuk fetch berita detail
export const useBeritaDetail = (id: number) => {
  return useQuery({
    queryKey: ["berita-detail", id],
    queryFn: () => fetchBeritaDetail(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false; // Don't retry if berita not found
      }

      return failureCount < 3;
    },
  });
};

// Hook untuk update berita
export const useUpdateBerita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBerita,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["berita-data"] });
      queryClient.invalidateQueries({
        queryKey: ["berita-detail", variables.id],
      });
      console.log("Update berita success:", data);
    },
    onError: (error: any) => {
      console.error("Update berita error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    },
  });
};
