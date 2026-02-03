/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageMeta from "@/layouts/PageMeta";
import { useCreateJurnal } from "@/hook/dashboard/jurnal/useCreateJurnal";
import { RichTextEditor } from "@/components/RichText/RichTextComponents";
import PageBreadcrumb from "@/components/Breadcrumb";

interface FormData {
  NIK: string;
  judul: string;
  tanggalDibuat: string;
  uraian: string;
  statusJurnal: "draft" | "publish";
  gambar?: File;
}

interface FormErrors {
  NIK?: string;
  judul?: string;
  tanggalDibuat?: string;
  uraian?: string;
  statusJurnal?: string;
  gambar?: string;
}

export const CreateJurnalPenyuluh = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createJurnalMutation = useCreateJurnal();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    NIK: "",
    judul: "",
    tanggalDibuat: new Date().toISOString().split("T")[0],
    uraian: "",
    statusJurnal: "draft",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status options
  const statusOptions = [
    { key: "draft", label: "Draft" },
    { key: "publish", label: "Publish" },
  ];

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

    if (!formData.tanggalDibuat) {
      newErrors.tanggalDibuat = "Tanggal tidak boleh kosong";
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
    setImagePreview(null);
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
      await createJurnalMutation.mutateAsync(formData);
      navigate("/dashboard-admin/jurnal-penyuluh");
    } catch (error) {
      // Error handled in mutation
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/dashboard-admin/jurnal-penyuluh");
  };

  return (
    <div className="min-h-screen container max-w-6xl mx-auto py-6">
      <PageMeta
        description="Buat jurnal kegiatan penyuluhan pertanian baru"
        title="Buat Jurnal Kegiatan | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Jurnal Kegiatan", to: "/jurnal-kegiatan" },
          { label: "Buat Jurnal Baru" },
        ]}
      />

      <div className=" px-4 ">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg">
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
                Buat Jurnal Kegiatan Baru
              </h1>
              <p className="text-gray-600">
                Dokumentasikan kegiatan penyuluhan pertanian
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">
                  Informasi Dasar
                </h2>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1">
                {/* NIP Input */}
                <Input
                  isRequired
                  className="mb-4"
                  errorMessage={errors.NIK}
                  isInvalid={!!errors.NIK}
                  label="NIP Penyuluh"
                  placeholder="Masukkan NIP penyuluh"
                  startContent={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  value={formData.NIK}
                  onValueChange={(value) => handleInputChange("NIK", value)}
                />

                {/* Judul Input */}
                <Input
                  isRequired
                  className="mb-4"
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
              </div>

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
                Upload gambar untuk jurnal (opsional)
              </p>
            </CardHeader>
            <CardBody className="pt-0">
              {!imagePreview ? (
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
                  <p className="text-gray-600 mb-2">Klik untuk upload gambar</p>
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
                Tulis detail kegiatan penyuluhan
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
                    isDisabled={createJurnalMutation.isPending}
                    variant="bordered"
                    onPress={handleCancel}
                  >
                    Batal
                  </Button>
                  <Button
                    color="primary"
                    isLoading={createJurnalMutation.isPending}
                    startContent={
                      !createJurnalMutation.isPending && (
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
                    {createJurnalMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Jurnal"}
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
