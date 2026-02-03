// hooks/useEventTani.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import { EventTaniQueryParams } from "@/types/InfoPertanian/event.d";
import { EventTaniResponse } from "@/types/InfoPertanian/event.d";

const deleteEventTani = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/event-tani/${id}`);
};

// Hook for delete mutation
export const useDeleteEventTani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEventTani,
    onSuccess: () => {
      // Invalidate and refetch event data
      queryClient.invalidateQueries({ queryKey: ["event-tani-data"] });
      queryClient.invalidateQueries({ queryKey: ["acara-list"] });
      toast.success("Event berhasil dihapus");
    },
    onError: (error: any) => {
      console.error("Error deleting event:", error);

      let errorMessage = "Gagal menghapus event. Silakan coba lagi.";

      // Handle specific error cases
      if (error?.response?.status === 404) {
        errorMessage = "Event tidak ditemukan.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk menghapus event ini.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Data tidak valid.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};

const fetchEventTaniData = async (
  params: EventTaniQueryParams,
): Promise<EventTaniResponse> => {
  const { data } = await axiosClient.get("/event-tani", { params });

  return data;
};

export const useEventTaniData = (params: EventTaniQueryParams) => {
  return useQuery({
    queryKey: ["event-tani-data", params],
    queryFn: () => fetchEventTaniData(params),
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
