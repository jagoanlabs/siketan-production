// pages/DetailInformasiPenyuluh.tsx
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "@heroui/tooltip";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "primereact/skeleton";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Badge } from "primereact/badge";

import { usePenyuluhDetail } from "@/hook/dashboard/infoPenyuluh/useEditPenyuluh";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
export const DetailInformasiPenyuluh = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: penyuluhDetail, isLoading, error } = usePenyuluhDetail(id!);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen py-6 container mx-auto max-w-6xl">
        <PageMeta
          description="Detail informasi penyuluh"
          title="Detail Informasi Penyuluh | Sistem Manajemen Pertanian"
        />
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            {
              label: "Informasi Penyuluh",
              to: "/dashboard-admin/daftar-penyuluh",
            },
            { label: "Detail Informasi Penyuluh" },
          ]}
        />

        <div className="container mx-auto px-4 mt-6 space-y-6">
          {/* Header Skeleton */}
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardBody className="p-6 space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </CardBody>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardBody className="p-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !penyuluhDetail) {
    return (
      <div className="min-h-screen py-6">
        <PageMeta
          description="Detail informasi penyuluh"
          title="Detail Informasi Penyuluh | Sistem Manajemen Pertanian"
        />
        <PageBreadcrumb
          items={[
            { label: "Dashboard", to: "/dashboard-admin" },
            { label: "Informasi Penyuluh", to: "/daftar-penyuluh" },
            { label: "Detail Informasi Penyuluh" },
          ]}
        />

        <div className="flex justify-center items-center min-h-96">
          <Card className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-600 mb-4">
                Penyuluh dengan ID {id} tidak ditemukan.
              </p>
              <Button
                color="primary"
                onPress={() => navigate("/daftar-penyuluh")}
              >
                Kembali ke Daftar Penyuluh
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 container mx-auto max-w-6xl">
      <PageMeta
        description={`Detail informasi penyuluh ${penyuluhDetail.nama}`}
        title={`Detail Penyuluh | Sistem Manajemen Pertanian`}
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Informasi Penyuluh", to: "/dashboard-admin/data-penyuluh" },
          { label: "Detail Penyuluh" },
        ]}
      />

      <div className="container mx-auto px-4 mt-6 space-y-6">
        {/* Header Profile Card */}
        <Card className="shadow-lg">
          <CardBody className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar
                  className="w-24 h-24 text-large ring-4 ring-white shadow-lg"
                  name={penyuluhDetail.nama}
                  src={penyuluhDetail.foto}
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {penyuluhDetail.nama}
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Penyuluh Pertanian{" "}
                    {penyuluhDetail.tipe === "reguler" ? "Reguler" : "Swadaya"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <Chip color="primary" size="sm" variant="flat">
                    NIP: {penyuluhDetail.nik}
                  </Chip>
                  <Chip color="secondary" size="sm" variant="flat">
                    {penyuluhDetail.deletedAt ? "Nonaktif" : "Aktif"}
                  </Chip>
                  <Chip color="success" size="sm" variant="flat">
                    {penyuluhDetail.tipe === "reguler" ? "Reguler" : "Swadaya"}
                  </Chip>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    {penyuluhDetail.email || "Email tidak tersedia"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    {penyuluhDetail.noTelp}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Tooltip content="Edit informasi penyuluh">
                  <Button
                    color="primary"
                    startContent={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    }
                    variant="solid"
                    onPress={() => navigate(`/daftar-penyuluh/${id}/edit`)}
                  >
                    Edit
                  </Button>
                </Tooltip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="shadow-md p-5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold">Informasi Personal</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">NIP</p>
                    <p className="text-gray-800 font-medium">
                      {penyuluhDetail.nik}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nama Lengkap
                    </p>
                    <p className="text-gray-800 font-medium">
                      {penyuluhDetail.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">
                      {penyuluhDetail.email || "Tidak tersedia"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      No. Telepon
                    </p>
                    <p className="text-gray-800 font-medium">
                      {penyuluhDetail.noTelp}
                    </p>
                  </div>
                </div>

                <Divider className="my-4" />

                <div>
                  <p className="text-sm font-medium text-gray-500">Alamat</p>
                  <p className="text-gray-800 mt-1">
                    {penyuluhDetail.alamat || "Alamat tidak tersedia"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nama Produk
                  </p>
                  <p className="text-gray-800 mt-1">
                    {penyuluhDetail?.namaProduct !== "null"
                      ? penyuluhDetail?.namaProduct
                      : "Belum ada produk"}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Kelompok Binaan */}
            <Card className="shadow-md p-5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold">Kelompok Binaan</h2>
                  {penyuluhDetail.kelompoks?.length > 0 && (
                    <Badge
                      color="secondary"
                      content={penyuluhDetail.kelompoks.length}
                    />
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {penyuluhDetail.kelompoks?.length > 0 ? (
                  <div className="space-y-3">
                    {penyuluhDetail.kelompoks.map((kelompok: any) => (
                      <Card key={kelompok.id} className="bg-gray-50">
                        <CardBody className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {kelompok.namaKelompok}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Gapoktan: {kelompok.gapoktan}
                              </p>
                              <p className="text-sm text-gray-500">
                                {kelompok.desa}, {kelompok.kecamatan}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <p>Belum ada kelompok binaan</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-md p-5">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold">Statistik</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {penyuluhDetail.kecamatanBinaanData?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Kecamatan Binaan</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {penyuluhDetail.desaBinaanData?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Desa Binaan</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {penyuluhDetail.kelompoks?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Kelompok Binaan</div>
                </div>
              </CardBody>
            </Card>

            {/* Location Information */}
            <Card className="shadow-md p-5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold">Informasi Wilayah</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Kecamatan
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip color="primary" size="sm" variant="flat">
                        {penyuluhDetail.kecamatan || "Tidak tersedia"}
                      </Chip>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Desa</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip color="secondary" size="sm" variant="flat">
                        {penyuluhDetail.desa || "Tidak tersedia"}
                      </Chip>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Assignment Areas */}
            <Card className="shadow-md p-5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <h2 className="text-lg font-semibold">Wilayah Binaan</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2 block">
                    Kecamatan Binaan
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {penyuluhDetail.kecamatanBinaanData?.map((item: any) => (
                      <Chip
                        key={item.id}
                        className="cursor-default"
                        color="warning"
                        size="sm"
                        variant="flat"
                      >
                        {item.kecamatan.nama}
                      </Chip>
                    )) || (
                      <span className="text-gray-500 text-sm">
                        Belum ada kecamatan binaan
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2 block">
                    Desa Binaan
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {penyuluhDetail.desaBinaanData?.map((item: any) => (
                      <Chip
                        key={item.id}
                        className="cursor-default"
                        color="success"
                        size="sm"
                        variant="flat"
                      >
                        {item.desa.nama}
                        <span className="text-xs ml-1">
                          ({item.desa.kecamatan?.nama})
                        </span>
                      </Chip>
                    )) || (
                      <span className="text-gray-500 text-sm">
                        Belum ada desa binaan
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
