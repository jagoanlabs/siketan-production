// Form validation errors
export interface FormErrors {
  [key: string]: string | undefined;
}

// Petani option for AsyncSelect
export interface PetaniOption {
  value: number;
  label: string;
  nik: string;
  nama: string;
  alamat: string;
  desa: string;
  kecamatan: string;
}

// Petani data from API
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

// Select option interface
export interface SelectOption {
  key: string;
  label: string;
}

// Form data interface (extends from service)
export interface CreateTanamanFormData {
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

// Hook return type
export interface UseCreateDataTanamanReturn {
  // Form state
  formData: CreateTanamanFormData;
  errors: FormErrors;
  selectedPetani: PetaniOption | null;
  isPetaniLoading: boolean;

  // Options
  statusKepemilikanOptions: SelectOption[];
  kategoriOptions: SelectOption[];
  jenisOptions: SelectOption[];
  periodeMusimOptions: SelectOption[];
  bulanOptions: SelectOption[];
  komoditasSuggestions: string[];

  // Functions
  handleInputChange: (field: keyof CreateTanamanFormData, value: any) => void;
  handlePetaniChange: (selectedOption: PetaniOption | null) => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  loadPetaniOptions: (inputValue: string) => Promise<PetaniOption[]>;

  // Mutation
  createMutation: any;
}
