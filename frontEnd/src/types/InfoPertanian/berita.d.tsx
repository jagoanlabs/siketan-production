// types/berita.ts
export interface BeritaData {
  id: number;
  judul: string;
  tanggal: string;
  status: string | null;
  kategori: "tips" | "berita" | "artikel";
  fotoBerita: string;
  createdBy: string;
  isi: string; // HTML content
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BeritaResponse {
  message: string;
  infotani: BeritaData[];
}

export interface BeritaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  kategori?: "tips" | "berita" | "artikel" | "all";
  sortBy?: "tanggal" | "judul" | "kategori";
  sortOrder?: "asc" | "desc";
}

export const KATEGORI_OPTIONS: {
  value: "all" | "tips" | "berita" | "artikel";
  label: string;
  color: string;
}[] = [
  { value: "all", label: "Semua Kategori", color: "default" },
  { value: "tips", label: "Tips", color: "success" },
  { value: "berita", label: "Berita", color: "primary" },
  { value: "artikel", label: "Artikel", color: "secondary" },
];

// Helper function to get category color
export const getKategoriColor = (kategori: string) => {
  switch (kategori) {
    case "tips":
      return "success";
    case "berita":
      return "primary";
    case "artikel":
      return "secondary";
    default:
      return "default";
  }
};

// Helper function to strip HTML tags for preview
export const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");

  tmp.innerHTML = html;

  return tmp.textContent || tmp.innerText || "";
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper function to get relative time
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);

    return `${days} hari yang lalu`;
  } else if (diffInHours < 24 * 30) {
    const weeks = Math.floor(diffInHours / (24 * 7));

    return `${weeks} minggu yang lalu`;
  } else {
    return formatDate(dateString);
  }
};
