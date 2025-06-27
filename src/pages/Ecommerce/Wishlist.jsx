import Header from "./Header";
import { IoClose } from "react-icons/io5";
import { useApp } from "../../Context/Context";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import BottomTabs from "./BottomTabs";
import { ToastContainer } from "react-toastify";

import { useHandleAddToCart } from "../../utils/HelperFunction";
import { useEffect, useState } from "react";

import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import { showRemoveFromCartToast } from "../../utils/AddToCartToast";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import MobileHeader from "../../common-components/MobileHeader";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  const [isloading, setIsloading] = useState(false);

  const { isAuthenticated } = useApp();

  const { handleAddToCart } = useHandleAddToCart();

  const getWishlistItems = async () => {
    setIsloading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) return [];

      const { data, error } = await supabase
        .from("userProductCollection")
        .select("*,productId(*)")
        .eq("userId", user.id)
        .eq("type", "wishlist");

      if (error) throw new Error(error);

      //  If there's no data or it's empty, set empty states and return early
      if (!data || data.length === 0) {
        setWishlistItems([]);
        return;
      }

      // 1. Extract unique image names
      const uniqueImages = [
        ...new Set(data.map((item) => item.productId.image)),
      ];

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
      const updatedProducts = data.map((item) => ({
        ...item,
        productId: {
          ...item.productId,
          image: urlMap[item.productId.image] || item.productId.image,
        },
      }));

      //for safety even if a product is added multiple times it will get filtered into one
      const uniquecartitems = [
        ...new Map(
          updatedProducts.map((item) => [item.productId.id, item])
        ).values(),
      ];
      setWishlistItems(uniquecartitems);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    getWishlistItems();
  }, []);

  const navigate = useNavigate();

  const handleRemove = async (product) => {
    try {
      const { error } = await supabase
        .from("userProductCollection")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      console.log(product, "product for delete");

      showRemoveFromCartToast(product, "wishlist");
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = async (product) => {
    console.log(product);
    try {
      const { data, error } = await supabase
        .from("userProductCollection")
        .update({ type: "cart" })
        .eq("id", product.id);
      if (error) throw error;

      setWishlistItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id ? { ...item, type: "cart" } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (isloading) return <SpinnerFullPage />;

  return (
    <div>
      <ToastContainer />
      <div className="hidden lg:block">
        <Header />
      </div>
      <div className="lg:hidden">
        <MobileHeader title={"Wishlist"} iscartshown={true} />
      </div>
      {!isloading && wishlistItems?.length >= 1 ? (
        <section className="lg:container lg:mx-auto px-3 lg:px-12">
          <div className="hidden lg:block font-Poppins py-10">
            <h6 className="capitalize text-xl text-[#334A78]">
              my wishlist{" "}
              <span className="text-[#334A78]/70">
                {wishlistItems.length} items
              </span>
            </h6>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
            {wishlistItems.map((item, index) => (
              <div
                key={index}
                className="font-Poppins max-w-xs lg:w-[245px] lg:h-[350px] relative"
              >
                <div className="relative flex justify-center items-center p-2">
                  <img
                    src={item.productId.image}
                    alt="chair"
                    className="h-52 object-contain"
                  />
                  <div className="absolute top-2 right-2 bg-[#fff]/30  rounded-full">
                    <button
                      onClick={() => handleRemove(item)}
                      className="bg-[#ffffff]/30 p-1 rounded-full"
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>
                <div className="bg-[#fff] p-2">
                  <div className="flex mb-2 lg:mb-4">
                    <div className="flex-1 text-[10px] lg:text-sm  leading-[22.4px]  text-[#111]  lg:space-y-1.5">
                      <h4 className="font-medium text-sm leading-[22.4px] uppercase">
                        {item.productId.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className=" ">&#8377; {item.productId.price}</p>
                        <p className="line-through text-[#111] text-opacity-50">
                          Rs &#8377;5678
                        </p>
                        <p className="text-[#C20000] uppercase">sale</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (item.type === "cart") {
                        navigate("/cart");
                      } else {
                        handleMoveToCart(item);
                        // handleAddToCart(item);
                      }
                    }}
                    className="text-[#000] capitalize bg-[#FFFFFF] text-[6px] md:text-[10px] lg:text-xs border border-[#ccc] px-2  py-2 rounded-sm "
                  >
                    {item.type === "cart" ? "Go to Cart" : "Move to Cart"}
                  </button>
                </div>
                {/* <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleRemove(item)}
                    className="bg-[#ffffff]/30 p-1 rounded-full"
                  >
                    <IoClose />
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex  flex-col gap-4 justify-center items-center h-[75vh] lg:h-full">
          <div className="flex justify-center items-center">
            <img src="/images/emptywishlist.png" alt="" className="max-w-sm" />
          </div>
          <h2 className="font-Poppins font-semibold text-xl lg:text-2xl text-[#000]">
            {isAuthenticated ? "Your Wishlist is Empty" : "PLEASE LOG IN"}
          </h2>
          <p className="font-Poppins text-xs text-[#000000]">
            {isAuthenticated
              ? "There is nothing in your bag. Let's add some items."
              : "Login to view items in your wishlist."}
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-[#334A78] border border-[#212B36] text-xs text-white tracking-wider uppercase py-3 active:scale-90 transition-transform ease-in-out duration-500 px-10 font-Poppins font-semibold"
          >
            start shopping
          </button>
          {/* <button
            onClick={() => navigate("/products")}
            className="bg-[#334A78] border border-[#212B36] text-xs text-white tracking-wider uppercase py-3 active:scale-90 transition-transform ease-in-out duration-500 px-10 font-Poppins font-semibold"
          >
            {isAuthenticated ? "start shopping" : "Login"}
          </button> */}
        </div>
      )}
      <div className="hidden lg:block fixed bottom-0 w-full">
        <BottomTabs />
      </div>
    </div>
  );
}

export default Wishlist;
