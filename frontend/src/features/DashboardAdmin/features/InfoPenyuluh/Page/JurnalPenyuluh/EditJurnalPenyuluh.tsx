import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  useJurnalDetail,
  useUpdateJurnal,
} from "@/hook/dashboard/jurnal/useEditJurnal";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { RichTextEditor } from "@/components/RichText/RichTextComponents";

interface FormData {
  judul: string;
  uraian: string;
  statusJurnal: "draft" | "publish";
  NIK: string;
  gambar?: File;
}

interface FormErrors {
  judul?: string;
  uraian?: string;
  statusJurnal?: string;
  NIK?: string;
  gambar?: string;
}

export const EditJurnalPenyuluh = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const {
    data: jurnalDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useJurnalDetail(id!);
  const updateJurnalMutation = useUpdateJurnal(id!);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    judul: "",
    uraian: "",
    statusJurnal: "draft",
    NIK: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  // Status options
  const statusOptions = [
    { key: "draft", label: "Draft" },
    { key: "publish", label: "Publish" },
  ];

  // Load data when jurnal detail is available
  useEffect(() => {
    if (jurnalDetail?.newData) {
      const data = jurnalDetail.newData;

      setFormData({
        judul: data.judul || "",
        uraian: data.uraian || "",
        statusJurnal: (data.statusJurnal === "publish"
          ? "publish"
          : "draft") as "draft" | "publish",
        NIK: data.dataPenyuluh?.nik || "",
      });

      // Set existing image preview
      if (data.gambar) {
        setImagePreview(data.gambar);
      }
    }
  }, [jurnalDetail]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.NIK.trim()) {
      newErrors.NIK = "NIP tidak boleh kosong";
    }

    if (!formData.judul.trim()) {
      newErrors.judul = "Judul tidak boleh kosong";
    } else if (formData.judul.length < 5) {
      newErrors.judul = "Judul minimal 5 karakter";
    }

    if (!formData.uraian.trim() || formData.uraian === "<p><br></p>") {
      newErrors.uraian = "Uraian tidak boleh kosong";
    }

    if (!formData.statusJurnal) {
      newErrors.statusJurnal = "Status harus dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

      if (!validTypes.includes(file.type)) {
        toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau GIF");

        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        toast.error("Ukuran file terlalu besar. Maksimal 5MB");

        return;
      }

      setFormData((prev) => ({ ...prev, gambar: file }));
      setHasNewImage(true);

      // Create preview
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.gambar) {
        setErrors((prev) => ({ ...prev, gambar: undefined }));
      }
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, gambar: undefined }));
    setImagePreview(jurnalDetail?.newData.gambar || null);
    setHasNewImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang diperlukan");

      return;
    }

    try {
      await updateJurnalMutation.mutateAsync(formData);
      navigate("/dashboard-admin/jurnal-penyuluh");
    } catch (error) {
      // Error handled in mutation
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/dashboard-admin/jurnal-penyuluh");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="text-gray-600 mt-4">Memuat data jurnal...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError || !jurnalDetail?.newData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4 ">
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
                Gagal memuat data jurnal
              </p>
              <p className="text-red-600 text-sm mb-4">
                Jurnal tidak ditemukan atau terjadi kesalahan.
              </p>
              <Button
                color="primary"
                variant="flat"
                onPress={() => navigate("/jurnal-kegiatan")}
              >
                Kembali ke Daftar Jurnal
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  const jurnal = jurnalDetail.newData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <PageMeta
        description="Edit jurnal kegiatan penyuluhan pertanian"
        title="Edit Jurnal Kegiatan | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Jurnal Kegiatan", to: "/jurnal-kegiatan" },
          { label: "Edit Jurnal" },
        ]}
      />

      <div className="container mx-auto px-4 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
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
                Edit Jurnal Kegiatan
              </h1>
              <p className="text-gray-600">
                Perbarui dokumentasi kegiatan penyuluhan
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Info Card - Read Only */}
          <Card className="shadow-sm bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-700"
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
                <h2 className="text-xl font-semibold text-blue-900">
                  Informasi Jurnal
                </h2>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Informasi yang tidak dapat diubah
              </p>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Tanggal Dibuat:</p>
                  <p className="text-blue-600">
                    {formatDate(jurnal.tanggalDibuat)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Dibuat Oleh:</p>
                  <p className="text-blue-600">{jurnal.pengubah}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Nama Penyuluh:</p>
                  <p className="text-blue-600">{jurnal.dataPenyuluh.nama}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Kecamatan:</p>
                  <p className="text-blue-600">
                    {jurnal.dataPenyuluh.kecamatan}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Editable Info Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-700"
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Informasi yang Dapat Diubah
                </h2>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1  gap-6">
                {/* Status Select */}
                <Select
                  isRequired
                  errorMessage={errors.statusJurnal}
                  isInvalid={!!errors.statusJurnal}
                  label="Status Jurnal"
                  placeholder="Pilih status jurnal"
                  selectedKeys={
                    formData.statusJurnal ? [formData.statusJurnal] : []
                  }
                  startContent={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;

                    if (selectedKey) {
                      handleInputChange("statusJurnal", selectedKey);
                    }
                  }}
                >
                  {statusOptions.map((status) => (
                    <SelectItem key={status.key} textValue={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Judul Input */}
              <Input
                isRequired
                className="mb-4 mt-4"
                errorMessage={errors.judul}
                isInvalid={!!errors.judul}
                label="Judul Jurnal"
                placeholder="Masukkan judul jurnal kegiatan"
                startContent={
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 6h16M4 12h16M4 18h7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                }
                value={formData.judul}
                onValueChange={(value) => handleInputChange("judul", value)}
              />
            </CardBody>
          </Card>

          {/* Image Upload Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-700"
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Gambar Jurnal
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Ganti gambar jurnal (opsional)
              </p>
            </CardHeader>
            <CardBody className="pt-0">
              {!imagePreview ? (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-600 mb-2">
                    Klik untuk upload gambar baru
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                    src={imagePreview}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {hasNewImage && (
                      <Button
                        isIconOnly
                        className="bg-white/90 hover:bg-white"
                        color="warning"
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
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </Button>
                    )}
                    <Button
                      isIconOnly
                      className="bg-white/90 hover:bg-white text-primary"
                      color="primary"
                      size="sm"
                      onPress={() => fileInputRef.current?.click()}
                    >
                      <svg
                        className="w-4 h-4"
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
                    </Button>
                  </div>
                  {hasNewImage && (
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Gambar Baru
                      </span>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                type="file"
                onChange={handleFileChange}
              />

              {errors.gambar && (
                <p className="text-red-500 text-sm mt-2">{errors.gambar}</p>
              )}
            </CardBody>
          </Card>

          {/* Content Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-700"
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
                <h2 className="text-xl font-semibold text-gray-900">
                  Uraian Kegiatan
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Edit detail kegiatan penyuluhan
              </p>
            </CardHeader>
            <CardBody className="pt-0">
              <RichTextEditor
                className={errors.uraian ? "border-red-500" : ""}
                placeholder="Mulai menulis uraian kegiatan jurnal..."
                value={formData.uraian}
                onChange={(value) => handleInputChange("uraian", value)}
              />
              {errors.uraian && (
                <p className="text-red-500 text-sm mt-2">{errors.uraian}</p>
              )}
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-sm">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="text-red-500">*</span> Field yang wajib diisi
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    isDisabled={updateJurnalMutation.isPending}
                    variant="bordered"
                    onPress={handleCancel}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary"
                    isLoading={updateJurnalMutation.isPending}
                    startContent={
                      !updateJurnalMutation.isPending && (
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
                    {updateJurnalMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
};
