import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@heroui/tooltip";
import { FaPlus, FaFileExcel, FaRegTrashAlt } from "react-icons/fa";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { ColumnConfig, PaginationInfo, SelectionAction } from "@/types/table";
import { axiosClient } from "@/service/app-service";
import { deleteTanaman } from "@/service/DashboardAdmin/tanaman/tanaman-service";
import { useImportDataTanaman } from "@/hook/dashboard/dataPetani/useDataPetani";
import { LoadingModal } from "@/components/LoadingModal";
import { exportAllDataToExcel } from "@/service/DashboardAdmin/tanaman/excel-export-service";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import PermissionWrapper from "@/components/PermissionWrapper";

// Types
interface DataTanaman {
  id: number;
  kategori: string;
  jenis: string;
  komoditas: string;
  luasLahan: number;
  statusKepemilikanLahan: string;
  periodeMusimTanam: string;
  periodeBulanTanam: string;
  prakiraanBulanPanen: string;
  prakiraanLuasPanen: number;
  prakiraanProduksiPanen: number;
  dataPetani?: {
    nama: string;
    nik: string;
    alamat: string;
    desa: string;
    kecamatan: string;
    no_wa?: string;
    foto?: string;
    desaData?: { nama: string };
    kecamatanData?: { nama: string };
  };
}

interface TanamanResponse {
  data: DataTanaman[];
  total: number;
  from: number;
  to: number;
  currentPages: number;
  maxPages: number;
}

// Hook untuk bulk delete dengan existing deleteTanaman function
const useBulkDeleteTanaman = (isBulkAction: boolean) => {
  return {
    mutateAsync: async (id: number) => {
      await deleteTanaman(id, isBulkAction);
    },
    isPending: false,
  };
};

