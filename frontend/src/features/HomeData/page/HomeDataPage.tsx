import { useState, useEffect } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Chip } from "@heroui/chip";
import { FaUser, FaUserGroup } from "react-icons/fa6";

import { Footer } from "@/features/Home/components/Footer";
import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { StatCard } from "@/components/StatCard";
import { CommodityLineChart } from "@/features/Home/components/CommodityLineChart";
import { ProcessedCommodityData } from "@/utils/fetchKomoditasData";
import { extractCommodities } from "@/utils/fetchKomoditasData";
import { getColorFromString } from "@/utils/color";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";
import { KomoditasTertinggi } from "@/features/Home/components/KomoditasTertinggi";

interface Ringkasan {
  jumlahPetani: number;
  jumlahGapoktan: number;
  jumlahPenyuluh: number;
  jumlahKomoditas: number;
  areaPertanian: number;
}

export const HomeDataPage = () => {
  const [commodityData, setCommodityData] = useState<ProcessedCommodityData[]>(
    [],
  );
  const [ringkasan, setRingkasan] = useState<Ringkasan | null>(null);
  const [commodities, setCommodities] = useState<string[]>([]);
  const [selectedKomoditas, setSelectedKomoditas] = useState<string[]>([
    "Padi Konvensional",
  ]);
  const [commodityColorMap, setCommodityColorMap] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  useEffect(() => {
    // Fetch data ringkasan dari landing-statistik
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/landing-statistik`)
      .then(async (res) => {
        const json = await res.json();

        if (json.success && json.data) {
          setRingkasan(json.data.ringkasan);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch data komoditas untuk line chart dari endpoint baru
    setLoadingChart(true);

    const fetchData = async () => {
      try {
        let data;

        // Fetch data untuk seluruh tahun
        const { fetchYearlyKomoditasData } = await import(
          "@/utils/fetchKomoditasData"
        );

        data = await fetchYearlyKomoditasData(selectedYear);

        setCommodityData(data);
        if (data.length > 0) {
          // Extract unique commodities from all months/days
          const allCommodities = new Set<string>();

          data.forEach((item) => {
            Object.keys(item.commodities).forEach((commodity) => {
              allCommodities.add(commodity);
            });
          });
          const commodityList = extractCommodities(Array.from(allCommodities));

          setCommodities(commodityList);
          // Generate color map
          setCommodityColorMap(
            Object.fromEntries(
              commodityList.map((name) => [name, getColorFromString(name)]),
            ),
          );
        }
        setLoadingChart(false);
      } catch (error) {
        console.error("Error fetching commodity data:", error);
        setLoadingChart(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // extractCommodities sudah dipindah ke utils/fetchKomoditasData.ts (gunakan dari sana jika perlu)

  // Multi-select: toggle komoditas di array
  const handleChipClick = (commodity: string) => {
    setSelectedKomoditas((prev) => {
      if (prev.includes(commodity)) {
        // Unselect
        return prev.filter((item) => item !== commodity);
      }

      // Select
      return [...prev, commodity];
    });
  };

  const formatAreaPertanian = (value: number) => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + " jt ha";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(0) + " rb ha";
    } else {
      return value.toLocaleString("id-ID") + " ha";
    }
  };

  return (
    <>
      <HomeLayout>
        <div className="p-3 sm:p-4 lg:p-5">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl lg:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
              <NavbarStaticItem index={1} />
            </div>
            <div className="mt-4 sm:mt-6">
              <Breadcrumbs className="sm:text-base" size="sm">
                <BreadcrumbItem
                  classNames={{
                    base: "hover:cursor-pointer text-[#003F75] font-semibold text-xs sm:text-sm",
                    item: "hover:cursor-pointer text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                  href="/"
                >
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem
                  classNames={{
                    base: "text-[#003F75] font-semibold text-xs sm:text-sm",
                    item: "text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                >
                  Data
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </div>
        </div>
        <SectionInfoPertanianCard
          subtitle="Informasi Statistik Data Pertanian di Kab. Ngawi"
          title="Data Pertanian"
        />

        <div className="flex flex-col mx-auto">
          <div
            className="w-full px-4 sm:px-6 lg:px-0 lg:w-11/12 mx-auto"
            id="data-pertanian"
          >
            <div className="bg-white border-2 border-gray-300 rounded-xl lg:rounded-2xl overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 xl:p-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
                  <>
                    <StatCard
                      bgColor="bg-green-50"
                      highlightColor="bg-green-600"
                      icon={<FaUser />}
                      loading={loading}
                      textColor="text-green-600"
                      title="Jumlah Petani"
                      value={ringkasan?.jumlahPetani}
                    />
                    <StatCard
                      bgColor="bg-blue-50"
                      highlightColor="bg-blue-600"
                      icon={<FaUserGroup />}
                      loading={loading}
                      textColor="text-blue-600"
                      title="Kelompok Petani"
                      value={ringkasan?.jumlahGapoktan}
                    />
                    <StatCard
                      bgColor="bg-red-50"
                      highlightColor="bg-red-600"
                      icon={<FaUserGroup />}
                      loading={loading}
                      textColor="text-red-600"
                      title="Penyuluh"
                      value={ringkasan?.jumlahPenyuluh}
                    />
                    <StatCard
                      bgColor="bg-amber-50"
                      highlightColor="bg-amber-600"
                      icon={<FaUserGroup />}
                      loading={loading}
                      textColor="text-amber-600"
                      title="Komoditas"
                      value={ringkasan?.jumlahKomoditas}
                    />
                    <div className="col-span-2 sm:col-span-1">
                      <StatCard
                        bgColor="bg-yellow-50"
                        highlightColor="bg-yellow-600"
                        icon={<FaUserGroup />}
                        loading={loading}
                        textColor="text-yellow-600"
                        title="Area Pertanian"
                        value={
                          ringkasan
                            ? formatAreaPertanian(ringkasan.areaPertanian)
                            : undefined
                        }
                      />
                    </div>
                  </>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-xl lg:rounded-2xl mt-5 sm:mt-6 lg:mt-7 overflow-hidden">
              <div className="p-4 sm:p-6 lg:py-7 lg:px-9">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    Produksi Pertanian Berdasarkan Komoditas ({selectedYear})
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {[...Array(5)].map((_, index) => {
                        const year = new Date().getFullYear() - index;

                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3 lg:gap-4 mb-4">
                  {commodities.map((commodity) => {
                    const chipColor = commodityColorMap[commodity];

                    return (
                      <Chip
                        key={commodity}
                        className={`border-1 text-xs sm:text-sm lg:text-lg cursor-pointer px-2 sm:px-3 py-2 sm:py-3 lg:py-4 transition-colors duration-200
                        ${
                          selectedKomoditas.includes(commodity)
                            ? "text-white border-0"
                            : "border-gray-400 hover:bg-gray-200"
                        }
                        `}
                        style={
                          selectedKomoditas.includes(commodity)
                            ? { background: chipColor }
                            : {}
                        }
                        variant="bordered"
                        onClick={() => handleChipClick(commodity)}
                      >
                        {commodity
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Chip>
                    );
                  })}
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-5">
                  {/* <div className="hidden sm:block w-full sm:w-48 lg:w-72 flex-shrink-0 order-2 lg:order-1">
                    <img
                      alt="Komoditas"
                      className="object-contain w-full h-auto"
                      src={assets.imageJagung}
                    />
                  </div> */}

                  <div className="w-full order-1 lg:order-2">
                    <div className="h-48 sm:h-56 lg:h-64">
                      {loadingChart ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-500">
                            Loading chart data...
                          </div>
                        </div>
                      ) : (
                        <CommodityLineChart
                          colors={commodityColorMap}
                          data={commodityData}
                          selectedCommodity={selectedKomoditas}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="sm:hidden mt-4">
                  <img
                    alt="Komoditas"
                    className="object-contain w-full h-auto max-w-xs mx-auto"
                    src={assets.imageJagung}
                  />
                </div> */}
              </div>

              <div className="flex items-center justify-center h-10 sm:h-12 bg-green-100 hover:bg-green-200 transition-colors cursor-pointer">
                <p className="text-green-600 text-sm font-semibold sm:text-base ">
                  Lihat Selengkapnya
                </p>
              </div>
            </div>
            <div className="mt-10">
              <KomoditasTertinggi />
            </div>
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
