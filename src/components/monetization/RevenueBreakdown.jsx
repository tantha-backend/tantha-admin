import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#ec4899", "#8b5cf6", "#f59e0b", "#3b82f6"];

const RevenueBreakdown = ({ data = [] }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">Revenue Breakdown</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Revenue sources across the platform
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`₹${value}`, "Revenue"]}
              contentStyle={{
                backgroundColor: "#09090b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                color: "#fff",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueBreakdown;
