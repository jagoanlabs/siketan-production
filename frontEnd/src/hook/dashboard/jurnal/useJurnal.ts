// hooks/useJurnal.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import axiosClient from "@/service/app-service";
import { JurnalQueryParams, JurnalResponse } from "@/types/Jurnal/jurnal";

// API Functions
const fetchJurnal = async (
  params: JurnalQueryParams,
): Promise<JurnalResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);

  const response = await axiosClient.get(
    `/jurnal-kegiatan?${queryParams.toString()}`,
  );

  // Handle different response structures
  if (response.data?.newData) {
    return {
      message: response.data.message || "Success",
      newData: response.data.newData,
    };
  } else if (response.data?.data) {
    return {
      message: "Success",
      newData: response.data.data,
    };
  } else if (Array.isArray(response.data)) {
    return {
      message: "Success",
      newData: response.data,
    };
  } else {
    throw new Error("Invalid response format for jurnal");
  }
};

const deleteJurnal = async (
  id: string | number,
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/jurnal-kegiatan/${id}`);

  return {
    message: response.data.message || "Jurnal berhasil dihapus",
  };
};

// Custom Hooks
export const useJurnal = (params: JurnalQueryParams) => {
  return useQuery({
    queryKey: ["jurnal", params],
    queryFn: () => fetchJurnal(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useDeleteJurnal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJurnal,
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate and refetch jurnal queries
      queryClient.invalidateQueries({ queryKey: ["jurnal"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gagal menghapus jurnal";

      toast.error(errorMessage);
    },
  });
};
