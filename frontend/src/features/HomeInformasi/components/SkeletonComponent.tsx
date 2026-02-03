// src/components/InfoTaniSkeleton.tsx (atau lokasi lain yang sesuai)

import React from "react";

/**
 * Skeleton untuk ActivityCard.
 * Meniru layout kartu acara dengan gambar di atas dan teks di bawah.
 */
export const ActivityCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md w-full">
      <div className="animate-pulse flex flex-col space-y-4">
        {/* Placeholder untuk gambar */}
        <div className="bg-gray-300 h-40 rounded-md" />
        <div className="space-y-3">
          {/* Placeholder untuk judul */}
          <div className="h-5 bg-gray-300 rounded w-3/4" />
          {/* Placeholder untuk detail (tanggal, waktu, lokasi) */}
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton untuk NewsCardFlex.
 * Meniru layout kartu berita dengan gambar di kiri dan teks di kanan.
 */
export const NewsCardFlexSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-md w-full">
      <div className="animate-pulse flex space-x-4">
        {/* Placeholder untuk gambar */}
        <div className="bg-gray-300 rounded-lg w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          {/* Placeholder untuk judul */}
          <div className="h-5 bg-gray-300 rounded w-4/5" />
          {/* Placeholder untuk deskripsi */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded" />
            <div className="h-3 bg-gray-300 rounded w-5/6" />
          </div>
          {/* Placeholder untuk penulis/tanggal */}
          <div className="h-3 bg-gray-300 rounded w-1/3 pt-2" />
        </div>
      </div>
    </div>
  );
};
