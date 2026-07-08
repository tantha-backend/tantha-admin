import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const SubscriptionChart = ({
  title = "Subscription Revenue",
  data = [],
  dataKey = "value",
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Premium and fan club subscription performance
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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

            <Bar dataKey={dataKey} fill="#ec4899" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscriptionChart;
