export interface EventTani {
  id: number;
  namaKegiatan: string;
  tanggalAcara: string;
  waktuAcara: string;
  tempat: string;
  peserta: string;
  fotoKegiatan: string;
  createdBy: string;
  isi: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface InfoTani {
  id: number;
  judul: string;
  tanggal: string;
  status: string | null;
  kategori: string;
  fotoBerita: string;
  createdBy: string;
  isi: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EventTaniResponse {
  message: string;
  infotani: EventTani[];
}

export interface InfoTaniResponse {
  message: string;
  infotani: InfoTani[];
}
