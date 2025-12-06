import { MdOutlineCancel } from "react-icons/md";
import Addon from "../../common-components/Addon";
import { supabase } from "../../services/supabase";
import { useEffect, useState } from "react";
import Spinner from "../../common-components/Spinner";

function RecommendComp({ setShowRecommend, currentProduct, manufacturer }) {
  // based on the venor id gell all the products to display
  const [recommendedProducts, setRecommededProducts] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVendorData() {
      if (!currentProduct) return;
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("product_variants")
          .select("*")
          .eq("manufacturer", currentProduct?.manufacturer)
          .eq("product_type", currentProduct?.product_type)
          .eq("status", "approved")
          .neq("id", currentProduct?.id)
          .neq("productDisplayType", "ecommerce");

        console.log(data);
        setRecommededProducts(data);
        if (error) throw new Error(error);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVendorData();
  }, [currentProduct]);

  return (
    <div className="z-50  fixed   flex h-[calc(100vh-115px)]  md:w-1/2 md:ml-auto  top-[115px]  right-0 border border-[#ccc] ">
      {/* <div className="z-50  md:z-10 fixed   flex h-[calc(100vh-115px)]  md:w-1/2 md:ml-auto lg:absolute top-[115px]  right-0 border border-[#ccc] "> */}
      {/* first div of grid */}
      <div className="bg-[#D9D9D9] opacity-70 border rounded-l-sm  overflow-hidden">
        <div
          className="py-3 lg:py-0 px-5"
          onClick={() => setShowRecommend(false)}
        >
          <MdOutlineCancel
            size={30}
            color="#374A75"
            className="cursor-pointer opacity-100"
          />
        </div>
      </div>
      {/* second div for recommend section */}
      <div className="flex-1 bg-white h-full  overflow-auto overflow-y-scroll scrollbar-hide">
        {/* button */}
        <div className="flex justify-center items-center py-7">
          <div className="bg-[#334A78] text-white border-2 border-[#334A78] rounded-md text-sm px-10 py-2">
            {`Products From ${manufacturer}`}
          </div>
        </div>
        {/* recomended images */}
        {isloading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 px-2 xl:px-10 mb-2 overflow-auto ">
            {recommendedProducts?.length > 0 ? (
              recommendedProducts?.map((prod) => (
                <Addon imagepath={prod?.image} key={prod?.id} product={prod} />
              ))
            ) : (
              <p className="col-span-2 text-center">
                No Products Recommended From Manufacturer
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="grid grid-cols-[1fr,4fr] h-[115%] w-1/2 ml-auto absolute top-[115px] z-10 right-0">
  //     {/* first div of grid */}
  //     <div className="bg-[#D9D9D9] opacity-70 border rounded-l-[60px] h-[75%] overflow-hidden">
  //       <div className="p-10" onClick={() => setShowRecommend(false)}>
  //         <MdOutlineCancel
  //           size={40}
  //           color="#374A75"
  //           className="cursor-pointer opacity-100"
  //         />
  //       </div>
  //     </div>
  //     {/* second div for recommend section */}
  //     <div className="bg-white h-[75%] overflow-auto overflow-y-scroll scrollbar-hide">
  //       {/* button */}
  //       <div className="flex justify-center items-center py-7">
  //         <div className="bg-[#334A78] text-white border-2 border-[#334A78] rounded-md text-sm px-10 py-2">
  //           Recommendation
  //         </div>
  //       </div>
  //       {/* recomended images */}
  //       <div className="grid grid-cols-2 gap-4 px-10 mt-2 overflow-auto">
  //         {recommendedProducts.map((prod) => (
  //           <Addon imagepath={prod?.image} key={prod?.id} />
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default RecommendComp;
