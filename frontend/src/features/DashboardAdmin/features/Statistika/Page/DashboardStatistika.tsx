import { Chip } from "../../../../../components/Form/HeroChip";
import { Button } from "../../../../../components/Form/HeroButton";
import { Select, SelectItem } from "../../../../../components/Form/HeroSelect";
// pages/DashboardStatistika.tsx - Enhanced dengan bulk actions
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";







import { Modal, Popover, PopoverContent, PopoverTrigger, SearchField, Tooltip } from "@heroui/react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { TbTableExport } from "react-icons/tb";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FiCalendar, FiEye } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";

import {
  KOMODITAS_OPTIONS,
  BULAN_OPTIONS,
} from "@/types/Statistika/statistika.d";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useDashboardDataPotkan } from "@/hook/dashboard/useDashboardDataPotkan";
import { useTanamanData } from "@/hook/dashboard/useDashboardDataTable";
import {
  useDeleteStatistika,
  useImportStatistika,
  useExportStatistika,
  useStatistikaYears,
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

  // Export Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"all" | "year">("all");
  const [selectedExportYear, setSelectedExportYear] = useState<string>("");
  const { data: availableYears = [] } = useStatistikaYears();

  // New Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [prakiraanMin, setPrakiraanMin] = useState<string>("");
  const [prakiraanMax, setPrakiraanMax] = useState<string>("");
  // Month Grid Picker States
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());

  // Options for Commodity Dropdown
  const allCommodityOptions = useMemo(() => {
    const options = new Set<string>();

    if (selectedCategory) {
      const mappedCategory = selectedCategory === "sayur" ? "jenis_sayur" : selectedCategory;
      const categoryObj = (KOMODITAS_OPTIONS as any)[mappedCategory];
      if (categoryObj) {
        if (Array.isArray(categoryObj.semusim)) {
          categoryObj.semusim.forEach((item: string) => options.add(item));
        }
        if (Array.isArray(categoryObj.tahunan)) {
          categoryObj.tahunan.forEach((item: string) => options.add(item));
        }
      }
    } else {
      Object.values(KOMODITAS_OPTIONS).forEach((categoryObj) => {
        categoryObj.semusim.forEach((item) => options.add(item));
        categoryObj.tahunan.forEach((item) => options.add(item));
      });
      options.add("Perkebunan Tebu");
      options.add("Perkebunan Tembakau");
    }

    return Array.from(options).sort().map((item) => ({
      value: item,
      label: item,
    }));
  }, [selectedCategory]);

  // Validation: Reset selectedCommodity if it's not valid for the new category
  useEffect(() => {
    if (selectedCategory && selectedCommodity) {
      const mappedCategory = selectedCategory === "sayur" ? "jenis_sayur" : selectedCategory;
      const categoryObj = (KOMODITAS_OPTIONS as any)[mappedCategory];
      if (categoryObj) {
        const allowed = new Set<string>([
          ...(categoryObj.semusim || []),
          ...(categoryObj.tahunan || [])
        ]);
        if (!allowed.has(selectedCommodity)) {
          setSelectedCommodity("");
        }
      }
    }
  }, [selectedCategory, selectedCommodity]);

  const getFilterLabel = () => {
    if (prakiraanMin) {
      const [year, month] = prakiraanMin.split("-");
      const months = BULAN_OPTIONS;
      const monthIndex = parseInt(month, 10) - 1;
      if (monthIndex >= 0 && monthIndex < months.length) {
        return `${months[monthIndex]} ${year}`;
      }
    }
    return "Pilih Bulan & Tahun";
  };

  const handleClearAllFilters = () => {
    setTableSearchTerm("");
    setDebouncedTableSearch("");
    setSelectedCategory("");
    setSelectedCommodity("");
    setPrakiraanMin("");
    setPrakiraanMax("");
    setPickerYear(new Date().getFullYear());
    setCurrentPage(1);
    setSelectedItems([]);
  };

  // Sync pickerYear when prakiraanMin is set
  useEffect(() => {
    if (prakiraanMin) {
      const y = parseInt(prakiraanMin.split("-")[0], 10);
      if (!isNaN(y)) {
        setPickerYear(y);
      }
    }
  }, [prakiraanMin]);

  useEffect(() => {
    if (availableYears.length > 0 && !selectedExportYear) {
      setSelectedExportYear(availableYears[0]);
    }
  }, [availableYears, selectedExportYear]);

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
      kategori: selectedCategory || undefined,
      komoditas: selectedCommodity || undefined,
      prakiraanMin: prakiraanMin || undefined,
      prakiraanMax: prakiraanMax || undefined,
    }),
    [
      itemsPerPage,
      currentPage,
      sortConfig,
      selectedOption,
      debouncedTableSearch,
      selectedCategory,
      selectedCommodity,
      prakiraanMin,
      prakiraanMax,
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
                          : item.kategori === "jenis_sayur" || item.kategori === "sayur"
                            ? "secondary"
                            : "primary"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {item.kategori === "jenis_sayur" || item.kategori === "sayur"
                      ? "Sayur"
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
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Kecamatan
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.kelompok?.kecamatan || "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400">
                  Desa
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.kelompok?.desa || "-"}
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
      reject: () => { },
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

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const executeExport = async () => {
    setIsExportModalOpen(false);
    setShowLoadingModal(true);
    setLoadingMessage("Memproses export data...");

    try {
      await exportMutation.mutateAsync({
        poktanId: selectedOption?.value || null,
        tahun: exportType === "year" ? selectedExportYear : null,
        kategori: selectedCategory || null,
        komoditas: selectedCommodity || null,
        prakiraanMin: prakiraanMin || null,
        prakiraanMax: prakiraanMax || null,
      });
    } finally {
      setShowLoadingModal(false);
    }
  };

  const handleUploadXLSX = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = async (e: any) => {
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
      key: "id",
      title: "No. Poktan",
      align: "center",
      width: "60px",
      render: (item) => {
        return item.kelompok.id;
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
                : item.kategori === "jenis_sayur" || item.kategori === "sayur"
                  ? "secondary"
                  : "primary"
          }
          size="sm"
          variant="flat"
        >
          {item.kategori === "jenis_sayur" || item.kategori === "sayur"
            ? "Sayur"
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
      key: "kecamatan",
      title: "Kecamatan",
      render: (item) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {item.kelompok.kecamatan || "-"}
        </span>
      ),
    },
    {
      key: "desa",
      title: "Desa",
      render: (item) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {item.kelompok.desa || "-"}
        </span>
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
      key: "createdAt",
      title: "Waktu Pembuatan Data",
      sortable: true,
      align: "center",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(item.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      ),
    },
    {
      key: "updatedAt",
      title: "Waktu Terakhir Diperbaharui",
      sortable: true,
      align: "center",
      render: (item) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(item.updatedAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
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
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  color="primary"
                  size="sm"
                  variant="light"
                  onPress={() => handleDetail(item)}
                >
                  <FiEye className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Lihat Detail</Tooltip.Content>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permission={PERMISSIONS.STATISTIC_EDIT}>
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  color="warning"
                  size="sm"
                  variant="light"
                  onPress={() => handleEdit(item)}
                >
                  <BiPencil className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Edit Data</Tooltip.Content>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permission={PERMISSIONS.STATISTIC_DELETE}>
            <Tooltip>
              <Tooltip.Trigger>
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
              </Tooltip.Trigger>
              <Tooltip.Content>Hapus Data</Tooltip.Content>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permission={PERMISSIONS.STATISTIC_REALISASI}>
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  isIconOnly
                  color="secondary"
                  size="sm"
                  variant="light"
                  onPress={() => handleRealisasi(item)}
                >
                  <IoIosCheckmarkCircleOutline className="w-4 h-4" />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>Realisasi</Tooltip.Content>
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
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              color="secondary"
              startContent={<FaPlus className="w-4 h-4" />}
              onPress={handleCreate}
            >
              <span className="hidden sm:inline-flex items-center">Tambah</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Tambah Data Baru</Tooltip.Content>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_EXPORT]}>
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              color="success"
              startContent={<TbTableExport className="w-4 h-4" />}
              variant="flat"
              onPress={handleExport}
            >
              <span className="hidden sm:inline-flex items-center">Export</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Export Data ke XLSX</Tooltip.Content>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_IMPORT]}>
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              color="warning"
              startContent={<BsFiletypeXlsx className="w-4 h-4" />}
              variant="flat"
              onPress={handleUploadXLSX}
            >
              <span className="hidden sm:inline-flex items-center">Upload</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Upload Data dari XLSX</Tooltip.Content>
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
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              `w-full px-3.5 py-3 bg-transparent border rounded-xl hover:border-gray-400 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[40px] ${isFocused
                ? "border-green-500 ring-1 ring-green-500"
                : "border-gray-300 dark:border-gray-600"
              }`,
            placeholder: () => "text-gray-400 text-sm",
            singleValue: () => "text-gray-700 dark:text-gray-200 text-sm",
            input: () => "text-gray-700 dark:text-gray-200 text-sm outline-none",
            menu: () => "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-[9999]",
            option: ({ isFocused, isSelected }) =>
              `px-3 py-2.5 text-sm rounded-lg cursor-pointer ${isSelected
                ? "bg-green-600 text-white"
                : isFocused
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  : "text-gray-700 dark:text-gray-200"
              }`,
            valueContainer: () => "flex items-center gap-1.5 flex-1",
            indicatorsContainer: () => "flex items-center gap-1.5 text-gray-400",
            clearIndicator: () => "hover:text-red-500 cursor-pointer p-0.5",
            dropdownIndicator: () => "hover:text-gray-600 cursor-pointer p-0.5"
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

      {/* Search and Filters Flex Container */}
      <div className="flex flex-col md:flex-row gap-4 items-end mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Search */}
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <SearchField
            value={tableSearchTerm}
            onChange={handleTableSearchChange}
          >
            <span className="text-xs font-normal text-gray-600 dark:text-gray-400 pl-1">Pencarian</span>
            <SearchField.Group className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center gap-1 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 min-h-[46px] pl-1 !pr-1">
              <SearchField.SearchIcon className="text-gray-400 !ml-3" />
              <SearchField.Input
                placeholder="Cari kategori, poktan/kelompok, kecamatan, desa..."
                className="bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none w-full text-sm text-gray-700 dark:text-gray-200"
              />
              {tableSearchTerm && (
                <SearchField.ClearButton
                  className="text-gray-400 hover:text-gray-600 cursor-pointer flex items-center justify-center"
                  onClick={handleClearSearch}
                />
              )}
            </SearchField.Group>
          </SearchField>
        </div>

        {/* Jenis Pangan Select */}
        <div className="w-full md:w-52">
          <Select
            label="Jenis Pangan"
            placeholder="Semua Jenis"
            variant="bordered"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(keys: any) => {
              const selected = Array.from(keys)[0] as string;
              setSelectedCategory(selected || "");
              setCurrentPage(1);
            }}
            classNames={{
              trigger: "border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 min-h-[46px] px-3.5 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 text-sm font-normal text-gray-700 dark:text-gray-200",
              label: "font-normal"
            }}
          >
            <SelectItem key="pangan" textValue="Tanaman Pangan">
              Tanaman Pangan
            </SelectItem>
            <SelectItem key="perkebunan" textValue="Perkebunan">
              Perkebunan
            </SelectItem>
            <SelectItem key="sayur" textValue="Sayur">
              Sayur
            </SelectItem>
            <SelectItem key="buah" textValue="Buah">
              Buah
            </SelectItem>
          </Select>
        </div>

        {/* Commodity Select */}
        <div className="w-full md:w-60">
          <Select
            label="Komoditas"
            placeholder="Semua Komoditas"
            variant="bordered"
            selectedKeys={selectedCommodity ? [selectedCommodity] : []}
            onSelectionChange={(keys: any) => {
              const selected = Array.from(keys)[0] as string;
              setSelectedCommodity(selected || "");
              setCurrentPage(1);
            }}
            classNames={{
              trigger: "border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 min-h-[46px] px-3.5 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 text-sm font-normal text-gray-700 dark:text-gray-200",
              label: "font-normal"
            }}
          >
            {allCommodityOptions.map((item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Harvest Range Month-Year Popover */}
        <div className="w-full md:w-72 flex flex-col gap-1.5">
          <span className="text-xs font-normal text-gray-600 dark:text-gray-400 pl-1">Prakiraan Panen</span>
          <Popover placement="bottom-end" isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger>
              <Button
                className={`w-full justify-center md:justify-between px-3.5 py-3 rounded-xl min-h-[46px] text-sm hover:border-gray-400 dark:hover:border-gray-500 border border-gray-300 dark:border-gray-600 transition-colors !font-normal text-center md:text-left focus:border-green-500 focus:ring-1 focus:ring-green-500 ${prakiraanMin
                  ? "!text-gray-700 dark:!text-gray-200"
                  : "!text-gray-400 dark:!text-gray-500"
                  }`}
                color="default"
                variant="bordered"
                endContent={<FiCalendar className="text-gray-400 dark:text-gray-500 text-sm" />}
              >
                {getFilterLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-lg w-72">
              <div className="space-y-4 w-full">
                {/* Year Header Navigator */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-gray-600 dark:text-gray-400"
                    onPress={() => setPickerYear((prev) => prev - 1)}
                  >
                    &larr;
                  </Button>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Tahun {pickerYear}
                  </span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-gray-600 dark:text-gray-400"
                    onPress={() => setPickerYear((prev) => prev + 1)}
                  >
                    &rarr;
                  </Button>
                </div>

                {/* 3x4 Month Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"].map((shortMonth, idx) => {
                    const monthValStr = String(idx + 1).padStart(2, "0");
                    const targetVal = `${pickerYear}-${monthValStr}`;
                    const isSelected = prakiraanMin === targetVal;

                    return (
                      <Button
                        key={shortMonth}
                        size="sm"
                        className={`py-2 transition-all font-medium rounded-lg text-xs ${
                          isSelected
                            ? "bg-green-600 text-white font-semibold hover:bg-green-700"
                            : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onPress={() => {
                          setPrakiraanMin(targetVal);
                          setPrakiraanMax(targetVal);
                          setCurrentPage(1);
                          setIsPopoverOpen(false);
                        }}
                      >
                        {shortMonth}
                      </Button>
                    );
                  })}
                </div>

                {/* Footer Link to Reset Filter */}
                {prakiraanMin && (
                  <div className="flex justify-center border-t border-gray-100 dark:border-gray-700 pt-2">
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      className="text-xs h-7 font-normal"
                      onPress={() => {
                        setPrakiraanMin("");
                        setPrakiraanMax("");
                        setCurrentPage(1);
                        setIsPopoverOpen(false);
                      }}
                    >
                      Hapus Pilihan
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Filters */}
        {(tableSearchTerm || selectedCategory || selectedCommodity || prakiraanMin || prakiraanMax) && (
          <Button
            className="w-full min-h-[46px] md:w-auto"
            color="danger"
            variant="flat"
            onPress={handleClearAllFilters}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Enhanced ReusableTable with Bulk Actions */}
      <ReusableTable
        className=""
        columns={columns}
        currentPage={currentPage}
        data={tableData}
        error={tanamanError}
        showSearch={false}

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

      {/* Export Options Modal */}
      <Modal isOpen={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Export Data Statistika</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-4 p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pilih tipe export:
                  </p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="exportType"
                        checked={exportType === "all"}
                        onChange={() => setExportType("all")}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Export Keseluruhan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="exportType"
                        checked={exportType === "year"}
                        onChange={() => setExportType("year")}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Export Berdasarkan Tahun</span>
                    </label>
                  </div>
                </div>

                {exportType === "year" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pilih Tahun:
                    </p>
                    <Select
                      placeholder="Pilih tahun..."
                      selectedKeys={[selectedExportYear]}
                      variant="bordered"
                      onChange={(e: any) => setSelectedExportYear(e.target.value)}
                    >
                      {availableYears.map((year) => (
                        <SelectItem key={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button color="danger" variant="light" onPress={() => setIsExportModalOpen(false)}>
                  Batal
                </Button>
                <Button className="text-gray-100" color="success" onPress={executeExport}>
                  Export ke Excel
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};
