import { useEffect, useState } from "react";
import useDashboard from "../../store/dashboardStore";
import StatusCard from "../../components/dashboard/StatusCard";
import LineChartBox from "../../components/dashboard/LineChartBox";
import TopProductsChart from "../../components/dashboard/TopProductsChart";
import TopProductsTable from "../../components/dashboard/TopProductsTable";
import { getProfile } from "../../store/profile";
import {
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaChartBar,
  FaTrophy,
} from "react-icons/fa";
import LoadingHelper from "../../components/LoadingHelper";
import { getPermission } from "../../util/Helper";
const Dashboard = () => {
  const { monthlySales, getMonthlySales, getTodaySales, todaySale } =
    useDashboard();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getProfile();
  const permission = getPermission();
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([
          getMonthlySales(2026, user?.id),
          getTodaySales(user?.id),
        ]);
      } catch (err) {
        console.error(err);
        setError("មានបញ្ហាក្នុងការទាញទិន្នន័យ");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [getMonthlySales, getTodaySales, user?.id]);

  const data = todaySale?.data || {};
  const weeklyData = (data.weekly_sales || []).map((item) => ({
    label: item.date,
    value: Number(item.total_sales),
  }));

  const monthlyData = (monthlySales || []).map((item) => ({
    label: `ខែ ${item.month}`,
    value: Number(item.total_sales),
  }));

  const topProducts = (data.top_products || []).map((item) => ({
    name: item.product_name,
    sold: Number(item.total_sold),
    revenue: Number(item.total_revenue),
  }));

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">
          <LoadingHelper loading={loading} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-screen space-y-10">
      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="បញ្ជាទិញថ្ងៃនេះ"
          value={data.total_order_today || 0}
          icon={FaShoppingCart}
        />

        <StatusCard
          title="អតិថិជនថ្ងៃនេះ"
          value={data.customer_order_today || 0}
          icon={FaUsers}
        />

        <StatusCard
          title="កំណើនថ្ងៃនេះ"
          value={`${data.growth_today || 0}%`}
          icon={FaChartLine}
          growth={data.growth_today}
        />

        <StatusCard
          title="កំណើនប្រចាំខែ"
          value={`${data.growth_monthly || 0}%`}
          icon={FaChartLine}
          growth={data.growth_monthly}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-2 shadow-sm rounded-md">
          <h1 className="text-xl font-bold mb-4">ការលក់ប្រចាំសប្តាហ៍</h1>
          <LineChartBox data={weeklyData} />
        </div>
        <div className="bg-white p-2 shadow-sm rounded-md">
          <h1 className="text-xl font-bold mb-4">ការលក់ប្រចាំខែ</h1>
          <LineChartBox data={monthlyData} />
        </div>
      </div>

      {/* Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-2 shadow-sm rounded-md">
          <h1 className="text-xl font-bold mb-4">ផលិតផលដែលបានលក់ច្រើន</h1>
          <TopProductsChart data={topProducts} />
        </div>
        <div className="bg-white p-2 shadow-sm rounded-md">
          <h1 className="text-xl font-bold mb-4">ផលិតផលដែលបានលក់ច្រើន</h1>
          <TopProductsTable data={topProducts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
