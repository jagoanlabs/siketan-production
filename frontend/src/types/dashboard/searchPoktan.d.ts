export interface DashoardDataPotkan {
  id: number;
  gapoktan: string;
  namaKelompok: string;
  desa: string;
  kecamatan: string;
  penyuluh: string;
  createdAt: null | Date;
  updatedAt: Date | null;
  kecamatanId: number;
  desaId: number;
  kecamatanData: KecamatanData;
  desaData: DesaData;
}

interface DesaData {
  id: number;
  nama: string;
  kecamatanId: number;
  type: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface KecamatanData {
  id: number;
  nama: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
