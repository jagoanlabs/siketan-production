import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import AsyncSelect from "react-select/async";
import { toast } from "sonner";

// HeroUI Components
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Tooltip } from "@heroui/tooltip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";

// Icons
import { FiEye, FiEdit2 } from "react-icons/fi";
import { FaRegTrashAlt, FaPlus, FaFileExcel } from "react-icons/fa";
import { MdVerified, MdVerifiedUser } from "react-icons/md";

import { axiosClient } from "@/service/app-service";
import PageMeta from "@/layouts/PageMeta";
import PageBreadcrumb from "@/components/Breadcrumb";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { LoadingModal } from "@/components/LoadingModal";
import { ColumnConfig, PaginationInfo, SelectionAction } from "@/types/table";
import {
  useDataPetani,
  useDeleteDataPetani,
  useUpdateVerificationStatus,
  useDataPetaniState,
  useImportDataPetani,
} from "@/hook/dashboard/dataPetani/useDataPetani";
import {
  DataPetaniItem,
  getVerificationColor,
  getVerificationLabel,
  formatPhoneNumber,
} from "@/types/DataPetani/dataPetani.d";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import PermissionWrapper from "@/components/PermissionWrapper";

// Hook untuk bulk operations
const useBulkDeletePetani = (isBulkAction: boolean) => {
  const deleteMutation = useDeleteDataPetani();

  return {
    mutateAsync: async (id: number) => {
      await deleteMutation.mutateAsync(id);
      if (isBulkAction == false) {
        // Individual delete akan show toast dari hook asli
        toast.success("Data petani berhasil dihapus");
      }
    },
    isPending: deleteMutation.isPending,
  };
};

const useBulkVerificationPetani = (isBulkAction: boolean = false) => {
  const verificationMutation = useUpdateVerificationStatus();

  return {
    mutateAsync: async ({
      accountId,
      isVerified,
    }: {
      accountId: number;
      isVerified: boolean;
    }) => {
      await verificationMutation.mutateAsync({ accountId, isVerified });
      if (isBulkAction == false) {
        // Individual verification akan show toast dari hook asli
        toast.success("Data petani berhasil diverifikasi");
      }
    },
    isPending: verificationMutation.isPending,
  };
};

