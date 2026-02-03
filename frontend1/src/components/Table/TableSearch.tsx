import React from "react";

import { TableSearchProps } from "@/types/table";

export const TableSearch: React.FC<TableSearchProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  placeholder = "Cari data...",
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`relative flex gap-2 ${className}`}>
      <div className="relative">
        <input
          className={`pl-10 w-80 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={disabled}
          placeholder={placeholder}
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <svg
          className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>

      {searchTerm && (
        <button
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm disabled:opacity-50"
          disabled={disabled}
          type="button"
          onClick={onClearSearch}
        >
          Clear
        </button>
      )}
    </div>
  );
};
