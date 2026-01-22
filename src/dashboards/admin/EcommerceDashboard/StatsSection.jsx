import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { supabase } from "../../../services/supabase";
import { useEffect, useState } from "react";

function StatsSection({ allusers }) {
  const [totalOrders, setTotalOrders] = useState(0);
  const [last7DaysOrders, setLast7DaysOrders] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrdersStats() {
      try {
        const { data: orders, error } = await supabase
          .from("orders_table")
          .select("created_at")
          .order("created_at", { ascending: false });

        if (error) {
          setError(error);
          return;
        }

        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        setTotalOrders(orders?.length ?? 0);
        setLast7DaysOrders(
          orders
            ? orders.filter(
                (order) => new Date(order.created_at) >= sevenDaysAgo
              ).length
            : 0
        );
      } catch (err) {
        setError(err);
      }
    }

    fetchOrdersStats();
  }, []);

  // User stats are derived from props
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const totalUsers = allusers?.length ?? 0;
  const last7DaysUsers = allusers
    ? allusers.filter((user) => new Date(user.created_at) >= sevenDaysAgo)
        .length
    : 0;

  // Only stats with count > 0 are shown
  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      subtitle: "All Time",
    },
    {
      title: "New Orders",
      value: last7DaysOrders,
      subtitle: "Last 7 days",
    },
    {
      title: "Total Customers",
      value: totalUsers,
      subtitle: "All Time",
    },
    {
      title: "New Customers",
      value: last7DaysUsers,
      subtitle: "Last 7 days",
    },
  ].filter((stat) => stat.value > 0);

  if (error) return <div>Error loading stats</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between"
        >
          <div className="text-lg font-bold text-[#23272E] mb-1">
            {stat.title}
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-[#020D37]">
              {stat.value.toLocaleString()}
            </span>
            {stat.change && (
              <span className="flex items-center gap-1 text-sm font-medium text-[#374A75]">
                {stat.change.startsWith("+") ? (
                  <FaArrowUp className="w-4 h-4 text-[#1E35B5]" />
                ) : (
                  <FaArrowDown className="w-4 h-4 text-[#1E35B5]" />
                )}
                {stat.change.replace(/^[-+]/, "")}
              </span>
            )}
          </div>
          <div className="text-xs text-[#6A717F]">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsSection;
