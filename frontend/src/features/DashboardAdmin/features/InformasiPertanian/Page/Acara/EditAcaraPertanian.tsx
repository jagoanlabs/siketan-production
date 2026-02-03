import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { Spinner } from "@heroui/spinner";
import { CalendarDate } from "@internationalized/date";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import {
  useAcaraDetail,
  useUpdateAcara,
} from "@/hook/dashboard/infoPertanian/useUpdateAcara";
import {
  EditAcaraFormData,
  EditAcaraFormErrors,
} from "@/types/InfoPertanian/editAcara.d";
import { assets } from "@/assets/assets";

export const EditAcaraPertanian = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: acaraDetailResponse,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useAcaraDetail(id!);
  const updateAcaraMutation = useUpdateAcara();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<EditAcaraFormData>({
    namaKegiatan: "",
    tanggalAcara: "",
    waktuMulai: "",
    waktuSelesai: "",
    tempat: "",
    peserta: "",
    isi: "",
    fotoKegiatan: null,
  });

  const [errors, setErrors] = useState<EditAcaraFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Parse waktu dari format "HH:mm - HH:mm"
  const parseWaktuAcara = (waktuAcara: string) => {
    if (!waktuAcara || !waktuAcara.includes(" - ")) {
      return { waktuMulai: "", waktuSelesai: "" };
    }
    const [waktuMulai, waktuSelesai] = waktuAcara.split(" - ");

    return { waktuMulai: waktuMulai.trim(), waktuSelesai: waktuSelesai.trim() };
  };

  // Parse tanggal dari format ISO string ke CalendarDate
  const parseDateToCalendarDate = (dateString: string) => {
    if (!dateString) return null;
    try {
      // Handle ISO date format from backend (e.g., "2025-07-27T00:00:00.000Z")
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const day = date.getDate();

      return new CalendarDate(year, month, day);
    } catch (error) {
      console.error("Error parsing date:", error);

      return null;
    }
  };

  // Load data ke form saat data berhasil dimuat
  useEffect(() => {
    if (acaraDetailResponse?.infotani) {
      const acara = acaraDetailResponse.infotani;
      const { waktuMulai, waktuSelesai } = parseWaktuAcara(acara.waktuAcara);

      // Format tanggal dari ISO string ke YYYY-MM-DD
      const formattedDate = acara.tanggalAcara
        ? new Date(acara.tanggalAcara).toISOString().split("T")[0]
        : "";

      setFormData({
        namaKegiatan: acara.namaKegiatan,
        tanggalAcara: formattedDate,
        waktuMulai,
        waktuSelesai,
        tempat: acara.tempat,
        peserta: acara.peserta,
        isi: acara.isi,
        fotoKegiatan: null,
      });

      // Set current image
      if (acara.fotoKegiatan) {
        setCurrentImage(acara.fotoKegiatan);
        setImagePreview(acara.fotoKegiatan);
      }

      // Set selected date
      setSelectedDate(parseDateToCalendarDate(acara.tanggalAcara));
    }
  }, [acaraDetailResponse]);

  // Format date untuk backend (YYYY-MM-DD) dari CalendarDate
  const formatDateForBackend = (calendarDate: CalendarDate | null) => {
    if (!calendarDate) return "";
    const day = calendarDate.day.toString().padStart(2, "0");
    const month = calendarDate.month.toString().padStart(2, "0");
    const year = calendarDate.year.toString();

    return `${year}-${month}-${day}`;
  };

  // Handle date change
  const handleDateChange = (date: CalendarDate | null) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      tanggalAcara: date ? formatDateForBackend(date) : "",
    }));

    if (errors.tanggalAcara) {
      setErrors((prev) => ({
        ...prev,
        tanggalAcara: undefined,
      }));
    }
  };

  // Validasi form
  const validateForm = (): boolean => {
    const newErrors: EditAcaraFormErrors = {};

    if (!formData.namaKegiatan.trim()) {
      newErrors.namaKegiatan = "Nama kegiatan wajib diisi";
    }

    if (!formData.tanggalAcara) {
      newErrors.tanggalAcara = "Tanggal acara wajib diisi";
    }

    if (!formData.waktuMulai) {
      newErrors.waktuMulai = "Waktu mulai wajib diisi";
    }

    if (!formData.waktuSelesai) {
      newErrors.waktuSelesai = "Waktu selesai wajib diisi";
    }

    if (formData.waktuMulai && formData.waktuSelesai) {
      if (formData.waktuMulai >= formData.waktuSelesai) {
        newErrors.waktuSelesai =
          "Waktu selesai harus lebih besar dari waktu mulai";
      }
    }

    if (!formData.tempat.trim()) {
      newErrors.tempat = "Tempat wajib diisi";
    }

    if (!formData.peserta.trim()) {
      newErrors.peserta = "Peserta wajib diisi";
    }

    if (!formData.isi.trim()) {
      newErrors.isi = "Deskripsi acara wajib diisi";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field: keyof EditAcaraFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const validFormats = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
      ];

      if (!validFormats.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          fotoKegiatan: "Format file harus PNG, JPG, JPEG, atau GIF",
        }));

        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          fotoKegiatan: "Ukuran file maksimal 5MB",
        }));

        return;
      }

      setFormData((prev) => ({
        ...prev,
        fotoKegiatan: file,
      }));

      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        fotoKegiatan: undefined,
      }));
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      fotoKegiatan: null,
    }));
    setImagePreview(currentImage); // Kembali ke gambar asli
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        namaKegiatan: formData.namaKegiatan,
        tanggalAcara: formData.tanggalAcara,
        waktuAcara: `${formData.waktuMulai} - ${formData.waktuSelesai}`,
        tempat: formData.tempat,
        peserta: formData.peserta,
        createdBy: acaraDetailResponse?.infotani?.createdBy || "", // Get from original data
        isi: formData.isi,
        fotoKegiatan: formData.fotoKegiatan,
      };

      await updateAcaraMutation.mutateAsync({ id: id!, data: submitData });
      navigate("/dashboard-admin/acara-pertanian");
    } catch (error) {
      // Error handling sudah dilakukan di hook
    }
  };

  // Loading state
  if (isLoadingDetail) {
    return (
      <div className="min-h-screen max-w-6xl container mx-auto py-6">
        <PageMeta
          description="Edit acara pertanian"
          title="Edit Acara Pertanian | Sistem Manajemen Pertanian"
        />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="text-gray-600 mt-4">Memuat data acara...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError || !acaraDetailResponse?.infotani) {
    return (
      <div className="min-h-screen max-w-6xl container mx-auto py-6">
        <PageMeta
          description="Edit acara pertanian"
          title="Edit Acara Pertanian | Sistem Manajemen Pertanian"
        />
        <div className="container mx-auto px-4">
          <Card className="bg-red-50 border-red-200" shadow="sm">
            <CardBody className="text-center py-8">
              <svg
                className="w-16 h-16 text-red-400 mx-auto mb-4"
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
              <p className="text-red-700 font-medium mb-2">
                Gagal memuat data acara
              </p>
              <p className="text-red-600 text-sm mb-4">
                Acara tidak ditemukan atau terjadi kesalahan saat mengambil
                data.
              </p>
              <Button
                color="primary"
                variant="flat"
                onPress={() => navigate("/dashboard-admin/acara-pertanian")}
              >
                Kembali ke Daftar Acara
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <PageMeta
        description="Edit acara pertanian"
        title="Edit Acara Pertanian | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Acara Pertanian", to: "/dashboard-admin/acara-pertanian" },
          { label: "Edit Acara" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
                Edit Acara Pertanian
              </h1>
              <p className="text-gray-600">
                Perbarui informasi acara atau kegiatan pertanian
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Dasar
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    isRequired
                    errorMessage={errors.namaKegiatan}
                    isInvalid={!!errors.namaKegiatan}
                    label="Nama Kegiatan"
                    placeholder="Masukkan nama kegiatan"
                    value={formData.namaKegiatan}
                    onValueChange={(value) =>
                      handleInputChange("namaKegiatan", value)
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DatePicker
                      isRequired
                      showMonthAndYearPickers
                      errorMessage={errors.tanggalAcara}
                      isInvalid={!!errors.tanggalAcara}
                      label="Tanggal Acara"
                      placeholderValue={new CalendarDate(2024, 1, 1)}
                      value={selectedDate}
                      onChange={handleDateChange}
                    />

                    <Input
                      isRequired
                      errorMessage={errors.tempat}
                      isInvalid={!!errors.tempat}
                      label="Tempat"
                      placeholder="Masukkan lokasi acara"
                      value={formData.tempat}
                      onValueChange={(value) =>
                        handleInputChange("tempat", value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      isRequired
                      errorMessage={errors.waktuMulai}
                      isInvalid={!!errors.waktuMulai}
                      label="Waktu Mulai"
                      type="time"
                      value={formData.waktuMulai}
                      onValueChange={(value) =>
                        handleInputChange("waktuMulai", value)
                      }
                    />

                    <Input
                      isRequired
                      errorMessage={errors.waktuSelesai}
                      isInvalid={!!errors.waktuSelesai}
                      label="Waktu Selesai"
                      type="time"
                      value={formData.waktuSelesai}
                      onValueChange={(value) =>
                        handleInputChange("waktuSelesai", value)
                      }
                    />
                  </div>

                  <Input
                    isRequired
                    errorMessage={errors.peserta}
                    isInvalid={!!errors.peserta}
                    label="Peserta"
                    placeholder="Target peserta acara"
                    value={formData.peserta}
                    onValueChange={(value) =>
                      handleInputChange("peserta", value)
                    }
                  />
                </CardBody>
              </Card>

              {/* Content */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Deskripsi Acara
                  </h3>
                </CardHeader>
                <CardBody>
                  <Textarea
                    isRequired
                    errorMessage={errors.isi}
                    isInvalid={!!errors.isi}
                    label="Deskripsi"
                    minRows={6}
                    placeholder="Masukkan deskripsi lengkap acara..."
                    value={formData.isi}
                    onValueChange={(value) => handleInputChange("isi", value)}
                  />
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Foto Kegiatan
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          alt="Preview"
                          className="w-full h-full object-cover"
                          src={imagePreview}
                          onError={(e) => {
                            e.currentTarget.src = assets.imagePlaceholder;
                          }}
                        />
                        {formData.fotoKegiatan && (
                          <Button
                            isIconOnly
                            className="absolute top-2 right-2"
                            color="danger"
                            size="sm"
                            onPress={removeImage}
                          >
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
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          <p className="text-sm text-gray-500">
                            Tidak ada gambar
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <div>
                    <input
                      ref={fileInputRef}
                      accept="image/png,image/jpg,image/jpeg,image/gif"
                      className="hidden"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <Button
                      className="w-full"
                      startContent={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      }
                      variant="bordered"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      {formData.fotoKegiatan
                        ? "Ganti Gambar"
                        : "Upload Gambar Baru"}
                    </Button>
                    {errors.fotoKegiatan && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fotoKegiatan}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: PNG, JPG, JPEG, GIF. Maksimal 5MB.
                      {currentImage && !formData.fotoKegiatan && (
                        <span className="block mt-1 text-blue-600">
                          * Kosongkan jika tidak ingin mengubah gambar
                        </span>
                      )}
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <Card shadow="sm">
                <CardBody className="space-y-3">
                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={updateAcaraMutation.isPending}
                    startContent={
                      !updateAcaraMutation.isPending && (
                        <svg
                          className="w-4 h-4"
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
                      )
                    }
                    type="submit"
                  >
                    {updateAcaraMutation.isPending
                      ? "Menyimpan..."
                      : "Perbarui Acara"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={updateAcaraMutation.isPending}
                    variant="light"
                    onPress={() => navigate("/dashboard-admin/acara-pertanian")}
                  >
                    Batal
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
