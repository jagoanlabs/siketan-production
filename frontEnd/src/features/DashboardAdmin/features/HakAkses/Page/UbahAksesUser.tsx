// pages/UbahAksesUser.tsx
import React, { useMemo, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Tooltip } from "@heroui/tooltip";
import { toast } from "sonner";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

import useUbahAksesTableState from "../Components/useUbahAksesUserState";
import { UbahRoleModal } from "../Components/UbahAksesUserModal";
import { StatCard } from "../Components/StatisticCard";

import {
  UserAksesData,
  UserRole,
  USER_ROLES,
} from "@/types/HakAkses/ubahAksesUser";
import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { ColumnConfig } from "@/types/table";
import {
  getRoleCountFromApi,
  useMetaPeran,
  useUbahPeranUser,
  useUserAksesData,
} from "@/hook/dashboard/hakAkses/ubahAksesUser";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/helpers/RoleHelper/roleHelpers";

// Role Badge Component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "petani":
        return "text-green-800 bg-green-100 border-green-200";
      case "penyuluh":
        return "text-blue-800 bg-blue-100 border-blue-200";
      case "operator poktan":
        return "text-purple-800 bg-purple-100 border-purple-200";
      case "operator admin":
        return "text-orange-800 bg-orange-100 border-orange-200";
      case "operator super admin":
        return "text-red-800 bg-red-100 border-red-200";
      default:
        return "text-gray-800 bg-gray-100 border-gray-200";
    }
  };

  const roleLabel = USER_ROLES.find((r) => r.value === role)?.label || role;

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(role)}`}
    >
      {roleLabel}
    </span>
  );
};

export const UbahAksesUser = () => {
  const {
    currentPage,
    searchTerm,
    debouncedSearch,
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  } = useUbahAksesTableState();

  // API Hooks
  const {
    data: userAksesResponse,
    isLoading,
    error,
  } = useUserAksesData(queryParams);

  const {
    data: metaPeranResponse,
    isLoading: isLoadingMeta,
    error: metaError,
    refetch: refetchMeta,
  } = useMetaPeran();
  const ubahPeranMutation = useUbahPeranUser();

  // Modal States
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    user: UserAksesData | null;
  }>({ isOpen: false, user: null });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: UserAksesData | null;
    newRole: UserRole | null;
  }>({ isOpen: false, user: null, newRole: null });

  // Show edit modal
  const openEditModal = (user: UserAksesData) => {
    setEditDialog({ isOpen: true, user });
  };

  // Handle save from modal (show confirmation)
  const handleSaveRole = (userId: number, newRole: UserRole) => {
    const user = userAksesResponse?.data.find((u) => u.id === userId);

    if (user) {
      setEditDialog({ isOpen: false, user: null });
      setConfirmDialog({ isOpen: true, user, newRole });
    }
  };

  // Confirm role change
  const handleConfirmRoleChange = async () => {
    if (!confirmDialog.user || !confirmDialog.newRole) return;

    const { user, newRole } = confirmDialog;

    try {
      await ubahPeranMutation.mutateAsync({
        id: user.id,
        roles: newRole,
      });

      toast.success(
        `✅ Role "${user.nama}" berhasil diubah menjadi "${USER_ROLES.find((r) => r.value === newRole)?.label}"`,
      );
      setConfirmDialog({ isOpen: false, user: null, newRole: null });
    } catch (error: any) {
      toast.error(
        `❌ ${error?.response?.data?.message || "Gagal mengubah role user"}`,
      );
    }
  };

  // Column Configuration
  const columns: ColumnConfig<UserAksesData>[] = useMemo(
    () => [
      {
        key: "no",
        title: "No",
        render: (_, index, paginationInfo) =>
          paginationInfo?.from + index || index + 1,
        width: "60px",
        align: "center",
      },
      {
        key: "nama",
        title: "Nama User",
        render: (item) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {item.nama}
            </p>
          </div>
        ),
        width: "200px",
      },
      {
        key: "email",
        title: "Email",
        render: (item) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item.email || (
              <span className="text-gray-400 italic">Tidak ada email</span>
            )}
          </span>
        ),
        width: "200px",
      },
      {
        key: "peran",
        title: "Akses User",
        render: (item) => <RoleBadge role={item.peran} />,
        width: "150px",
        align: "center",
      },
      {
        key: "actions",
        title: "Aksi",
        render: (item) => (
          <div className="flex space-x-2">
            <PermissionWrapper permissions={[PERMISSIONS.UBAH_HAK_AKSES_EDIT]}>
              <Tooltip content="Edit role user">
                <button
                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={ubahPeranMutation.isPending}
                  onClick={() => openEditModal(item)}
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
                </button>
              </Tooltip>
            </PermissionWrapper>
          </div>
        ),
        width: "100px",
        align: "center",
      },
    ],
    [ubahPeranMutation.isPending],
  );

  // Prepare data
  const tableData = userAksesResponse?.data || [];
  const paginationInfo = userAksesResponse
    ? {
        total: userAksesResponse.total,
        currentPages: userAksesResponse.currentPages,
        maxPages: userAksesResponse.maxPages,
        from: userAksesResponse.from,
        to: userAksesResponse.to,
      }
    : undefined;

  return (
    <div className="min-h-screen mx-auto max-w-6xl  py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola akses dan role user"
        title="Ubah Akses User | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Ubah Akses User" },
        ]}
      />

      {/* Statistics Cards menggunakan Meta API */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {USER_ROLES.map((role) => {
          const count = metaPeranResponse?.roles
            ? getRoleCountFromApi(metaPeranResponse.roles, role.value)
            : 0;

          return (
            <StatCard
              key={role.value}
              count={count}
              isLoading={isLoadingMeta}
              role={role}
              total={metaPeranResponse?.totalUser || 0}
            />
          );
        })}
      </div>

      {/* Error handling for meta data */}
      {metaError && (
        <Card className="bg-red-50 border-red-200 mb-6" shadow="sm">
          <CardBody className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-red-600"
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
                <p className="text-sm text-red-700">
                  Gagal memuat statistik user. Data mungkin tidak akurat.
                </p>
              </div>
              <Button
                color="danger"
                size="sm"
                variant="light"
                onPress={() => refetchMeta()}
              >
                Coba Lagi
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Data Table */}
      <ReusableTable<UserAksesData>
        columns={columns}
        currentPage={currentPage}
        data={tableData}
        error={error}

        // Search
        debouncedSearchTerm={debouncedSearch}
        emptyStateMessage="Tidak ada data user yang ditemukan"
        headerActions={
          <div className="flex items-center space-x-3">
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
              onClick={() => window.location.reload()}
              disabled={ubahPeranMutation.isPending}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {ubahPeranMutation.isPending ? 'Processing...' : 'Refresh'}
            </button>
          </div>
        }
        loading={isLoading}
        searchPlaceholder="Cari nama atau email user..."

        // Pagination
        paginationInfo={paginationInfo}
        searchTerm={searchTerm}
        onPageChange={handlePageChange}

        // Styling
        showSearch={true}
        subtitle={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kelola role dan akses untuk semua pengguna sistem
            </p>
          </div>
        }
        title="Daftar User & Akses"
        onClearSearch={clearSearch}
        showPagination={true}

        // Header Actions
        onSearchChange={handleSearchChange}
      />

      {/* Edit Role Modal */}
      <UbahRoleModal
        isLoading={false}
        isOpen={editDialog.isOpen}
        user={editDialog.user}
        onClose={() => setEditDialog({ isOpen: false, user: null })}
        onSave={handleSaveRole}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        accept={handleConfirmRoleChange}
        acceptClassName="confirm-btn-approve"
        acceptIcon={
          ubahPeranMutation.isPending ? "pi pi-spin pi-spinner" : "pi pi-check"
        }
        acceptLabel={
          ubahPeranMutation.isPending ? "Mengubah..." : "Ya, Ubah Role"
        }
        header={
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-100">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Konfirmasi Perubahan Role
            </span>
          </div>
        }
        message={
          confirmDialog.user && confirmDialog.newRole ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                Apakah Anda yakin ingin mengubah role user berikut?
              </p>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  👤 {confirmDialog.user.nama}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <span className="text-blue-700">Role Saat Ini:</span>
                    <div className="mt-1">
                      <RoleBadge role={confirmDialog.user.peran} />
                    </div>
                  </div>
                  <div className="text-blue-600">→</div>
                  <div>
                    <span className="text-blue-700">Role Baru:</span>
                    <div className="mt-1">
                      <RoleBadge role={confirmDialog.newRole} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  ⚠️ Peringatan
                </p>
                <p className="text-xs text-yellow-700">
                  Perubahan role akan memindahkan data user ke tabel yang sesuai
                  dengan role baru. Proses ini tidak dapat dibatalkan setelah
                  disimpan.
                </p>
              </div>
            </div>
          ) : (
            ""
          )
        }
        rejectClassName="confirm-btn-cancel"
        rejectIcon="pi pi-times"
        rejectLabel="Batal"
        visible={confirmDialog.isOpen}
        onHide={() =>
          setConfirmDialog({ isOpen: false, user: null, newRole: null })
        }
      />
    </div>
  );
};
