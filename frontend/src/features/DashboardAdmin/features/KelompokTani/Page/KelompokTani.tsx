import { useState, useMemo, useEffect } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import { BsFiletypeXlsx } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { debounce } from "@/utils/debounce";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { LoadingModal } from "@/components/LoadingModal";
import { ColumnConfig, PaginationInfo, SelectionAction } from "@/types/table";
import {
  KelompokTaniData,
  KelompokTaniQueryParams,
} from "@/types/KelompokTani/kelompokTani";
import {
  useDeleteKelompokTani,
  useImportKelompokTani,
  useKelompokTaniData,
  useMetaKelompokTani,
  useUploadKelompokTaniFile,
} from "@/hook/dashboard/kelompokTani/useKelompokTani";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import PermissionWrapper from "@/components/PermissionWrapper";

// Icons

export const useKelompokTaniTableState = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Generate query params
  const queryParams: KelompokTaniQueryParams = useMemo(
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
const useBulkKelompokTaniOperations = (isBulkAction = false) => {
  const deleteMutation = useDeleteKelompokTani();

  return {
    deleteMutation: {
      mutateAsync: async (id: number) => {
        await deleteMutation.mutateAsync(id);
        if (isBulkAction == false) {
          // Individual action akan show toast dari hook asli
          toast.success(`Data Kelompok berhasil dihapus`);
        }
      },
      isPending: deleteMutation.isPending,
    },
  };
};

export const KelompokTani = () => {
  const {
    currentPage,
    searchTerm,
    debouncedSearch,
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  } = useKelompokTaniTableState();
  // const navigate = useNavigate();

  // Selection state for bulk actions
  const [selectedItems, setSelectedItems] = useState<KelompokTaniData[]>([]);

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // API Hooks
  const {
    data: kelompokTaniResponse,
    isLoading,
    error,
    refetch,
  } = useKelompokTaniData(queryParams);

  const deleteMutation = useDeleteKelompokTani();
  const bulkOperations = useBulkKelompokTaniOperations(true);
  const uploadMutation = useUploadKelompokTaniFile();
  const metaMutation = useMetaKelompokTani();
  const importMutation = useImportKelompokTani();

  // Dialog States (for individual actions)
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    item: KelompokTaniData | null;
  }>({ isOpen: false, item: null });
  // Bulk delete handler dengan confirm dialog

  // Execute bulk delete setelah confirm
  const executeBulkDelete = async (selectedItems: KelompokTaniData[]) => {
    try {
      const itemIds = selectedItems.map((item) => item.id);

      // Show loading modal
      setShowLoadingModal(true);
      setLoadingMessage("Menghapus kelompok tani");
      setLoadingProgress(0);

      let successCount = 0;
      let failedCount = 0;
      const failedItems: string[] = [];

      // Sequential deletion with progress tracking
      for (let i = 0; i < itemIds.length; i++) {
        const itemId = itemIds[i];
        const currentItem = selectedItems.find((item) => item.id === itemId);

        // Update progress message
        setLoadingMessage(`Menghapus: ${currentItem?.namaKelompok || itemId}`);

        try {
          await bulkOperations.deleteMutation.mutateAsync(itemId);
          successCount++;
        } catch (error: any) {
          failedCount++;
          failedItems.push(currentItem?.namaKelompok || `ID: ${itemId}`);
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
        toast.success(`${successCount} kelompok tani berhasil dihapus`);
      } else if (successCount === 0) {
        toast.error(`Gagal menghapus semua kelompok (${failedCount} kelompok)`);
      } else {
        toast.warning(
          `${successCount} kelompok berhasil dihapus, ${failedCount} kelompok gagal dihapus`,
          {
            description:
              failedItems.length > 0
                ? `Kelompok yang gagal: ${failedItems.slice(0, 3).join(", ")}${failedItems.length > 3 ? "..." : ""}`
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
      toast.error("Terjadi kesalahan saat menghapus kelompok tani");
      console.error("Bulk delete error:", error);
    }
  };

  // Define bulk actions
  const selectionActions: SelectionAction[] = [
    {
      label: "Hapus Kelompok",
      permissions: [PERMISSIONS.DATA_KELOMPOK_DELETE],
      icon: <MdDeleteForever size={16} />,
      variant: "danger",
      onClick: executeBulkDelete,
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} kelompok tani yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
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

  // File upload handler
  const handleUploadXLSX = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];

        if (!allowedTypes.includes(file.type)) {
          toast.error("File harus berformat .xlsx atau .xls");

          return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
          toast.error("Ukuran file maksimal 10MB");

          return;
        }

        setShowLoadingModal(true);
        setLoadingMessage(`Mengupload file ${file.name}...`);

        try {
          await importMutation.mutateAsync(file);
          await refetch();
        } finally {
          setShowLoadingModal(false);
        }
      }
    };
    input.click();
  };

  // Show delete confirmation for individual item
  const confirmDelete = (item: KelompokTaniData) => {
    setDeleteDialog({ isOpen: true, item });
  };

  // Column Configuration
  const columns: ColumnConfig<KelompokTaniData>[] = useMemo(
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
        key: "id",
        title: "ID Kelompok",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.id}
          </span>
        ),
        width: "120px",
        align: "center",
      },
      {
        key: "gapoktan",
        title: "Gapoktan",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.gapoktan}
          </span>
        ),
        width: "180px",
      },
      {
        key: "namaKelompok",
        title: "Nama Kelompok",
        render: (item) => (
          <span className="text-gray-900 dark:text-white">
            {item.namaKelompok}
          </span>
        ),
        width: "200px",
      },
      {
        key: "desa",
        title: "Desa",
        render: (item) => (
          <span className="text-gray-700 dark:text-gray-300">
            {item.desaData.nama}
          </span>
        ),
        width: "150px",
      },
      {
        key: "kecamatan",
        title: "Kecamatan",
        render: (item) => (
          <span className="text-gray-700 dark:text-gray-300">
            {item.kecamatanData.nama}
          </span>
        ),
        width: "150px",
      },
      {
        key: "actions",
        title: "Aksi",
        render: (item) => (
          <div className="flex space-x-1">
            <PermissionWrapper permissions={[PERMISSIONS.DATA_KELOMPOK_EDIT]}>
              <Tooltip content="Edit kelompok">
                <Button as={Link} to={`/dashboard-admin/data-kelompok/edit/${item.id}`} isIconOnly color="warning" size="sm" variant="light">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>
              </Tooltip>
            </PermissionWrapper>

            <PermissionWrapper permissions={[PERMISSIONS.DATA_KELOMPOK_DELETE]}>
              <Tooltip content="Hapus kelompok">
                <Button
                  isIconOnly
                  color="danger"
                  isLoading={
                    deleteMutation.isPending &&
                    deleteDialog.item?.id === item.id
                  }
                  size="sm"
                  variant="light"
                  onPress={() => confirmDelete(item)}
                >
                  <FaRegTrashAlt className="w-4 h-4" />
                </Button>
              </Tooltip>
            </PermissionWrapper>
          </div>
        ),
        width: "100px",
        align: "center",
      },
    ],
    [deleteMutation.isPending, deleteDialog.item],
  );

  // Prepare data
  const tableData = kelompokTaniResponse?.data || [];
  const paginationInfo: PaginationInfo = kelompokTaniResponse
    ? {
      total: kelompokTaniResponse.total,
      currentPages: parseInt(kelompokTaniResponse.currentPages),
      maxPages: kelompokTaniResponse.maxPages,
      from: kelompokTaniResponse.from,
      to: kelompokTaniResponse.to,
    }
    : {
      total: 0,
      currentPages: 1,
      maxPages: 1,
      from: 1,
      to: 0,
    };

  // Client-side filtering for search (since backend doesn't have search yet)
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return tableData;

    return tableData.filter(
      (item) =>
        item.gapoktan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaKelompok.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desaData.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kecamatanData.nama
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
  }, [tableData, searchTerm]);

  // Header actions with selection counter
  const headerActions = (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Show selected count when items are selected */}
      {selectedItems.length > 0 && (
        <div className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
          {selectedItems.length} kelompok dipilih
        </div>
      )}

      <PermissionWrapper permissions={[PERMISSIONS.DATA_KELOMPOK_IMPORT]}>
        <Tooltip content="Upload Data dari XLSX">
          <Button
            color="warning"
            startContent={<BsFiletypeXlsx className="w-4 h-4" />}
            variant="flat"
            onPress={handleUploadXLSX}
          >
            <span className="hidden sm:inline">Upload</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>

      <Button
        color="primary"
        isLoading={deleteMutation.isPending || uploadMutation.isPending}
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
        description="Dashboard Admin untuk mengelola data kelompok tani"
        title="Kelompok Tani | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Kelompok Tani" },
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 00-3-3v0a3 3 0 00-3 3v2a3 3 0 003 3zm10-10a3 3 0 11-6 0 3 3 0 016 0zm-7 7a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Kelompok
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {metaMutation?.data?.totalKelompok || 0}
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Gapoktan
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {metaMutation?.data?.totalGapoktan || 0}
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Desa
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {metaMutation?.data?.totalDesa || 0}
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

      {/* Enhanced Data Kelompok Tani Table with Multiple Select */}
      <ReusableTable<KelompokTaniData>
        // Data & Loading
        currentPage={currentPage}
        data={filteredData}
        error={error}

        // Columns Configuration
        columns={columns}

        // Search
        debouncedSearchTerm={debouncedSearch}
        emptyStateMessage="Tidak ada data kelompok tani yang ditemukan"
        enableMultiSelect={true}
        getItemId={(item) => item.id}
        searchPlaceholder="Cari gapoktan, kelompok, desa, atau kecamatan..."

        // Pagination (disable pagination for client-side filtering)
        headerActions={headerActions}
        loading={isLoading}
        paginationInfo={searchTerm ? undefined : paginationInfo}
        showPagination={!searchTerm}

        // Multiple Selection - NEW
        searchTerm={searchTerm}
        selectedItems={selectedItems}
        showSearch={true}
        subtitle="Kelola data kelompok tani dan gapoktan"
        selectionActions={selectionActions}

        // Styling & Behavior
        title="Data Kelompok Tani"
        onClearSearch={handleClearSearchWithClear}
        onPageChange={handlePageChangeWithClear}
        onSearchChange={handleSearchChangeWithClear}
        onSelectionChange={setSelectedItems}
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
              Apakah Anda yakin ingin menghapus kelompok{" "}
              <strong>{deleteDialog.item?.namaKelompok}</strong>?
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
