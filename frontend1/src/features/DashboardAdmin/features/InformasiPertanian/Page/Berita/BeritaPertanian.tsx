// pages/BeritaPertanian.tsx
import { useState } from "react";

// Import hooks and types
import { Spinner } from "@heroui/spinner";
import { Button, ButtonGroup } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";

import { BeritaCard } from "../../Components/BeritaCard";
import useBeritaState from "../../hook/useBeritaState";

import {
  BeritaData,
  KATEGORI_OPTIONS,
  formatDate,
  getKategoriColor,
} from "@/types/InfoPertanian/berita.d";
import {
  useBeritaData,
  useDeleteBerita,
} from "@/hook/dashboard/infoPertanian/useBerita";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { assets } from "@/assets/assets";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

export const BeritaPertanian = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    selectedKategori,
    viewMode,
    queryParams,
    handleSearchChange,
    clearSearch,
    handleKategoriChange,
    resetFilters,
    setViewMode,
  } = useBeritaState();

  // API Hook
  const {
    data: beritaResponse,
    isLoading,
    error,
    refetch,
  } = useBeritaData(queryParams);

  // Delete hook
  const deleteBeritaMutation = useDeleteBerita();

  // Modal states
  const [selectedBerita, setSelectedBerita] = useState<BeritaData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Handlers
  const handleReadMore = (berita: BeritaData) => {
    setSelectedBerita(berita);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (berita: BeritaData) => {
    navigate(`/dashboard-admin/berita-pertanian/edit/${berita.id}`);
  };

  const handleDelete = (berita: BeritaData) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus berita "${berita.judul}"?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteBeritaMutation.mutateAsync(berita.id);
        } catch (error) {
          // Error is already handled in the mutation
        }
      },
      reject: () => {
        // User cancelled, do nothing
      },
    });
  };

  const handleCreateNew = () => {
    navigate("/dashboard-admin/berita-pertanian/create");
  };

  // Data
  const beritaList = beritaResponse?.infotani || [];
  const isEmpty = !isLoading && beritaList.length === 0;
  const hasError = error && !isLoading;

  // Stats
  const totalBerita = beritaList.length;
  const kategoriStats = beritaList.reduce(
    (acc, berita) => {
      acc[berita.kategori] = (acc[berita.kategori] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola berita, tips, dan artikel pertanian"
        title="Berita Pertanian | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Berita Pertanian" },
        ]}
      />

      <div className="container mx-auto px-4 w-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Berita Pertanian
                </h1>
                <p className="text-gray-600">
                  Kelola informasi, tips, dan artikel pertanian
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <PermissionWrapper
                permissions={[PERMISSIONS.BERITA_PETANI_CREATE]}
              >
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
                        d="M12 4v16m8-8H4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  variant="solid"
                  onPress={handleCreateNew}
                >
                  Buat Berita Baru
                </Button>
              </PermissionWrapper>

              <Button
                isIconOnly
                isDisabled={isLoading}
                variant="bordered"
                onPress={() => refetch()}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-blue-600">
                  {totalBerita}
                </p>
                <p className="text-sm text-gray-600">Total Berita</p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-green-600">
                  {kategoriStats.tips || 0}
                </p>
                <p className="text-sm text-gray-600">Tips</p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-primary-600">
                  {kategoriStats.berita || 0}
                </p>
                <p className="text-sm text-gray-600">Berita</p>
              </CardBody>
            </Card>

            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-secondary-600">
                  {kategoriStats.artikel || 0}
                </p>
                <p className="text-sm text-gray-600">Artikel</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6" shadow="sm">
          <CardBody className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search */}
              <div className="flex-1">
                <Input
                  className="max-w-md"
                  endContent={
                    searchTerm && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={clearSearch}
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
                    )
                  }
                  placeholder="Cari berita, tips, atau artikel..."
                  startContent={
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  value={searchTerm}
                  onValueChange={handleSearchChange}
                />
              </div>

              {/* View Mode Toggle */}
              <ButtonGroup size="sm">
                <Button
                  isIconOnly
                  variant={viewMode === "grid" ? "solid" : "bordered"}
                  onPress={() => setViewMode("grid")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>
                <Button
                  isIconOnly
                  variant={viewMode === "list" ? "solid" : "bordered"}
                  onPress={() => setViewMode("list")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Button>
              </ButtonGroup>

              {/* Reset Filters */}
              {(searchTerm || selectedKategori !== "all") && (
                <Button
                  color="danger"
                  size="sm"
                  startContent={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                  variant="light"
                  onPress={resetFilters}
                >
                  Reset
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(selectedKategori !== "all" || searchTerm) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {selectedKategori !== "all" && (
                  <Chip
                    color="primary"
                    size="sm"
                    variant="flat"
                    onClose={() => handleKategoriChange("all")}
                  >
                    {
                      KATEGORI_OPTIONS.find((k) => k.value === selectedKategori)
                        ?.label
                    }
                  </Chip>
                )}
                {searchTerm && (
                  <Chip
                    color="secondary"
                    size="sm"
                    variant="flat"
                    onClose={clearSearch}
                  >
                    &quot;{searchTerm}&quot;
                  </Chip>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Content Area */}
        <div className="min-h-96">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Spinner color="primary" size="lg" />
                <p className="text-gray-600 mt-4">Memuat berita...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <Card className="bg-red-50 border-red-200" shadow="sm">
              <CardBody className="text-center py-8">
                <svg
                  className="w-16 h-16 text-red-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <p className="text-red-700 font-medium mb-2">
                  Gagal memuat data berita
                </p>
                <p className="text-red-600 text-sm mb-4">
                  Terjadi kesalahan saat mengambil data. Silakan coba lagi.
                </p>
                <Button color="danger" variant="flat" onPress={() => refetch()}>
                  Coba Lagi
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Empty State */}
          {isEmpty && (
            <Card className="bg-gray-50" shadow="sm">
              <CardBody className="text-center py-20">
                <svg
                  className="w-20 h-20 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <p className="text-xl font-medium text-gray-600 mb-2">
                  {searchTerm || selectedKategori !== "all"
                    ? "Tidak ada hasil yang ditemukan"
                    : "Belum ada berita"}
                </p>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedKategori !== "all"
                    ? "Coba ubah kata kunci atau filter pencarian Anda"
                    : "Mulai dengan membuat berita, tips, atau artikel pertama Anda"}
                </p>
                {!searchTerm && selectedKategori === "all" && (
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
                          d="M12 4v16m8-8H4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    }
                    onPress={handleCreateNew}
                  >
                    Buat Berita Pertama
                  </Button>
                )}
              </CardBody>
            </Card>
          )}

          {/* Berita List/Grid */}
          {!isLoading && !hasError && beritaList.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {beritaList.map((berita) => (
                <BeritaCard
                  key={berita.id}
                  berita={berita}
                  showActions={true}
                  viewMode={viewMode}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <Modal
          className="max-h-[90vh]"
          isOpen={isDetailModalOpen}
          scrollBehavior="inside"
          size="5xl"
          onOpenChange={setIsDetailModalOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      color={
                        selectedBerita
                          ? (getKategoriColor(selectedBerita.kategori) as any)
                          : "default"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {selectedBerita?.kategori.toUpperCase()}
                    </Chip>
                    <span className="text-sm text-gray-500">
                      {selectedBerita && formatDate(selectedBerita.tanggal)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{selectedBerita?.judul}</h2>
                </ModalHeader>

                <ModalBody>
                  {selectedBerita && (
                    <div className="space-y-4">
                      {/* Featured Image */}
                      <div className="w-full flex-shrink-0 z-1">
                        <img
                          alt={selectedBerita.judul}
                          className="w-full h-64 object-cover rounded-t-lg"
                          src={
                            selectedBerita.fotoBerita || assets.imagePlaceholder
                          }
                          onError={(e) => {
                            e.currentTarget.src = assets.imagePlaceholder;
                          }}
                        />
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 py-3 border-y border-gray-200">
                        <Avatar
                          className="bg-primary-100 text-primary-600"
                          name={selectedBerita.createdBy}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedBerita.createdBy}
                          </p>
                          <p className="text-sm text-gray-500">Penulis</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        dangerouslySetInnerHTML={{ __html: selectedBerita.isi }}
                        className="prose prose-sm max-w-none"
                      />
                    </div>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Tutup
                  </Button>
                  {selectedBerita && (
                    <div className="flex gap-2">
                      <PermissionWrapper
                        permissions={[PERMISSIONS.BERITA_PETANI_EDIT]}
                      >
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
                                strokeWidth={2}
                              />
                            </svg>
                          }
                          variant="flat"
                          onPress={() => {
                            onClose();
                            handleEdit(selectedBerita);
                          }}
                        >
                          Edit
                        </Button>
                      </PermissionWrapper>
                    </div>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
