import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

import {
  searchService,
  SearchParams,
  SearchResponse,
  SearchType,
  SortBy,
} from "@/service/search-service";
import { debounce } from "@/utils/debounce";

interface UseSearchOptions {
  initialQuery?: string;
  initialType?: SearchType;
  initialSortBy?: SortBy;
  debounceDelay?: number;
  autoSearch?: boolean;
}

interface UseSearchResult {
  // State
  searchQuery: string;
  searchType: SearchType;
  sortBy: SortBy;
  searchResults: SearchResponse | null;
  suggestions: string[];
  popularSearches: string[];
  isLoading: boolean;
  isLoadingSuggestions: boolean;
  error: Error | null;
  currentPage: number;

  // Actions
  setSearchQuery: (query: string) => void;
  setSearchType: (type: SearchType) => void;
  setSortBy: (sortBy: SortBy) => void;
  setCurrentPage: (page: number) => void;
  search: (params?: Partial<SearchParams>) => Promise<void>;
  clearSearch: () => void;
  loadSuggestions: (query: string) => Promise<void>;
  loadPopularSearches: () => Promise<void>;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchResult => {
  const {
    initialQuery = "",
    initialType = "all",
    initialSortBy = "relevance",
    debounceDelay = 300,
    autoSearch = true,
  } = options;

  // State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null,
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Save search to recent searches
  const saveToRecentSearches = useCallback((query: string) => {
    if (!query) return;

    try {
      const recent = localStorage.getItem("recentSearches");
      const recentSearches = recent ? JSON.parse(recent) : [];
      const updatedSearches = [
        query,
        ...recentSearches.filter((s: string) => s !== query),
      ].slice(0, 10);

      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (e) {
      console.error("Error saving recent searches:", e);
    }
  }, []);

  // Main search function
  const search = useCallback(
    async (params?: Partial<SearchParams>) => {
      const query = params?.q || searchQuery;

      if (!query || query.trim().length === 0) {
        setSearchResults(null);

        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await searchService.search({
          q: query,
          type: params?.type || searchType,
          sortBy: params?.sortBy || sortBy,
          page: params?.page || currentPage,
          limit: params?.limit || 20,
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
        });

        setSearchResults(response);
        saveToRecentSearches(query);
      } catch (err) {
        const error = err as Error;

        setError(error);
        toast.error("Pencarian gagal. Silakan coba lagi.");
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, searchType, sortBy, currentPage, saveToRecentSearches],
  );

  // Load suggestions
  const loadSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);

      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const suggestions = await searchService.getSuggestions(query);

      setSuggestions(suggestions);
    } catch (err) {
      console.error("Load suggestions error:", err);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Debounced suggestion loading
  const debouncedLoadSuggestions = useCallback(
    debounce(loadSuggestions, debounceDelay),
    [loadSuggestions, debounceDelay],
  );

  // Load popular searches
  const loadPopularSearches = useCallback(async () => {
    try {
      const searches = await searchService.getPopularSearches();

      setPopularSearches(searches);
    } catch (err) {
      console.error("Load popular searches error:", err);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults(null);
    setSuggestions([]);
    setError(null);
    setCurrentPage(1);
  }, []);

  // Auto search when params change
  useEffect(() => {
    if (autoSearch && searchQuery) {
      search();
    }
  }, [searchType, sortBy, currentPage]); // Tidak include search dan searchQuery untuk menghindari infinite loop

  // Load suggestions when query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedLoadSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, debouncedLoadSuggestions]);

  // Load popular searches on mount
  useEffect(() => {
    loadPopularSearches();
  }, [loadPopularSearches]);

  return {
    // State
    searchQuery,
    searchType,
    sortBy,
    searchResults,
    suggestions,
    popularSearches,
    isLoading,
    isLoadingSuggestions,
    error,
    currentPage,

    // Actions
    setSearchQuery,
    setSearchType,
    setSortBy,
    setCurrentPage,
    search,
    clearSearch,
    loadSuggestions,
    loadPopularSearches,
  };
};
