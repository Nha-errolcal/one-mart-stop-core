import { FaTrophy } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TopProductsChart = ({ data }) => {
  return (
    <div>
      <h3 className="mb-4 font-semibold text-gray-700 flex items-center gap-3">
        <span className=" bg-yellow-50 text-yellow-500 rounded-lg">
          <FaTrophy />
        </span>
        ផលិតផលលក់ដាច់បំផុត
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={6}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />

          <Tooltip
            formatter={(value, name) => {
              if (name === "sold") return [`${value}`, "ចំនួនលក់"];
              if (name === "revenue") return [`$${value}`, "ចំណូល"];
              return value;
            }}
          />

          <Legend
            formatter={(value) => {
              if (value === "sold") return "ចំនួនលក់";
              if (value === "revenue") return "ចំណូល";
              return value;
            }}
          />

          <Bar
            dataKey="sold"
            name="ចំនួនលក់"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="revenue"
            name="ចំណូល"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
