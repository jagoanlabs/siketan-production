import { useMemo, useState, useEffect } from "react";

import { debounce } from "@/utils/debounce";
import { UserAksesQueryParams } from "@/types/HakAkses/ubahAksesUser";

const useUbahAksesTableState = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Generate query params
  const queryParams: UserAksesQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
    }),
    [currentPage, itemsPerPage, debouncedSearch],
  );

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
    queryParams,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default useUbahAksesTableState;
