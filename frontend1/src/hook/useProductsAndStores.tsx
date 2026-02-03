import { useQuery } from "@tanstack/react-query";

import { axiosClient } from "@/service/app-service";

export const useProductsAndStores = () => {
  return useQuery({
    queryKey: ["products-and-stores"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/product-petani-no-auth");
      const allProducts = data.data;

      // Produk: langsung pakai data asli
      const products = allProducts.map((item: any) => ({
        id: item.id,
        nama: item.namaProducts,
        harga: item.harga,
        foto: item.fotoTanaman,
        stok: item.stok,
        satuan: item.satuan,
      }));

      // Toko: ambil tbl_akun, tapi hanya yang unik berdasarkan accountID
      const storesMap = new Map();

      allProducts.forEach((item: any) => {
        const acc = item.tbl_akun;

        if (!storesMap.has(acc.accountID)) {
          storesMap.set(acc.accountID, {
            id: acc.id,
            nama: acc.nama,
            email: acc.email,
            foto: acc.foto,
            no_wa: acc.no_wa,
          });
        }
      });
      const stores = Array.from(storesMap.values());

      return { products, stores };
    },
  });
};
