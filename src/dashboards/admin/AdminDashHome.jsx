import { useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import DashboardInbox from "./DashboardInbox";
import { supabase } from "../../services/supabase";
import { handleError } from "../../common-components/handleError";

function AdminDashHome({
  allusers,
  allvendors,
  handleVendor,
  handleclient,
  handleproduct,
}) {
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*,products(*)")
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "ecommerce");

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setProducts(sortedData);
    } catch (error) {
      handleError(error, {
        prodMessage: "Error fetching products. Please try again.",
      });
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase.from("addon_variants").select("*");

      if (error) throw error;

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setAddons(sortedData);
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchAddons();
  }, []);

  return (
    <div className="w-full flex-1 flex overflow-y-auto scrollbar-hide  py-2 px-3">
      <div className="xl:flex justify-evenly gap-4 w-full flex-1">
        <div className="p-4 flex-1">
          <DashboardCards
            totalclients={allusers}
            totalVendors={allvendors}
            vendors={handleVendor}
            clients={handleclient}
            products={products}
            handleproduct={handleproduct}
            addons={addons}
          />
        </div>
        <div className="flex-1 p-4">
          <DashboardInbox viewDetails={handleproduct} products={products} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashHome;
