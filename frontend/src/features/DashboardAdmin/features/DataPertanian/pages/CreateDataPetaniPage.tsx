import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// HeroUI Components
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Image } from "@heroui/image";

import {
  DataPetaniFormData,
  DataPetaniFormErrors,
  useCreateDataPetani,
  useKecamatanList,
  useDesaByKecamatan,
  usePenyuluhList,
  useGapoktanList,
  validateDataPetaniForm,
} from "@/hook/dashboard/dataPetani/useCreateEditDataPetani";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";

export const CreateDataPetaniPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [errors, setErrors] = useState<DataPetaniFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<
    number | undefined
  >(undefined);
  const [isManualGapoktan, setIsManualGapoktan] = useState(false);
  const [manualGapoktanName, setManualGapoktanName] = useState("");

  // API Hooks
  const createDataPetaniMutation = useCreateDataPetani();
  const { data: kecamatanList = [], isLoading: isLoadingKecamatan } =
    useKecamatanList();
  const { data: penyuluhList = [], isLoading: isLoadingPenyuluh } =
    usePenyuluhList();
  // const { data: kelompokList = [], isLoading: isLoadingKelompok } = useKelompokTaniList();
  const { data: gapoktanList = [], isLoading: isLoadingGapoktan } =
    useGapoktanList(formData.desaId);

  // Fetch desa when kecamatan changes
  const { data: desaList = [], isLoading: isLoadingDesa } =
    useDesaByKecamatan(selectedKecamatanId);

  // Handle input change
  const handleInputChange = (field: keyof DataPetaniFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      setManualGapoktanName("");
      const gapoktanId = value ? parseInt(value) : null;

      // Find the selected gapoktan data to get gapoktan and namaKelompok
      const selectedGapoktan = gapoktanList.find((g) => g.id === gapoktanId);

      setFormData((prev) => ({
        ...prev,
        fk_kelompokId: gapoktanId,
        gapoktan: selectedGapoktan?.gapoktan || "",
        namaKelompok: selectedGapoktan?.namaKelompok || "",
      }));
    }
  };

  // Handle manual gapoktan name change
  const handleManualGapoktanChange = (value: string) => {
    setManualGapoktanName(value);
    setFormData((prev) => ({
      ...prev,
      fk_kelompokId: null,
      gapoktan: value,
      namaKelompok: value,
    }));
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form
    const validationErrors = validateDataPetaniForm(formData, false);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }

    // NIK validation removed - backend will handle duplicate checking

    try {
      await createDataPetaniMutation.mutateAsync(formData);
      navigate("/dashboard-admin/data-petani");
    } catch {
      // Error handling already done in hook
    }
  };

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Tambah data petani baru"
        title="Tambah Data Petani | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Data Petani", to: "/dashboard-admin/data-petani" },
          { label: "Tambah Data" },
        ]}
      />

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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tambah Data Petani
              </h1>
              <p className="text-gray-600">
                Daftarkan petani baru ke dalam sistem
              </p>
            </div>
          </div>
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
                  {/* NKK */}

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

                  <Input
                    isRequired
                    errorMessage={errors.nkk}
                    isInvalid={!!errors.nkk}
                    label="NKK"
                    maxLength={16}
                    placeholder="16 digit NKK"
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
                      value={formData.noTelp}
                      onValueChange={(value) =>
                        handleInputChange("noTelp", value)
                      }
                    />

                    <Input
                      isRequired
                      errorMessage={errors.email}
                      isInvalid={!!errors.email}
                      label="Email"
                      placeholder="email@example.com"
                      type="email"
                      value={formData.email || ""}
                      onValueChange={(value) =>
                        handleInputChange("email", value)
                      }
                    />
                  </div>

                  <Input
                    isRequired
                    errorMessage={errors.password}
                    isInvalid={!!errors.password}
                    label="Password"
                    placeholder="Minimal 6 karakter"
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
              <Card shadow="sm" className="mb-30">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Tambahan
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Select
                    disableAnimation
                    popoverProps={{
                      shouldBlockScroll: false,
                      shouldCloseOnScroll: false,
                    }}
                    listboxProps={{
                      style: { maxHeight: "200px", overflowY: "auto" },
                    }}
                    isRequired
                    isLoading={isLoadingPenyuluh}
                    label="Penyuluh"
                    placeholder="Pilih penyuluh"
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
                            {penyuluh.desaData?.nama ||
                              penyuluh.desa ||
                              "Tidak ada desa"}
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
                        disableAnimation
                        popoverProps={{
                          shouldBlockScroll: false,
                          shouldCloseOnScroll: false,
                        }}
                        listboxProps={{
                          style: { maxHeight: "200px", overflowY: "auto" },
                        }}
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
                            setManualGapoktanName("");
                          }}
                        >
                          Kembali
                        </Button>
                      }
                      label="Nama Kelompok"
                      placeholder="Masukkan nama kelompok"
                      value={manualGapoktanName}
                      onValueChange={handleManualGapoktanChange}
                    />
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
                      {imagePreview ? "Ganti Foto" : "Upload Foto"}
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
                      !formData.nik ||
                      !formData.nkk ||
                      !formData.nama ||
                      !formData.alamat ||
                      !formData.desa ||
                      !formData.kecamatan ||
                      !formData.noTelp ||
                      !formData.email ||
                      !formData.password ||
                      !formData.foto ||
                      !formData.fk_penyuluhId ||
                      (!formData.fk_kelompokId && !isManualGapoktan) ||
                      (isManualGapoktan && !manualGapoktanName) ||
                      createDataPetaniMutation.isPending
                    }
                    isLoading={createDataPetaniMutation.isPending}
                    size="lg"
                    startContent={
                      !createDataPetaniMutation.isPending && (
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
                    {createDataPetaniMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Data Petani"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={createDataPetaniMutation.isPending}
                    variant="light"
                    onPress={() => navigate("/dashboard-admin/data-petani")}
                  >
                    Batal
                  </Button>
                </CardBody>
              </Card>

              {/* Information Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardBody className="text-sm">
                  <div className="flex gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
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
                    <div className="text-blue-800">
                      <p className="font-semibold mb-1">Informasi Penting:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Pastikan NIK yang dimasukkan benar dan valid</li>
                        <li>
                          • Data petani akan otomatis terdaftar dengan status
                          belum terverifikasi
                        </li>
                        <li>
                          • Verifikasi dapat dilakukan melalui menu Data Petani
                        </li>
                        <li>
                          • Password default akan digunakan untuk login petani
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
