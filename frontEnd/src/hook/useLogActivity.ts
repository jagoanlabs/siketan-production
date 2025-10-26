import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/service/app-service";

export interface ActivityUser {
  id: number;
  user_id: number;
  activity: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  tbl_akun: {
    id: number;
    email: string;
    no_wa: string;
    nama: string;
    peran: string;
    foto: string;
    accountID: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ActivityQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortType?: "ASC" | "DESC";
}

export interface ActivityResponse {
  message: string;
  data: ActivityUser[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}

const fetchActivityData = async (
  params: ActivityQueryParams,
): Promise<ActivityResponse> => {
  const { data } = await axiosClient.get("/log-activity", { params });

  return data;
};

export const useActivityData = (params: ActivityQueryParams) => {
  return useQuery<ActivityResponse>({
    queryKey: ["activity", params],
    queryFn: () => fetchActivityData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
