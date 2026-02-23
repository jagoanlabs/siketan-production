// services/profileService.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  OperatorPoktanProfileData,
  PenyuluhProfileData,
  PetaniProfileData,
  ProfileDetail,
} from "@/types/editProfle";
import { ProfileResponse } from "@/types/profile";

const profileKeys = {
  all: ["profile"] as const,
  details: () => [...profileKeys.all, "detail"] as const,
  detail: () => [...profileKeys.details()] as const,
};

const getDetailProfile = async (): Promise<ProfileDetail> => {
  const response = await axiosClient.get("/auth/detailprofile");

  return response.data.data;
};

// Update profile based on role
const updateProfile = async (
  data: PenyuluhProfileData | PetaniProfileData | OperatorPoktanProfileData,
): Promise<ProfileResponse> => {
  const formData = new FormData();

  // Append all fields to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "foto" && value instanceof File) {
        formData.append("foto", value);
      } else if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value.toString());
      }
    }
  });

  const response = await axiosClient.post("/auth/updateprofile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useGetDetailProfile = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: getDetailProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook untuk update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: PenyuluhProfileData | PetaniProfileData | OperatorPoktanProfileData,
    ) => updateProfile(data),
    onSuccess: (data) => {
      toast.success(data.message || "Profile berhasil diupdate");
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
      // Also invalidate auth user data if needed
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Gagal mengupdate profile";

      toast.error(errorMessage);
      console.error("Update profile error:", error);
    },
  });
};
