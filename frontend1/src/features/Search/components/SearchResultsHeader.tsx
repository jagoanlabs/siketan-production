import React from "react";

interface SearchResultsHeaderProps {
  searchQuery: string;
  isLoading: boolean;
  searchResults: any;
}

export const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  searchQuery,
  isLoading,
  searchResults,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        {isLoading ? (
          "Mencari..."
        ) : searchResults ? (
          <>
            {searchResults.message || (
              <>
                Hasil pencarian untuk{" "}
                <span className="text-[#1167B1]">{searchQuery}</span>
              </>
            )}
          </>
        ) : (
          "Masukkan kata kunci pencarian"
        )}
      </h1>
      {!isLoading &&
        searchResults &&
        searchResults.pagination?.totalResults > 0 && (
          <p className="mt-2 text-gray-600">
            Menampilkan {searchResults.pagination.from}-
            {searchResults.pagination.to} dari{" "}
            {searchResults.pagination.totalResults} hasil
          </p>
        )}
    </div>
  );
};
