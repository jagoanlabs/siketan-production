// hooks/useEditAcara.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  UpdateAcaraRequest,
  AcaraDetailResponse,
  UpdateAcaraResponse,
} from "@/types/InfoPertanian/editAcara.d";

// Fetch acara detail
const fetchAcaraDetail = async (id: string): Promise<AcaraDetailResponse> => {
  const { data } = await axiosClient.get(`/event-tani/${id}`);

  return data;
};

// Update acara
const updateAcara = async (
  id: string,
  data: UpdateAcaraRequest,
): Promise<UpdateAcaraResponse> => {
  const formData = new FormData();

  formData.append("namaKegiatan", data.namaKegiatan);
  formData.append("tanggalAcara", data.tanggalAcara);
  formData.append("waktuAcara", data.waktuAcara);
  formData.append("tempat", data.tempat);
  formData.append("peserta", data.peserta);
  formData.append("createdBy", data.createdBy);
  formData.append("isi", data.isi);

  // Only append image if a new one is selected
  if (data.fotoKegiatan) {
    formData.append("fotoKegiatan", data.fotoKegiatan);
  }

  console.log("Updating acara with data:", {
    namaKegiatan: data.namaKegiatan,
    tanggalAcara: data.tanggalAcara,
    waktuAcara: data.waktuAcara,
    createdBy: data.createdBy,
    hasNewImage: !!data.fotoKegiatan,
  });

  const response = await axiosClient.put(`/event-tani/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Hook untuk mengambil detail acara
export const useAcaraDetail = (id: string) => {
  return useQuery({
    queryKey: ["acara-detail", id],
    queryFn: () => fetchAcaraDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry for client errors (4xx)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

// Hook untuk update acara
export const useUpdateAcara = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcaraRequest }) =>
      updateAcara(id, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["acara-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["acara-list"] });
      queryClient.invalidateQueries({ queryKey: ["berita-data"] }); // If acara is part of general data

      toast.success(data.message || "Event Tani Berhasil Di ubah");
    },
    onError: (error: any) => {
      console.error("Error updating acara:", error);

      let errorMessage = "Gagal memperbarui acara. Silakan coba lagi.";

      // Handle specific error cases
      if (error?.response?.status === 404) {
        errorMessage = "Acara tidak ditemukan.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk memperbarui acara ini.";
      } else if (error?.response?.status === 400) {
        if (error?.response?.data?.message?.includes("Wrong Image Format")) {
          errorMessage =
            "Format gambar tidak valid. Gunakan PNG, JPG, JPEG, atau GIF.";
        } else {
          errorMessage =
            error?.response?.data?.message || "Data yang dikirim tidak valid.";
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};
