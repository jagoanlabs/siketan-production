const useActivityTableState = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ASC" | "DESC";
  }>({ key: "createdAt", direction: "DESC" });

  // Debounce search
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Generate query params
  const queryParams: ActivityQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      sortBy: sortConfig.key || "createdAt",
      sortType: sortConfig.direction,
      search: debouncedSearch || undefined,
    }),
    [currentPage, itemsPerPage, sortConfig, debouncedSearch],
  );

  const handleSort = (key: string) => {
    let direction: "ASC" | "DESC" = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    searchTerm,
    debouncedSearch,
    sortConfig,
    queryParams,
    handleSort,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

// Activity User Page Component
import React, { useEffect, useMemo, useState } from "react";

import PageBreadcrumb from "@/components/Breadcrumb";
import PageMeta from "@/layouts/PageMeta";
import { ActivityUser, useActivityData } from "@/hook/useLogActivity";
import { debounce } from "@/utils/debounce";
import { ActivityQueryParams } from "@/hook/useLogActivity";
import { ColumnConfig } from "@/types/table";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { assets } from "@/assets/assets";
import { formatRelativeTime } from "@/utils/formatDate";

// Activity Badge Component
const ActivityBadge: React.FC<{ activity: string }> = ({ activity }) => {
  const getActivityStyle = (activity: string) => {
    switch (activity.toUpperCase()) {
      case "CREATE":
        return "bg-green-100 text-green-800 border-green-200";
      case "UPDATE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      case "LOGIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "LOGOUT":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getActivityStyle(activity)}`}
    >
      {activity}
    </span>
  );
};

// Role Badge Component
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "operator admin":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "petani":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleStyle(role)}`}
    >
      {role}
    </span>
  );
};

export const AktivitasUserPage = () => {
  const {
    currentPage,
    searchTerm,
    debouncedSearch,
    sortConfig,
    queryParams,
    handleSort,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  } = useActivityTableState();

  const {
    data: activityResponse,
    isLoading,
    error,
  } = useActivityData(queryParams);

  // Column Configuration
  const columns: ColumnConfig<ActivityUser>[] = useMemo(
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
        sortable: true,
        render: (item) => (
          <div className="flex items-center space-x-3">
            <img
              alt={item.tbl_akun.nama}
              className="w-8 h-8 rounded-full object-cover"
              src={item.tbl_akun.foto || assets.defaultPicture}
              onError={(e) => {
                (e.target as HTMLImageElement).src = assets.defaultPicture;
              }}
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {item.tbl_akun.nama}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.tbl_akun.email}
              </p>
            </div>
          </div>
        ),
        width: "250px",
      },
      {
        key: "peran",
        title: "Role",
        render: (item) => <RoleBadge role={item.tbl_akun.peran} />,
        width: "120px",
        align: "center",
      },
      {
        key: "activity",
        title: "Aktivitas",
        sortable: true,
        render: (item) => (
          <div>
            <ActivityBadge activity={item.activity} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.detail}
            </p>
          </div>
        ),
        width: "200px",
      },
      {
        key: "createdAt",
        title: "Tanggal",
        sortable: true,
        render: (item) => (
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatRelativeTime(item.createdAt)}
            </p>
          </div>
        ),
        width: "180px",
      },
    ],
    [],
  );

  // Prepare data
  const tableData = activityResponse?.data || [];
  const paginationInfo = activityResponse
    ? {
        total: activityResponse.total,
        currentPages: activityResponse.currentPages,
        maxPages: activityResponse.maxPages,
        from: activityResponse.from,
        to: activityResponse.to,
      }
    : undefined;

  return (
    <div className="min-h-screen max-w-6xl container mx-auto py-6">
      <PageMeta
        description="Dashboard Admin untuk mengelola data aktivitas user"
        title="Aktivitas User | Sistem Manajemen Pertanian"
      />
      <PageBreadcrumb
        items={[
          { label: "Dashboard", to: "/dashboard-admin" },
          { label: "Aktivitas User" },
        ]}
      />

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Aktivitas</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {paginationInfo?.total || 0}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Activity Table */}
      <ReusableTable<ActivityUser>
        columns={columns}
        currentPage={currentPage}
        data={tableData}
        error={error}
        
        // Search
        debouncedSearchTerm={debouncedSearch}
        emptyStateMessage="Tidak ada aktivitas user yang ditemukan"
        headerActions={
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={() => {
                // Refresh data
                window.location.reload();
              }}
            >
              <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        }
        loading={isLoading}
        searchPlaceholder="Cari nama user..."
        
        // Sorting
        paginationInfo={paginationInfo}
        title="Log Aktivitas User"
        sortConfig={sortConfig}
        
        // Pagination
        onClearSearch={clearSearch}
        
        // Styling
        onSearchChange={handleSearchChange}
        onSort={handleSort}
        className="mt-6"
        
        // Header Actions
        searchTerm={searchTerm}
        // sortConfig={sortConfig}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
