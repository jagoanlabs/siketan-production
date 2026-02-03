// hooks/useProduct.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  MetaTokoPertanian,
  ProductQueryParams,
  ProductResponse,
} from "@/types/TokoPertanian/tokoPertanian.d";

// Fetch products
const fetchProducts = async (
  params: ProductQueryParams,
): Promise<ProductResponse> => {
  const { data } = await axiosClient.get("/product-petani-no-auth", { params });

  return data;
};

const getMetaTokoPertanian = async (): Promise<MetaTokoPertanian> => {
  const { data } = await axiosClient.get("/meta/product-petani");

  return data;
};

// Delete product
const deleteProduct = async (id: number): Promise<void> => {
  await axiosClient.delete(`/product-petani/${id}`);
};

// Hook untuk mengambil data produk
export const useProductData = (params: ProductQueryParams) => {
  return useQuery({
    queryKey: ["product-data", params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

export const useMetaTokoPertanian = () => {
  return useQuery({
    queryKey: ["meta-toko-pertanian"],
    queryFn: () => getMetaTokoPertanian(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }

      return failureCount < 3;
    },
  });
};

// Hook untuk delete produk
export const useDeleteProduct = (isBulkAction?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch product data
      queryClient.invalidateQueries({ queryKey: ["product-data"] });

      // Only show toast for individual actions, not bulk
      if (!isBulkAction) {
        toast.success("Produk berhasil dihapus");
      }
    },
    onError: (error: any) => {
      console.error("Error deleting product:", error);

      let errorMessage = "Gagal menghapus produk. Silakan coba lagi.";

      // Handle specific error cases
      if (error?.response?.status === 404) {
        errorMessage = "Produk tidak ditemukan.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Anda tidak memiliki izin untuk menghapus produk ini.";
      } else if (error?.response?.status === 400) {
        errorMessage = error?.response?.data?.message || "Data tidak valid.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Show error toast even for bulk actions (important for debugging)
      // But you could also control this with another parameter if needed
      if (!isBulkAction) {
        toast.error(errorMessage);
      }

      // For bulk actions, we'll handle errors in the calling function
      // so we still need to throw the error
      throw error;
    },
  });
};
