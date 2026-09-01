import { Chip } from "../../../../../components/Form/HeroChip";
import { Button } from "../../../../../components/Form/HeroButton";
import { Select, SelectItem } from "../../../../../components/Form/HeroSelect";
import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";

// Custom MultiValue: Chip pil biru persis seperti desain ([Gapoktan - Poktan x])
const CustomMultiValue = (props: any) => {
  const { data, removeProps } = props;
  return (
    <div className="inline-flex items-center gap-1.5 bg-[#E8F0FE] dark:bg-blue-950/70 text-[#1A73E8] dark:text-blue-300 rounded-lg px-2.5 py-1 text-xs font-medium m-0.5 shadow-2xs">
      <span className="truncate max-w-[220px]">{data.label}</span>
      <button
        type="button"
        {...removeProps}
        onClick={(e) => {
          removeProps?.onClick?.(e);
        }}
        className="text-blue-500 hover:text-blue-700 hover:bg-blue-200/60 dark:hover:bg-blue-900 rounded p-0.5 ml-0.5 shrink-0 cursor-pointer"
        title="Hapus"
      >
        ✕
      </button>
    </div>
  );
};

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between w-full">
        <span className="truncate">{props.label}</span>
        {props.isSelected && (
          <span className="text-xs font-bold ml-2 shrink-0">✓</span>
        )}
      </div>
    </components.Option>
  );
};







import { Modal, Popover, PopoverContent, PopoverTrigger, Tooltip } from "@heroui/react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { TbTableExport, TbTableOptions, TbTablePlus } from "react-icons/tb";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FiCalendar, FiEye } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";
import templateStatistikaUrl from "@/assets/template/template data statistika.xlsx?url";
import templateRealisasiUrl from "@/assets/template/template realisasi data statistika.xlsx?url";

