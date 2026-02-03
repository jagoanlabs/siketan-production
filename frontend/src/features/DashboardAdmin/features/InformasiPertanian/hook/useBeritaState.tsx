// hooks/useBeritaState.ts
import { useMemo, useState, useEffect } from "react";

import { debounce } from "@/utils/debounce";
import { BeritaQueryParams } from "@/types/InfoPertanian/berita.d";

const useBeritaState = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<
    "all" | "tips" | "berita" | "artikel"
  >("all");
  const [sortBy, setSortBy] = useState<"tanggal" | "judul" | "kategori">(
    "tanggal",
  );
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
  const queryParams: BeritaQueryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      kategori: selectedKategori === "all" ? undefined : selectedKategori,
      sortBy,
      sortOrder,
    }),
    [debouncedSearch, selectedKategori, sortBy, sortOrder],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  const handleKategoriChange = (kategori: typeof selectedKategori) => {
    setSelectedKategori(kategori);
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
    setSelectedKategori("all");
    setSortBy("tanggal");
    setSortOrder("desc");
  };

  return {
    // States
    searchTerm,
    debouncedSearch,
    selectedKategori,
    sortBy,
    sortOrder,
    viewMode,
    queryParams,
    // Handlers
    handleSearchChange,
    clearSearch,
    handleKategoriChange,
    handleSortChange,
    resetFilters,
    setViewMode,
  };
};

export default useBeritaState;
