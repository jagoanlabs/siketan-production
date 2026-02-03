// types/AcaraPertanian/editAcara.d.ts
export interface UpdateAcaraRequest {
  namaKegiatan: string;
  tanggalAcara: string; // format: YYYY-MM-DD
  waktuAcara: string; // format: HH:mm - HH:mm
  tempat: string;
  peserta: string;
  createdBy: string;
  isi: string;
  fotoKegiatan?: File | null;
}

export interface EditAcaraFormData {
  namaKegiatan: string;
  tanggalAcara: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempat: string;
  peserta: string;
  isi: string;
  fotoKegiatan?: File | null;
}

export interface AcaraData {
  id: number;
  namaKegiatan: string;
  tanggalAcara: string; // ISO string format from backend
  waktuAcara: string;
  tempat: string;
  peserta: string;
  fotoKegiatan: string;
  createdBy: string;
  isi: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AcaraDetailResponse {
  message: string;
  infotani: AcaraData; // Backend returns 'infotani' not 'evenTani'
}

export interface UpdateAcaraResponse {
  message: string;
}

export interface EditAcaraFormErrors {
  namaKegiatan?: string;
  tanggalAcara?: string;
  waktuMulai?: string;
  waktuSelesai?: string;
  tempat?: string;
  peserta?: string;
  isi?: string;
  fotoKegiatan?: string;
}
