// pages/CreatePenyuluh.tsx
import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import {
  CreatePenyuluhData,
  Kelompok,
} from "@/types/DataPenyuluh/createPenyuluh";
import {
  useKecamatan,
  useDesaByKecamatan,
  useAllKelompok,
  useCreatePenyuluh,
} from "@/hook/dashboard/infoPenyuluh/useCreatePenyuluh";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";

export default function CreateInformasiPenyuluh() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    NIP: "",
    nama: "",
    email: "",
    NoWa: "",
    password: "",
    alamat: "",
    kecamatanId: null as number | null,
    kecamatan: "",
    desaId: null as number | null,
    desa: "",
    kecamatanBinaanId: null as number | null,
    kecamatanBinaan: "",
    desaBinaan: [] as string[],
    namaProduct: "",
    selectedKelompokIds: [] as string[],
    tipe: "reguler",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // API Hooks
  const { data: kecamatanData, isLoading: loadingKecamatan } = useKecamatan();
  const { data: desaData, isLoading: loadingDesa } = useDesaByKecamatan(
    formData.kecamatanId,
  );
  const { data: desaBinaanData, isLoading: loadingDesaBinaan } =
    useDesaByKecamatan(formData.kecamatanBinaanId);
  const { data: kelompokData, isLoading: loadingKelompok } = useAllKelompok();
  const createMutation = useCreatePenyuluh();

  // Filtered kelompok based on selected kecamatan binaan
  const filteredKelompok = useMemo(() => {
    if (!kelompokData?.dataKelompok || !formData.kecamatanBinaanId) {
      return [];
    }

    return Object.values(kelompokData.dataKelompok).filter(
      (kelompok: Kelompok) =>
        kelompok.kecamatanId === formData.kecamatanBinaanId,
    );
  }, [kelompokData, formData.kecamatanBinaanId]);

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle kecamatan selection
  const handleKecamatanChange = (value: string) => {
    const selectedKecamatan = kecamatanData?.data.find(
      (k) => k.id.toString() === value,
    );

    if (selectedKecamatan) {
      setFormData((prev) => ({
        ...prev,
        kecamatanId: selectedKecamatan.id,
        kecamatan: selectedKecamatan.nama,
        desaId: null,
        desa: "",
      }));
    }
  };

  // Handle desa selection
  const handleDesaChange = (value: string) => {
    const selectedDesa = desaData?.data.find((d) => d.id.toString() === value);

    if (selectedDesa) {
      setFormData((prev) => ({
        ...prev,
        desaId: selectedDesa.id,
        desa: selectedDesa.nama,
      }));
    }
  };

  // Handle kecamatan binaan selection
  const handleKecamatanBinaanChange = (value: string) => {
    const selectedKecamatan = kecamatanData?.data.find(
      (k) => k.id.toString() === value,
    );

    if (selectedKecamatan) {
      setFormData((prev) => ({
        ...prev,
        kecamatanBinaanId: selectedKecamatan.id,
        kecamatanBinaan: selectedKecamatan.nama,
        desaBinaan: [],
        selectedKelompokIds: [],
      }));
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

      if (!validTypes.includes(file.type)) {
        toast.error("Format file harus PNG, JPG, JPEG, atau GIF");

        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");

        return;
      }

      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);

      setPreviewUrl(url);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.NIP || !formData.nama || !formData.email || !formData.NoWa) {
      toast.error("Silakan lengkapi semua field yang wajib diisi");

      return;
    }

    if (!formData.kecamatanId || !formData.desaId) {
      toast.error("Silakan pilih kecamatan dan desa");

      return;
    }

    if (!formData.kecamatanBinaanId) {
      toast.error("Silakan pilih kecamatan binaan");

      return;
    }

    if (formData.desaBinaan.length === 0) {
      toast.error("Silakan pilih minimal satu desa binaan");

      return;
    }

    if (formData.selectedKelompokIds.length === 0) {
      toast.error("Silakan pilih minimal satu kelompok");

      return;
    }

    try {
      const submitData: CreatePenyuluhData = {
        NIP: formData.NIP,
        nama: formData.nama,
        email: formData.email,
        NoWa: formData.NoWa,
        password: formData.password,
        alamat: formData.alamat,
        kecamatanId: formData.kecamatanId,
        kecamatan: formData.kecamatan,
        desaId: formData.desaId,
        desa: formData.desa,
        kecamatanBinaan: formData.kecamatanBinaan,
        desaBinaan: formData.desaBinaan,
        namaProduct: formData.namaProduct,
        selectedKelompokIds: formData.selectedKelompokIds.map((id) =>
          parseInt(id),
        ),
        foto: selectedFile || undefined,
        tipe: formData.tipe,
      };

      toast.loading("Menyimpan data penyuluh...", { id: "create" });
      await createMutation.mutateAsync(submitData);
      toast.success("Data penyuluh berhasil disimpan", { id: "create" });
      navigate("/dashboard-admin/data-penyuluh");
    } catch (error) {
      toast.error("Gagal menyimpan data penyuluh. Silakan coba lagi.", {
        id: "create",
      });
    }
  };

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola akses dan role user"
        title="Tambah Informasi Penyuluh | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Informasi Penyuluh", to: "/dashboard-admin/data-penyuluh" },
          { label: "Tambah Informasi Penyuluh" },
        ]}
      />
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Tambah Penyuluh</h1>
              <p className="text-gray-600">
                Silakan lengkapi form untuk menambah penyuluh baru
              </p>
            </div>
          </CardHeader>

          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar
                  className="w-24 h-24"
                  name={formData.nama || "User"}
                  size="lg"
                  src={previewUrl}
                />
                <Button
                  type="button"
                  variant="bordered"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? "Ubah Foto" : "Pilih Foto"}
                </Button>
                <input
                  ref={fileInputRef}
                  accept="image/png,image/jpg,image/jpeg,image/gif"
                  className="hidden"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informasi Dasar</h3>

                  <Input
                    isRequired
                    label="NIP Penyuluh"
                    placeholder="Masukkan NIP"
                    value={formData.NIP}
                    variant="bordered"
                    onChange={(e) => handleInputChange("NIP", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    variant="bordered"
                    onChange={(e) => handleInputChange("nama", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="Email"
                    placeholder="Masukkan email"
                    type="email"
                    value={formData.email}
                    variant="bordered"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="No. HP/WhatsApp"
                    placeholder="Masukkan nomor HP"
                    value={formData.NoWa}
                    variant="bordered"
                    onChange={(e) => handleInputChange("NoWa", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="Password"
                    placeholder="Masukkan password"
                    type="password"
                    value={formData.password}
                    variant="bordered"
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />

                  {/* Tipe Penyuluh */}
                  <div>
                    <Select
                      label="Tipe Penyuluh"
                      placeholder="Pilih tipe penyuluh"
                      selectedKeys={formData.tipe ? [formData.tipe] : []}
                      variant="bordered"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;

                        setFormData((prev) => ({
                          ...prev,
                          tipe: selected,
                        }));
                      }}
                    >
                      <SelectItem key="reguler" textValue="Reguler">
                        <div>
                          <p className="font-medium">Reguler</p>
                        </div>
                      </SelectItem>
                      <SelectItem key="swadaya" textValue="Swadaya">
                        <div>
                          <p className="font-medium">Swadaya</p>
                        </div>
                      </SelectItem>
                    </Select>
                  </div>

                  <Textarea
                    label="Alamat"
                    minRows={3}
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    variant="bordered"
                    onChange={(e) =>
                      handleInputChange("alamat", e.target.value)
                    }
                  />
                </div>

                {/* Location & Assignment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Wilayah & Penugasan</h3>

                  {/* Kecamatan */}
                  <Select
                    isRequired
                    isLoading={loadingKecamatan}
                    label="Kecamatan"
                    placeholder="Pilih kecamatan"
                    selectedKeys={
                      formData.kecamatanId
                        ? [formData.kecamatanId.toString()]
                        : []
                    }
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      if (value) handleKecamatanChange(value);
                    }}
                  >
                    {(kecamatanData?.data || []).map((kecamatan) => (
                      <SelectItem key={kecamatan.id} textValue={kecamatan.nama}>
                        {kecamatan.nama}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Desa */}
                  <Select
                    isRequired
                    isDisabled={!formData.kecamatanId}
                    isLoading={loadingDesa}
                    label="Desa"
                    placeholder="Pilih desa"
                    selectedKeys={
                      formData.desaId ? [formData.desaId.toString()] : []
                    }
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      if (value) handleDesaChange(value);
                    }}
                  >
                    {(desaData?.data || []).map((desa) => (
                      <SelectItem key={desa.id} textValue={desa.nama}>
                        {desa.nama}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Kecamatan Binaan */}
                  <Select
                    isRequired
                    isLoading={loadingKecamatan}
                    label="Kecamatan Binaan"
                    placeholder="Pilih kecamatan binaan"
                    selectedKeys={
                      formData.kecamatanBinaanId
                        ? [formData.kecamatanBinaanId.toString()]
                        : []
                    }
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;

                      if (value) handleKecamatanBinaanChange(value);
                    }}
                  >
                    {(kecamatanData?.data || []).map((kecamatan) => (
                      <SelectItem key={kecamatan.id} textValue={kecamatan.nama}>
                        {kecamatan.nama}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Desa Binaan - Multiple Select */}
                  <Select
                    isRequired
                    isDisabled={!formData.kecamatanBinaanId}
                    isLoading={loadingDesaBinaan}
                    isMultiline={true}
                    label="Desa Wilayah Binaan"
                    placeholder="Pilih desa binaan"
                    renderValue={(items) => {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <div
                              key={item.key}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {item.textValue}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                    selectedKeys={formData.desaBinaan}
                    selectionMode="multiple"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      handleInputChange("desaBinaan", Array.from(keys));
                    }}
                  >
                    {(desaBinaanData?.data || []).map((desa) => (
                      <SelectItem key={desa.nama} textValue={desa.nama}>
                        {desa.nama}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Pilih Kelompok - Multiple Select */}
                  <Select
                    isRequired
                    isDisabled={!formData.kecamatanBinaanId}
                    isLoading={loadingKelompok}
                    isMultiline={true}
                    label="Pilih Kelompok"
                    placeholder="Pilih kelompok yang akan dibina"
                    renderValue={(items) => {
                      return (
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <div
                              key={item.key}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {item.textValue}
                            </div>
                          ))}
                        </div>
                      );
                    }}
                    selectedKeys={formData.selectedKelompokIds}
                    selectionMode="multiple"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      handleInputChange(
                        "selectedKelompokIds",
                        Array.from(keys),
                      );
                    }}
                  >
                    {filteredKelompok.map((kelompok) => (
                      <SelectItem
                        key={kelompok.id}
                        textValue={`${kelompok.namaKelompok} - ${kelompok.desa}`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {kelompok.namaKelompok} - {kelompok.desa} -{" "}
                            {kelompok.gapoktan}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Nama Produk"
                    placeholder="Masukkan nama produk yang dibina"
                    value={formData.namaProduct}
                    variant="bordered"
                    onChange={(e) =>
                      handleInputChange("namaProduct", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="bordered"
                  onPress={() => navigate("/daftar-penyuluh")}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  isLoading={createMutation.isPending}
                  type="submit"
                >
                  {createMutation.isPending ? "Menyimpan..." : "Simpan Data"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
