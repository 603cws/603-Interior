import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import Spinner from "../../common-components/Spinner";
import { useApp } from "../../Context/Context";
function VendorDashboardCards() {
  // loading
  const [isloading, setIsloading] = useState(false);
  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [pendingproducts, setPendingproducts] = useState([]);

  const { accountHolder } = useApp();
  // Fetch Products from Supabase
  const fetchProducts = async () => {
    setIsloading(true);
    try {
      const { data } = await supabase
        .from("product_variants")
        .select("*")
        .eq("vendor_id", accountHolder.userId);

      const getpendingproducts = data.filter((el) => el.status === "pending");

      setPendingproducts(getpendingproducts);

      setProducts(data);

      console.log(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    const { data, error } = await supabase
      .from("addon_variants")
      .select("*")
      .eq("vendorId", accountHolder.userId);
    console.log(data);

    if (error) {
      console.log("Error fetching addons:", error);
    } else {
      setAddons(data);
      console.log("Addons: ", data);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAddons();
  }, []);

  if (isloading) {
    return <Spinner />;
  }
  return (
    <div className="text-[#194F48]">
      <div className="flex gap-4 font-Poppins">
        <div className="bg-gradient-to-r from-[#B4FFF0] to-[#B4FFF0] text-[#194F48]  p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer">
          <h2 className="self-center text-xl tracking-wide font-medium">
            Products
          </h2>
          <h1 className="self-end justify-end  font-medium text-3xl xl:text-6xl">
            {products.length}
          </h1>
          <img
            src="/images/vendorproduct.png"
            alt="vendor products"
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>

        <div className="bg-gradient-to-r from-[#D8FFD8] to-[#D8FFD8]  p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer">
          <h2 className="self-center text-xl tracking-wide font-medium">
            Addons
          </h2>
          <h1 className="self-end justify-end font-medium text-3xl xl:text-5xl">
            {addons.length}
          </h1>
          <img
            src="/images/vendoraddon.png"
            alt="addons"
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>

        <div className="bg-gradient-to-br from-[#D8F7FF] to-[#D8F7FF]  p-7 rounded-3xl flex flex-col justify-between lg:h-48 lg:w-40 xl:h-56 xl:w-48 relative hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer">
          <h2 className="self-center text-xl tracking-wide font-medium">
            Pending Orders
          </h2>
          <h1 className="self-end justify-end font-medium text-3xl xl:text-5xl">
            {pendingproducts.length}
          </h1>
          <img
            src="/images/dashboard-orders.png"
            alt="pending orders"
            className="absolute left-2 bottom-10 h-24 w-24 opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

export default VendorDashboardCards;
