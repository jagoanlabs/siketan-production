// pages/CreateBeritaPertanian.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import hooks and types
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";

import { RichTextEditor } from "@/components/RichText/RichTextComponents";
import {
  CreateBeritaFormData,
  getCurrentDate,
  KATEGORI_BERITA_OPTIONS,
  validateCreateBeritaForm,
  validateImageFile,
} from "@/types/InfoPertanian/createBerita.d";
import { useCreateBerita } from "@/hook/dashboard/infoPertanian/useCreateBerita";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/hook/UseAuth";
// Mock user data - replace with actual user context

export const CreateBeritaPertanian = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createBeritaMutation = useCreateBerita();

  // Form state
  const [formData, setFormData] = useState<CreateBeritaFormData>({
    judul: "",
    tanggal: getCurrentDate(),
    kategori: "berita",
    isi: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    field: keyof CreateBeritaFormData,
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
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);

    if (validationError) {
      toast.error(validationError);

      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();

    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateCreateBeritaForm(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error("Mohon perbaiki kesalahan pada form");

      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      await createBeritaMutation.mutateAsync({
        ...formData,
        file: selectedFile || undefined,
      });

      toast.success("Berita berhasil dibuat!");

      // Navigate back to berita list
      navigate("/dashboard-admin/berita-pertanian");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Gagal membuat berita. Silakan coba lagi.";

      toast.error(errorMessage);
      console.error("Create berita error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    if (formData.judul || formData.isi || selectedFile) {
      const confirmLeave = window.confirm(
        "Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?",
      );

      if (!confirmLeave) return;
    }
    navigate("/dashboard-admin/berita-pertanian");
  };

  const isLoading = isSubmitting || createBeritaMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <PageMeta
        description="Buat berita, artikel, atau tips pertanian baru"
        title="Tambah Berita Pertanian | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Berita Pertanian",
            to: "/dashboard-admin/berita-pertanian",
          },
          { label: "Tambah Berita Pertanian" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 4v16m8-8H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tambah Berita Baru
              </h1>
              <p className="text-gray-600">
                Buat berita, artikel, atau tips pertanian
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
                      value={formData.judul}
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
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gambar Utama
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {!imagePreview ? (
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
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
                          Klik untuk upload gambar
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
                        <button
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          type="button"
                          onClick={removeFile}
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

                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4"
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
                        <span>{selectedFile.name}</span>
                        <span className="text-gray-400">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Penulis
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="bg-primary-100 text-primary-600"
                      name={user?.nama}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user?.nama}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

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
                      {new Date(formData.tanggal).toLocaleDateString("id-ID", {
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="text-gray-600">
                      Dibuat: {new Date().toLocaleString("id-ID")}
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
                    <span className="text-gray-600">Status: Draft</span>
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
                  {isLoading ? "Menyimpan..." : "Publikasikan Berita"}
                </Button>

                <Button
                  className="w-full"
                  isDisabled={isLoading}
                  size="lg"
                  type="button"
                  variant="bordered"
                  onPress={handleCancel}
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
