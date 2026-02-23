// pages/CreateOperator.tsx
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { ImageUpload } from "../components/ImageUpload";

import { useCreateOperator } from "@/hook/useOperator";
import {
  CreateOperatorFormData,
  OPERATOR_ROLES,
} from "@/types/Operator/create-operator";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";

export const CreateOperator = () => {
  const navigate = useNavigate();
  const createOperatorMutation = useCreateOperator();

  // Form state
  const [formData, setFormData] = useState<CreateOperatorFormData>({
    nik: "",
    nkk: "",
    nama: "",
    email: "",
    notelp: "",
    alamat: "",
    password: "",
    peran: "",
    foto: null,
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleInputChange = (
    field: keyof CreateOperatorFormData,
    value: string | File | null,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.nik.trim()) newErrors.nik = "NIK wajib diisi";
    if (!formData.nama.trim()) newErrors.nama = "Nama wajib diisi";
    if (!formData.email.trim()) newErrors.email = "Email wajib diisi";
    if (!formData.notelp.trim()) newErrors.notelp = "No. WhatsApp wajib diisi";
    if (!formData.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.password.trim()) newErrors.password = "Password wajib diisi";
    if (!formData.peran.trim()) newErrors.peran = "Peran wajib dipilih";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // NIK validation (16 digits)
    if (formData.nik && !/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus berupa 16 digit angka";
    }

    // NKK validation (16 digits if provided)
    if (formData.nkk && formData.nkk.trim() && !/^\d{16}$/.test(formData.nkk)) {
      newErrors.nkk = "NKK harus berupa 16 digit angka";
    }

    // Phone number validation
    if (
      formData.notelp &&
      !/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(formData.notelp)
    ) {
      newErrors.notelp =
        "Format nomor WhatsApp tidak valid (contoh: 08123456789)";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon periksa form dan lengkapi data yang diperlukan");

      return;
    }

    try {
      const { foto, ...operatorData } = formData;

      await createOperatorMutation.mutateAsync({
        data: operatorData,
        foto: foto || undefined,
      });

      // Reset form
      setFormData({
        nik: "",
        nkk: "",
        nama: "",
        email: "",
        notelp: "",
        alamat: "",
        password: "",
        peran: "",
        foto: null,
      });
      setErrors({});

      // Navigate back to operator list
      navigate("/dashboard-admin/operator");
    } catch (error) {
      console.error("Create operator error:", error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/dashboard-admin/operator");
  };

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Tambah operator baru ke dalam sistem manajemen pertanian"
        title="Tambah Operator | Sistem Manajemen Pertanian"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Operator", to: "/dashboard-admin/operator" },
          { label: "Tambah Operator" },
        ]}
      />

      <div className="mt-6">
        <Card className="shadow-lg p-5">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Tambah Operator Baru
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Lengkapi formulir di bawah untuk menambahkan operator baru ke
                dalam sistem
              </p>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Photo Upload Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Foto Profil
                </h3>
                <ImageUpload
                  error={errors.foto}
                  label="Upload Foto"
                  maxSize={5}
                  value={formData.foto}
                  onChange={(file) => handleInputChange("foto", file)}
                />
              </div>

              <Divider />

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Informasi Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    isRequired
                    errorMessage={errors.nik}
                    isInvalid={!!errors.nik}
                    label="NIK"
                    maxLength={16}
                    placeholder="Masukkan NIK (16 digit)"
                    value={formData.nik}
                    onValueChange={(value) => handleInputChange("nik", value)}
                  />

                  <Input
                    errorMessage={errors.nkk}
                    isInvalid={!!errors.nkk}
                    label="No. KK"
                    maxLength={16}
                    placeholder="Masukkan No. KK (opsional)"
                    value={formData.nkk}
                    onValueChange={(value) => handleInputChange("nkk", value)}
                  />

                  <Input
                    isRequired
                    errorMessage={errors.nama}
                    isInvalid={!!errors.nama}
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onValueChange={(value) => handleInputChange("nama", value)}
                  />

                  <Select
                    isRequired
                    errorMessage={errors.peran}
                    isInvalid={!!errors.peran}
                    label="Peran"
                    placeholder="Pilih peran operator"
                    selectedKeys={formData.peran ? [formData.peran] : []}
                    onSelectionChange={(selection) => {
                      const value = Array.from(selection)[0] as string;

                      handleInputChange("peran", value || "");
                    }}
                  >
                    {OPERATOR_ROLES.map((role) => (
                      <SelectItem key={role.value} textValue={role.label}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <Divider />

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Informasi Kontak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    isRequired
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                    label="Email"
                    placeholder="Masukkan alamat email"
                    type="email"
                    value={formData.email}
                    onValueChange={(value) => handleInputChange("email", value)}
                  />

                  <Input
                    isRequired
                    errorMessage={errors.notelp}
                    isInvalid={!!errors.notelp}
                    label="No. WhatsApp"
                    placeholder="Contoh: 08123456789"
                    value={formData.notelp}
                    onValueChange={(value) =>
                      handleInputChange("notelp", value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <Textarea
                    isRequired
                    errorMessage={errors.alamat}
                    isInvalid={!!errors.alamat}
                    label="Alamat"
                    minRows={3}
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    onValueChange={(value) =>
                      handleInputChange("alamat", value)
                    }
                  />
                </div>
              </div>

              <Divider />

              {/* Security */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Keamanan Akun
                </h3>
                <div className="max-w-md">
                  <Input
                    isRequired
                    errorMessage={errors.password}
                    isInvalid={!!errors.password}
                    label="Password"
                    placeholder="Masukkan password"
                    type="password"
                    value={formData.password}
                    onValueChange={(value) =>
                      handleInputChange("password", value)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Password minimal 6 karakter
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <Divider />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="flex-1 sm:flex-none sm:min-w-40"
                  color="primary"
                  isLoading={createOperatorMutation.isPending}
                  size="lg"
                  startContent={
                    !createOperatorMutation.isPending && (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    )
                  }
                  type="submit"
                >
                  {createOperatorMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Operator"}
                </Button>

                <Button
                  className="flex-1 sm:flex-none sm:min-w-32"
                  disabled={createOperatorMutation.isPending}
                  size="lg"
                  startContent={
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
                        strokeWidth="2"
                      />
                    </svg>
                  }
                  type="button"
                  variant="flat"
                  onPress={handleCancel}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
