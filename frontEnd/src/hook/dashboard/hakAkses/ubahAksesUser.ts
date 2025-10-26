import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  MetaPeranResponse,
  MetaPeranRoles,
  UbahPeranRequest,
  UbahPeranResponse,
  USER_ROLES,
  UserAksesQueryParams,
  UserAksesResponse,
  UserRole,
} from "@/types/HakAkses/ubahAksesUser";
import { axiosClient } from "@/service/app-service";

// Helper function to get role count from API response
export const getRoleCountFromApi = (
  roles: MetaPeranRoles,
  roleValue: UserRole,
): number => {
  const roleConfig = USER_ROLES.find((role) => role.value === roleValue);

  return roleConfig ? roles[roleConfig.apiKey] : 0;
};

// API Functions
const fetchUserAksesData = async (
  params: UserAksesQueryParams,
): Promise<UserAksesResponse> => {
  const { data } = await axiosClient.get("/auth/peran", { params });

  return data;
};

const ubahPeranUser = async ({
  id,
  roles,
}: UbahPeranRequest): Promise<UbahPeranResponse> => {
  const { data } = await axiosClient.put(`/auth/peran/${id}`, { id, roles });

  return data;
};

const fetchMetaPeran = async (): Promise<MetaPeranResponse> => {
  const { data } = await axiosClient.get("/auth/peran/meta");

  return data;
};

// React Query Hooks
export const useUserAksesData = (params: UserAksesQueryParams) => {
  return useQuery({
    queryKey: ["user-akses", params],
    queryFn: () => fetchUserAksesData(params),
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

export const useUbahPeranUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ubahPeranUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-akses"] });
      queryClient.invalidateQueries({ queryKey: ["meta-peran"] });
    },
    onError: (error: any) => {
      console.error("Ubah peran error:", error);
    },
  });
};

export const useMetaPeran = () => {
  return useQuery({
    queryKey: ["meta-peran"],
    queryFn: fetchMetaPeran,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 3;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
