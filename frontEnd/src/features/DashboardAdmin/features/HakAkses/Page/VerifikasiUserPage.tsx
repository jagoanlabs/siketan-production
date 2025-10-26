// hooks/useVerifikasiTableState.ts

import React, { useMemo, useState, useEffect } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";
import { Tooltip } from "@heroui/tooltip";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";

import { debounce } from "@/utils/debounce";
// pages/VerifikasiUserPage.tsx
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { VerifikasiUserQueryParams } from "@/types/HakAkses/verifikasiUser";
export type SortOption = "verified_desc" | "verified_asc" | "default";
const useVerifikasiTableState = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sorting state - simplified to match backend
  const [sortOption, setSortOption] = useState<SortOption>("verified_asc"); // Default: unverified first

  // Debounce search
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Generate query params
  const queryParams: VerifikasiUserQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
      sort: sortOption === "default" ? undefined : sortOption, // Don't send sort if default
    }),
    [currentPage, itemsPerPage, debouncedSearch, sortOption],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Sorting handlers
  const toggleVerifiedSort = () => {
    if (sortOption === "verified_asc") {
      setSortOption("verified_desc");
    } else if (sortOption === "verified_desc") {
      setSortOption("verified_asc");
    } else {
      setSortOption("verified_asc"); // Default to unverified first
    }
    setCurrentPage(1);
  };
  // Helper to get current sort display info
  const getSortInfo = () => {
    switch (sortOption) {
      case "verified_desc":
        return { label: "Terverifikasi Dulu", icon: "↓" };
      case "verified_asc":
        return { label: "Belum Verifikasi Dulu", icon: "↑" };
      default:
        return { label: "Default", icon: "" };
    }
  };

  return {
    // States
    currentPage,
    searchTerm,
    debouncedSearch,
    queryParams,
    sortOption,

    // Handlers
    handleSearchChange,
    clearSearch,
    handlePageChange,
    toggleVerifiedSort,

    // Helpers
    getSortInfo,
  };
};

import { ColumnConfig, SelectionAction } from "@/types/table";
import {
  useVerifikasiUserData,
  useApproveUser,
  useRejectUser,
  useMetaVerifikasiUser,
} from "@/hook/dashboard/hakAkses/verifikasiUser";

import type { VerifikasiUserData } from "@/types/HakAkses/verifikasiUser";

import { LoadingModal } from "@/components/LoadingModal";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import PermissionWrapper from "@/components/PermissionWrapper";

