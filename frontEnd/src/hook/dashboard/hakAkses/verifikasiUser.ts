// hooks/useVerifikasiUserData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { axiosClient } from "@/service/app-service";
import {
  VerifikasiUserQueryParams,
  VerifikasiUserResponse,
  VerifikasiActionResponse,
} from "@/types/HakAkses/verifikasiUser";

const fetchVerifikasiUserData = async (
  params: VerifikasiUserQueryParams,
): Promise<VerifikasiUserResponse> => {
  const { data } = await axiosClient.get("/verify", { params });

  return data;
};

const approveUser = async (
  userId: number,
): Promise<VerifikasiActionResponse> => {
  const { data } = await axiosClient.put(`/verify/${userId}`);

  return data;
};

const rejectUser = async (
  userId: number,
): Promise<VerifikasiActionResponse> => {
  const { data } = await axiosClient.delete(`/delete-user/${userId}`);

  return data;
};

const metaVerifikasiUser = async (): Promise<any> => {
  const { data } = await axiosClient.get(`/verify/meta`);

  return data;
};

export const useVerifikasiUserData = (params: VerifikasiUserQueryParams) => {
  return useQuery({
    queryKey: ["verifikasi-user", params],
    queryFn: () => fetchVerifikasiUserData(params),
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

export const useApproveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verifikasi-user"] });
    },
    onError: (error: any) => {
      console.error("Approve error:", error);
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verifikasi-user"] });
    },
    onError: (error: any) => {
      console.error("Reject error:", error);
    },
  });
};

export const useMetaVerifikasiUser = () => {
  return useQuery({
    queryKey: ["metaVerifikasiUser"],
    queryFn: metaVerifikasiUser,
    staleTime: 1000 * 60 * 5, // cache 5 menit
    refetchOnWindowFocus: false, // biar ga refetch tiap ganti tab
  });
};
