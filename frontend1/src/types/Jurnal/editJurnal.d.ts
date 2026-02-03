// types/Jurnal/editJurnal.ts
export interface JurnalDetail {
  id: number;
  judul: string;
  tanggalDibuat: string;
  uraian: string;
  gambar?: string;
  statusJurnal: string;
  pengubah: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_penyuluhId: number;
  dataPenyuluh: {
    id: number;
    nik: string;
    nama: string;
    foto?: string;
    alamat: string;
    email: string;
    noTelp: string;
    kecamatan: string;
    desa: string;
    desaBinaan: string;
    kecamatanBinaan: string;
  };
}

export interface JurnalDetailResponse {
  message: string;
  newData: JurnalDetail;
}

export interface UpdateJurnalRequest {
  judul: string;
  uraian: string;
  statusJurnal: "draft" | "publish";
  NIK: string;
  gambar?: File;
}

export interface UpdateJurnalResponse {
  message: string;
  newData: any;
}
