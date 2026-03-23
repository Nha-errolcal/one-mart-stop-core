import { useEffect, useState } from "react";
import useDashboard from "../../store/dashboardStore";
import StatusCard from "../../components/dashboard/StatusCard";
import LineChartBox from "../../components/dashboard/LineChartBox";
import TopProductsChart from "../../components/dashboard/TopProductsChart";
import TopProductsTable from "../../components/dashboard/TopProductsTable";
import {
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaChartBar,
  FaTrophy,
} from "react-icons/fa";

const Dashboard = () => {
  const { getMonthlySales, getTodaySales, todaySale } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([getMonthlySales(), getTodaySales()]);
      } catch (err) {
        console.error(err);
        setError("មានបញ្ហាក្នុងការទាញទិន្នន័យ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getMonthlySales, getTodaySales]);

  // Data
  const weeklyData = (todaySale?.data?.weekly_sales || []).map((item) => ({
    label: item.date,
    value: Number(item.total_sales),
  }));

  const monthlyData = (todaySale?.data?.monthly_sales || []).map((item) => ({
    label: item.date,
    value: Number(item.total_sales),
  }));

  const topProducts = (todaySale?.data?.top_products || []).map((item) => ({
    name: item.product_name,
    sold: Number(item.total_sold),
    revenue: Number(item.total_revenue),
  }));

  // Loading
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">
          កំពុងផ្ទុកទិន្នន័យ...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-screen space-y-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="បញ្ជាទិញថ្ងៃនេះ"
          value={todaySale?.data?.total_order_today || 0}
          icon={FaShoppingCart}
        />

        <StatusCard
          title="អតិថិជនថ្ងៃនេះ"
          value={todaySale?.data?.customer_order_today || 0}
          icon={FaUsers}
        />

        <StatusCard
          title="កំណើនថ្ងៃនេះ"
          value={`${todaySale?.data?.growth_today || 0}%`}
          icon={FaChartLine}
          growth={todaySale?.data?.growth_today}
        />

        <StatusCard
          title="កំណើនប្រចាំខែ"
          value={`${todaySale?.data?.growth_monthly || 0}%`}
          icon={FaChartLine}
          growth={todaySale?.data?.growth_monthly}
        />
      </div>

      {/* Sales Overview */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
          <span className="p-2 bg-blue-50 text-blue-500 rounded-lg">
            <FaChartLine />
          </span>
          ទិដ្ឋភាពការលក់
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold mb-4 text-gray-700 flex items-center gap-3">
              <span className="p-2 bg-green-50 text-green-500 rounded-lg">
                <FaChartBar />
              </span>
              ការលក់ក្នុង 7 ថ្ងៃ
            </h3>
            <LineChartBox data={weeklyData} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="font-semibold mb-4 text-gray-700 flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                <FaChartLine />
              </span>
              ការលក់ក្នុង 30 ថ្ងៃ
            </h3>
            <LineChartBox data={monthlyData} />
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-3">
          <span className="p-2 bg-yellow-50 text-yellow-500 rounded-lg">
            <FaTrophy />
          </span>
          ផលិតផលលក់ដាច់បំផុត
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <TopProductsChart data={topProducts} />
          </div>

          <TopProductsTable data={topProducts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
