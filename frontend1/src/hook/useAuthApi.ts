import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./UseAuth";

import { loginApi, registerApi } from "@/service/auth-service";
import { RegisterPayload, RegisterResponse } from "@/types/auth";
import { CreatePenyuluhData } from "@/types/DataPenyuluh/createPenyuluh";
import axiosClient from "@/service/app-service";
import { ROLES } from "@/helpers/RoleHelper/roleHelpers";

// src/hooks/useAuthApi.ts

export function useLogin() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const getRedirectPath = (user: any) => {
    // Cek role user dan tentukan redirect path
    switch (user?.role?.name) {
      // Role yang redirect ke halaman utama (/)
      case ROLES.PETANI:
        return "/";

      // Role yang redirect ke dashboard admin
      case ROLES.PENYULUH:
      case ROLES.PENYULUH_SWADAYA:
      case ROLES.OPERATOR_SUPER_ADMIN:
      case ROLES.OPERATOR_POKTAN:
        return "/dashboard-admin";

      // Default fallback
      default:
        return "/";
    }
  };

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      try {
        console.log("useLogin: API Response received", data);

        // Validasi response data
        if (!data?.data?.token) {
          console.error("useLogin: No token in response:", data);
          toast.error("Login gagal: Token tidak diterima");

          return;
        }

        if (!data?.data?.user) {
          console.error("useLogin: No user data in response:", data);
          toast.error("Login gagal: Data user tidak diterima");

          return;
        }

        const { user, token } = data.data;

        console.log("useLogin: Extracted user and token", { user, token });

        // Update AuthContext
        authLogin(user, token);

        console.log("useLogin: AuthContext updated");

        // Tentukan redirect path berdasarkan role
        const redirectPath = getRedirectPath(user);

        console.log("useLogin: Determined redirect path", {
          redirectPath,
          userRole: user?.role?.name,
        });

        // Show success toast
        toast.success("Login berhasil!", {
          description: `Selamat datang, ${user.nama || user.name || user.email}`,
        });

        console.log("useLogin: About to navigate to", redirectPath);

        // Gunakan setTimeout untuk memastikan state ter-update dulu
        setTimeout(() => {
          console.log("useLogin: Executing navigation to", redirectPath);
          navigate(redirectPath, { replace: true });

          // Double check navigation
          setTimeout(() => {
            if (window.location.pathname !== redirectPath) {
              console.warn("useLogin: Navigate failed, using window.location");
              window.location.href = redirectPath;
            }
          }, 100);
        }, 100);
      } catch (error) {
        console.error("useLogin: Error in onSuccess:", error);
        toast.error("Terjadi kesalahan saat login");
      }
    },
    onError: (error: any) => {
      console.error("useLogin: Login error:", error);

      // Handle different error types
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Terjadi kesalahan saat login";

      toast.error("Login Gagal", {
        description: errorMessage,
      });
    },
    onMutate: () => {
      console.log("useLogin: Login mutation started");
    },
    onSettled: (data, error) => {
      console.log("useLogin: Login mutation completed", {
        success: !!data,
        error: !!error,
      });
    },
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: registerApi,
    onSuccess: (data, variables) => {
      console.log("useRegister: Registration successful:", data);

      toast.success("Registrasi Berhasil!", {
        description: `Akun untuk ${variables.nama} telah berhasil dibuat. Silakan login untuk melanjutkan.`,
        duration: 5000,
        action: {
          label: "Login",
          onClick: () => {
            window.location.href = "/login";
          },
        },
      });
    },
    onError: (error: any) => {
      console.error("useRegister: Registration failed:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Terjadi kesalahan saat mendaftar";

      toast.error("Registrasi Gagal", {
        description: errorMessage,
        duration: 4000,
      });
    },
  });
}

const registerPenyuluh = async (data: CreatePenyuluhData): Promise<any> => {
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
    const response = await axiosClient.post(
      `/auth/register-penyuluh`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

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

export const useRegisterPenyuluh = () => {
  return useMutation({
    mutationFn: registerPenyuluh,
    onError: (error) => {
      console.error("Error creating penyuluh:", error);
    },
    onSuccess: () => {
      toast.success(
        "berhasil register data penyuluh, tunggu verifikasi dari admin",
      );
    },
  });
};
