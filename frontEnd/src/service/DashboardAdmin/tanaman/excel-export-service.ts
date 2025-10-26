import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

import { axiosClient } from "@/service/app-service";

interface DataTanaman {
  id: number;
  statusKepemilikanLahan: string;
  luasLahan: string;
  kategori: string;
  jenis: string;
  komoditas: string;
  periodeMusimTanam: string | null;
  periodeBulanTanam: string | null;
  prakiraanLuasPanen: number | null;
  prakiraanProduksiPanen: number | null;
  prakiraanBulanPanen: string | null;
  realisasiLuasPanen?: number | null;
  realisasiProduksiPanen?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fk_petaniId: number;
  dataPetani: {
    kelompok?: {
      namaKelompok?: string;
      gapoktan?: string;
    };
    kecamatanData?: {
      nama: string;
    };
    desaData?: {
      nama: string;
    };
  };
}

// Kategori tanaman yang akan di-export
const KATEGORI_TANAMAN = [
  "TANAMAN PANGAN",
  "TANAMAN PERKEBUNAN SEMUSIM",
  "TANAMAN PERKEBUNAN TAHUNAN",
  "TANAMAN HORTIKULTURA SEMUSIM",
  "TANAMAN HORTIKULTURA TAHUNAN",
];

// Mapping kategori dari database ke kategori export
const mapKategori = (
  kategori: string,
  periodeMusimTanam: string | null,
): string => {
  const kategoriUpper = kategori.toUpperCase();

  if (kategoriUpper.includes("PANGAN")) return "TANAMAN PANGAN";

  if (kategoriUpper.includes("PERKEBUNAN")) {
    // Bedakan semusim/tahunan berdasarkan PeriodeMusimTanam
    if (
      periodeMusimTanam &&
      periodeMusimTanam.toUpperCase().includes("TANAMAN TAHUNAN")
    ) {
      return "TANAMAN PERKEBUNAN TAHUNAN";
    }

    return "TANAMAN PERKEBUNAN SEMUSIM";
  }

  if (
    kategoriUpper.includes("HOLTIKULTURA") ||
    kategoriUpper.includes("HORTIKULTURA")
  ) {
    // Bedakan semusim/tahunan berdasarkan PeriodeMusimTanam
    if (
      periodeMusimTanam &&
      periodeMusimTanam.toUpperCase().includes("TANAMAN TAHUNAN")
    ) {
      return "TANAMAN HORTIKULTURA TAHUNAN";
    }

    return "TANAMAN HORTIKULTURA SEMUSIM";
  }

  return kategori.toUpperCase();
};

// Format date to month-year format
const formatBulanTanam = (dateString: string | null): string => {
  if (!dateString) return "-";

  return dateString;
};

// Main export function
export const exportAllDataToExcel = async () => {
  try {
    const toastId = toast.loading("Mengunduh data tanaman...");

    // Fetch all data without pagination
    const response = await axiosClient.get("/list-tanaman", {
      params: {
        page: 1,
        limit: 9999, // Get all data
        isExport: true,
      },
    });

    const allData: DataTanaman[] = response.data.data;

    if (!allData || allData.length === 0) {
      toast.error("Tidak ada data untuk diexport", { id: toastId });

      return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Group data by kategori
    const groupedData: { [key: string]: DataTanaman[] } = {};

    allData.forEach((item) => {
      const kategoriMapped = mapKategori(item.kategori, item.periodeMusimTanam);

      if (!groupedData[kategoriMapped]) {
        groupedData[kategoriMapped] = [];
      }
      groupedData[kategoriMapped].push(item);
    });

    let sheetsCreated = 0;

    // Create sheets for each kategori
    KATEGORI_TANAMAN.forEach((kategori) => {
      const dataKategori = groupedData[kategori] || [];

      // Prepare data for this kategori
      const excelData = dataKategori.map((item, index) => ({
        NO: index + 1,
        POKTAN: item.dataPetani?.kelompok?.namaKelompok || "-",
        KECAMATAN: item.dataPetani?.kecamatanData?.nama || "-",
        DESA: item.dataPetani?.desaData?.nama || "-",
        "LAHAN BAKU": item.luasLahan,
        GAPOKTAN: item.dataPetani?.kelompok?.gapoktan || "-",
        "NAMA POKTAN": item.dataPetani?.kelompok?.namaKelompok || "-",
        KOMODITAS: item.komoditas || "-",
        "LUAS TANAM (HA)": item.luasLahan,
        "BULAN TANAM": formatBulanTanam(item.periodeBulanTanam),
        "PRAKIRAAN BULAN PANEN": item.prakiraanBulanPanen || "-",
        "PRAKIRAAN LUAS PANEN (HA)":
          item.prakiraanLuasPanen !== null &&
          item.prakiraanLuasPanen !== undefined
            ? item.prakiraanLuasPanen
            : "0",
        "PRAKIRAAN HASIL PANEN (TON)":
          item.prakiraanProduksiPanen !== null &&
          item.prakiraanProduksiPanen !== undefined
            ? item.prakiraanProduksiPanen
            : "0",
        "REALISASI LUAS PANEN (HA)":
          item.realisasiLuasPanen !== null &&
          item.realisasiLuasPanen !== undefined
            ? item.realisasiLuasPanen
            : "0",
        "REALISASI PRODUKSI PANEN (TON)":
          item.realisasiProduksiPanen !== null &&
          item.realisasiProduksiPanen !== undefined
            ? item.realisasiProduksiPanen
            : "0",
      }));

      // Only create sheet if there's data
      if (excelData.length > 0) {
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const columnWidths = [
          { wch: 5 }, // NO
          { wch: 20 }, // POKTAN
          { wch: 20 }, // KECAMATAN
          { wch: 20 }, // DESA
          { wch: 15 }, // LAHAN BAKU
          { wch: 20 }, // GAPOKTAN
          { wch: 20 }, // NAMA POKTAN
          { wch: 25 }, // KOMODITAS
          { wch: 15 }, // LUAS TANAM (HA)
          { wch: 20 }, // BULAN TANAM
          { wch: 25 }, // PRAKIRAAN BULAN PANEN
          { wch: 25 }, // PRAKIRAAN LUAS PANEN (HA)
          { wch: 28 }, // PRAKIRAAN HASIL PANEN (TON)
          { wch: 25 }, // REALISASI LUAS PANEN (HA)
          { wch: 30 }, // REALISASI PRODUKSI PANEN (TON)
        ];

        ws["!cols"] = columnWidths;

        // Add worksheet to workbook with shortened name if necessary
        let sheetName = kategori;

        if (sheetName.length > 31) {
          // Excel sheet name limit
          sheetName = sheetName.substring(0, 31);
        }
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        sheetsCreated++;
      }
    });

    // Check if workbook has any sheets
    if (sheetsCreated === 0) {
      toast.error("Tidak ada data tanaman yang sesuai dengan kategori", {
        id: toastId,
      });

      return;
    }

    // Generate buffer
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      bookSST: false,
    });

    // Create blob and save
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Data_Tanaman_Petani_${new Date().toISOString().split("T")[0]}.xlsx`;

    saveAs(blob, fileName);

    toast.success(`Berhasil mengunduh ${allData.length} data tanaman`, {
      id: toastId,
    });
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Gagal mengunduh data tanaman");
  }
};
