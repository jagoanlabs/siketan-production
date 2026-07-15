// components/ProdukKomoditasTable.tsx
import React, { useState, useMemo } from "react";

import { ColumnConfig, SortConfig, PaginationInfo } from "@/types/table";
import { useTopKomoditas } from "@/hook/useKomoditasTertinggi";
import { DataTanamanTop } from "@/types/komoditas-tertinggi";
import { ReusableTable } from "@/components/Table/ReusableTable";

const TopKomoditasTable: React.FC<{
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
        width: "60px",
        render: (_, index) => {
          const offset = (currentPage - 1) * 5;

          return offset + index + 1;
        },
      },
      {
        key: "kategori",
        title: "Kategori Tanaman",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.kategori}
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
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
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
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
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
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full dark:bg-orange-900 dark:text-orange-200">
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
        align: "right",
        render: (item) => {
          const val =
            type === "realisasi"
              ? item.realisasiLuasPanen
              : item.prakiraanLuasPanen;

          return (
            <div className="text-right">
              <span className="font-medium text-gray-900 dark:text-white">
                {val != null ? val.toLocaleString("id-ID") : "-"}
              </span>
            </div>
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
        align: "right",
        render: (item) => {
          const val =
            type === "realisasi"
              ? item.realisasiHasilPanen
              : item.prakiraanHasilPanen;

          return (
            <div className="text-right">
              <span className="font-medium text-gray-900 dark:text-white">
                {val != null ? val.toLocaleString("id-ID") : "-"}
              </span>
            </div>
          );
        },
      },
      {
        key: "kelompok",
        title: "Kelompok Tani",
        render: (item) => (
          <div className="flex flex-col">
            <span className="font-medium">{item.kelompok.namaKelompok}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Gapoktan: {item.kelompok.gapoktan}
            </span>
          </div>
        ),
      },
      {
        key: "kecamatan",
        title: "Kecamatan",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.kelompok.kecamatanData?.nama || item.kelompok.kecamatan}
          </span>
        ),
      },
      {
        key: "desa",
        title: "Desa",
        render: (item) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {item.kelompok.desaData?.nama || item.kelompok.desa}
          </span>
        ),
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
    <ReusableTable<DataTanamanTop>
      className="mt-4"
      columns={columns}
      currentPage={currentPage}
      data={tableData}
      error={error}
      paginationInfo={paginationInfo}
      sortConfig={sortConfig}
      title={title}
      onPageChange={handlePageChange}
      onSort={handleSort}
    />
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
