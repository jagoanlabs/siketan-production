// pages/DashboardStatistika.tsx - Enhanced dengan bulk actions
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { TbTableExport } from "react-icons/tb";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useDashboardDataPotkan } from "@/hook/dashboard/useDashboardDataPotkan";
import { useTanamanData } from "@/hook/dashboard/useDashboardDataTable";
import {
  useDeleteStatistika,
  useImportStatistika,
  useExportStatistika,
} from "@/hook/dashboard/Statistika/useStatistika";
import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";
import {
  DataTanaman,
  TanamanQueryParams,
} from "@/types/dashboard/tableTanaman";
import { ColumnConfig, PaginationInfo, SelectionAction } from "@/types/table";
import { debounce } from "@/utils/debounce";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { LoadingModal } from "@/components/LoadingModal";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

export const DashboardStatistika = () => {
  const navigate = useNavigate();

  // AsyncSelect state
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [poktanSearchTerm, setPoktanSearchTerm] = useState("");

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [tableSearchTerm, setTableSearchTerm] = useState("");
  const [debouncedTableSearch, setDebouncedTableSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ASC" | "DESC";
  }>({ key: "id", direction: "DESC" });

  // Selection state for bulk actions
  const [selectedItems, setSelectedItems] = useState<DataTanaman[]>([]);

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Mutations
  const deleteMutation = useDeleteStatistika();
  const bulkDeleteMutation = useDeleteStatistika(true); // isBulkAction = true
  const importMutation = useImportStatistika();
  const exportMutation = useExportStatistika();

  // Debounce functions
  const debouncedSetTableSearch = useMemo(
    () => debounce((value: string) => setDebouncedTableSearch(value), 500),
    [],
  );

  const debouncedSetPoktanSearch = useMemo(
    () => debounce((value: string) => setPoktanSearchTerm(value), 500),
    [],
  );

  // Update debounced search
  useEffect(() => {
    debouncedSetTableSearch(tableSearchTerm);
  }, [tableSearchTerm, debouncedSetTableSearch]);

  // Build query params
  const tanamanParams: TanamanQueryParams = useMemo(
    () => ({
      limit: itemsPerPage,
      page: currentPage,
      sortBy: sortConfig.key || "id",
      sortType: sortConfig.direction,
      poktan_id: selectedOption?.value || undefined,
      search: debouncedTableSearch || "",
    }),
    [
      itemsPerPage,
      currentPage,
      sortConfig,
      selectedOption,
      debouncedTableSearch,
    ],
  );

  // API Queries
  const {
    data: dataPotkan,
    isLoading: isPotkanLoading,
    error: potkanError,
  } = useDashboardDataPotkan(poktanSearchTerm);

  const {
    data: tanamanResponse,
    isLoading: isTanamanLoading,
    isFetching: isTanamanFetching,
    error: tanamanError,
    refetch: refetchTanamanData,
  } = useTanamanData(tanamanParams);

  const { data: defaultData } = useDashboardDataPotkan("");

  // Define bulk actions
  const selectionActions: SelectionAction[] = [
    {
      label: "Hapus Data",
      icon: <FaRegTrashAlt size={16} />,
      variant: "danger",
      permission: PERMISSIONS.STATISTIC_DELETE,
      onClick: async (selectedItems: DataTanaman[]) => {
        try {
          const itemIds = selectedItems.map((item) => item.id);

          // Show loading modal
          setShowLoadingModal(true);
          setLoadingMessage("Menghapus data statistika");
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
            setLoadingMessage(`Menghapus: ${currentItem?.komoditas || itemId}`);

            try {
              await bulkDeleteMutation.mutateAsync(itemId);
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedItems.push(currentItem?.komoditas || `ID: ${itemId}`);
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
          await refetchTanamanData();
        } catch (error) {
          setShowLoadingModal(false);
          toast.error("Terjadi kesalahan saat menghapus data");
          console.error("Bulk delete error:", error);
        }
      },
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} data statistika yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
    },
  ];

  // Default options for AsyncSelect
  const defaultOptions = useMemo(() => {
    if (defaultData) {
      return defaultData.slice(0, 10).map((item: DashoardDataPotkan) => ({
        value: item.id,
        label: item.gapoktan + " - " + item.namaKelompok,
        data: item,
      }));
    }

    return [];
  }, [defaultData]);

  // AsyncSelect load options
  const loadOptions = useCallback(
    (inputValue: string, callback: (options: any[]) => void) => {
      debouncedSetPoktanSearch(inputValue);

      if (!inputValue || inputValue === poktanSearchTerm) {
        if (dataPotkan) {
          const options = dataPotkan.map((item: DashoardDataPotkan) => ({
            value: item.id,
            label: item.gapoktan + " - " + item.namaKelompok,
            data: item,
          }));

          callback(options);
        } else {
          callback([]);
        }
      } else {
        setTimeout(() => {
          if (dataPotkan) {
            const options = dataPotkan.map((item: DashoardDataPotkan) => ({
              value: item.id,
              label: item.gapoktan + " - " + item.namaKelompok,
              data: item,
            }));

            callback(options);
          } else {
            callback([]);
          }
        }, 600);
      }
    },
    [dataPotkan, debouncedSetPoktanSearch, poktanSearchTerm],
  );

  // Handler functions
  const handlePoktanChange = (option: any) => {
    setSelectedOption(option);
    setCurrentPage(1);
    setTableSearchTerm("");
    setDebouncedTableSearch("");
    setSelectedItems([]); // Clear selection when filter changes
  };

  const handleSort = (key: string) => {
    let direction: "ASC" | "DESC" = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]); // Clear selection when page changes
  };

  const handleTableSearchChange = (value: string) => {
    setTableSearchTerm(value);
    setCurrentPage(1);
    setSelectedItems([]); // Clear selection when search changes
  };

  const handleClearSearch = () => {
    setTableSearchTerm("");
    setDebouncedTableSearch("");
    setCurrentPage(1);
    setSelectedItems([]);
  };

  // Action handlers (existing ones)
  const handleDetail = (item: DataTanaman) => {
    navigate(`/dashboard-admin/statistik-pertanian/${item.id}`);
  };

  const handleEdit = (item: DataTanaman) => {
    navigate(`/dashboard-admin/statistik-pertanian/${item.id}/edit`);
  };

  const handleRealisasi = (item: DataTanaman) => {
    navigate(`/dashboard-admin/statistik-pertanian/${item.id}/realisasi`);
  };

  const handleDelete = (item: DataTanaman) => {
    confirmDialog({
      message: (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            Apakah Anda yakin ingin menghapus data statistika ini?
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">ID</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  #{item.id}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Kategori
                </span>
                <div className="mt-1">
                  <Chip
                    color={
                      item.kategori === "pangan"
                        ? "success"
                        : item.kategori === "perkebunan"
                          ? "warning"
                          : item.kategori === "jenis_sayur"
                            ? "secondary"
                            : "primary"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {item.kategori === "jenis_sayur"
                      ? "Jenis Sayur"
                      : item.kategori.charAt(0).toUpperCase() +
                        item.kategori.slice(1)}
                  </Chip>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Komoditas
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.komoditas}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Periode Tanam
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.periodeTanam}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <i className="pi pi-exclamation-triangle text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              Data yang dihapus tidak dapat dikembalikan!
            </p>
          </div>
        </div>
      ),
      header: "Konfirmasi Penghapusan Data",
      icon: "pi pi-trash",
      defaultFocus: "reject",
      accept: async () => {
        try {
          await deleteMutation.mutateAsync(item.id);
          await refetchTanamanData();
        } catch (error) {
          console.error("Delete failed:", error);
        }
      },
      reject: () => {},
      acceptLabel: "Ya, Hapus Data",
      rejectLabel: "Batal",
      acceptClassName: "p-button-danger p-button-text p-button-sm",
      rejectClassName: "p-button-text p-button-sm",
    });
  };

  // Top action handlers
  const handleCreate = () => {
    navigate(`/dashboard-admin/statistik-pertanian/create`);
  };

  const handleExport = async () => {
    setShowLoadingModal(true);
    setLoadingMessage("Memproses export data...");

    try {
      await exportMutation.mutateAsync(selectedOption?.value || null);
    } finally {
      setShowLoadingModal(false);
    }
  };

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
          await refetchTanamanData();
        } finally {
          setShowLoadingModal(false);
        }
      }
    };
    input.click();
  };

  // Table columns definition
  const columns: ColumnConfig<DataTanaman>[] = [
    {
      key: "index",
      title: "No",
      align: "center",
      width: "60px",
      render: (_, index, paginationInfo) => {
        if (paginationInfo) {
          return paginationInfo.from + index;
        }

        return index + 1;
      },
    },
    {
      key: "kategori",
      title: "Kategori",
      sortable: true,
      render: (item) => (
        <Chip
          color={
            item.kategori === "pangan"
              ? "success"
              : item.kategori === "perkebunan"
                ? "warning"
                : item.kategori === "jenis_sayur"
                  ? "secondary"
                  : "primary"
          }
          size="sm"
          variant="flat"
        >
          {item.kategori === "jenis_sayur"
            ? "Jenis Sayur"
            : item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
        </Chip>
      ),
    },
    {
      key: "komoditas",
      title: "Komoditas",
      sortable: true,
      render: (item) => <span className="font-medium">{item.komoditas}</span>,
    },
    {
      key: "kelompok",
      title: "Kelompok",
      render: (item) => (
        <div>
          <div className="font-medium text-sm">
            {item.kelompok.namaKelompok}
          </div>
          <div className="text-xs text-gray-400">{item.kelompok.gapoktan}</div>
        </div>
      ),
    },
    {
      key: "luasLahan",
      title: "Luas Lahan",
      sortable: true,
      align: "right",
      render: (item) => `${item.luasLahan} Ha`,
    },
    {
      key: "periodeTanam",
      title: "Periode Tanam",
      sortable: true,
      render: (item) => item.periodeTanam,
    },
    {
      key: "prakiraanBulanPanen",
      title: "Prakiraan Panen",
      sortable: true,
      render: (item) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {item.prakiraanBulanPanen}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      align: "center",
      width: "200px",
      render: (item) => (
        <div className="flex justify-center space-x-1">
          <PermissionWrapper
            permissions={[
              PERMISSIONS.STATISTIC_DETAIL,
              PERMISSIONS.STATISTIC_INDEX,
            ]}
          >
            <Tooltip content="Lihat Detail">
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="light"
                onPress={() => handleDetail(item)}
              >
                <FiEye className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permission={PERMISSIONS.STATISTIC_EDIT}>
            <Tooltip content="Edit Data">
              <Button
                isIconOnly
                color="warning"
                size="sm"
                variant="light"
                onPress={() => handleEdit(item)}
              >
                <BiPencil className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permission={PERMISSIONS.STATISTIC_DELETE}>
            <Tooltip content="Hapus Data">
              <Button
                isIconOnly
                color="danger"
                isLoading={deleteMutation.isPending}
                size="sm"
                variant="light"
                onPress={() => handleDelete(item)}
              >
                <FaRegTrashAlt className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permission={PERMISSIONS.STATISTIC_REALISASI}>
            <Tooltip content="Realisasi">
              <Button
                isIconOnly
                color="secondary"
                size="sm"
                variant="light"
                onPress={() => handleRealisasi(item)}
              >
                <IoIosCheckmarkCircleOutline className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>
        </div>
      ),
    },
  ];

  // Prepare data and pagination info
  const tableData = tanamanResponse?.data.data || [];
  const paginationInfo: PaginationInfo = tanamanResponse?.data
    ? {
        total: tanamanResponse.data.total,
        currentPages: tanamanResponse.data.currentPages,
        maxPages: tanamanResponse.data.maxPages,
        from: tanamanResponse.data.from,
        to: tanamanResponse.data.to,
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
    <div className="flex flex-wrap gap-2 items-center">
      {/* Show selected count when items are selected */}
      {selectedItems.length > 0 && (
        <div className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
          {selectedItems.length} item dipilih
        </div>
      )}
      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_CREATE]}>
        <Tooltip content="Tambah Data Baru">
          <Button
            color="primary"
            startContent={<FaPlus className="w-4 h-4" />}
            onPress={handleCreate}
          >
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_EXPORT]}>
        <Tooltip content="Export Data ke XLSX">
          <Button
            color="success"
            startContent={<TbTableExport className="w-4 h-4" />}
            variant="flat"
            onPress={handleExport}
          >
            <span className="hidden sm:inline">Export</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_IMPORT]}>
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
    </div>
  );

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Statistika Pertanian | Siketan"
        title="Statistika Pertanian | Siketan"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Statistika Pertanian" },
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

      {/* Poktan Select Filter */}
      <div className="mb-6">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter berdasarkan Poktan
        </p>
        <AsyncSelect
          cacheOptions
          isClearable
          classNames={{
            control: () =>
              "w-full px-1 py-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700",
            menu: () => "z-[9999]",
            menuPortal: () => "z-[9999]",
          }}
          defaultOptions={defaultOptions}
          isLoading={isPotkanLoading}
          loadOptions={loadOptions}
          menuPlacement="auto"
          menuPortalTarget={document.body}
          menuPosition="fixed"
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? `Tidak ada hasil untuk "${inputValue}"`
              : "Ketik untuk mencari..."
          }
          placeholder="Pilih atau cari poktan..."
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (base) => ({ ...base, zIndex: 9999 }),
          }}
          value={selectedOption}
          onChange={handlePoktanChange}
        />

        {potkanError && (
          <div className="text-red-500 text-sm mt-1">
            Error: {potkanError.message}
          </div>
        )}
      </div>

      {/* Enhanced ReusableTable with Bulk Actions */}
      <ReusableTable
        className=""
        columns={columns}
        currentPage={currentPage}
        data={tableData}
        error={tanamanError}

        // Search props
        debouncedSearchTerm={debouncedTableSearch}
        emptyStateMessage="Tidak ada data yang ditemukan"
        enableMultiSelect={true}
        getItemId={(item) => item.id}
        searchPlaceholder="Cari kategori atau komoditas..."

        // Sorting
        onSort={handleSort}

        // Pagination
        headerActions={headerActions}
        loading={isTanamanLoading || isTanamanFetching}
        onPageChange={handlePageChange}

        // Multiple Selection - NEW
        paginationInfo={paginationInfo}
        searchTerm={tableSearchTerm}
        selectedItems={selectedItems}
        subtitle={
          selectedOption ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter: <strong>{selectedOption.label}</strong>
            </p>
          ) : null
        }
        selectionActions={selectionActions}

        // Styling & Behavior
        title="Data Tanaman"
        onClearSearch={handleClearSearch}
        onSearchChange={handleTableSearchChange}
        onSelectionChange={setSelectedItems}
      />
    </div>
  );
};
