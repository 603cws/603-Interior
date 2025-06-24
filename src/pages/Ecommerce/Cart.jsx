import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { IoCaretDown, IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import BottomTabs from "./BottomTabs";
import CheckoutStepper from "../../common-components/CheckoutStepper";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { showRemoveFromCartToast } from "../../utils/AddToCartToast";
import { MdOutlineDelete } from "react-icons/md";
import "animate.css";

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className=" flex justify-center items-center">
      <div className=" my-4 space-y-6">
        {/* <img src="/images/EmptyCart.png" alt="empty cart" /> */}

        <p className="text-center">
          There is nothing in your cart. Let's add some items.
        </p>
        <div className="flex justify-center items-center">
          <button
            onClick={() => navigate("/shop")}
            className="px-10 py-3 bg-[#334A78] text-white border border-[#212B36]"
          >
            start shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const [wishListed, setWishListed] = useState(false);
  const [couponname, setCouponname] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [orignalTotalPrice, setOriginalToalPrice] = useState(0);
  const [disableApplycoupon, setDisableApplycoupon] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // get the cart items from the cart table
  const {
    cartItems,
    localcartItems,
    isAuthenticated,
    accountHolder,
    getCartItems,
  } = useApp();

  // created a reduce function to calculate the total price
  // let totalPrice = cartItems?.reduce(
  //   (acc, curr) => acc + curr.productId?.price * curr.quantity,
  //   0
  // );
  const sortedCartItems = [...cartItems].sort((a, b) =>
    a.productId.title.localeCompare(b.productId.title)
  );

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems?.reduce(
        (acc, curr) => acc + curr.productId?.price * curr.quantity,
        0
      );
      setTotalPrice(total || 0);
      setOriginalToalPrice(total || 0);
    };

    if (isAuthenticated && cartItems) calculateTotal();
    else if (!isAuthenticated && localcartItems) {
      const total = localcartItems?.reduce(
        (acc, curr) => acc + curr.productId?.price * curr.quantity,
        0
      );
      setTotalPrice(total || 0);
      setOriginalToalPrice(total || 0);
    }
  }, [cartItems, localcartItems, isAuthenticated]);

  const syncLocalCartToDB = async () => {
    if (!isAuthenticated) return localcartItems;

    const localCart = JSON.parse(localStorage.getItem("cartitems")) || [];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const formattedLocalItems = localCart.map((item) => ({
      userId: user.id,
      productId: item.productId.id || item.productId,
      type: "cart",
      quantity: item.quantity,
    }));

    console.log("user id ", user);

    try {
      const { data: dbCartItems, error: fetchError } = await supabase
        .from("userProductCollection")
        .select("*,productId(*)")
        .eq("userId", user.id)
        .eq("type", "cart");

      if (fetchError) throw new Error(fetchError.message);

      console.log(dbCartItems, "dbcartitems");

      const dbProductIds = dbCartItems.map((item) => item.productId.id);

      console.log(dbProductIds, "dbproductids");

      // const dbProductIds = dbCartItems.map((item) => item.productId);

      // Filter local items that are NOT already in DB

      console.log("localcart", formattedLocalItems);

      const itemsToInsert = formattedLocalItems.filter(
        (item) => !dbProductIds.includes(item.productId)
      );

      console.log(itemsToInsert, "itemstoisnert");

      if (itemsToInsert.length > 0) {
        for (const item of itemsToInsert) {
          const { error: insertError } = await supabase
            .from("userProductCollection")
            .upsert(item, {
              onConflict: ["userId", "productId", "type"],
              ignoreDuplicates: true,
            });
          // const { error: insertError } = await supabase
          //   .from("userProductCollection")
          //   .insert(item);

          if (insertError) {
            console.error("Error inserting item:", item, insertError.message);
            // optionally continue instead of throwing
            throw new Error(insertError.message);
          }
        }
      }

      // Remove synced items from localStorage
      // const remainingLocal = localCart.filter(
      //   (item) => !dbProductIds.includes(item.productId.id || item.productId)
      // );

      // localStorage.setItem("cartitems", JSON.stringify(cartItems));
      localStorage.setItem("cartitems", JSON.stringify([]));
      // localStorage.removeItem()
    } catch (error) {
      console.error("Cart sync error:", error);
    } finally {
      getCartItems();
    }
  };

  useEffect(() => {
    syncLocalCartToDB();
  }, []);

  // remove a particular item from the cart

  //function to handle the placeorder

  const handlePlaceOrder = () => {
    if (isAuthenticated) {
      console.log("user is logged in ");
      navigate("/address");
    } else {
      // navigate("/login");

      console.log("hello");

      navigate("/login", { state: { from: location.pathname } });
    }
  };

  const handleRemoveCoupon = async () => {
    if (couponname.trim() === "") return toast.error("no coupon applied");
    if (totalPrice === 0) return setCouponname("");
    if (!disableApplycoupon) return toast.error("coupon already removed");
    toast.success("remove coupon");
    setCouponname("");
    setDisableApplycoupon(false);
    setTotalPrice(orignalTotalPrice);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();

    if (totalPrice === 0) return toast.error("cart is empty");

    if (disableApplycoupon) return toast.error("coupon already applied");

    if (couponname.trim() === 0) return toast.error("enter the coupon");
    try {
      const checkcoupon = couponname.toUpperCase();
      const { data: coupon, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .eq("couponName", checkcoupon)
        .single();

      console.log(checkcoupon, "name");

      if (fetchError) throw new Error(fetchError.message);
      console.log("couponfromdb", coupon);

      if (coupon?.length === 0) return toast.error("Invalid Coupon");

      const discountedprice =
        totalPrice - (totalPrice * coupon?.discountPerc) / 100;

      setDisableApplycoupon(true);

      // console.log(discountedprice, "discountedprice");

      toast.success("coupon is valid");

      console.log(totalPrice, "calctotlaprice");

      setTotalPrice(discountedprice);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <div>
        <div className="container">
          <CheckoutStepper highlighted={"cart"} />

          <div>
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
                        {cartItems.length > 0 ? (
                          sortedCartItems.map((item) => (
                            <CartCard cartitem={item} key={item.id} />
                          ))
                        ) : (
                          <div>
                            <EmptyCart />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <SpinnerFullPage />
                      </div>
                    )
                  ) : localcartItems ? (
                    <div className="space-y-2">
                      {localcartItems.length > 0 ? (
                        <>
                          {localcartItems.map((item) => (
                            <CartCard cartitem={item} key={item.productId.id} />
                          ))}
                          <p className="text-sm text-[#777] ml-2 !mt-6">
                            <span
                              onClick={() =>
                                navigate("/login", {
                                  state: { from: location.pathname },
                                })
                              }
                              className="underline underline-offset-4 cursor-pointer hover:text-[#334A78] font-medium"
                            >
                              Login
                            </span>{" "}
                            to see full cart.
                          </p>
                        </>
                      ) : (
                        <EmptyCart />
                      )}
                    </div>
                  ) : (
                    <div>
                      <SpinnerFullPage />
                    </div>
                  )}

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
                    <button
                      onClick={() => navigate("/wishlist")}
                      className="  text-[#000000]"
                    >
                      <MdOutlineKeyboardArrowRight size={25} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 border-l-[1px] pl-10">
                  <h4 className="uppercase mb-7">
                    price details (
                    {isAuthenticated
                      ? cartItems?.length
                      : localcartItems?.length}{" "}
                    Items)
                  </h4>
                  <div className="space-y-6 pb-6">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-base text-[#111111]/80">
                        Total MRP
                      </h5>
                      <h5 className="font-medium text-base text-[#111111]/80 ">
                        Rs {orignalTotalPrice || 0}
                      </h5>
                    </div>

                    <div className="flex justify-between">
                      <h5 className="font-medium text-base text-[#111111]/80">
                        Discount on MRP
                      </h5>
                      <h5 className="font-medium text-base text-[#34BFAD]/80 ">
                        -Rs 0
                      </h5>
                    </div>

                    <div className="flex justify-between">
                      <h5 className="font-medium text-base text-[#111111]/80">
                        Coupon Discount
                      </h5>
                      <form
                        onSubmit={handleApplyCoupon}
                        method="post"
                        className=""
                      >
                        <div className="relative border border-[#ccc] w-full flex">
                          <input
                            type="text"
                            value={couponname}
                            onChange={(e) => setCouponname(e.target.value)}
                            className="w-[65%] uppercase focus:outline-none focus:ring-0"
                            // disabled={disableApplycoupon}
                            required
                          />
                          <button
                            type="submit"
                            className="text-xs w-[15%] bg-[#334A78] text-[#fff] font-medium border-none"
                          >
                            Apply{" "}
                          </button>
                          <button
                            onClick={handleRemoveCoupon}
                            type="button"
                            className=" text-xs w-[20%] bg-[#549DC7] font-medium text-center text-[#fff]"
                          >
                            Remove{" "}
                          </button>
                        </div>
                      </form>
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
                        Rs {totalPrice || 0}
                      </h5>
                    </div>
                  </div>

                  {/* {totalPrice > 0 && (
                    <button className="uppercase text-xl text-[#ffffff] tracking-wider w-full flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin">
                      place ORDER
                    </button>
                  )} */}
                  {totalPrice > 0 && (
                    <button
                      onClick={handlePlaceOrder}
                      className="uppercase text-xl text-[#ffffff] tracking-wider w-full flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
                    >
                      place ORDER
                    </button>
                  )}
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
        </div>
      </div>

      <BottomTabs />
    </>
  );
}

export default Cart;

function CartCard({ cartitem }) {
  const [loadingQty, setLoadingQty] = useState(false);
  const [signedUrl, setSignedUrl] = useState(cartitem.productId.image);

  const { getCartItems, isAuthenticated, localcartItems, setLocalCartItems } =
    useApp();
  const navigate = useNavigate();

  console.log(cartitem);

  async function handleRemoveItem(product) {
    if (isAuthenticated) {
      try {
        console.log("cartproduct", product);

        const { data, error } = await supabase
          .from("userProductCollection")
          .delete()
          .eq("id", product.id);

        console.log("data", data, "error", error);

        showRemoveFromCartToast(product);
        if (error) throw new Error(error);
      } catch (error) {
        console.log(error);
      } finally {
        getCartItems();
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
      setLocalCartItems(removeproductfromlocalCartitems);
      showRemoveFromCartToast(product);
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    setLoadingQty(true);
    try {
      const { data, error } = await supabase
        .from("userProductCollection")
        .update({ quantity: newQuantity })
        .eq("productId", productId);
      console.log(data);
      if (error) {
        console.log(error);
      }
      setLoadingQty(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingQty(false);
      getCartItems();
    }
  };

  const handleProductQuantityDec = (product, quantity) => {
    if (isAuthenticated) {
      if (quantity === 1) {
        handleRemoveItem(product);
      } else {
        updateQuantity(product.productId?.id, quantity - 1);
      }
    } else {
      if (quantity === 1) {
        handleRemoveItem(product);
        return;
      }
      const updatedLocalItems = localcartItems.map((item) =>
        item.productId.id === product.productId.id
          ? { ...item, quantity: quantity - 1 }
          : item
      );
      localStorage.setItem("cartitems", JSON.stringify(updatedLocalItems));
      setLocalCartItems(updatedLocalItems);
    }
  };

  const handleProductQuantityInc = (product, quantity) => {
    if (isAuthenticated) {
      updateQuantity(product.productId?.id, quantity + 1);
    } else {
      const updatedLocalItems = localcartItems.map((item) =>
        item.productId.id === product.productId.id
          ? { ...item, quantity: quantity + 1 }
          : item
      );
      localStorage.setItem("cartitems", JSON.stringify(updatedLocalItems));
      setLocalCartItems(updatedLocalItems);
    }
  };

  const refreshSignedUrl = async () => {
    try {
      const fullSignedUrl = cartitem.productId.image;
      let imagePath = fullSignedUrl.split("/object/sign/")[1]?.split("?")[0];
      console.log(imagePath);
      if (imagePath.startsWith("addon/")) {
        imagePath = imagePath.replace(/^addon\//, "");
        console.log(imagePath);
      }
      const { data, error } = await supabase.storage
        .from("addon")
        .createSignedUrl(imagePath, 3600);
      if (!error && data?.signedUrl) {
        setSignedUrl(data.signedUrl);
        const updatedItems = localcartItems.map((item) =>
          item.productId.id === cartitem.productId.id
            ? {
                ...item,
                productId: {
                  ...item.productId,
                  image: data.signedUrl,
                },
              }
            : item
        );
        localStorage.setItem("cartitems", JSON.stringify(updatedItems));
        setLocalCartItems(updatedItems);
      } else {
        console.error("Signed URL error:", error);
      }
    } catch (err) {
      console.error("refreshSignedUrl failed:", err);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 border border-[#CCCCCC] rounded-lg relative">
        <img
          src={signedUrl}
          alt=""
          className="h-40 w-36 object-contain cursor-pointer"
          onClick={() => navigate(`/productview/${cartitem.productId?.id}`)}
          onError={refreshSignedUrl}
        />
        <div className="flex-1 font-Poppins space-y-3 font-medium">
          <div>
            <h5
              onClick={() => navigate(`/productview/${cartitem.productId?.id}`)}
              className="text-sm text-[#111111] uppercase cursor-pointer"
            >
              {cartitem.productId?.title}
            </h5>
            <h5 className="text-sm text-[#111111]/50 capitalize">
              {cartitem.productId?.product_type}
            </h5>
          </div>
          {/* <div className="flex justify-around items-center border border-[#cccccc] w-20 h-6">
            <p className="uppercase text-[#000000] text-[10px]">
              qty: {cartitem?.quantity || "NA"}
            </p>
            <IoCaretDown size={10} />
          </div> */}
          <div className=" flex  gap-3 my-2">
            <div className="flex items-start justify-start gap-2">
              <button
                className="border w-8 h-7 flex justify-center items-center font-semibold"
                onClick={() =>
                  handleProductQuantityDec(cartitem, cartitem?.quantity)
                }
                disabled={loadingQty}
              >
                {loadingQty ? (
                  <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin inline-block"></span>
                ) : cartitem?.quantity === 1 ? (
                  <div className="hover:animate-shake hover:text-red-400 w-full h-full flex justify-center items-center">
                    <MdOutlineDelete className="mx-auto" />
                  </div>
                ) : (
                  "-"
                )}
              </button>
              <input
                type="number"
                className="border  w-12 h-7 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                // min={1}
                value={cartitem?.quantity || "NA"}
                readOnly
              />
              <button
                className="border  w-8 h-7 flex justify-center items-center font-semibold"
                onClick={() =>
                  handleProductQuantityInc(cartitem, cartitem?.quantity)
                }
                disabled={loadingQty}
              >
                {loadingQty ? (
                  <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin inline-block"></span>
                ) : (
                  "+"
                )}
              </button>
            </div>
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
