import { useCallback, useEffect, useMemo, useState } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Pagination } from "@heroui/pagination";

import { ActivityCardSkeleton } from "../components/SkeletonComponent";

import { Footer } from "@/features/Home/components/Footer";
import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { cn } from "@/lib/utils";
import { ActivityCard } from "@/components/ActivityCard";
import { NewsCardFlex } from "@/components/NewsCardFlex";
import { formatDate } from "@/utils/dateUtils";
import { axiosClient } from "@/service/app-service";
import { NewsCardSkeleton } from "@/features/Home/components/InfoTaniSkeleton";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";

interface activity {
  id: string;
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  shareActivity?: string | null;
}

export const HomeInformasiPage = () => {
  // --- STATE MANAGEMENT ---
  const [selectedTab, setSelectedTab] = useState<"acara" | "berita">("acara");
  const [activityPage, setActivityPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1); // State yang hilang ditambahkan

  const [eventData, setEventData] = useState<any[]>([]);
  const [infoData, setInfoData] = useState<any[]>([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(true);

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setEventLoading(true);
    setInfoLoading(true);
    try {
      const [eventResponse, infoResponse] = await Promise.all([
        axiosClient.get("/event-tani"),
        axiosClient.get("/info-tani"),
      ]);

      setEventData(eventResponse.data.infotani || []);
      setInfoData(infoResponse.data.infotani || []);
    } catch (err: any) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setEventLoading(false);
      setInfoLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- DATA TRANSFORMATION ---
  const transformedEventData: activity[] = useMemo(() => {
    if (!eventData) return [];

    return eventData.map((event: any) => ({
      id: event.id,
      title: event.namaKegiatan,
      date: formatDate(event.tanggalAcara),
      time: event.waktuAcara,
      location: event.tempat,
      image: event.fotoKegiatan,
      shareActivity: null, // Sesuaikan jika ada datanya
    }));
  }, [eventData]);

  const transformedInfoData: any[] = useMemo(() => {
    if (!infoData) return [];

    return infoData.map((info: any) => ({
      id: info.id,
      title: info.judul,
      description: info.isi.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
      imageUrl: info.fotoBerita,
      author: info.createdBy,
      createdAt: formatDate(info.tanggal),
      category: info.kategori,
    }));
  }, [infoData]);

  // --- RESPONSIVE & PAGINATION LOGIC ---
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768 ? 6 : 10;
    }

    return 10;
  });

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 6 : 10);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pagination logic for Activities (diperbaiki)
  const indexOfLastActivity = activityPage * itemsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - itemsPerPage;
  const currentActivities = transformedEventData.slice(
    indexOfFirstActivity,
    indexOfLastActivity,
  );
  const totalActivityPages = Math.ceil(
    transformedEventData.length / itemsPerPage,
  );

  // Pagination logic for News (diperbaiki)
  const indexOfLastNews = newsPage * itemsPerPage;
  const indexOfFirstNews = indexOfLastNews - itemsPerPage;
  const currentNews = transformedInfoData.slice(
    indexOfFirstNews,
    indexOfLastNews,
  );
  const totalNewsPages = Math.ceil(transformedInfoData.length / itemsPerPage);

  return (
    <>
      <HomeLayout>
        {/* Header Section with Navbar - Responsive */}
        <div className="p-3 sm:p-4 lg:p-5">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl lg:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
              <NavbarStaticItem index={2} />
            </div>

            {/* Breadcrumbs - Responsive */}
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
                  Informasi Pertanian
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </div>
        </div>

        {/* Hero Banner - Responsive */}
        <SectionInfoPertanianCard
          subtitle="Informasi Statistik Data Pertanian di Kab. Ngawi"
          title="Informasi Pertanian"
        />

        {/* Main Content - Responsive */}
        <div className="flex flex-col w-full px-4 sm:px-6 lg:px-0 lg:w-11/12 mx-auto mt-4 sm:mt-0">
          {/* Tab Navigation - Responsive */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-10 mb-6 sm:mb-8">
            {/* Mobile Tab Pills Style */}
            <div className="flex sm:hidden bg-gray-100 rounded-full p-1 w-full max-w-sm">
              <button
                className={cn(
                  "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedTab === "acara"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500",
                )}
                onClick={() => setSelectedTab("acara")}
              >
                Acara
              </button>
              <button
                className={cn(
                  "flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedTab === "berita"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500",
                )}
                onClick={() => setSelectedTab("berita")}
              >
                Berita
              </button>
            </div>

            {/* Desktop Tab Style */}
            <div className="hidden sm:flex gap-6 lg:gap-10">
              <button
                className="relative flex flex-col items-center bg-transparent border-none cursor-pointer pb-2"
                onClick={() => setSelectedTab("acara")}
              >
                <h2
                  className={cn(
                    "text-lg sm:text-xl lg:text-2xl font-semibold transition",
                    selectedTab === "acara" ? "text-black" : "text-gray-500",
                  )}
                >
                  <span className="hidden md:inline">Acara Kegiatan </span>
                  <span className="md:hidden">Acara </span>
                  Pertanian
                </h2>
                {selectedTab === "acara" && (
                  <div className="absolute w-full h-0.5 sm:h-1 bg-blue-600 rounded-full -bottom-1 sm:-bottom-3" />
                )}
              </button>

              <button
                className="relative flex flex-col items-center bg-transparent border-none cursor-pointer pb-2"
                onClick={() => setSelectedTab("berita")}
              >
                <h2
                  className={cn(
                    "text-lg sm:text-xl lg:text-2xl font-semibold transition",
                    selectedTab === "berita" ? "text-black" : "text-gray-500",
                  )}
                >
                  Berita Pertanian
                </h2>
                {selectedTab === "berita" && (
                  <div className="absolute w-full h-0.5 sm:h-1 bg-blue-600 rounded-full -bottom-1 sm:-bottom-3" />
                )}
              </button>
            </div>
          </div>

          {/* Content Grid - Responsive */}
          <div className="mt-4 sm:mt-6">
            {selectedTab === "acara" ? (
              // Konten untuk Tab Acara
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {eventLoading ? (
                  // Tampilkan Skeleton jika sedang loading
                  <>
                    {[...Array(6)].map((_, index) => (
                      <ActivityCardSkeleton key={index} />
                    ))}
                  </>
                ) : (
                  // Tampilkan Data jika sudah selesai
                  <>
                    {currentActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id} // Diperbaiki: Gunakan ID unik
                        date={activity.date}
                        imageUrl={activity.image}
                        location={activity.location}
                        shareActivity={activity.shareActivity}
                        time={activity.time}
                        title={activity.title}
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              // Konten untuk Tab Berita
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {infoLoading ? ( // Diperbaiki: Menggunakan variabel state `infoLoading`
                  // Tampilkan Skeleton jika sedang loading
                  <>
                    {[...Array(6)].map((_, index) => (
                      <NewsCardSkeleton key={index} /> // Asumsi nama komponen skeleton berita
                    ))}
                  </>
                ) : (
                  // Tampilkan Data jika sudah selesai
                  <>
                    {currentNews.map((news) => (
                      <NewsCardFlex
                        key={news.id} // Diperbaiki: Gunakan ID unik
                        author={news.author}
                        createdAt={news.createdAt}
                        description={news.description}
                        id={news.id}
                        imageUrl={news.imageUrl}
                        title={news.title}
                      />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Pagination - Responsive */}
          <div className="flex items-center justify-center mt-6 sm:mt-8 lg:mt-10">
            {selectedTab === "acara"
              ? totalActivityPages > 1 && (
                  <Pagination
                    key="activity-pagination"
                    showControls
                    className="sm:size-base"
                    page={activityPage}
                    size="sm"
                    total={totalActivityPages}
                    onChange={(page) => setActivityPage(page)}
                  />
                )
              : totalNewsPages > 1 && (
                  <Pagination
                    key="news-pagination"
                    showControls
                    className="sm:size-base"
                    page={newsPage}
                    size="sm"
                    total={totalNewsPages}
                    onChange={(page) => setNewsPage(page)}
                  />
                )}
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
