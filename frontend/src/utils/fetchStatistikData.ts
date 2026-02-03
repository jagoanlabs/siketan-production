export interface Ringkasan {
  jumlahPetani: number;
  jumlahGapoktan: number;
  jumlahPenyuluh: number;
  jumlahKomoditas: number;
  areaPertanian: number;
}

export interface CommodityData {
  month: string;
  commodities: Record<string, number>;
}

export interface StatistikResult {
  ringkasan: Ringkasan | null;
  commodityData: CommodityData[];
}

let cache: StatistikResult | null = null;
let cachePromise: Promise<StatistikResult> | null = null;

export async function fetchStatistikData(): Promise<StatistikResult> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = fetch(`${import.meta.env.VITE_API_BASE_URL}/landing-statistik`)
    .then(async (res) => {
      const json = await res.json();

      if (json.success && json.data) {
        cache = {
          ringkasan: json.data.ringkasan,
          commodityData: json.data.commodityData || [],
        };

        return cache;
      } else {
        cache = { ringkasan: null, commodityData: [] };

        return cache;
      }
    })
    .catch(() => {
      cache = { ringkasan: null, commodityData: [] };

      return cache;
    })
    .finally(() => {
      cachePromise = null;
    });

  return cachePromise;
}

export function clearStatistikCache() {
  cache = null;
  cachePromise = null;
}
