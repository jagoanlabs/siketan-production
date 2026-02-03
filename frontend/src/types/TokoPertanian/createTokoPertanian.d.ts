// types/TokoPertanian/createProduct.d.ts
export interface CreateProductFormData {
  profesiPenjual: "petani" | "penyuluh" | "";
  nik: string;
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  status: string;
  fotoTanaman?: File | null;
}

export interface CreateProductRequest {
  nik: string;
  profesiPenjual: "petani" | "penyuluh";
  namaProducts: string;
  stok: number;
  satuan: string;
  harga: string;
  deskripsi: string;
  status: string;
  fotoTanaman?: File | null;
}

export interface CreateProductFormErrors {
  profesiPenjual?: string;
  nik?: string;
  namaProducts?: string;
  stok?: string;
  satuan?: string;
  harga?: string;
  deskripsi?: string;
  status?: string;
  fotoTanaman?: string;
}

// NIK Check Types
export interface NikCheckRequest {
  nik: string;
}

export interface NikCheckResponse {
  message: string;
  user: {
    id: number;
    nik: string;
    nkk: string | null;
    foto: string | null;
    nama: string;
    alamat: string;
    desa: string;
    kecamatan: string;
    password: string | null;
    email: string | null;
    noTelp: string;
    accountID: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    fk_penyuluhId: number | null;
    fk_kelompokId: number | null;
    kecamatanId: number;
    desaId: number;
    tanamanPetanis: any[];
    kelompok: any | null;
    kecamatanData: {
      id: number;
      nama: string;
      createdAt: string;
      updatedAt: string;
    };
    desaData: {
      id: number;
      nama: string;
      kecamatanId: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// NIP Check Types
export interface NipCheckRequest {
  NIP: string;
}

export interface NipCheckResponse {
  message: string;
  user: {
    id: number;
    nik: string;
    nama: string;
    foto: string | null;
    alamat: string;
    email: string;
    noTelp: string;
    password: string;
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
    kecamatanData: {
      id: number;
      nama: string;
      createdAt: string;
      updatedAt: string;
    };
    desaData: {
      id: number;
      nama: string;
      kecamatanId: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    kecamatanBinaanData: Array<{
      id: number;
      penyuluhId: number;
      kecamatanId: number;
      createdAt: string;
      updatedAt: string;
      kecamatan: {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
      };
    }>;
    desaBinaanData: Array<{
      id: number;
      penyuluhId: number;
      desaId: number;
      createdAt: string;
      updatedAt: string;
      desa: {
        id: number;
        nama: string;
        kecamatanId: number;
        type: string;
        createdAt: string;
        updatedAt: string;
        kecamatan: {
          id: number;
          nama: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>;
  };
}

export interface CreateProductResponse {
  message: string;
  dataPenjual: {
    id: number;
    profesiPenjual: string;
    namaProducts: string;
    stok: number;
    satuan: string;
    harga: string;
    deskripsi: string;
    fotoTanaman: string;
    status: string;
    accountID: string;
    createdAt: string;
    updatedAt: string;
  };
}
