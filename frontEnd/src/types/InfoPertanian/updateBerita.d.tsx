// types/editBerita.ts
export interface EditBeritaFormData {
  judul: string;
  tanggal: string;
  kategori: "berita" | "artikel" | "tips";
  isi: string;
  status?: string;
  fotoBerita?: string; // Existing image URL
}

export interface EditBeritaPayload extends EditBeritaFormData {
  file?: File; // New file to upload (optional)
  id: number;
}

export interface EditBeritaResponse {
  message: string;
  infoTani: {
    id: number;
    judul: string;
    tanggal: string;
    kategori: string;
    fotoBerita: string;
    createdBy: string;
    isi: string;
    updatedAt: string;
  };
}

export interface BeritaDetailResponse {
  message: string;
  infotani: {
    id: number;
    judul: string;
    tanggal: string;
    kategori: string;
    fotoBerita: string;
    createdBy: string;
    isi: string;
    status: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

// Validation untuk edit (mirip dengan create tapi optional untuk beberapa field)
export const validateEditBeritaForm = (data: EditBeritaFormData): string[] => {
  const errors: string[] = [];

  if (!data.judul.trim()) {
    errors.push("Judul tidak boleh kosong");
  } else if (data.judul.length < 10) {
    errors.push("Judul minimal 10 karakter");
  } else if (data.judul.length > 200) {
    errors.push("Judul maksimal 200 karakter");
  }

  if (!data.tanggal) {
    errors.push("Tanggal tidak boleh kosong");
  }

  if (!data.kategori) {
    errors.push("Kategori harus dipilih");
  }

  if (!data.isi.trim()) {
    errors.push("Isi konten tidak boleh kosong");
  } else if (data.isi.length < 50) {
    errors.push("Isi konten minimal 50 karakter");
  }

  return errors;
};

// Helper to format date for edit form
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
