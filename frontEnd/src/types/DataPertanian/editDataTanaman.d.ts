export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PetaniOption {
  value: number;
  label: string;
  nik: string;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
}

export interface PetaniData {
  id: number;
  nik: string;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
  desaData: {
    nama: string;
  };
  kecamatanData: {
    nama: string;
  };
}

export interface SelectOption {
  key: string;
  label: string;
}

export interface EditTanamanFormData {
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
  fk_petaniId: number;
}
