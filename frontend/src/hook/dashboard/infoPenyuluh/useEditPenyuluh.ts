// hooks/useEditPenyuluh.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axiosClient from "@/service/app-service";
import { CreatePenyuluhData } from "@/types/DataPenyuluh/createPenyuluh";

// API Functions
const fetchPenyuluhDetail = async (id: string): Promise<any> => {
  const response = await axiosClient.get(`/daftar-penyuluh/${id}`);

  if (response.data?.dataDaftarPenyuluh) {
    return response.data.dataDaftarPenyuluh;
  } else if (response.data?.data) {
    return response.data.data;
  } else {
    throw new Error("Invalid response format for penyuluh detail");
  }
};

const updatePenyuluh = async (
  id: string,
  data: CreatePenyuluhData,
): Promise<any> => {
  const formData = new FormData();

  // Append all fields to FormData
  formData.append("nik", data.NIP);
  formData.append("nama", data.nama);
  formData.append("email", data.email);
  formData.append("NoWa", data.NoWa);

  // Only append password if it's provided
  if (data.password && data.password.trim() !== "") {
    formData.append("password", data.password);
  }

  formData.append("alamat", data.alamat);
  formData.append("kecamatanId", data.kecamatanId.toString());
  formData.append("kecamatan", data.kecamatan);
  formData.append("desaId", data.desaId.toString());
  formData.append("desa", data.desa);
  formData.append("kecamatanBinaan", data.kecamatanBinaan);
  formData.append("desaBinaan", data.desaBinaan.join(", "));
  formData.append("namaProduct", data.namaProduct);
  formData.append("selectedKelompokIds", data.selectedKelompokIds.join(","));
  formData.append("pekerjaan", "Penyuluh Pertanian");
  formData.append("tipe", data.tipe);

  // Append foto with proper field name
  if (data.foto) {
    formData.append("foto", data.foto);
    formData.append("file", data.foto);
  }

  try {
    const response = await axiosClient.put(`/daftar-penyuluh/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("=== Update Backend Error ===");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Full Error:", error);
    console.error("=== End Update Backend Error ===");
    throw new Error(
      error.response?.data?.message || "Failed to update penyuluh",
    );
  }
};

// Custom Hooks
export const usePenyuluhDetail = (id: string) => {
  return useQuery({
    queryKey: ["penyuluh-detail", id],
    queryFn: () => fetchPenyuluhDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};

export const useUpdatePenyuluh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreatePenyuluhData }) =>
      updatePenyuluh(id, data),
    onSuccess: (variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["penyuluh"] });
      queryClient.invalidateQueries({
        queryKey: ["penyuluh-detail", variables.id],
      });
    },
    onError: (error) => {
      console.error("Error updating penyuluh:", error);
    },
  });
};
