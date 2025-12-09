import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";

function Transactions({ sidebarDispatch, onOrderSelect }) {
  const [ordersData, setOrdersData] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`*, users_profiles(*)`)
        .order("created_at", { ascending: false })
        .limit(7);
      if (error) {
        console.error(error);
        setLoadingOrders(false);
        return;
      }

      // Fetch variants for products in each order, similar to Orders component
      const ordersWithVariants = await Promise.all(
        orders.map(async (order) => {
          const productVariantMap = {};

          if (order.products?.length) {
            for (const product of order.products) {
              const productId = product.id;
              if (productId) {
                const { data: variants, error: variantsError } = await supabase
                  .from("product_variants")
                  .select("*")
                  .eq("id", productId);

                if (variantsError) {
                  console.error(variantsError);
                  productVariantMap[productId] = [];
                } else {
                  productVariantMap[productId] = variants;
                }
              }
            }
          }

          return {
            ...order,
            product_variants_map: productVariantMap,
          };
        })
      );

      setOrdersData(ordersWithVariants);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4 cursor-default">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg text-[#23272E]">Transaction</h2>
      </div>
      {loadingOrders ? (
        <div className="flex justify-center items-center py-8 text-[#6A717F] text-lg">
          Loading transactions...
        </div>
      ) : (
        <table className="w-full text-sm text-gray-600">
          <thead className="border-b text-[#7C7C7C]">
            <tr>
              <th className="py-2 text-left">No.</th>
              <th className="py-2 text-left">Order Id</th>
              <th className="py-2 text-left">Order Date</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="text-black text-sm">
            {ordersData?.map((t, i) => (
              <tr
                key={i}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => onOrderSelect(t)}
              >
                <td className="py-2">{i + 1}.</td>
                <td title={t.id}>
                  {t.id.length > 6 ? `${t.id.slice(0, 6)}...` : t.id}
                </td>
                <td>
                  {new Date(t.created_at)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .replace(",", " |")}
                </td>
                <td>
                  <span className={`flex items-center gap-2 capitalize`}>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        t.status === "Pending" ? "bg-yellow-500" : "bg-blue-500"
                      }`}
                    ></span>
                    {t.status}
                  </span>
                </td>
                <td>₹{t.finalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-end mt-3">
        <button
          className="capitalize border border-[#6467F2] text-[#6467F2] text-sm px-4 py-1 rounded-full hover:bg-blue-50"
          onClick={() =>
            sidebarDispatch({ type: "TOGGLE_SECTION", payload: "Orders" })
          }
        >
          view all
        </button>
      </div>
    </div>
  );
}

export default Transactions;
