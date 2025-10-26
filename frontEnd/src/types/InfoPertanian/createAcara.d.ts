// types/AcaraPertanian/acara.d.ts
export interface CreateAcaraRequest {
  namaKegiatan: string;
  tanggalAcara: string; // format: YYYY-MM-DD
  waktuAcara: string; // format: HH:mm - HH:mm
  tempat: string;
  peserta: string;
  isi: string;
  fotoKegiatan?: File | null;
}

export interface CreateAcaraFormData {
  namaKegiatan: string;
  tanggalAcara: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempat: string;
  peserta: string;
  isi: string;
  fotoKegiatan?: File | null;
}

export interface AcaraResponse {
  message: string;
  evenTani: {
    id: string | number;
    namaKegiatan: string;
    tanggalAcara: string;
    waktuAcara: string;
    tempat: string;
    peserta: string;
    fotoKegiatan: string;
    createdBy: string;
    isi: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AcaraFormErrors {
  namaKegiatan?: string;
  tanggalAcara?: string;
  waktuMulai?: string;
  waktuSelesai?: string;
  tempat?: string;
  peserta?: string;
  isi?: string;
  fotoKegiatan?: string;
}
