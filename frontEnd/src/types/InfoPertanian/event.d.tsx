// types/eventTani.ts
export interface EventTaniData {
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

export interface EventTaniResponse {
  message: string;
  infotani: EventTaniData[];
}

export interface EventTaniQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "upcoming" | "past";
  sortBy?: "tanggalAcara" | "namaKegiatan" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export const STATUS_OPTIONS: {
  value: "all" | "upcoming" | "past";
  label: string;
  color: string;
}[] = [
  { value: "all", label: "Semua Event", color: "default" },
  { value: "upcoming", label: "Akan Datang", color: "primary" },
  { value: "past", label: "Sudah Terlewat", color: "secondary" },
];

// Helper function to check if event is past
export const isPastEvent = (tanggalAcara: string): boolean => {
  const eventDate = new Date(tanggalAcara);
  const today = new Date();

  today.setHours(0, 0, 0, 0); // Set to start of today

  return eventDate < today;
};

// Helper function to get event status
export const getEventStatus = (
  tanggalAcara: string,
): "upcoming" | "past" | "today" => {
  const eventDate = new Date(tanggalAcara);
  const today = new Date();

  // Reset time to compare only dates
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (eventDate.getTime() === today.getTime()) {
    return "today";
  } else if (eventDate < today) {
    return "past";
  } else {
    return "upcoming";
  }
};

// Helper function to get status color
export const getStatusColor = (tanggalAcara: string) => {
  const status = getEventStatus(tanggalAcara);

  switch (status) {
    case "upcoming":
      return "primary";
    case "today":
      return "success";
    case "past":
      return "danger";
    default:
      return "default";
  }
};

// Helper function to get status label
export const getStatusLabel = (tanggalAcara: string): string => {
  const status = getEventStatus(tanggalAcara);

  switch (status) {
    case "upcoming":
      return "Akan Datang";
    case "today":
      return "Hari Ini";
    case "past":
      return "Sudah Terlewat";
    default:
      return "Unknown";
  }
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

// Helper function to format time
export const formatTime = (timeString: string): string => {
  // timeString format: "08:00 - 12:00"
  return timeString;
};

// Helper function to get relative time
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays < 0) {
    const pastDays = Math.abs(diffInDays);

    return `${pastDays} hari yang lalu`;
  } else if (diffInDays === 0) {
    return "Hari ini";
  } else if (diffInDays === 1) {
    return "Besok";
  } else if (diffInDays <= 7) {
    return `${diffInDays} hari lagi`;
  } else if (diffInDays <= 30) {
    const weeks = Math.ceil(diffInDays / 7);

    return `${weeks} minggu lagi`;
  } else {
    return formatDate(dateString);
  }
};

// Helper function to get days until event
export const getDaysUntilEvent = (tanggalAcara: string): number => {
  const eventDate = new Date(tanggalAcara);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffInTime = eventDate.getTime() - today.getTime();

  return Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
};
