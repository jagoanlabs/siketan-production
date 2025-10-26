// types/createBerita.ts
export interface CreateBeritaFormData {
  judul: string;
  tanggal: string;
  kategori: "berita" | "artikel" | "tips";
  isi: string;
  status?: string;
}

export interface CreateBeritaPayload extends CreateBeritaFormData {
  file?: File;
}

export interface CreateBeritaResponse {
  message: string;
  infoTani: {
    id: number;
    judul: string;
    tanggal: string;
    kategori: string;
    fotoBerita: string;
    createdBy: string;
    isi: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const KATEGORI_BERITA_OPTIONS: {
  value: "berita" | "artikel" | "tips";
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "berita",
    label: "Berita",
    description: "Informasi terkini seputar dunia pertanian",
    color: "primary",
  },
  {
    value: "artikel",
    label: "Artikel",
    description: "Tulisan mendalam tentang topik pertanian",
    color: "secondary",
  },
  {
    value: "tips",
    label: "Tips",
    description: "Kiat dan saran praktis untuk petani",
    color: "success",
  },
];

// Validation helpers
export const validateCreateBeritaForm = (
  data: CreateBeritaFormData,
): string[] => {
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

// Helper to format current date for form
export const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Helper to validate image file
export const validateImageFile = (file: File): string | null => {
  const validTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return "Format file tidak valid. Gunakan PNG, JPG, JPEG, atau GIF";
  }

  if (file.size > maxSize) {
    return "Ukuran file maksimal 5MB";
  }

  return null;
};
