// hooks/useCreatePenyuluh.ts
import { useQuery, useMutation } from "@tanstack/react-query";

import {
  KecamatanResponse,
  DesaResponse,
  KelompokResponse,
  CreatePenyuluhData,
} from "@/types/DataPenyuluh/createPenyuluh";
import axiosClient from "@/service/app-service";

// API Functions
const fetchKecamatan = async (): Promise<KecamatanResponse> => {
  const response = await axiosClient.get(`/wilayah/kecamatan`);

  return response.data;
};

const fetchDesaByKecamatan = async (
  kecamatanId: number,
): Promise<DesaResponse> => {
  const response = await axiosClient.get(
    `/wilayah/desa?kecamatanId=${kecamatanId}`,
  );

  return response.data;
};

const fetchAllKelompok = async (): Promise<KelompokResponse> => {
  const response = await axiosClient.get(`/kelompok-all`);

  return response.data;
};

const createPenyuluh = async (data: CreatePenyuluhData): Promise<any> => {
  const formData = new FormData();

  // Append all fields to FormData
  formData.append("NIP", data.NIP);
  formData.append("nama", data.nama);
  formData.append("email", data.email);
  formData.append("NoWa", data.NoWa);
  formData.append("password", data.password);
  formData.append("alamat", data.alamat);
  formData.append("tipe", data.tipe);

  // Send both ID and name for kecamatan/desa to match backend expectations
  formData.append("kecamatanId", data.kecamatanId.toString());
  formData.append("kecamatan", data.kecamatan);
  formData.append("desaId", data.desaId.toString());
  formData.append("desa", data.desa);

  formData.append("kecamatanBinaan", data.kecamatanBinaan);
  formData.append("desaBinaan", data.desaBinaan.join(", "));
  formData.append("namaProduct", data.namaProduct);
  formData.append("selectedKelompokIds", data.selectedKelompokIds.join(","));

  // Add pekerjaan field (required by backend)
  formData.append("pekerjaan", "Penyuluh Pertanian");

  // Append foto with proper field name
  if (data.foto) {
    formData.append("foto", data.foto); // Backend expects 'file', not 'foto'
  }

  try {
    const response = await axiosClient.post(`/penyuluh/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    // Log the full error for debugging
    console.error(
      "Create penyuluh error:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to create penyuluh",
    );
  }
};

// Custom Hooks
export const useKecamatan = () => {
  return useQuery({
    queryKey: ["kecamatan"],
    queryFn: fetchKecamatan,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDesaByKecamatan = (kecamatanId: number | null) => {
  return useQuery({
    queryKey: ["desa", kecamatanId],
    queryFn: () => fetchDesaByKecamatan(kecamatanId!),
    enabled: !!kecamatanId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useAllKelompok = () => {
  return useQuery({
    queryKey: ["kelompok-all"],
    queryFn: fetchAllKelompok,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreatePenyuluh = () => {
  return useMutation({
    mutationFn: createPenyuluh,
    onError: (error) => {
      console.error("Error creating penyuluh:", error);
    },
  });
};
