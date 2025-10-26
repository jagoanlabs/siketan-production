// pages/RealisasiStatistika.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useStatistikaDetailComplete } from "@/hook/dashboard/Statistika/useDetailStatistika";
import { useUpdateRealisasiStatistika } from "@/hook/dashboard/Statistika/useRealisasiStatistika";
import { BULAN_OPTIONS } from "@/types/Statistika/statistika.d";
import {
  RealisasiStatistikaFormData,
  RealisasiValidationErrors,
} from "@/types/Statistika/realsiasiStatistika";

export const RealisasiStatistika = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RealisasiStatistikaFormData>({
    realisasiLuasPanen: null,
    realisasiHasilPanen: null,
    realisasiBulanPanen: "",
  });

  const [errors, setErrors] = useState<RealisasiValidationErrors>({});

  const {
    data: detailData,
    isLoading,
    error,
    refetch,
  } = useStatistikaDetailComplete(id || "");

  const updateMutation = useUpdateRealisasiStatistika();

  // Initialize form data when detail data is loaded
  React.useEffect(() => {
    if (detailData?.statistika) {
      setFormData({
        realisasiLuasPanen: detailData.statistika.realisasiLuasPanen,
        realisasiHasilPanen: detailData.statistika.realisasiHasilPanen,
        realisasiBulanPanen: detailData.statistika.realisasiBulanPanen || "",
      });
    }
  }, [detailData]);

  const handleInputChange = (
    field: keyof RealisasiStatistikaFormData,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RealisasiValidationErrors = {};

    if (!formData.realisasiLuasPanen || formData.realisasiLuasPanen <= 0) {
      newErrors.realisasiLuasPanen =
        "Realisasi luas panen harus diisi dan lebih dari 0";
    }
    if (!formData.realisasiHasilPanen || formData.realisasiHasilPanen <= 0) {
      newErrors.realisasiHasilPanen =
        "Realisasi hasil panen harus diisi dan lebih dari 0";
    }
    if (!formData.realisasiBulanPanen) {
      newErrors.realisasiBulanPanen = "Bulan realisasi panen harus dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !detailData) return;

    try {
      await updateMutation.mutateAsync({
        id: detailData.statistika.id,
        realisasiData: formData,
        statistikaData: detailData.statistika,
        kelompokData: detailData.kelompokTani,
      });

      // Refresh data and show success
      refetch();
    } catch (error) {
      console.error("Error updating realisasi:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageMeta
          description="Input Realisasi Panen"
          title="Realisasi Panen | Admin Dashboard"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Statistika Pertanian",
              to: "/dashboard-admin/statistik-pertanian",
            },
            { label: "Realisasi Panen" },
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

  // Error state
  if (error || !detailData) {
    return (
      <div className="min-h-screen space-y-6 max-w-6xl container mx-auto">
        <PageMeta
          description="Input Realisasi Panen"
          title="Realisasi Panen | Admin Dashboard"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Statistika Pertanian",
              to: "/dashboard-admin/statistik-pertanian",
            },
            { label: "Realisasi Panen" },
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
                Data statistika tidak ditemukan atau telah dihapus.
              </p>
              <Button
                color="primary"
                onPress={() => navigate("/dashboard-admin/statistik-pertanian")}
              >
                Kembali ke Daftar
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const { statistika, kelompokTani, metrics } = detailData;

  return (
    <div className="space-y-6">
      <PageMeta
        description={`Realisasi Panen - ${statistika.komoditas} (${kelompokTani.gapoktan})`}
        title="Realisasi Panen | Admin Dashboard"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Statistika Pertanian",
            to: "/dashboard-admin/statistik-pertanian",
          },
          { label: "Realisasi Panen" },
        ]}
      />

      {/* Header Info */}
      <Card className="p-5">
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Input Realisasi Panen
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ID: <span className="font-medium">#{statistika.id}</span> |
                Komoditas:{" "}
                <span className="font-medium">{statistika.komoditas}</span> |
                Gapoktan:{" "}
                <span className="font-medium">{kelompokTani.gapoktan}</span>
              </p>
            </div>
            <Button
              size="sm"
              variant="light"
              onPress={() => navigate("/dashboard-admin/statistik-pertanian")}
            >
              ← Kembali
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Detail Information */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Kategori Tanaman
                    </p>
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
                      size="lg"
                      variant="flat"
                    >
                      {statistika.kategori === "jenis_sayur"
                        ? "Jenis Sayur"
                        : statistika.kategori.charAt(0).toUpperCase() +
                          statistika.kategori.slice(1)}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Komoditas
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {statistika.komoditas}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Periode Tanam
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {statistika.periodeTanam}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Luas Lahan Tanam
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {statistika.luasLahan.toLocaleString()}
                      </p>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Hektare
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Data Prakiraan Panen */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold">Data Prakiraan Panen</h3>
            </CardHeader>
            <CardBody>
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
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Realisasi Form */}
        <div className="space-y-6">
          {/* Form Realisasi */}
          <Card className="p-5">
            <CardHeader>
              <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                Input Realisasi Panen
              </h3>
            </CardHeader>
            <CardBody>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  isRequired
                  errorMessage={errors.realisasiLuasPanen}
                  isInvalid={!!errors.realisasiLuasPanen}
                  label="Realisasi Luas Panen (HA)"
                  min="0"
                  placeholder="Masukkan realisasi luas panen"
                  step="0.01"
                  type="number"
                  value={formData.realisasiLuasPanen?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    handleInputChange(
                      "realisasiLuasPanen",
                      value ? parseFloat(value) : null,
                    );
                  }}
                />

                <Input
                  isRequired
                  errorMessage={errors.realisasiHasilPanen}
                  isInvalid={!!errors.realisasiHasilPanen}
                  label="Realisasi Hasil Panen (TON)"
                  min="0"
                  placeholder="Masukkan realisasi hasil panen"
                  step="0.01"
                  type="number"
                  value={formData.realisasiHasilPanen?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    handleInputChange(
                      "realisasiHasilPanen",
                      value ? parseFloat(value) : null,
                    );
                  }}
                />

                <Select
                  isRequired
                  errorMessage={errors.realisasiBulanPanen}
                  isInvalid={!!errors.realisasiBulanPanen}
                  label="Bulan Realisasi Panen"
                  placeholder="Pilih bulan realisasi panen"
                  selectedKeys={
                    formData.realisasiBulanPanen
                      ? [formData.realisasiBulanPanen]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;

                    handleInputChange("realisasiBulanPanen", selected);
                  }}
                >
                  {BULAN_OPTIONS.map((bulan) => (
                    <SelectItem key={bulan} textValue={bulan}>
                      {bulan}
                    </SelectItem>
                  ))}
                </Select>

                <Divider className="my-4" />

                <Button
                  fullWidth
                  color="primary"
                  isLoading={updateMutation.isPending}
                  size="lg"
                  type="submit"
                >
                  {updateMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Realisasi"}
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Current Realisasi Status */}
          {(statistika.realisasiLuasPanen ||
            statistika.realisasiHasilPanen) && (
            <Card className="p-5">
              <CardHeader>
                <h3 className="text-lg font-semibold">Realisasi Saat Ini</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Luas Panen
                    </span>
                    <span className="font-medium">
                      {statistika.realisasiLuasPanen?.toLocaleString() || 0} HA
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Hasil Panen
                    </span>
                    <span className="font-medium">
                      {statistika.realisasiHasilPanen?.toLocaleString() || 0}{" "}
                      TON
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Bulan Panen
                    </span>
                    <span className="font-medium">
                      {statistika.realisasiBulanPanen || "-"}
                    </span>
                  </div>

                  <Divider className="my-3" />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pencapaian Luas
                      </span>
                      <span
                        className={`font-medium ${
                          metrics.persentaseRealisasiLuas >= 100
                            ? "text-green-600"
                            : metrics.persentaseRealisasiLuas >= 80
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {metrics.persentaseRealisasiLuas.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pencapaian Hasil
                      </span>
                      <span
                        className={`font-medium ${
                          metrics.persentaseRealisasiHasil >= 100
                            ? "text-green-600"
                            : metrics.persentaseRealisasiHasil >= 80
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {metrics.persentaseRealisasiHasil.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
