import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/service/app-service";
import {
  RestoreDeleteResponse,
  SampahQueryParams,
  SampahResponse,
} from "@/types/LogActivity/dataSampah";

const fetchSampahData = async (
  params: SampahQueryParams,
): Promise<SampahResponse> => {
  const { data } = await axiosClient.get("/trash-activity", { params });

  return data;
};

const restoreData = async (id: number): Promise<RestoreDeleteResponse> => {
  const { data } = await axiosClient.patch(`/trash-activity-restore/${id}`);

  return data;
};

const deletePermanent = async (id: number): Promise<RestoreDeleteResponse> => {
  const { data } = await axiosClient.delete(`/trash-activity/${id}`);

  return data;
};

export const useSampahData = (params: SampahQueryParams) => {
  return useQuery({
    queryKey: ["sampah", params],
    queryFn: () => fetchSampahData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useRestoreData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sampah"] });
    },
  });
};

export const useDeletePermanent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePermanent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sampah"] });
    },
  });
};