export const DataPetaniPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentPage, queryParams, clearSearch, handlePageChange } =
    useDataPetaniState();

  // API Hooks
  const {
    data: petaniResponse,
    isLoading,
    error,
    refetch,
  } = useDataPetani(queryParams);

  // Selection state for bulk actions
  const [selectedItems, setSelectedItems] = useState<DataPetaniItem[]>([]);

  // Petani Search state
  const [selectedPetaniOption, setSelectedPetaniOption] = useState<any>(null);
  const [isPetaniSearchLoading, setIsPetaniSearchLoading] = useState(false);

  // Loading modal state
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Mutations
  const importMutation = useImportDataPetani();
  const deleteDataPetaniMutation = useBulkDeletePetani(false);
  const updateVerificationMutation = useBulkVerificationPetani(false);
  const bulkDeleteMutation = useBulkDeletePetani(true);
  const bulkVerificationMutation = useBulkVerificationPetani(true);

  // Modal state
  const [selectedPetani, setSelectedPetani] = useState<DataPetaniItem | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Define bulk actions
  const selectionActions: SelectionAction[] = [
    {
      label: "Hapus Data",
      icon: <FaRegTrashAlt size={16} />,
      permission: PERMISSIONS.DATA_PETANI_DELETE,
      variant: "danger",
      onClick: async (selectedItems: DataPetaniItem[]) => {
        try {
          const itemIds = selectedItems.map((item) => item.id);

          // Show loading modal
          setShowLoadingModal(true);
          setLoadingMessage("Menghapus data petani");
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
            setLoadingMessage(`Menghapus: ${currentItem?.nama || itemId}`);

            try {
              await bulkDeleteMutation.mutateAsync(itemId);
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedItems.push(currentItem?.nama || `ID: ${itemId}`);
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
            toast.success(`${successCount} data petani berhasil dihapus`);
          } else if (successCount === 0) {
            toast.error(`Gagal menghapus semua data (${failedCount} data)`);
          } else {
            toast.warning(
              `${successCount} data berhasil dihapus, ${failedCount} data gagal dihapus`,
              {
                description:
                  failedItems.length > 0
                    ? `Data yang gagal: ${failedItems
                        .slice(0, 3)
                        .join(", ")}${failedItems.length > 3 ? "..." : ""}`
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
      confirmMessage: `Apakah Anda yakin ingin menghapus {count} data petani yang dipilih? Data yang dihapus tidak dapat dikembalikan.`,
    },
    {
      label: "Verifikasi Petani",
      icon: <MdVerifiedUser size={16} />,
      permission: PERMISSIONS.DATA_PETANI_APPROVE,
      variant: "success",
      onClick: async (selectedItems: DataPetaniItem[]) => {
        try {
          const unverifiedItems = selectedItems.filter(
            (item) => !item.tbl_akun?.isVerified,
          );

          if (unverifiedItems.length === 0) {
            toast.warning("Semua petani yang dipilih sudah terverifikasi");

            return;
          }

          // Show loading modal
          setShowLoadingModal(true);
          setLoadingMessage("Memverifikasi petani");
          setLoadingProgress(0);

          let successCount = 0;
          let failedCount = 0;
          const failedItems: string[] = [];

          // Sequential verification with progress tracking
          for (let i = 0; i < unverifiedItems.length; i++) {
            const item = unverifiedItems[i];

            // Update progress message
            setLoadingMessage(`Memverifikasi: ${item.nama}`);

            try {
              await bulkVerificationMutation.mutateAsync({
                accountId: item.tbl_akun.id,
                isVerified: true,
              });
              successCount++;
            } catch (error: any) {
              failedCount++;
              failedItems.push(item.nama);
              console.error(`Failed to verify item ${item.id}:`, error);
            }

            // Update progress
            const progress = Math.round(
              ((i + 1) / unverifiedItems.length) * 100,
            );

            setLoadingProgress(progress);
          }

          // Hide loading modal
          setShowLoadingModal(false);

          // Show results
          if (failedCount === 0) {
            toast.success(`${successCount} petani berhasil diverifikasi`);
          } else if (successCount === 0) {
            toast.error(
              `Gagal memverifikasi semua petani (${failedCount} petani)`,
            );
          } else {
            toast.warning(
              `${successCount} petani berhasil diverifikasi, ${failedCount} petani gagal diverifikasi`,
              {
                description:
                  failedItems.length > 0
                    ? `Petani yang gagal: ${failedItems
                        .slice(0, 3)
                        .join(", ")}${failedItems.length > 3 ? "..." : ""}`
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
          toast.error("Terjadi kesalahan saat memverifikasi petani");
          console.error("Bulk verification error:", error);
        }
      },
      // Only enable if there are unverified farmers
      disabled: (selectedItems: DataPetaniItem[]) =>
        !selectedItems.some((item) => !item.tbl_akun?.isVerified),
      confirmMessage: "Verifikasi {count} petani yang dipilih?",
    },
  ];

  // Petani Search functions
  const loadPetaniOptions = useCallback(async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    try {
      setIsPetaniSearchLoading(true);
      const response = await axiosClient.get(
        `/search/petani?search=${inputValue}`,
      );
      const petaniData = response.data.data;

      if (!Array.isArray(petaniData)) {
        return [];
      }

      return petaniData.map((petani: any) => ({
        value: petani.id,
        label: `${petani.nama || "Unknown"} (${petani.nik || "No NIK"})`,
        nik: petani.nik || "",
        nama: petani.nama || "Unknown",
        alamat: petani.alamat || "",
        desa: petani.desaData?.nama || petani.desa || "Unknown",
        kecamatan: petani.kecamatanData?.nama || petani.kecamatan || "Unknown",
        data: petani,
      }));
    } catch (error) {
      toast.error("Gagal memuat data petani");

      return [];
    } finally {
      setIsPetaniSearchLoading(false);
    }
  }, []);

  const handlePetaniSearchChange = useCallback((selectedOption: any) => {
    setSelectedPetaniOption(selectedOption);
    if (selectedOption?.data) {
      handleViewDetail(selectedOption.data);
    }
  }, []);

  // Handlers
  const handleViewDetail = (petani: DataPetaniItem) => {
    setSelectedPetani(petani);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (petani: DataPetaniItem) => {
    navigate(`/dashboard-admin/data-petani/edit/${petani.id}`);
  };

  const handleDelete = (petani: DataPetaniItem) => {
    confirmDialog({
      message: (
        <div className="space-y-3">
          <p>Apakah Anda yakin ingin menghapus data petani ini?</p>
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                className="bg-primary-100 text-primary-600"
                name={petani.nama}
                src={petani.foto || undefined}
              />
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {petani.nama}
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <strong>NIK:</strong> {petani.nik}
                  </p>
                  <p>
                    <strong>No. Telp:</strong>{" "}
                    {formatPhoneNumber(petani.noTelp)}
                  </p>
                  <p>
                    <strong>Alamat:</strong> {petani.alamat}
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
              Data petani yang dihapus tidak dapat dipulihkan kembali. Pastikan
              Anda benar-benar ingin menghapus data ini.
            </p>
          </div>
        </div>
      ),
      header: "Konfirmasi Hapus Data Petani",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Hapus",
      rejectLabel: "Batal",
      accept: async () => {
        await deleteDataPetaniMutation.mutateAsync(petani.id);
      },
      reject: () => {},
    });
  };

  const handleToggleVerification = (petani: DataPetaniItem) => {
    const newStatus = !petani.tbl_akun.isVerified;
    const action = newStatus ? "verifikasi" : "batalkan verifikasi";

    confirmDialog({
      message: `Apakah Anda yakin ingin ${action} data petani ${petani.nama}?`,
      header: `Konfirmasi ${newStatus ? "Verifikasi" : "Batalkan Verifikasi"}`,
      icon: "pi pi-question-circle",
      acceptLabel: newStatus ? "Verifikasi" : "Batalkan",
      rejectLabel: "Batal",
      accept: async () => {
        await updateVerificationMutation.mutateAsync({
          accountId: petani.tbl_akun.id,
          isVerified: newStatus,
        });
      },
    });
  };

  const handleCreateNew = () => {
    navigate("/dashboard-admin/data-petani/create");
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

  // Handle page and search changes
  const handlePageChangeWithClear = (page: number) => {
    handlePageChange(page);
    setSelectedItems([]); // Clear selection when page changes
  };

  const handleClearSearchWithClear = () => {
    clearSearch();
    setSelectedItems([]);
  };

  // Table columns definition
  const columns: ColumnConfig<DataPetaniItem>[] = [
    {
      key: "no",
      title: "NO",
      align: "center",
      width: "60px",
      render: (_: DataPetaniItem, index: number) => {
        const baseIndex = (currentPage - 1) * 10 + index + 1;

        return <span className="font-medium text-gray-900">{baseIndex}</span>;
      },
    },
    {
      key: "petani",
      title: "DATA PETANI",
      render: (petani: DataPetaniItem) => (
        <div className="flex items-center gap-3">
          <Avatar
            className="bg-primary-100 text-primary-600"
            name={petani.nama}
            size="sm"
            src={petani.foto || undefined}
          />
          <div>
            <div className="font-medium text-sm">{petani.nama}</div>
            <div className="text-xs text-gray-400">NIK: {petani.nik}</div>
          </div>
        </div>
      ),
    },
    {
      key: "kontak",
      title: "KONTAK",
      render: (petani: DataPetaniItem) => (
        <div>
          <div className="font-medium text-sm">
            {formatPhoneNumber(petani.noTelp)}
          </div>
          <div className="text-xs text-gray-400">{petani.email || "-"}</div>
        </div>
      ),
    },
    {
      key: "lokasi",
      title: "LOKASI",
      render: (petani: DataPetaniItem) => (
        <div>
          <div className="font-medium text-sm">
            {petani.desaData?.nama || petani.desa}
          </div>
          <div className="text-xs text-gray-400">
            {petani.kecamatanData?.nama || petani.kecamatan}
          </div>
        </div>
      ),
    },
    {
      key: "pembina",
      title: "PEMBINA",
      render: (petani: DataPetaniItem) => (
        <span className="font-medium text-gray-900 text-sm">
          {petani.dataPenyuluh?.nama || "-"}
        </span>
      ),
    },
    {
      key: "status",
      title: "STATUS",
      align: "center",
      render: (petani: DataPetaniItem) => (
        <Chip
          color={getVerificationColor(petani.tbl_akun?.isVerified || false)}
          size="sm"
          startContent={
            petani.tbl_akun?.isVerified ? (
              <MdVerified className="w-4 h-4" />
            ) : undefined
          }
          variant="flat"
        >
          {getVerificationLabel(petani.tbl_akun?.isVerified || false)}
        </Chip>
      ),
    },
    {
      key: "aksi",
      title: "AKSI",
      align: "center",
      render: (petani: DataPetaniItem) => (
        <div className="flex justify-center gap-1">
          <PermissionWrapper
            permissions={[
              PERMISSIONS.DATA_PETANI_DETAIL,
              PERMISSIONS.DATA_PETANI_INDEX,
            ]}
          >
            <Tooltip content="Lihat Detail">
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="light"
                onPress={() => handleViewDetail(petani)}
              >
                <FiEye className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permissions={[PERMISSIONS.DATA_PETANI_EDIT]}>
            <Tooltip content="Edit Data">
              <Button
                isIconOnly
                color="warning"
                size="sm"
                variant="light"
                onPress={() => handleEdit(petani)}
              >
                <FiEdit2 className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>

          {!petani.tbl_akun.isVerified && (
            <PermissionWrapper permissions={[PERMISSIONS.DATA_PETANI_APPROVE]}>
              <Tooltip content="Verifikasi">
                <Button
                  isIconOnly
                  className="text-gray-400"
                  size="sm"
                  variant="light"
                  onPress={() => handleToggleVerification(petani)}
                >
                  <MdVerified className="w-4 h-4" />
                </Button>
              </Tooltip>
            </PermissionWrapper>
          )}

          {petani.tbl_akun.isVerified && (
            <Tooltip content="Terverifikasi">
              <div className="p-2 rounded-lg">
                <MdVerified className="w-4 h-4 text-green-600" />
              </div>
            </Tooltip>
          )}

          <PermissionWrapper permissions={[PERMISSIONS.DATA_PETANI_DELETE]}>
            <Tooltip content="Hapus Data">
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => handleDelete(petani)}
              >
                <FaRegTrashAlt className="w-4 h-4" />
              </Button>
            </Tooltip>
          </PermissionWrapper>
        </div>
      ),
    },
  ];

  // Prepare data and pagination info
  const petaniList = petaniResponse?.data || [];
  const paginationInfo: PaginationInfo = petaniResponse
    ? {
        total: petaniResponse.total,
        currentPages: petaniResponse.currentPages,
        maxPages: petaniResponse.maxPages,
        from: petaniResponse.from,
        to: petaniResponse.to,
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
    <div className="flex items-center gap-2 flex-wrap">
      {/* Show selected count when items are selected */}
      {selectedItems.length > 0 && (
        <div className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
          {selectedItems.length} petani dipilih
        </div>
      )}

      <PermissionWrapper permissions={[PERMISSIONS.DATA_PETANI_CREATE]}>
        <Tooltip content="Tambah Data Petani">
          <Button
            color="primary"
            startContent={<FaPlus className="w-4 h-4" />}
            onPress={handleCreateNew}
          >
            <span className="hidden sm:inline">Tambah Data</span>
          </Button>
        </Tooltip>
      </PermissionWrapper>

      <PermissionWrapper permissions={[PERMISSIONS.DATA_PETANI_IMPORT]}>
        <Tooltip content="Upload File Excel">
          <Button
            color="success"
            startContent={<FaFileExcel className="w-4 h-4" />}
            variant="flat"
            onPress={handleUploadExcel}
          >
            <span className="hidden sm:inline">Upload Excel</span>
          </Button>
        </Tooltip>
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
  );

  return (
    <div className="min-h-screen container mx-auto max-w-6xl py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola data petani"
        title="Data Petani | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Data Petani", to: "/dashboard-admin/data-petani" },
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

      <div className="container mx-auto px-4 w-full">
        {/* Header Section */}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Data Petani
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Kelola data petani dan status verifikasi
              </p>
            </div>
          </div>
        </div>

        {/* Petani Search Filter */}
        <div className="mb-4">
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pilih Petani
          </p>
          <AsyncSelect
            cacheOptions
            isClearable
            classNames={{
              control: () =>
                "w-full px-1 py-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700",
            }}
            defaultOptions={false}
            formatOptionLabel={(option: any) => (
              <div className="flex flex-col">
                <span className="font-medium">
                  {option.nama || option.label || "Unknown"}
                </span>
                <span className="text-sm text-gray-500">
                  NIK: {option.nik || "N/A"} | {option.desa || "Unknown"},{" "}
                  {option.kecamatan || "Unknown"}
                </span>
              </div>
            )}
            isLoading={isPetaniSearchLoading}
            loadOptions={loadPetaniOptions}
            noOptionsMessage={({ inputValue }) =>
              inputValue
                ? `Tidak ada hasil untuk "${inputValue}"`
                : "Ketik NIK untuk mencari petani..."
            }
            placeholder="Cari petani berdasarkan NIK..."
            value={selectedPetaniOption}
            onChange={handlePetaniSearchChange}
          />
        </div>

        {/* Enhanced Reusable Table with Multiple Select */}
        <ReusableTable<DataPetaniItem>
          // Data & Loading
          currentPage={currentPage}
          data={petaniList}
          error={error}


          // Columns Configuration
          columns={columns}

          // Search
          enableMultiSelect={true}
          loading={isLoading}
          paginationInfo={paginationInfo}
          onPageChange={handlePageChangeWithClear}

          // Multiple Selection - NEW
          selectedItems={selectedItems}
          showPagination={true}
          subtitle="Kelola data petani dan status verifikasi"
          selectionActions={selectionActions}

          // Styling & Behavior
          title="Data Petani"
          onClearSearch={handleClearSearchWithClear}
          onSelectionChange={setSelectedItems}
          getItemId={(item) => item.id}
          // Pagination
          headerActions={headerActions}
        />

        {/* Keep existing Detail Modal */}
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
                      color={getVerificationColor(
                        selectedPetani?.tbl_akun?.isVerified || false,
                      )}
                      size="sm"
                      variant="flat"
                    >
                      {getVerificationLabel(
                        selectedPetani?.tbl_akun?.isVerified || false,
                      )}
                    </Chip>
                  </div>
                  <h2 className="text-xl font-bold">{selectedPetani?.nama}</h2>
                </ModalHeader>

                <ModalBody>
                  {selectedPetani && (
                    <div className="space-y-6">
                      {/* Profile Section */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                        <Avatar
                          className="w-16 h-16"
                          name={selectedPetani.nama}
                          src={selectedPetani.foto || undefined}
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {selectedPetani.nama}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            NIK: {selectedPetani.nik}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Account ID: {selectedPetani.accountID}
                          </p>
                        </div>
                      </div>

                      {/* Information Cards - Keep existing structure */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Personal Information */}
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Informasi Personal
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                NIK:
                              </span>
                              <span className="font-medium">
                                {selectedPetani.nik}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                NKK:
                              </span>
                              <span className="font-medium">
                                {selectedPetani.nkk || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Nama:
                              </span>
                              <span className="font-medium">
                                {selectedPetani.nama}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Pekerjaan:
                              </span>
                              <span className="font-medium">
                                {selectedPetani.tbl_akun?.pekerjaan || "Petani"}
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Contact Information */}
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Informasi Kontak
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">No. Telp:</span>
                              <span className="font-medium">
                                {formatPhoneNumber(selectedPetani.noTelp)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">WhatsApp:</span>
                              <span className="font-medium">
                                {formatPhoneNumber(
                                  selectedPetani.tbl_akun?.no_wa ||
                                    selectedPetani.noTelp,
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium">
                                {selectedPetani.tbl_akun?.email ||
                                  selectedPetani.email}
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Location Information */}
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Informasi Lokasi
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Alamat:</span>
                              <span className="font-medium text-right max-w-[200px]">
                                {selectedPetani.alamat}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Desa:</span>
                              <span className="font-medium">
                                {selectedPetani.desaData?.nama ||
                                  selectedPetani.desa}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kecamatan:</span>
                              <span className="font-medium">
                                {selectedPetani.kecamatanData?.nama ||
                                  selectedPetani.kecamatan}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type Desa:</span>
                              <span className="font-medium">
                                {selectedPetani.desaData?.type || "-"}
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Group Information */}
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Informasi Kelompok
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gapoktan:</span>
                              <span className="font-medium">
                                {selectedPetani.kelompok?.gapoktan || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Kelompok:</span>
                              <span className="font-medium">
                                {selectedPetani.kelompok?.namaKelompok || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Lokasi Kelompok:
                              </span>
                              <span className="font-medium text-right max-w-[200px]">
                                {selectedPetani.kelompok
                                  ? `${selectedPetani.kelompok.desa}, ${selectedPetani.kelompok.kecamatan}`
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Extension Officer Information */}
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Informasi Penyuluh
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Nama:</span>
                              <span className="font-medium">
                                {selectedPetani.dataPenyuluh?.nama || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">NIK:</span>
                              <span className="font-medium">
                                {selectedPetani.dataPenyuluh?.nik || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">No. Telp:</span>
                              <span className="font-medium">
                                {selectedPetani.dataPenyuluh?.noTelp
                                  ? formatPhoneNumber(
                                      selectedPetani.dataPenyuluh.noTelp,
                                    )
                                  : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-medium text-right max-w-[200px]">
                                {selectedPetani.dataPenyuluh?.email || "-"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Wilayah Binaan:
                              </span>
                              <span className="font-medium text-right max-w-[200px]">
                                {selectedPetani.dataPenyuluh?.desaBinaan || "-"}
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Account Status */}
                        <Card className="p-4" shadow="sm">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Status Akun
                          </h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Chip
                                color={getVerificationColor(
                                  selectedPetani.tbl_akun?.isVerified || false,
                                )}
                                size="sm"
                                variant="flat"
                              >
                                {getVerificationLabel(
                                  selectedPetani.tbl_akun?.isVerified || false,
                                )}
                              </Chip>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Peran:</span>
                              <span className="font-medium capitalize">
                                {selectedPetani.tbl_akun?.peran || "petani"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dibuat:</span>
                              <span className="font-medium">
                                {new Date(
                                  selectedPetani.createdAt,
                                ).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Diperbarui:</span>
                              <span className="font-medium">
                                {new Date(
                                  selectedPetani.updatedAt,
                                ).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Tutup
                  </Button>

                  <PermissionWrapper
                    permissions={[PERMISSIONS.DATA_PETANI_EDIT]}
                  >
                    <Button
                      color="primary"
                      onPress={() => {
                        if (selectedPetani) {
                          handleEdit(selectedPetani);
                          onClose();
                        }
                      }}
                    >
                      Edit Data
                    </Button>
                  </PermissionWrapper>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
