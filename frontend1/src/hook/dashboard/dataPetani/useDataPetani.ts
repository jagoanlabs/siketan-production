import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";
import {
  DataPetaniResponse,
  DataPetaniQueryParams,
  DataPetaniMetaResponse,
} from "@/types/DataPetani/dataPetani.d";
import { debounce } from "@/utils/debounce";

// State Management Hook
export const useDataPetaniState = () => {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter state
  const [verificationFilter, setVerificationFilter] = useState<string>("");

  // Sort state
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ASC" | "DESC";
  }>({ key: "id", direction: "DESC" });

  // Debounce search term
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearchTerm(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Build query parameters
  const queryParams: DataPetaniQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm || undefined,
      verified: verificationFilter || undefined,
      sortBy: sortConfig.key || "id",
      sortType: sortConfig.direction,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      verificationFilter,
      sortConfig,
    ],
  );

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleVerificationFilterChange = (filter: string) => {
    setVerificationFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSort = (key: string) => {
    let direction: "ASC" | "DESC" = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sort changes
  };

  return {
    // State
    searchTerm,
    debouncedSearchTerm,
    currentPage,
    itemsPerPage,
    verificationFilter,
    sortConfig,
    queryParams,

    // Handlers
    handleSearchChange,
    clearSearch,
    handlePageChange,
    handleVerificationFilterChange,
    handleSort,
  };
};

// Fetch DataPetani with query parameters
const fetchDataPetani = async (
  params: DataPetaniQueryParams,
): Promise<DataPetaniResponse> => {
  const { data } = await axiosClient.get("/daftar-tani", { params });

  return data;
};

// Fetch DataPetani Meta/Statistics
const fetchDataPetaniMeta = async (): Promise<DataPetaniMetaResponse> => {
  const { data } = await axiosClient.get("/daftar-tani/meta");

  return data;
};

// Delete DataPetani
const deleteDataPetani = async (id: number): Promise<void> => {
  await axiosClient.delete(`/daftar-tani/${id}`);
};

// Update verification status
const updateVerificationStatus = async (
  accountId: number,
  isVerified: boolean,
): Promise<void> => {
  await axiosClient.put(`/verify/${accountId}`, { isVerified });
};

// Custom Hooks
export const useDataPetani = (params: DataPetaniQueryParams) => {
  return useQuery({
    queryKey: ["dataPetani", params],
    queryFn: () => fetchDataPetani(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useDataPetaniMeta = () => {
  return useQuery({
    queryKey: ["dataPetaniMeta"],
    queryFn: fetchDataPetaniMeta,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteDataPetani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDataPetani,
    onSuccess: () => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ["dataPetani"] });
      queryClient.invalidateQueries({ queryKey: ["dataPetaniMeta"] });

      // toast.success("Data petani berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus data petani: ${error.message}`);
    },
  });
};

export const useUpdateVerificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      isVerified,
    }: {
      accountId: number;
      isVerified: boolean;
    }) => updateVerificationStatus(accountId, isVerified),
    onSuccess: () => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ["dataPetani"] });
      queryClient.invalidateQueries({ queryKey: ["dataPetaniMeta"] });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengupdate status verifikasi: ${error.message}`);
    },
  });
};

// Hook untuk import statistika
export const useImportDataTanaman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axiosClient.post("/upload-tanaman", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data berhasil diimport!");

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["dataPetani"] });
      queryClient.invalidateQueries({ queryKey: ["dataPetaniMeta"] });

      // Log hasil import jika ada informasi
      if (data.imported_count) {
        console.log(`Successfully imported ${data.imported_count} records`);
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengimport data statistika";

      toast.error(message);
      console.error("Import error:", error);
    },
  });
};

// Hook untuk import statistika
export const useImportDataPetani = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await axiosClient.post("/upload-data-petani", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Data berhasil diimport!");

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["dataPetani"] });
      queryClient.invalidateQueries({ queryKey: ["dataPetaniMeta"] });

      // Log hasil import jika ada informasi
      if (data.imported_count) {
        console.log(`Successfully imported ${data.imported_count} records`);
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengimport data statistika";

      toast.error(message);
      console.error("Import error:", error);
    },
  });
};
