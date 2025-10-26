import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils"; // fallback ke string biasa jika belum ada
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { axiosClient } from "@/service/app-service";

interface Product {
  id: number;
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  fotoTanaman: string;
  status: string;
  accountID: string;
  tbl_akun: {
    id: number;
    nama: string;
    foto: string | null;
    email: string;
    no_wa: string;
    pekerjaan: string;
    peran: string;
    accountID: string;
    dataPetani?: {
      desa: string;
      kecamatan: string;
      alamat: string;
    };
    dataPenyuluh?: {
      desa: string;
      kecamatan: string;
      alamat: string;
    };
  };
}

const CardSkeleton = () => (
  <div className="border border-gray-200 rounded-lg p-4 shadow-sm w-full">
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="bg-gray-300 h-40 rounded-md" />
      <div className="space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
      </div>
    </div>
  </div>
);

export const SectionTokoPertanian = () => {
  const [selectedTab, setSelectedTab] = useState<"produk" | "toko">("produk");
  const [rawData, setRawData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/product-petani-no-auth");

      setRawData(response.data.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil data produk:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Data produk langsung dari API
  const productData = useMemo(() => rawData, [rawData]);

  // Data toko unik (filter berdasarkan accountID)
  const uniqueStoresData = useMemo(() => {
    const uniqueAccounts = new Map<string, Product["tbl_akun"]>();

    rawData.forEach((product) => {
      if (product.tbl_akun && !uniqueAccounts.has(product.tbl_akun.accountID)) {
        uniqueAccounts.set(product.tbl_akun.accountID, product.tbl_akun);
      }
    });

    return Array.from(uniqueAccounts.values());
  }, [rawData]);

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Gagal memuat data. Silakan coba lagi.
      </div>
    );
  }

  // Data produk dibatasi 5 item
  const limitedProductData = useMemo(
    () => productData.slice(0, 5),
    [productData],
  );

  // Data toko unik dibatasi 5 item
  const limitedStoresData = useMemo(
    () => uniqueStoresData.slice(0, 5),
    [uniqueStoresData],
  );

  return (
    <div
      className="w-full  mt-10  xl:w-11/12 xl:mx-auto sm:mt-16 lg:mt-20"
      id="toko-pertanian"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex p-1 bg-gray-100 rounded-full sm:p-0 sm:bg-transparent sm:rounded-none">
          <button
            className={cn(
              "px-3 py-1.5 sm:px-0 sm:py-0 rounded-full sm:rounded-none text-sm sm:text-xl lg:text-2xl font-medium sm:font-semibold transition-all duration-200",
              selectedTab === "produk"
                ? "bg-white text-black shadow-sm sm:bg-transparent sm:shadow-none"
                : "text-gray-500 hover:text-gray-700",
              "sm:mr-6 lg:mr-10 sm:pb-2 sm:relative",
            )}
            onClick={() => setSelectedTab("produk")}
          >
            Produk
            {selectedTab === "produk" && (
              <div className="absolute bottom-0 left-0 right-0 hidden h-1 bg-green-600 rounded-full sm:block" />
            )}
          </button>

          <button
            className={cn(
              "px-3 py-1.5 sm:px-0 sm:py-0 rounded-full sm:rounded-none text-sm sm:text-xl lg:text-2xl font-medium sm:font-semibold transition-all duration-200",
              selectedTab === "toko"
                ? "bg-white text-black shadow-sm sm:bg-transparent sm:shadow-none"
                : "text-gray-500 hover:text-gray-700",
              "sm:pb-2 sm:relative",
            )}
            onClick={() => setSelectedTab("toko")}
          >
            Toko
            {selectedTab === "toko" && (
              <div className="absolute bottom-0 left-0 right-0 hidden h-1 bg-green-600 rounded-full sm:block" />
            )}
          </button>
        </div>

        <Button
          as={Link}
          className="text-red-500 bg-red-200 rounded-full hover:bg-red-300 hover:text-red-600"
          to="/home/toko"
          onPress={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
        >
          Selengkapnya
        </Button>
      </div>

      {/* Content Section */}
      <div className="mt-4 sm:mt-6">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
            {[...Array(5)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : selectedTab === "produk" ? (
          <>
            {/* Mobile Horizontal Scroll */}
            <div className="sm:hidden">
              <div className="px-4 pb-4 -mx-4 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {limitedProductData.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-40">
                      <ProductCard
                        imageUrl={product.fotoTanaman}
                        link={`/home/toko/product/${product.id}`}
                        price={product.harga}
                        title={product.namaProducts}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                <span className="text-xs text-gray-400">
                  ← Geser untuk melihat lebih banyak →
                </span>
              </div>
            </div>

            {/* Tablet and Desktop Grid */}
            <div className="hidden gap-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {limitedProductData.map((product) => (
                <ProductCard
                  key={product.id}
                  imageUrl={product.fotoTanaman}
                  link={`/home/toko/product/${product.id}`}
                  price={product.harga}
                  title={product.namaProducts}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Toko Tab Content */}
            <div className="sm:hidden">
              <div className="px-4 pb-4 -mx-4 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                  {limitedStoresData.map((store) => (
                    <div key={store.accountID} className="flex-shrink-0 w-40">
                      <StoreCard
                        description={store.pekerjaan}
                        imageUrl={store.foto || ""}
                        link={`/home/toko/toko/${store.accountID}`}
                        location={
                          store.dataPenyuluh?.kecamatan ||
                          store.dataPetani?.kecamatan ||
                          ""
                        }
                        title={store.nama}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-1 mt-2">
                <span className="text-xs text-gray-400">
                  ← Geser untuk melihat lebih banyak →
                </span>
              </div>
            </div>

            <div className="hidden gap-4 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
              {limitedStoresData.map((store) => (
                <StoreCard
                  key={store.id}
                  description={store.pekerjaan}
                  imageUrl={store.foto || ""}
                  link={`/home/toko/toko/${store.id}`}
                  location={
                    store.dataPenyuluh?.kecamatan ||
                    store.dataPetani?.kecamatan ||
                    ""
                  }
                  title={store.nama}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
