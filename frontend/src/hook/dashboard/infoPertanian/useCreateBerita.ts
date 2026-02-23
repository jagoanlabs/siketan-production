// Alternative hooks/useCreateBerita.ts - Jika backend menggunakan nama field berbeda
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/service/app-service";
import {
  CreateBeritaPayload,
  CreateBeritaResponse,
} from "@/types/InfoPertanian/createBerita.d";

const createBerita = async (
  payload: CreateBeritaPayload,
): Promise<CreateBeritaResponse> => {
  const formData = new FormData();

  // Coba beberapa kemungkinan nama field yang mungkin digunakan backend
  formData.append("judul", payload.judul);
  formData.append("tanggal", payload.tanggal);
  formData.append("kategori", payload.kategori);
  formData.append("isi", payload.isi);

  if (payload.status) {
    formData.append("status", payload.status);
  }

  // Coba berbagai nama field untuk file
  if (payload.file) {
    // Opsi 1: field name 'file' (yang umum digunakan)
    formData.append("fotoBerita", payload.file, payload.file.name);

    // Jika masih error, coba nama field lain:
    // formData.append('fotoBerita', payload.file, payload.file.name);
    // formData.append('image', payload.file, payload.file.name);
    // formData.append('upload', payload.file, payload.file.name);
  }

  try {
    const { data } = await axiosClient.post("/info-tani/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return data;
  } catch (error: any) {
    // Log detail error untuk debugging
    console.error("Upload error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    throw error;
  }
};

export const useCreateBerita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBerita,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["berita-data"] });
      console.log("Create berita success:", data);
    },
    onError: (error: any) => {
      console.error("Create berita mutation error:", error);
    },
  });
};
