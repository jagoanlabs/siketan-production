import { Avatar } from "../../../../../../components/Form/HeroAvatar";
import { Card, CardBody, CardHeader } from "../../../../../../components/Form/HeroCard";
import { Input, Textarea } from "../../../../../../components/Form/HeroInput";
import { Button } from "../../../../../../components/Form/HeroButton";
import { Select, SelectItem } from "../../../../../../components/Form/HeroSelect";
import ReactSelect from "react-select";

// pages/CreatePenyuluh.tsx
import React, { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    tipe: "reguler" as "reguler" | "swadaya",
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

  // Options for react-select Desa Binaan
  const desaBinaanOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();

    (desaBinaanData?.data || []).forEach((desa) => {
      map.set(desa.nama, {
        value: desa.nama,
        label: desa.nama,
      });
    });

    formData.desaBinaan.forEach((desaNama) => {
      if (desaNama && !map.has(desaNama)) {
        map.set(desaNama, {
          value: desaNama,
          label: desaNama,
        });
      }
    });

    return Array.from(map.values());
  }, [desaBinaanData, formData.desaBinaan]);

  const selectedDesaBinaanValues = useMemo(() => {
    return formData.desaBinaan.map((nama) => {
      const found = desaBinaanOptions.find((opt) => opt.value === nama);
      return found || { value: nama, label: nama };
    });
  }, [desaBinaanOptions, formData.desaBinaan]);

  // Options for react-select Kelompok Binaan
  const kelompokBinaanOptions = useMemo(() => {
    return filteredKelompok.map((kelompok: Kelompok) => ({
      value: String(kelompok.id),
      label: `${kelompok.namaKelompok} - ${kelompok.desa}${kelompok.gapoktan ? ` (Gapoktan: ${kelompok.gapoktan})` : ""}`,
      data: kelompok,
    }));
  }, [filteredKelompok]);

  const selectedKelompokValues = useMemo(() => {
    return formData.selectedKelompokIds.map((id) => {
      const found = kelompokBinaanOptions.find((opt) => opt.value === String(id));
      return found || { value: String(id), label: `Kelompok #${id}` };
    });
  }, [kelompokBinaanOptions, formData.selectedKelompokIds]);

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
                    onChange={(e: any) => handleInputChange("NIP", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="Nama Lengkap"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    variant="bordered"
                    onChange={(e: any) => handleInputChange("nama", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="Email"
                    placeholder="Masukkan email"
                    type="email"
                    value={formData.email}
                    variant="bordered"
                    onChange={(e: any) => handleInputChange("email", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="No. HP/WhatsApp"
                    placeholder="Masukkan nomor HP"
                    value={formData.NoWa}
                    variant="bordered"
                    onChange={(e: any) => handleInputChange("NoWa", e.target.value)}
                  />

                  <Input
                    isRequired
                    label="Password"
                    placeholder="Masukkan password"
                    type="password"
                    value={formData.password}
                    variant="bordered"
                    onChange={(e: any) =>
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
                      onSelectionChange={(keys: any) => {
                        const selected = Array.from(keys)[0] as string;

                        setFormData((prev) => ({
                          ...prev,
                          tipe: selected as "reguler" | "swadaya",
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
                    onChange={(e: any) =>
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
                    onSelectionChange={(keys: any) => {
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
                    onSelectionChange={(keys: any) => {
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
                    onSelectionChange={(keys: any) => {
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

                  {/* Desa Wilayah Binaan - Multiple Select with Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Desa Wilayah Binaan <span className="text-red-500">*</span>
                    </label>
                    <ReactSelect
                      isClearable
                      isMulti
                      isSearchable
                      isDisabled={!formData.kecamatanBinaanId || loadingDesaBinaan}
                      isLoading={loadingDesaBinaan}
                      options={desaBinaanOptions}
                      placeholder={
                        formData.kecamatanBinaanId
                          ? "Cari dan pilih satu atau lebih desa binaan..."
                          : "Pilih kecamatan binaan terlebih dahulu"
                      }
                      noOptionsMessage={({ inputValue }) =>
                        inputValue
                          ? `Tidak ada desa "${inputValue}"`
                          : "Tidak ada data desa"
                      }
                      value={selectedDesaBinaanValues}
                      onChange={(selectedOptions: any) => {
                        const values = selectedOptions
                          ? selectedOptions.map((opt: any) => opt.value)
                          : [];
                        handleInputChange("desaBinaan", values);
                      }}
                      classNames={{
                        control: ({ isFocused }) =>
                          `w-full px-3 py-1 bg-transparent border rounded-xl hover:border-gray-400 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[42px] ${
                            isFocused
                              ? "border-green-500 ring-1 ring-green-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`,
                        valueContainer: () => "flex items-center gap-1.5 flex-1 flex-wrap py-0.5",
                        input: () => "text-gray-800 dark:text-gray-100 text-sm m-0 p-0 outline-none border-none ring-0 focus:ring-0",
                        placeholder: () => "text-gray-400 text-sm",
                        indicatorsContainer: () => "flex items-center gap-1 text-gray-400",
                        dropdownIndicator: () => "p-1 hover:text-gray-600 cursor-pointer",
                        clearIndicator: () => "p-1 hover:text-red-500 cursor-pointer",
                        multiValue: () =>
                          "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-lg px-2 py-0.5 m-0.5 text-xs font-medium flex items-center gap-1",
                        multiValueLabel: () =>
                          "text-blue-800 dark:text-blue-200 text-xs font-medium",
                        multiValueRemove: () =>
                          "hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 text-blue-600 transition-colors cursor-pointer",
                        menu: () =>
                          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-[9999]",
                        option: ({ isFocused, isSelected }) =>
                          `px-3 py-2 text-sm rounded-lg cursor-pointer ${
                            isSelected
                              ? "bg-green-600 text-white"
                              : isFocused
                                ? "bg-green-50 dark:bg-gray-700 text-green-800 dark:text-green-300"
                                : "text-gray-700 dark:text-gray-200"
                          }`,
                      }}
                      unstyled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Dapat memilih lebih dari satu desa binaan. Ketik untuk mencari desa.
                    </p>
                  </div>

                  {/* Kelompok Tani Binaan - Multiple Select with Search */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Kelompok Tani Binaan <span className="text-red-500">*</span>
                    </label>
                    <ReactSelect
                      isClearable
                      isMulti
                      isSearchable
                      isDisabled={!formData.kecamatanBinaanId || loadingKelompok}
                      isLoading={loadingKelompok}
                      options={kelompokBinaanOptions}
                      placeholder={
                        formData.kecamatanBinaanId
                          ? "Cari dan pilih satu atau lebih kelompok tani binaan..."
                          : "Pilih kecamatan binaan terlebih dahulu"
                      }
                      noOptionsMessage={({ inputValue }) =>
                        inputValue
                          ? `Tidak ada kelompok tani "${inputValue}"`
                          : "Tidak ada data kelompok tani"
                      }
                      value={selectedKelompokValues}
                      onChange={(selectedOptions: any) => {
                        const values = selectedOptions
                          ? selectedOptions.map((opt: any) => opt.value)
                          : [];
                        handleInputChange("selectedKelompokIds", values);
                      }}
                      classNames={{
                        control: ({ isFocused }) =>
                          `w-full px-3 py-1 bg-transparent border rounded-xl hover:border-gray-400 transition-colors outline-none focus:outline-none flex items-center justify-between min-h-[42px] ${
                            isFocused
                              ? "border-green-500 ring-1 ring-green-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`,
                        valueContainer: () => "flex items-center gap-1.5 flex-1 flex-wrap py-0.5",
                        input: () => "text-gray-800 dark:text-gray-100 text-sm m-0 p-0 outline-none border-none ring-0 focus:ring-0",
                        placeholder: () => "text-gray-400 text-sm",
                        indicatorsContainer: () => "flex items-center gap-1 text-gray-400",
                        dropdownIndicator: () => "p-1 hover:text-gray-600 cursor-pointer",
                        clearIndicator: () => "p-1 hover:text-red-500 cursor-pointer",
                        multiValue: () =>
                          "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-lg px-2 py-0.5 m-0.5 text-xs font-medium flex items-center gap-1",
                        multiValueLabel: () =>
                          "text-green-800 dark:text-green-200 text-xs font-medium",
                        multiValueRemove: () =>
                          "hover:bg-green-200 dark:hover:bg-green-800 rounded p-0.5 text-green-600 transition-colors cursor-pointer",
                        menu: () =>
                          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-1 p-1 z-[9999]",
                        option: ({ isFocused, isSelected }) =>
                          `px-3 py-2 text-sm rounded-lg cursor-pointer ${
                            isSelected
                              ? "bg-green-600 text-white"
                              : isFocused
                                ? "bg-green-50 dark:bg-gray-700 text-green-800 dark:text-green-300"
                                : "text-gray-700 dark:text-gray-200"
                          }`,
                      }}
                      unstyled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Dapat memilih lebih dari satu kelompok tani binaan. Ketik untuk mencari kelompok.
                    </p>
                  </div>

                  <Input
                    label="Nama Produk"
                    placeholder="Masukkan nama produk yang dibina"
                    value={formData.namaProduct}
                    variant="bordered"
                    onChange={(e: any) =>
                      handleInputChange("namaProduct", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="button"
                  variant="bordered"
                  onPress={() => navigate("/dashboard-admin/data-penyuluh")}
                >
                  Batal
                </Button>
                <Button
                  color="primary"
                  isLoading={createMutation.isPending}
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all text-white font-medium"
                  startContent={
                    !createMutation.isPending && (
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
                          strokeWidth="2"
                        />
                      </svg>
                    )
                  }
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
