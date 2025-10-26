// types/Jurnal/createJurnal.ts
export interface CreateJurnalRequest {
  NIK: string;
  judul: string;
  tanggalDibuat: string;
  uraian: string;
  statusJurnal: "draft" | "publish";
  gambar?: File;
}

export interface CreateJurnalResponse {
  message: string;
  dataJurnalHarian: {
    id: string;
    judul: string;
    tanggalDibuat: string;
    uraian: string;
    statusJurnal: string;
    gambar?: string;
    pengubah: string;
    fk_penyuluhId: string;
  };
}
