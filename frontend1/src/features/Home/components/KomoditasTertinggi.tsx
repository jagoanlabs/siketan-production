// components/ProdukKomoditasTable.tsx
import React, { useState, useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa6";

import { ColumnConfig, SortConfig, PaginationInfo } from "@/types/table";
import { useKategoriTanamanTertinggi } from "@/hook/useKomoditasTertinggi";
import { TanamanPetani } from "@/types/komoditas-tertinggi";
import { ReusableTable } from "@/components/Table/ReusableTable";

export const KomoditasTertinggi: React.FC = () => {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ASC",
  });

  // API call dengan TanStack Query
  const { data: responseData, error } = useKategoriTanamanTertinggi({
    page: currentPage,
    limit: 10,
    sortBy: sortConfig.key || undefined,
    sortOrder: sortConfig.direction,
  });

  // Transform data untuk table
  const tableData = responseData?.data || [];

  // Pagination info untuk table
  const paginationInfo: PaginationInfo = useMemo(() => {
    if (!responseData) {
      return {
        total: 0,
        currentPages: 1,
        maxPages: 1,
        from: 0,
        to: 0,
      };
    }

    return {
      total: responseData.total,
      currentPages: responseData.currentPages,
      maxPages: responseData.maxPages,
      from: responseData.from,
      to: responseData.to,
    };
  }, [responseData]);

  // Column configuration
  const columns: ColumnConfig<TanamanPetani>[] = [
    {
      key: "no",
      title: "No",
      width: "60px",
      render: (_, index) => {
        const offset = (currentPage - 1) * 10;

        return offset + index + 1;
      },
    },
    {
      key: "kategori",
      title: "Kategori Tanaman",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {item.kategori}
        </span>
      ),
    },
    {
      key: "komoditas",
      title: "Komoditas",
      sortable: true,
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {item.komoditas}
          </span>
        </div>
      ),
    },
    {
      key: "periodeBulanTanam",
      title: "Bulan Tanam",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
          {item.periodeBulanTanam}
        </span>
      ),
    },
    {
      key: "prakiraanBulanPanen",
      title: "Prakiraan Bulan Panen",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
          {item.prakiraanBulanPanen}
        </span>
      ),
    },
    {
      key: "prakiraanLuasPanen",
      title: "Prakiraan Luas Lahan",
      sortable: true,
      align: "right",
      render: (item) => (
        <div className="text-right">
          <span className="font-medium text-gray-900 dark:text-white">
            {item.prakiraanLuasPanen.toLocaleString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      key: "prakiraanProduksiPanen",
      title: "Prakiraan Produksi Panen",
      sortable: true,
      align: "right",
      render: (item) => (
        <div className="text-right">
          <span className="font-medium text-gray-900 dark:text-white">
            {item.prakiraanProduksiPanen.toLocaleString("id-ID")}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Ditambahkan Pada",
      sortable: true,
      render: (item) => {
        const date = new Date(item.createdAt);

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        );
      },
    },
    {
      key: "kelompok",
      title: "Nama Kelompok Tani",
      render: (item) => (
        <div className="text-gray-900 dark:text-white">
          {item.dataPetani.kelompok ? (
            <div className="flex flex-col">
              <span className="font-medium">
                {item.dataPetani.kelompok.namaKelompok}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Gapoktan: {item.dataPetani.kelompok.gapoktan}
              </span>
            </div>
          ) : (
            <span className="text-gray-500 italic">Tidak ada kelompok</span>
          )}
        </div>
      ),
    },
    {
      key: "daerah",
      title: "Daerah (Kecamatan)",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-white">
            {item.dataPetani.kecamatanData.nama}
          </span>
        </div>
      ),
    },
    {
      key: "noTelp",
      title: "Nomor WA",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.dataPetani.noTelp && (
            <a
              className="text-green-600 hover:text-green-700 transition-colors flex items-center gap-2"
              href={`https://wa.me/62${item.dataPetani.noTelp.replace(/^0/, "")}`}
              rel="noopener noreferrer"
              target="_blank"
              title="Chat WhatsApp"
            >
              <span className="text-gray-900 dark:text-white">
                {item.dataPetani.noTelp}
              </span>
              <FaWhatsapp className="w-4 h-4 text-green-600" />
            </a>
          )}
        </div>
      ),
    },
  ];

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "ASC" ? "DESC" : "ASC",
        };
      }

      return { key, direction: "ASC" };
    });
    setCurrentPage(1); // Reset ke page 1 saat sort
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ReusableTable<TanamanPetani>
      // Data & Loading
      className="mt-4"
      currentPage={currentPage}
      error={error}

      // Columns
      columns={columns}

      // Search
      data={tableData}


      // Sorting
      paginationInfo={paginationInfo}
      onSort={handleSort}

      // Pagination
      sortConfig={sortConfig}
      onPageChange={handlePageChange}

      // Styling
      title="Data Produk Komoditas Tertinggi"
    />
  );
};
