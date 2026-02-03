import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateProfile,
  UpdateProfileData,
} from "@/service/DashboardAdmin/profile/update-profile-service";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateProfileData;
    }) => updateProfile(userId, data),

    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      return data;
    },

    onError: (error: any) => {
      console.error("Error updating profile:", error);
      throw error;
    },
  });
};
