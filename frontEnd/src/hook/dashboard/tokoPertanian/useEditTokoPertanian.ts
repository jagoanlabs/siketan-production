// hook/dashboard/tokoPertanian/useEditTokoPertanian.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ProductDetailResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from "@/types/TokoPertanian/editTokoPertanian.d";
import { axiosClient } from "@/service/app-service";
import {
  NikCheckResponse,
  NipCheckResponse,
} from "@/types/TokoPertanian/createTokoPertanian";

// Get Product Detail
export const useGetProductDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["product-detail", id],
    queryFn: async (): Promise<ProductDetailResponse> => {
      if (!id) throw new Error("Product ID is required");

      const response = await axiosClient.get(`/product-petani/${id}`);

      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Check NIK for Petani (Edit version)
export const useEditCheckNik = () => {
  return useMutation({
    mutationFn: async ({ nik }: { nik: string }): Promise<NikCheckResponse> => {
      const response = await axiosClient.post("/cek-nik", { nik });

      return response.data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Terjadi kesalahan saat mengecek NIK";

      toast.error(errorMessage);
    },
  });
};

// Check NIP for Penyuluh (Edit version)
export const useEditCheckNip = () => {
  return useMutation({
    mutationFn: async ({ NIP }: { NIP: string }): Promise<NipCheckResponse> => {
      const response = await axiosClient.post("/cek-nip", { NIP });

      return response.data;
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Terjadi kesalahan saat mengecek NIP";

      toast.error(errorMessage);
    },
  });
};

// Update Product
export const useUpdateProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateProductRequest,
    ): Promise<UpdateProductResponse> => {
      const formData = new FormData();

      // Append all form fields
      formData.append("nik", data.nik);
      formData.append("profesiPenjual", data.profesiPenjual);
      formData.append("namaProducts", data.namaProducts);
      formData.append("stok", data.stok.toString());
      formData.append("satuan", data.satuan);
      formData.append("harga", data.harga);
      formData.append("deskripsi", data.deskripsi);
      formData.append("status", data.status);

      // Handle file upload
      if (data.fotoTanaman instanceof File) {
        formData.append("fotoTanaman", data.fotoTanaman);
      }

      const response = await axiosClient.post(
        `/daftar-penjual/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch product detail
      queryClient.invalidateQueries({
        queryKey: ["product-detail", productId],
      });

      // Invalidate product list
      queryClient.invalidateQueries({
        queryKey: ["products-list"],
      });

      toast.success(data.message || "Produk berhasil diperbarui!");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal memperbarui produk";

      toast.error(errorMessage);

      // Log error for debugging
      console.error(
        "Update product error:",
        error?.response?.data || error.message,
      );
    },
  });
};

// Auto-check NIK/NIP based on product detail
export const useAutoCheckUserData = () => {
  const checkNikMutation = useEditCheckNik();
  const checkNipMutation = useEditCheckNip();

  const autoCheckUserData = async (
    productDetail: ProductDetailResponse["data"],
  ) => {
    try {
      const { profesiPenjual, tbl_akun } = productDetail;

      if (profesiPenjual === "petani" && tbl_akun.dataPetani) {
        const nikToCheck = tbl_akun.dataPetani.nik;
        const response = await checkNikMutation.mutateAsync({
          nik: nikToCheck,
        });

        return {
          userData: response.user,
          isSuccess: true,
          profesi: "petani" as const,
        };
      } else if (profesiPenjual === "penyuluh" && tbl_akun.dataPenyuluh) {
        const nipToCheck = tbl_akun.dataPenyuluh.nik;
        const response = await checkNipMutation.mutateAsync({
          NIP: nipToCheck,
        });

        return {
          userData: response.user,
          isSuccess: true,
          profesi: "penyuluh" as const,
        };
      }

      return {
        userData: null,
        isSuccess: false,
        profesi: null,
      };
    } catch (error) {
      return {
        userData: null,
        isSuccess: false,
        profesi: null,
        error,
      };
    }
  };

  return {
    autoCheckUserData,
    isCheckingNik: checkNikMutation.isPending,
    isCheckingNip: checkNipMutation.isPending,
    isChecking: checkNikMutation.isPending || checkNipMutation.isPending,
  };
};