// Status Badge Component
const StatusBadge: React.FC<{ isVerified: boolean }> = ({ isVerified }) => {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        isVerified
          ? "bg-green-100 text-green-800 border-green-200"
          : "bg-yellow-100 text-yellow-800 border-yellow-200"
      }`}
    >
      {isVerified ? "✅ Terverifikasi" : "⏳ Belum Terverifikasi"}
    </span>
  );
};

export const VerifikasiUserPage = () => {
  const {
    currentPage,
    searchTerm,
    debouncedSearch,
    queryParams,
    sortOption,
    handleSearchChange,
    clearSearch,
    handlePageChange,
    toggleVerifiedSort,
    getSortInfo,
  } = useVerifikasiTableState();

  // API Hooks
  const {
    data: verifikasiResponse,
    isLoading,
    error,
    refetch: refetchVerifikasiUser,
  } = useVerifikasiUserData(queryParams);

  const approveMutation = useApproveUser();
  const rejectMutation = useRejectUser();

  const metaVerifikasiUser = useMetaVerifikasiUser();

  const [selectedItems, setSelectedItems] = useState<VerifikasiUserData[]>([]);

  // Dialog States
  const [approveDialog, setApproveDialog] = useState<{
    isOpen: boolean;
    user: VerifikasiUserData | null;
  }>({ isOpen: false, user: null });

  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    user: VerifikasiUserData | null;
  }>({ isOpen: false, user: null });

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const showApproveDialog = (user: VerifikasiUserData) => {
    confirmDialog({
      accept: () => handleApprove(user),
      reject: () => console.log("Approve cancelled"),
      acceptClassName: "confirm-btn-approve",
      acceptIcon: approveMutation.isPending
        ? "pi pi-spin pi-spinner"
        : "pi pi-check",
      acceptLabel: approveMutation.isPending
        ? "Memverifikasi..."
        : "Verifikasi User",
      header: (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Verifikasi User
          </span>
        </div>
      ),
      message: (
        <div className="space-y-3">
          <p className="text-gray-700">
            Apakah Anda yakin ingin memverifikasi user berikut?
          </p>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-900">{user.nama}</p>
            <p className="text-xs text-green-700 mt-1">
              Email: {user.email || "Tidak ada"}
            </p>
            <p className="text-xs text-green-700">Telepon: {user.no_wa}</p>
            <p className="text-xs text-green-700">
              NIK: {user.dataPetani?.NIK || "Tidak ada"}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">ℹ️ Informasi</p>
            <p className="text-xs text-blue-700 mt-1">
              User akan mendapat akses penuh ke sistem setelah diverifikasi.
            </p>
          </div>
        </div>
      ),
      rejectClassName: "confirm-btn-cancel",
      rejectIcon: "pi pi-times",
      rejectLabel: "Batal",
    });
  };

  // Fungsi untuk menampilkan reject confirmation dialog
  const showRejectDialog = (user: VerifikasiUserData) => {
    confirmDialog({
      accept: () => handleReject(user),
      reject: () => console.log("Reject cancelled"),
      acceptClassName: "confirm-btn-delete",
      acceptIcon: rejectMutation.isPending
        ? "pi pi-spin pi-spinner"
        : "pi pi-trash",
      acceptLabel: rejectMutation.isPending ? "Menolak..." : "Tolak & Hapus",
      header: (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Tolak User
          </span>
        </div>
      ),
      message: (
        <div className="space-y-3">
          <p className="text-gray-700">
            Apakah Anda yakin ingin menolak user berikut?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <p className="text-sm font-medium text-gray-900">{user.nama}</p>
            <p className="text-xs text-gray-600 mt-1">
              Email: {user.email || "Tidak ada"}
            </p>
            <p className="text-xs text-gray-600">Telepon: {user.no_wa}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-sm text-red-800 font-medium">⚠️ Peringatan</p>
            <p className="text-xs text-red-700 mt-1">
              User akan dihapus permanen dari sistem dan tidak dapat login.
            </p>
          </div>
        </div>
      ),
      rejectClassName: "confirm-btn-cancel",
      rejectIcon: "pi pi-times",
      rejectLabel: "Batal",
    });
  };

  // Approve handler
  const handleApprove = async (user: VerifikasiUserData) => {
    console.log("approve", user);

    try {
      await approveMutation.mutateAsync(user.id);
      toast.success(`🎉 User "${user.nama}" berhasil diverifikasi`);
      setApproveDialog({ isOpen: false, user: null });
    } catch (error: any) {
      toast.error(
        `❌ ${error?.response?.data?.message || "Gagal memverifikasi user"}`,
      );
    }
  };

  // Reject handler
  const handleReject = async (user: VerifikasiUserData) => {
    console.log("reject", user);
    try {
      await rejectMutation.mutateAsync(user.id);
      toast.success(`✅ User "${user.nama}" berhasil ditolak dan dihapus`);
      setRejectDialog({ isOpen: false, user: null });
    } catch (error: any) {
      toast.error(
        `❌ ${error?.response?.data?.message || "Gagal menolak user"}`,
      );
    }
  };

  // Define bulk actions
  const selectionActions: SelectionAction[] = [
    {
      label: "Verifikasi User",
      icon: <IoIosCheckmarkCircleOutline size={16} />,
      variant: "success",
      permissions: [PERMISSIONS.VERIFIKASI_USER_APPROVE],
      onClick: async (selectedItems: VerifikasiUserData[]) => {
        try {
          const itemIds = selectedItems.map((item) => item.id);

          // Show loading modal
          setShowLoadingModal(true);
          setLoadingMessage("Mengverifikasi user");
          setLoadingProgress(0);

          let successCount = 0;
          let failedCount = 0;
          const failedItems: string[] = [];

          // Sequential deletion dengan progress tracking
          for (let i = 0; i < itemIds.length; i++) {
            const itemId = itemIds[i];
            const currentItem = selectedItems.find(
              (item) => item.id === itemId,
            );

            // Update progress message
            setLoadingMessage(`Menghapus: ${currentItem?.nama || itemId}`);

            try {
              await approveMutation.mutateAsync(itemId);
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedItems.push(currentItem?.nama || `ID: ${itemId}`);
              console.error(`Failed to delete item ${itemId}:`, error);
            }

            // Update progress
            const progress = Math.round(((i + 1) / itemIds.length) * 100);

            setLoadingProgress(progress);
          }

          // Hide loading modal
          setShowLoadingModal(false);

          // Show results
          if (failedCount === 0) {
            toast.success(`${successCount} data berhasil dihapus`);
          } else if (successCount === 0) {
            toast.error(`Gagal menghapus semua data (${failedCount} data)`);
          } else {
            toast.warning(
              `${successCount} data berhasil dihapus, ${failedCount} data gagal dihapus`,
              {
                description:
                  failedItems.length > 0
                    ? `Data yang gagal: ${failedItems.slice(0, 3).join(", ")}${failedItems.length > 3 ? "..." : ""}`
                    : undefined,
                duration: 5000,
              },
            );
          }

          // Clear selection and refetch data
          setSelectedItems([]);
          await refetchVerifikasiUser();
        } catch (error) {
          setShowLoadingModal(false);
          toast.error("Terjadi kesalahan saat menghapus data");
          console.error("Bulk delete error:", error);
        }
      },
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} user yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
    },

    {
      label: "Tolak User",
      icon: <FaRegTrashAlt size={16} />,
      variant: "danger",
      permissions: [PERMISSIONS.VERIFIKASI_USER_REJECT],
      onClick: async (selectedItems: VerifikasiUserData[]) => {
        try {
          const itemIds = selectedItems.map((item) => item.id);

          // Show loading modal
          setShowLoadingModal(true);
          setLoadingMessage("Tolak user");
          setLoadingProgress(0);

          let successCount = 0;
          let failedCount = 0;
          const failedItems: string[] = [];

          // Sequential deletion dengan progress tracking
          for (let i = 0; i < itemIds.length; i++) {
            const itemId = itemIds[i];
            const currentItem = selectedItems.find(
              (item) => item.id === itemId,
            );

            // Update progress message
            setLoadingMessage(`Menghapus: ${currentItem?.nama || itemId}`);

            try {
              await rejectMutation.mutateAsync(itemId);
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedItems.push(currentItem?.nama || `ID: ${itemId}`);
              console.error(`Failed to delete item ${itemId}:`, error);
            }

            // Update progress
            const progress = Math.round(((i + 1) / itemIds.length) * 100);

            setLoadingProgress(progress);
          }

          // Hide loading modal
          setShowLoadingModal(false);

          // Show results
          if (failedCount === 0) {
            toast.success(`${successCount} user berhasil ditolak`);
          } else if (successCount === 0) {
            toast.error(`Gagal menghapus semua data (${failedCount} data)`);
          } else {
            toast.warning(
              `${successCount} data berhasil dihapus, ${failedCount} data gagal dihapus`,
              {
                description:
                  failedItems.length > 0
                    ? `Data yang gagal: ${failedItems.slice(0, 3).join(", ")}${failedItems.length > 3 ? "..." : ""}`
                    : undefined,
                duration: 5000,
              },
            );
          }

          // Clear selection and refetch data
          setSelectedItems([]);
          await refetchVerifikasiUser();
        } catch (error) {
          setShowLoadingModal(false);
          toast.error("Terjadi kesalahan saat menghapus data");
          console.error("Bulk delete error:", error);
        }
      },
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} user yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
    },
  ];

  // Column Configuration
  const columns: ColumnConfig<VerifikasiUserData>[] = useMemo(
    () => [
      {
        key: "no",
        title: "No",
        render: (_, index, paginationInfo) =>
          paginationInfo?.from + index || index + 1,
        width: "60px",
        align: "center",
      },
      {
        key: "nama",
        title: "Nama",
        render: (item) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {item.nama}
            </p>
          </div>
        ),
        width: "200px",
      },
      {
        key: "nik",
        title: "NIK",
        render: (item) => (
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
            {item.dataPetani?.NIK || "-"}
          </span>
        ),
        width: "150px",
        align: "center",
      },
      {
        key: "peran",
        title: "Profesi",
        render: (item) => (
          <span className="capitalize text-gray-700 dark:text-gray-300">
            {item.peran}
          </span>
        ),
        width: "100px",
        align: "center",
      },
      {
        key: "no_wa",
        title: "Nomor Telepon",
        render: (item) => (
          <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
            {item.no_wa}
          </span>
        ),
        width: "140px",
      },
      {
        key: "email",
        title: "Email",
        render: (item) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item.email || "-"}
          </span>
        ),
        width: "180px",
      },
      {
        key: "status",
        title: "Status Akun",
        render: (item) => <StatusBadge isVerified={item.isVerified} />,
        width: "140px",
        align: "center",
      },
      {
        key: "actions",
        title: "Aksi",
        render: (item) => (
          <div className="flex space-x-2">
            {!item.isVerified && (
              <>
                <PermissionWrapper
                  permissions={[PERMISSIONS.VERIFIKASI_USER_APPROVE]}
                >
                  <Tooltip content="Terima dan verifikasi user">
                    <button
                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        approveMutation.isPending || rejectMutation.isPending
                      }
                      onClick={() => showApproveDialog(item)}
                    >
                      {approveMutation.isPending &&
                      approveDialog.user?.id === item.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      )}
                    </button>
                  </Tooltip>
                </PermissionWrapper>

                <PermissionWrapper
                  permissions={[PERMISSIONS.VERIFIKASI_USER_REJECT]}
                >
                  <Tooltip content="Tolak dan hapus user">
                    <button
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        approveMutation.isPending || rejectMutation.isPending
                      }
                      onClick={() => showRejectDialog(item)}
                    >
                      {rejectMutation.isPending &&
                      rejectDialog.user?.id === item.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M6 18L18 6M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      )}
                    </button>
                  </Tooltip>
                </PermissionWrapper>
              </>
            )}

            {item.isVerified && (
              <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                Sudah Diverifikasi
              </div>
            )}
          </div>
        ),
        width: "120px",
        align: "center",
      },
    ],
    [
      approveMutation.isPending,
      rejectMutation.isPending,
      approveDialog.user,
      rejectDialog.user,
      sortOption,
      toggleVerifiedSort,
      getSortInfo,
    ],
  );

  // Prepare data
  const tableData = verifikasiResponse?.data || [];
  const paginationInfo = verifikasiResponse
    ? {
        total: verifikasiResponse.total,
        currentPages: verifikasiResponse.currentPages,
        maxPages: verifikasiResponse.maxPages,
        from: verifikasiResponse.from,
        to: verifikasiResponse.to,
      }
    : undefined;

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola data verifikasi user"
        title="Verifikasi User | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Verifikasi User" },
        ]}
      />

      {/* Loading Modal */}
      <LoadingModal
        isOpen={showLoadingModal}
        message={loadingMessage}
        progress={loadingProgress}
        showProgress={true}
        type="processing"
      />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 00-3-3v0a3 3 0 00-3 3v2a3 3 0 003 3zm10-10a3 3 0 11-6 0 3 3 0 016 0zm-7 7a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total User
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {metaVerifikasiUser.data?.totalUser}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Terverifikasi
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  {metaVerifikasiUser.data?.totalVerifiedUser}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {metaVerifikasiUser.data?.totalUnverifiedUser}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Halaman
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {paginationInfo?.currentPages || 1}/
                  {paginationInfo?.maxPages || 1}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Verifikasi User Table */}
        <ReusableTable<VerifikasiUserData>
          columns={columns}
          currentPage={currentPage}
          data={tableData}
          debouncedSearchTerm={debouncedSearch}
          loading={isLoading}

          // Multi-select configuration
          emptyStateMessage="Tidak ada user yang perlu diverifikasi"
          enableMultiSelect={true}
          error={error}
          getItemId={(item) => item.id}
          selectionActions={selectionActions}

          // Search
          headerActions={
            <div className="flex items-center space-x-3">
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
                onClick={() => {
                  window.location.reload();
                }}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {(approveMutation.isPending || rejectMutation.isPending)
                  ? 'Processing...'
                  : 'Refresh'}
              </button>
            </div>
          }
          paginationInfo={paginationInfo}
          searchTerm={searchTerm}
          selectedItems={selectedItems}
          searchPlaceholder="Cari nama, email, atau NIK user..."

          // Pagination
          showPagination={true}
          onPageChange={handlePageChange}

          // Styling
          showSearch={true}
          title="Daftar User Verifikasi"
          onClearSearch={clearSearch}
          onSearchChange={handleSearchChange}
          subtitle={
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kelola verifikasi dan validasi akun pengguna baru
              </p>
            </div>
          }

          // Header Actions
          onSelectionChange={setSelectedItems}
        />

        {/* Approve Confirmation Dialog */}
        {/* <ConfirmDialog
          accept={handleApprove}
          acceptClassName="confirm-btn-approve"
          acceptIcon={
            approveMutation.isPending ? "pi pi-spin pi-spinner" : "pi pi-check"
          }
          acceptLabel={
            approveMutation.isPending ? "Memverifikasi..." : "Verifikasi User"
          }
          header={
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Verifikasi User
              </span>
            </div>
          }
          message={
            approveDialog.user ? (
              <div className="space-y-3">
                <p className="text-gray-700">
                  Apakah Anda yakin ingin memverifikasi user berikut?
                </p>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900">
                    {approveDialog.user.nama}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Email: {approveDialog.user.email || "Tidak ada"}
                  </p>
                  <p className="text-xs text-green-700">
                    Telepon: {approveDialog.user.no_wa}
                  </p>
                  <p className="text-xs text-green-700">
                    NIK: {approveDialog.user.dataPetani?.NIK || "Tidak ada"}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    ℹ️ Informasi
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    User akan mendapat akses penuh ke sistem setelah
                    diverifikasi.
                  </p>
                </div>
              </div>
            ) : (
              ""
            )
          }
          rejectClassName="confirm-btn-cancel"
          rejectIcon="pi pi-times"
          rejectLabel="Batal"
          visible={approveDialog.isOpen}
          onHide={() => setApproveDialog({ isOpen: false, user: null })}
        /> */}

        {/* Reject Confirmation Dialog */}
        {/* <ConfirmDialog
          accept={handleReject}
          acceptClassName="confirm-btn-delete"
          acceptIcon={
            rejectMutation.isPending ? "pi pi-spin pi-spinner" : "pi pi-trash"
          }
          acceptLabel={
            rejectMutation.isPending ? "Menolak..." : "Tolak & Hapus"
          }
          header={
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Tolak User
              </span>
            </div>
          }
          message={
            rejectDialog.user ? (
              <div className="space-y-3">
                <p className="text-gray-700">
                  Apakah Anda yakin ingin menolak user berikut?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-sm font-medium text-gray-900">
                    {rejectDialog.user.nama}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Email: {rejectDialog.user.email || "Tidak ada"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Telepon: {rejectDialog.user.no_wa}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Peringatan
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    User akan dihapus permanen dari sistem dan tidak dapat
                    login.
                  </p>
                </div>
              </div>
            ) : (
              ""
            )
          }
          rejectClassName="confirm-btn-cancel"
          rejectIcon="pi pi-times"
          rejectLabel="Batal"
          visible={rejectDialog.isOpen}
          onHide={() => setRejectDialog({ isOpen: false, user: null })}
        /> */}
      </div>
    </div>
  );
};
