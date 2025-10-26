import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

import { SearchSuggestions } from "./SearchSuggestions";

import { assets } from "@/assets/assets";

interface SearchHeaderProps {
  localSearchQuery: string;
  isLoading: boolean;
  showSuggestions: boolean;
  suggestions: string[];
  popularSearches: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e?: React.FormEvent) => void;
  onClearSearch: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onFocus: () => void;
  onCloseSuggestions: () => void;
  getRecentSearches: () => string[];
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  localSearchQuery,
  isLoading,
  showSuggestions,
  suggestions,
  popularSearches,
  onInputChange,
  onSearch,
  onClearSearch,
  onSuggestionClick,
  onFocus,
  onCloseSuggestions,
  getRecentSearches,
}) => {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-6">
        {/* Logo */}
        <Link className="flex-shrink-0" to="/">
          <img
            alt="Logo"
            className="w-28 sm:w-32 md:w-36 lg:w-40"
            src={assets.imageLogo}
          />
        </Link>

        {/* Form pencarian, flex-grow supaya input mengisi sisa lebar */}
        <form className="relative flex-grow" onSubmit={onSearch}>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1167B1] focus:border-transparent transition-all"
                placeholder="Cari produk, toko, berita, atau lomba..."
                type="text"
                value={localSearchQuery}
                onChange={onInputChange}
                onFocus={onFocus}
              />
              {localSearchQuery && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                  onClick={onClearSearch}
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              className="px-8 py-3 bg-[#1167B1] text-white font-medium rounded-xl hover:bg-[#0c3e6a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Mencari..." : "Cari"}
            </button>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || !localSearchQuery) && (
            <SearchSuggestions
              popularSearches={popularSearches}
              recentSearches={getRecentSearches()}
              searchQuery={localSearchQuery}
              suggestions={suggestions}
              onClose={onCloseSuggestions}
              onSuggestionClick={onSuggestionClick}
            />
          )}
        </form>
      </div>
    </div>
  );
};
