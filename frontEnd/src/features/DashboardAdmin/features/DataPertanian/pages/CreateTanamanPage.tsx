import type { PetaniOption } from "@/types/DataPertanian/createDataTanaman.d";

import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useCreateDataTanaman } from "@/hook/dashboard/dataPertanian/UseCreateDataTanaman";

export const CreateTanamanPage = () => {
  const navigate = useNavigate();

  const {
    // Form state
    formData,
    errors,
    selectedPetani,
    isPetaniLoading,

    // Options
    statusKepemilikanOptions,
    kategoriOptions,
    jenisOptions,
    periodeMusimOptions,
    bulanOptions,
    komoditasSuggestions,

    // Functions
    handleInputChange,
    handlePetaniChange,
    handleSubmit,
    loadPetaniOptions,

    // Mutation
    createMutation,
  } = useCreateDataTanaman();

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Tambah data tanaman petani baru"
        title="Tambah Data Tanaman | SI-KETAN"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Data Tanaman", to: "/dashboard-admin/data-tanaman" },
          { label: "Tambah Data" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
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
                Tambah Data Tanaman
              </h1>
              <p className="text-gray-600">
                Input data tanaman petani baru ke dalam sistem
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informasi Petani */}
              <Card className="p-5 " shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Petani
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Petani Select Filter */}
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pilih Petani <span className="text-red-500">*</span>
                    </p>
                    <AsyncSelect
                      cacheOptions
                      isClearable
                      className=""
                      classNames={{
                        control: () =>
                          "w-full px-1 py-2 border border-gray-300 rounded",
                      }}
                      // Tambahkan styles untuk z-index yang lebih tinggi
                      formatOptionLabel={(option: PetaniOption) => (
                        <div className="flex flex-col">
                          <span className="font-medium">{option.nama}</span>
                          <span className="text-sm text-gray-500">
                            NIK: {option.nik} | {option.desa},{" "}
                            {option.kecamatan}
                          </span>
                        </div>
                      )}
                      isLoading={isPetaniLoading}
                      loadOptions={loadPetaniOptions}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      menuShouldScrollIntoView={false}
                      noOptionsMessage={({ inputValue }) =>
                        inputValue
                          ? `Tidak ada hasil untuk "${inputValue}"`
                          : "Ketik NIK untuk mencari..."
                      }
                      placeholder="Pilih atau cari petani..."
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      value={selectedPetani}
                      onChange={handlePetaniChange}
                    />

                    {errors.fk_petaniId && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.fk_petaniId}
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Informasi Lahan */}
              <Card className="p-5" shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Lahan
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      isRequired
                      errorMessage={errors.statusKepemilikanLahan}
                      isInvalid={!!errors.statusKepemilikanLahan}
                      label="Status Kepemilikan Lahan"
                      placeholder="Pilih status kepemilikan"
                      selectedKeys={
                        formData.statusKepemilikanLahan
                          ? [formData.statusKepemilikanLahan]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("statusKepemilikanLahan", value);
                      }}
                    >
                      {statusKepemilikanOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      isRequired
                      errorMessage={errors.luasLahan}
                      isInvalid={!!errors.luasLahan}
                      label="Luas Lahan (m²)"
                      min={1}
                      placeholder="Masukkan luas lahan"
                      type="number"
                      value={formData.luasLahan}
                      onValueChange={(value) =>
                        handleInputChange("luasLahan", value)
                      }
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Informasi Tanaman */}
              <Card className="p-5" shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Tanaman
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      isRequired
                      errorMessage={errors.kategori}
                      isInvalid={!!errors.kategori}
                      label="Kategori Tanaman"
                      placeholder="Pilih kategori"
                      selectedKeys={
                        formData.kategori ? [formData.kategori] : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("kategori", value);
                      }}
                    >
                      {kategoriOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      isRequired
                      errorMessage={errors.jenis}
                      isInvalid={!!errors.jenis}
                      label="Jenis Tanaman"
                      placeholder="Pilih jenis"
                      selectedKeys={formData.jenis ? [formData.jenis] : []}
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("jenis", value);
                      }}
                    >
                      {jenisOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Input
                    isRequired
                    description="Contoh: Padi Organik, Jagung, Cabai Merah"
                    errorMessage={errors.komoditas}
                    isInvalid={!!errors.komoditas}
                    label="Komoditas"
                    placeholder="Masukkan nama komoditas (contoh: Padi Organik)"
                    value={formData.komoditas}
                    onValueChange={(value) =>
                      handleInputChange("komoditas", value)
                    }
                  />
                </CardBody>
              </Card>

              {/* Periode Tanam */}
              <Card className="p-5" shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Periode Tanam
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      isRequired
                      errorMessage={errors.periodeMusimTanam}
                      isInvalid={!!errors.periodeMusimTanam}
                      label="Periode Musim Tanam"
                      placeholder="Pilih periode musim"
                      selectedKeys={
                        formData.periodeMusimTanam
                          ? [formData.periodeMusimTanam]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("periodeMusimTanam", value);
                      }}
                    >
                      {periodeMusimOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      isRequired
                      errorMessage={errors.periodeBulanTanam}
                      isInvalid={!!errors.periodeBulanTanam}
                      label="Bulan Tanam"
                      placeholder="Pilih bulan tanam"
                      selectedKeys={
                        formData.periodeBulanTanam
                          ? [formData.periodeBulanTanam]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("periodeBulanTanam", value);
                      }}
                    >
                      {bulanOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </CardBody>
              </Card>

              {/* Prakiraan Panen */}
              <Card className="p-5" shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Prakiraan Panen
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      isRequired
                      errorMessage={errors.prakiraanLuasPanen}
                      isInvalid={!!errors.prakiraanLuasPanen}
                      label="Luas Panen (m²)"
                      min={1}
                      placeholder="0"
                      type="number"
                      value={formData.prakiraanLuasPanen.toString()}
                      onValueChange={(value) =>
                        handleInputChange(
                          "prakiraanLuasPanen",
                          parseInt(value) || 0,
                        )
                      }
                    />

                    <Input
                      isRequired
                      errorMessage={errors.prakiraanProduksiPanen}
                      isInvalid={!!errors.prakiraanProduksiPanen}
                      label="Produksi Panen (kg)"
                      min={1}
                      placeholder="0"
                      type="number"
                      value={formData.prakiraanProduksiPanen.toString()}
                      onValueChange={(value) =>
                        handleInputChange(
                          "prakiraanProduksiPanen",
                          parseInt(value) || 0,
                        )
                      }
                    />

                    <Select
                      isRequired
                      errorMessage={errors.prakiraanBulanPanen}
                      isInvalid={!!errors.prakiraanBulanPanen}
                      label="Bulan Panen"
                      placeholder="Pilih bulan panen"
                      selectedKeys={
                        formData.prakiraanBulanPanen
                          ? [formData.prakiraanBulanPanen]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const value = Array.from(keys)[0] as string;

                        handleInputChange("prakiraanBulanPanen", value);
                      }}
                    >
                      {bulanOptions.map((item) => (
                        <SelectItem key={item.key} textValue={item.label}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card
                className="bg-gradient-to-br p-5 from-green-50 to-emerald-50"
                shadow="sm"
              >
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-green-900">
                    Panduan Pengisian
                  </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm text-green-800">
                        Pastikan semua field yang bertanda * terisi dengan benar
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm text-green-800">
                        Luas lahan dan prakiraan panen dalam satuan meter
                        persegi (m²)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm text-green-800">
                        Produksi panen dalam satuan kilogram (kg)
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Komoditas Suggestions */}
              <Card className="p-5" shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Komoditas Umum
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {komoditasSuggestions.slice(0, 8).map((item) => (
                      <button
                        key={item}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                        type="button"
                        onClick={() => handleInputChange("komoditas", item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <Card className="p-5" shadow="sm">
                <CardBody className="space-y-3">
                  <Button
                    className="w-full"
                    color="primary"
                    isLoading={createMutation.isPending}
                    size="lg"
                    startContent={
                      !createMutation.isPending && (
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
                    {createMutation.isPending ? "Menyimpan..." : "Simpan Data"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={createMutation.isPending}
                    variant="light"
                    onPress={() => navigate("/dashboard-admin/data-tanaman")}
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
