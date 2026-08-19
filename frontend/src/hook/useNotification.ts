import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/service/app-service";
import {
  NotificationListResponse,
  UnreadCountResponse,
} from "@/types/notification";

interface UseNotificationsParams {
  page?: number;
  limit?: number;
  is_read?: boolean | string;
}

export const useNotifications = (params: UseNotificationsParams = {}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async (): Promise<NotificationListResponse> => {
      const { data } = await axiosClient.get("/notification", { params });
      return data;
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["unreadNotificationCount"],
    queryFn: async (): Promise<number> => {
      const { data } = await axiosClient.get<UnreadCountResponse>(
        "/notification/unread-count",
      );
      return data.data.unreadCount;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Refresh every 1 minute
    refetchOnWindowFocus: true,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosClient.put(`/notification/${id}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosClient.put("/notification/read-all");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axiosClient.delete(`/notification/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
};
