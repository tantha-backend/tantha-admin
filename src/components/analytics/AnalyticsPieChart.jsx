import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#ec4899",
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#a855f7",
];

const AnalyticsPieChart = ({
  title,
  data = [],
  dataKey = "value",
  nameKey = "name",
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
      <h3 className="mb-5 text-lg font-semibold text-white">{title}</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
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

export default AnalyticsPieChart;
