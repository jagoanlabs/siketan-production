import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import { DataPetaniItem } from "@/types/DataPetani/dataPetani.d";

// Form Data Types
export interface DataPetaniFormData {
  nik: string;
  nkk: string;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  noTelp: string;
  email: string;
  password: string;
  foto: File | null;
  fk_penyuluhId: number | null;
  fk_kelompokId: number | null;
  kecamatanId?: number;
  desaId?: number;
  gapoktan?: string;
  namaKelompok?: string;
}

export interface DataPetaniFormErrors {
  nik?: string;
  nkk?: string;
  nama?: string;
  alamat?: string;
  desa?: string;
  kecamatan?: string;
  noTelp?: string;
  email?: string;
  password?: string;
  foto?: string;
  fk_penyuluhId?: string;
  fk_kelompokId?: string;
  kecamatanId?: string;
  desaId?: string;
  gapoktan?: string;
  namaKelompok?: string;
}

// Fetch single data petani
const fetchDataPetaniById = async (id: number): Promise<DataPetaniItem> => {
  const { data } = await axiosClient.get(`/daftar-tani/${id}`);

  return data.detailTani;
};

// Create data petani
const createDataPetani = async (data: DataPetaniFormData): Promise<void> => {
  const formData = new FormData();

  formData.append("NIK", data.nik);
  formData.append("nokk", data.nkk);
  formData.append("nama", data.nama);
  formData.append("alamat", data.alamat);
  formData.append("desa", data.desa);
  formData.append("kecamatan", data.kecamatan);
  formData.append("NoWa", data.noTelp);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("desaId", data.desaId?.toString() || "");
  formData.append("kecamatanId", data.kecamatanId?.toString() || "");
  formData.append("penyuluh", data.fk_penyuluhId?.toString() || "");

  if (data.gapoktan && data.gapoktan.trim()) {
    formData.append("gapoktan", data.gapoktan);
  }
  if (data.namaKelompok && data.namaKelompok.trim()) {
    formData.append("namaKelompok", data.namaKelompok);
  }

  if (data.foto) {
    formData.append("foto", data.foto);
  }

  await axiosClient.post("/daftar-tani/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update data petani
const updateDataPetani = async ({
  id,
  formData,
}: {
  id: number;
  formData: DataPetaniFormData;
}): Promise<void> => {
  const submitData = new FormData();

  submitData.append("NIK", formData.nik);
  submitData.append("nokk", formData.nkk);
  submitData.append("nama", formData.nama);
  submitData.append("alamat", formData.alamat);
  submitData.append("desa", formData.desa);
  submitData.append("kecamatan", formData.kecamatan);
  submitData.append("NoWa", formData.noTelp);
  submitData.append("email", formData.email);
  // Only send password if it's provided and not empty
  if (formData.password && formData.password.trim()) {
    submitData.append("password", formData.password);
  }
  submitData.append("desaId", formData.desaId?.toString() || "");
  submitData.append("kecamatanId", formData.kecamatanId?.toString() || "");
  submitData.append("penyuluh", formData.fk_penyuluhId?.toString() || "");

  if (formData.gapoktan && formData.gapoktan.trim()) {
    submitData.append("gapoktan", formData.gapoktan);
  }
  if (formData.namaKelompok && formData.namaKelompok.trim()) {
    submitData.append("namaKelompok", formData.namaKelompok);
  }

  if (formData.foto) {
    submitData.append("foto", formData.foto);
  }

  await axiosClient.put(`/daftar-tani/${id}`, submitData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Check if NIK exists
const checkNikExists = async (
  nik: string,
  excludeId?: number,
): Promise<boolean> => {
  try {
    const params: any = { nik };

    if (excludeId) {
      params.excludeId = excludeId;
    }
    const { data } = await axiosClient.get("/daftar-tani/check-nik", {
      params,
    });

    return data.exists;
  } catch (error) {
    return false;
  }
};

// Fetch kecamatan list
const fetchKecamatanList = async (): Promise<any[]> => {
  const { data } = await axiosClient.get("/wilayah/kecamatan");

  return data.data;
};

// Fetch desa list by kecamatan
const fetchDesaByKecamatan = async (kecamatanId: number): Promise<any[]> => {
  const { data } = await axiosClient.get(
    `/wilayah/desa?kecamatanId=${kecamatanId}`,
  );

  return data.data;
};

const fetchGapoktanByDesa = async (desaId: number): Promise<any[]> => {
  const { data } = await axiosClient.get(`/kelompok-tani/desa/${desaId}`);

  return data.kelompokTani || [];
};

// Fetch penyuluh list
const fetchPenyuluhList = async (): Promise<any[]> => {
  const { data } = await axiosClient.get("/opsi-penyuluh", {
    params: { sortBy: "nama", sortType: "ASC" },
  });

  return data.dataDaftarPenyuluh || [];
};

// Fetch kelompok tani list
const fetchKelompokTaniList = async (): Promise<any[]> => {
  const { data } = await axiosClient.get("/kelompok-tani", {
    params: { sortBy: "namaKelompok", sortType: "ASC" },
  });

  return data.data;
};

// Custom Hooks
export const useDataPetaniById = (id: number | undefined) => {
  return useQuery({
    queryKey: ["dataPetani", id],
    queryFn: () => fetchDataPetaniById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useCreateDataPetani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDataPetani,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataPetani"] });
      queryClient.invalidateQueries({ queryKey: ["dataPetaniMeta"] });
      toast.success("Data petani berhasil ditambahkan");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Gagal menambahkan data petani";

      toast.error(message);
    },
  });
};

export const useUpdateDataPetani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDataPetani,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dataPetani"] });
      queryClient.invalidateQueries({ queryKey: ["dataPetani", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dataPetaniMeta"] });
      toast.success("Data petani berhasil diperbarui");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Gagal memperbarui data petani";

      toast.error(message);
    },
  });
};

export const useCheckNikExists = () => {
  return useMutation({
    mutationFn: ({ nik, excludeId }: { nik: string; excludeId?: number }) =>
      checkNikExists(nik, excludeId),
  });
};

export const useKecamatanList = () => {
  return useQuery({
    queryKey: ["kecamatanList"],
    queryFn: fetchKecamatanList,
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
};

export const useDesaByKecamatan = (kecamatanId: number | undefined) => {
  return useQuery({
    queryKey: ["desaList", kecamatanId],
    queryFn: () => fetchDesaByKecamatan(kecamatanId!),
    enabled: !!kecamatanId,
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });
};

export const usePenyuluhList = () => {
  return useQuery({
    queryKey: ["penyuluhList"],
    queryFn: fetchPenyuluhList,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useKelompokTaniList = () => {
  return useQuery({
    queryKey: ["kelompokTaniList"],
    queryFn: fetchKelompokTaniList,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useGapoktanList = (desaId: number | undefined) => {
  return useQuery({
    queryKey: ["gapoktanList"],
    queryFn: () => fetchGapoktanByDesa(desaId!),
    enabled: !!desaId,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
};

// Form validation helper
export const validateDataPetaniForm = (
  formData: DataPetaniFormData,
  isEdit: boolean = false,
): DataPetaniFormErrors => {
  const errors: DataPetaniFormErrors = {};

  // NIK validation
  if (!formData.nik.trim()) {
    errors.nik = "NIK wajib diisi";
  } else if (!/^\d{16}$/.test(formData.nik)) {
    errors.nik = "NIK harus 16 digit angka";
  }

  // NKK validation (required)
  if (!formData.nkk.trim()) {
    errors.nkk = "NKK wajib diisi";
  } else if (!/^\d{16}$/.test(formData.nkk)) {
    errors.nkk = "NKK harus 16 digit angka";
  }

  // Nama validation
  if (!formData.nama.trim()) {
    errors.nama = "Nama wajib diisi";
  } else if (formData.nama.length < 3) {
    errors.nama = "Nama minimal 3 karakter";
  }

  // Alamat validation
  if (!formData.alamat.trim()) {
    errors.alamat = "Alamat wajib diisi";
  }

  // Kecamatan validation
  if (!formData.kecamatan && !formData.kecamatanId) {
    errors.kecamatan = "Kecamatan wajib dipilih";
  }

  // Desa validation
  if (!formData.desa && !formData.desaId) {
    errors.desa = "Desa wajib dipilih";
  }

  // No Telp validation
  if (!formData.noTelp.trim()) {
    errors.noTelp = "Nomor telepon wajib diisi";
  } else {
    const cleanNumber = formData.noTelp.replace(/\D/g, "");

    // Indonesian mobile phone validation - only 08xxxxxxxxx format (10-13 digits total)
    if (!/^08[0-9]{8,11}$/.test(cleanNumber)) {
      errors.noTelp =
        "Format nomor telepon tidak valid (harus dimulai dengan 08 dan 10-13 digit)";
    }
  }

  // Email validation (required)
  if (!formData.email.trim()) {
    errors.email = "Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Format email tidak valid";
  }

  // Password validation (required for create, optional for edit)
  if (!isEdit && !formData.password) {
    errors.password = "Password wajib diisi untuk data baru";
  } else if (formData.password && formData.password.length < 6) {
    errors.password = "Password minimal 6 karakter";
  }

  // Penyuluh validation (required)
  if (!formData.fk_penyuluhId) {
    errors.fk_penyuluhId = "Penyuluh wajib dipilih";
  }

  // Gapoktan validation (required)
  if (!formData.fk_kelompokId) {
    errors.fk_kelompokId = "Gapoktan wajib dipilih";
  }

  // Foto validation (required for create, optional for edit)
  if (!isEdit && !formData.foto) {
    errors.foto = "Foto wajib diupload";
  } else if (formData.foto) {
    const validFormats = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    if (!validFormats.includes(formData.foto.type)) {
      errors.foto = "Format foto harus PNG, JPG, JPEG, atau GIF";
    }
    if (formData.foto.size > 5 * 1024 * 1024) {
      errors.foto = "Ukuran foto maksimal 5MB";
    }
  }

  return errors;
};
