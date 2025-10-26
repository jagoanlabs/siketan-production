// components/forms/PetaniEditForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { toast } from "sonner";

import {
  DataPetaniFormData,
  DataPetaniFormErrors,
  useDesaByKecamatan,
  useGapoktanList,
  useKecamatanList,
  usePenyuluhList,
  useUpdateDataPetani,
  validateDataPetaniForm,
} from "@/hook/dashboard/dataPetani/useCreateEditDataPetani";
import { useAuth } from "@/hook/UseAuth";
import { usePetaniProfile } from "@/hook/useProfile";
export const PetaniEditForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const petaniId = user?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Hooks
  // Form State
  const [formData, setFormData] = useState<DataPetaniFormData>({
    nik: "",
    nkk: "",
    nama: "",
    alamat: "",
    desa: "",
    kecamatan: "",
    noTelp: "",
    email: "",
    password: "",
    foto: null,
    fk_penyuluhId: null,
    fk_kelompokId: null,
    kecamatanId: undefined,
    desaId: undefined,
    gapoktan: "",
    namaKelompok: "",
  });

  const { data: petaniData, isLoading: isLoadingPetani } = usePetaniProfile();
  const updateDataPetaniMutation = useUpdateDataPetani();
  const { data: kecamatanList = [], isLoading: isLoadingKecamatan } =
    useKecamatanList();
  const { data: penyuluhList = [], isLoading: isLoadingPenyuluh } =
    usePenyuluhList();
  const { data: gapoktanList = [], isLoading: isLoadingGapoktan } =
    useGapoktanList(formData.desaId);

  const [errors, setErrors] = useState<DataPetaniFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isManualGapoktan, setIsManualGapoktan] = useState<boolean>(false);
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<
    number | undefined
  >(undefined);

  // Fetch desa when kecamatan changes
  const { data: desaList = [], isLoading: isLoadingDesa } =
    useDesaByKecamatan(selectedKecamatanId);

  // Load existing data when petaniData is available
  useEffect(() => {
    if (petaniData) {
      setFormData({
        nik: petaniData.nik || "",
        nkk: petaniData.nkk || "",
        nama: petaniData.nama || "",
        alamat: petaniData.alamat || "",
        desa: petaniData.desa || "",
        kecamatan: petaniData.kecamatan || "",
        noTelp: petaniData.noTelp || "",
        email: petaniData.email || "",
        password: "", // Don't load existing password
        foto: null,
        fk_penyuluhId: petaniData.fk_penyuluhId || null,
        fk_kelompokId: petaniData.fk_kelompokId || null,
        kecamatanId: petaniData.kecamatanId || undefined,
        desaId: petaniData.desaId || undefined,
        gapoktan: petaniData.kelompoks?.[0].gapoktan || "",
        namaKelompok: petaniData.kelompoks?.[0].namaKelompok || "",
      });

      // setOriginalNik(petaniData.nik);
      setSelectedKecamatanId(petaniData.kecamatanId);

      // Set existing image
      if (petaniData.foto) {
        setExistingImage(petaniData.foto);
      }
    }
  }, [petaniData]);

  // Handle input change
  const handleInputChange = (field: keyof DataPetaniFormData, value: any) => {
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

  // Handle kecamatan change
  const handleKecamatanChange = (value: string) => {
    const kecamatanId = parseInt(value);
    const kecamatan = kecamatanList.find((k: any) => k.id === kecamatanId);

    setSelectedKecamatanId(kecamatanId);
    setFormData((prev) => ({
      ...prev,
      kecamatanId: kecamatanId,
      kecamatan: kecamatan?.nama || "",
      desaId: undefined,
      desa: "",
    }));
  };

  // Handle desa change
  const handleDesaChange = (value: string) => {
    const desaId = parseInt(value);
    const desa = desaList.find((d: any) => d.id === desaId);

    setFormData((prev) => ({
      ...prev,
      desaId: desaId,
      desa: desa?.nama || "",
    }));
  };

  // Handle penyuluh change
  const handlePenyuluhChange = (value: string) => {
    const penyuluhId = value ? parseInt(value) : null;

    setFormData((prev) => ({
      ...prev,
      fk_penyuluhId: penyuluhId,
    }));
  };

  // Handle gapoktan change
  const handleGapoktanChange = (value: string) => {
    if (value === "manual") {
      setIsManualGapoktan(true);
      setFormData((prev) => ({
        ...prev,
        fk_kelompokId: null,
        gapoktan: "",
        namaKelompok: "",
      }));
    } else {
      setIsManualGapoktan(false);
      // setManualGapoktanName("");
      const gapoktanId = value ? parseInt(value) : null;
      const selectedGapoktan = gapoktanList.find(
        (g: any) => g.id === gapoktanId,
      );

      setFormData((prev) => ({
        ...prev,
        fk_kelompokId: gapoktanId,
        gapoktan: selectedGapoktan?.gapoktan || "",
        namaKelompok: selectedGapoktan?.namaKelompok || "",
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
          foto: "Format file harus PNG, JPG, JPEG, atau GIF",
        }));

        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          foto: "Ukuran file maksimal 5MB",
        }));

        return;
      }

      setFormData((prev) => ({
        ...prev,
        foto: file,
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
        foto: undefined,
      }));
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      foto: null,
    }));
    setImagePreview(null);
    setExistingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!petaniId) {
      toast.error("ID Petani tidak valid");

      return;
    }

    // Validate form
    const validationErrors = validateDataPetaniForm(formData, true);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }

    try {
      await updateDataPetaniMutation.mutateAsync({
        id: petaniId,
        formData,
      });
      navigate("/dashboard-admin/data-petani");
    } catch {
      // Error handling already done in hook
    }
  };

  // Loading state
  if (isLoadingPetani) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-96 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-96 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!petaniData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto mt-20">
            <CardBody className="text-center py-10">
              <h3 className="text-xl font-semibold mb-2">
                Data Petani Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-4">Data petani tidak ditemukan.</p>
              <Button
                color="primary"
                onPress={() => navigate("/dashboard-admin/data-petani")}
              >
                Kembali ke Data Petani
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-brpy-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg">
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
                Edit Data Petani
              </h1>
              <p className="text-gray-600">Perbarui informasi data petani</p>
            </div>
          </div>

          {/* Current User Info
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardBody className="p-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={existingImage || undefined}
                  name={petaniData.nama}
                  size="lg"
                  className="bg-blue-100 text-blue-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-blue-900">
                      {petaniData.nama}
                    </h4>
                    <Chip
                      size="sm"
                      color={
                        petaniData.tbl_akun?.isVerified ? "success" : "warning"
                      }
                      variant="flat"
                    >
                      {petaniData.tbl_akun?.isVerified
                        ? "Terverifikasi"
                        : "Belum Terverifikasi"}
                    </Chip>
                  </div>
                  <p className="text-sm text-blue-700">NIK: {petaniData.nik}</p>
                  <p className="text-sm text-blue-700">ID: #{petaniData.id}</p>
                </div>
              </div>
            </CardBody>
          </Card> */}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Data Pribadi */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Data Pribadi
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* NIK with Check Button */}
                  <div className="flex gap-2">
                    <Input
                      isRequired
                      className="flex-1"
                      errorMessage={errors.nik}
                      isInvalid={!!errors.nik}
                      label="NIK"
                      maxLength={16}
                      placeholder="Masukkan NIK 16 digit"
                      value={formData.nik}
                      onValueChange={(value) => handleInputChange("nik", value)}
                    />
                  </div>

                  <Input
                    errorMessage={errors.nkk}
                    isInvalid={!!errors.nkk}
                    label="NKK (Nomor Kartu Keluarga)"
                    maxLength={16}
                    placeholder="Masukkan NKK 16 digit (Opsional)"
                    value={formData.nkk || ""}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      isRequired
                      errorMessage={errors.noTelp}
                      isInvalid={!!errors.noTelp}
                      label="Nomor Telepon"
                      placeholder="08xx-xxxx-xxxx"
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">
                            +62
                          </span>
                        </div>
                      }
                      value={formData.noTelp}
                      onValueChange={(value) =>
                        handleInputChange("noTelp", value)
                      }
                    />

                    <Input
                      errorMessage={errors.email}
                      isInvalid={!!errors.email}
                      label="Email"
                      placeholder="email@example.com (Opsional)"
                      type="email"
                      value={formData.email || ""}
                      onValueChange={(value) =>
                        handleInputChange("email", value)
                      }
                    />
                  </div>

                  <Input
                    description="Minimal 6 karakter. Biarkan kosong jika tidak ingin mengubah."
                    errorMessage={errors.password}
                    isInvalid={!!errors.password}
                    label="Password Baru"
                    placeholder="Kosongkan jika tidak ingin mengubah password"
                    type="password"
                    value={formData.password || ""}
                    onValueChange={(value) =>
                      handleInputChange("password", value)
                    }
                  />
                </CardBody>
              </Card>

              {/* Alamat */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Alamat
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Textarea
                    isRequired
                    errorMessage={errors.alamat}
                    isInvalid={!!errors.alamat}
                    label="Alamat Lengkap"
                    minRows={3}
                    placeholder="Masukkan alamat lengkap..."
                    value={formData.alamat}
                    onValueChange={(value) =>
                      handleInputChange("alamat", value)
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      isRequired
                      errorMessage={errors.kecamatan}
                      isInvalid={!!errors.kecamatan}
                      isLoading={isLoadingKecamatan}
                      label="Kecamatan"
                      placeholder="Pilih kecamatan"
                      selectedKeys={
                        formData.kecamatanId
                          ? [formData.kecamatanId.toString()]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        if (value) handleKecamatanChange(value);
                      }}
                    >
                      {kecamatanList.map((kecamatan: any) => (
                        <SelectItem
                          key={kecamatan.id.toString()}
                          textValue={kecamatan.nama}
                        >
                          {kecamatan.nama}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      isRequired
                      errorMessage={errors.desa}
                      isDisabled={!selectedKecamatanId}
                      isInvalid={!!errors.desa}
                      isLoading={isLoadingDesa}
                      label="Desa/Kelurahan"
                      placeholder="Pilih desa"
                      selectedKeys={
                        formData.desaId ? [formData.desaId.toString()] : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        if (value) handleDesaChange(value);
                      }}
                    >
                      {desaList.map((desa: any) => (
                        <SelectItem
                          key={desa.id.toString()}
                          textValue={desa.nama}
                        >
                          {desa.nama}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </CardBody>
              </Card>

              {/* Informasi Tambahan */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Tambahan
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Select
                    isLoading={isLoadingPenyuluh}
                    label="Penyuluh Pembina"
                    placeholder="Pilih penyuluh (Opsional)"
                    selectedKeys={
                      formData.fk_penyuluhId
                        ? [formData.fk_penyuluhId.toString()]
                        : []
                    }
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      handlePenyuluhChange(value);
                    }}
                  >
                    {penyuluhList.map((penyuluh: any) => (
                      <SelectItem
                        key={penyuluh.id.toString()}
                        textValue={penyuluh.nama}
                      >
                        <div className="flex flex-col">
                          <span className="text-small">{penyuluh.nama}</span>
                          <span className="text-tiny text-default-400">
                            {penyuluh.desaData?.nama || "Desa tidak tersedia"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    isRequired
                    isDisabled={true}
                    label="Gapoktan"
                    placeholder={
                      formData.desaId
                        ? "Otomatis terisi berdasarkan desa"
                        : "Pilih desa terlebih dahulu"
                    }
                    value={
                      gapoktanList.length > 0
                        ? gapoktanList[0].gapoktan || ""
                        : ""
                    }
                  />

                  {!isManualGapoktan ? (
                    <div className="space-y-3">
                      <Select
                        isRequired
                        isDisabled={!formData.desaId}
                        isLoading={isLoadingGapoktan}
                        label="Nama Kelompok"
                        placeholder={
                          formData.desaId
                            ? "Pilih kelompok"
                            : "Pilih desa terlebih dahulu"
                        }
                        selectedKeys={
                          formData.fk_kelompokId
                            ? [formData.fk_kelompokId.toString()]
                            : []
                        }
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0] as string;

                          handleGapoktanChange(value);
                        }}
                      >
                        {[
                          ...gapoktanList.map((gapoktan: any) => (
                            <SelectItem
                              key={gapoktan.id.toString()}
                              textValue={gapoktan.namaKelompok}
                            >
                              <div className="flex flex-col">
                                <span className="text-small">
                                  {gapoktan.namaKelompok}
                                </span>
                                <span className="text-tiny text-default-400">
                                  {gapoktan.desa}, {gapoktan.kecamatan}
                                </span>
                              </div>
                            </SelectItem>
                          )),
                          ...(gapoktanList.length === 0 &&
                          formData.desaId &&
                          !isLoadingGapoktan
                            ? [
                                <SelectItem
                                  key="manual"
                                  textValue="Input manual"
                                >
                                  <span className="text-small text-primary">
                                    Tidak ada nama kelompok, input manual
                                  </span>
                                </SelectItem>,
                              ]
                            : []),
                        ]}
                      </Select>

                      {/* Always show manual input option */}
                      {formData.desaId && !isLoadingGapoktan && (
                        <Button
                          className="w-full"
                          size="sm"
                          variant="bordered"
                          onPress={() => setIsManualGapoktan(true)}
                        >
                          Atau Input Gapoktan Manual
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Input
                      isRequired
                      endContent={
                        <Button
                          size="sm"
                          variant="light"
                          onPress={() => {
                            setIsManualGapoktan(false);
                          }}
                        >
                          Kembali
                        </Button>
                      }
                      label="Nama Kelompok"
                      placeholder="Masukkan nama kelompok"
                      value={formData.gapoktan || ""}
                      onValueChange={(value) =>
                        handleInputChange("gapoktan", value)
                      }
                    />
                  )}

                  {isManualGapoktan && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        errorMessage={errors.gapoktan}
                        isInvalid={!!errors.gapoktan}
                        label="Nama Gapoktan"
                        placeholder="Masukkan nama gapoktan"
                        value={formData.gapoktan || ""}
                        onValueChange={(value) =>
                          handleInputChange("gapoktan", value)
                        }
                      />
                      <Input
                        errorMessage={errors.namaKelompok}
                        isInvalid={!!errors.namaKelompok}
                        label="Nama Kelompok"
                        placeholder="Masukkan nama kelompok"
                        value={formData.namaKelompok || ""}
                        onValueChange={(value) =>
                          handleInputChange("namaKelompok", value)
                        }
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Right Column - Photo Upload & Actions */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Foto Profil
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {imagePreview || existingImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          alt="Preview"
                          className="w-full h-full object-cover"
                          src={imagePreview || existingImage || ""}
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                          <p className="text-sm text-gray-500">
                            Upload foto petani
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
                      {imagePreview || existingImage
                        ? "Ganti Foto"
                        : "Upload Foto"}
                    </Button>
                    {errors.foto && (
                      <p className="text-xs text-red-500 mt-1">{errors.foto}</p>
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
                    isDisabled={
                      !formData.nik.trim() ||
                      !formData.nama.trim() ||
                      !formData.alamat.trim() ||
                      !formData.desa.trim() ||
                      !formData.kecamatan.trim() ||
                      !formData.noTelp.trim() ||
                      !formData.email.trim() ||
                      !formData.fk_penyuluhId ||
                      (!formData.fk_kelompokId &&
                        (!formData.gapoktan?.trim() ||
                          !formData.namaKelompok?.trim())) ||
                      updateDataPetaniMutation.isPending
                    }
                    isLoading={updateDataPetaniMutation.isPending}
                    size="lg"
                    startContent={
                      !updateDataPetaniMutation.isPending && (
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
                    {updateDataPetaniMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Perubahan"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={updateDataPetaniMutation.isPending}
                    variant="light"
                    onPress={() => navigate("/dashboard-admin/data-petani")}
                  >
                    Batal
                  </Button>
                </CardBody>
              </Card>

              {/* Information Card */}
              <Card className="bg-amber-50 border-amber-200">
                <CardBody className="text-sm">
                  <div className="flex gap-2">
                    <svg
                      className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
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
                    <div className="text-amber-800">
                      <p className="font-semibold mb-1">Informasi Perubahan:</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • Perubahan NIK memerlukan pengecekan ketersediaan
                        </li>
                        <li>• Password hanya akan diubah jika field diisi</li>
                        <li>• Foto profil bersifat opsional</li>
                        <li>
                          • Status verifikasi tidak berubah saat edit data
                        </li>
                        <li>
                          • Perubahan akan langsung diterapkan setelah disimpan
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
