import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AnalyticsBarChart = ({ title, data = [], dataKey = "value" }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">{title}</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="label" stroke="#71717a" fontSize={12} />
            <YAxis stroke="#71717a" fontSize={12} />
            <Tooltip
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

export default AnalyticsBarChart;
