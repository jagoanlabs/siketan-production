// hooks/useAcara.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  AcaraResponse,
  CreateAcaraRequest,
} from "@/types/InfoPertanian/createAcara";

const createAcara = async (
  data: CreateAcaraRequest,
): Promise<AcaraResponse> => {
  const formData = new FormData();

  formData.append("namaKegiatan", data.namaKegiatan);
  formData.append("tanggalAcara", data.tanggalAcara);
  formData.append("waktuAcara", data.waktuAcara);
  formData.append("tempat", data.tempat);
  formData.append("peserta", data.peserta);
  formData.append("isi", data.isi);

  if (data.fotoKegiatan) {
    formData.append("fotoKegiatan", data.fotoKegiatan);
  }

  const response = await axiosClient.post("/event-tani/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useCreateAcara = () => {
  return useMutation({
    mutationFn: createAcara,
    onSuccess: (data) => {
      toast.success(data.message || "Acara berhasil dibuat");
    },
    onError: (error: any) => {
      console.error("Error creating acara:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Gagal membuat acara. Silakan coba lagi.";

      toast.error(errorMessage);
    },
  });
};
