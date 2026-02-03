import React from "react";

import { PaginationInfo } from "@/types/table";

interface TablePaginationProps {
  paginationInfo: PaginationInfo;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  debouncedSearchTerm?: string;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  paginationInfo,
  currentPage,
  onPageChange,
  searchTerm,
  debouncedSearchTerm,
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Menampilkan <span className="font-medium">{paginationInfo.from}</span>{" "}
        sampai <span className="font-medium">{paginationInfo.to}</span> dari{" "}
        <span className="font-medium">{paginationInfo.total}</span> hasil
        {searchTerm && (
          <span className="text-blue-600">
            {" "}
            untuk &quot;{debouncedSearchTerm || searchTerm}&quot;
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        >
          Sebelumnya
        </button>

        {Array.from(
          { length: Math.min(5, paginationInfo.maxPages) },
          (_, i) => {
            const pageNum = Math.max(1, currentPage - 2) + i;

            if (pageNum > paginationInfo.maxPages) return null;

            return (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          },
        )}

        <button
          className={`px-3 py-1 rounded-md ${
            currentPage === paginationInfo.maxPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
          disabled={currentPage === paginationInfo.maxPages}
          onClick={() =>
            onPageChange(Math.min(currentPage + 1, paginationInfo.maxPages))
          }
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};