import {
  KOMODITAS_OPTIONS,
  BULAN_OPTIONS,
} from "@/types/Statistika/statistika.d";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { getPoktanDashboard } from "@/service/DashboardAdmin/index/dashboard-poktan";
import { useDashboardDataPotkan } from "@/hook/dashboard/useDashboardDataPotkan";
import { useTanamanData } from "@/hook/dashboard/useDashboardDataTable";
import { useKecamatanList } from "@/hook/dashboard/dataPetani/useCreateEditDataPetani";
import {
  useDeleteStatistika,
  useImportStatistika,
  useExportStatistika,
  useUpdateRealisasiBulk,
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
import { RoleHelper, PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import { useAuth } from "@/hook/UseAuth";

export const DashboardStatistika = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPenyuluh =
    user?.peran === "penyuluh" ||
    RoleHelper.isPenyuluh(user) ||
    (typeof (user as any)?.role === "string"
      ? ((user as any).role as string).includes("penyuluh")
      : Boolean((user as any)?.role?.name?.includes("penyuluh")));

  // AsyncSelect state (multi-select poktan)
  const [selectedPoktan, setSelectedPoktan] = useState<any[]>([]);

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

  // Template Download Modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<"prakiraan" | "realisasi">("prakiraan");

  // Export Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"all" | "year" | "month_year">("all");
  const [selectedExportYear, setSelectedExportYear] = useState<string>("");
  const [exportPickerYear, setExportPickerYear] = useState<number>(new Date().getFullYear());
  const [selectedExportMonth, setSelectedExportMonth] = useState<string>("");
  const { data: availableYears = [] } = useStatistikaYears();

  // New Filter States
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [prakiraanMin, setPrakiraanMin] = useState<string>("");
  const [prakiraanMax, setPrakiraanMax] = useState<string>("");
  // Month Grid Picker States
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());

  // Kecamatan list for Operator filter
  const { data: kecamatanList = [], isLoading: isKecamatanLoading } = useKecamatanList();

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
    setSelectedPoktan([]);
    setSelectedKecamatan("");
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

  // Reset export fields when modal is opened
  useEffect(() => {
    if (isExportModalOpen) {
      setExportType("all");
      setSelectedExportMonth("");
      setExportPickerYear(new Date().getFullYear());
      if (availableYears.length > 0) {
        setSelectedExportYear(availableYears[0]);
      }
    }
  }, [isExportModalOpen, availableYears]);

  // Mutations
  const deleteMutation = useDeleteStatistika();
  const bulkDeleteMutation = useDeleteStatistika(true); // isBulkAction = true
  const importMutation = useImportStatistika();
  const exportMutation = useExportStatistika();
  const updateRealisasiMutation = useUpdateRealisasiBulk();

  // Debounce functions
  const debouncedSetTableSearch = useMemo(
    () => debounce((value: string) => setDebouncedTableSearch(value), 500),
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
      poktan_id:
        selectedPoktan.length > 0
          ? selectedPoktan.map((item) => item.value).join(",")
          : undefined,
      search: debouncedTableSearch || "",
      kategori: selectedCategory || undefined,
      komoditas: selectedCommodity || undefined,
      prakiraanMin: prakiraanMin || undefined,
      prakiraanMax: prakiraanMax || undefined,
      kecamatan: selectedKecamatan || undefined,
    }),
    [
      itemsPerPage,
      currentPage,
      sortConfig,
      selectedPoktan,
      debouncedTableSearch,
      selectedCategory,
      selectedCommodity,
      prakiraanMin,
      prakiraanMax,
      selectedKecamatan,
    ],
  );

  // API Queries
  const { data: defaultData, isLoading: isPotkanLoading } =
    useDashboardDataPotkan("", selectedKecamatan || undefined);

  const {
    data: tanamanResponse,
    isLoading: isTanamanLoading,
    isFetching: isTanamanFetching,
    error: tanamanError,
    refetch: refetchTanamanData,
  } = useTanamanData(tanamanParams);

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

  // Default options untuk AsyncSelect
  const defaultOptions = useMemo(() => {
    if (defaultData) {
      return defaultData.map((item: DashoardDataPotkan) => ({
        value: item.id,
        label: (item.gapoktan ? `${item.gapoktan} - ` : "") + item.namaKelompok,
        data: item,
      }));
    }

    return [];
  }, [defaultData]);

  // AsyncSelect load options
  const loadOptions = useCallback(
    async (inputValue: string) => {
      try {
        const res = await getPoktanDashboard(inputValue || "", selectedKecamatan || undefined);
        return (res || []).map((item: DashoardDataPotkan) => ({
          value: item.id,
          label: (item.gapoktan ? `${item.gapoktan} - ` : "") + item.namaKelompok,
          data: item,
        }));
      } catch (error) {
        console.error("Error loading poktan options:", error);
        return [];
      }
    },
    [selectedKecamatan],
  );

  // Handler functions
  const handlePoktanChange = (options: any) => {
    const newOptions = options ? (Array.isArray(options) ? options : [options]) : [];
    setSelectedPoktan(newOptions);
    setCurrentPage(1);
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
                    className={
                      item.kategori === "buah"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : item.kategori === "pangan"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : item.kategori === "perkebunan"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            : item.kategori === "jenis_sayur" || item.kategori === "sayur"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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

  const handleDownloadTemplate = () => {
    setIsTemplateModalOpen(true);
  };

  const handleDownloadPrakiraanTemplate = () => {
    const link = document.createElement("a");
    link.href = templateStatistikaUrl;
    link.download = "template data statistika.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Template upload data statistika berhasil diunduh");
    setIsTemplateModalOpen(false);
  };

  const handleDownloadRealisasiTemplate = () => {
    const link = document.createElement("a");
    link.href = templateRealisasiUrl;
    link.download = "template realisasi data statistika.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Template realisasi data statistika berhasil diunduh");
    setIsTemplateModalOpen(false);
  };

  const handleDownloadSelectedTemplate = () => {
    if (selectedTemplateType === "prakiraan") {
      handleDownloadPrakiraanTemplate();
    } else {
      handleDownloadRealisasiTemplate();
    }
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleDownloadFiltered = async () => {
    try {
      const poktanIdParam =
        selectedPoktan.length > 0
          ? selectedPoktan.map((opt) => opt.value).join(",")
          : null;

      await exportMutation.mutateAsync({
        poktanId: poktanIdParam,
        kategori: selectedCategory || null,
        komoditas: selectedCommodity || null,
        prakiraanMin: prakiraanMin || null,
        prakiraanMax: prakiraanMax || null,
        kecamatan: selectedKecamatan || null,
      });
    } catch (error) {
      console.error("Download filtered data failed:", error);
    }
  };

  const executeExport = async () => {
    try {
      let targetYear = null;
      let targetPrakiraanMin = null;
      let targetPrakiraanMax = null;

      if (exportType === "year") {
        targetYear = selectedExportYear;
      } else if (exportType === "month_year") {
        targetPrakiraanMin = `${exportPickerYear}-${selectedExportMonth}`;
        targetPrakiraanMax = `${exportPickerYear}-${selectedExportMonth}`;
      }

      const poktanIdParam =
        selectedPoktan.length > 0
          ? selectedPoktan.map((opt) => opt.value).join(",")
          : null;

      const response = await exportMutation.mutateAsync({
        poktanId: poktanIdParam,
        tahun: targetYear,
        kategori: selectedCategory || null,
        komoditas: selectedCommodity || null,
        prakiraanMin: targetPrakiraanMin,
        prakiraanMax: targetPrakiraanMax,
      });

      const rawData = response?.data?.data || [];
      if (rawData.length > 0) {
        setIsExportModalOpen(false);
      }
    } catch (error) {
      console.error("Export execution failed:", error);
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

  const handleUpdateRealisasiXLSX = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".xlsx, .xls, .csv";
    input.onchange = async (e: any) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          "text/csv",
        ];

        if (
          !allowedTypes.includes(file.type) &&
          !file.name.match(/\.(xlsx|xls|csv)$/i)
        ) {
          toast.error("File harus berformat .xlsx, .xls, atau .csv");
          return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          toast.error("Ukuran file maksimal 10MB");
          return;
        }

        setShowLoadingModal(true);
        setLoadingMessage(`Mengupdate data realisasi dari file ${file.name}...`);

        try {
          await updateRealisasiMutation.mutateAsync(file);
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
      title: "ID Data",
      sortable: true,
      align: "center",
      width: "85px",
      render: (item) => (
        <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800/60">
          {item.id}
        </span>
      ),
    },
    {
      key: "fk_kelompokId",
      title: "No. Poktan",
      align: "center",
      width: "60px",
      render: (item) => {
        return item.kelompok?.id || item.fk_kelompokId || "-";
      },
    },
    {
      key: "kategori",
      title: "Kategori",
      sortable: true,
      render: (item) => (
        <Chip
          className={
            item.kategori === "buah"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : item.kategori === "pangan"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : item.kategori === "perkebunan"
                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  : item.kategori === "jenis_sayur" || item.kategori === "sayur"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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
      render: (item) =>
        item.kelompok ? (
          <div>
            <div className="font-medium text-sm">
              {item.kelompok.namaKelompok}
            </div>
            <div className="text-xs text-gray-400">{item.kelompok.gapoktan}</div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        ),
    },
    {
      key: "kecamatan",
      title: "Kecamatan",
      render: (item) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {item.kelompok?.kecamatan || "-"}
        </span>
      ),
    },
    {
      key: "desa",
      title: "Desa",
      render: (item) => (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {item.kelompok?.desa || "-"}
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
      key: "realisasiHasilPanen",
      title: "Realisasi Hasil Panen",
      sortable: true,
      render: (item) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {item.realisasiHasilPanen !== null && item.realisasiHasilPanen !== undefined && item.realisasiHasilPanen !== 0
            ? `${item.realisasiHasilPanen.toLocaleString('id-ID')} Ton`
            : "-"}
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

          <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_REALISASI, PERMISSIONS.STATISTIC_EDIT]}>
            {(() => {
              const hasRealisasi = Boolean(
                (item.realisasiLuasPanen !== null && item.realisasiLuasPanen !== undefined) ||
                (item.realisasiHasilPanen !== null && item.realisasiHasilPanen !== undefined) ||
                (item.realisasiBulanPanen !== null && item.realisasiBulanPanen !== undefined && item.realisasiBulanPanen !== "")
              );

              // Jika role penyuluh dan data realisasi sudah selesai/diinput, hide tombol realisasi
              if (isPenyuluh && hasRealisasi) {
                return null;
              }

              return (
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
                  <Tooltip.Content>
                    {hasRealisasi ? "Edit Realisasi" : "Input Realisasi"}
                  </Tooltip.Content>
                </Tooltip>
              );
            })()}
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

      {/* 1. Tambah */}
      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_CREATE]}>
        <Tooltip>
          <Tooltip.Trigger>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#E8F0FE] hover:bg-[#D7E6FD] text-[#1A73E8] dark:bg-blue-950/50 dark:hover:bg-blue-900/50 dark:text-blue-300 transition-all cursor-pointer shadow-xs active:scale-95"
              onClick={handleCreate}
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Tambah Data Baru</Tooltip.Content>
        </Tooltip>
      </PermissionWrapper>

      {/* 2. Template (Hanya untuk Non-Penyuluh) */}
      {!isPenyuluh && (
        <Tooltip>
          <Tooltip.Trigger>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#7E22CE] dark:bg-purple-950/50 dark:hover:bg-purple-900/50 dark:text-purple-300 transition-all cursor-pointer shadow-xs active:scale-95"
              onClick={handleDownloadTemplate}
            >
              <TbTablePlus className="w-4 h-4" />
              <span>Template</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Download Template Data Statistika (.xlsx)</Tooltip.Content>
        </Tooltip>
      )}

      {/* 3. Import (Hanya untuk Non-Penyuluh) */}
      {!isPenyuluh && (
        <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_IMPORT]}>
          <Tooltip>
            <Tooltip.Trigger>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] dark:bg-amber-950/50 dark:hover:bg-amber-900/50 dark:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95"
                onClick={handleUploadXLSX}
              >
                <BsFiletypeXlsx className="w-4 h-4" />
                <span>Import</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Import Data dari Excel (.xlsx/.xls)</Tooltip.Content>
          </Tooltip>
        </PermissionWrapper>
      )}

      {/* 4. Update (Hanya untuk Non-Penyuluh) */}
      {!isPenyuluh && (
        <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_EDIT]}>
          <Tooltip>
            <Tooltip.Trigger>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:text-red-300 transition-all cursor-pointer shadow-xs active:scale-95"
                onClick={handleUpdateRealisasiXLSX}
              >
                <TbTableOptions className="w-4 h-4" />
                <span>Update</span>
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Update Realisasi Bulk dari Excel (.xlsx/.xls)</Tooltip.Content>
          </Tooltip>
        </PermissionWrapper>
      )}

      {/* 5. Export */}
      <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_EXPORT]}>
        <Tooltip>
          <Tooltip.Trigger>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95"
              onClick={handleExport}
            >
              <TbTableExport className="w-4 h-4" />
              <span>Export</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>Export Data ke XLSX</Tooltip.Content>
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

      {/* Search and Filters Container */}
      <div className="flex flex-col gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {/* Row 1: Gapoktan/Poktan Multi-Select (Full Width) */}
        <div className="w-full flex flex-col gap-1.5">
          <span className="text-xs font-normal text-gray-600 dark:text-gray-400 pl-1">
            Gapoktan/Poktan
          </span>
          <AsyncSelect
            isMulti
            cacheOptions
            isClearable={false}
            unstyled
            components={{
              MultiValue: CustomMultiValue,
              Option: CustomOption,
            }}
            classNames={{
              control: ({ isFocused }) =>
                `w-full px-3 py-1 bg-transparent border rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[46px] h-auto relative flex-wrap gap-1 ${isFocused
                  ? "border-green-500 ring-1 ring-green-500"
                  : "border-gray-300 dark:border-gray-600"
                }`,
              placeholder: () => "text-gray-400 text-sm pl-1 whitespace-nowrap",
              input: () => "text-gray-700 dark:text-gray-200 text-sm outline-none min-w-[120px] py-1",
              menu: () =>
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-[9999]",
              option: ({ isFocused, isSelected }) =>
                `px-3 py-2 text-sm rounded-lg cursor-pointer ${isSelected
                  ? "bg-green-600 text-white font-medium"
                  : isFocused
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-200"
                }`,
              valueContainer: () => "flex items-center flex-wrap flex-1 min-w-0 py-0.5 gap-1",
              indicatorsContainer: () => "flex items-center gap-1 text-gray-400 shrink-0 self-center",
              dropdownIndicator: () => "hover:text-gray-600 cursor-pointer p-0.5",
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
            placeholder="Cari Gapoktan/Poktan..."
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, zIndex: 9999 }),
            }}
            value={selectedPoktan}
            onChange={handlePoktanChange}
          />
        </div>

        {/* Row 2: Secondary Filters & Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 items-end">
          {/* Kecamatan Select */}
          <div className="flex-1 w-full min-w-[180px]">
            <Select
              label="Kecamatan"
              placeholder="Semua Kecamatan"
              variant="bordered"
              isLoading={isKecamatanLoading}
              selectedKeys={selectedKecamatan ? [selectedKecamatan] : []}
              onSelectionChange={(keys: any) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedKecamatan(selected || "");
                setCurrentPage(1);
              }}
              classNames={{
                trigger: "border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 min-h-[46px] px-3.5 py-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 text-sm font-normal text-gray-700 dark:text-gray-200",
                label: "font-normal"
              }}
            >
              {kecamatanList.map((kec: any) => (
                <SelectItem key={kec.nama} textValue={kec.nama}>
                  {kec.nama}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Jenis Tanaman Select */}
          <div className="flex-1 w-full min-w-[160px]">
            <Select
              label="Jenis Tanaman"
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
          <div className="flex-1 w-full min-w-[180px]">
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
          <div className="flex-1 w-full min-w-[190px] flex flex-col gap-1.5">
            <span className="text-xs font-normal text-gray-600 dark:text-gray-400 pl-1">Prakiraan Panen</span>
            <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
              <PopoverContent placement="bottom end" className="p-4 bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-lg w-72">
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
                          className={`py-2 transition-all font-medium rounded-lg text-xs ${isSelected
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

          {/* Actions: Reset & Download */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="w-full md:w-auto min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] dark:bg-red-950/50 dark:hover:bg-red-900/50 dark:text-red-300 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleDownloadFiltered}
              disabled={exportMutation.isPending}
              className="w-full md:w-auto min-h-[46px] px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 dark:text-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportMutation.isPending ? "Mengunduh..." : "Download"}
            </button>
          </div>
        </div>
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
          selectedPoktan.length > 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter: <strong>{selectedPoktan.map((item) => item.label).join(", ")}</strong>
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
              <Modal.Body className="space-y-5 p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pilih tipe export:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setExportType("all")}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all focus:outline-none ${exportType === "all"
                        ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-medium"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      <TbTableExport className="w-5 h-5 mb-1.5" />
                      <span className="text-xs">Semua</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportType("year")}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all focus:outline-none ${exportType === "year"
                        ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-medium"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      <FiCalendar className="w-5 h-5 mb-1.5" />
                      <span className="text-xs">Per Tahun</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExportType("month_year")}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all focus:outline-none ${exportType === "month_year"
                        ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-medium"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                      <FiCalendar className="w-5 h-5 mb-1.5" />
                      <span className="text-xs">Bulan & Tahun</span>
                    </button>
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

                {exportType === "month_year" && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-750">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-gray-600 dark:text-gray-400"
                        onPress={() => setExportPickerYear((prev) => prev - 1)}
                      >
                        &larr;
                      </Button>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        Tahun {exportPickerYear}
                      </span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-gray-600 dark:text-gray-400"
                        onPress={() => setExportPickerYear((prev) => prev + 1)}
                      >
                        &rarr;
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"].map((shortMonth, idx) => {
                        const monthValStr = String(idx + 1).padStart(2, "0");
                        const isSelected = selectedExportMonth === monthValStr;

                        return (
                          <Button
                            key={shortMonth}
                            size="sm"
                            className={`py-2 transition-all font-medium rounded-lg text-xs ${isSelected
                              ? "bg-green-600 text-white font-semibold hover:bg-green-700"
                              : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 border border-gray-250 dark:border-gray-700"
                              }`}
                            onPress={() => {
                              setSelectedExportMonth(monthValStr);
                            }}
                          >
                            {shortMonth}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  color="danger"
                  variant="light"
                  isDisabled={exportMutation.isPending}
                  onPress={() => setIsExportModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  className="text-gray-100"
                  color="success"
                  isLoading={exportMutation.isPending}
                  isDisabled={
                    (exportType === "year" && !selectedExportYear) ||
                    (exportType === "month_year" && !selectedExportMonth)
                  }
                  onPress={executeExport}
                >
                  Export ke Excel
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Download Template Selection Modal */}
      <Modal isOpen={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-xl shadow-lg">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Pilih Template Excel</Modal.Heading>
              </Modal.Header>

              <Modal.Body className="space-y-4 p-6">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Silakan pilih jenis template spreadsheet yang ingin Anda unduh:
                </p>

                <div className="flex flex-col gap-3">
                  {/* Option 1: Template Upload Data Statistika */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTemplateType("prakiraan")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedTemplateType("prakiraan");
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${selectedTemplateType === "prakiraan"
                        ? "border-green-500 bg-green-50/60 dark:bg-green-950/30 ring-2 ring-green-500/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/60 dark:hover:bg-gray-750"
                      }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg shrink-0 transition-colors ${selectedTemplateType === "prakiraan"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                    >
                      <TbTablePlus className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Template Upload Data Statistika
                        </h4>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedTemplateType === "prakiraan"
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        >
                          {selectedTemplateType === "prakiraan" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        Digunakan untuk mengunggah kumpulan data baru tanaman, periode tanam, luas lahan, serta estimasi/prakiraan hasil panen.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: Template Realisasi Data Statistika */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedTemplateType("realisasi")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedTemplateType("realisasi");
                      }
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${selectedTemplateType === "realisasi"
                        ? "border-green-500 bg-green-50/60 dark:bg-green-950/30 ring-2 ring-green-500/20"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/60 dark:hover:bg-gray-750"
                      }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg shrink-0 transition-colors ${selectedTemplateType === "realisasi"
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                    >
                      <IoIosCheckmarkCircleOutline className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Template Realisasi Data Statistika
                        </h4>
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${selectedTemplateType === "realisasi"
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        >
                          {selectedTemplateType === "realisasi" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        Digunakan untuk mengisi atau memperbarui data realisasi luas, hasil, dan bulan panen berdasarkan <strong className="text-blue-600 dark:text-blue-400">ID Data</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setIsTemplateModalOpen(false)}
                >
                  Tutup
                </Button>
                <Button
                  className="text-gray-100 font-medium"
                  color="success"
                  onPress={handleDownloadSelectedTemplate}
                >
                  Unduh Template
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};
