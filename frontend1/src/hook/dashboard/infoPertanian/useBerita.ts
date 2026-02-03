// hooks/useBerita.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import { BeritaQueryParams } from "@/types/InfoPertanian/berita.d";
import { BeritaResponse } from "@/types/InfoPertanian/berita.d";

const fetchBeritaData = async (
  params: BeritaQueryParams,
): Promise<BeritaResponse> => {
  const { data } = await axiosClient.get("/info-tani", { params });

  return data;
};

const deleteBerita = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/info-tani/${id}`);
};

export const useBeritaData = (params: BeritaQueryParams) => {
  return useQuery({
    queryKey: ["berita-data", params],
    queryFn: () => fetchBeritaData(params),
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

export const useDeleteBerita = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBerita,
    onSuccess: () => {
      // Invalidate and refetch berita data
      queryClient.invalidateQueries({ queryKey: ["berita-data"] });
      toast.success("Berita berhasil dihapus");
    },
    onError: (error: any) => {
      console.error("Error deleting berita:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Gagal menghapus berita. Silakan coba lagi.";

      toast.error(errorMessage);
    },
  });
};
