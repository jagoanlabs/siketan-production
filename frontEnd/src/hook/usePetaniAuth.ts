// hook/usePetaniAuth.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  PetaniLoginRequest,
  PetaniLoginResponse,
  PetaniSetPasswordRequest,
} from "@/types/authPetani";
import axiosClient from "@/service/app-service";
import {
  Desa,
  KelompokTani,
  KelompokTaniResponse,
  PetaniRegisterResponse,
} from "@/types/registerPetani";

// Login function
const petaniLogin = async (
  credentials: PetaniLoginRequest,
): Promise<PetaniLoginResponse> => {
  const { data } = await axiosClient.post("/auth/petani-login", credentials);

  return data;
};

// Set password function
const setPetaniPassword = async (
  data: PetaniSetPasswordRequest,
): Promise<any> => {
  const response = await axiosClient.post("/auth/set-petani-password", data);

  return response.data;
};

// Hook untuk login petani
export const usePetaniLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: petaniLogin,
    onSuccess: (data: PetaniLoginResponse) => {
      // Jika perlu set password (password masih null)
      if (data.needSetPassword) {
        toast.info("Password belum diset", {
          description: "Anda akan diarahkan untuk mengatur password",
        });

        // Simpan NIK sementara untuk set password
        sessionStorage.setItem("tempNIK", data.user?.nik || "");
        navigate("/set-password");

        return;
      }

      // Login normal - simpan token dan user data
      console.log("Login berhasil!", data);
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Login berhasil!", {
          description: `Selamat datang, ${data.user.nama}!`,
        });

        // Redirect ke dashboard petani
        console.log("redirect to profile");
        window.location.replace("/dashboard"); // tanpa simpan history
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Terjadi kesalahan saat login";

      toast.error("Login gagal!", {
        description: errorMessage,
      });
    },
  });
};

// Hook untuk set password petani pertama kali
export const usePetaniSetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: setPetaniPassword,
    onSuccess: () => {
      toast.success("Password berhasil diatur!", {
        description: "Silakan login kembali dengan password baru",
      });

      // Hapus NIK sementara dan redirect ke login
      sessionStorage.removeItem("tempNIK");
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Terjadi kesalahan saat mengatur password";

      toast.error("Gagal mengatur password!", {
        description: errorMessage,
      });
    },
  });
};

// Register petani function
const registerPetani = async (
  formData: FormData,
): Promise<PetaniRegisterResponse> => {
  const { data } = await axiosClient.post("/auth/petani-register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Fetch kecamatan list
const fetchKecamatan = async (): Promise<any> => {
  const { data } = await axiosClient.get("/wilayah/kecamatan");

  return data.data;
};

// Fetch desa by kecamatan
const fetchDesa = async (kecamatanId: number): Promise<Desa[]> => {
  const { data } = await axiosClient.get(
    `/wilayah/desa?kecamatanId=${kecamatanId}`,
  );

  return data.data || data;
};

// Fetch penyuluh list
const fetchPenyuluh = async (): Promise<any[]> => {
  const { data } = await axiosClient.get("/opsi-penyuluh");

  return data.dataDaftarPenyuluh;
};

// Fetch kelompok tani by gapoktan and desa
const fetchKelompokTani = async (
  gapoktan: string,
  desa: string,
): Promise<KelompokTani[]> => {
  const { data } = await axiosClient.get(
    `/kelompok-tani?gapoktan=${gapoktan}&desa=${desa}`,
  );

  return data.data || data;
};

// Hook untuk register petani
export const usePetaniRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerPetani,
    onSuccess: (data: PetaniRegisterResponse) => {
      // Simpan token dan user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Pendaftaran berhasil!", {
        description: `Selamat datang, ${data.user.nama}! Akun Anda telah dibuat.`,
      });

      // Redirect ke dashboard petani
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Terjadi kesalahan saat mendaftar";

      toast.error("Pendaftaran gagal!", {
        description: errorMessage,
      });
    },
  });
};

// Hook untuk fetch kecamatan
export const useKecamatan = () => {
  return useQuery({
    queryKey: ["kecamatan"],
    queryFn: fetchKecamatan,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Hook untuk fetch desa
export const useDesa = (kecamatanId: number | null) => {
  return useQuery({
    queryKey: ["desa", kecamatanId],
    queryFn: () => fetchDesa(kecamatanId!),
    enabled: !!kecamatanId,
    staleTime: 30 * 60 * 1000,
  });
};

// Hook untuk fetch penyuluh
export const usePenyuluh = () => {
  return useQuery({
    queryKey: ["penyuluh"],
    queryFn: fetchPenyuluh,
    staleTime: 30 * 60 * 1000,
  });
};

// Hook untuk fetch kelompok tani
export const useKelompokTani = (
  gapoktan: string | null,
  desa: string | null,
) => {
  return useQuery({
    queryKey: ["kelompok-tani", gapoktan, desa],
    queryFn: () => fetchKelompokTani(gapoktan!, desa!),
    enabled: !!(gapoktan && desa),
    staleTime: 30 * 60 * 1000,
  });
};

// Fetch kelompok tani by desa ID
const fetchKelompokTaniByDesa = async (
  desaId: number,
): Promise<KelompokTaniResponse> => {
  const { data } = await axiosClient.get(`/kelompok-tani/desa/${desaId}`);

  return data;
};

// Hook untuk fetch kelompok tani berdasarkan desa ID
export const useKelompokTaniByDesa = (desaId: number | null) => {
  return useQuery({
    queryKey: ["kelompok-tani-by-desa", desaId],
    queryFn: () => fetchKelompokTaniByDesa(desaId!),
    enabled: !!desaId,
    staleTime: 30 * 60 * 1000,
  });
};
