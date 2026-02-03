// Types
interface DataTanaman {
  id: number;
  statusKepemilikanLahan: string;
  luasLahan: string;
  kategori: string;
  jenis: string;
  komoditas: string;
  periodeMusimTanam: string;
  periodeBulanTanam: string;
  prakiraanLuasPanen: number;
  prakiraanProduksiPanen: number;
  prakiraanBulanPanen: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_petaniId: number;
  dataPetani: any;
}

interface TanamanResponse {
  message: string;
  data: DataTanaman[];
  total: number;
  currentPages: number;
  limit: number;
  maxPages: number;
  from: number;
  to: number;
}
