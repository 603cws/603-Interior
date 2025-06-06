import React from "react";
import Header from "./Header";
import { IoClose } from "react-icons/io5";
import { useApp } from "../../Context/Context";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const { wishlistItems, setWishlistItems } = useApp();
  console.log(wishlistItems);

  const navigate = useNavigate();

  const handleRemove = async (product) => {
    try {
      const { error } = await supabase
        .from("userProductCollection")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToCart = async (product) => {
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

  return (
    <div>
      {/* <Header /> */}
      <section className="container">
        <div className=" font-Poppins py-10">
          <h6 className="capitalize text-xl text-[#334A78]">
            my wishlist{" "}
            <span className="text-[#334A78]/70">
              {wishlistItems.length} items
            </span>
          </h6>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {wishlistItems.map((item, index) => (
            <div
              key={index}
              className="font-Poppins w-[245px] h-[350px] relative"
            >
              <div className="flex justify-center items-center p-2">
                <img
                  src={item.productId.image}
                  alt="chair"
                  className="h-52 object-contain"
                />
              </div>
              <div className="bg-[#fff] p-2">
                <div className="flex mb-4">
                  <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] space-y-1.5">
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
                    }
                  }}
                  className="text-[#000] capitalize bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm "
                >
                  {item.type === "cart" ? "Go to Cart" : "Move to Cart"}
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleRemove(item)}
                  className="bg-[#ffffff]/30 p-1 rounded-full"
                >
                  <IoClose />
                </button>
              </div>
            </div>
          ))}
          {/* <div className="font-Poppins w-[245px] h-[350px] relative">
            <div className="flex justify-center items-center p-2">
              <img
                src="/images/home/product-image.png"
                alt="chair"
                className="h-52 object-contain"
              />
            </div>
            <div className="bg-[#fff] p-2">
              <div className="flex mb-4">
                <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] space-y-1.5">
                  <h4 className="font-medium text-sm leading-[22.4px] uppercase">
                    FLAMINGO SLING
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className=" ">Rs 3,0000</p>
                    <p className="line-through text-[#111] text-opacity-50">
                      Rs $5678
                    </p>
                    <p className="text-[#C20000] uppercase">sale</p>
                  </div>
                </div>
              </div>
              <button className="text-[#000] capitalize bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
                move to cart
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button className="bg-[#ffffff]/30 p-1 rounded-full">
                <IoClose />
              </button>
            </div>
          </div>
          <div className="font-Poppins w-[245px] h-[350px] relative">
            <div className="flex justify-center items-center p-2">
              <img
                src="/images/home/product-image.png"
                alt="chair"
                className="h-52 object-contain"
              />
            </div>
            <div className="bg-[#fff] p-2">
              <div className="flex mb-4">
                <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] space-y-1.5">
                  <h4 className="font-medium text-sm leading-[22.4px] uppercase">
                    FLAMINGO SLING
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className=" ">Rs 3,0000</p>
                    <p className="line-through text-[#111] text-opacity-50">
                      Rs $5678
                    </p>
                    <p className="text-[#C20000] uppercase">sale</p>
                  </div>
                </div>
              </div>
              <button className="text-[#000] capitalize bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
                move to cart
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button className="bg-[#ffffff]/30 p-1 rounded-full">
                <IoClose />
              </button>
            </div>
          </div>
          <div className="font-Poppins w-[245px] h-[350px] relative">
            <div className="flex justify-center items-center p-2">
              <img
                src="/images/home/product-image.png"
                alt="chair"
                className="h-52 object-contain"
              />
            </div>
            <div className="bg-[#fff] p-2">
              <div className="flex mb-4">
                <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] space-y-1.5">
                  <h4 className="font-medium text-sm leading-[22.4px] uppercase">
                    FLAMINGO SLING
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className=" ">Rs 3,0000</p>
                    <p className="line-through text-[#111] text-opacity-50">
                      Rs $5678
                    </p>
                    <p className="text-[#C20000] uppercase">sale</p>
                  </div>
                </div>
              </div>
              <button className="text-[#000] capitalize bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
                move to cart
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button className="bg-[#ffffff]/30 p-1 rounded-full">
                <IoClose />
              </button>
            </div>
          </div>{" "}
          <div className="font-Poppins w-[245px] h-[350px] relative">
            <div className="flex justify-center items-center p-2">
              <img
                src="/images/home/product-image.png"
                alt="chair"
                className="h-52 object-contain"
              />
            </div>
            <div className="bg-[#fff] p-2">
              <div className="flex mb-4">
                <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] space-y-1.5">
                  <h4 className="font-medium text-sm leading-[22.4px] uppercase">
                    FLAMINGO SLING
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className=" ">Rs 3,0000</p>
                    <p className="line-through text-[#111] text-opacity-50">
                      Rs $5678
                    </p>
                    <p className="text-[#C20000] uppercase">sale</p>
                  </div>
                </div>
              </div>
              <button className="text-[#000] capitalize bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
                move to cart
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button className="bg-[#ffffff]/30 p-1 rounded-full">
                <IoClose />
              </button>
            </div>
          </div>{" "}
          <div className="font-Poppins w-[245px] h-[350px] relative">
            <div className="flex justify-center items-center p-2">
              <img
                src="/images/home/product-image.png"
                alt="chair"
                className="h-52 object-contain"
              />
            </div>
            <div className="bg-[#fff] p-2">
              <div className="flex mb-4">
                <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] space-y-1.5">
                  <h4 className="font-medium text-sm leading-[22.4px] uppercase">
                    FLAMINGO SLING
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className=" ">Rs 3,0000</p>
                    <p className="line-through text-[#111] text-opacity-50">
                      Rs $5678
                    </p>
                    <p className="text-[#C20000] uppercase">sale</p>
                  </div>
                </div>
              </div>
              <button className="text-[#000] capitalize bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
                move to cart
              </button>
            </div>
            <div className="absolute top-2 right-2">
              <button className="bg-[#ffffff]/30 p-1 rounded-full">
                <IoClose />
              </button>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Wishlist;
