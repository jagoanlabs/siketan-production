import axiosClient from "@/service/app-service";

export interface UpdateProfileData {
  nama?: string;
  email?: string;
  no_wa?: string;
  alamat?: string;
  foto?: File | null;
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
  _userId: string,
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  // If photo file is attached, send multipart FormData
  if (data.foto instanceof File) {
    const formData = new FormData();
    if (data.nama) formData.append("nama", data.nama);
    if (data.email) formData.append("email", data.email);
    if (data.no_wa) formData.append("no_wa", data.no_wa);
    if (data.alamat) formData.append("alamat", data.alamat);
    formData.append("foto", data.foto);
    if (data.newPassword && data.currentPassword) {
      formData.append("currentPassword", data.currentPassword);
      formData.append("newPassword", data.newPassword);
    }

    const response = await axiosClient.post("/auth/updateprofile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Prepare JSON data yang akan dikirim ke backend
  const updateData: any = {};

  if (data.nama) updateData.nama = data.nama;
  if (data.email) updateData.email = data.email;
  if (data.no_wa) updateData.no_wa = data.no_wa;
  if (data.alamat) updateData.alamat = data.alamat;

  if (data.newPassword && data.currentPassword) {
    updateData.currentPassword = data.currentPassword;
    updateData.newPassword = data.newPassword;
  }

  const response = await axiosClient.post("/auth/updateprofile", updateData);

  return response.data;
};
