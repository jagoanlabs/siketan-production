import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// HeroUI Components
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";

import {
  EditProductFormData,
  EditProductFormErrors,
} from "@/types/TokoPertanian/editTokoPertanian.d";
import {
  useGetProductDetail,
  useEditCheckNik,
  useEditCheckNip,
  useUpdateProduct,
  useAutoCheckUserData,
} from "@/hook/dashboard/tokoPertanian/useEditTokoPertanian";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { NikCheckResponse } from "@/types/TokoPertanian/createTokoPertanian";

export const EditTokoPertanian = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Hooks
  const {
    data: productDetailData,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetProductDetail(id);
  const checkNikMutation = useEditCheckNik();
  const checkNipMutation = useEditCheckNip();
  const updateProductMutation = useUpdateProduct(id || "");
  const { autoCheckUserData, isChecking: isAutoChecking } =
    useAutoCheckUserData();

  // Form State
  const [formData, setFormData] = useState<EditProductFormData>({
    profesiPenjual: "",
    nik: "",
    namaProducts: "",
    stok: 0,
    satuan: "Pcs",
    harga: "",
    deskripsi: "",
    status: "Tersedia",
    fotoTanaman: null,
  });

  const [errors, setErrors] = useState<EditProductFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userData, setUserData] = useState<NikCheckResponse["user"] | null>(
    null,
  );
  const [isNikChecking, setIsNikChecking] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Profesi options
  const profesiOptions = [
    { key: "petani", label: "Petani" },
    { key: "penyuluh", label: "Penyuluh" },
  ];

  // Satuan options
  const satuanOptions = [
    { key: "Pcs", label: "Pcs" },
    { key: "kg", label: "Kilogram (kg)" },
    { key: "gram", label: "Gram" },
    { key: "liter", label: "Liter" },
    { key: "meter", label: "Meter" },
    { key: "buah", label: "Buah" },
    { key: "bungkus", label: "Bungkus" },
    { key: "botol", label: "Botol" },
  ];

  // Status options
  const statusOptions = [
    { key: "Tersedia", label: "Tersedia" },
    { key: "Ready stock", label: "Ready Stock" },
    { key: "Habis", label: "Habis" },
    { key: "Pre-order", label: "Pre-order" },
    { key: "Ada", label: "Ada" },
  ];

  // Initialize form with product detail data
  useEffect(() => {
    if (productDetailData?.data && !isFormInitialized) {
      const product = productDetailData.data;
      const { tbl_akun } = product;

      // Set form data
      setFormData({
        profesiPenjual: product.profesiPenjual,
        nik: tbl_akun.dataPetani?.nik || tbl_akun.dataPenyuluh?.nik || "",
        namaProducts: product.namaProducts,
        stok: product.stok,
        satuan: product.satuan,
        harga: product.harga,
        deskripsi: product.deskripsi,
        status: product.status,
        fotoTanaman: product.fotoTanaman,
      });

      // Set image preview if exists
      if (product.fotoTanaman) {
        setImagePreview(product.fotoTanaman);
      }

      // Auto-check user data
      const initializeUserData = async () => {
        try {
          setIsNikChecking(true);
          const result = await autoCheckUserData(product);

          if (result.isSuccess && result.userData) {
            setUserData(result.userData as NikCheckResponse["user"]);
            toast.success(
              `Data ${result.profesi} berhasil dimuat: ${result.userData.nama}`,
            );
          }
        } catch (error) {
          console.error("Failed to auto-check user data:", error);
        } finally {
          setIsNikChecking(false);
        }
      };

      initializeUserData();
      setIsFormInitialized(true);
    }
  }, [productDetailData, isFormInitialized, autoCheckUserData]);

  // Handle input change
  const handleInputChange = (field: keyof EditProductFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
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
      // Validate file format
      const validFormats = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
      ];

      if (!validFormats.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          fotoTanaman: "Format file harus PNG, JPG, JPEG, atau GIF",
        }));

        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          fotoTanaman: "Ukuran file maksimal 5MB",
        }));

        return;
      }

      setFormData((prev) => ({
        ...prev,
        fotoTanaman: file,
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
        fotoTanaman: undefined,
      }));
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      fotoTanaman: null,
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle check NIK/NIP manually
  const handleCheckNikNip = async () => {
    if (!formData.nik.trim()) {
      toast.error("Masukkan NIK/NIP terlebih dahulu");

      return;
    }

    if (!formData.profesiPenjual) {
      toast.error("Pilih profesi terlebih dahulu");

      return;
    }

    setIsNikChecking(true);
    setUserData(null);

    try {
      if (formData.profesiPenjual === "petani") {
        const response = await checkNikMutation.mutateAsync({
          nik: formData.nik,
        });

        setUserData(response.user as any);
        toast.success(`Data ditemukan: ${response.user.nama}`);
      } else {
        const response = await checkNipMutation.mutateAsync({
          NIP: formData.nik,
        });

        setUserData(response.user as any);
        toast.success(`Data ditemukan: ${response.user.nama}`);
      }
    } catch (error) {
      // Error already handled in hooks
      setUserData(null);
    } finally {
      setIsNikChecking(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: EditProductFormErrors = {};

    if (!formData.profesiPenjual) {
      newErrors.profesiPenjual = "Profesi penjual wajib dipilih";
    }

    if (!formData.nik.trim()) {
      newErrors.nik =
        formData.profesiPenjual === "petani"
          ? "NIK wajib diisi"
          : "NIP wajib diisi";
    }

    if (!userData) {
      newErrors.nik = "Data NIK/NIP belum dicek atau tidak ditemukan";
    }

    if (!formData.namaProducts.trim()) {
      newErrors.namaProducts = "Nama produk wajib diisi";
    }

    if (!formData.stok || formData.stok <= 0) {
      newErrors.stok = "Stok harus lebih dari 0";
    }

    if (!formData.satuan) {
      newErrors.satuan = "Satuan wajib dipilih";
    }

    if (!formData.harga.trim() || parseFloat(formData.harga) <= 0) {
      newErrors.harga = "Harga harus lebih dari 0";
    }

    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = "Deskripsi wajib diisi";
    }

    if (!formData.status) {
      newErrors.status = "Status produk wajib dipilih";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        nik: formData.nik,
        profesiPenjual: formData.profesiPenjual as "petani" | "penyuluh",
        namaProducts: formData.namaProducts,
        stok: formData.stok,
        satuan: formData.satuan,
        harga: formData.harga,
        deskripsi: formData.deskripsi,
        status: formData.status,
        fotoTanaman: formData.fotoTanaman,
      };

      await updateProductMutation.mutateAsync(submitData);
      navigate("/dashboard-admin/daftar-toko");
    } catch (error) {
      // Error handling already done in hook
    }
  };

  // Get wilayah binaan info
  const getWilayahBinaan = () => {
    if (!userData) return null;

    if (formData.profesiPenjual === "petani") {
      const petaniData = userData as NikCheckResponse["user"];

      return {
        kecamatan: petaniData.kecamatanData?.nama || petaniData.kecamatan,
        desa: petaniData.desaData?.nama || petaniData.desa,
      };
    } else {
      const penyuluhData = userData as any;
      const kecamatanBinaan =
        penyuluhData.kecamatanBinaanData
          ?.map((k: any) => k.kecamatan.nama)
          .join(", ") || penyuluhData.kecamatanBinaan;
      const desaBinaan =
        penyuluhData.desaBinaanData?.map((d: any) => d.desa.nama).join(", ") ||
        penyuluhData.desaBinaan;

      return {
        kecamatan: kecamatanBinaan,
        desa: desaBinaan,
      };
    }
  };

  const wilayahBinaan = getWilayahBinaan();

  // Loading state
  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Spinner color="primary" size="lg" />
              <p className="text-gray-600 mt-4">Memuat detail produk...</p>
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
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardBody className="text-center p-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gagal Memuat Data
              </h3>
              <p className="text-gray-600 mb-4">
                Produk tidak ditemukan atau terjadi kesalahan.
              </p>
              <Button
                color="primary"
                onPress={() => navigate("/dashboard-admin/daftar-toko")}
              >
                Kembali ke Daftar Toko
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Edit produk pertanian"
        title="Edit Produk | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          {
            label: "Daftar Toko Pertanian",
            to: "/dashboard-admin/daftar-toko",
          },
          { label: "Edit Produk" },
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
                Edit Produk Pertanian
              </h1>
              <p className="text-gray-600">
                Perbarui informasi produk pertanian
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Seller Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Seller Verification */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verifikasi Penjual
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Select
                    isRequired
                    errorMessage={errors.profesiPenjual}
                    isInvalid={!!errors.profesiPenjual}
                    label="Profesi Penjual"
                    placeholder="Pilih profesi penjual"
                    selectedKeys={
                      formData.profesiPenjual ? [formData.profesiPenjual] : []
                    }
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      handleInputChange("profesiPenjual", value);
                      // Reset user data when changing profesi
                      setUserData(null);
                    }}
                  >
                    {profesiOptions.map((item) => (
                      <SelectItem key={item.key} textValue={item.key}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="flex gap-2">
                    <Input
                      isRequired
                      className="flex-1"
                      errorMessage={errors.nik}
                      isInvalid={!!errors.nik}
                      label={
                        formData.profesiPenjual === "petani" ? "NIK" : "NIP"
                      }
                      placeholder={
                        formData.profesiPenjual === "petani"
                          ? "Masukkan NIK"
                          : "Masukkan NIP"
                      }
                      value={formData.nik}
                      onValueChange={(value) => {
                        handleInputChange("nik", value);
                        // Reset user data when NIK changes
                        if (value !== (userData as any)?.nik) {
                          setUserData(null);
                        }
                      }}
                    />
                    <Button
                      className="min-w-24 min-h-14"
                      color="primary"
                      isDisabled={
                        !formData.nik.trim() || !formData.profesiPenjual
                      }
                      isLoading={isNikChecking || isAutoChecking}
                      variant="flat"
                      onPress={handleCheckNikNip}
                    >
                      {isNikChecking || isAutoChecking ? "Cek..." : "Cek Data"}
                    </Button>
                  </div>

                  {/* User Data Display */}
                  {userData && (
                    <Card className="bg-green-50 border-green-200">
                      <CardBody className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar
                            className="bg-green-100 text-green-700"
                            name={userData.nama}
                            size="lg"
                            src={userData.foto || undefined}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-green-900">
                                {userData.nama}
                              </h4>
                              <Chip color="success" size="sm" variant="flat">
                                Data Ditemukan
                              </Chip>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                              <p>
                                <strong>
                                  {formData.profesiPenjual === "petani"
                                    ? "NIK"
                                    : "NIP"}
                                  :
                                </strong>{" "}
                                {userData.nik}
                              </p>
                              <p>
                                <strong>No. Telp:</strong> {userData.noTelp}
                              </p>
                              {userData.email && (
                                <p>
                                  <strong>Email:</strong> {userData.email}
                                </p>
                              )}
                              <p>
                                <strong>Alamat:</strong>{" "}
                                {userData.alamat || "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Wilayah Binaan */}
                        {wilayahBinaan && (
                          <>
                            <Divider className="my-3" />
                            <div>
                              <h5 className="font-medium text-green-900 mb-2">
                                {formData.profesiPenjual === "petani"
                                  ? "Wilayah Asal"
                                  : "Wilayah Binaan"}
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                                <p>
                                  <strong>Kecamatan:</strong>{" "}
                                  {wilayahBinaan.kecamatan}
                                </p>
                                <p>
                                  <strong>Desa:</strong> {wilayahBinaan.desa}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </CardBody>
                    </Card>
                  )}
                </CardBody>
              </Card>

              {/* Product Information */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Produk
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    isRequired
                    errorMessage={errors.namaProducts}
                    isInvalid={!!errors.namaProducts}
                    label="Nama Produk"
                    placeholder="Masukkan nama produk"
                    value={formData.namaProducts}
                    onValueChange={(value) =>
                      handleInputChange("namaProducts", value)
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      isRequired
                      errorMessage={errors.stok}
                      isInvalid={!!errors.stok}
                      label="Stok"
                      min={1}
                      placeholder="0"
                      type="number"
                      value={formData.stok.toString()}
                      onValueChange={(value) =>
                        handleInputChange("stok", parseInt(value) || 0)
                      }
                    />

                    <Select
                      isRequired
                      errorMessage={errors.satuan}
                      isInvalid={!!errors.satuan}
                      label="Satuan"
                      placeholder="Pilih satuan"
                      selectedKeys={formData.satuan ? [formData.satuan] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("satuan", value);
                      }}
                    >
                      {satuanOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.key}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      isRequired
                      errorMessage={errors.harga}
                      isInvalid={!!errors.harga}
                      label="Harga"
                      placeholder="0"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">
                            Rp
                          </span>
                        </div>
                      }
                      type="number"
                      value={formData.harga}
                      onValueChange={(value) =>
                        handleInputChange("harga", value)
                      }
                    />
                  </div>

                  <Select
                    isRequired
                    errorMessage={errors.status}
                    isInvalid={!!errors.status}
                    label="Status Produk"
                    placeholder="Pilih status produk"
                    selectedKeys={formData.status ? [formData.status] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      handleInputChange("status", value);
                    }}
                  >
                    {statusOptions.map((item) => (
                      <SelectItem key={item.key} textValue={item.key}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    isRequired
                    errorMessage={errors.deskripsi}
                    isInvalid={!!errors.deskripsi}
                    label="Deskripsi Produk"
                    minRows={4}
                    placeholder="Masukkan deskripsi lengkap produk..."
                    value={formData.deskripsi}
                    onValueChange={(value) =>
                      handleInputChange("deskripsi", value)
                    }
                  />
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Image Upload & Actions */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Foto Produk
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                            Pilih foto produk
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
                      {imagePreview ? "Ganti Foto" : "Upload Foto"}
                    </Button>
                    {errors.fotoTanaman && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.fotoTanaman}
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
                    isLoading={updateProductMutation.isPending}
                    size="lg"
                    startContent={
                      !updateProductMutation.isPending && (
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
                      )
                    }
                    type="submit"
                  >
                    {updateProductMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Perubahan"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={updateProductMutation.isPending}
                    variant="light"
                    onPress={() => navigate("/dashboard-admin/daftar-toko")}
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
