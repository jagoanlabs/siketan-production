import { PermissionType } from "@/helpers/RoleHelper/constants/permission";

// types/table.types.ts
export interface ColumnConfig<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: T, index: number, paginationInfo: any) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface SortConfig {
  key: string | null;
  direction: "ASC" | "DESC";
}

export interface PaginationInfo {
  total: number;
  currentPages: number | string;
  maxPages: number;
  from: number;
  to: number;
}

export interface TableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
export interface SortConfig {
  key: string | null;
  direction: "ASC" | "DESC";
}

export interface ReusableTableProps<T = any> {
  // Data & Loading
  data: T[];
  loading?: boolean;
  error?: Error | null;

  // Columns Configuration
  columns: TableColumn<T>[];

  // Search
  searchTerm?: string;
  debouncedSearchTerm?: string;
  onSearchChange?: (term: string) => void;
  onClearSearch?: () => void;
  searchPlaceholder?: string;

  // Sorting
  sortConfig?: SortConfig;
  onSort?: (key: string) => void;

  // Pagination
  paginationInfo?: PaginationInfo;
  currentPage?: number;
  onPageChange?: (page: number) => void;

  // Selection - NEW
  enableMultiSelect?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  getItemId?: (item: T) => string | number; // Function to get unique ID from item
  selectionActions?: SelectionAction[]; // Bulk actions

  // Styling & Behavior
  title?: string;
  subtitle?: React.ReactNode;
  className?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  emptyStateMessage?: string;
  headerActions?: React.ReactNode;
  getRowClassName?: (item: T, index: number) => string;
}

// types/table.types.ts
export interface SelectionAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "danger" | "success" | "warning";
  onClick: (selectedItems: any[]) => void;
  disabled?: (selectedItems: any[]) => boolean;
  confirmMessage?: string;
  permission?: PermissionType; // Tambahkan permission
  permissions?: PermissionType[]; // Tambahkan multiple permissions
  requireAllPermissions?: boolean; // Tambahkan require all permissions
}
