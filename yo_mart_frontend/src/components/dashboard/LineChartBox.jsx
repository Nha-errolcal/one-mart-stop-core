import {
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LineChartBox = ({ data, title }) => {
  return (
    <div className="">
      <h3 className="mb-4 font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" strokeWidth={3} />
          <CartesianGrid strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartBox;
