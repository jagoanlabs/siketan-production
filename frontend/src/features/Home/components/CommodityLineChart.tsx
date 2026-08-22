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

  const formatNumber = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")} jt`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)} rb`;
    }
    return value.toLocaleString("id-ID");
  };

  return (
    <div className="w-full h-[270px]">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" tickFormatter={formatNumber} />
          <Tooltip
            formatter={(value: any, name: any) => [
              `${Number(value || 0).toLocaleString("id-ID")} kg / ton`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          {selectedCommodity.map((komoditas) => {
            const key = getKey(komoditas);

            return (
              <Line
                key={key}
                activeDot={{ r: 6 }}
                connectNulls={true}
                dataKey={`commodities.${key}`}
                dot={{ r: 4 }}
                name={komoditas}
                stroke={colors[komoditas] || "#10B981"}
                strokeWidth={2.5}
                type="monotone"
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
