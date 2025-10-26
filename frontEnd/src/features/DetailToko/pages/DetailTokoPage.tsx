// DetailTokoPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { IoLogoWhatsapp, IoStorefrontOutline } from "react-icons/io5";
import { FaBox } from "react-icons/fa";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { IoMdShare } from "react-icons/io";

import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/features/Home/components/Footer";
import HomeLayout from "@/layouts/HomeLayout";
import { axiosClient } from "@/service/app-service";

interface ProductData {
  id: number;
  profesiPenjual: string;
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  fotoTanaman: string;
  status: string;
  accountID: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  tbl_akun: {
    id: number;
    email: string;
    no_wa: string;
    nama: string;
    password: string;
    pekerjaan: string;
    peran: string;
    foto: string | null;
    accountID: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface ApiResponse {
  message: string;
  data: ProductData[];
}

export const DetailTokoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokoInfo, setTokoInfo] = useState<ProductData["tbl_akun"] | null>(
    null,
  );

  // State untuk paginasi
  const [ProductPage, setProductPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch data dari API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axiosClient.get<ApiResponse>(
          `/list-product/${id}`,
        );
        const productsData = response.data?.data || [];

        setProducts(productsData);

        // Set toko info dari produk pertama (semua produk dari toko yang sama)
        if (productsData.length > 0) {
          setTokoInfo(productsData[0].tbl_akun);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Logika untuk data produk dengan pagination - dengan safe checks
  const safeProducts = products || [];
  const indexOfLastProduct = ProductPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = safeProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalProductPages = Math.ceil(safeProducts.length / itemsPerPage);

  // Format currency
  const formatCurrency = (price: string) => {
    return `${parseInt(price).toLocaleString("id-ID")}`;
  };

  // Transform data untuk ProductCard
  const transformedProducts = currentProducts.map((product) => ({
    image: product.fotoTanaman,
    title: product.namaProducts,
    price: `${formatCurrency(product.harga)}/${product.satuan.toLowerCase()}`,
    link: `/product/${product.id}`,
  }));

  // Loading state
  if (loading) {
    return (
      <HomeLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </HomeLayout>
    );
  }

  // Error state
  if (error || !tokoInfo) {
    return (
      <HomeLayout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="text-red-500 text-lg mb-4">
            {error || "Data tidak ditemukan"}
          </div>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </HomeLayout>
    );
  }

  return (
    <>
      <HomeLayout>
        {/* Header Section - Responsive */}
        <div className="p-3 sm:p-5">
          <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-5 text-center h-40 sm:h-48 lg:h-52 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-4 sm:mb-6">
              <NavbarStaticItem index={3} />
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
                    base: "text-[#003F75] font-semibold",
                    item: "text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                  href="/home/toko"
                >
                  Toko
                </BreadcrumbItem>
                <BreadcrumbItem
                  classNames={{
                    base: "text-[#003F75] font-semibold",
                    item: "text-[#003F75]",
                    separator: "text-[#003F75]",
                  }}
                >
                  {tokoInfo.nama}
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>

            {/* Mobile Breadcrumbs */}
            <div className="sm:hidden text-[#003F75] text-sm font-medium">
              Home / Toko / {tokoInfo.nama}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-11/12 mx-auto px-3 sm:px-5 lg:px-8">
          {/* Toko Header - Responsive */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-10 gap-6 lg:gap-0">
            {/* Toko Info */}
            {/* Toko Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
              {/* Avatar Toko */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-56 lg:h-56 bg-gray-100 border rounded-full overflow-hidden flex items-center justify-center">
                  {tokoInfo.foto ? (
                    <img
                      alt={tokoInfo.nama}
                      className="w-full h-full object-cover"
                      src={tokoInfo.foto}
                    />
                  ) : (
                    <IoStorefrontOutline className="text-gray-400" size={100} />
                  )}
                </div>
              </div>

              {/* Toko Details */}
              <div className="flex flex-col space-y-2 sm:space-y-3 text-center sm:text-left w-full sm:w-auto">
                {/* Nama Toko */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {tokoInfo.nama}
                </h1>

                {/* Role Badge */}
                <div className="flex justify-center sm:justify-start">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tokoInfo.peran === "penyuluh"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {tokoInfo.peran.charAt(0).toUpperCase() +
                      tokoInfo.peran.slice(1)}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-sm sm:text-base text-gray-600">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span>📧</span>
                    <span className="break-all">{tokoInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span>📱</span>
                    <span>{tokoInfo.no_wa}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm pt-2">
                  <div className="flex items-center gap-1">
                    <FaBox className="text-blue-500 text-sm" />
                    <span>{safeProducts.length} Produk</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tokoInfo.isVerified ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-xs">
                      {tokoInfo.isVerified
                        ? "Terverifikasi"
                        : "Belum Terverifikasi"}
                    </span>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="pt-2">
                  <Button
                    className="w-full sm:w-auto text-green-600 bg-green-100 hover:bg-green-200 transition-colors px-4 py-2 font-medium"
                    onClick={() =>
                      window.open(`https://wa.me/${tokoInfo.no_wa}`, "_blank")
                    }
                  >
                    <IoLogoWhatsapp className="text-green-600 text-lg" />
                    Hubungi Penjual
                  </Button>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <Button
                className="text-base sm:text-lg text-blue-500 border-blue-500 border-2 hover:bg-blue-50 transition-colors px-6 py-2 min-w-[120px]"
                variant="bordered"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: tokoInfo.nama,
                      text: `${tokoInfo.nama} - Toko ${tokoInfo.peran}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <IoMdShare className="text-lg sm:text-xl" />
                <span className="hidden sm:inline">Bagikan</span>
                <span className="sm:hidden">Share</span>
              </Button>
            </div>
          </div>

          {/* Produk Section */}
          <div className="mb-20">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Semua Produk
              </h2>
              <div className="text-sm sm:text-base text-gray-500">
                {products.length} produk tersedia
              </div>
            </div>

            {/* Products Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {transformedProducts.map((product, index) => (
                <div key={currentProducts[index].id} className="w-full">
                  <ProductCard
                    imageUrl={product.image}
                    link={`/home/toko${product.link}`}
                    price={product.price}
                    title={product.title}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {safeProducts.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <FaBox className="text-gray-300 text-4xl sm:text-6xl mb-4" />
                <h3 className="text-lg sm:text-xl font-medium text-gray-500 mb-2">
                  Tidak ada produk
                </h3>
                <p className="text-sm sm:text-base text-gray-400 text-center">
                  Toko ini belum memiliki produk yang tersedia
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalProductPages > 1 && (
              <div className="flex items-center justify-center mt-8 sm:mt-12">
                <Pagination
                  key="Product-pagination"
                  showControls
                  classNames={{
                    wrapper: "gap-0 overflow-visible h-8 sm:h-10",
                    item: "w-8 h-8 sm:w-10 sm:h-10 text-small",
                    cursor:
                      "bg-blue-600 shadow-lg from-blue-600 to-blue-700 text-white font-bold",
                  }}
                  page={ProductPage}
                  total={totalProductPages}
                  onChange={(page) => setProductPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