export const DataTanamanPage = () => {
  // Navigation
  const navigate = useNavigate();

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Selection state for bulk actions
  const [selectedItems, setSelectedItems] = useState<DataTanaman[]>([]);

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Modal state
  const [selectedTanaman, setSelectedTanaman] = useState<DataTanaman | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mutations
  const importMutation = useImportDataTanaman();
  const deleteMutation = useBulkDeleteTanaman(false); // Individual delete
  const bulkDeleteMutation = useBulkDeleteTanaman(true); // Bulk delete

  // Fetch data tanaman using TanStack Query
  const { data, isLoading, error, refetch } = useQuery<TanamanResponse>({
    queryKey: ["dataTanaman", currentPage, itemsPerPage, debouncedSearchTerm],
    queryFn: async () => {
      const response = await axiosClient.get("/list-tanaman", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearchTerm || undefined,
        },
      });

      return response.data;
    },
    staleTime: 30000,
    gcTime: 300000,
  });

  // Define bulk actions
  const selectionActions: SelectionAction[] = [
    {
      label: "Hapus Data",
      icon: <FaRegTrashAlt size={16} />,
      variant: "danger",
      permission: PERMISSIONS.TANAMAN_PETANI_DELETE,
      onClick: async (selectedItems: DataTanaman[]) => {
        try {
          const itemIds = selectedItems.map((item) => item.id);

          // Show loading modal
          setShowLoadingModal(true);
          setLoadingMessage("Menghapus data tanaman");
          setLoadingProgress(0);

          let successCount = 0;
          let failedCount = 0;
          const failedItems: string[] = [];

          // Sequential deletion with progress tracking
          for (let i = 0; i < itemIds.length; i++) {
            const itemId = itemIds[i];
            const currentItem = selectedItems.find(
              (item) => item.id === itemId,
            );

            // Update progress message
            setLoadingMessage(`Menghapus: ${currentItem?.komoditas || itemId}`);

            try {
              await bulkDeleteMutation.mutateAsync(itemId);
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedItems.push(currentItem?.komoditas || `ID: ${itemId}`);
              console.error(`Failed to delete item ${itemId}:`, error);
            }

            // Update progress
            const progress = Math.round(((i + 1) / itemIds.length) * 100);

            setLoadingProgress(progress);
          }

          // Hide loading modal
          setShowLoadingModal(false);

          // Show results
          if (failedCount === 0) {
            toast.success(`${successCount} data berhasil dihapus`);
          } else if (successCount === 0) {
            toast.error(`Gagal menghapus semua data (${failedCount} data)`);
          } else {
            toast.warning(
              `${successCount} data berhasil dihapus, ${failedCount} data gagal dihapus`,
              {
                description:
                  failedItems.length > 0
                    ? `Data yang gagal: ${failedItems.slice(0, 3).join(", ")}${failedItems.length > 3 ? "..." : ""}`
                    : undefined,
                duration: 5000,
              },
            );
          }

          // Clear selection and refetch data
          setSelectedItems([]);
          await refetch();
        } catch (error) {
          setShowLoadingModal(false);
          toast.error("Terjadi kesalahan saat menghapus data");
          console.error("Bulk delete error:", error);
        }
      },
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} data tanaman yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
    },
  ];

  // Table columns definition
  const columns: ColumnConfig<DataTanaman>[] = [
    {
      key: "index",
      title: "No",
      align: "center",
      width: "60px",
      render: (_, index, paginationInfo) => {
        if (paginationInfo) {
          return paginationInfo.from + index;
        }

        return index + 1;
      },
    },
    {
      key: "kategori",
      title: "Kategori Tanaman",
      sortable: true,
      render: (item) => (
        <Chip color="primary" size="sm" variant="flat">
          {item.kategori}
        </Chip>
      ),
    },
    {
      key: "komoditas",
      title: "Jenis Komoditas",
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-sm">{item.komoditas}</div>
        </div>
      ),
    },
    {
      key: "statusKepemilikanLahan",
      title: "Status Kepemilikan",
      render: (item) => (
        <Chip
          color={
            item.statusKepemilikanLahan === "MILIK SENDIRI"
              ? "success"
              : "warning"
          }
          size="sm"
          variant="flat"
        >
          {item.statusKepemilikanLahan}
        </Chip>
      ),
    },
    {
      key: "luasLahan",
      title: "Luas Lahan",
      align: "right",
      render: (item) => `${item.luasLahan} m²`,
    },
    {
      key: "prakiraanBulanPanen",
      title: "Prakiraan Panen",
      render: (item) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {item.prakiraanBulanPanen}
        </span>
      ),
    },
    {
      key: "dataPetani",
      title: "Petani",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.dataPetani && (
            <>
              <div className="font-medium text-sm">{item.dataPetani.nama}</div>
            </>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      align: "center",
      width: "150px",
      render: (item) => (
        <div className="flex justify-center gap-1">
          <PermissionWrapper
            permissions={[
              PERMISSIONS.TANAMAN_PETANI_INDEX,
              PERMISSIONS.TANAMAN_PETANI_DETAIL,
            ]}
          >
            <Tooltip content="Lihat Detail">
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="light"
                onPress={() => handleViewDetail(item)}
              >
                <FiEye className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permissions={[PERMISSIONS.TANAMAN_PETANI_EDIT]}>
            <Tooltip content="Edit Data">
              <Button
                isIconOnly
                color="warning"
                size="sm"
                variant="light"
                onPress={() => handleEdit(item)}
              >
                <FiEdit2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permissions={[PERMISSIONS.TANAMAN_PETANI_DELETE]}>
            <Tooltip content="Hapus Data">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => handleDelete(item)}
              >
                <FaRegTrashAlt className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>
        </div>
      ),
    },
  ];

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedItems([]); // Clear selection when page changes
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setDebouncedSearchTerm(value);
    setCurrentPage(1);
    setSelectedItems([]); // Clear selection when search changes
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
    setSelectedItems([]);
  };

  // Action handlers
  const handleViewDetail = (item: DataTanaman) => {
    setSelectedTanaman(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: DataTanaman) => {
    navigate(`/dashboard-admin/data-tanaman/edit/${item.id}`);
  };

  const handleCreate = () => {
    navigate("/dashboard-admin/data-tanaman/create");
  };

  const handleDownload = () => {
    exportAllDataToExcel();
  };

  const handleDelete = (item: DataTanaman) => {
    confirmDialog({
      message: (
        <div className="space-y-3">
          <p>Apakah Anda yakin ingin menghapus data tanaman ini?</p>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {item.kategori}
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>Komoditas:</strong> {item.komoditas}
                  </p>
                  <p>
                    <strong>Status Kepemilikan Lahan:</strong>{" "}
                    {item.statusKepemilikanLahan}
                  </p>
                  <p>
                    <strong>Prakiraan Panen:</strong> {item.prakiraanBulanPanen}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-red-800 text-sm font-medium mb-1">
              ⚠️ Peringatan
            </p>
            <p className="text-red-700 text-xs">
              Data yang dihapus tidak dapat dipulihkan kembali. Pastikan Anda
              benar-benar ingin menghapus data ini.
            </p>
          </div>
        </div>
      ),
      header: "Konfirmasi Hapus Data",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      accept: async () => {
        try {
          await deleteMutation.mutateAsync(item.id);
          await refetch();
        } catch (error) {
          toast.error("Gagal menghapus data tanaman");
        }
      },
      reject: () => {},
    });
  };

  const handleUploadExcel = () => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".xlsx, .xls";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];

        if (!allowedTypes.includes(file.type)) {
          toast.error("File harus berformat .xlsx atau .xls");

          return;
        }

        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
          toast.error("Ukuran file maksimal 10MB");

          return;
        }

        setShowLoadingModal(true);
        setLoadingMessage(`Mengupload file ${file.name}...`);

        try {
          await importMutation.mutateAsync(file);
          await refetch();
        } finally {
          setShowLoadingModal(false);
        }
      }
    };
    input.click();
  };

  // Prepare data and pagination info
  const tableData = data?.data || [];
  const paginationInfo: PaginationInfo = data
    ? {
        total: data.total,
        currentPages: data.currentPages,
        maxPages: data.maxPages,
        from: data.from,
        to: data.to,
      }
    : {
        total: 0,
        currentPages: 1,
        maxPages: 1,
        from: 1,
        to: 0,
      };

  // Header actions with selection counter
  const headerActions = (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Show selected count when items are selected */}
      {selectedItems.length > 0 && (
        <div className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
          {selectedItems.length} item dipilih
        </div>
      )}
      <PermissionWrapper permission={PERMISSIONS.TANAMAN_PETANI_CREATE}>
        <Tooltip content="Tambah Data Tanaman">
          <Button
            color="primary"
            startContent={<FaPlus className="w-4 h-4" />}
            onPress={handleCreate}
          >
            <span className="hidden sm:inline">Tambah Data</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permission={PERMISSIONS.TANAMAN_PETANI_IMPORT}>
        <Tooltip content="Upload File Excel">
          <Button
            className="bg-orange-500 text-white"
            color="success"
            startContent={<FaFileExcel className="w-4 h-4" />}
            onPress={handleUploadExcel}
          >
            <span className="hidden sm:inline">Upload Excel</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permission={PERMISSIONS.TANAMAN_PETANI_EXPORT}>
        <Tooltip content="Download Data Excel">
          <Button
            className="bg-green-500 text-white"
            color="success"
            startContent={<FaFileExcel className="w-4 h-4" />}
            onPress={handleDownload}
          >
            <span className="hidden sm:inline">Download Excel</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>
    </div>
  );

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Halaman pengelolaan data tanaman petani"
        title="Data Tanaman Petani | SI-KETAN"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Data Tanaman" },
        ]}
      />

      {/* Loading Modal */}
      <LoadingModal
        isOpen={showLoadingModal}
        message={loadingMessage}
        progress={loadingProgress}
        showProgress={true}
        type="processing"
      />

      {/* Enhanced ReusableTable with Bulk Actions */}
      <ReusableTable
        className=""
        columns={columns}
        currentPage={currentPage}
        data={tableData}
        error={error}

        // Search props
        debouncedSearchTerm={debouncedSearchTerm}
        emptyStateMessage="Tidak ada data tanaman yang ditemukan"
        enableMultiSelect={true}
        getItemId={(item) => item.id}
        searchPlaceholder="Cari kategori, komoditas, atau nama petani..."

        // Pagination
        headerActions={headerActions}
        loading={isLoading}
        onPageChange={handlePageChange}

        // Multiple Selection
        paginationInfo={paginationInfo}
        searchTerm={searchTerm}
        selectedItems={selectedItems}
        subtitle="Kelola data tanaman petani"
        selectionActions={selectionActions}

        // Styling & Behavior
        title="Data Tanaman Petani"
        onClearSearch={handleClearSearch}
        onSearchChange={handleSearchChange}
        onSelectionChange={setSelectedItems}
      />

      {/* Detail Modal - Keep existing modal */}
      <Modal
        className="max-h-[90vh]"
        isOpen={isDetailModalOpen}
        scrollBehavior="inside"
        size="3xl"
        onOpenChange={setIsDetailModalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-2">
                  <Chip
                    color={
                      selectedTanaman?.statusKepemilikanLahan ===
                      "MILIK SENDIRI"
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                    variant="flat"
                  >
                    {selectedTanaman?.statusKepemilikanLahan}
                  </Chip>
                  <Chip color="primary" size="sm" variant="flat">
                    {selectedTanaman?.kategori}
                  </Chip>
                </div>
                <h2 className="text-xl font-bold">
                  {selectedTanaman?.komoditas}
                </h2>
              </ModalHeader>

              <ModalBody>
                {selectedTanaman && (
                  <div className="space-y-6">
                    {/* Tanaman Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4" shadow="sm">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Informasi Tanaman
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Kategori:</span>
                            <span className="font-medium">
                              {selectedTanaman.kategori}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Jenis:</span>
                            <span className="font-medium">
                              {selectedTanaman.jenis}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Komoditas:</span>
                            <span className="font-medium">
                              {selectedTanaman.komoditas}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Luas Lahan:</span>
                            <span className="font-medium">
                              {selectedTanaman.luasLahan} m²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Status Kepemilikan:
                            </span>
                            <Chip
                              color={
                                selectedTanaman.statusKepemilikanLahan ===
                                "MILIK SENDIRI"
                                  ? "success"
                                  : "warning"
                              }
                              size="sm"
                              variant="flat"
                            >
                              {selectedTanaman.statusKepemilikanLahan}
                            </Chip>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4" shadow="sm">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Periode Tanam & Panen
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Periode Musim:
                            </span>
                            <span className="font-medium">
                              {selectedTanaman.periodeMusimTanam}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bulan Tanam:</span>
                            <span className="font-medium">
                              {selectedTanaman.periodeBulanTanam}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bulan Panen:</span>
                            <span className="font-medium text-green-600">
                              {selectedTanaman.prakiraanBulanPanen}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Luas Panen:</span>
                            <span className="font-medium">
                              {selectedTanaman.prakiraanLuasPanen.toLocaleString(
                                "id-ID",
                              )}{" "}
                              m²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Produksi Panen:
                            </span>
                            <span className="font-medium text-green-600">
                              {selectedTanaman.prakiraanProduksiPanen.toLocaleString(
                                "id-ID",
                              )}{" "}
                              kg
                            </span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Petani Info */}
                    {selectedTanaman.dataPetani && (
                      <Card className="p-4" shadow="sm">
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Informasi Petani
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="bg-primary-100 text-primary-600"
                              name={selectedTanaman.dataPetani.nama}
                              src={selectedTanaman.dataPetani.foto || undefined}
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {selectedTanaman.dataPetani.nama}
                              </p>
                              <p className="text-xs text-gray-500">
                                NIK: {selectedTanaman.dataPetani.nik}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Alamat:</span>
                              <span className="font-medium">
                                {selectedTanaman.dataPetani.alamat}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Desa:</span>
                              <span className="font-medium">
                                {selectedTanaman.dataPetani.desaData?.nama ||
                                  selectedTanaman.dataPetani.desa}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kecamatan:</span>
                              <span className="font-medium">
                                {selectedTanaman.dataPetani.kecamatanData
                                  ?.nama ||
                                  selectedTanaman.dataPetani.kecamatan}
                              </span>
                            </div>
                            {selectedTanaman.dataPetani.no_wa && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  No. WhatsApp:
                                </span>
                                <span className="font-medium">
                                  {selectedTanaman.dataPetani.no_wa}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tutup
                </Button>
                {selectedTanaman && (
                  <PermissionWrapper
                    permissions={[PERMISSIONS.TANAMAN_PETANI_EDIT]}
                  >
                    <Button
                      color="primary"
                      startContent={<FiEdit2 className="w-4 h-4" />}
                      variant="flat"
                      onPress={() => {
                        onClose();
                        handleEdit(selectedTanaman);
                      }}
                    >
                      Edit Data
                    </Button>
                  </PermissionWrapper>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
