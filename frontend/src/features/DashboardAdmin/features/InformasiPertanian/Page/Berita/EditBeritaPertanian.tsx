// pages/EditBeritaPertanian.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "@heroui/spinner";

// Import hooks and types
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";

import { RichTextEditor } from "@/components/RichText/RichTextComponents";
import {
  KATEGORI_BERITA_OPTIONS,
  validateImageFile,
} from "@/types/InfoPertanian/createBerita.d";
import {
  EditBeritaFormData,
  validateEditBeritaForm,
  formatDateForInput,
} from "@/types/InfoPertanian/updateBerita.d";
import {
  useBeritaDetail,
  useUpdateBerita,
} from "@/hook/dashboard/infoPertanian/useUpdateBerita";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";

// Mock user data - replace with actual user context

export const EditBeritaPertanian = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const beritaId = id ? parseInt(id, 10) : 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Hooks
  const {
    data: beritaDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useBeritaDetail(beritaId);

  const updateBeritaMutation = useUpdateBerita();

  // Form state
  const [formData, setFormData] = useState<EditBeritaFormData>({
    judul: "",
    tanggal: "",
    kategori: "berita",
    isi: "",
    fotoBerita: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when berita detail is loaded
  useEffect(() => {
    console.log(beritaDetail); //ini works
    console.log(beritaDetail?.infotani); // ini tidak
    if (beritaDetail?.infotani) {
      const data = beritaDetail.infotani; // ini tidak

      setFormData({
        judul: data.judul || "",
        tanggal: formatDateForInput(data.tanggal),
        kategori: (data.kategori as "berita" | "artikel" | "tips") || "berita",
        isi: data.isi || "",
        fotoBerita: data.fotoBerita || "",
        status: data.status || undefined,
      });

      if (data.fotoBerita) {
        setImagePreview(data.fotoBerita);
      }
    }
  }, [beritaDetail]);

  // Handle form input changes
  const handleInputChange = (
    field: keyof EditBeritaFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);

    if (validationError) {
      toast.error(validationError);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedFile(file);

    // Create preview for new file
    const reader = new FileReader();

    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove/reset image
  const removeFile = () => {
    setSelectedFile(null);
    // Reset to original image or null
    setImagePreview(formData.fotoBerita || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate form
    const validationErrors = validateEditBeritaForm(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error("Mohon perbaiki kesalahan pada form");

      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      await updateBeritaMutation.mutateAsync({
        ...formData,
        file: selectedFile || undefined,
        id: beritaId,
      });

      toast.success("Berita berhasil diupdate!");

      // Navigate back to berita list
      navigate("/dashboard-admin/berita-pertanian");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Gagal mengupdate berita. Silakan coba lagi.";

      toast.error(errorMessage);
      console.error("Update berita error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    const hasChanges =
      beritaDetail?.infotani &&
      (formData.judul !== beritaDetail.infotani.judul ||
        formData.isi !== beritaDetail.infotani.isi ||
        selectedFile !== null);

    if (hasChanges) {
      const confirmLeave = window.confirm(
        "Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?",
      );

      if (!confirmLeave) return;
    }
    navigate("/dashboard-admin/berita-pertanian");
  };

  const isLoading = isSubmitting || updateBeritaMutation.isPending;

  // Loading state
  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <PageMeta
          description="Edit berita, artikel, atau tips pertanian"
          title="Edit Berita Pertanian | Sistem Manajemen Pertanian"
        />
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Berita Pertanian",
              to: "/dashboard-admin/berita-pertanian",
            },
            { label: "Edit Berita Pertanian" },
          ]}
        />

        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="text-gray-600 mt-4">Memuat data berita...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <PageMeta
          description="Edit berita, artikel, atau tips pertanian"
          title="Edit Berita Pertanian | Sistem Manajemen Pertanian"
        />
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Berita Pertanian",
              to: "/dashboard-admin/berita-pertanian",
            },
            { label: "Edit Berita Pertanian" },
          ]}
        />

        <div className="container mx-auto px-4 max-w-4xl">
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
                {(detailError as any)?.response?.status === 404
                  ? "Berita tidak ditemukan"
                  : "Gagal memuat data berita"}
              </p>
              <p className="text-red-600 text-sm mb-4">
                Berita mungkin telah dihapus atau Anda tidak memiliki akses.
              </p>
              <Button
                color="danger"
                variant="flat"
                onPress={() => navigate("/dashboard-admin/berita-pertanian")}
              >
                Kembali ke Daftar Berita
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <PageMeta
        description="Edit berita, artikel, atau tips pertanian"
        title="Edit Berita Pertanian | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Berita Pertanian",
            to: "/dashboard-admin/berita-pertanian",
          },
          { label: "Edit Berita Pertanian" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg">
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Berita</h1>
              <p className="text-gray-600">
                Perbarui berita, artikel, atau tips pertanian
                {beritaDetail?.infotani?.judul && (
                  <span className="block text-sm font-medium text-gray-700 mt-1">
                    &quot;{beritaDetail.infotani.judul}&quot;
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card shadow="sm">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Informasi Dasar
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Title */}
                  <div>
                    <Input
                      isRequired
                      classNames={{
                        label: "text-gray-700 font-medium",
                        input: "text-gray-900",
                      }}
                      label="Judul Berita"
                      placeholder="Masukkan judul berita yang menarik..."
                      value={formData.judul ?? "kosong"}
                      variant="bordered"
                      onValueChange={(value) =>
                        handleInputChange("judul", value)
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.judul.length}/200 karakter
                    </p>
                  </div>

                  {/* Date and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      isRequired
                      classNames={{
                        label: "text-gray-700 font-medium",
                      }}
                      label="Tanggal Publikasi"
                      type="date"
                      value={formData.tanggal}
                      variant="bordered"
                      onValueChange={(value) =>
                        handleInputChange("tanggal", value)
                      }
                    />

                    <Select
                      isRequired
                      classNames={{
                        label: "text-gray-700 font-medium",
                      }}
                      label="Kategori"
                      placeholder="Pilih kategori"
                      selectedKeys={[formData.kategori]}
                      variant="bordered"
                      onChange={(e) =>
                        handleInputChange("kategori", e.target.value as any)
                      }
                    >
                      {KATEGORI_BERITA_OPTIONS.map((option) => (
                        <SelectItem key={option.value} textValue={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-gray-500">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </CardBody>
              </Card>

              {/* Content Editor */}
              <Card shadow="sm">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Konten Berita
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Isi Konten <span className="text-red-500">*</span>
                    </p>
                    <RichTextEditor
                      className="min-h-[300px]"
                      disabled={isLoading}
                      placeholder="Mulai menulis konten berita Anda di sini..."
                      value={formData.isi}
                      onChange={(value) => handleInputChange("isi", value)}
                    />
                    <p className="text-xs text-gray-500">
                      Minimal 50 karakter untuk publikasi
                    </p>
                  </div>
                </CardBody>
              </Card>

              {/* Image Upload */}
              <Card shadow="sm">
                <CardHeader className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gambar Utama
                  </h2>
                  {imagePreview && formData.fotoBerita && (
                    <Chip color="primary" size="sm" variant="flat">
                      {selectedFile ? "Gambar Baru" : "Gambar Saat Ini"}
                    </Chip>
                  )}
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        <p className="text-gray-600 mb-2">
                          Klik untuk upload gambar baru
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, JPEG, atau GIF (Max: 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                          src={imagePreview}
                        />

                        {/* Change Image Button */}
                        <button
                          className="absolute bottom-2 right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                        >
                          Ganti Gambar
                        </button>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      accept="image/png,image/jpg,image/jpeg,image/gif"
                      className="hidden"
                      type="file"
                      onChange={handleFileSelect}
                    />

                    {/* Manual Upload Button Alternative */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        startContent={
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        }
                        type="button"
                        variant="bordered"
                        onClick={(e) => {
                          e?.preventDefault();
                          fileInputRef.current?.click();
                        }}
                      >
                        {imagePreview ? "Ganti Gambar" : "Pilih Gambar"}
                      </Button>

                      {selectedFile && (
                        <Button
                          color="warning"
                          size="sm"
                          startContent={
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          }
                          type="button"
                          variant="light"
                          onClick={(e) => {
                            e?.preventDefault();
                            removeFile();
                          }}
                        >
                          Reset Gambar
                        </Button>
                      )}
                    </div>

                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <svg
                          className="w-4 h-4 text-blue-500"
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
                        <div className="flex-1">
                          <p className="font-medium text-blue-900">
                            Gambar Baru: {selectedFile.name}
                          </p>
                          <p className="text-xs text-blue-700">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                            {selectedFile.type}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category Preview */}
              {formData.kategori && (
                <Card shadow="sm">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Preview Kategori
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div className="space-y-3">
                      <Chip
                        color={
                          KATEGORI_BERITA_OPTIONS.find(
                            (k) => k.value === formData.kategori,
                          )?.color as any
                        }
                        size="lg"
                        variant="flat"
                      >
                        {
                          KATEGORI_BERITA_OPTIONS.find(
                            (k) => k.value === formData.kategori,
                          )?.label
                        }
                      </Chip>
                      <p className="text-sm text-gray-600">
                        {
                          KATEGORI_BERITA_OPTIONS.find(
                            (k) => k.value === formData.kategori,
                          )?.description
                        }
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Publishing Info */}
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Info Publikasi
                  </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="text-gray-600">
                      Tanggal:{" "}
                      {formData.tanggal &&
                        new Date(formData.tanggal).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="text-gray-600">
                      Status: {selectedFile ? "Ada Perubahan Gambar" : "Draft"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h3a1 1 0 011 1v1H4V5a1 1 0 011-1h2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="text-gray-600">ID: #{beritaId}</span>
                  </div>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full"
                  color="primary"
                  disabled={isLoading}
                  isLoading={isLoading}
                  size="lg"
                  type="submit"
                >
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>

                <Button
                  className="w-full"
                  isDisabled={isLoading}
                  size="lg"
                  type="button"
                  variant="bordered"
                  onClick={(e) => {
                    e?.preventDefault();
                    handleCancel();
                  }}
                >
                  Batal
                </Button>
              </div>

              {/* Validation Errors */}
              {errors.length > 0 && (
                <Card className="border-red-200 bg-red-50" shadow="sm">
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
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
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">
                          Mohon perbaiki kesalahan berikut:
                        </h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
