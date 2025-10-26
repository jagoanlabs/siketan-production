import React from "react";
import { FiPackage, FiShoppingBag, FiCalendar } from "react-icons/fi";

import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { NewsCard } from "@/components/NewsCard";

interface SearchResultsProps {
  results: any[];
  isLoading: boolean;
  selectedCategory: string;
  searchData?: any;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  selectedCategory,
  searchData,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="bg-gray-100 rounded-xl h-64" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No results
  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-gray-400 mb-4">
          <FiPackage className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Tidak ada hasil ditemukan
        </h3>
        <p className="text-gray-500">
          Coba ubah kata kunci atau filter pencarian Anda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Produk */}
      {(selectedCategory === "product" || selectedCategory === "all") &&
        searchData?.data?.products?.items?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FiShoppingBag className="w-5 h-5 text-[#1167B1]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Produk ({searchData.data.products.items.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchData.data.products.items.map((product: any) => (
                <ProductCard
                  key={product.id}
                  imageUrl={product.image || "/api/placeholder/300/300"}
                  link={`/home/toko/product/${product.id}`}
                  price={product.price}
                  title={product.title || product.namaProducts}
                />
              ))}
            </div>
            {searchData.data.products.items.length > 10 && (
              <button className="mt-4 text-[#1167B1] hover:underline">
                Lihat semua produk →
              </button>
            )}
          </section>
        )}

      {/* Toko */}
      {(selectedCategory === "toko" || selectedCategory === "all") &&
        searchData?.data?.tokos?.items?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="w-5 h-5 text-[#1167B1]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Toko ({searchData.data.tokos.items.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchData.data.tokos.items.map((store: any) => (
                <StoreCard
                  key={store.id}
                  description={store.description || ""}
                  imageUrl={store.profileToko || "/api/placeholder/300/200"}
                  link={`/home/toko/toko/${store.id}`}
                  location={store.address || "Lokasi tidak tersedia"}
                  title={store.namaToko || store.name}
                />
              ))}
            </div>
            {searchData.data.tokos.items.length > 8 && (
              <button className="mt-4 text-[#1167B1] hover:underline">
                Lihat semua toko →
              </button>
            )}
          </section>
        )}

      {/* Berita */}
      {(selectedCategory === "berita" || selectedCategory === "all") &&
        searchData?.data?.berita?.items?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-[#1167B1]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Berita ({searchData.data.berita.items.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchData.data.berita.items.map((event: any) => (
                <NewsCard
                  key={event.id}
                  author={event.author || event.createdBy}
                  createdAt={new Date(
                    event.publishedAt || event.createdAt,
                  ).toLocaleDateString("id-ID")}
                  description={
                    event.excerpt.replace(/<[^>]*>/g, "").substring(0, 100) +
                    "..."
                  }
                  id={event.id}
                  imageUrl={event.image || "/api/placeholder/400/250"}
                  title={event.title || event.judul}
                />
              ))}
            </div>
            {searchData.data.berita.items.length > 6 && (
              <button className="mt-4 text-[#1167B1] hover:underline">
                Lihat semua berita →
              </button>
            )}
          </section>
        )}

      {/* Lomba / Event */}
      {(selectedCategory === "lomba" || selectedCategory === "all") &&
        (searchData?.data?.events?.items?.length > 0 ||
          searchData?.data?.lomba?.items?.length > 0) && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="w-5 h-5 text-[#1167B1]" />
              <h2 className="text-lg font-semibold text-gray-900">
                Lomba / Event
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ...(searchData.data.events?.items || []),
                ...(searchData.data.lomba?.items || []),
              ].map((event: any) => (
                <NewsCard
                  key={event.id}
                  author={event.organizer || "Penyelenggara"}
                  createdAt={new Date(
                    event.startDate || event.createdAt,
                  ).toLocaleDateString("id-ID")}
                  description={event.description || ""}
                  id={event.id}
                  imageUrl={event.image || "/api/placeholder/400/250"}
                  title={event.title}
                />
              ))}
            </div>
          </section>
        )}
    </div>
  );
};
