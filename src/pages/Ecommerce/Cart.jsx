import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { IoCaretDown, IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { supabase } from "../../services/supabase";
import { useEffect } from "react";
import { useApp } from "../../Context/Context";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import BottomTabs from "./BottomTabs";

function Cart() {
  const [wishListed, setWishListed] = useState(false);
  const navigate = useNavigate();

  // get the cart items from the cart table
  const { cartItems, SetRefreshCartItems, localcartItems, isAuthenticated } =
    useApp();

  // created a reduce function to calculate the total price
  const totalPrice = cartItems?.reduce(
    (acc, curr) => acc + curr.productId?.price * curr.quantity,
    0
  );

  // remove a particular item from the cart

  return (
    <>
      <Header />
      <div className="container">
        <div className="!my-10 flex items-center justify-center text-[#334A78] text-lg capitalize font-Poppins leading-[16.8px]">
          <div className="flex items-center gap-2">
            <p onClick={() => navigate("/products")} className="text-[#334A78]">
              cart
            </p>
            <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p className="text-[#549DC7]">Address</p>
            <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p>Payment</p>
          </div>
        </div>

        <section>
          <div className="flex gap-10 font-Poppins">
            <div className="flex-1 space-y-5">
              <div className="border border-[#CCCCCC] rounded-lg font-Poppins flex justify-between items-center p-5">
                <h5 className="text-sm text-[#171717] font-semibold ">
                  Check delivery time & services
                </h5>
                <button className="border border-[#C16452] text-[10px] font-semibold text-[#C16452] px-3.5 py-2">
                  ENTER PIN CODE
                </button>
              </div>

              {isAuthenticated ? (
                cartItems ? (
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <CartCard cartitem={item} key={item.id} />
                    ))}
                  </div>
                ) : (
                  <div>
                    <SpinnerFullPage />
                  </div>
                )
              ) : localcartItems ? (
                <div className="space-y-2">
                  {localcartItems.map((item) => (
                    <CartCard cartitem={item} key={item.id} />
                  ))}
                </div>
              ) : (
                <div>
                  <SpinnerFullPage />
                </div>
              )}

              {/* {cartItems ? (
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <CartCard cartitem={item} key={item.productId.title} />
                  ))}
                </div>
              ) : (
                <div>
                  <SpinnerFullPage />
                </div>
              )} */}

              <div className="border border-[#CCCCCC] rounded-lg font-Poppins flex justify-between items-center py-4 px-3">
                <div className="flex items-center">
                  <img
                    src="/images/wishlist.png"
                    alt="wishlist icon"
                    className="w-8"
                  />
                  <h5 className="text-sm text-[#171717] font-semibold ">
                    Add more from Wishlist
                  </h5>
                </div>
                <button className="  text-[#000000]">
                  <MdOutlineKeyboardArrowRight size={25} />
                </button>
              </div>
            </div>

            <div className="flex-1 border-l-[1px] pl-10">
              <h4 className="uppercase mb-7">
                price details (
                {isAuthenticated ? cartItems?.length : localcartItems?.length}{" "}
                Items)
              </h4>
              <div className="space-y-6 pb-6">
                <div className="flex justify-between">
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Total MRP
                  </h5>
                  <h5 className="font-medium text-base text-[#111111]/80 ">
                    Rs {totalPrice || 0}
                  </h5>
                </div>

                <div className="flex justify-between">
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Discount on MRP
                  </h5>
                  <h5 className="font-medium text-base text-[#34BFAD]/80 ">
                    -$3,600
                  </h5>
                </div>

                <div className="flex justify-between">
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Coupon Discount
                  </h5>
                  <h5 className="font-medium text-base text-[#F87171]">
                    Apply Coupon
                  </h5>
                </div>

                <div className="flex justify-between border-b-[1px]">
                  <div>
                    <h5 className="font-medium text-base text-[#111111]/80">
                      Shipping Fee
                    </h5>
                    <p className="text-xs text-[#111111]/50 font-medium pb-2">
                      Free Shipping for you
                    </p>
                  </div>
                  <h5 className="font-medium text-base text-[#34BFAD]/80 uppercase">
                    Free
                  </h5>
                </div>

                <div className="flex justify-between">
                  <h5 className="font-medium text-xl text-[#111111] uppercase">
                    Total Amount
                  </h5>
                  <h5 className="font-medium text-xl text-[#111111] ">
                    $3,196
                  </h5>
                </div>
              </div>

              <button className="uppercase text-xl text-[#ffffff] tracking-wider w-full flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin">
                place ORDER
              </button>
            </div>
          </div>
        </section>

        {/* You may also like */}
        <section className="py-14">
          <h3 className="uppercase font-semibold text-3xl text-[#171717]">
            You may also like
          </h3>

          <div className="font-Poppins w-[245px] h-[350px]">
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
                <div
                  onClick={() => setWishListed(!wishListed)}
                  className=" text-[#ccc] hover:text-red-950 cursor-pointer"
                >
                  {wishListed ? (
                    <AiFillHeart size={26} color="red" />
                  ) : (
                    <GoHeart size={25} />
                  )}
                </div>
              </div>
              <button className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
                ADD TO CART
              </button>
            </div>
          </div>
        </section>
      </div>

      <BottomTabs />
    </>
  );
}

export default Cart;

function CartCard({ cartitem }) {
  const { getCartItems, isAuthenticated, localcartItems } = useApp();
  async function handleRemoveItem(product) {
    if (isAuthenticated) {
      try {
        console.log("cartproduct", product);

        const { data, error } = await supabase
          .from("userProductCollection")
          .delete()
          .eq("id", product.id);

        console.log("data", data, "error", error);

        await getCartItems();

        if (error) throw new Error(error);
      } catch (error) {
        console.log(error);
      }
    } else {
      const removeproductfromlocalCartitems = localcartItems.filter(
        (item) => item.productId.id !== product?.productId?.id
      );

      console.log(localcartItems);
      console.log(product);

      console.log("after product removed", removeproductfromlocalCartitems);

      localStorage.setItem(
        "cartitems",
        JSON.stringify(removeproductfromlocalCartitems)
      );
    }
  }

  return (
    <>
      <div className="flex items-center border border-[#CCCCCC] rounded-lg relative">
        <img
          src={cartitem.productId.image}
          alt=""
          className="h-40 w-36 object-contain"
        />
        <div className="flex-1 font-Poppins space-y-3 font-medium">
          <div>
            <h5 className="text-sm text-[#111111] uppercase">
              {cartitem.productId?.title}
            </h5>
            <h5 className="text-sm text-[#111111]/50 capitalize">
              {cartitem.productId?.product_type}
            </h5>
          </div>
          <div className="flex justify-around items-center border border-[#cccccc] w-20 h-6">
            <p className="uppercase text-[#000000] text-[10px]">
              qty: {cartitem?.quantity || "NA"}
            </p>
            <IoCaretDown size={10} />
          </div>
          <div className="flex gap-3">
            <h5 className="text-sm font-medium text-[#111111]">
              Rs. {cartitem.productId?.price}
            </h5>
            <h5 className="text-sm font-medium text-[#111111]/50">
              <del>Rs. 1699.00</del>
            </h5>{" "}
            <h5 className="text-sm font-medium text-[#C20000]/50">
              Rs. 900 OFF
            </h5>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <button onClick={() => handleRemoveItem(cartitem)}>
            <IoClose />
          </button>
        </div>
      </div>
    </>
  );
}
