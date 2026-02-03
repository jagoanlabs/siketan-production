import axiosClient from "@/service/app-service";

export interface UpdateProfileData {
  nama?: string;
  email?: string;
  no_wa?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UpdateProfileResponse {
  message: string;
  data?: any;
}

// API function untuk update profile
export const updateProfile = async (
  userId: string,
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  // Prepare data yang akan dikirim ke backend
  const updateData: any = {};

  // Add profile fields
  if (data.nama) updateData.nama = data.nama;
  if (data.email) updateData.email = data.email;
  if (data.no_wa) updateData.no_wa = data.no_wa;

  // Add password fields if provided
  if (data.newPassword && data.currentPassword) {
    updateData.currentPassword = data.currentPassword;
    updateData.newPassword = data.newPassword;
  }

  const response = await axiosClient.put(`/verify/${userId}`, updateData);

  return response.data;
};
