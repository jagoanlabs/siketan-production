import React, { useEffect, useRef } from "react";
import { FiClock, FiSearch } from "react-icons/fi";

interface SearchSuggestionsProps {
  suggestions: string[];
  recentSearches?: string[];
  popularSearches?: string[];
  onSuggestionClick: (suggestion: string) => void;
  onClose: () => void;
  searchQuery: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  recentSearches = [],
  // popularSearches = [],
  onSuggestionClick,
  onClose,
  searchQuery,
}) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return parts.map((part, index) => (
      <span key={index}>
        {part.toLowerCase() === query.toLowerCase() ? (
          <span className="font-semibold text-[#1167B1]">{part}</span>
        ) : (
          part
        )}
      </span>
    ));
  };

  // Use provided recent and popular searches or fallback to defaults
  const displayRecentSearches =
    recentSearches.length > 0
      ? recentSearches
      : (() => {
          try {
            const recent = localStorage.getItem("recentSearches");

            return recent ? JSON.parse(recent).slice(0, 3) : [];
          } catch {
            return [];
          }
        })();

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
    >
      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
            Saran Pencarian
          </div>
          <ul>
            {suggestions.map((suggestion: string, index: number) => (
              <li key={index}>
                <button
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 flex-1">
                    {highlightMatch(suggestion, searchQuery)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Searches */}
      {displayRecentSearches.length > 0 && !searchQuery && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">
            Pencarian Terakhir
          </div>
          <ul>
            {displayRecentSearches.map((search: string, index: number) => (
              <li key={index}>
                <button
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => onSuggestionClick(search)}
                >
                  <FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 flex-1">{search}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
