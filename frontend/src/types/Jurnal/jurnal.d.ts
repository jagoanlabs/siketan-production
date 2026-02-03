// types/jurnal.ts
export interface Jurnal {
  id: number;
  judul: string;
  tanggalDibuat: string;
  uraian: string;
  gambar: string | null;
  statusJurnal: string;
  pengubah: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_penyuluhId: number | null;
  dataPenyuluh: {
    id: number;
    nik: string;
    nama: string;
    foto: string | null;
    alamat: string;
    email: string;
    noTelp: string;
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
    desaId: number | null;
  } | null;
}

export interface JurnalResponse {
  message: string;
  newData: Jurnal[];
}

export interface JurnalQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  penyuluhId?: number;
}
