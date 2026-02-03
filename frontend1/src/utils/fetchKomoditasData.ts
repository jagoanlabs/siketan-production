export interface KomoditasStatistik {
  date: string;
  komoditas: string;
  count: number;
}

export interface KomoditasSummary {
  kategori: string;
  count: number;
}

export interface KomoditasResponse {
  statistik: KomoditasStatistik[];
  summary: KomoditasSummary[];
}

export interface ProcessedCommodityData {
  month: string; // Untuk data tahunan ini akan berisi nama bulan, untuk data bulanan akan berisi tanggal
  commodities: Record<string, number>;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function processKomoditasData(
  data: KomoditasStatistik[],
): ProcessedCommodityData[] {
  const groupedData: Record<string, Record<string, number>> = {};
  const monthOrder = MONTH_NAMES;

  monthOrder.forEach((month) => {
    groupedData[month] = {};
  });

  data.forEach((item) => {
    const date = new Date(item.date);
    const monthKey = monthOrder[date.getMonth()];

    const normalizedName = item.komoditas.toLowerCase().replace(/\s+/g, "_");

    if (!groupedData[monthKey][normalizedName]) {
      groupedData[monthKey][normalizedName] = 0;
    }

    groupedData[monthKey][normalizedName] += item.count;
  });

  const result: ProcessedCommodityData[] = monthOrder.map((month) => ({
    month,
    commodities: groupedData[month] || {},
  }));

  return result;
}

export function processMonthlyKomoditasData(
  data: KomoditasStatistik[],
): ProcessedCommodityData[] {
  const groupedData: Record<string, Record<string, number>> = {};
  const dayOrder: string[] = [];
  const uniqueDates = new Set<string>();

  data.forEach((item) => {
    const date = new Date(item.date);
    const dayKey = date.getDate().toString();

    uniqueDates.add(dayKey);
  });

  const sortedDates = Array.from(uniqueDates).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );

  sortedDates.forEach((day) => {
    groupedData[day] = {};
    dayOrder.push(day);
  });

  if (sortedDates.length === 0) {
    for (let i = 1; i <= 31; i++) {
      const dayKey = i.toString();

      groupedData[dayKey] = {};
      dayOrder.push(dayKey);
    }
  }

  data.forEach((item) => {
    const date = new Date(item.date);
    const dayKey = date.getDate().toString();
    const normalizedName = item.komoditas.toLowerCase().replace(/\s+/g, "_");

    if (!groupedData[dayKey][normalizedName]) {
      groupedData[dayKey][normalizedName] = 0;
    }
    groupedData[dayKey][normalizedName] += item.count;
  });

  return dayOrder.map((day) => ({
    month: `${day}`,
    commodities: groupedData[day] || {},
  }));
}

export function mapKomoditasName(komoditas: string): string {
  const mappings: Record<string, string> = {
    padi_konvensional: "padi_konvensional",
    padi_ramah_lingkungan: "padi_ramah_lingkungan",
    padi_organik: "padi_organik",
    jagung: "jagung",
    kedelai: "kedelai",
    ubi_jalar: "ubi_jalar",
    singkong: "singkong",
    kacang_tanah: "kacang_tanah",
    kacang_hijau: "kacang_hijau",
    kacang_panjang: "kacang_panjang",
    cabai: "cabai",
    cabe_kecil: "cabe_kecil",
    bawang_merah: "bawang_merah",
    bawang_putih: "bawang_putih",
    tomat: "tomat",
    kentang: "kentang",
    wortel: "wortel",
    kangkung: "kangkung",
    sayuran_lain: "sayuran_lain",
    perkebunan_tebu: "perkebunan_tebu",
    perkebunan_tembakau: "perkebunan_tembakau",
    lainnya: "lainnya",
  };
  const normalized = komoditas.toLowerCase().replace(/\s+/g, "_");

  return mappings[normalized] || normalized;
}

export function extractCommodities(commodityKeys: string[]): string[] {
  const commodityMap: Record<string, string> = {
    padi_konvensional: "Padi Konvensional",
    padi_ramah_lingkungan: "Padi Ramah Lingkungan",
    padi_organik: "Padi Organik",
    jagung: "Jagung",
    kedelai: "Kedelai",
    ubi_jalar: "Ubi Jalar",
    singkong: "Singkong",
    kacang_tanah: "Kacang Tanah",
    kacang_hijau: "Kacang Hijau",
    kacang_panjang: "Kacang Panjang",
    cabai: "Cabai",
    cabe_kecil: "Cabe Kecil",
    bawang_merah: "Bawang Merah",
    bawang_putih: "Bawang Putih",
    tomat: "Tomat",
    kentang: "Kentang",
    wortel: "Wortel",
    kangkung: "Kangkung",
    sayuran_lain: "Sayuran Lain",
    perkebunan_tebu: "Perkebunan Tebu",
    perkebunan_tembakau: "Perkebunan Tembakau",
    lainnya: "Lainnya",
  };

  return commodityKeys.map((key) => commodityMap[key] || key);
}

export async function fetchKomoditasData(
  month?: number,
  year?: number,
  lineType: string = "komoditas",
  pieType: string = "kategori",
): Promise<KomoditasResponse> {
  try {
    const params = new URLSearchParams();

    if (month !== undefined) params.append("month", month.toString());
    if (year !== undefined) params.append("year", year.toString());
    params.append("lineType", lineType);
    params.append("pieType", pieType);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tanaman-petani/statistik?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch komoditas data");
    }

    const json = await response.json();

    if (json.data) {
      return {
        statistik: json.data.statistik || [],
        summary: json.data.summary || [],
      };
    }

    return {
      statistik: [],
      summary: [],
    };
  } catch (error) {
    console.error("Error fetching komoditas data:", error);

    return {
      statistik: [],
      summary: [],
    };
  }
}

export async function fetchYearlyKomoditasData(
  year: number = 2024,
): Promise<ProcessedCommodityData[]> {
  try {
    const fetchPromises = [];

    for (let month = 1; month <= 12; month++) {
      fetchPromises.push(fetchKomoditasData(month, year));
    }
    const monthlyResponses = await Promise.all(fetchPromises);
    const allMonthsData: KomoditasStatistik[] = [];

    monthlyResponses.forEach((response) => {
      if (response.statistik && response.statistik.length > 0) {
        allMonthsData.push(...response.statistik);
      }
    });
    if (allMonthsData.length > 0) {
      return processKomoditasData(allMonthsData);
    }

    return MONTH_NAMES.map((month) => ({
      month,
      commodities: {},
    }));
  } catch (error) {
    console.error("Error fetching yearly komoditas data:", error);

    return MONTH_NAMES.map((month) => ({
      month,
      commodities: {},
    }));
  }
}

export async function fetchMonthlyKomoditasData(
  month: number,
  year: number,
): Promise<ProcessedCommodityData[]> {
  try {
    const response = await fetchKomoditasData(month, year);

    if (response.statistik && response.statistik.length > 0) {
      return processMonthlyKomoditasData(response.statistik);
    }
    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      month: `${i + 1}`,
      commodities: {},
    }));
  } catch (error) {
    console.error("Error fetching monthly komoditas data:", error);
    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => ({
      month: `${i + 1}`,
      commodities: {},
    }));
  }
}
