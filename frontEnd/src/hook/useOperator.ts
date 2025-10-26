import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import axiosClient from "@/service/app-service";
import {
  CreateOperatorRequest,
  CreateOperatorResponse,
  UpdateOperatorRequest,
  UpdateOperatorResponse,
} from "@/types/Operator/create-operator";
import {
  OperatorQueryParams,
  OperatorResponse,
} from "@/types/Operator/operator";
import { Operator } from "@/types/Operator/operator";

export const operatorService = {
  // Get all operators
  getOperators: async (
    params?: OperatorQueryParams,
  ): Promise<OperatorResponse> => {
    const response = await axiosClient.get("/daftar-operator", { params });

    return response.data;
  },

  // Get operator by ID
  getOperatorById: async (
    id: number,
  ): Promise<{ data: Operator; message: string }> => {
    const response = await axiosClient.get(`/daftar-operator/${id}`);

    return response.data;
  },

  // Delete operator
  deleteOperator: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/daftar-operator/${id}`);

    return response.data;
  },

  // Update operator (untuk edit nanti)
  updateOperatorById: async (
    id: number,
    data: UpdateOperatorRequest,
    foto?: File,
  ): Promise<UpdateOperatorResponse> => {
    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      formData.append(key, (data as any)[key]);
    });

    // Append photo if provided
    if (foto) {
      formData.append("foto", foto);
    }

    const response = await axiosClient.put(`/daftar-operator/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  uploadOperatorData: async (file: File): Promise<{ message: string }> => {
    const formData = new FormData();

    formData.append("file", file);
    const response = await axiosClient.post("/upload-data-operator", formData);

    return response.data;
  },

  createOperator: async (
    data: CreateOperatorRequest,
    foto?: File,
  ): Promise<CreateOperatorResponse> => {
    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      formData.append(key, (data as any)[key]);
    });

    // Append photo if provided
    if (foto) {
      formData.append("foto", foto);
    }

    const response = await axiosClient.post("/daftar-operator/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};

export const operatorKeys = {
  all: ["operators"] as const,
  lists: () => [...operatorKeys.all, "list"] as const,
  list: (params: OperatorQueryParams) =>
    [...operatorKeys.lists(), params] as const,
  details: () => [...operatorKeys.all, "detail"] as const,
  detail: (id: number) => [...operatorKeys.details(), id] as const,
};

// Get all operators
export const useOperators = (params?: OperatorQueryParams) => {
  return useQuery({
    queryKey: operatorKeys.list(params || {}),
    queryFn: () => operatorService.getOperators(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get operator by ID
export const useOperator = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: operatorKeys.detail(id),
    queryFn: () => operatorService.getOperatorById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Delete operator mutation
export const useDeleteOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => operatorService.deleteOperator(id),
    onSuccess: (data) => {
      // Invalidate and refetch operator queries
      queryClient.invalidateQueries({ queryKey: operatorKeys.all });
      toast.success(data.message || "Operator berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus operator");
    },
  });
};

// Update operator mutation
export const useUpdateOperatorById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      foto,
    }: {
      id: number;
      data: UpdateOperatorRequest;
      foto?: File;
    }) => operatorService.updateOperatorById(id, data, foto),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: operatorKeys.all });
      toast.success(response.message || "Operator berhasil diupdate");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate operator");
    },
  });
};

export const useUploadOperatorData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: operatorService.uploadOperatorData,
    onSuccess: (data) => {
      toast.success(data.message || "Data operator berhasil diupload");
      queryClient.invalidateQueries({ queryKey: ["operators"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal upload data operator",
      );
    },
  });
};

export const useBulkDeleteOperators = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operatorIds: number[]) => {
      const results = {
        success: 0,
        failed: 0,
        errors: [] as Array<{ id: number; error: string }>,
      };

      // Loop through each operator ID and delete one by one
      for (const id of operatorIds) {
        try {
          await operatorService.deleteOperator(id);
          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push({
            id,
            error:
              error.response?.data?.message || error.message || "Unknown error",
          });
        }

        // Small delay to prevent overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: operatorKeys.all });

      if (results.success > 0) {
        toast.success(`Berhasil menghapus ${results.success} operator`);
      }

      if (results.failed > 0) {
        toast.warning(`${results.failed} operator gagal dihapus`);

        // Show detailed errors for failed deletions
        results.errors.forEach((error) => {
          toast.error(`Operator ID ${error.id}: ${error.error}`);
        });
      }
    },
    onError: (error: any) => {
      toast.error("Gagal melakukan bulk delete: " + error.message);
    },
  });
};

export const useCreateOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      foto,
    }: {
      data: CreateOperatorRequest;
      foto?: File;
    }) => operatorService.createOperator(data, foto),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: operatorKeys.all });
      toast.success(response.message || "Operator berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan operator",
      );
    },
  });
};
