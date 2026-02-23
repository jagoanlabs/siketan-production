import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import {
  useKelompokDetail,
  useKecamatanList,
  useDesaByKecamatan,
  useUpdateKelompok,
} from "@/hook/dashboard/kelompokTani/useEditKelompoktani";
import { UpdateKelompokData } from "@/types/KelompokTani/editKelompokTani";
import { LoadingSpinner } from "@/components/Spinner/LoadingSpinner";

export const EditKelompokTani = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    gapoktan: "",
    namaKelompok: "",
    kecamatanId: 0,
    desaId: 0,
  });

  const [selectedKecamatanId, setSelectedKecamatanId] = useState<number | null>(
    null,
  );
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API hooks
  const {
    data: kelompokDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useKelompokDetail(id || "");

  const { data: kecamatanList, isLoading: isLoadingKecamatan } =
    useKecamatanList();

  const { data: desaList, isLoading: isLoadingDesa } =
    useDesaByKecamatan(selectedKecamatanId);

  const updateMutation = useUpdateKelompok();

  // Initialize form data when kelompok detail is loaded
  useEffect(() => {
    if (kelompokDetail?.data) {
      const data = kelompokDetail.data;

      setFormData({
        gapoktan: data.gapoktan,
        namaKelompok: data.namaKelompok,
        kecamatanId: data.kecamatanId,
        desaId: data.desaId,
      });
      setSelectedKecamatanId(data.kecamatanId);
    }
  }, [kelompokDetail]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormDirty(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle kecamatan selection
  const handleKecamatanChange = (e: string) => {
    const kecamatanId = parseInt(e);

    setSelectedKecamatanId(kecamatanId);
    setFormData((prev) => ({
      ...prev,
      kecamatanId,
      desaId: 0, // Reset desa when kecamatan changes
    }));
    setIsFormDirty(true);

    if (errors.kecamatanId) {
      setErrors((prev) => ({
        ...prev,
        kecamatanId: "",
        desaId: "", // Also clear desa error
      }));
    }
  };

  // Handle desa selection
  const handleDesaChange = (e: string) => {
    const desaId = parseInt(e);

    setFormData((prev) => ({
      ...prev,
      desaId,
    }));
    setIsFormDirty(true);

    if (errors.desaId) {
      setErrors((prev) => ({
        ...prev,
        desaId: "",
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.gapoktan.trim()) {
      newErrors.gapoktan = "Nama Gapoktan harus diisi";
    }

    if (!formData.namaKelompok.trim()) {
      newErrors.namaKelompok = "Nama Kelompok harus diisi";
    }

    if (formData.kecamatanId === 0) {
      newErrors.kecamatanId = "Kecamatan harus dipilih";
    }

    if (formData.desaId === 0) {
      newErrors.desaId = "Desa harus dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.info("Mohon lengkapi semua field yang diperlukan");

      return;
    }

    if (!id) {
      toast.info("ID kelompok tidak ditemukan");

      return;
    }

    toast.info("💾 Menyimpan perubahan...");

    try {
      const updateData: UpdateKelompokData = {
        gapoktan: formData.gapoktan.trim(),
        namaKelompok: formData.namaKelompok.trim(),
        kecamatanId: formData.kecamatanId,
        desaId: formData.desaId,
      };

      await updateMutation.mutateAsync({ id, data: updateData });

      setIsFormDirty(false);
      toast.success("✅ Data kelompok berhasil diperbarui");

      // Navigate back after success with delay
      setTimeout(() => {
        navigate("/dashboard-admin/data-kelompok");
      }, 1500);
    } catch (error: any) {
      toast.error(
        `❌ ${error?.response?.data?.message || "Gagal memperbarui data kelompok"}`,
      );
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isFormDirty) {
      if (
        confirm("Ada perubahan yang belum disimpan. Yakin ingin membatalkan?")
      ) {
        navigate("/dashboard-admin/data-kelompok");
      }
    } else {
      navigate("/dashboard-admin/data-kelompok");
    }
  };

  // Loading state
  if (isLoadingDetail) {
    return (
      <div>
        <PageMeta
          description="Edit data kelompok tani"
          title="Edit Kelompok Tani | Sistem Manajemen Pertanian"
        />
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            { label: "Kelompok Tani", to: "/dashboard-admin/data-kelompok" },
            { label: "Edit Kelompok Tani" },
          ]}
        />

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Memuat data kelompok...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError) {
    return (
      <div className="min-h-screen max-w-6xl container mx-auto py-6">
        <PageMeta
          description="Edit data kelompok tani"
          title="Edit Kelompok Tani | Sistem Manajemen Pertanian"
        />
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            { label: "Kelompok Tani", to: "/dashboard-admin/data-kelompok" },
            { label: "Edit Kelompok Tani" },
          ]}
        />

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <svg
                className="w-12 h-12 text-red-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Data Tidak Ditemukan
              </h3>
              <p className="text-red-600 mb-4">
                Kelompok dengan ID {id} tidak ditemukan atau terjadi kesalahan.
              </p>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => navigate("/kelompok-tani")}
              >
                Kembali ke Daftar Kelompok
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-6">
      <PageMeta
        description="Edit data kelompok tani"
        title="Edit Kelompok Tani | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Kelompok Tani", to: "/dashboard-admin/data-kelompok" },
          { label: "Edit Kelompok Tani" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Kelompok Tani
              </h1>
              <p className="text-gray-600">
                {kelompokDetail?.data &&
                  `Mengedit kelompok: ${kelompokDetail.data.namaKelompok}`}
              </p>
            </div>
          </div>

          {/* Info Card */}
          {kelompokDetail?.data && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Data Saat Ini:
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>{kelompokDetail.data.namaKelompok}</strong> -
                    Gapoktan {kelompokDetail.data.gapoktan} -
                    {kelompokDetail.data.desaData.nama},{" "}
                    {kelompokDetail.data.kecamatanData.nama}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gapoktan Field */}
                <div className="md:col-span-2">
                  <Input
                    className={`w-full border rounded-lg transition-colors ${
                      errors.gapoktan
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    classNames={{
                      label: "font-semibold text-sm sm:text-base",
                      inputWrapper:
                        "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-green-500",
                      input: "text-sm sm:text-base",
                    }}
                    disabled={updateMutation.isPending}
                    label="Nama Gapoktan"
                    labelPlacement="outside"
                    name="gapoktan"
                    placeholder="Masukkan nama Gapoktan"
                    type="text"
                    value={formData.gapoktan}
                    variant="bordered"
                    onChange={handleInputChange}
                  />
                  {errors.gapoktan && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      {errors.gapoktan}
                    </p>
                  )}
                </div>

                {/* Nama Kelompok Field */}
                <div className="md:col-span-2">
                  <Input
                    className={`w-full border rounded-lg transition-colors ${
                      errors.gapoktan
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-green-500"
                    }`}
                    classNames={{
                      label: "font-semibold text-sm sm:text-base",
                      inputWrapper:
                        "px-3 sm:px-4 py-5 sm:py-6 w-full border-1 border-gray-300 bg-white hover:border-gray-400 data-[focus=true]:border-green-500",
                      input: "text-sm sm:text-base",
                    }}
                    label="Nama Kelompok"
                    labelPlacement="outside"
                    name="namaKelompok"
                    placeholder="Masukkan nama Gapoktan"
                    type="text"
                    value={formData.namaKelompok}
                    variant="bordered"
                    onChange={handleInputChange}
                  />
                  {errors.namaKelompok && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      {errors.namaKelompok}
                    </p>
                  )}
                </div>

                {/* Kecamatan Select */}
                <div>
                  <Select
                    isRequired
                    classNames={{
                      label: "text-gray-700 font-semibold",
                      trigger:
                        "border-2 hover:border-green-400 focus:border-green-500",
                      errorMessage: "text-red-600",
                      value: "text-gray-900",
                    }}
                    errorMessage={errors.kecamatanId}
                    isDisabled={isLoadingKecamatan || updateMutation.isPending}
                    isInvalid={!!errors.kecamatanId}
                    isLoading={isLoadingKecamatan}
                    label="Kecamatan"
                    placeholder={
                      isLoadingKecamatan
                        ? "Memuat kecamatan..."
                        : "Pilih Kecamatan"
                    }
                    selectedKeys={
                      formData.kecamatanId
                        ? [formData.kecamatanId.toString()]
                        : []
                    }
                    size="lg"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      if (selectedKey) {
                        handleKecamatanChange(selectedKey);
                      }
                    }}
                  >
                    {(kecamatanList?.data || []).map((kecamatan) => (
                      <SelectItem
                        key={kecamatan.id}
                        textValue={kecamatan.nama}
                      />
                    ))}
                  </Select>
                </div>

                {/* Desa Select */}
                <div>
                  <Select
                    isRequired
                    classNames={{
                      label: "text-gray-700 font-semibold",
                      trigger:
                        "border-2 hover:border-green-400 focus:border-green-500",
                      errorMessage: "text-red-600",
                      value: "text-gray-900",
                    }}
                    errorMessage={errors.desaId}
                    isDisabled={
                      !selectedKecamatanId ||
                      isLoadingDesa ||
                      updateMutation.isPending
                    }
                    isInvalid={!!errors.desaId}
                    isLoading={isLoadingDesa}
                    label="Desa"
                    placeholder={
                      !selectedKecamatanId
                        ? "Pilih kecamatan terlebih dahulu"
                        : isLoadingDesa
                          ? "Memuat desa..."
                          : "Pilih Desa"
                    }
                    selectedKeys={
                      formData.desaId ? [formData.desaId.toString()] : []
                    }
                    size="lg"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      if (selectedKey) {
                        handleDesaChange(selectedKey);
                      }
                    }}
                  >
                    {(desaList?.data || []).map((desa) => (
                      <SelectItem key={desa.id} textValue={desa.nama} />
                    ))}
                  </Select>
                  {!selectedKecamatanId && !errors.desaId && (
                    <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      Pilih kecamatan untuk memuat daftar desa
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={updateMutation.isPending || !isFormDirty}
                  type="submit"
                >
                  {updateMutation.isPending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
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
                      Simpan Perubahan
                    </>
                  )}
                </button>

                <button
                  className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={updateMutation.isPending}
                  type="button"
                  onClick={handleCancel}
                >
                  <svg
                    className="w-5 h-5"
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
                  Batal
                </button>
              </div>

              {/* Dirty Form Indicator */}
              {isFormDirty && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-yellow-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <p className="text-sm text-yellow-800">
                      Ada perubahan yang belum disimpan. Jangan lupa klik
                      &quot;Simpan Perubahan&quot;.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
