import { useState, useEffect, useMemo, useCallback } from "react";
import AsyncSelect from "react-select/async";

import { DashboardCardAdmin } from "./components/DashboardCardAdmin";
import { TopKomoditasTable } from "@/features/Home/components/KomoditasTertinggi";

import { ReusableTable } from "@/components/Table/ReusableTable";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";
import { useDashboardDataPotkan } from "@/hook/dashboard/useDashboardDataPotkan";
import { debounce } from "@/utils/debounce";
import {
  DataTanaman,
  TanamanQueryParams,
} from "@/types/dashboard/tableTanaman";
import { useTanamanData } from "@/hook/dashboard/useDashboardDataTable";
import { ColumnConfig, PaginationInfo } from "@/types/table";
import { useAuth } from "@/hook/UseAuth";
import { RoleHelper } from "@/helpers/RoleHelper/roleHelpers";

export const DashboardAdminIndex = () => {
  const { user } = useAuth();
  const isPenyuluh =
    user?.peran === "penyuluh" ||
    RoleHelper.isPenyuluh(user) ||
    (typeof (user as any)?.role === "string"
      ? ((user as any).role as string).includes("penyuluh")
      : Boolean((user as any)?.role?.name?.includes("penyuluh")));

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

  // Debounce function untuk table search
  const debouncedSetTableSearch = useMemo(
    () => debounce((value: string) => setDebouncedTableSearch(value), 500),
    [],
  );

  // Update debounced search ketika user mengetik
  useEffect(() => {
    debouncedSetTableSearch(tableSearchTerm);
  }, [tableSearchTerm, debouncedSetTableSearch]);

  // Parameters untuk API call
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

  // Queries
  const {
    data: dataPotkan,
    isLoading: isPotkanLoading,
    error: potkanError,
  } = useDashboardDataPotkan(poktanSearchTerm);

  const {
    data: tanamanResponse,
    isLoading: isTanamanLoading,
    error: tanamanError,
  } = useTanamanData(tanamanParams);

  // Debounced search untuk poktan
  const debouncedSetPoktanSearch = useMemo(
    () => debounce((value: string) => setPoktanSearchTerm(value), 500),
    [],
  );

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

  // Default options untuk AsyncSelect
  const { data: defaultData } = useDashboardDataPotkan("");
  const defaultOptions = useMemo(() => {
    if (defaultData) {
      return defaultData.map((item: DashoardDataPotkan) => ({
        value: item.id,
        label: item.gapoktan + " - " + item.namaKelompok,
        data: item,
      }));
    }

    return [];
  }, [defaultData]);

  // Handle poktan selection change
  const handlePoktanChange = (option: any) => {
    setSelectedOption(option);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (key: string) => {
    let direction: "ASC" | "DESC" = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle table search change
  const handleTableSearchChange = (value: string) => {
    setTableSearchTerm(value);
    setCurrentPage(1);
  };

  // Clear search function
  const clearTableSearch = () => {
    setTableSearchTerm("");
    setDebouncedTableSearch("");
    setCurrentPage(1);
  };

  // ✨ Table columns configuration
  const columns: ColumnConfig<DataTanaman>[] = useMemo(
    () => [
      {
        key: "no",
        title: "No",
        width: "80px",
        render: (_, index, paginationInfo) => {
          return paginationInfo ? paginationInfo.from + index : index + 1;
        },
      },
      {
        key: "kategori",
        title: "Kategori",
        sortable: true,
        render: (item: DataTanaman) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.kategori}
          </span>
        ),
      },
      {
        key: "komoditas",
        title: "Komoditas",
        sortable: true,
      },
      {
        key: "kelompok",
        title: "Kelompok",
        render: (item: DataTanaman) => (
          <div>
            <div className="font-medium">{item.kelompok.namaKelompok}</div>
            <div className="text-xs text-gray-400">
              {item.kelompok.gapoktan}
            </div>
          </div>
        ),
      },
      {
        key: "luasLahan",
        title: "Luas Lahan",
        sortable: true,
        align: "center",
        render: (item: DataTanaman) => `${item.luasLahan} Ha`,
      },
      {
        key: "periodeTanam",
        title: "Periode Tanam",
        sortable: true,
        align: "center",
      },
      {
        key: "prakiraanBulanPanen",
        title: "Prakiraan Panen",
        sortable: true,
        align: "center",
      },
    ],
    [],
  );

  // Table data
  const tableData = tanamanResponse?.data.data || [];

  // Pagination info
  const paginationInfo: PaginationInfo = useMemo(() => {
    const data = tanamanResponse?.data;

    return {
      total: data?.total || 0,
      currentPages: data?.currentPages || 1,
      maxPages: data?.maxPages || 1,
      from: data?.from || 1,
      to: data?.to || 0,
    };
  }, [tanamanResponse]);

  // Custom subtitle dengan info filter
  const subtitle = useMemo(() => {
    if (selectedOption) {
      return (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Filter: {selectedOption.label}
        </p>
      );
    }

    return null;
  }, [selectedOption]);

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description={
          isPenyuluh
            ? "Dashboard Penyuluh untuk mengelola data statistik pertanian"
            : "Dashboard Admin untuk mengelola data statistik pertanian"
        }
        title={
          isPenyuluh
            ? "Dashboard Penyuluh | Sistem Manajemen Pertanian"
            : "Dashboard Admin | Sistem Manajemen Pertanian"
        }
      />
      <PageBreadcrumb
        items={[
          { label: isPenyuluh ? "Dashboard Penyuluh" : "Dashboard Admin" },
        ]}
      />
      {/* Card Statistik */}
      <DashboardCardAdmin />

      {/* Filter Poktan */}
      <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800 mb-6">
        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Filter berdasarkan Poktan
        </p>
        <AsyncSelect
          cacheOptions
          isClearable
          unstyled
          classNames={{
            control: ({ isFocused }) =>
              `w-full px-3.5 py-3 bg-transparent border rounded-xl hover:border-gray-400 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[40px] ${
                isFocused
                  ? "border-green-500 ring-1 ring-green-500"
                  : "border-gray-300 dark:border-gray-600"
              }`,
            placeholder: () => "text-gray-400 text-sm",
            singleValue: () => "text-gray-700 dark:text-gray-200 text-sm",
            input: () => "text-gray-700 dark:text-gray-200 text-sm outline-none",
            menu: () => "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-50",
            option: ({ isFocused, isSelected }) =>
              `px-3 py-2.5 text-sm rounded-lg cursor-pointer ${
                isSelected
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
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? `Tidak ada hasil untuk "${inputValue}"`
              : "Ketik untuk mencari..."
          }
          placeholder="Pilih atau cari poktan..."
          value={selectedOption}
          onChange={handlePoktanChange}
        />
        {potkanError && (
          <div className="text-red-500 text-sm mt-2">
            Error: {potkanError.message}
          </div>
        )}
      </div>

      {/* ✨ Menggunakan ReusableTable */}
      <ReusableTable<DataTanaman>
        // Data & Loading
        currentPage={currentPage}
        data={tableData}
        error={tanamanError}
        
        // Columns Configuration
        columns={columns}
        
        // Search
        debouncedSearchTerm={debouncedTableSearch}
        emptyStateMessage="Tidak ada data tanaman yang ditemukan"
        loading={isTanamanLoading}
        paginationInfo={paginationInfo}
        searchPlaceholder="Cari kategori atau komoditas..."
        
        // Sorting
        searchTerm={tableSearchTerm}
        onSort={handleSort}
        
        // Pagination
        showPagination={true}
        showSearch={true}
        onPageChange={handlePageChange}
        
        // Styling & Behavior
        subtitle={subtitle}
        title="Data Tanaman"
        onClearSearch={clearTableSearch}
        onSearchChange={handleTableSearchChange}
      />

      {/* Widget Tabel Realisasi Panen Komoditas Tertinggi (Hanya untuk Admin / Non-Penyuluh) */}
      {!isPenyuluh && (
        <div className="mt-8">
          <TopKomoditasTable
            title="Realisasi Panen Komoditas Tertinggi"
            type="realisasi"
          />
        </div>
      )}
    </div>
  );
};
