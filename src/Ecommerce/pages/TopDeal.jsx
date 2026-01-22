import Header from "../components/Header";
import MobileHeader from "../../common-components/MobileHeader";
import BottomTabs from "../components/BottomTabs";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import { TopDealCard } from "../components/Card";

function TopDeal() {
  const [products, setProducts] = useState([]);
  const [productsloading, setProductsloading] = useState();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    fetchProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductsData = async () => {
    try {
      setProductsloading(true);
      const { data, error } = await supabase
        .from("product_variants")
        .select(`* ,product_id(*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter products where it is approved
      const filtered = data.filter(
        (item) =>
          item.status === "approved" && item.product_id.category === category
      );

      // 1. Extract unique image names
      const uniqueImages = [...new Set(filtered.map((item) => item.image))];

      // 2. Generate signed URLs from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls(uniqueImages, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URLs:", signedUrlError);
        return;
      }

      // 3. Create a map from image name to signed URL
      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      // 4. Replace image names with URLs in the array
      const product = filtered.map((item) => ({
        ...item,
        image: urlMap[item.image] || item.image, // fallback if URL not found
      }));

      setProducts(product);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setProductsloading(false);
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>

      <div className="lg:hidden">
        <MobileHeader title={"Season Special"} isCartShown={true} />
      </div>

      <div className="py-6 lg:py-10 flex flex-col justify-center items-center gap-5 font-Poppins">
        <h2 className="text-xl lg:text-3xl leading-4">
          Top Deals On {category}
        </h2>
        <p className="leading-4 text-[#aaa]">{products?.length} Item</p>
      </div>

      {!productsloading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 lg:container lg:mx-auto mb-6 px-3 lg:px-12">
          {products.map((product) => (
            <TopDealCard
              image={product.image}
              title={product?.title}
              subtitle={product?.details}
              key={product?.id}
              productID={product?.id}
              category={product?.product_id?.category}
            />
          ))}
        </div>
      ) : (
        <SpinnerFullPage />
      )}

      <div>
        <BottomTabs />
      </div>
    </>
  );
}

export default TopDeal;
