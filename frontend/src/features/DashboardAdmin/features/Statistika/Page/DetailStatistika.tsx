// pages/DetailStatistika.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useStatistikaDetailComplete } from "@/hook/dashboard/Statistika/useDetailStatistika";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

export const DetailStatistika = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: detailData, isLoading } = useStatistikaDetailComplete(id || "");

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageMeta
          description="Detail Statistika Pertanian"
          title="Detail Statistika | Admin Dashboard"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Statistika Pertanian",
              to: "/dashboard-admin/statistika-pertanian",
            },
            { label: "Detail Data" },
          ]}
        />

        <Card>
          <CardBody>
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-lg">Loading detail statistika...</span>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Jika masih loading atau belum ada data, tampilkan content dengan loading states
  if (isLoading || !detailData) {
    return (
      <div className="space-y-6">
        <PageMeta
          description="Detail Statistika Pertanian"
          title="Detail Statistika | Admin Dashboard"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Statistika Pertanian",
              to: "/dashboard-admin/statistika-pertanian",
            },
            { label: "Detail Data" },
          ]}
        />

        <Card>
          <CardBody>
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-lg">Loading detail statistika...</span>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const { statistika, kelompokTani, metrics, status } = detailData;

  return (
    <div className="min-h-screen space-y-6 max-w-6xl container mx-auto">
      <PageMeta
        description={`Detail Statistika - ${statistika.komoditas} (${kelompokTani.gapoktan})`}
        title="Detail Statistika | Admin Dashboard"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Statistika Pertanian",
            to: "/dashboard-admin/statistik-pertanian",
          },
          { label: "Detail Data" },
        ]}
      />

      {/* Header Info */}
      <Card>
        <CardBody>
          <div className="flex p-5 items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Detail Data Statistika
                </h1>
              </div>
              <p className="text-md text-gray-600 dark:text-gray-400">
                Komoditas:{" "}
                <span className="font-medium">{statistika.komoditas}</span> |
                Gapoktan:{" "}
                <span className="font-medium">{kelompokTani.gapoktan}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <PermissionWrapper permissions={[PERMISSIONS.STATISTIC_EDIT]}>
                <Button
                  as={Link}
                  color="primary"
                  size="sm"
                  to={`/dashboard-admin/statistik-pertanian/${statistika.id}/edit`}
                  variant="flat"
                >
                  Edit Data
                </Button>
              </PermissionWrapper>
              <Button
                size="sm"
                variant="light"
                onPress={() => navigate("/dashboard-admin/statistik-pertanian")}
              >
                ← Kembali
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Gapoktan */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold">Informasi Gapoktan</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      ID Kelompok
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      #{kelompokTani.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Gapoktan
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {kelompokTani.gapoktan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Nama Kelompok
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {kelompokTani.namaKelompok}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Kecamatan
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {kelompokTani.kecamatanData?.nama ||
                        kelompokTani.kecamatan}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Desa
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {kelompokTani.desaData?.nama || kelompokTani.desa}
                    </p>
                  </div>
                  {kelompokTani.penyuluh && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Penyuluh
                      </p>
                      <p className="text-gray-900 dark:text-gray-100 font-medium">
                        {kelompokTani.penyuluh}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Informasi Tanaman */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold">Informasi Tanaman</h3>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Kategori Tanaman
                    </p>
                    <div className="mt-1">
                      <Chip
                        color={
                          statistika.kategori === "pangan"
                            ? "success"
                            : statistika.kategori === "perkebunan"
                              ? "warning"
                              : statistika.kategori === "jenis_sayur"
                                ? "secondary"
                                : "primary"
                        }
                        variant="flat"
                      >
                        {statistika.kategori === "jenis_sayur"
                          ? "Jenis Sayur"
                          : statistika.kategori.charAt(0).toUpperCase() +
                            statistika.kategori.slice(1)}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Komoditas
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {statistika.komoditas}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Periode Tanam
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {statistika.periodeTanam}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Luas Lahan Tanam
                    </p>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {statistika.luasLahan.toLocaleString()} HA
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Data Panen */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold">Data Panen</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {/* Prakiraan Panen */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
                    Prakiraan Panen
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        Luas Panen
                      </p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                        {statistika.prakiraanLuasPanen.toLocaleString()} HA
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-300">
                        Hasil Panen
                      </p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-100">
                        {statistika.prakiraanHasilPanen.toLocaleString()} TON
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 dark:text-purple-300">
                        Bulan Panen
                      </p>
                      <p className="text-xl font-bold text-purple-800 dark:text-purple-100">
                        {statistika.prakiraanBulanPanen}
                      </p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Realisasi Panen */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-800 dark:text-white">
                      Realisasi Panen
                    </h4>
                    {!status.isRealisasiComplete && (
                      <Chip color="warning" size="sm" variant="flat">
                        Belum Lengkap
                      </Chip>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Luas Panen
                      </p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {statistika.realisasiLuasPanen?.toLocaleString() || "-"}
                        {statistika.realisasiLuasPanen ? " HA" : ""}
                      </p>
                      {statistika.realisasiLuasPanen && (
                        <p
                          className={`text-sm mt-1 ${
                            metrics.selisihLuasPanen >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metrics.selisihLuasPanen >= 0 ? "+" : ""}
                          {metrics.selisihLuasPanen.toLocaleString()} HA
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Hasil Panen
                      </p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {statistika.realisasiHasilPanen?.toLocaleString() ||
                          "-"}
                        {statistika.realisasiHasilPanen ? " TON" : ""}
                      </p>
                      {statistika.realisasiHasilPanen && (
                        <p
                          className={`text-sm mt-1 ${
                            metrics.selisihHasilPanen >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metrics.selisihHasilPanen >= 0 ? "+" : ""}
                          {metrics.selisihHasilPanen.toLocaleString()} TON
                        </p>
                      )}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bulan Panen
                      </p>
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {statistika.realisasiBulanPanen || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Statistics & Actions */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold">Status Data</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Data Prakiraan
                  </span>
                  <Chip
                    color={status.isPrakiraanComplete ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                  >
                    {status.isPrakiraanComplete
                      ? "Lengkap Sudah Diisi"
                      : "Belum Lengkap"}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Data Realisasi
                  </span>
                  <Chip
                    color={status.isRealisasiComplete ? "success" : "default"}
                    size="sm"
                    variant="flat"
                  >
                    {status.isRealisasiComplete
                      ? "Lengkap Sudah Diisi"
                      : "Belum Ada"}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Performance Metrics */}
          {status.isRealisasiComplete && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Performa Panen</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Realisasi Luas
                      </span>
                      <span className="font-medium">
                        {metrics.persentaseRealisasiLuas.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metrics.persentaseRealisasiLuas >= 100
                            ? "bg-green-500"
                            : metrics.persentaseRealisasiLuas >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(metrics.persentaseRealisasiLuas, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Realisasi Hasil
                      </span>
                      <span className="font-medium">
                        {metrics.persentaseRealisasiHasil.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metrics.persentaseRealisasiHasil >= 100
                            ? "bg-green-500"
                            : metrics.persentaseRealisasiHasil >= 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(metrics.persentaseRealisasiHasil, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold">Aksi</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                <Button
                  fullWidth
                  as={Link}
                  color="primary"
                  size="sm"
                  to={`/dashboard-admin/statistik-pertanian/${statistika.id}/edit`}
                  variant="flat"
                >
                  Edit Data Statistika
                </Button>
                <Button
                  fullWidth
                  size="sm"
                  variant="light"
                  onPress={() =>
                    navigate("/dashboard-admin/statistik-pertanian")
                  }
                >
                  Kembali ke Daftar
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
