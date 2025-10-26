// pages/EditOperator.tsx
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import { ImageUpload } from "./../components/ImageUpload";

import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { useOperator, useUpdateOperatorById } from "@/hook/useOperator";
import {
  EditOperatorFormData,
  OPERATOR_ROLES,
} from "@/types/Operator/create-operator";

export const EditOperator = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const operatorId = id ? parseInt(id) : 0;

  // Fetch operator data
  const {
    data: operatorData,
    isLoading: isLoadingOperator,
    error: operatorError,
  } = useOperator(operatorId, !!operatorId);

  const updateOperatorMutation = useUpdateOperatorById();

  // Form state
  const [formData, setFormData] = useState<EditOperatorFormData>({
    nik: "",
    nkk: "",
    nama: "",
    email: "",
    notelp: "",
    alamat: "",
    password: "",
    peran: "",
    foto: null,
    currentFoto: "",
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load operator data into form when data is available
  useEffect(() => {
    if (operatorData?.data) {
      const operator = operatorData.data;

      setFormData({
        nik: operator.nik || "",
        nkk: operator.nkk || "",
        nama: operator.nama || "",
        email: operator.email || "",
        notelp: operator.noTelp || "",
        alamat: operator.alamat || "",
        password: "", // Password field will be empty for security
        peran: operator.akun.peran || "", // Will need to fetch this from account data or set default
        foto: null,
        currentFoto: operator.foto || "",
      });
    }
  }, [operatorData]);

  // Handle input change
  const handleInputChange = (
    field: keyof EditOperatorFormData,
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

    if (!operatorId) {
      toast.error("ID operator tidak valid");

      return;
    }

    try {
      const { foto, currentFoto, ...operatorData } = formData;

      await updateOperatorMutation.mutateAsync({
        id: operatorId,
        data: operatorData,
        foto: foto || undefined,
      });

      // Navigate back to operator list
      navigate("/dashboard-admin/operator");
    } catch (error) {
      console.error("Update operator error:", error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/dashboard-admin/operator");
  };

  // Loading state
  if (isLoadingOperator) {
    return (
      <div className="min-h-screen py-6">
        <PageMeta
          description="Edit data operator sistem manajemen pertanian"
          title="Edit Operator | Sistem Manajemen Pertanian"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            { label: "Operator", to: "/dashboard-admin/operator" },
            { label: "Edit Operator" },
          ]}
        />

        <div className="mt-6 flex justify-center items-center min-h-40">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Memuat data operator...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (operatorError || !operatorData?.data) {
    return (
      <div className="min-h-screen py-6">
        <PageMeta
          description="Edit data operator sistem manajemen pertanian"
          title="Edit Operator | Sistem Manajemen Pertanian"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            { label: "Operator", to: "/dashboard-admin/operator" },
            { label: "Edit Operator" },
          ]}
        />

        <div className="mt-6 w-full mx-auto">
          <Card className="shadow-lg">
            <CardBody className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Operator Tidak Ditemukan
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Data operator yang Anda cari tidak ditemukan atau terjadi
                kesalahan.
              </p>
              <Button color="primary" onPress={handleCancel}>
                Kembali ke Daftar Operator
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  const operator = operatorData.data;

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Edit data operator sistem manajemen pertanian"
        title="Edit Operator | Sistem Manajemen Pertanian"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Operator", to: "/dashboard-admin/operator" },
          { label: `Edit ${operator.nama}` },
        ]}
      />

      <div className="mt-6">
        <Card className="shadow-lg p-5">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Edit Operator: {operator.nama}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ubah informasi operator yang diperlukan
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
                  currentImage={formData.currentFoto || undefined}
                  error={errors.foto}
                  label="Upload Foto Baru"
                  maxSize={5}
                  value={formData.foto}
                  onChange={(file: any) => handleInputChange("foto", file)}
                />
                {formData.currentFoto && !formData.foto && (
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Jika tidak mengubah foto, foto yang sudah ada akan tetap
                    digunakan
                  </p>
                )}
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
                      <SelectItem key={role.value} textValue={role.value}>
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
                    errorMessage={errors.password}
                    isInvalid={!!errors.password}
                    label="Password Baru"
                    placeholder="Masukkan password baru"
                    type="password"
                    value={formData.password}
                    onValueChange={(value) =>
                      handleInputChange("password", value)
                    }
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Password minimal 6 karakter. Masukkan password baru untuk
                    mengubah password.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <Divider />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  className="flex-1 sm:flex-none sm:min-w-40"
                  color="primary"
                  isLoading={updateOperatorMutation.isPending}
                  size="lg"
                  startContent={
                    !updateOperatorMutation.isPending && (
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
                          strokeWidth="2"
                        />
                      </svg>
                    )
                  }
                  type="submit"
                >
                  {updateOperatorMutation.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>

                <Button
                  className="flex-1 sm:flex-none sm:min-w-32"
                  disabled={updateOperatorMutation.isPending}
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
