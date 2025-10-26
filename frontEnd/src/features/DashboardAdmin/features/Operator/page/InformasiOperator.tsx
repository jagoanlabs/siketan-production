import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiUploadLine,
  RiAddLine,
} from "react-icons/ri";
import { Avatar } from "@heroui/avatar";
import { toast } from "sonner";
import { confirmDialog } from "primereact/confirmdialog";
import { Link } from "react-router-dom";

import { OperatorDetailModal } from "../components/DetailInformasiOperatorModal";
import { UploadOperatorModal } from "../components/UploadOperatorModal";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { debounce } from "@/utils/debounce";
import { assets } from "@/assets/assets";
import { SortConfig } from "@/types/table";
import { Operator } from "@/types/Operator/operator";
import { useOperators, useDeleteOperator } from "@/hook/useOperator";
import { PaginationInfo } from "@/types/table";
import { ColumnConfig } from "@/types/table";
import { ReusableTable } from "@/components/Table/ReusableTable";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

export const InformasiOperator = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ASC",
  });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null,
  );

  // Selection state
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);

  //mutation
  // const uploadMutation = useUploadOperatorData();

  // Debounced search implementation
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // API calls
  const {
    data: responseData,
    isLoading,
    error,
  } = useOperators({
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    sortBy: sortConfig.key || undefined,
    sortOrder: sortConfig.direction,
  });

  const deleteOperatorMutation = useDeleteOperator();

  // Transform data untuk table
  const tableData = responseData?.data || [];

  // Pagination info untuk table
  const paginationInfo: PaginationInfo = React.useMemo(() => {
    if (!responseData) {
      return {
        total: 0,
        currentPages: 1,
        maxPages: 1,
        from: 0,
        to: 0,
      };
    }

    return {
      total: responseData.total,
      currentPages: parseInt(responseData.currentPages),
      maxPages: responseData.maxPages,
      from: responseData.from,
      to: responseData.to,
    };
  }, [responseData]);

  // // Format date helper
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);

  //   return date.toLocaleDateString("id-ID", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   });
  // };

  // Column configuration
  const columns: ColumnConfig<Operator>[] = [
    {
      key: "no",
      title: "No",
      width: "60px",
      render: (_, index) => {
        const offset = (currentPage - 1) * 10;

        return (
          <span className="font-medium text-gray-700">
            {offset + index + 1}
          </span>
        );
      },
    },
    {
      key: "nik",
      title: "NIK",
      sortable: true,
      render: (item) => <span className="font-mono text-sm">{item.nik}</span>,
    },
    {
      key: "nama",
      title: "Nama Operator",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar
            className="flex-shrink-0"
            size="sm"
            src={item.foto || assets.defaultPicture}
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate">{item.nama}</p>
          </div>
        </div>
      ),
    },
    {
      key: "kontak",
      title: "Kontak Operator",
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {item.noTelp}
            </span>
            {item.noTelp && (
              <a
                className="text-green-600 hover:text-green-700 transition-colors"
                href={`https://wa.me/62${item.noTelp.replace(/^0/, "")}`}
                rel="noopener noreferrer"
                target="_blank"
                title="Chat WhatsApp"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                </svg>
              </a>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{item.email}</p>
        </div>
      ),
    },
    {
      key: "alamat",
      title: "Alamat Operator",
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 line-clamp-2">{item.alamat}</p>
        </div>
      ),
    },
    {
      key: "role",
      title: "Role",
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 line-clamp-2">
            {item.akun.peran}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Aksi",
      width: "150px",
      render: (item) => (
        <div className="flex items-center gap-2">
          <PermissionWrapper
            permissions={[
              PERMISSIONS.DATA_OPERATOR_DETAIL,
              PERMISSIONS.DATA_OPERATOR_INDEX,
            ]}
          >
            <Button
              isIconOnly
              color="primary"
              size="sm"
              title="Lihat Detail"
              variant="light"
              onPress={() => handleDetail(item)}
            >
              <RiEyeLine size={16} />
            </Button>
          </PermissionWrapper>
          <PermissionWrapper permissions={[PERMISSIONS.DATA_OPERATOR_EDIT]}>
            <Button
              isIconOnly
              as={Link}
              color="warning"
              size="sm"
              title="Edit Operator"
              to={`/dashboard-admin/operator/${item.id}/edit`}
              variant="light"
            >
              <RiEditLine size={16} />
            </Button>
          </PermissionWrapper>
          <PermissionWrapper permissions={[PERMISSIONS.DATA_OPERATOR_DELETE]}>
            <Button
              isIconOnly
              color="danger"
              isLoading={deleteOperatorMutation.isPending}
              size="sm"
              title="Hapus Operator"
              variant="light"
              onPress={() => handleDelete(item)}
            >
              <RiDeleteBinLine size={16} />
            </Button>
          </PermissionWrapper>
        </div>
      ),
    },
  ];

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset ke page 1 saat search
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "ASC" ? "DESC" : "ASC",
        };
      }

      return { key, direction: "ASC" };
    });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle actions
  const handleDetail = (operator: Operator) => {
    setSelectedOperator(operator);
    setDetailModalOpen(true);
  };

  const handleDelete = (operator: Operator) => {
    confirmDialog({
      message: (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full">
              <RiDeleteBinLine className="text-red-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                Konfirmasi Penghapusan
              </h3>
              <p className="text-slate-600">
                Anda akan menghapus operator{" "}
                <span className="font-semibold text-red-600">
                  {operator.nama}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <div className="flex items-start">
              <i className="pi pi-info-circle text-yellow-500 mt-0.5 mr-2" />
              <p className="text-sm text-yellow-700">
                Tindakan ini tidak dapat dibatalkan. Semua data terkait operator
                akan dihapus secara permanen.
              </p>
            </div>
          </div>
        </div>
      ),
      header: (
        <div className="flex items-center gap-2">
          <i className="pi pi-exclamation-triangle text-red-500" />
          <span className="font-bold text-slate-800">Hapus Operator</span>
        </div>
      ),
      icon: "hidden", // Sembunyikan icon default
      acceptLabel: "Ya, Hapus",
      rejectLabel: "Batal",
      acceptIcon: "pi pi-trash",
      rejectIcon: "pi pi-times",
      acceptClassName: "p-button-danger p-button-outlined",
      rejectClassName: "p-button-secondary",
      draggable: false,
      resizable: false,
      className: "max-w-md w-full shadow-xl rounded-xl border-0",

      accept: () => {
        deleteOperatorMutation.mutate(operator.id);
      },
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async (selectedItems: Operator[]) => {
    const deletedCount = selectedItems.length;
    let successCount = 0;

    for (const operator of selectedItems) {
      try {
        await deleteOperatorMutation.mutateAsync(operator.id);
        successCount++;
      } catch (error) {
        console.error(`Failed to delete operator ${operator.nama}:`, error);
      }
    }

    if (successCount === deletedCount) {
      toast.success(`Berhasil menghapus ${successCount} operator`);
    } else if (successCount > 0) {
      toast.warning(
        `Berhasil menghapus ${successCount} dari ${deletedCount} operator`,
      );
    } else {
      toast.error("Gagal menghapus operator");
    }

    setSelectedOperators([]);
  };

  // Selection actions for bulk operations
  const selectionActions = [
    {
      label: "Hapus Terpilih",
      icon: <RiDeleteBinLine size={16} />,
      variant: "danger" as const,
      onClick: handleBulkDelete,
      permission: PERMISSIONS.DATA_OPERATOR_DELETE,
      confirmMessage:
        "Apakah Anda yakin ingin menghapus {count} operator terpilih?",
    },
  ];

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-3">
      <PermissionWrapper
        permissions={[
          PERMISSIONS.DATA_OPERATOR_CREATE,
          PERMISSIONS.DATA_OPERATOR_IMPORT,
        ]}
      >
        <Button
          className="bg-orange-400 text-white"
          startContent={<RiUploadLine size={18} />}
          onPress={() => setUploadModalOpen(true)}
        >
          Upload Data
        </Button>

        <Button
          as={Link}
          color="primary"
          startContent={<RiAddLine size={18} />}
          to="/dashboard-admin/operator/create"
        >
          Tambah Operator
        </Button>
      </PermissionWrapper>
    </div>
  );

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola data operator"
        title="Dashboard Admin | Sistem Manajemen Pertanian"
      />

      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Operator" },
        ]}
      />

      <div className="mt-6">
        <ReusableTable<Operator>
          // Data & Loading
          className=""
          currentPage={currentPage}
          error={error}

          // Columns
          columns={columns}

          // Search
          data={tableData}
          debouncedSearchTerm={debouncedSearchTerm}
          emptyStateMessage="Belum ada data operator yang tersedia"
          enableMultiSelect={true}
          searchPlaceholder="Cari berdasarkan nama, NIK, email, atau alamat..."

          // Sorting
          getItemId={(item) => item.id}
          onSort={handleSort}

          // Pagination
          headerActions={headerActions}
          loading={isLoading}
          onPageChange={handlePageChange}

          // Multi-select & Bulk Actions
          paginationInfo={paginationInfo}
          searchTerm={searchTerm}
          selectedItems={selectedOperators}
          sortConfig={sortConfig}
          selectionActions={selectionActions}

          // Styling
          subtitle={
            <p className="text-gray-600 mt-1">
              Kelola data operator yang memiliki akses ke sistem pertanian
            </p>
          }
          title="Data Operator Sistem"
          onClearSearch={handleClearSearch}
          onSearchChange={handleSearchChange}
          onSelectionChange={setSelectedOperators}
        />
      </div>

      {/* Modals */}
      <OperatorDetailModal
        isOpen={detailModalOpen}
        operator={selectedOperator}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedOperator(null);
        }}
      />

      <UploadOperatorModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};
