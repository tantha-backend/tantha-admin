import AnalyticsPieChart from "./AnalyticsPieChart";

const LanguageChart = ({ data = [] }) => {
  return (
    <AnalyticsPieChart
      title="Language Distribution"
      data={data}
      dataKey="value"
      nameKey="name"
    />
  );
};

export default LanguageChart;
