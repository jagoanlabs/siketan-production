// hooks/useProductState.ts (atau Components/useTokoPertanian.ts)
import { useState, useMemo, useEffect } from "react";

import { ProductQueryParams } from "@/types/TokoPertanian/tokoPertanian.d";

// Custom hook untuk debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useProductState = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Debounce search term dengan delay 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const queryParams: ProductQueryParams = useMemo(() => {
    const params: ProductQueryParams = {
      page: currentPage,
      limit: 10,
    };

    // Gunakan debouncedSearchTerm untuk query, bukan searchTerm langsung
    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }

    return params;
  }, [debouncedSearchTerm, currentPage]); // Dependency menggunakan debouncedSearchTerm

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return {
    searchTerm, // Untuk display di UI (real-time)
    debouncedSearchTerm, // Untuk query ke API (debounced)
    currentPage,
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
    resetFilters,
  };
};
