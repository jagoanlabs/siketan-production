// pages/EditStatistika.tsx (Updated Final)
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";

import { StatistikaForm } from "../Components/StatsitikaForm";
import { GapoktanInfo } from "../Components/GapoktanInfo";

import { ReusableTable } from "@/components/Table/ReusableTable";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import {
  useStatistikaDetail,
  useKelompokTaniDetail,
} from "@/hook/dashboard/Statistika/useEditStatistika";
import { useStatistikaData } from "@/hook/dashboard/Statistika/useStatistika";
import { ColumnConfig, PaginationInfo } from "@/types/table";
import { StatistikaData, Kelompok } from "@/types/Statistika/statistika.d";

export const EditStatistika = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ASC" | "DESC";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch statistika detail
  const {
    data: statistikaDetail,
    isLoading: isDetailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useStatistikaDetail(id || "");

  // Fetch kelompok tani detail berdasarkan fk_kelompokId dari statistika
  const { data: kelompokTaniDetail, isLoading: isKelompokLoading } =
    useKelompokTaniDetail(statistikaDetail?.data?.fk_kelompokId || 0);

  // Fetch statistika data untuk tabel berdasarkan poktan_id
  const {
    data: statistikaData,
    isLoading: isStatistikaLoading,
    error: statistikaError,
    refetch: refetchStatistika,
  } = useStatistikaData({
    poktanId: statistikaDetail?.data?.fk_kelompokId || null,
    page: currentPage,
    limit: 10,
    sortBy: sortConfig?.key || "",
    sortType: sortConfig?.direction || "ASC",
    search: searchTerm,
  });

  // Handle form success
  const handleFormSuccess = () => {
    refetchDetail(); // Refresh detail data
    refetchStatistika(); // Refresh table data
    navigate("/dashboard-admin/statistik-pertanian");
  };

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
        <Chip
          color={item.id === parseInt(id || "0") ? "success" : "primary"}
          size="sm"
          variant="flat"
        >
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

  // Get kelompok data for GapoktanInfo component
  const selectedKelompokData: Kelompok | null = kelompokTaniDetail?.kelompokTani
    ? {
        id: kelompokTaniDetail.kelompokTani.id,
        gapoktan: kelompokTaniDetail.kelompokTani.gapoktan,
        namaKelompok: kelompokTaniDetail.kelompokTani.namaKelompok,
        desa: kelompokTaniDetail.kelompokTani.desa,
        kecamatan: kelompokTaniDetail.kelompokTani.kecamatan,
        penyuluh: kelompokTaniDetail.kelompokTani.penyuluh,
        createdAt: kelompokTaniDetail.kelompokTani.createdAt,
        updatedAt: kelompokTaniDetail.kelompokTani.updatedAt,
        kecamatanId: kelompokTaniDetail.kelompokTani.kecamatanId,
        desaId: kelompokTaniDetail.kelompokTani.desaId,
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

  // Loading states
  if (isDetailLoading) {
    return (
      <div className="space-y-6">
        <PageMeta
          description="Edit Data Statistika Pertanian"
          title="Edit Data Statistika | Admin Dashboard"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Statistika Pertanian",
              to: "/dashboard-admin/statistik-pertanian",
            },
            { label: "Edit Data" },
          ]}
        />

        <Card>
          <CardBody>
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-lg">Loading data statistika...</span>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Error states
  if (detailError || !statistikaDetail?.data) {
    return (
      <div className="min-h-screen space-y-6 max-w-6xl container mx-auto">
        <PageMeta
          description="Edit Data Statistika Pertanian"
          title="Edit Data Statistika | Admin Dashboard"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Statistika Pertanian",
              to: "/dashboard-admin/statistik-pertanian",
            },
            { label: "Edit Data" },
          ]}
        />

        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {detailError?.message ||
                  "Data statistika tidak ditemukan atau telah dihapus."}
              </p>
              <div className="flex justify-center gap-2">
                <Button color="primary" onPress={() => refetchDetail()}>
                  Coba Lagi
                </Button>
                <Button
                  variant="light"
                  onPress={() =>
                    navigate("/dashboard-admin/statistik-pertanian")
                  }
                >
                  Kembali ke Daftar
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageMeta
        description={`Edit Data Statistika - ${statistikaDetail.data.komoditas} (${statistikaDetail.data.kelompok?.gapoktan})`}
        title="Edit Data Statistika | Admin Dashboard"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Statistika Pertanian",
            to: "/dashboard-admin/statistik-pertanian",
          },
          { label: "Edit Data" },
        ]}
      />

      {/* Header Info */}
      <Card>
        <CardBody>
          <div className="flex p-5 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Edit Data Statistika
              </h1>
              <p className="text-md text-gray-600 dark:text-gray-400 mt-1">
                Komoditas:{" "}
                <span className="font-medium">
                  {statistikaDetail.data.komoditas}
                </span>{" "}
                | Gapoktan:{" "}
                <span className="font-medium">
                  {statistikaDetail.data.kelompok?.gapoktan}
                </span>
              </p>
            </div>
            <Button
              className="shrink-0"
              variant="light"
              onPress={() => navigate("/dashboard-admin/statistik-pertanian")}
            >
              ← Kembali ke Daftar
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Gapoktan Info */}
      {isKelompokLoading ? (
        <Card>
          <CardBody>
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" />
              <span className="ml-3">Loading informasi gapoktan...</span>
            </div>
          </CardBody>
        </Card>
      ) : (
        <GapoktanInfo kelompokData={selectedKelompokData} />
      )}

      {/* Edit Form */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold pl-5 pt-5 text-gray-800 dark:text-white">
              Form Edit Data Statistika
            </h2>
          </div>

          <StatistikaForm
            editId={statistikaDetail.data.id}
            initialData={statistikaDetail.data}
            isEdit={true}
            kelompokData={kelompokTaniDetail?.kelompokTani}
            selectedPoktanId={statistikaDetail.data.fk_kelompokId}
            onSuccess={handleFormSuccess}
          />
        </CardBody>
      </Card>

      {/* Data Table */}
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
          selectedKelompokData ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan data statistika untuk poktan:{" "}
              <strong>
                {selectedKelompokData.gapoktan} -{" "}
                {selectedKelompokData.namaKelompok}
              </strong>
            </p>
          ) : null
        }
        title="Data Statistika Kelompok"
        onClearSearch={handleClearSearch}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        onSort={handleSort}
      />
    </div>
  );
};
