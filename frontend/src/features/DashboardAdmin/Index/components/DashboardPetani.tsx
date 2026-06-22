import React, { useState } from "react";
import { useAuth } from "@/hook/UseAuth";
import { useDashboardData } from "@/hook/dashboard/useDashboardDataCard";
import { useProductsAndStores } from "@/hook/useProductsAndStores";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { FiBookOpen, FiFileText, FiLayers } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/service/app-service";

export const DashboardPetani: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "stores">("products");

  // Fetch counts
  const { data: dashboardData, isLoading: isStatsLoading } = useDashboardData();
  const { data: tanamanResponse, isLoading: isTanamanLoading } = useQuery({
    queryKey: ["farmerCropsCount"],
    queryFn: async () => {
      const response = await axiosClient.get("/list-tanaman", {
        params: { limit: 1, page: 1 }
      });
      return response.data;
    },
    staleTime: 30000,
  });

  // Fetch products and stores
  const { data: productsStoresData, isLoading: isProductsLoading } = useProductsAndStores();

  const totalBerita = dashboardData?.berita || 0;
  const totalArtikel = dashboardData?.artikel || 0;
  const totalCrops = tanamanResponse?.total || 0;

  const limitedProducts = productsStoresData?.products?.slice(0, 5) || [];
  const limitedStores = productsStoresData?.stores?.slice(0, 5) || [];

  const isLoading = isStatsLoading || isTanamanLoading || isProductsLoading;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <FiLayers size={240} />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="bg-blue-500 bg-opacity-30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Dashboard Petani
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Selamat Datang Kembali, {user?.nama}!
          </h1>
          <p className="text-blue-100 text-lg max-w-xl">
            Kelola data tanaman Anda, lihat artikel terbaru, dan pantau produk serta toko pertanian di sekitar Anda.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Jumlah Berita */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <FiBookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jumlah Berita</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {isStatsLoading ? "..." : totalBerita}
            </h3>
          </div>
        </div>

        {/* Card Jumlah Artikel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="p-4 rounded-xl bg-green-50 text-green-600">
            <FiFileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Jumlah Artikel</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {isStatsLoading ? "..." : totalArtikel}
            </h3>
          </div>
        </div>

        {/* Card Jumlah Tanaman Petani */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <FiLayers size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tanaman Petani Anda</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {isTanamanLoading ? "..." : totalCrops}
            </h3>
          </div>
        </div>
      </div>

      {/* Products & Stores Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Eksplorasi Toko & Produk</h2>
            <p className="text-sm text-gray-500 mt-0.5">Lihat produk pertanian dan toko penyedia terdekat</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "products"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Produk Petani
            </button>
            <button
              onClick={() => setActiveTab("stores")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "stores"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Toko Pertanian
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            <p className="text-sm text-gray-500 mt-3 font-medium">Memuat data...</p>
          </div>
        ) : (
          <div>
            {activeTab === "products" ? (
              limitedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {limitedProducts.map((prod: any) => (
                    <ProductCard
                      key={prod.id}
                      imageUrl={prod.foto}
                      link={`/home/toko/product/${prod.id}`}
                      price={prod.harga}
                      title={prod.nama}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">Belum ada produk terdaftar saat ini.</p>
                </div>
              )
            ) : (
              limitedStores.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {limitedStores.map((store: any) => (
                    <StoreCard
                      key={store.id}
                      description={store.email}
                      imageUrl={store.foto || ""}
                      link={`/home/toko/toko/${store.id}`}
                      location={store.email}
                      title={store.nama}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">Belum ada toko terdaftar saat ini.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
