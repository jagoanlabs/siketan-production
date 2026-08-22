// components/ProdukKomoditasTable.tsx
import React, { useState, useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa6";

import { ColumnConfig, SortConfig, PaginationInfo } from "@/types/table";
import { useTopKomoditas } from "@/hook/useKomoditasTertinggi";
import { DataTanamanTop } from "@/types/komoditas-tertinggi";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { resolvePenyuluhWhatsApp } from "@/utils/phoneSanitizer";

export const TopKomoditasTable: React.FC<{
  type: "prakiraan" | "realisasi";
  title: string;
}> = ({ type, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "DESC",
  });

  const sortBy =
    type === "realisasi" && sortConfig.key === "prakiraanHasilPanen"
      ? "realisasiHasilPanen"
      : type === "realisasi" && sortConfig.key === "prakiraanLuasPanen"
        ? "realisasiLuasPanen"
        : sortConfig.key;

  const { data: responseData, error } = useTopKomoditas({
    page: currentPage,
    limit: 5,
    type,
    sortBy: sortBy || undefined,
    sortOrder: sortConfig.direction,
  });

  const tableData = responseData?.data || [];

  const paginationInfo: PaginationInfo = useMemo(() => {
    if (!responseData) {
      return { total: 0, currentPages: 1, maxPages: 1, from: 0, to: 0 };
    }

    return {
      total: responseData.total,
      currentPages: responseData.currentPages,
      maxPages: responseData.maxPages,
      from: responseData.from,
      to: responseData.to,
    };
  }, [responseData]);

  const columns: ColumnConfig<DataTanamanTop>[] = useMemo(
    () => [
      {
        key: "no",
        title: "No",
        width: "50px",
        render: (_, index) => {
          const offset = (currentPage - 1) * 5;

          return offset + index + 1;
        },
      },
      {
        key: "kategori",
        title: "Kategori Tanaman",
        render: (item) => (
          <span className="font-semibold text-gray-900 dark:text-white uppercase text-xs">
            {item.kategori?.toLowerCase().includes("tanaman")
              ? item.kategori
              : `Tanaman ${item.kategori || ""}`}
          </span>
        ),
      },
      {
        key: "komoditas",
        title: "Komoditas",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.komoditas}
          </span>
        ),
      },
      {
        key: "periodeTanam",
        title: "Bulan Tanam",
        render: (item) => (
          <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
            {item.periodeTanam}
          </span>
        ),
      },
      ...(type === "prakiraan"
        ? [
            {
              key: "prakiraanBulanPanen" as const,
              title: "Prakiraan Bulan Panen",
              render: (item: DataTanamanTop) => (
                <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {item.prakiraanBulanPanen || "-"}
                </span>
              ),
            },
          ]
        : []),
      ...(type === "realisasi"
        ? [
            {
              key: "realisasiBulanPanen" as const,
              title: "Realisasi Bulan Panen",
              render: (item: DataTanamanTop) => (
                <span className="px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full dark:bg-orange-900 dark:text-orange-200">
                  {item.realisasiBulanPanen || "-"}
                </span>
              ),
            },
          ]
        : []),
      {
        key: type === "realisasi" ? "realisasiLuasPanen" : "prakiraanLuasPanen",
        title:
          type === "realisasi"
            ? "Realisasi Luas Panen"
            : "Prakiraan Luas Panen",
        sortable: true,
        render: (item) => {
          const val =
            type === "realisasi"
              ? item.realisasiLuasPanen
              : item.prakiraanLuasPanen;

          return (
            <span className="font-semibold text-gray-900 dark:text-white">
              {val != null ? `${val.toLocaleString("id-ID")} Ha` : "-"}
            </span>
          );
        },
      },
      {
        key:
          type === "realisasi" ? "realisasiHasilPanen" : "prakiraanHasilPanen",
        title:
          type === "realisasi"
            ? "Realisasi Hasil Panen"
            : "Prakiraan Hasil Panen",
        sortable: true,
        render: (item) => {
          const val =
            type === "realisasi"
              ? item.realisasiHasilPanen
              : item.prakiraanHasilPanen;

          return (
            <span className="font-semibold text-gray-900 dark:text-white">
              {val != null ? `${val.toLocaleString("id-ID")} Ton` : "-"}
            </span>
          );
        },
      },
      {
        key: "kelompok",
        title: "Kelompok Tani",
        render: (item) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
              {item.kelompok?.namaKelompok || "-"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.kelompok?.gapoktan || "-"}
            </span>
          </div>
        ),
      },
      {
        key: "kecamatan",
        title: "Kecamatan",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.kelompok?.kecamatanData?.nama || item.kelompok?.kecamatan || "-"}
          </span>
        ),
      },
      {
        key: "desa",
        title: "Desa",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.kelompok?.desaData?.nama || item.kelompok?.desa || "-"}
          </span>
        ),
      },
      {
        key: "noWaPenyuluh" as const,
        title: "No. WhatsApp Penyuluh",
        render: (item: DataTanamanTop) => {
          const waContact = resolvePenyuluhWhatsApp(item);

          if (!waContact) {
            return <span className="text-gray-400 font-medium">-</span>;
          }

          return (
            <a
              href={waContact.waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 font-medium hover:underline transition-colors whitespace-nowrap"
              title={`Hubungi Penyuluh via WhatsApp (${waContact.display})`}
            >
              <FaWhatsapp className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{waContact.display}</span>
            </a>
          );
        },
      },
    ],
    [type, currentPage],
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "ASC" ? "DESC" : "ASC" };
      }

      return { key, direction: "DESC" };
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[1100px]">
        <ReusableTable<DataTanamanTop>
          className="mt-4 shadow-sm border border-gray-100 rounded-xl"
          columns={columns}
          currentPage={currentPage}
          data={tableData}
          error={error}
          headerActions={
            <div className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-300 rounded-lg shadow-2xs">
              Data diambil dari 90 hari terakhir
            </div>
          }
          paginationInfo={paginationInfo}
          sortConfig={sortConfig}
          title={title}
          onPageChange={handlePageChange}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export const KomoditasTertinggi: React.FC = () => {
  return (
    <div className="space-y-6">
      <TopKomoditasTable
        title="Data Produk Komoditas Tertinggi Berdasarkan Prakiraan Hasil Panen"
        type="prakiraan"
      />
      <TopKomoditasTable
        title="Data Produk Komoditas Tertinggi Berdasarkan Realisasi Hasil Panen"
        type="realisasi"
      />
    </div>
  );
};
