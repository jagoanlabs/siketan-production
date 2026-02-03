// ===== FIXED IMAGE URL HANDLING =====
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import {
  FaRegCalendarAlt,
  FaWhatsapp,
  FaArrowLeft,
  FaFacebook,
  FaCopy,
} from "react-icons/fa";
import { toast } from "sonner";
import { FaRegCircleUser } from "react-icons/fa6";

import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { Footer } from "@/features/Home/components/Footer";
import { axiosClient } from "@/service/app-service";
import { formatDate } from "@/utils/dateUtils";
import { ErrorDisplay } from "@/features/Home/components/ErrorDisplay";
import { assets } from "@/assets/assets";

// --- Interface ---
interface NewsDetail {
  id: number;
  judul: string;
  tanggal: string;
  status: string | null;
  kategori: string;
  fotoBerita: string;
  createdBy: string;
  isi: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// --- URL CLEANING UTILITY ---
const cleanImageUrl = (url: string): string => {
  if (!url) return "";

  // Remove surrounding quotes and whitespace
  let cleanUrl = url.trim();

  // Remove double quotes from start and end
  if (cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) {
    cleanUrl = cleanUrl.slice(1, -1);
  }

  // Remove single quotes from start and end
  if (cleanUrl.startsWith("'") && cleanUrl.endsWith("'")) {
    cleanUrl = cleanUrl.slice(1, -1);
  }

  // Remove any remaining whitespace
  cleanUrl = cleanUrl.trim();

  // Handle encoded quotes
  cleanUrl = cleanUrl.replace(/&quot;/g, "");
  cleanUrl = cleanUrl.replace(/&#34;/g, "");
  cleanUrl = cleanUrl.replace(/&#39;/g, "");

  // Handle multiple consecutive quotes
  cleanUrl = cleanUrl.replace(/["""''']+/g, "");

  console.log("🧹 URL cleaning:", { original: url, cleaned: cleanUrl });

  return cleanUrl;
};

// --- ENHANCED IMAGE VALIDATION ---
const isValidImageUrl = (url: string): boolean => {
  if (!url || url.length === 0) return false;

  try {
    // Clean URL first
    const cleanUrl = cleanImageUrl(url);

    if (!cleanUrl) return false;

    // Check if it's a valid URL
    new URL(cleanUrl);

    // Check if it looks like an image URL
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const hasImageExtension = imageExtensions.some((ext) =>
      cleanUrl.toLowerCase().includes(ext),
    );

    // Allow URLs from common image hosting services
    const imageHosts = [
      "imagekit.io",
      "cloudinary.com",
      "amazonaws.com",
      "googleusercontent.com",
    ];
    const isImageHost = imageHosts.some((host) => cleanUrl.includes(host));

    return (
      hasImageExtension || isImageHost || cleanUrl.startsWith("data:image/")
    );
  } catch (error) {
    console.warn("Invalid URL:", url, error);

    return false;
  }
};

// --- IMAGE COMPONENT WITH ENHANCED ERROR HANDLING ---
const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}> = ({ src, alt, className, fallbackSrc, onError }) => {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Process and set image source
  useEffect(() => {
    const cleanUrl = cleanImageUrl(src);

    console.log("🖼️ Processing image:", {
      original: src,
      cleaned: cleanUrl,
      isValid: isValidImageUrl(src),
    });

    if (isValidImageUrl(src)) {
      setImageSrc(cleanUrl);
      setImageError(false);
      setIsLoading(true);
    } else {
      console.warn("❌ Invalid image URL, using fallback");
      setImageError(true);
      setIsLoading(false);
      if (fallbackSrc) {
        setImageSrc(cleanImageUrl(fallbackSrc));
      }
    }
  }, [src, fallbackSrc]);

  const handleImageError = () => {
    console.error("❌ Image failed to load:", imageSrc);
    setImageError(true);
    setIsLoading(false);

    // Try fallback if available and not already tried
    if (fallbackSrc && imageSrc !== cleanImageUrl(fallbackSrc)) {
      const cleanFallback = cleanImageUrl(fallbackSrc);

      console.log("🔄 Trying fallback image:", cleanFallback);
      setImageSrc(cleanFallback);
      setImageError(false);
      setIsLoading(true);

      return;
    }

    onError?.();
  };

  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully:", imageSrc);
    setIsLoading(false);
    setImageError(false);
  };

  // Show error state if no valid image
  if (imageError && !imageSrc) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className || ""}`}
      >
        <div className="text-center text-gray-500">
          <span className="text-4xl mb-2 block">📰</span>
          <p className="text-sm">Gambar tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className || ""}`}
        >
          <span className="text-gray-400">Loading...</span>
        </div>
      )}

      {imageSrc && (
        <img
          alt={alt}
          className={`${className || ""} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          loading="lazy"
          src={imageSrc}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}

      {imageError && imageSrc && (
        <div
          className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${className || ""}`}
        >
          <div className="text-center text-gray-500">
            <span className="text-2xl">❌</span>
            <p className="text-sm mt-2">Gagal memuat gambar</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ENHANCED SKELETON ---
const DetailNewsSkeleton = () => (
  <div className="w-11/12 mx-auto animate-pulse">
    <div className="mb-4 -mt-8">
      <div className="w-24 h-8 bg-gray-200 rounded" />
    </div>

    <div className="w-full h-[526px] bg-gray-300 rounded-3xl -top-[60px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <div className="w-24 h-6 bg-gray-400 rounded mb-4" />
        <div className="space-y-2">
          <div className="w-3/4 h-8 bg-gray-400 rounded" />
          <div className="w-1/2 h-8 bg-gray-400 rounded" />
        </div>
      </div>
    </div>

    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded" />
            <div className="w-20 h-3 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>

      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded ${i % 4 === 3 ? "w-3/4" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  </div>
);

export const DetailNews = () => {
  const { id } = useParams<{ id: string }>();

  // States
  const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Share functions
  const shareToWhatsApp = useCallback(() => {
    if (!newsDetail) return;
    const url = window.location.href;
    const text = `${newsDetail.judul}\n\n${url}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [newsDetail]);

  const shareToFacebook = useCallback(() => {
    const url = window.location.href;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin ke clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Gagal menyalin link");
    }
  }, []);

  // Fetch function
  const fetchDetailNews = useCallback(async () => {
    if (!id) {
      setError(new Error("ID berita tidak ditemukan"));
      setIsLoading(false);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Fetching news detail for ID:", id);

      const response = await axiosClient.get(`/info-tani/${id}`, {
        params: { _t: Date.now() },
      });

      console.log("✅ Raw API Response:", response.data);

      const data = response.data;
      let detailData: NewsDetail | null = null;

      // Try different response structures
      if (data.infotani) {
        detailData = data.infotani;
      } else if (data.data) {
        detailData = data.data;
      } else if (data.id) {
        detailData = data as NewsDetail;
      }

      if (!detailData) {
        throw new Error("Data berita tidak ditemukan dalam response");
      }

      // Log and clean image URL
      console.log("🖼️ Raw image URL from API:", detailData.fotoBerita);
      console.log(
        "🖼️ Cleaned image URL:",
        cleanImageUrl(detailData.fotoBerita),
      );
      console.log("🖼️ URL validation:", isValidImageUrl(detailData.fotoBerita));

      setNewsDetail(detailData);
    } catch (err: any) {
      console.error("❌ Error fetching news detail:", err);

      if (err.response?.status === 404) {
        setError(new Error("Berita tidak ditemukan"));
      } else if (err.response?.status === 500) {
        setError(new Error("Terjadi kesalahan pada server"));
      } else if (err.code === "NETWORK_ERROR" || !navigator.onLine) {
        setError(new Error("Tidak ada koneksi internet"));
      } else {
        setError(
          new Error(
            err.response?.data?.message || err.message || "Gagal memuat berita",
          ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetailNews();
  }, [fetchDetailNews]);

  // Header component
  const renderHeader = (title: string) => (
    <div className="p-3 sm:p-5">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
        <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
          <NavbarStaticItem index={2} />
        </div>

        {/* Responsive Breadcrumbs */}
        <div className="hidden sm:block">
          <Breadcrumbs>
            <BreadcrumbItem
              classNames={{
                base: "hover:cursor-pointer text-[#003F75] font-semibold",
                item: "hover:cursor-pointer text-[#003F75]",
                separator: "text-[#003F75]",
              }}
              href="/"
            >
              Home
            </BreadcrumbItem>
            <BreadcrumbItem
              classNames={{
                base: "hover:cursor-pointer text-[#003F75] font-semibold",
                item: "hover:cursor-pointer text-[#003F75]",
                separator: "text-[#003F75]",
              }}
              href="/home/information"
            >
              Informasi Pertanian
            </BreadcrumbItem>
            <BreadcrumbItem
              classNames={{
                base: "text-[#003F75] font-semibold",
                item: "text-[#003F75]",
              }}
            >
              {title.length > 40 ? title.substring(0, 40) + "..." : title}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* Mobile Breadcrumbs */}
        <div className="sm:hidden text-[#003F75] text-sm font-medium">
          Home / Informasi /{" "}
          {title.length > 20 ? title.substring(0, 20) + "..." : title}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HomeLayout>
        {/* Loading State */}
        {isLoading && (
          <>
            {renderHeader("Memuat Berita...")}
            <DetailNewsSkeleton />
          </>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <>
            {renderHeader("Error")}
            <div className="w-full max-w-11/12 mx-auto px-3 sm:px-5">
              <ErrorDisplay
                message={error.message}
                title="Gagal Memuat Berita"
                onRetry={fetchDetailNews}
              />
            </div>
          </>
        )}

        {/* Success State */}
        {!isLoading && !error && newsDetail && (
          <>
            {renderHeader(newsDetail.judul)}

            {/* Back Button */}
            <div className="w-full max-w-11/12 mx-auto px-3 sm:px-5 mb-6 -mt-4 sm:-mt-8">
              <Button
                as={Link}
                className="bg-white shadow-md hover:shadow-lg border border-gray-200 transition-shadow"
                size="sm"
                startContent={<FaArrowLeft />}
                to="/home/information"
              >
                Kembali
              </Button>
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-11/12 mx-auto px-3 sm:px-5 space-y-6 sm:space-y-8">
              {/* Clean Hero Image Section */}
              <div className="w-full">
                <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-gray-100">
                  <ImageWithFallback
                    alt={newsDetail.judul}
                    className="w-full h-64 sm:h-80 lg:h-96 xl:h-[28rem] object-cover"
                    fallbackSrc={assets.imagePerangkapTikus}
                    src={newsDetail.fotoBerita}
                    onError={() => console.warn("All image sources failed")}
                  />
                </div>
              </div>

              {/* Article Header - Now Below Image */}
              <div className="space-y-4 sm:space-y-6">
                {/* Category Badge */}
                {newsDetail.kategori && (
                  <div className="flex justify-start">
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                      {newsDetail.kategori}
                    </span>
                  </div>
                )}

                {/* Article Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  {newsDetail.judul}
                </h1>

                {/* Author and Date Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 sm:py-6 border-b border-gray-200">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                      <FaRegCircleUser size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-base">
                        {newsDetail.createdBy || "Admin"}
                      </p>
                      <p className="text-sm text-gray-500">Penulis</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaRegCalendarAlt className="flex-shrink-0" size={18} />
                    <span className="text-sm">
                      {formatDate(newsDetail.tanggal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: newsDetail.isi || "<p>Konten tidak tersedia.</p>",
                  }}
                  className="text-justify text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-headings:font-bold prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-2"
                />
              </div>

              {/* Share Section */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="font-semibold text-gray-900 text-lg">
                    Bagikan Artikel:
                  </h2>

                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      className="bg-green-500 text-white hover:bg-green-600 transition-colors"
                      size="sm"
                      startContent={<FaWhatsapp />}
                      onClick={shareToWhatsApp}
                    >
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">WA</span>
                    </Button>

                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      size="sm"
                      startContent={<FaFacebook />}
                      onClick={shareToFacebook}
                    >
                      <span className="hidden sm:inline">Facebook</span>
                      <span className="sm:hidden">FB</span>
                    </Button>

                    <Button
                      className="bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                      size="sm"
                      startContent={<FaCopy />}
                      onClick={copyToClipboard}
                    >
                      <span className="hidden sm:inline">Salin Link</span>
                      <span className="sm:hidden">Copy</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">
                  Tertarik dengan informasi pertanian lainnya?
                </h3>
                <p className="text-blue-700 mb-4 text-sm sm:text-base">
                  Jelajahi artikel dan kegiatan pertanian lainnya di Siketan
                  Ngawi
                </p>
                <Button
                  as={Link}
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  to="/home/information"
                >
                  Lihat Semua Informasi
                </Button>
              </div>

              {/* Bottom Spacing */}
              <div className="h-8" />
            </div>
          </>
        )}
      </HomeLayout>
      <Footer />
    </>
  );
};
