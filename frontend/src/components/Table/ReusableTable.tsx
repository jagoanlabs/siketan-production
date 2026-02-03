import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "sonner";
import { useMemo } from "react";
import { Button } from "@heroui/button";

import PermissionWrapper from "../PermissionWrapper";

import { TablePagination } from "./TableComponent";
import { TableSearch } from "./TableSearch";

import { ReusableTableProps, SelectionAction } from "@/types/table";

export function ReusableTable<T = any>({
  // Data & Loading
  data,
  loading = false,
  error = null,

  // Columns Configuration
  columns,

  // Search
  searchTerm = "",
  debouncedSearchTerm = "",
  onSearchChange,
  onClearSearch,
  searchPlaceholder = "Cari data...",

  // Sorting
  sortConfig,
  onSort,

  // Pagination
  paginationInfo,
  currentPage = 1,
  onPageChange,

  // Selection - NEW
  enableMultiSelect = false,
  selectedItems = [],
  onSelectionChange,
  getItemId,
  selectionActions = [],

  // Styling & Behavior
  title,
  subtitle,
  className = "",
  showSearch = true,
  showPagination = true,
  emptyStateMessage = "Tidak ada data yang ditemukan",
  headerActions,
  getRowClassName,
}: ReusableTableProps<T>) {
  // Memoized selected IDs for performance
  const selectedIds = useMemo(() => {
    if (!getItemId) return new Set();

    return new Set(selectedItems.map((item) => getItemId(item)));
  }, [selectedItems, getItemId]);

  // Check if all items in current page are selected
  const isAllSelected = useMemo(() => {
    if (!enableMultiSelect || data.length === 0 || !getItemId) return false;

    return data.every((item) => selectedIds.has(getItemId(item)));
  }, [data, selectedIds, enableMultiSelect, getItemId]);

  // Check if some items are selected (for indeterminate state)
  const isSomeSelected = useMemo(() => {
    if (!enableMultiSelect || data.length === 0 || !getItemId) return false;

    return (
      data.some((item) => selectedIds.has(getItemId(item))) && !isAllSelected
    );
  }, [data, selectedIds, isAllSelected, enableMultiSelect, getItemId]);

  // Handle select all in current page
  const handleSelectAll = () => {
    if (!onSelectionChange || !getItemId) return;

    if (isAllSelected) {
      // Deselect all items in current page
      const currentPageIds = new Set(data.map((item) => getItemId(item)));
      const newSelection = selectedItems.filter(
        (item) => !currentPageIds.has(getItemId(item)),
      );

      onSelectionChange(newSelection);
    } else {
      // Select all items in current page
      // const currentPageIds = new Set(data.map((item) => getItemId(item)));
      const itemsToAdd = data.filter(
        (item) => !selectedIds.has(getItemId(item)),
      );

      onSelectionChange([...selectedItems, ...itemsToAdd]);
    }
  };

  // Handle individual item selection
  const handleItemSelection = (item: T) => {
    if (!onSelectionChange || !getItemId) return;

    const itemId = getItemId(item);

    if (selectedIds.has(itemId)) {
      // Remove item
      const newSelection = selectedItems.filter(
        (selectedItem) => getItemId(selectedItem) !== itemId,
      );

      onSelectionChange(newSelection);
    } else {
      // Add item
      onSelectionChange([...selectedItems, item]);
    }
  };

  // Handle bulk action with confirmation
  const handleBulkAction = (action: SelectionAction) => {
    if (selectedItems.length === 0) {
      toast.warning("Pilih minimal satu item untuk melakukan aksi ini");

      return;
    }

    if (action.disabled && action.disabled(selectedItems)) {
      toast.warning("Aksi tidak dapat dilakukan pada item yang dipilih");

      return;
    }

    if (action.confirmMessage) {
      confirmDialog({
        message: action.confirmMessage.replace(
          "{count}",
          selectedItems.length.toString(),
        ),
        header: "Konfirmasi",
        icon: "pi pi-exclamation-triangle",
        acceptClassName: action.variant === "danger" ? "p-button-danger" : "",
        accept: () => {
          action.onClick(selectedItems);
        },
      });
    } else {
      action.onClick(selectedItems);
    }
  };

  // Get button styling based on variant
  const getActionButtonClass = (variant?: string) => {
    const baseClass =
      "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    switch (variant) {
      case "danger":
        return `${baseClass} bg-red-600 text-white hover:bg-red-700`;
      case "success":
        return `${baseClass} bg-green-600 text-white hover:bg-green-700`;
      case "warning":
        return `${baseClass} bg-yellow-600 text-white hover:bg-yellow-700`;
      default:
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  const renderSortArrow = (key: string) => {
    if (sortConfig?.key !== key) return null;

    return sortConfig.direction === "ASC" ? "↑" : "↓";
  };

  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  const defaultRowClassName = (item: any, index: number) => {
    const baseClass =
      index % 2 === 0
        ? "bg-white dark:bg-gray-800"
        : "bg-gray-50 dark:bg-gray-700";

    // Highlight selected rows
    if (enableMultiSelect && getItemId && selectedIds.has(getItemId(item))) {
      return `${baseClass}`;
    }

    return baseClass;
  };

  const getRowClassNameFn = getRowClassName || defaultRowClassName;

  // Enhanced columns with selection column
  const enhancedColumns = useMemo(() => {
    if (!enableMultiSelect) return columns;

    const selectionColumn = {
      key: "__selection",
      title: (
        <input
          ref={(el) => {
            if (el) el.indeterminate = isSomeSelected;
          }}
          checked={isAllSelected}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          type="checkbox"
          onChange={handleSelectAll}
        />
      ),
      width: "50px",
      render: (item: T) => (
        <input
          checked={getItemId ? selectedIds.has(getItemId(item)) : false}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          type="checkbox"
          onChange={() => handleItemSelection(item)}
        />
      ),
    };

    return [selectionColumn, ...columns];
  }, [
    columns,
    enableMultiSelect,
    isAllSelected,
    isSomeSelected,
    selectedIds,
    getItemId,
  ]);

  const renderSelectionActions = () => {
    if (!enableMultiSelect || selectedItems.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {selectedItems.length} item dipilih
          </span>
          <div className="flex gap-2">
            {selectionActions.map((action, index) => (
              <PermissionWrapper
                key={index}
                permission={action.permission}
                permissions={action.permissions}
                requireAll={action.requireAllPermissions}
              >
                <Button
                  className={getActionButtonClass(action.variant)}
                  disabled={
                    action.disabled ? action.disabled(selectedItems) : false
                  }
                  onPress={() => handleBulkAction(action)}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </PermissionWrapper>
            ))}
            <Button
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              onPress={() => onSelectionChange && onSelectionChange([])}
            >
              Batal Pilih
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 dark:bg-gray-800 ${className}`}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          {title && (
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">
              {title}
            </h2>
          )}
          {subtitle}
        </div>

        <div className="flex items-center gap-4">
          {headerActions}
          {showSearch && onSearchChange && onClearSearch && (
            <TableSearch
              disabled={loading}
              placeholder={searchPlaceholder}
              searchTerm={searchTerm}
              onClearSearch={onClearSearch}
              onSearchChange={onSearchChange}
            />
          )}
        </div>
      </div>

      {/* Selection Actions dengan PermissionWrapper */}
      {renderSelectionActions()}

      {/* Search Status Info */}
      {searchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm dark:bg-blue-900/20 dark:border-blue-700">
          <p className="text-blue-800 dark:text-blue-200">
            {loading ? (
              <span className="animate-pulse">
                🔍 Mencari &quot;{debouncedSearchTerm}&quot;...
              </span>
            ) : (
              <>
                🔍 Ditemukan <strong>{paginationInfo?.total || 0}</strong> hasil
                untuk &quot;{debouncedSearchTerm}&quot;
                {paginationInfo && paginationInfo.total > 0 && (
                  <span>
                    {" "}
                    (halaman {paginationInfo.currentPages} dari{" "}
                    {paginationInfo.maxPages})
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">
            {searchTerm
              ? `Mencari "${debouncedSearchTerm}"...`
              : "Loading data..."}
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {enhancedColumns.map((column, index) => (
                    <th
                      key={`${column.key}-${index}`}
                      className={`px-6 py-3 text-${column.align || "left"} text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 ${
                        column.sortable && onSort
                          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          : ""
                      }`}
                      style={{ width: column.width }}
                      onClick={() =>
                        column.sortable && onSort && handleSort(column.key)
                      }
                    >
                      {column.title}{" "}
                      {column.sortable && renderSortArrow(column.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr
                      key={`row-${index}`}
                      className={getRowClassNameFn(item, index)}
                    >
                      {enhancedColumns.map((column, colIndex) => (
                        <td
                          key={`cell-${index}-${colIndex}`}
                          className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-${column.align || "left"}`}
                        >
                          {column.render
                            ? column.render(item, index, paginationInfo)
                            : (item as any)[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-300"
                      colSpan={enhancedColumns.length}
                    >
                      {searchTerm ? (
                        <>
                          Tidak ada data yang sesuai dengan pencarian &quot;
                          <strong>{debouncedSearchTerm}</strong>&quot;
                          <br />
                          {onClearSearch && (
                            <button
                              className="mt-2 text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
                              onClick={onClearSearch}
                            >
                              Hapus pencarian
                            </button>
                          )}
                        </>
                      ) : (
                        emptyStateMessage
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {showPagination && paginationInfo && onPageChange && (
            <TablePagination
              currentPage={currentPage}
              debouncedSearchTerm={debouncedSearchTerm}
              paginationInfo={paginationInfo}
              searchTerm={searchTerm}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
