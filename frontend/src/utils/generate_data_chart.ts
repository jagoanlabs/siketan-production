import { CommodityData } from "@/types/chart";

export const generateRandomCommodityData = (): CommodityData[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month) => ({
    month: month,
    commodities: {
      padi_konvensional: Math.floor(Math.random() * 1000) + 500, // Random value between 500 and 1500
      padi_ramah_lingkungan: Math.floor(Math.random() * 1000) + 500,
      padi_organik: Math.floor(Math.random() * 1000) + 500,
      jagung: Math.floor(Math.random() * 1000) + 500,
      kedelai: Math.floor(Math.random() * 1000) + 500,
      ubi_jalar: Math.floor(Math.random() * 1000) + 500,
    },
  }));
};
export const getRandomColor = (key: string) => {
  const colorMap: Record<string, string> = {
    padi_konvensional: "#34d399",
    padi_ramah_lingkungan: "#60a5fa",
    padi_organik: "#fbbf24",
    jagung: "#fb7185",
    kedelai: "#a78bfa",
    ubi_jalar: "#f97316",
  };

  return (
    colorMap[key] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
  );
};
