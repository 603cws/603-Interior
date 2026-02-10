import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabase";
import { baseImageUrl } from "../../../utils/HelperConstant";
import { handleError } from "../../../common-components/handleError";

function BestSellingSection({ sidebarDispatch, handleProductPreview }) {
  const [variantsData, setVariantsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("quantity,product:product_id(*)");
      if (error) throw new Error("Error while fetching order products", error);

      const map = {};
      data.forEach((item) => {
        const { product, quantity } = item;
        if (!product) return;
        const id = product.id;
        if (!map[id]) {
          map[id] = {
            ...product,
            count: quantity,
          };
        } else {
          map[id].count = map[id].count + quantity;
        }
      });

      const bestSellingProducts = Object.values(map).sort(
        (a, b) => b.count - a.count,
      );

      setVariantsData(bestSellingProducts.slice(0, 5));
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-[#23272E] text-lg">
          Best Selling Product
        </h2>
      </div>

      <table className="w-full text-[#23272E]">
        <thead className="border-b bg-[#E7EAF8] text-[#6A717F] font-Poppins font-medium text-xs sm:text-sm">
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
        <tbody className="text-[10px] sm:text-sm">
          {loading ? (
            <tr>
              <td colSpan={5} className="py-4 text-center text-[#6A717F]">
                Loading products...
              </td>
            </tr>
          ) : (
            variantsData.map((p, i) => (
              <tr
                key={i}
                className="border-b last:border-none font-Poppins hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  handleProductPreview(p);
                }}
              >
                <td className="flex items-center gap-3 py-2 ml-2">
                  <img
                    src={`${baseImageUrl}${p.image}`}
                    alt={p.title}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-[#020D37] font-bold">{p.title}</span>
                </td>
                <td className="text-center">{p.count ?? "-"}</td>
                <td>
                  <span
                    className={`flex items-center gap-2 ${
                      p.stockQty > 0 ? "text-[#374A75]" : "text-red-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        p.stockQty > 0 ? "bg-[#374A75]" : "bg-red-500"
                      }`}
                    ></span>
                    {p.stockQty > 0 ? "Stock" : "Stock out"}
                  </span>
                </td>
                <td className="font-bold">
                  ₹{p?.ecommercePrice?.sellingPrice}
                </td>
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
