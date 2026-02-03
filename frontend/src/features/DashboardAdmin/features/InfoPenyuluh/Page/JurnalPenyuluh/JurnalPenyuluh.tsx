// pages/JurnalKegiatan.tsx
import { Avatar } from "@heroui/avatar";
import { Button, ButtonGroup } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { confirmDialog } from "primereact/confirmdialog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/spinner";

import { JurnalCard } from "../../Components/JurnalCard";

import { Jurnal } from "@/types/Jurnal/jurnal";
import PageMeta from "@/layouts/PageMeta";
import { useDeleteJurnal, useJurnal } from "@/hook/dashboard/jurnal/useJurnal";
import PageBreadcrumb from "@/components/Breadcrumb";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
export default function JurnalKegiatan() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedJurnal, setSelectedJurnal] = useState<Jurnal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const deleteJurnalMutation = useDeleteJurnal();

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API queries
  const {
    data: jurnalData,
    isLoading,
    error,
    refetch,
  } = useJurnal({
    page: currentPage,
    search: debouncedSearchTerm,
  });

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedStatus("all");
    setCurrentPage(1);
  };

  const handleCreateNew = () => {
    navigate("/dashboard-admin/jurnal-penyuluh/create");
  };

  const handleReadMore = (jurnal: Jurnal) => {
    setSelectedJurnal(jurnal);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (jurnal: Jurnal) => {
    navigate(`/dashboard-admin/jurnal-penyuluh/${jurnal.id}/edit`);
  };

  const handleDelete = (jurnal: Jurnal) => {
    confirmDialog({
      message: `Apakah Anda yakin ingin menghapus jurnal "${jurnal.judul}"?`,
      header: "Konfirmasi Hapus",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      rejectLabel: "Batal",
      acceptLabel: "Hapus",
      accept: async () => {
        try {
          await deleteJurnalMutation.mutateAsync(jurnal.id);
        } catch (error) {
          // Error is already handled in the mutation's onError callback
          console.error("Error deleting jurnal:", error);
        }
      },
    });
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "public":
      case "terbit":
        return "success";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  // Data processing
  const jurnalList = jurnalData?.newData || [];
  const filteredJurnalList =
    selectedStatus === "all"
      ? jurnalList
      : jurnalList.filter(
          (jurnal) =>
            jurnal.statusJurnal.toLowerCase() === selectedStatus.toLowerCase(),
        );

  const isEmpty = !isLoading && filteredJurnalList.length === 0;
  const hasError = error && !isLoading;

  // Stats
  const totalJurnal = jurnalList.length;
  const statusStats = jurnalList.reduce(
    (acc, jurnal) => {
      const status = jurnal.statusJurnal || "draft";

      acc[status] = (acc[status] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>,
  );

  const STATUS_OPTIONS = [
    { label: "Semua Status", value: "all" },
    { label: "Terbit", value: "terbit" },
    { label: "Public", value: "public" },
    { label: "Draft", value: "draft" },
  ];

  return (
    <div className="min-h-screen py-6">
      <PageMeta
        description="Dashboard untuk mengelola jurnal kegiatan penyuluhan pertanian"
        title="Jurnal Kegiatan | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Jurnal Kegiatan" },
        ]}
      />

      <div className="container mx-auto px-4 w-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Jurnal Kegiatan
                </h1>
                <p className="text-gray-600">
                  Kelola dokumentasi kegiatan penyuluhan pertanian
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <PermissionWrapper
                permissions={[PERMISSIONS.JURNAL_PENYULUH_CREATE]}
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
                  Buat Jurnal Baru
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
                <p className="text-2xl font-bold text-green-600">
                  {totalJurnal}
                </p>
                <p className="text-sm text-gray-600">Total Jurnal</p>
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-blue-600">
                  {statusStats.terbit || statusStats.public || 0}
                </p>
                <p className="text-sm text-gray-600">Terbit</p>
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-yellow-600">
                  {statusStats.draft || 0}
                </p>
                <p className="text-sm text-gray-600">Draft</p>
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardBody className="text-center py-4">
                <p className="text-2xl font-bold text-purple-600">
                  {jurnalList.filter((j) => j.dataPenyuluh).length}
                </p>
                <p className="text-sm text-gray-600">Dari Penyuluh</p>
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
                  placeholder="Cari jurnal kegiatan..."
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
              {(searchTerm || selectedStatus !== "all") && (
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
            {(selectedStatus !== "all" || searchTerm) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {selectedStatus !== "all" && (
                  <Chip
                    color="primary"
                    size="sm"
                    variant="flat"
                    onClose={() => handleStatusChange("all")}
                  >
                    {
                      STATUS_OPTIONS.find((s) => s.value === selectedStatus)
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
                <p className="text-gray-600 mt-4">Memuat jurnal kegiatan...</p>
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
                  Gagal memuat data jurnal
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <p className="text-xl font-medium text-gray-600 mb-2">
                  {searchTerm || selectedStatus !== "all"
                    ? "Tidak ada hasil yang ditemukan"
                    : "Belum ada jurnal"}
                </p>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedStatus !== "all"
                    ? "Coba ubah kata kunci atau filter pencarian Anda"
                    : "Mulai dengan membuat jurnal kegiatan pertama Anda"}
                </p>
                {!searchTerm && selectedStatus === "all" && (
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
                    Buat Jurnal Pertama
                  </Button>
                )}
              </CardBody>
            </Card>
          )}

          {/* Jurnal List/Grid */}
          {!isLoading && !hasError && filteredJurnalList.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredJurnalList.map((jurnal) => (
                <JurnalCard
                  key={jurnal.id}
                  jurnal={jurnal}
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
                        selectedJurnal
                          ? getStatusColor(selectedJurnal.statusJurnal)
                          : "default"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {selectedJurnal?.statusJurnal?.toUpperCase() || "DRAFT"}
                    </Chip>
                    <span className="text-sm text-gray-500">
                      {selectedJurnal &&
                        formatDate(selectedJurnal.tanggalDibuat)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{selectedJurnal?.judul}</h2>
                </ModalHeader>

                <ModalBody>
                  {selectedJurnal && (
                    <div className="space-y-4">
                      {/* Featured Image */}
                      {selectedJurnal.gambar && (
                        <div className="w-full flex-shrink-0">
                          <img
                            alt={selectedJurnal.judul}
                            className="w-full h-64 object-cover rounded-lg"
                            src={selectedJurnal.gambar}
                          />
                        </div>
                      )}

                      {/* Author Info */}
                      <div className="flex items-center gap-3 py-3 border-y border-gray-200">
                        <Avatar
                          className="bg-primary-100 text-primary-600"
                          name={
                            selectedJurnal.dataPenyuluh?.nama ||
                            selectedJurnal.pengubah ||
                            "Admin"
                          }
                          src={selectedJurnal.dataPenyuluh?.foto ?? ""}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedJurnal.dataPenyuluh?.nama ||
                              selectedJurnal.pengubah ||
                              "Admin"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedJurnal.dataPenyuluh?.kecamatan ||
                              "Admin System"}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedJurnal.uraian,
                        }}
                        className="prose prose-sm max-w-none"
                      />
                    </div>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Tutup
                  </Button>
                  {selectedJurnal && (
                    <div className="flex gap-2">
                      <PermissionWrapper
                        permissions={[PERMISSIONS.JURNAL_PENYULUH_EDIT]}
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
                            handleEdit(selectedJurnal);
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
}
