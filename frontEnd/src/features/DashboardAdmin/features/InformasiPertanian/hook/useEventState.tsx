// hooks/useEventTaniState.ts
import { useMemo, useState, useEffect } from "react";

import { debounce } from "@/utils/debounce";
import { EventTaniQueryParams } from "@/types/InfoPertanian/event.d";

const useEventTaniState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "upcoming" | "past"
  >("all");
  const [sortBy, setSortBy] = useState<
    "tanggalAcara" | "namaKegiatan" | "createdAt"
  >("tanggalAcara");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Generate query params
  const queryParams: EventTaniQueryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: selectedStatus === "all" ? undefined : selectedStatus,
      sortBy,
      sortOrder,
    }),
    [debouncedSearch, selectedStatus, sortBy, sortOrder],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  const handleStatusChange = (status: typeof selectedStatus) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedStatus("all");
    setSortBy("tanggalAcara");
    setSortOrder("desc");
  };

  return {
    // States
    searchTerm,
    debouncedSearch,
    selectedStatus,
    sortBy,
    sortOrder,
    viewMode,
    queryParams,

    // Handlers
    handleSearchChange,
    clearSearch,
    handleStatusChange,
    handleSortChange,
    resetFilters,
    setViewMode,
  };
};

export default useEventTaniState;
