import { useState, useMemo, useEffect } from "react";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { Spinner } from "@heroui/spinner";
import { FaRegTrashAlt, FaUndo } from "react-icons/fa";
import { MdRestore, MdDeleteForever } from "react-icons/md";
import { ConfirmDialog } from "primereact/confirmdialog";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { LoadingModal } from "@/components/LoadingModal";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { debounce } from "@/utils/debounce";
import { DataSampah, SampahQueryParams } from "@/types/LogActivity/dataSampah";
import { ColumnConfig, PaginationInfo, SelectionAction } from "@/types/table";
import { formatDate } from "@/utils/dateUtils";
import { formatRelativeTime } from "@/utils/formatDate";
import {
  useDeletePermanent,
  useRestoreData,
  useSampahData,
} from "@/hook/dashboard/aktivitas/useDataSampah";

// Icons

export const useSampahTableState = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search using your existing utility
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Generate query params
  const queryParams: SampahQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
    }),
    [currentPage, itemsPerPage, debouncedSearch],
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

  return {
    currentPage,
    searchTerm,
    debouncedSearch,
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

// Hook untuk bulk operations
const useBulkSampahOperations = (isBulkAction = false) => {
  const restoreMutation = useRestoreData();
  const deleteMutation = useDeletePermanent();

  return {
    restoreMutation: {
      mutateAsync: async (id: number) => {
        await restoreMutation.mutateAsync(id);
        if (!isBulkAction) {
          // Individual action will show toast from original hook
        }
      },
      isPending: restoreMutation.isPending,
    },
    deleteMutation: {
      mutateAsync: async (id: number) => {
        await deleteMutation.mutateAsync(id);
        if (!isBulkAction) {
          // Individual action will show toast from original hook
        }
      },
      isPending: deleteMutation.isPending,
    },
  };
};

export const DataSampahPage = () => {
  const {
    currentPage,
    searchTerm,
    debouncedSearch,
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  } = useSampahTableState();

  // API Hooks
  const {
    data: sampahResponse,
    isLoading,
    error,
    refetch,
  } = useSampahData(queryParams);

  // Mutations
  const restoreMutation = useRestoreData();
  const deleteMutation = useDeletePermanent();
  const bulkOperations = useBulkSampahOperations(true);

  // Selection state for bulk actions
  const [selectedItems, setSelectedItems] = useState<DataSampah[]>([]);

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Dialog States (for individual actions)
  const [restoreDialog, setRestoreDialog] = useState<{
    isOpen: boolean;
    item: DataSampah | null;
  }>({ isOpen: false, item: null });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: DataSampah | null;
  }>({ isOpen: false, item: null });

  // Bulk action handlers (without confirmMessage to avoid dialog conflicts)
  const handleBulkDelete = async (selectedItems: DataSampah[]) => {
    try {
      const itemIds = selectedItems.map((item) => item.id);

      // Show loading modal
      setShowLoadingModal(true);
      setLoadingMessage("Menghapus data permanen");
      setLoadingProgress(0);
      let successCount = 0;
      let failedCount = 0;
      const failedItems: string[] = [];

      // Sequential deletion with progress tracking
      for (let i = 0; i < itemIds.length; i++) {
        const itemId = itemIds[i];
        const currentItem = selectedItems.find((item) => item.id === itemId);

        // Update progress message
        setLoadingMessage(
          `Menghapus permanen: ${currentItem?.tbl_akun.nama || itemId}`,
        );

        try {
          await bulkOperations.deleteMutation.mutateAsync(itemId);
          successCount++;
        } catch (error: any) {
          failedCount++;
          failedItems.push(currentItem?.tbl_akun.nama || `ID: ${itemId}`);
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
        toast.success(`${successCount} data berhasil dihapus permanen`);
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
      await refetch();
    } catch (error) {
      setShowLoadingModal(false);
      toast.error("Terjadi kesalahan saat menghapus data");
      console.error("Bulk delete error:", error);
    }
  };

  const handleBulkRestore = async (selectedItems: DataSampah[]) => {
    try {
      const itemIds = selectedItems.map((item) => item.id);

      // Show loading modal
      setShowLoadingModal(true);
      setLoadingMessage("Restore data");
      setLoadingProgress(0);

      let successCount = 0;
      let failedCount = 0;
      const failedItems: string[] = [];

      // Sequential restore with progress tracking
      for (let i = 0; i < itemIds.length; i++) {
        const itemId = itemIds[i];
        const currentItem = selectedItems.find((item) => item.id === itemId);

        // Update progress message
        setLoadingMessage(
          `Restore data: ${currentItem?.tbl_akun.nama || itemId}`,
        );

        try {
          await bulkOperations.restoreMutation.mutateAsync(itemId);
          successCount++;
        } catch (error: any) {
          failedCount++;
          failedItems.push(currentItem?.tbl_akun.nama || `ID: ${itemId}`);
          console.error(`Failed to restore item ${itemId}:`, error);
        }

        // Update progress
        const progress = Math.round(((i + 1) / itemIds.length) * 100);

        setLoadingProgress(progress);
      }

      // Hide loading modal
      setShowLoadingModal(false);

      // Show results
      if (failedCount === 0) {
        toast.success(`${successCount} data berhasil direstore`);
      } else if (successCount === 0) {
        toast.error(`Gagal restore semua data (${failedCount} data)`);
      } else {
        toast.warning(
          `${successCount} data berhasil direstore, ${failedCount} data gagal direstore`,
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
      await refetch();
    } catch (error) {
      setShowLoadingModal(false);
      toast.error("Terjadi kesalahan saat restore data");
      console.error("Bulk restore error:", error);
    }
  };

  // Define bulk actions (tanpa confirmMessage untuk menghindari konflik dialog)
  const selectionActions: SelectionAction[] = [
    {
      label: "Hapus Permanen",
      icon: <MdDeleteForever size={16} />,
      variant: "danger",
      onClick: handleBulkDelete,
      // Tidak menggunakan confirmMessage karena sudah ada PrimeReact ConfirmDialog
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} data sampah yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
    },
    {
      label: "Restore Data",
      icon: <MdRestore size={16} />,
      variant: "success",
      onClick: handleBulkRestore,
      // Tidak menggunakan confirmMessage karena sudah ada PrimeReact ConfirmDialog
      confirmMessage: `Apakah Anda yakin ingin mengembalikan {count} data sampah yang dipilih?`,
    },
  ];

  // Handle page and search changes with selection clearing
  const handlePageChangeWithClear = (page: number) => {
    handlePageChange(page);
    setSelectedItems([]); // Clear selection when page changes
  };

  const handleSearchChangeWithClear = (value: string) => {
    handleSearchChange(value);
    setSelectedItems([]); // Clear selection when search changes
  };

  const handleClearSearchWithClear = () => {
    clearSearch();
    setSelectedItems([]);
  };

  // Column Configuration
  const columns: ColumnConfig<DataSampah>[] = useMemo(
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
        title: "Nama User",
        render: (item) => (
          <div className="flex items-center space-x-3">
            <img
              alt={item.tbl_akun.nama}
              className="w-8 h-8 rounded-full object-cover"
              src={item.tbl_akun.foto || "https://via.placeholder.com/40"}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/40";
              }}
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {item.tbl_akun.nama}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.tbl_akun.email}
              </p>
            </div>
          </div>
        ),
        width: "250px",
      },
      {
        key: "peran",
        title: "Role User",
        render: (item) => (
          <Chip className="bg-green-500 text-white">{item.tbl_akun.peran}</Chip>
        ),
        width: "140px",
        align: "center",
      },
      {
        key: "activity",
        title: "Aktivitas User",
        render: (item) => (
          <div>
            <p className="font-medium text-sm">{item.activity}</p>
            {item.detail && (
              <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">
                {item.detail}
              </p>
            )}
          </div>
        ),
        width: "220px",
      },
      {
        key: "createdAt",
        title: "Date",
        render: (item) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatRelativeTime(item.createdAt)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(item.createdAt)}
            </p>
          </div>
        ),
        width: "160px",
      },
      {
        key: "actions",
        title: "Aksi",
        render: (item) => (
          <div className="flex space-x-1">
            <Tooltip content="Restore data ini">
              <Button
                isIconOnly
                color="success"
                isLoading={restoreMutation.isPending}
                size="sm"
                variant="light"
                onPress={() => setRestoreDialog({ isOpen: true, item })}
              >
                <FaUndo className="w-4 h-4" />
              </Button>
            </Tooltip>

            <Tooltip content="Hapus permanen">
              <Button
                isIconOnly
                color="danger"
                isLoading={deleteMutation.isPending}
                size="sm"
                variant="light"
                onPress={() => setDeleteDialog({ isOpen: true, item })}
              >
                <FaRegTrashAlt className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        ),
        width: "100px",
        align: "center",
      },
    ],
    [restoreMutation.isPending, deleteMutation.isPending],
  );

  // Prepare data
  const tableData = sampahResponse?.data || [];
  const paginationInfo: PaginationInfo = sampahResponse
    ? {
        total: sampahResponse.total,
        currentPages: sampahResponse.currentPages,
        maxPages: sampahResponse.maxPages,
        from: sampahResponse.from,
        to: sampahResponse.to,
      }
    : {
        total: 0,
        currentPages: 1,
        maxPages: 1,
        from: 1,
        to: 0,
      };

  // Header actions with selection counter
  const headerActions = (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Show selected count when items are selected */}
      {selectedItems.length > 0 && (
        <div className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
          {selectedItems.length} item dipilih
        </div>
      )}

      <Button
        color="primary"
        isLoading={isLoading}
        startContent={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        }
        variant="bordered"
        onPress={() => refetch()}
      >
        <span className="hidden sm:inline">Refresh</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola data sampah"
        title="Data Sampah | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Data Sampah" },
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Sampah
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {paginationInfo?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
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
                Data Terbaru
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {tableData.length > 0
                  ? formatRelativeTime(tableData[0].createdAt)
                  : "-"}
              </p>
            </div>
          </div>
        </div>

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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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

      {/* Enhanced Data Sampah Table with Multiple Select */}
      <ReusableTable<DataSampah>
        // Data & Loading
        currentPage={currentPage}
        data={tableData}
        error={error}

        // Columns Configuration
        columns={columns}

        // Search
        debouncedSearchTerm={debouncedSearch}
        emptyStateMessage="Tidak ada data sampah yang ditemukan"
        enableMultiSelect={true}
        getItemId={(item) => item.id}
        searchPlaceholder="Cari nama user..."

        // Pagination
        headerActions={headerActions}
        loading={isLoading}
        onPageChange={handlePageChangeWithClear}

        // Multiple Selection - NEW
        paginationInfo={paginationInfo}
        searchTerm={searchTerm}
        selectedItems={selectedItems}
        showPagination={true}
        selectionActions={selectionActions}

        // Styling & Behavior
        showSearch={true}
        subtitle="Data yang telah dihapus dan dapat direstore atau dihapus permanen"
        title="Data Sampah"
        onClearSearch={handleClearSearchWithClear}
        onSearchChange={handleSearchChangeWithClear}
        onSelectionChange={setSelectedItems}
      />

      {/* Individual Action Confirmation Dialogs */}
      {/* Restore Confirmation Dialog */}
      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        accept={async () => {
          try {
            await restoreMutation.mutateAsync(restoreDialog.item?.id || 0);
            toast.success("Data berhasil dipulihkan");
            setRestoreDialog({ isOpen: false, item: null });
            await refetch();
          } catch (error) {
            toast.error("Gagal memulihkan data. Silakan coba lagi.");
            console.error("Restore error:", error);
          }
        }}
        acceptClassName="bg-green-500 hover:bg-green-600 text-white px-5 py-2 text-sm font-medium"
        acceptIcon="pi pi-check"
        acceptLabel="Ya, Pulihkan"
        closeOnEscape={true}
        draggable={false}
        footer={
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button
              color="secondary"
              size="sm"
              startContent={
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
              }
              variant="bordered"
              onPress={() => setRestoreDialog({ isOpen: false, item: null })}
            >
              Batal
            </Button>
            <Button
              color="success"
              disabled={restoreMutation.isPending}
              size="sm"
              startContent={
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
              }
              onPress={async () => {
                try {
                  await restoreMutation.mutateAsync(
                    restoreDialog.item?.id || 0,
                  );
                  toast.success("Data berhasil dipulihkan");
                  setRestoreDialog({ isOpen: false, item: null });
                  await refetch();
                } catch (error) {
                  toast.error("Gagal memulihkan data.");
                  console.error("Restore error:", error);
                }
              }}
            >
              {restoreMutation.isPending ? (
                <>
                  <Spinner size="sm" /> Memulihkan...
                </>
              ) : (
                "Ya, Pulihkan"
              )}
            </Button>
          </div>
        }
        message={
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
              Pulihkan Data?
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Apakah Anda yakin ingin memulihkan akun{" "}
              <strong>{restoreDialog.item?.tbl_akun?.nama}</strong>?
              <br />
              <span className="text-sm">
                Data akan dikembalikan ke daftar aktif.
              </span>
            </p>
          </div>
        }
        reject={() => setRestoreDialog({ isOpen: false, item: null })}
        rejectClassName="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 text-sm font-medium"
        rejectIcon="pi pi-times"
        rejectLabel="Batal"
        style={{ width: "90%", maxWidth: "500px" }}
        visible={restoreDialog.isOpen}
        onHide={() => setRestoreDialog({ isOpen: false, item: null })}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        accept={async () => {
          try {
            await deleteMutation.mutateAsync(deleteDialog.item?.id || 0);
            toast.success("Data berhasil dihapus");
            setDeleteDialog({ isOpen: false, item: null });
            await refetch();
          } catch (error) {
            toast.error("Gagal menghapus data. Silakan coba lagi.");
            console.error("Delete error:", error);
          }
        }}
        acceptClassName="bg-red-500 hover:bg-red-600 text-white px-5 py-2 text-sm font-medium"
        acceptIcon="pi pi-trash"
        acceptLabel="Hapus"
        closeOnEscape={true}
        draggable={false}
        footer={
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Button
              color="secondary"
              size="sm"
              startContent={
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
              }
              variant="bordered"
              onPress={() => setDeleteDialog({ isOpen: false, item: null })}
            >
              Batal
            </Button>
            <Button
              color="danger"
              disabled={deleteMutation.isPending}
              size="sm"
              startContent={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              }
              onPress={async () => {
                try {
                  await deleteMutation.mutateAsync(deleteDialog.item?.id || 0);
                  toast.success("Data berhasil dihapus");
                  setDeleteDialog({ isOpen: false, item: null });
                  await refetch();
                } catch (error) {
                  toast.error("Gagal menghapus data.");
                  console.error("Delete error:", error);
                }
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Spinner size="sm" /> Menghapus...
                </>
              ) : (
                "Hapus Permanen"
              )}
            </Button>
          </div>
        }
        message={
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
              Hapus Data?
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Apakah Anda yakin ingin menghapus akun{" "}
              <strong>{deleteDialog.item?.tbl_akun?.nama}</strong>?
              <br />
              <span className="text-sm text-red-500">
                Tindakan ini tidak bisa dibatalkan.
              </span>
            </p>
          </div>
        }
        reject={() => setDeleteDialog({ isOpen: false, item: null })}
        rejectClassName="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 text-sm font-medium"
        rejectIcon="pi pi-times"
        rejectLabel="Batal"
        style={{ width: "90%", maxWidth: "500px" }}
        visible={deleteDialog.isOpen}
        onHide={() => setDeleteDialog({ isOpen: false, item: null })}
      />
    </div>
  );
};
