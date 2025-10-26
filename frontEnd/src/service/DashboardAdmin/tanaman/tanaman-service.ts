import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";

// Types
export interface DataTanaman {
  id: number;
  statusKepemilikanLahan: string;
  luasLahan: string;
  kategori: string;
  jenis: string;
  komoditas: string;
  periodeMusimTanam: string;
  periodeBulanTanam: string;
  prakiraanLuasPanen: number;
  prakiraanProduksiPanen: number;
  prakiraanBulanPanen: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_petaniId: number;
  dataPetani?: any;
}

export interface TanamanResponse {
  message: string;
  data: DataTanaman[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

export interface TanamanDetailResponse {
  message: string;
  data: DataTanaman;
}

export interface CreateTanamanData {
  statusKepemilikanLahan: string;
  luasLahan: string;
  kategori: string;
  jenis: string;
  komoditas: string;
  periodeMusimTanam: string;
  periodeBulanTanam: string;
  prakiraanLuasPanen: number;
  prakiraanProduksiPanen: number;
  prakiraanBulanPanen: string;
  fk_petaniId: number;
}

// Get all tanaman with pagination
export const getAllTanaman = async (
  page: number = 1,
  limit: number = 10,
): Promise<TanamanResponse> => {
  try {
    const response = await axiosClient.get("/list-tanaman", {
      params: { page, limit },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching tanaman data:", error);
    throw error;
  }
};

// Get tanaman detail by ID
export const getTanamanById = async (
  id: number,
): Promise<TanamanDetailResponse> => {
  try {
    const response = await axiosClient.get(`/list-tanaman/${id}`);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching tanaman detail:", error);
    toast.error("Gagal mengambil detail tanaman");
    throw error;
  }
};

// Create new tanaman
export const createTanaman = async (data: CreateTanamanData): Promise<any> => {
  try {
    const response = await axiosClient.post("/list-tanaman", data);

    toast.success("Data tanaman berhasil ditambahkan");

    return response.data;
  } catch (error: any) {
    console.error("Error creating tanaman:", error);
    const errorMessage =
      error.response?.data?.message || "Gagal menambahkan data tanaman";

    toast.error(errorMessage);
    throw error;
  }
};

// Update tanaman by ID
export const updateTanaman = async (
  id: number,
  data: Partial<CreateTanamanData>,
): Promise<any> => {
  try {
    const response = await axiosClient.put(`/list-tanaman/${id}`, data);

    toast.success("Data tanaman berhasil diperbarui");

    return response.data;
  } catch (error: any) {
    console.error("Error updating tanaman:", error);
    const errorMessage =
      error.response?.data?.message || "Gagal memperbarui data tanaman";

    toast.error(errorMessage);
    throw error;
  }
};

// Delete tanaman by ID
export const deleteTanaman = async (
  id: number,
  isBulkAction: boolean = false,
): Promise<any> => {
  try {
    const response = await axiosClient.delete(`/list-tanaman/${id}`);

    if (!isBulkAction) {
      toast.success("Data tanaman berhasil dihapus");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error deleting tanaman:", error);
    const errorMessage =
      error.response?.data?.message || "Gagal menghapus data tanaman";

    toast.error(errorMessage);
    throw error;
  }
};

// Upload Excel file
export const uploadTanamanExcel = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosClient.post("/upload-tanaman", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("File Excel berhasil diupload");

    return response.data;
  } catch (error: any) {
    console.error("Error uploading Excel:", error);
    const errorMessage =
      error.response?.data?.message || "Gagal mengupload file Excel";

    toast.error(errorMessage);
    throw error;
  }
};
