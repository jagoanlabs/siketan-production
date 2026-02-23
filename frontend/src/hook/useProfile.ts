// services/profile.service.ts
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "./UseAuth";

import axiosClient from "@/service/app-service";
import {
  OperatorProfile,
  PenyuluhProfile,
  PetaniProfile,
  ProfileData,
  ProfileResponse,
} from "@/types/profile";

export const profileApi = {
  // Get detail profile berdasarkan role user yang sedang login
  getDetailProfile: async (): Promise<ProfileResponse> => {
    const response = await axiosClient.get<ProfileResponse>(
      "/auth/detailprofile",
    );

    return response.data;
  },
};

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.accountID],
    queryFn: profileApi.getDetailProfile,
    enabled: !!user?.accountID, // Only run query if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Type guards
export const isPetaniProfile = (data: ProfileData): data is PetaniProfile => {
  return "kelompok" in data && "dataPenyuluh" in data;
};

export const isPenyuluhProfile = (
  data: ProfileData,
): data is PenyuluhProfile => {
  return "kecamatanBinaanData" in data && "desaBinaanData" in data;
};

export const isOperatorProfile = (
  data: ProfileData,
): data is OperatorProfile => {
  return !("kelompok" in data) && !("kecamatanBinaanData" in data);
};

// Custom hooks
export const usePetaniProfile = () => {
  const { data, ...rest } = useProfile();

  return {
    ...rest,
    data: data?.data && isPetaniProfile(data.data) ? data.data : undefined,
    isPetani: data?.data ? isPetaniProfile(data.data) : false,
  };
};

export const usePenyuluhProfile = () => {
  const { data, ...rest } = useProfile();

  return {
    ...rest,
    data: data?.data && isPenyuluhProfile(data.data) ? data.data : undefined,
    isPenyuluh: data?.data ? isPenyuluhProfile(data.data) : false,
  };
};

export const useOperatorProfile = () => {
  const { data, ...rest } = useProfile();

  return {
    ...rest,
    data: data?.data && isOperatorProfile(data.data) ? data.data : undefined,
    isOperator: data?.data ? isOperatorProfile(data.data) : false,
  };
};
