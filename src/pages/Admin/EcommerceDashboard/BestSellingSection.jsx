import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import FilterButton from "./FilterButton";
import { baseImageUrl } from "../../../utils/HelperConstant";

function BestSellingSection({ sidebarDispatch, handleProductPreview }) {
  const [variantsData, setVariantsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: variants, error: variantError } = await supabase
        .from("product_variants")
        .select("*,products(*)")
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "boq");
      // .limit(5);

      if (variantError) {
        console.error(variantError);
        setVariantsData([]);
        setLoading(false);
        return;
      }

      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("products");

      if (orderError) {
        console.error(orderError);
        setVariantsData([]);
        setLoading(false);
        return;
      }

      // Count how many orders contain each variant
      const variantsWithCounts = variants.map((variant) => {
        const totalOrders = orders.filter((order) =>
          order.products?.some((p) => p.id === variant.id)
        ).length;

        return { ...variant, count: totalOrders };
      });

      const sortedVariants = variantsWithCounts.sort(
        (a, b) => b.count - a.count
      );

      setVariantsData(sortedVariants);
      setLoading(false);
    };

    fetchData();
  }, []);
  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-[#23272E] text-lg">
          Best Selling Product
        </h2>
        {/* <FilterButton
          iconSrc="./images/ecommerce/sort.png"
          altText="filter icon"
        >
          Filter
        </FilterButton> */}
      </div>

      <table className="w-full text-sm text-[#23272E]">
        <thead className="border-b bg-[#E7EAF8] text-[#6A717F] font-sans font-medium text-[13px]">
          <tr>
            <th className="bg-[#E7EAF8] rounded-l-lg pl-4 py-3 text-[#6A717F] text-left">
              PRODUCT
            </th>
            <th className="bg-[#E7EAF8] py-3 text-[#6A717F] text-center">
              TOTAL ORDER
            </th>
            <th className="bg-[#E7EAF8] py-3 text-[#6A717F] text-left">
              STATUS
            </th>
            <th className="bg-[#E7EAF8] rounded-r-lg py-3 text-[#6A717F] text-left">
              PRICE
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-[#6A717F]">
                Loading products...
              </td>
            </tr>
          ) : (
            variantsData.slice(0, 5).map((p, i) => (
              <tr key={i} className="border-b last:border-none">
                <td
                  className="flex items-center gap-3 py-2"
                  onClick={() => {
                    handleProductPreview(p);
                  }}
                >
                  <img
                    src={`${baseImageUrl}${p.image}`}
                    alt={p.title}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {p.title}
                  </span>
                </td>
                <td className="text-center">{p.count ?? "-"}</td>
                <td>
                  <span
                    className={`flex items-center gap-2 ${
                      p.stockQty > 0 ? "text-blue-500" : "text-red-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.stockQty > 0 ? "bg-blue-500" : "bg-red-500"
                      }`}
                    ></span>
                    {p.stockQty > 0 ? "Stock" : "Stock out"}
                  </span>
                </td>
                <td>₹{p.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-3">
        <button
          className="border border-[#6467F2] text-[#6467F2] text-sm px-4 py-1 rounded-full hover:bg-blue-50"
          onClick={() =>
            sidebarDispatch({
              type: "TOGGLE_SECTION",
              payload: "Product",
            })
          }
        >
          View More
        </button>
      </div>
    </div>
  );
}

export default BestSellingSection;
