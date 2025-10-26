// pages/DaftarPenyuluh.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";

import {
  usePenyuluh,
  useUploadPenyuluhExcel,
} from "@/hook/dashboard/infoPenyuluh/usePenyuluh";
import { ColumnConfig } from "@/types/table";
import { Penyuluh } from "@/types/DataPenyuluh/penyuluh";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";
import PermissionWrapper from "@/components/PermissionWrapper";

const ITEMS_PER_PAGE = 10;

export default function InformasiPenyuluh() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ASC" | "DESC";
  }>({
    key: "nama",
    direction: "ASC",
  });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API queries
  const {
    data: penyuluhData,
    isLoading,
    error,
    refetch,
  } = usePenyuluh({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm,
    sortBy: sortConfig.key,
    sortOrder: sortConfig.direction,
  });

  // const deleteMutation = useDeletePenyuluh();
  const uploadMutation = useUploadPenyuluhExcel();

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ASC" ? "DESC" : "ASC",
    }));
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreatePenyuluh = () => {
    navigate("/dashboard-admin/data-penyuluh/create");
  };

  const handleUploadExcel = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (
      !file.name.toLowerCase().endsWith(".xlsx") &&
      !file.name.toLowerCase().endsWith(".xls")
    ) {
      toast.error("File harus berformat Excel (.xlsx atau .xls)");

      return;
    }

    try {
      toast.loading("Mengupload file Excel...", { id: "upload" });
      await uploadMutation.mutateAsync(file);
      toast.success("File Excel berhasil diupload dan diproses", {
        id: "upload",
      });
      refetch(); // Refresh data
    } catch (error) {
      toast.error("Gagal mengupload file Excel. Silakan coba lagi.", {
        id: "upload",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Table columns configuration
  const columns: ColumnConfig<Penyuluh>[] = [
    {
      key: "no",
      title: "No",
      align: "center",
      width: "60px",
      render: (_, index, paginationInfo) => {
        if (!paginationInfo) return index + 1;

        return paginationInfo.from - 1 + index + 1;
      },
    },
    {
      key: "nik",
      title: "NIP",
      sortable: true,
      render: (item) => item.nik || "-",
    },
    {
      key: "nama",
      title: "Nama",
      sortable: true,
      render: (item) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {item.nama}
            </div>
            {item.email && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.email}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "kontak",
      title: "Kontak Penyuluh",
      render: (item) => (
        <div className="space-y-1">
          <div className="text-sm">{item.noTelp}</div>
        </div>
      ),
    },
    {
      key: "kecamatanBinaan",
      title: "Kecamatan Binaan",
      render: (item) => {
        const kecamatanBinaan =
          item.kecamatanBinaanData?.map((k) => k.kecamatan.nama) || [];

        return kecamatanBinaan.length > 0
          ? kecamatanBinaan.join(", ")
          : item.kecamatanBinaan || "-";
      },
    },
    {
      key: "desaBinaan",
      title: "Desa Binaan",
      render: (item) => {
        const desaBinaan = item.desaBinaanData?.map((d) => d.desa.nama) || [];

        return desaBinaan.length > 0
          ? desaBinaan.join(", ")
          : item.desaBinaan || "-";
      },
    },
    // tipe penyuluh
    {
      key: "tipe",
      title: "Tipe Penyuluh",
      render: (item) => {
        const isReguler = item.tipe?.toLowerCase() === "reguler";

        return (
          <Chip
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isReguler
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
          >
            {isReguler ? "Reguler" : "Swadaya"}
          </Chip>
        );
      },
    },
    {
      key: "actions",
      title: "Aksi",
      align: "center",
      width: "120px",
      render: (item) => (
        <div className="flex items-center justify-center space-x-1">
          <PermissionWrapper
            permissions={[
              PERMISSIONS.DATA_PENYULUH_INDEX,
              PERMISSIONS.DATA_PENYULUH_DETAIL,
            ]}
          >
            <Tooltip content="Detail penyuluh">
              <Link
                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors"
                to={`/dashboard-admin/data-penyuluh/${item.id}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Link>
            </Tooltip>
          </PermissionWrapper>

          <PermissionWrapper permissions={[PERMISSIONS.DATA_PENYULUH_EDIT]}>
            <Tooltip content="Edit penyuluh">
              <Link
                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                to={`/dashboard-admin/data-penyuluh/${item.id}/edit`}
              >
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
              </Link>
            </Tooltip>
          </PermissionWrapper>
        </div>
      ),
    },
  ];

  // Header actions
  const headerActions = (
    <div className="flex items-center space-x-2">
      <PermissionWrapper
        permissions={[
          PERMISSIONS.DATA_PENYULUH_CREATE,
          PERMISSIONS.DATA_PENYULUH_IMPORT,
        ]}
      >
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          disabled={uploadMutation.isPending}
          onClick={handleUploadExcel}
        >
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
              strokeWidth="2"
            />
          </svg>
          <span>
            {uploadMutation.isPending ? "Mengupload..." : "Upload Excel"}
          </span>
        </button>
      </PermissionWrapper>

      <PermissionWrapper permissions={[PERMISSIONS.DATA_PENYULUH_CREATE]}>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={handleCreatePenyuluh}
        >
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
              strokeWidth="2"
            />
          </svg>
          <span>Tambah Penyuluh</span>
        </button>
      </PermissionWrapper>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        accept=".xlsx,.xls"
        className="hidden"
        type="file"
        onChange={handleFileUpload}
      />

      {/* Main Table */}
      <ReusableTable<Penyuluh>
        // Data & Loading
        currentPage={currentPage}
        data={penyuluhData?.data || []}
        error={error}

        // Columns Configuration
        columns={columns}

        // Search
        debouncedSearchTerm={debouncedSearchTerm}
        emptyStateMessage="Belum ada data penyuluh"
        headerActions={headerActions}
        loading={isLoading}
        searchPlaceholder="Cari berdasarkan NIP, nama, atau kontak..."

        // Sorting
        paginationInfo={penyuluhData ? {
          total: penyuluhData.total,
          currentPages: penyuluhData.currentPages,
          maxPages: penyuluhData.maxPages,
          from: penyuluhData.from,
          to: penyuluhData.to
        } : undefined}
        onSort={handleSort}

        // Pagination
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        onPageChange={handlePageChange}

        // Styling & Behavior
        subtitle={
          <p className="text-gray-600 dark:text-gray-400">
            Kelola data penyuluh pertanian di sistem
          </p>
        }
        title="Daftar Penyuluh"
        onClearSearch={handleClearSearch}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
}
