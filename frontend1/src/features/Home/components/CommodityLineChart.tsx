import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface CommodityLineChartProps {
  data: Array<{
    month: string;
    commodities: Record<string, number>;
  }>;
  selectedCommodity: string[];
  colors?: Record<string, string>; // Opsional: warna untuk masing-masing komoditas
}

export const CommodityLineChart: React.FC<CommodityLineChartProps> = ({
  data,
  selectedCommodity,
  colors = {},
}) => {
  const getKey = (name: string) =>
    name?.toLowerCase().replace(/\s/g, "_") ?? "";

  return (
    <div className="w-full h-[270px]">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedCommodity.map((komoditas) => {
            const key = getKey(komoditas);

            return (
              <Line
                key={key}
                activeDot={{ r: 5 }}
                dataKey={`commodities.${key}`}
                dot={{ r: 4 }}
                name={komoditas}
                stroke={colors[komoditas]}
                strokeWidth={2}
                type="monotone"
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
