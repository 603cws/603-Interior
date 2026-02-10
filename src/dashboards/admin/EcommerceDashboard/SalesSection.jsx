import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../services/supabase";
import Chart from "react-apexcharts";
import { handleError } from "../../../common-components/handleError";

function SalesSection() {
  const [ordersData, setOrdersData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [timeFilter, setTimeFilter] = useState(7); // default 7 days
  const [chartType, setChartType] = useState("bar"); // 'bar' | 'pie'

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data: orders, error } = await supabase
        .from("orders_table")
        .select("created_at, final_amount")
        .order("created_at", { ascending: false });

      if (error) {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
        setLoadingOrders(false);
        return;
      }
      setOrdersData(orders || []);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, []);

  // Filter orders by selected period
  const filteredOrders = useMemo(() => {
    if (!ordersData.length) return [];
    const now = new Date();

    if (timeFilter === "all") return ordersData;

    // Support any numeric day window (e.g., 7, 14, 31)
    if (typeof timeFilter === "number" && timeFilter > 0 && timeFilter < 365) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - timeFilter);
      return ordersData.filter((o) => new Date(o.created_at) >= startDate);
    }

    // Year (365)
    if (timeFilter === 365) {
      const startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      return ordersData.filter((o) => new Date(o.created_at) >= startDate);
    }

    // Fallback
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7);
    return ordersData.filter((o) => new Date(o.created_at) >= startDate);
  }, [ordersData, timeFilter]);

  // Metrics
  const itemsSold = filteredOrders.length;
  const revenue = filteredOrders.reduce(
    (sum, order) => sum + (parseFloat(order.final_amount) || 0),
    0,
  );

  // Build aggregated buckets based on timeFilter
  const chartData = useMemo(() => {
    const dateMap = {};

    filteredOrders.forEach((order) => {
      const createdAt = new Date(order.created_at);
      let key;

      if (
        typeof timeFilter === "number" &&
        (timeFilter === 7 || timeFilter === 14 || timeFilter === 31)
      ) {
        // Group by day
        key = createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });
      } else if (timeFilter === 365) {
        // Group by month
        key = createdAt.toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
      } else if (timeFilter === "all") {
        // Group by year
        key = createdAt.getFullYear().toString();
      } else {
        key = createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });
      }

      if (!dateMap[key]) dateMap[key] = 0;
      dateMap[key] += parseFloat(order.final_amount) || 0;
    });

    // Sort keys chronologically
    const sortedKeys = Object.keys(dateMap).sort((a, b) => {
      if (timeFilter === "all") return parseInt(a) - parseInt(b); // year comparison
      return new Date(a) - new Date(b);
    });

    // For shorter windows, show last 10 buckets
    const categories =
      timeFilter === "all" || timeFilter === 365
        ? sortedKeys
        : sortedKeys.slice(-10);

    const values = categories.map((k) => Number(dateMap[k].toFixed(2)));

    return { categories, values };
  }, [filteredOrders, timeFilter]);

  // Apex options for BAR
  const barOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "60%",
          dataLabels: { position: "top" },
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
        title: { text: "Time Period" },
        labels: {
          style: { colors: "#6A717F", fontSize: "12px" },
        },
      },
      yaxis: {
        title: { text: "Revenue (₹)" },
        labels: {
          formatter: (val) => `₹${val.toFixed(0)}`,
        },
      },
      colors: ["#6467F2"],
      grid: { borderColor: "#f1f1f1" },
    }),
    [chartData.categories],
  );

  // Apex options for PIE (needs labels)
  const pieOptions = useMemo(
    () => ({
      chart: {
        type: "pie",
        height: 350,
        toolbar: { show: false },
      },
      stroke: {
        show: chartData.categories.length > 1 ? true : false, // ✅ removes the white line for single-slice pies
      },
      labels: chartData.categories, // very important for pie
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => {
          const value = chartData.values[opts.seriesIndex] || 0;
          return `₹${value.toFixed(0)}`;
        },
        style: {
          fontSize: "12px",
        },
      },
      legend: {
        position: "bottom",
        labels: { useSeriesColors: false },
      },
      tooltip: {
        y: {
          formatter: (val) => `₹ ${Number(val).toFixed(2)}`,
        },
      },
    }),
    [chartData.categories, chartData.values],
  );

  // Correct series shape per type
  const barSeries = useMemo(
    () => [{ name: "Revenue", data: chartData.values }],
    [chartData.values],
  );
  const pieSeries = useMemo(() => chartData.values, [chartData.values]);

  // Key forces Apex to re-mount when type/time changes (prevents stale renders)
  const chartKey = `${chartType}-${timeFilter}-${chartData.categories.length}`;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">Sales Overview</h2>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setChartType("bar")}
              className={`px-3 py-1 text-sm ${
                chartType === "bar" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`px-3 py-1 text-sm ${
                chartType === "pie" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              Pie
            </button>
          </div>

          {/* Time filter */}
          <select
            value={timeFilter}
            onChange={(e) =>
              setTimeFilter(
                e.target.value === "all" ? "all" : parseInt(e.target.value, 10),
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={31}>1 Month</option>
            <option value={365}>1 Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
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
          <Chart
            key={chartKey}
            options={chartType === "pie" ? pieOptions : barOptions}
            series={chartType === "pie" ? pieSeries : barSeries}
            type={chartType}
            height={250}
          />
        </>
      )}
    </div>
  );
}

export default SalesSection;
