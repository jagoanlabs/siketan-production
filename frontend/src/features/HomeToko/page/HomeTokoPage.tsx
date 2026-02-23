import { useState, useEffect, useCallback, useMemo } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Pagination } from "@heroui/pagination";

import { cn } from "@/lib/utils";
import { axiosClient } from "@/service/app-service";
import HomeLayout from "@/layouts/HomeLayout";
import { NavbarStaticItem } from "@/components/NavBarStaticItem";
import { ProductCard } from "@/components/ProductCard";
import { StoreCard } from "@/components/StoreCard";
import { Footer } from "@/features/Home/components/Footer";
import { SectionInfoPertanianCard } from "@/components/SectionInfoPertanianCard";

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

// interface ApiResponse {
//   data: Product[];
//   meta: {
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//   };
// }

export const HomeTokoPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"produk" | "toko">("produk");
  const [productPage, setProductPage] = useState(1);
  const [storePage, setStorePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<Product[]>([]);
  const itemsPerPage = 20;

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(
        "/product-petani-no-auth?limit=100&page=1",
      );

      setApiData(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Process product data
  const productData = useMemo(() => apiData, [apiData]);

  // Process store data (unique by accountID)
  const storeData = useMemo(() => {
    const storeMap = new Map<string, Product["tbl_akun"]>();

    apiData.forEach((item) => {
      if (item.tbl_akun && !storeMap.has(item.tbl_akun.accountID)) {
        storeMap.set(item.tbl_akun.accountID, item.tbl_akun);
      }
    });

    return Array.from(storeMap.values());
  }, [apiData]);

  // Pagination logic for products
  const currentProducts = useMemo(() => {
    const startIndex = (productPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return productData.slice(startIndex, endIndex);
  }, [productPage, productData]);

  const totalProductPages = useMemo(() => {
    return Math.ceil(productData.length / itemsPerPage);
  }, [productData.length]);

  // Pagination logic for stores
  const currentStores = useMemo(() => {
    const startIndex = (storePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return storeData.slice(startIndex, endIndex);
  }, [storePage, storeData]);

  const totalStorePages = useMemo(() => {
    return Math.ceil(storeData.length / itemsPerPage);
  }, [storeData.length]);

  return (
    <>
      <HomeLayout>
        <div className="p-5">
          <div className="w-full px-10 py-5 text-center h-52 rounded-3xl bg-gradient-to-b from-[#7AD4F6] to-transparent">
            <div className="flex flex-col items-center justify-center mb-6 ">
              <NavbarStaticItem index={3} />
            </div>
            <Breadcrumbs>
              <BreadcrumbItem
                classNames={{
                  base: "hover:cursor-pointer text-[#003F75] font-semibold",
                  item: "hover:cursor-pointer text-[#003F75] ",
                  separator: " text-[#003F75]",
                }}
                href="/"
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                classNames={{
                  base: " text-[#003F75] font-semibold",
                  item: " text-[#003F75]",
                  separator: " text-[#003F75]",
                }}
              >
                Toko
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>
        <SectionInfoPertanianCard
          subtitle="Informasi Toko Pertanian di Kab. Ngawi"
          title="Toko Pertanian"
        />
        <div className="flex flex-col w-11/12 mx-auto space-x-6">
          <div className="flex flex-col w-11/12 mx-auto space-x-6">
            <div className="relative flex items-center gap-10 mb-5">
              <button
                className="relative flex flex-col items-center bg-transparent border-none cursor-pointer"
                onClick={() => {
                  setSelectedTab("produk");
                  setProductPage(1);
                }}
              >
                <h1
                  className={cn(
                    "text-2xl font-semibold transition",
                    selectedTab === "produk" ? "text-black" : "text-gray-500",
                  )}
                >
                  Produk
                </h1>
                {selectedTab === "produk" && (
                  <div className="absolute w-full h-1 mt-1 bg-blue-600 rounded-full -bottom-3" />
                )}
              </button>

              <button
                className="relative flex flex-col items-center bg-transparent border-none cursor-pointer"
                onClick={() => {
                  setSelectedTab("toko");
                  setStorePage(1);
                }}
              >
                <h1
                  className={cn(
                    "text-2xl font-semibold transition",
                    selectedTab === "toko" ? "text-black" : "text-gray-500",
                  )}
                >
                  Toko
                </h1>
                {selectedTab === "toko" && (
                  <div className="absolute w-full h-1 mt-2 bg-blue-600 rounded-full -bottom-3" />
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 mb-6 text-center text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                  {[...Array(itemsPerPage)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 shadow-sm w-full"
                    >
                      <div className="animate-pulse flex flex-col space-y-4">
                        <div className="bg-gray-300 h-40 rounded-md" />
                        <div className="space-y-3">
                          <div className="h-5 bg-gray-300 rounded w-3/4" />
                          <div className="h-4 bg-gray-300 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedTab === "produk" ? (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                    {currentProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        imageUrl={product.fotoTanaman}
                        link={`/home/toko/product/${product.id}`}
                        price={product.harga}
                        title={product.namaProducts}
                      />
                    ))}
                  </div>
                  {totalProductPages > 1 && (
                    <div className="flex items-center justify-center mt-10">
                      <Pagination
                        key="product-pagination"
                        showControls
                        page={productPage}
                        total={totalProductPages}
                        onChange={setProductPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
                    {currentStores.map((store) => {
                      const location =
                        store.dataPenyuluh?.kecamatan ||
                        store.dataPetani?.kecamatan ||
                        "";

                      return (
                        <StoreCard
                          key={store.id}
                          description={store.pekerjaan}
                          imageUrl={store.foto ?? ""}
                          link={`/home/toko/toko/${store.id}`}
                          location={location}
                          title={store.nama}
                        />
                      );
                    })}
                  </div>
                  {totalStorePages > 1 && (
                    <div className="flex items-center justify-center mt-10">
                      <Pagination
                        key="store-pagination"
                        showControls
                        page={storePage}
                        total={totalStorePages}
                        onChange={setStorePage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
};
