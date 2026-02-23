import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { SearchResults } from "../components/SearchResults";
import { SearchHeader } from "../components/SearchHeader";
import { CategoryTabs } from "../components/CategoryTabs";
import { SearchResultsHeader } from "../components/SearchResultsHeader";
import { PaginationControls } from "../components/PaginationControls";
import { EmptySearchState } from "../components/EmptySearchState";
import { useSearchResultsFormatter } from "../../../hook/useSearchResultsFormatter";
import { useRecentSearches } from "../../../hook/useRecentSearches";
import { useResultCounts } from "../../../hook/useResultCounts";

import { SearchType } from "@/service/search-service";
import { useSearch } from "@/hook/useSearch";
import { Footer } from "@/features/Home/components/Footer";
import HomeLayout from "@/layouts/HomeLayout";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const initialType = (queryParams.get("type") as SearchType) || "all";

  const {
    searchQuery,
    searchType,
    sortBy,
    searchResults,
    suggestions,
    popularSearches,
    isLoading,
    currentPage,
    setSearchQuery,
    setSearchType,
    setCurrentPage,
    search,
    clearSearch,
  } = useSearch({
    initialQuery,
    initialType,
    autoSearch: false,
  });

  const [localSearchQuery, setLocalSearchQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formattedResults = useSearchResultsFormatter(searchResults);
  const { getRecentSearches } = useRecentSearches();
  const resultCounts = useResultCounts(searchResults);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setLocalSearchQuery(initialQuery);
      search({ q: initialQuery, type: initialType });
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (searchType !== "all") params.set("type", searchType);

    const newUrl = `/search?${params.toString()}`;

    if (location.search !== `?${params.toString()}`) {
      navigate(newUrl, { replace: true });
    }
  }, [searchQuery, searchType, navigate, location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setLocalSearchQuery(value);
    setShowSuggestions(true);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery);
      setShowSuggestions(false);
      await search({
        q: localSearchQuery,
        type: searchType,
        sortBy,
      });
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setLocalSearchQuery(suggestion);
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    await search({ q: suggestion, type: searchType });
  };

  const handleClearSearch = () => {
    setLocalSearchQuery("");
    clearSearch();
  };

  const handleCategoryChange = async (type: SearchType) => {
    setSearchType(type);
    if (searchQuery) {
      await search({ q: searchQuery, type });
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await search({ q: searchQuery, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HomeLayout>
        <SearchHeader
          getRecentSearches={getRecentSearches}
          isLoading={isLoading}
          localSearchQuery={localSearchQuery}
          popularSearches={popularSearches}
          showSuggestions={showSuggestions}
          suggestions={suggestions}
          onClearSearch={handleClearSearch}
          onCloseSuggestions={() => setShowSuggestions(false)}
          onFocus={() => setShowSuggestions(true)}
          onInputChange={handleInputChange}
          onSearch={handleSearch}
          onSuggestionClick={handleSuggestionClick}
        />

        <CategoryTabs
          resultCounts={resultCounts}
          searchQuery={searchQuery}
          searchType={searchType}
          onCategoryChange={handleCategoryChange}
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Search Results */}
            <main className="flex-1">
              {searchQuery ? (
                <>
                  <SearchResultsHeader
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    searchResults={searchResults}
                  />

                  <SearchResults
                    isLoading={isLoading}
                    results={formattedResults}
                    searchData={searchResults}
                    selectedCategory={searchType}
                  />

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={searchResults?.pagination?.totalPages || 0}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <EmptySearchState />
              )}
            </main>
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};

export default SearchPage;
