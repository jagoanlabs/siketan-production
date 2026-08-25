import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaTriangleExclamation,
  FaClock,
  FaCircleInfo,
  FaCheckDouble,
} from "react-icons/fa6";
import { Dropdown } from "./dropdown/Dropdown";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hook/useNotification";
import { NotificationItem } from "@/types/notification";

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: notificationData, isLoading } = useNotifications({ limit: 10 });
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationData?.data?.notifications || [];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markAsReadMutation.mutateAsync(notif.id);
    }
    closeDropdown();
    const targetUrl =
      notif.action_url === "/dashboard-admin/data-tanaman/create" || notif.type === "DEADLINE_WARNING"
        ? "/dashboard-admin/statistik-pertanian/create"
        : notif.action_url;

    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (unreadCount > 0) {
      await markAllAsReadMutation.mutateAsync();
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "Baru saja";
      if (diffMinutes < 60) return `${diffMinutes} mnt lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays} hari lalu`;

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DEADLINE_WARNING":
        return <FaTriangleExclamation className="text-amber-500 text-lg" />;
      case "REMINDER":
        return <FaClock className="text-blue-500 text-lg" />;
      default:
        return <FaCircleInfo className="text-emerald-500 text-lg" />;
    }
  };

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="dropdown-toggle relative flex items-center justify-center w-10 h-10 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 lg:h-11 lg:w-11 transition-colors shadow-sm"
        onClick={toggleDropdown}
      >
        <FaBell className="text-lg text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-white bg-red-500 rounded-full border-2 border-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <Dropdown
        className="w-[340px] sm:w-[380px] p-0 overflow-hidden shadow-2xl border border-gray-200 bg-white right-0 rounded-2xl"
        isOpen={isOpen}
        onClose={closeDropdown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/90">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-900">
              Notifikasi
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              disabled={markAllAsReadMutation.isPending}
              onClick={handleMarkAllRead}
            >
              <FaCheckDouble className="text-xs" />
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* List Notifications */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-100 bg-white">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">
              Memuat notifikasi...
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-10 text-center px-4 bg-white">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2 text-xl">
                <FaBell />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Tidak ada notifikasi
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Semua pemberitahuan sistem akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  !item.is_read
                    ? "bg-blue-50/50"
                    : "bg-white"
                }`}
                onClick={() => handleNotificationClick(item)}
              >
                <div className="mt-0.5 flex-shrink-0">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        !item.is_read
                          ? "text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-3 leading-relaxed">
                    {item.message}
                  </p>
                  {item.action_url && (
                    <div className="mt-2">
                      <span className="inline-block text-[11px] font-medium text-blue-600 hover:underline">
                        Input Sekarang &rarr;
                      </span>
                    </div>
                  )}
                </div>
                {!item.is_read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 text-center border-t border-gray-100 bg-gray-50/90">
          <button
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors w-full py-1"
            onClick={() => {
              closeDropdown();
              navigate("/dashboard-admin/notifikasi");
            }}
          >
            Lihat Semua Notifikasi &rarr;
          </button>
        </div>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;
