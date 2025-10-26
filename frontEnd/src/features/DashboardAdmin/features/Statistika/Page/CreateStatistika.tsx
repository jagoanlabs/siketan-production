// pages/CreateStatistika.tsx
import { useCallback, useMemo, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import AsyncSelect from "react-select/async";
import { useNavigate } from "react-router-dom";

import { GapoktanInfo } from "../Components/GapoktanInfo";
import { StatistikaForm } from "../Components/StatsitikaForm";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useDashboardDataPotkan } from "@/hook/dashboard/useDashboardDataPotkan";
import { DashoardDataPotkan } from "@/types/dashboard/searchPoktan";
import { debounce } from "@/utils/debounce";
import { ColumnConfig, PaginationInfo } from "@/types/table";
import { Kelompok, StatistikaData } from "@/types/Statistika/statistika.d";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { useStatistikaData } from "@/hook/dashboard/Statistika/useStatistika";

export const CreateStatistika = () => {
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [poktanSearchTerm, setPoktanSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ASC" | "DESC";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Queries
  const {
    data: dataPotkan,
    isLoading: isPotkanLoading,
    error: potkanError,
  } = useDashboardDataPotkan(poktanSearchTerm);

  const {
    data: statistikaData,
    isLoading: isStatistikaLoading,
    error: statistikaError,
    refetch: refetchStatistika,
  } = useStatistikaData({
    poktanId: selectedOption?.value || null,
    page: currentPage,
    limit: 10,
    sortBy: sortConfig?.key || "",
    sortType: sortConfig?.direction || "ASC",
    search: searchTerm,
  });

  // Default options untuk AsyncSelect
  const { data: defaultData } = useDashboardDataPotkan("");
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

  // Debounced search untuk poktan
  const debouncedSetPoktanSearch = useMemo(
    () => debounce((value: string) => setPoktanSearchTerm(value), 500),
    [],
  );

  // Handle poktan selection change
  const handlePoktanChange = (option: any) => {
    setSelectedOption(option);
    setCurrentPage(1);
    setSearchTerm("");
  };

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

  // Table columns
  const columns: ColumnConfig<StatistikaData>[] = [
    {
      key: "index",
      title: "No",
      align: "center",
      width: "60px",
      render: (_, index, paginationInfo) => {
        if (paginationInfo) {
          return (paginationInfo.currentPages - 1) * 10 + index + 1;
        }

        return index + 1;
      },
    },
    {
      key: "id",
      title: "No Poktan",
      sortable: true,
      render: (item) => (
        <Chip color="primary" size="sm" variant="flat">
          #{item.id}
        </Chip>
      ),
    },
    {
      key: "kategori",
      title: "Kategori Tanam",
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
      key: "createdAt",
      title: "Tanggal Dibuat",
      sortable: true,
      render: (item) =>
        new Date(item.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "prakiraanBulanPanen",
      title: "Prakiraan Bulan Panen",
      sortable: true,
      render: (item) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {item.prakiraanBulanPanen}
        </span>
      ),
    },
  ];

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "ASC" ? "DESC" : "ASC" };
      }

      return { key, direction: "ASC" };
    });
  };

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // form success
  const handleFormSuccess = () => {
    refetchStatistika();
    navigate("/dashboard-admin/statistik-pertanian");
  };

  // Get kelompok data from selected option
  const selectedKelompokData: Kelompok | null = selectedOption?.data
    ? {
        id: selectedOption.data.id,
        gapoktan: selectedOption.data.gapoktan,
        namaKelompok: selectedOption.data.namaKelompok,
        desa: selectedOption.data.desa,
        kecamatan: selectedOption.data.kecamatan || "",
        penyuluh: selectedOption.data.penyuluh || null,
        createdAt: selectedOption.data.createdAt || null,
        updatedAt: selectedOption.data.updatedAt || new Date().toISOString(),
        kecamatanId: selectedOption.data.kecamatanId || 0,
        desaId: selectedOption.data.desaId || 0,
      }
    : null;

  // Pagination info
  const paginationInfo: PaginationInfo | undefined = statistikaData?.data
    ? {
        total: statistikaData.data.total,
        currentPages: statistikaData.data.currentPages,
        maxPages: statistikaData.data.maxPages,
        from: statistikaData.data.from,
        to: statistikaData.data.to,
      }
    : undefined;

  return (
    <div className="min-h-screen space-y-6 max-w-6xl container mx-auto">
      <PageMeta
        description="Tambah Data Statistika Pertanian - Kelola data statistik pertanian berdasarkan poktan"
        title="Tambah Data Statistika | Admin Dashboard"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Statistika Pertanian",
            to: "/dashboard-admin/statistik-pertanian",
          },
          { label: "Tambah Data" },
        ]}
      />

      {/* Poktan Selection */}
      <Card>
        <CardBody>
          <div className="mb-4 p-3">
            <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter berdasarkan Poktan <span className="text-red-500">*</span>
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
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
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
        </CardBody>
      </Card>
      {/* Gapoktan Info */}
      <GapoktanInfo kelompokData={selectedKelompokData} />

      {/* Form */}
      {selectedOption && (
        <Card>
          <CardBody>
            <h2 className="text-xl font-bold pl-5 pt-5 text-gray-800 dark:text-white mb-4">
              Form Tambah Data Statistika
            </h2>
            <StatistikaForm
              selectedPoktanId={selectedOption?.value || null}
              onSuccess={handleFormSuccess}
            />
          </CardBody>
        </Card>
      )}

      {/* Data Table */}
      {selectedOption && (
        <ReusableTable
          className="mt-6"
          columns={columns}
          currentPage={currentPage}
          data={statistikaData?.data.data || []}
          emptyStateMessage="Belum ada data statistika untuk poktan ini"
          error={statistikaError}
          loading={isStatistikaLoading}
          paginationInfo={paginationInfo}
          searchTerm={searchTerm}
          subtitle={
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan data statistika untuk poktan:{" "}
              <strong>{selectedOption.label}</strong>
            </p>
          }
          title="Data Statistika"
          onClearSearch={handleClearSearch}
          onPageChange={handlePageChange}
          onSearchChange={handleSearchChange}
          onSort={handleSort}
        />
      )}
    </div>
  );
};
