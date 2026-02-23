import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  CreateJurnalRequest,
  CreateJurnalResponse,
} from "@/types/Jurnal/createJurnal";
import axiosClient from "@/service/app-service";

const createJurnal = async (
  data: CreateJurnalRequest,
): Promise<CreateJurnalResponse> => {
  const formData = new FormData();

  formData.append("NIK", data.NIK);
  formData.append("judul", data.judul);
  formData.append("tanggalDibuat", new Date().toISOString());
  formData.append("uraian", data.uraian);
  formData.append("statusJurnal", data.statusJurnal);

  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }

  try {
    const { data } = await axiosClient.post("/jurnal-kegiatan/add", formData, {
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

export const useCreateJurnal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJurnal,
    onSuccess: () => {
      toast.success("Jurnal berhasil dibuat!");
      // Invalidate jurnal queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["jurnal"] });
    },
    onError: (error: AxiosError<{ message: string }> | Error) => {
      let errorMessage = "Default error message";

      // Type guard untuk AxiosError
      if ("response" in error && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // toast.error(errorMessage);
    },
  });
};
