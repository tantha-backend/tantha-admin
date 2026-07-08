import AnalyticsPieChart from "./AnalyticsPieChart";

const GenreChart = ({ data = [] }) => {
  return (
    <AnalyticsPieChart
      title="Genre Distribution"
      data={data}
      dataKey="value"
      nameKey="name"
    />
  );
};

export default GenreChart;
