import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { useAdmin } from "./context/AdminContext";
import { useEffect } from "react";

export default function AdminHome() {
  const { stats, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center ml-40">
        <p className="text-slate-400">Loading dashboard data...</p>
      </div>
    );
  }

  const { totalUsers, totalProducts, totalOrders, statusCounts, salesData, usersVsOrdersData } = stats;

  const orderStatusData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171"];

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 flex flex-col items-center space-y-10 ml-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 w-full max-w-6xl shadow-[0_0_40px_rgba(255,255,255,0.05)] space-y-10"
      >
        <h2 className="text-4xl text-center font-[Cinzel] tracking-[0.25em] text-slate-100 mb-10">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800/70 border border-gray-700 p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold text-slate-200">Products</h2>
            <p className="text-3xl font-bold text-slate-100">
              {totalProducts}
            </p>
          </div>

          <div className="bg-gray-800/70 border border-gray-700 p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold text-slate-200">Users</h2>
            <p className="text-3xl font-bold text-slate-100">{totalUsers}</p>
          </div>

          <div className="bg-gray-800/70 border border-gray-700 p-6 rounded-xl text-center">
            <h2 className="text-lg font-semibold text-slate-200">Orders</h2>
            <p className="text-3xl font-bold text-slate-100">
              {totalOrders}
            </p>
          </div>
        </div>


        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">
            Order Status Overview
          </h3>
          {orderStatusData.length === 0 ? (
            <p className="text-center text-slate-400 py-10">
              No order data available yet.
            </p>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#168cafff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#E5E7EB",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">
            Last 30 Days Sales
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#E5E7EB", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#E5E7EB", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#E5E7EB",
                  }}
                />
                <Bar dataKey="sales" fill="#60A5FA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 text-center">
            Users vs Orders (Monthly)
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={usersVsOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#E5E7EB", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#E5E7EB", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#E5E7EB",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#FBBF24"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#34D399"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}