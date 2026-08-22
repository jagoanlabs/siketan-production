import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaTriangleExclamation,
  FaClock,
  FaCircleInfo,
  FaCheckDouble,
  FaTrashCan,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa6";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import {
  Card,
  CardBody,
} from "@/components/Form/HeroCard";
import { Button } from "@/components/Form/HeroButton";
import { Chip } from "@/components/Form/HeroChip";
import { Pagination } from "@/components/Form/HeroPagination";
import { Spinner } from "@heroui/react";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/hook/useNotification";
import { NotificationItem } from "@/types/notification";

export const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isReadParam =
    activeFilter === "unread" ? false : activeFilter === "read" ? true : undefined;

  const { data: notificationData, isLoading, refetch } = useNotifications({
    page: currentPage,
    limit: itemsPerPage,
    is_read: isReadParam,
  });

  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications = notificationData?.data?.notifications || [];
  const total = notificationData?.data?.total || 0;
  const totalPages = notificationData?.data?.totalPages || 1;

  const handleFilterChange = (filter: "all" | "unread" | "read") => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleMarkAsRead = async (id: number) => {
    await markAsReadMutation.mutateAsync(id);
  };

  const handleMarkAllRead = async () => {
    if (unreadCount > 0) {
      await markAllAsReadMutation.mutateAsync();
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus notifikasi ini?")) {
      await deleteNotificationMutation.mutateAsync(id);
    }
  };

  const handleActionClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markAsReadMutation.mutateAsync(notif.id);
    }
    if (notif.action_url) {
      navigate(notif.action_url);
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "Baru saja";
      if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
      if (diffHours < 24) return `${diffHours} jam yang lalu`;
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays} hari yang lalu`;

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "DEADLINE_WARNING":
        return <FaTriangleExclamation className="text-amber-500 text-xl" />;
      case "REMINDER":
        return <FaClock className="text-blue-500 text-xl" />;
      default:
        return <FaCircleInfo className="text-emerald-500 text-xl" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DEADLINE_WARNING":
        return { label: "Peringatan Batas Waktu", color: "warning" as const };
      case "REMINDER":
        return { label: "Pengingat", color: "primary" as const };
      default:
        return { label: "Informasi", color: "default" as const };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl container mx-auto pb-10">
      <PageMeta
        description="Daftar seluruh notifikasi dan peringatan sistem"
        title="Semua Notifikasi | Admin Dashboard"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Semua Notifikasi" },
        ]}
      />

      {/* Header Card */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl flex-shrink-0">
                  <FaBell />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Notifikasi Sistem
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Daftar seluruh pemberitahuan dan peringatan batas waktu input data
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {unreadCount > 0 && (
                <Button
                  color="primary"
                  isLoading={markAllAsReadMutation.isPending}
                  size="sm"
                  startContent={<FaCheckDouble />}
                  variant="flat"
                  onPress={handleMarkAllRead}
                >
                  Tandai Semua Dibaca ({unreadCount})
                </Button>
              )}
              <Button
                size="sm"
                variant="light"
                onPress={() => refetch()}
              >
                Segarkan
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeFilter === "all"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleFilterChange("all")}
        >
          Semua ({total})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeFilter === "unread"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleFilterChange("unread")}
        >
          Belum Dibaca
          {unreadCount > 0 && (
            <span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeFilter === "unread"
                  ? "bg-white text-green-700 font-bold"
                  : "bg-red-500 text-white font-semibold"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeFilter === "read"
              ? "bg-green-600 text-white shadow-sm"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          onClick={() => handleFilterChange("read")}
        >
          Sudah Dibaca
        </button>
      </div>

      {/* List Notifikasi */}
      {isLoading ? (
        <Card>
          <CardBody>
            <div className="flex flex-col justify-center items-center py-16">
              <Spinner size="lg" />
              <span className="mt-3 text-sm text-gray-500">
                Memuat daftar notifikasi...
              </span>
            </div>
          </CardBody>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                <FaBell />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Tidak ada notifikasi
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                {activeFilter === "unread"
                  ? "Bagus! Anda tidak memiliki notifikasi baru yang belum dibaca."
                  : activeFilter === "read"
                  ? "Belum ada notifikasi yang ditandai sudah dibaca."
                  : "Belum ada pemberitahuan atau peringatan dari sistem saat ini."}
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((item) => {
            const typeInfo = getTypeLabel(item.type);
            return (
              <Card
                key={item.id}
                className={`transition-all duration-200 hover:shadow-md border ${
                  !item.is_read
                    ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                }`}
              >
                <CardBody className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Icon container */}
                    <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/60 flex-shrink-0">
                      {getIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Chip
                            color={typeInfo.color}
                            size="sm"
                            variant="flat"
                            className="text-xs font-medium"
                          >
                            {typeInfo.label}
                          </Chip>
                          {!item.is_read && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                              Baru
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          <span>{formatRelativeTime(item.createdAt)}</span>
                          <span className="hidden sm:inline"> • {formatDateTime(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h2>

                      {/* Full Message - No Truncation */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {item.message}
                      </p>

                      {/* Action buttons footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div>
                          {item.action_url && (
                            <Button
                              color="primary"
                              size="sm"
                              endContent={<FaArrowRight />}
                              variant="solid"
                              className="font-semibold"
                              onPress={() => handleActionClick(item)}
                            >
                              Input Sekarang
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {!item.is_read && (
                            <Button
                              size="sm"
                              variant="light"
                              startContent={<FaCheck />}
                              isLoading={markAsReadMutation.isPending}
                              onPress={() => handleMarkAsRead(item.id)}
                            >
                              Tandai Dibaca
                            </Button>
                          )}
                          <Button
                            color="danger"
                            size="sm"
                            variant="light"
                            isIconOnly
                            aria-label="Hapus Notifikasi"
                            isLoading={deleteNotificationMutation.isPending}
                            onPress={() => handleDelete(item.id)}
                          >
                            <FaTrashCan size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            showControls
            page={currentPage}
            total={totalPages}
            onChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
