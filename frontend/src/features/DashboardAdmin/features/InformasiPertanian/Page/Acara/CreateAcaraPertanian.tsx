import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { I18nProvider } from "@react-aria/i18n";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Image } from "@heroui/image";
import { MdEvent } from "react-icons/md";
import { DatePicker } from "@heroui/date-picker";
import { CalendarDate } from "@internationalized/date";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useCreateAcara } from "@/hook/dashboard/infoPertanian/useCreateAcara";
import {
  CreateAcaraFormData,
  AcaraFormErrors,
} from "@/types/InfoPertanian/createAcara.d";

export const CreateAcaraPertanian = () => {
  const navigate = useNavigate();
  const createAcaraMutation = useCreateAcara();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateAcaraFormData>({
    namaKegiatan: "",
    tanggalAcara: "",
    waktuMulai: "",
    waktuSelesai: "",
    tempat: "",
    peserta: "",
    isi: "",
    fotoKegiatan: null,
  });

  const [errors, setErrors] = useState<AcaraFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);

  // Format date untuk backend (DD/MM/YYYY) dari CalendarDate
  const formatDateForBackend = (calendarDate: CalendarDate | null) => {
    if (!calendarDate) return "";
    const day = calendarDate.day.toString().padStart(2, "0");
    const month = calendarDate.month.toString().padStart(2, "0");
    const year = calendarDate.year.toString();

    return `${year}-${month}-${day}`; // Format YYYY-MM-DD untuk database
  };

  // Handle date change
  const handleDateChange = (date: CalendarDate | null) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      tanggalAcara: date ? formatDateForBackend(date) : "",
    }));

    // Clear error saat user memilih tanggal
    if (errors.tanggalAcara) {
      setErrors((prev) => ({
        ...prev,
        tanggalAcara: undefined,
      }));
    }
  };

  // Validasi form
  const validateForm = (): boolean => {
    const newErrors: AcaraFormErrors = {};

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
  const handleInputChange = (
    field: keyof CreateAcaraFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error saat user mulai mengetik
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
      // Validasi format file
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

      // Validasi ukuran file (max 5MB)
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

      // Create preview
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
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
    setImagePreview(null);
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
        tanggalAcara: formData.tanggalAcara, // Sudah dalam format DD/MM/YYYY
        waktuAcara: `${formData.waktuMulai} - ${formData.waktuSelesai}`,
        tempat: formData.tempat,
        peserta: formData.peserta,
        isi: formData.isi,
        fotoKegiatan: formData.fotoKegiatan,
      };

      await createAcaraMutation.mutateAsync(submitData);

      // Redirect ke halaman daftar acara setelah berhasil
      navigate("/dashboard-admin/acara-pertanian");
    } catch (error) {
      // Error handling sudah dilakukan di hook
    }
  };

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Buat acara pertanian baru"
        title="Buat Acara Pertanian | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Acara Pertanian", to: "/dashboard-admin/acara-pertanian" },
          { label: "Buat Acara" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r text-white from-green-500 to-green-600 rounded-full shadow-lg">
              <MdEvent />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Buat Acara Pertanian
              </h1>
              <p className="text-gray-600">
                Buat acara atau kegiatan pertanian baru
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
                    <I18nProvider locale="en-GB">
                      <DatePicker
                        isRequired
                        showMonthAndYearPickers
                        errorMessage={errors.tanggalAcara}
                        isInvalid={!!errors.tanggalAcara}
                        label="Tanggal Acara"
                        placeholderValue={
                          new CalendarDate(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            new Date().getDate(),
                          )
                        }
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </I18nProvider>
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
                        <Image
                          alt="Preview"
                          className="w-full h-full object-cover"
                          src={imagePreview}
                        />
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
                      {imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                    </Button>
                    {errors.fotoKegiatan && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fotoKegiatan}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: PNG, JPG, JPEG, GIF. Maksimal 5MB.
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
                    isLoading={createAcaraMutation.isPending}
                    startContent={
                      !createAcaraMutation.isPending && (
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
                    {createAcaraMutation.isPending
                      ? "Menyimpan..."
                      : "Buat Acara"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={createAcaraMutation.isPending}
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
