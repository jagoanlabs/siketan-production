import { useParams } from "react-router-dom";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Button } from "@heroui/button";
import { IoMdShare } from "react-icons/io";
import { useEffect, useState } from "react";

import { ProductTabs } from "../components/ProductTabs";

import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { Footer } from "@/features/Home/components/Footer";
import { ImageCarousel } from "@/components/ImageCarousel";
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
    email: string | null;
    no_wa: string;
    nama: string;
    password: string | null;
    pekerjaan: string | null;
    peran: string;
    foto: string | null;
    accountID: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    petani: {
      id: number;
      nik: string;
      nkk: string | null;
      foto: string | null;
      nama: string;
      alamat: string;
      desa: string;
      kecamatan: string;
      password: string | null;
      email: string | null;
      noTelp: string;
      accountID: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      fk_penyuluhId: number | null;
      fk_kelompokId: number | null;
      kecamatanId: number;
      desaId: number;
    } | null;
    penyuluh: {
      id: number;
      nik: string;
      nama: string;
      foto: string | null;
      alamat: string;
      email: string;
      noTelp: string;
      password: string;
      namaProduct: string;
      kecamatan: string;
      desa: string;
      desaBinaan: string;
      kecamatanBinaan: string;
      accountID: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      kecamatanId: number;
      desaId: number;
    } | null;
  };
}

interface ApiResponse {
  message: string;
  data: ProductData;
}
export const DetailProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axiosClient.get<ApiResponse>(
          `/product-petani/${id}`,
        );

        setProductData(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Helper function to get seller data based on profesiPenjual
  const getSellerData = () => {
    if (!productData) return null;
    
    if (productData.profesiPenjual === "petani" && productData.tbl_akun.petani) {
      return {
        nama: productData.tbl_akun.petani.nama,
        email: productData.tbl_akun.petani.email || productData.tbl_akun.email,
        no_wa: productData.tbl_akun.petani.noTelp || productData.tbl_akun.no_wa,
        desa: productData.tbl_akun.petani.desa,
        kecamatan: productData.tbl_akun.petani.kecamatan,
        accountID: productData.tbl_akun.petani.accountID,
        alamat: productData.tbl_akun.petani.alamat,
      };
    } else if (productData.profesiPenjual === "penyuluh" && productData.tbl_akun.penyuluh) {
      return {
        nama: productData.tbl_akun.penyuluh.nama,
        email: productData.tbl_akun.penyuluh.email,
        no_wa: productData.tbl_akun.penyuluh.noTelp,
        desa: productData.tbl_akun.penyuluh.desa,
        kecamatan: productData.tbl_akun.penyuluh.kecamatan,
        accountID: productData.tbl_akun.penyuluh.accountID,
        alamat: productData.tbl_akun.penyuluh.alamat || "",
      };
    }
    
    // Fallback to tbl_akun data if specific role data is not available
    return {
      nama: productData.tbl_akun.nama,
      email: productData.tbl_akun.email,
      no_wa: productData.tbl_akun.no_wa,
      desa: "",
      kecamatan: "",
      accountID: productData.tbl_akun.accountID,
      alamat: "",
    };
  };

  // Format currency
  const formatCurrency = (price: string) => {
    return `Rp${parseInt(price).toLocaleString("id-ID")}`;
  };

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
  if (error || !productData) {
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

  const sellerData = getSellerData();

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
                  href="home/toko"
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
                  {productData.namaProducts}
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>

            {/* Mobile Breadcrumbs - Simplified */}
            <div className="sm:hidden text-[#003F75] text-sm font-medium">
              Home / Toko / {productData.namaProducts}
            </div>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 mb-20 sm:mb-40 lg:mb-80">
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8 relative">
            {/* Product Images and Details */}
            <div className="w-full lg:flex-1 flex flex-col lg:flex-row gap-6 lg:gap-12 xl:gap-28">
              {/* Image Carousel */}
              <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                <ImageCarousel
                  className="w-full max-w-sm sm:max-w-md lg:max-w-sm"
                  images={[productData.fotoTanaman]} // Currently single image, ready for multiple images
                />
              </div>

              {/* Product Info */}
              <div className="w-full lg:flex-1 space-y-3 sm:space-y-4 lg:space-y-5">
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {productData.namaProducts}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base lg:text-lg text-gray-600">
                      Satuan: {productData.satuan}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        productData.status === "Ready stock" || productData.status === "Tersedia"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {productData.status}
                    </span>
                  </div>
                </div>

                {/* Price and Stock */}
                <div className="space-y-2 sm:space-y-3 py-2 sm:py-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                    {formatCurrency(productData.harga)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        productData.stok > 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <h3
                      className={`text-sm sm:text-base font-medium ${
                        productData.stok > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Stok Tersedia: {productData.stok}
                    </h3>
                  </div>
                </div>

                {/* Product Tabs */}
                <div className="pt-4 sm:pt-6 lg:pt-8">
                  <ProductTabs
                    address={sellerData?.alamat || ""}
                    content={productData.deskripsi}
                    desa={sellerData?.desa || ""}
                    email={sellerData?.email || ""}
                    kecamatan={sellerData?.kecamatan || ""}
                    owner={sellerData?.nama || ""}
                    phone={sellerData?.no_wa || ""}
                    productName={productData.namaProducts}
                    profession={productData.profesiPenjual}
                  />
                </div>
              </div>
            </div>

            {/* Share Button - Responsive positioning */}
            <div className="w-full lg:w-auto mt-6 lg:mt-0">
              <div className="flex justify-center lg:justify-end">
                <Button
                  className="text-base sm:text-lg text-blue-500 border-blue-500 border-2 hover:bg-blue-50 transition-colors px-6 py-2 min-w-[120px]"
                  variant="bordered"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: productData.namaProducts,
                        text: `${productData.namaProducts} - ${formatCurrency(productData.harga)}`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      // You can add a toast notification here
                    }
                  }}
                >
                  <IoMdShare className="text-lg sm:text-xl" />
                  <span className="hidden sm:inline">Bagikan</span>
                  <span className="sm:hidden">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
