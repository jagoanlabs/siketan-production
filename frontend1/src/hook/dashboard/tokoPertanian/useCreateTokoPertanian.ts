// hooks/useCreateProduct.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  NikCheckRequest,
  NikCheckResponse,
  NipCheckRequest,
  NipCheckResponse,
  CreateProductRequest,
  CreateProductResponse,
} from "@/types/TokoPertanian/createTokoPertanian.d";

// Check NIK function
const checkNik = async (data: NikCheckRequest): Promise<NikCheckResponse> => {
  const response = await axiosClient.post("/cek-nik", data);

  return response.data;
};

// Check NIP function
const checkNip = async (data: NipCheckRequest): Promise<NipCheckResponse> => {
  const response = await axiosClient.post("/cek-nip", data);

  return response.data;
};

// Create product function
const createProduct = async (
  data: CreateProductRequest,
): Promise<CreateProductResponse> => {
  const formData = new FormData();

  formData.append("nik", data.nik);
  formData.append("profesiPenjual", data.profesiPenjual);
  formData.append("namaProducts", data.namaProducts);
  formData.append("stok", data.stok.toString());
  formData.append("satuan", data.satuan);
  formData.append("harga", data.harga);
  formData.append("deskripsi", data.deskripsi);
  formData.append("status", data.status);

  if (data.fotoTanaman) {
    formData.append("fotoTanaman", data.fotoTanaman);
  }

  console.log("Creating product with data:", {
    nik: data.nik,
    profesiPenjual: data.profesiPenjual,
    namaProducts: data.namaProducts,
    hasImage: !!data.fotoTanaman,
  });

  const response = await axiosClient.post("/daftar-penjual/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Hook untuk check NIK
export const useCheckNik = () => {
  return useMutation({
    mutationFn: checkNik,
    onError: (error: any) => {
      console.error("Error checking NIK:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "NIK tidak ditemukan. Coba cari yang lain.";

      toast.error(errorMessage);
    },
  });
};

// Hook untuk check NIP
export const useCheckNip = () => {
  return useMutation({
    mutationFn: checkNip,
    onError: (error: any) => {
      console.error("Error checking NIP:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "NIP tidak ditemukan. Coba cari yang lain.";

      toast.error(errorMessage);
    },
  });
};

// Hook untuk create product
export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success(data.message || "Produk berhasil dibuat");
    },
    onError: (error: any) => {
      console.error("Error creating product:", error);

      let errorMessage = "Gagal membuat produk. Silakan coba lagi.";

      if (error?.response?.status === 400) {
        if (error?.response?.data?.message?.includes("Wrong Image Format")) {
          errorMessage =
            "Format gambar tidak valid. Gunakan PNG, JPG, JPEG, atau GIF.";
        } else {
          errorMessage =
            error?.response?.data?.message || "Data yang dikirim tidak valid.";
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};
