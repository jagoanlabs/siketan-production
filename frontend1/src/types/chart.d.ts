export interface CommodityData {
  month: string; // e.g., { month: "Jan", commodities: { beras: 1000 } }
  commodities: {
    padi_konvensional: number;
    padi_ramah_lingkungan: number;
    padi_organik: number;
    jagung: number;
    kedelai: number;
    ubi_jalar: number;
  };
}
