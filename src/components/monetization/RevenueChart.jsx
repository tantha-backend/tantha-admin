import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const RevenueChart = ({
  title = "Revenue Trend",
  data = [],
  dataKey = "revenue",
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Revenue generated over time
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />

            <XAxis dataKey="label" stroke="#71717a" fontSize={12} />

            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />

            <Tooltip
              formatter={(value) => [`₹${value}`, "Revenue"]}
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
