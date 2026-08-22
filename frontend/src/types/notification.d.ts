export interface NotificationMetadata {
  targetMonth?: string;
  targetYear?: number;
  deadline?: string;
  daysRemaining?: number;
  [key: string]: any;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "DEADLINE_WARNING" | "REMINDER" | "INFO" | string;
  category: string;
  is_read: boolean;
  read_at: string | null;
  action_url: string | null;
  metadata: NotificationMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: {
    notifications: NotificationItem[];
    total: number;
    totalAll?: number;
    unreadCount: number;
    readCount?: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}
