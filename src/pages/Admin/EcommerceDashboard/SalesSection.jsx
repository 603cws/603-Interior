import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import Chart from "react-apexcharts";

function SalesSection() {
  const [ordersData, setOrdersData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [timeFilter, setTimeFilter] = useState(7); // default 7 days

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data: orders, error } = await supabase
        .from("orders")
        .select("created_at, finalPrice")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoadingOrders(false);
        return;
      }
      setOrdersData(orders || []);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, []);

  // Filter orders based on selected time period
  const getFilteredOrders = () => {
    if (!ordersData.length) return [];

    const now = new Date();
    let startDate;

    switch (timeFilter) {
      case 7:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 14:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 14);
        break;
      case 31:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 31);
        break;
      case 365:
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return ordersData;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    return ordersData.filter(
      (order) => new Date(order.created_at) >= startDate
    );
  };

  const filteredOrders = getFilteredOrders();

  // Calculate metrics
  const itemsSold = filteredOrders.length;
  const revenue = filteredOrders.reduce(
    (sum, order) => sum + (parseFloat(order.finalPrice) || 0),
    0
  );

  // Prepare chart data - group by date
  const getChartData = () => {
    const dateMap = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      if (!dateMap[date]) {
        dateMap[date] = 0;
      }
      dateMap[date] += parseFloat(order.finalPrice) || 0;
    });

    const categories = Object.keys(dateMap).slice(0, 10).reverse(); // last 10 dates
    const data = categories.map((date) => dateMap[date].toFixed(2));

    return { categories, data };
  };

  const chartData = getChartData();

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "60%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `₹${val}`,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#374A75"],
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: "#6A717F",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Revenue (₹)",
      },
      labels: {
        formatter: (val) => `₹${val.toFixed(0)}`,
      },
    },
    colors: ["#6467F2"],
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const series = [
    {
      name: "Revenue",
      data: chartData.data,
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">Sales Overview</h2>
        <select
          value={timeFilter}
          onChange={(e) =>
            setTimeFilter(
              e.target.value === "all" ? "all" : parseInt(e.target.value)
            )
          }
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={31}>Last Month</option>
          <option value={365}>Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {loadingOrders ? (
        <div className="flex justify-center items-center py-8 text-[#6A717F]">
          Loading sales data...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-24 text-gray-400">
          <svg
            className="w-16 h-16 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-lg font-medium">No data available</p>
          <p className="text-sm">Try selecting a different time period</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Items Sold</p>
              <p className="text-lg font-semibold text-gray-800">
                {itemsSold.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-semibold text-gray-800">
                ₹
                {revenue.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* ApexCharts Column Chart */}
          <Chart
            options={chartOptions}
            series={series}
            type="bar"
            height={250}
          />
        </>
      )}
    </div>
  );
}

export default SalesSection;
