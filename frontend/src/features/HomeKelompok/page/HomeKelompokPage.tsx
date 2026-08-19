import React, { useState, useMemo, useEffect } from "react";
import { Breadcrumbs, BreadcrumbsItem } from "../../../components/Form/HeroBreadcrumbs";
import { FaUserGroup, FaBuilding, FaLocationDot } from "react-icons/fa6";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { Footer } from "@/features/Home/components/Footer";
import { ReusableTable } from "@/components/Table/ReusableTable";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";
import { ColumnConfig, PaginationInfo } from "@/types/table";
import { PublicKelompokItem, KelompokTaniQueryParams } from "@/types/KelompokTani/kelompokTani";
import { usePublicKelompok, usePublicStatistikKelompok } from "@/hook/usePublicKelompok";
import { debounce } from "@/utils/debounce";

export const HomeKelompokPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    [],
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  // Query parameters for server-side fetching
  const queryParams: KelompokTaniQueryParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
    }),
    [currentPage, itemsPerPage, debouncedSearch],
  );

  const { data: responseData, isLoading, error } = usePublicKelompok(queryParams);
  const { data: statistikResponse, isLoading: isStatistikLoading } = usePublicStatistikKelompok();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Columns definition according to required mapping
  const columns: ColumnConfig<PublicKelompokItem>[] = useMemo(
    () => [
      {
        key: "no",
        title: "No",
        render: (_, index, paginationInfo) => (
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {(paginationInfo?.from || 1) + index}
          </span>
        ),
        width: "60px",
        align: "center",
      },
      {
        key: "id",
        title: "ID Poktan",
        render: (item) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            #{item.id}
          </span>
        ),
        width: "120px",
        align: "center",
      },
      {
        key: "gapoktan",
        title: "Gapoktan",
        render: (item) => (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
              <HiOutlineBuildingOffice2 className="w-4 h-4" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {item.gapoktan}
            </span>
          </div>
        ),
        width: "220px",
      },
      {
        key: "namaKelompok",
        title: "Nama Poktan",
        render: (item) => (
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {item.namaKelompok}
          </span>
        ),
        width: "240px",
      },
      {
        key: "desa",
        title: "Desa",
        render: (item) => (
          <span className="inline-flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <FaLocationDot className="w-3.5 h-3.5 text-red-500" />
            {item.desa}
          </span>
        ),
        width: "180px",
      },
      {
        key: "kecamatan",
        title: "Kecamatan",
        render: (item) => (
          <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md dark:bg-gray-700 dark:text-gray-200">
            {item.kecamatan}
          </span>
        ),
        width: "180px",
      },
    ],
    [],
  );

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

  return (
    <>
      <HomeLayout>
        {/* Top Header / Banner */}
        <div className="p-3 sm:p-4 lg:p-5">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl lg:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
              <NavbarStaticItem index={null} />
            </div>
            <div className="mt-4 sm:mt-6">
              <Breadcrumbs className="sm:text-base" size="sm">
                <BreadcrumbsItem
                  classNames={{
                    base: "hover:cursor-pointer text-[#003F75] font-semibold text-xs sm:text-sm",
                    item: "hover:cursor-pointer text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                  href="/"
                >
                  Home
                </BreadcrumbsItem>
                <BreadcrumbsItem
                  classNames={{
                    base: "text-[#003F75] font-semibold text-xs sm:text-sm",
                    item: "text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                >
                  Kelompok Tani
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <SectionInfoPertanianCard
          subtitle="Daftar Informasi Kelompok Tani (Poktan) dan Gapoktan di Wilayah Kabupaten Ngawi"
          title="Data Kelompok Tani"
        />

        {/* Main Content Area */}
        <div className="w-full px-4 sm:px-6 lg:px-0 lg:w-11/12 mx-auto mb-12">
          {/* Quick Statistics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border-2 border-emerald-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xl">
                <FaUserGroup />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Total Kelompok Tani
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistikResponse?.data?.totalKelompok !== undefined
                    ? statistikResponse.data.totalKelompok.toLocaleString("id-ID")
                    : isStatistikLoading
                      ? "..."
                      : responseData?.total
                        ? responseData.total.toLocaleString("id-ID")
                        : "0"}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 text-xl">
                <FaLocationDot />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Total Desa
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistikResponse?.data?.totalDesa !== undefined
                    ? statistikResponse.data.totalDesa.toLocaleString("id-ID")
                    : isStatistikLoading
                      ? "..."
                      : "0"}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-amber-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 text-xl">
                <FaBuilding />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Total Kecamatan
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistikResponse?.data?.totalKecamatan !== undefined
                    ? statistikResponse.data.totalKecamatan.toLocaleString("id-ID")
                    : isStatistikLoading
                      ? "..."
                      : "0"}
                </p>
              </div>
            </div>
          </div>

          {/* DataTable Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <ReusableTable<PublicKelompokItem>
              className="border-0 shadow-none p-4 sm:p-6"
              columns={columns}
              currentPage={currentPage}
              data={tableData}
              debouncedSearchTerm={debouncedSearch}
              emptyStateMessage="Tidak ada data kelompok tani yang sesuai"
              error={error as any}
              loading={isLoading}
              paginationInfo={paginationInfo}
              searchPlaceholder="Cari nama poktan, gapoktan, desa, atau kecamatan..."
              searchTerm={searchTerm}
              showPagination={true}
              showSearch={true}
              subtitle="Data seluruh kelompok tani yang terdaftar di sistem"
              title="Daftar Poktan & Gapoktan"
              onClearSearch={handleClearSearch}
              onPageChange={handlePageChange}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};

export default HomeKelompokPage;
