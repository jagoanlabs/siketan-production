import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { useEditTanaman } from "@/hook/dashboard/dataPertanian/useEditTanaman";

export const EditTanamanPage = () => {
  const navigate = useNavigate();

  const {
    // Data
    formData,
    errors,
    hasChanges,
    selectedPetani,
    tanamanData,
    isDataLoading,
    updateMutation,

    // Options
    statusKepemilikanOptions,
    kategoriOptions,
    jenisOptions,
    periodeMusimOptions,
    bulanOptions,

    // Functions
    handleInputChange,
    handleSubmit,
  } = useEditTanaman();

  // Loading skeleton
  if (isDataLoading) {
    return (
      <div className="min-h-screen container mx-auto max-w-6xl py-6">
        <PageMeta
          description="Edit data tanaman petani"
          title="Edit Data Tanaman | SI-KETAN"
        />

        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            { label: "Data Tanaman", to: "/dashboard-admin/data-tanaman" },
            { label: "Edit Data" },
          ]}
        />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} shadow="sm">
                  <CardBody className="space-y-4">
                    <Skeleton className="rounded-lg">
                      <div className="h-12 rounded-lg bg-default-300" />
                    </Skeleton>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="rounded-lg">
                        <div className="h-12 rounded-lg bg-default-300" />
                      </Skeleton>
                      <Skeleton className="rounded-lg">
                        <div className="h-12 rounded-lg bg-default-300" />
                      </Skeleton>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="space-y-6">
              <Card shadow="sm">
                <CardBody>
                  <Skeleton className="rounded-lg">
                    <div className="h-40 rounded-lg bg-default-300" />
                  </Skeleton>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Edit data tanaman petani"
        title="Edit Data Tanaman | SI-KETAN"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Data Tanaman", to: "/dashboard-admin/data-tanaman" },
          { label: "Edit Data" },
        ]}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg">
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
                Edit Data Tanaman
              </h1>
              <p className="text-gray-600">
                Perbarui informasi data tanaman petani
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informasi Petani */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Informasi Petani
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Current Petani Info */}
                  {selectedPetani && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Petani Saat Ini:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-blue-800">
                            Nama:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {selectedPetani.nama}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">
                            NIK:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {selectedPetani.nik}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">
                            Alamat:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {selectedPetani.alamat}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-800">
                            Desa:
                          </span>
                          <span className="ml-2 text-blue-700">
                            {selectedPetani.desa}, {selectedPetani.kecamatan}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
              {/* Informasi Lahan */}
              <Card shadow="sm">
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
              <Card shadow="sm">
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
                    errorMessage={errors.komoditas}
                    isInvalid={!!errors.komoditas}
                    label="Komoditas"
                    placeholder="Masukkan nama komoditas"
                    value={formData.komoditas}
                    onValueChange={(value) =>
                      handleInputChange("komoditas", value)
                    }
                  />
                </CardBody>
              </Card>

              {/* Periode Tanam */}
              <Card shadow="sm">
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
              <Card shadow="sm">
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
                      value={(formData.prakiraanLuasPanen || 0).toString()}
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
                      value={(formData.prakiraanProduksiPanen || 0).toString()}
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
              {/* Status Card */}
              <Card
                className="bg-gradient-to-br from-amber-50 to-orange-50"
                shadow="sm"
              >
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-amber-900">
                    Status Edit
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">Status:</span>
                      <Chip
                        color={hasChanges ? "warning" : "success"}
                        size="sm"
                        variant="flat"
                      >
                        {hasChanges ? "Ada Perubahan" : "Tidak Ada Perubahan"}
                      </Chip>
                    </div>
                    {tanamanData?.data && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-amber-700">
                            ID Data:
                          </span>
                          <span className="text-sm font-medium">
                            #{tanamanData.data.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-amber-700">
                            Dibuat:
                          </span>
                          <span className="text-sm font-medium">
                            {new Date(
                              tanamanData.data.createdAt,
                            ).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardBody>
              </Card>

              {/* Info Card */}
              <Card shadow="sm">
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Informasi
                  </h3>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Perubahan akan tersimpan setelah Anda klik tombol
                        &quot;Simpan Perubahan&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Pastikan semua data yang diubah sudah benar
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Action Buttons */}
              <Card shadow="sm">
                <CardBody className="space-y-3">
                  <Button
                    className="w-full"
                    color="warning"
                    isDisabled={!hasChanges}
                    isLoading={updateMutation.isPending}
                    size="lg"
                    startContent={
                      !updateMutation.isPending && (
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
                    {updateMutation.isPending
                      ? "Menyimpan..."
                      : "Simpan Perubahan"}
                  </Button>

                  <Button
                    className="w-full"
                    isDisabled={updateMutation.isPending}
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
