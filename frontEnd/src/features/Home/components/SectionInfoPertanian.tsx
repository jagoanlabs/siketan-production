import { Button } from "@heroui/button";
import React, { useCallback, useEffect, useMemo, useState } from "react"; // Impor React untuk menggunakan useMemo
import { Link } from "react-router-dom";

import { ActivityCardSkeleton, NewsCardSkeleton } from "./InfoTaniSkeleton";
import { ErrorDisplay } from "./ErrorDisplay";
import { CekNIK } from "./CekNIK";

import { NewsCard } from "@/components/NewsCard";
import { formatDate } from "@/utils/dateUtils"; // Pastikan path ini benar
import { ActivityCard } from "@/components/ActivityCard";
import { axiosClient } from "@/service/app-service";

export const SectionInfoPertanian: React.FC = () => {
  // 1. Ganti `useQuery` dengan state management manual
  const [eventData, setEventData] = useState<any[]>([]);
  const [infoData, setInfoData] = useState<any[]>([]);
  const [eventLoading, setEventLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(true);
  const [eventError, setEventError] = useState<Error | null>(null);
  const [infoError, setInfoError] = useState<Error | null>(null);

  // 2. Buat fungsi untuk fetching data
  const fetchData = useCallback(async () => {
    // Reset state saat memulai fetch (berguna untuk refetch/retry)
    setEventLoading(true);
    setInfoLoading(true);
    setEventError(null);
    setInfoError(null);

    try {
      // Jalankan kedua request API secara paralel untuk efisiensi
      const [eventResponse, infoResponse] = await Promise.all([
        axiosClient.get("/event-tani"),
        axiosClient.get("/info-tani"),
      ]);

      // PERHATIKAN: Sesuaikan .data.data dengan struktur respons API Anda!
      setEventData(eventResponse.data.infotani || []);
      setInfoData(infoResponse.data.infotani || []);
    } catch (err: any) {
      console.error("Gagal mengambil data:", err);
      // Set error untuk kedua section jika salah satu gagal
      setEventError(err);
      setInfoError(err);
    } finally {
      // Pastikan loading selalu berhenti, baik sukses maupun gagal
      setEventLoading(false);
      setInfoLoading(false);
    }
  }, []);

  // 3. Panggil fungsi fetchData saat komponen pertama kali dimuat
  useEffect(() => {
    fetchData();
  }, [fetchData]); // `fetchData` ada di dependency array

  // 4. Logika transformasi data (useMemo) tetap sama dan bekerja dengan baik
  const transformedEventData = useMemo(() => {
    if (!eventData) return [];

    return eventData.map((event: any) => ({
      id: event.id,
      title: event.namaKegiatan,
      date: formatDate(event.tanggalAcara),
      time: event.waktuAcara,
      location: event.tempat,
      image: event.fotoKegiatan,
    }));
  }, [eventData]);

  const transformedInfoData = useMemo(() => {
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

  return (
    <div className="w-11/12 mx-auto mt-20" id="info-pertanian">
      {/* Kegiatan Section */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Kegiatan</h1>
        <Button
          as={Link}
          className="text-red-500 bg-red-200 rounded-full hover:bg-red-300 hover:text-red-600"
          to="/home/information"
        >
          Selengkapnya
        </Button>
      </div>

      {/* Event Loading State */}
      {eventLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <ActivityCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Event Error State */}
      {eventError && !eventLoading && (
        <div className="mb-8">
          <ErrorDisplay
            message={eventError.message || "Tidak dapat memuat data kegiatan"}
            title="Gagal Memuat Kegiatan"
            onRetry={() => fetchData()}
          />
        </div>
      )}

      {/* Event Success State */}
      {!eventLoading && !eventError && transformedEventData.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {transformedEventData.slice(0, 3).map((activity: any) => (
            <ActivityCard
              key={activity.id}
              date={activity.date}
              imageUrl={activity.image}
              location={activity.location}
              time={activity.time}
              title={activity.title}
            />
          ))}
        </div>
      )}

      {/* Event Empty State */}
      {!eventLoading && !eventError && eventData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada kegiatan yang tersedia</p>
        </div>
      )}

      {/* Berita Section */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <h1 className="text-2xl font-semibold">Berita</h1>
        <Button
          as={Link}
          className="text-red-500 bg-red-200 rounded-full hover:bg-red-300 hover:text-red-600"
          to="/home/information"
          onPress={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
        >
          Selengkapnya
        </Button>
      </div>

      {/* Info Loading State */}
      {infoLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Info Error State */}
      {infoError && !infoLoading && (
        <div className="mb-8">
          <ErrorDisplay
            message={infoError.message || "Tidak dapat memuat data berita"}
            title="Gagal Memuat Berita"
            onRetry={() => fetchData()}
          />
        </div>
      )}

      {/* Info Success State */}
      {!infoLoading && !infoError && transformedInfoData.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {transformedInfoData.slice(0, 4).map((news: any) => (
            <NewsCard
              key={news.id}
              author={news.author}
              createdAt={news.createdAt}
              description={news.description}
              id={news.id}
              imageUrl={news.imageUrl}
              title={news.title}
            />
          ))}
        </div>
      )}

      {/* Info Empty State */}
      {!infoLoading && !infoError && infoData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada berita yang tersedia</p>
        </div>
      )}

      {/* CekNIK Component */}
      <div className="mt-20">
        <CekNIK />
      </div>
    </div>
  );
};
