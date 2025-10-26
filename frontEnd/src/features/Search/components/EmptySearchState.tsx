import React from "react";
import { FiSearch } from "react-icons/fi";

export const EmptySearchState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <FiSearch className="mx-auto w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-medium text-gray-600 mb-2">
        Mulai pencarian Anda
      </h2>
      <p className="text-gray-500">
        Ketik kata kunci untuk mencari produk, toko, berita, atau lomba
      </p>
    </div>
  );
};
