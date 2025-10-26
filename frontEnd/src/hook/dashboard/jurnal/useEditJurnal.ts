// hook/dashboard/jurnal/useEditJurnal.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import axiosClient from "@/service/app-service";
import {
  JurnalDetailResponse,
  UpdateJurnalRequest,
  UpdateJurnalResponse,
} from "@/types/Jurnal/editJurnal";

// Get jurnal detail
const getJurnalDetail = async (id: string): Promise<JurnalDetailResponse> => {
  const response = await axiosClient.get(`/jurnal-kegiatan/${id}`);

  return response.data;
};

// Update jurnal
const updateJurnal = async (
  id: string,
  data: UpdateJurnalRequest,
): Promise<UpdateJurnalResponse> => {
  const formData = new FormData();

  formData.append("judul", data.judul);
  formData.append("uraian", data.uraian);
  formData.append("statusJurnal", data.statusJurnal);
  formData.append("NIK", data.NIK);

  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }

  const response = await axiosClient.put(`/jurnal-kegiatan/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Custom Hooks
export const useJurnalDetail = (id: string) => {
  return useQuery({
    queryKey: ["jurnal-detail", id],
    queryFn: () => getJurnalDetail(id),
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

export const useUpdateJurnal = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateJurnalRequest) => updateJurnal(id, data),
    onSuccess: () => {
      toast.success("Jurnal berhasil diperbarui!");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["jurnal"] });
      queryClient.invalidateQueries({ queryKey: ["jurnal-detail", id] });
    },
    onError: (error: AxiosError<{ message: string }> | Error) => {
      let errorMessage = "Gagal memperbarui jurnal";

      // Check if it's an AxiosError
      if ("response" in error && error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
};
