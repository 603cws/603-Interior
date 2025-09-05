import { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { GoHeart } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import BottomTabs from "./BottomTabs";
import CheckoutStepper from "../../common-components/CheckoutStepper";
import { ToastContainer } from "react-toastify";
import { showRemoveFromCartToast } from "../../utils/AddToCartToast";
import { MdOutlineDelete } from "react-icons/md";
import "animate.css";
import MobileHeader from "../../common-components/MobileHeader";
// import PriceDetail from "../../common-components/PriceDetail";
import CheckPinCode from "./CheckPinCode";
import { IoCartSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { isCouponValid } from "../../utils/ResuableFunctions";
import AppliedCoupon from "../../common-components/AppliedCoupon";
import { MdOutlineCancel } from "react-icons/md";

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className=" flex justify-center items-center">
      <div className=" my-4 space-y-6">
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
  const [showClearCartPopup, setShowClearCartPopup] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // get the cart items from the cart table
  const {
    cartItems,
    localcartItems,
    isAuthenticated,
    getCartItems,
    setCartItems,
    setLocalCartItems,
    accountHolder,
  } = useApp();

  const sortedCartItems = [...cartItems].sort((a, b) =>
    a.productId.title.localeCompare(b.productId.title)
  );

  const [orignalTotalPrice, setOriginalToalPrice] = useState(0);
  const [disableApplycoupon, setDisableApplycoupon] = useState(false);
  const [differenceInPrice, setDifferenceInPrice] = useState(0);
  const [differenceInPricetoshow, setDifferenceInPricetoshow] = useState();
  const [allCoupons, setAllCoupons] = useState([]);
  const [ismobileCouponFormOpen, setIsMobileCouponFormOpen] = useState(false);
  const [couponname, setCouponname] = useState("");

  const [gst, setGst] = useState(0);
  const [shippingcharge, setshippingCharge] = useState(0);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [mobilecouponname, setmobilecouponname] = useState("");
  const finalValue = (
    orignalTotalPrice -
    differenceInPrice +
    shippingcharge +
    gst
  ).toFixed(2);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems?.reduce(
        (acc, curr) => acc + curr.productId?.price * curr.quantity,
        0
      );
      setOriginalToalPrice(total || 0);
    };

    if (isAuthenticated && cartItems) calculateTotal();
    else if (!isAuthenticated && localcartItems) {
      const total = localcartItems?.reduce(
        (acc, curr) => acc + curr.productId?.price * curr.quantity,
        0
      );
      // setCartTotalPrice(total || 0);
      setOriginalToalPrice(total || 0);
    }
  }, [cartItems, localcartItems, isAuthenticated]);

  const handleRemoveCoupon = async () => {
    if (orignalTotalPrice === 0) return setCouponname("");
    setCouponname("");
    toast.success("remove coupon");
    setDisableApplycoupon(false);
    const Getgstprice = calculateGst(orignalTotalPrice);
    setGst(Getgstprice);
    setDifferenceInPrice(0);
  };

  function RevevaluteAppliedCoupon(coupon) {
    if (disableApplycoupon) {
      const price = cartItems?.reduce(
        (acc, curr) => acc + curr.productId?.price * curr.quantity,
        0
      );
      if (!isCouponValid(coupon, price)) {
        handleRemoveCoupon();
      } else {
        const discountedprice =
          orignalTotalPrice - (orignalTotalPrice * coupon?.discountPerc) / 100;
        calculateTotalDiffer(coupon);
        const gstprice = calculateGst(discountedprice, discountedprice);
        setGst(gstprice);
        toast.success(" is valid");
      }
    }
  }

  useEffect(() => {
    RevevaluteAppliedCoupon(mobilecouponname);
  }, [orignalTotalPrice]);

  useEffect(() => {
    const price = orignalTotalPrice.toFixed(2);

    if (differenceInPrice > 0) {
      const discountedprice =
        orignalTotalPrice -
        (orignalTotalPrice * mobilecouponname?.discountPerc) / 100;
      const Getgstprice = calculateGst(orignalTotalPrice, discountedprice);
      setGst(Getgstprice);
    } else {
      const Getgstprice = calculateGst(price);
      setGst(Getgstprice);
    }
    const shippiingFee = GetDeliveryCharges(orignalTotalPrice);
    setshippingCharge(shippiingFee);
  }, [orignalTotalPrice]);

  const handleCheckCoupon = async (e) => {
    e.preventDefault();

    if (orignalTotalPrice === 0) return toast.error("cart is empty");

    if (disableApplycoupon) return toast.error("coupon already applied");

    if (couponname.trim() === 0) return toast.error("enter the coupon");
    try {
      // const checkcoupon = couponname.toUpperCase();
      const { data: coupon, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .eq("couponName", couponname)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      if (!isCouponValid(coupon, orignalTotalPrice))
        return toast.error("coupon is expired or min purchase not reached");
      calculateTotalDiffertoShow(coupon);
      // calculateTotalDiffer(coupon);
      setmobilecouponname(coupon);
    } catch (error) {
      console.log(error);
      toast.error("Invalid Coupon");
    }
  };

  function calculateTotalDiffer(coupon) {
    //we get the entire coupon for already haved coupon name
    const discountedprice =
      orignalTotalPrice - (orignalTotalPrice * coupon?.discountPerc) / 100;
    const difference = orignalTotalPrice - discountedprice;

    setDifferenceInPrice(difference);
  }
  function calculateTotalDiffertoShow(coupon) {
    //we get the entire coupon for already haved coupon name
    const discountedprice =
      orignalTotalPrice - (orignalTotalPrice * coupon?.discountPerc) / 100;
    const difference = orignalTotalPrice - discountedprice;

    setDifferenceInPricetoshow(difference);

    // setDifferenceInPrice(difference);
  }

  const getallthecouponsFromDB = async () => {
    try {
      const { data: coupon, error: fetchError } = await supabase
        .from("coupons")
        .select("*");
      setAllCoupons(coupon);

      if (fetchError) throw new Error(fetchError);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallthecouponsFromDB();
  }, []);

  const handleApplyofCoupon = async (coupon) => {
    if (orignalTotalPrice === 0) return toast.error("cart is empty");

    if (disableApplycoupon) return toast.error("coupon already applied");
    if (!isCouponValid(coupon, orignalTotalPrice))
      return toast.error("coupon is expired or min purchase not reached");
    try {
      const discountedprice =
        orignalTotalPrice - (orignalTotalPrice * coupon?.discountPerc) / 100;
      setDisableApplycoupon(true);
      setmobilecouponname(coupon);
      // localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
      calculateTotalDiffer(coupon);
      const gstprice = calculateGst(orignalTotalPrice, discountedprice);
      setGst(gstprice);
      toast.success("coupon is valid");
      // setCartTotalPrice(discountedprice);
    } catch (error) {
      console.log(error);
      toast.error("Invalid Coupon");
    } finally {
      setIsMobileCouponFormOpen(false);
    }
  };

  // useEffect(() => {
  //   const savedCoupon = localStorage.getItem("appliedCoupon");
  //   if (
  //     savedCoupon &&
  //     !mobilecouponname && // not already restored
  //     orignalTotalPrice > 0
  //   ) {
  //     const parsedCoupon = JSON.parse(savedCoupon);
  //     setmobilecouponname(parsedCoupon);
  //     setDisableApplycoupon(true);

  //     const discountedprice =
  //       orignalTotalPrice -
  //       (orignalTotalPrice * parsedCoupon.discountPerc) / 100;

  //     setCartTotalPrice(discountedprice);
  //     const gstprice = calculateGst(discountedprice);
  //     setGst(gstprice);

  //     const difference = orignalTotalPrice - discountedprice;
  //     setDifferenceInPrice(difference);
  //   }
  // }, [orignalTotalPrice]);

  // create the order
  // async function createOrder() {
  //   try {
  //     // get the current user
  //     //get all the cart items
  //     // shipping address
  //   } catch (error) {}
  // }

  function calculateGst(price, discount = 0) {
    if (discount) {
      return discount * 0.18;
    } else {
      return price * 0.18;
    }
  }

  function GetDeliveryCharges(price) {
    return price > 1000 ? 0 : 200;
  }

  const [checkPin, setCheckPin] = useState(false);

  const syncLocalCartToDB = async () => {
    if (!isAuthenticated) return localcartItems;

    const localCart = JSON.parse(localStorage.getItem("cartitems")) || [];

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const formattedLocalItems = localCart.map((item) => ({
      userId: user.id,
      productId: item.productId.id || item.productId,
      type: "cart",
      quantity: item.quantity,
    }));

    try {
      const { data: dbCartItems, error: fetchError } = await supabase
        .from("userProductCollection")
        .select("*,productId(*)")
        .eq("userId", user.id)
        .eq("type", "cart");

      if (fetchError) throw new Error(fetchError.message);

      const dbProductIds = dbCartItems.map((item) => item.productId.id);

      const itemsToInsert = formattedLocalItems.filter(
        (item) => !dbProductIds.includes(item.productId)
      );

      if (itemsToInsert.length > 0) {
        for (const item of itemsToInsert) {
          const { error: insertError } = await supabase
            .from("userProductCollection")
            .upsert(item, {
              onConflict: ["userId", "productId", "type"],
              ignoreDuplicates: true,
            });

          if (insertError) {
            console.error("Error inserting item:", item, insertError.message);
            // optionally continue instead of throwing
            throw new Error(insertError.message);
          }
        }
      }

      // Remove synced items from localStorage
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

  const onClose = () => {
    setCheckPin(!checkPin);
  };

  const handlePlaceOrder = () => {
    if (isAuthenticated) {
      const formatteddata = {
        price: orignalTotalPrice || 0,
        discount: differenceInPrice || 0,
        gst: gst || 0,
        finalValue: +finalValue,
        coupon: mobilecouponname || "",
        shippingFee: shippingcharge || 0,
      };
      navigate("/address", { state: { data: formatteddata } });
    } else {
      // navigate("/login");
      navigate("/login", { state: { from: location.pathname } });
    }
  };
  const handleClearCart = async () => {
    if (isAuthenticated) {
      const { error } = await supabase
        .from("userProductCollection")
        .delete()
        .eq("userId", accountHolder.userId)
        .eq("type", "cart");

      if (error) {
        console.error("Failed to clear cart from database:", error.message);
      } else {
        setCartItems([]);
        setShowClearCartPopup(false);
      }
    } else {
      localStorage.removeItem("cartitems");
      setLocalCartItems([]);
      setShowClearCartPopup(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="hidden lg:block">
        {" "}
        <Header />
      </div>

      <MobileHeader title={"cart"} />
      <div>
        <div className="lg:container lg:mx-auto px-2 md:px-4 lg:px-12">
          <div className="hidden lg:block">
            <CheckoutStepper highlighted={"cart"} />
          </div>

          <div>
            <section>
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 font-Poppins">
                <div className="flex-1 space-y-2 lg:space-y-5">
                  <div className="lg:border lg:border-[#CCCCCC] rounded-lg font-Poppins flex justify-between items-center p-2 lg:p-5">
                    <h5 className="text-[10px] lg:text-sm text-[#171717] font-semibold ">
                      Check delivery time & services
                    </h5>
                    <button
                      onClick={() => setCheckPin(true)}
                      className="border border-[#C16452] text-[8px] lg:text-[10px] font-semibold text-[#C16452] px-3.5 py-2"
                    >
                      ENTER PIN CODE
                    </button>
                  </div>
                  {(cartItems.length > 0 || localcartItems.length > 0) && (
                    <div className="w-full flex justify-end">
                      <button
                        onClick={() => setShowClearCartPopup(true)}
                        className="border border-[#C16452] text-[8px] lg:text-[10px] font-semibold text-[#C16452] px-3.5 py-2"
                      >
                        Clear cart
                      </button>
                    </div>
                  )}

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

                  <div className="lg:border border-[#CCCCCC] rounded-lg font-Poppins flex justify-between items-center py-2 px-2 lg:py-4 lg:px-3">
                    <div className="flex items-center">
                      <img
                        src="/images/wishlist.png"
                        alt="wishlist icon"
                        className="w-8"
                      />
                      <h5 className="text-[10px] lg:text-sm text-[#171717] font-semibold ">
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
                {showClearCartPopup && (
                  <ClearCartPopUp
                    onConfirm={handleClearCart}
                    onClose={() => setShowClearCartPopup(false)}
                  />
                )}

                <div className="flex-1 lg:border-l-[1px] lg:pl-10 text-sm lg:text-base">
                  <h4 className="uppercase mb-3 lg:mb-7">
                    price details (
                    {isAuthenticated
                      ? cartItems?.length
                      : localcartItems?.length}{" "}
                    Items)
                  </h4>
                  {orignalTotalPrice > 0 ? (
                    <div className="space-y-3 lg:space-y-6 lg:pb-6">
                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111]/80">
                          Total MRP
                        </h5>
                        <h5 className="font-medium  text-[#111111]/80 ">
                          Rs {orignalTotalPrice || "--"}
                        </h5>
                      </div>

                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111]/80">
                          Discount on MRP
                        </h5>
                        <h5 className="font-medium  text-[#34BFAD]/80 ">
                          -Rs 0
                        </h5>
                      </div>

                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111]/80">
                          Coupon Discount
                        </h5>
                        {disableApplycoupon ? (
                          <div className="font-medium  text-[#34BFAD]/80 ">
                            -Rs{" "}
                            {orignalTotalPrice > 0
                              ? differenceInPrice.toFixed(2)
                              : "--"}
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              orignalTotalPrice > 0
                                ? setIsMobileCouponFormOpen(true)
                                : toast.error("no item in the cart")
                            }
                            className="text-[#F87171] hover:underline"
                          >
                            Apply Coupon
                          </button>
                        )}
                      </div>

                      {orignalTotalPrice > 0 && disableApplycoupon && (
                        <div>
                          <AppliedCoupon
                            savedamount={differenceInPrice}
                            handleRemove={handleRemoveCoupon}
                            code={mobilecouponname?.couponName}
                          />
                        </div>
                      )}

                      <div className="flex justify-between border-b-[1px]">
                        <div>
                          <h5 className="font-medium  text-[#111111]/80">
                            Shipping Fee
                          </h5>
                          <p className="text-xs text-[#111111]/50 font-medium pb-2">
                            Free Shipping for you
                          </p>
                        </div>
                        <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                          {shippingcharge === 0 ? "Free" : shippingcharge}
                        </h5>
                      </div>

                      <div className="flex justify-between border-b-[1px]">
                        <div>
                          <h5 className="font-medium  text-[#111111]/80">
                            GST Fee
                          </h5>
                        </div>
                        <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                          {gst?.toFixed(2)}
                        </h5>
                      </div>

                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111] uppercase">
                          Total Amount
                        </h5>
                        <h5 className="font-medium  text-[#111111] ">
                          {finalValue}
                        </h5>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 lg:space-y-6 lg:pb-6">
                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111]/80">
                          Total MRP
                        </h5>
                        <h5 className="font-medium  text-[#111111]/80 ">--</h5>
                      </div>

                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111]/80">
                          Discount on MRP
                        </h5>
                        <h5 className="font-medium  text-[#34BFAD]/80 ">--</h5>
                      </div>

                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111]/80">
                          Coupon Discount
                        </h5>
                        <button
                          onClick={() => toast.error("no item in the cart")}
                          className="text-[#F87171] hover:underline"
                        >
                          Apply Coupon
                        </button>
                      </div>

                      <div className="flex justify-between border-b-[1px]">
                        <div>
                          <h5 className="font-medium  text-[#111111]/80">
                            Shipping Fee
                          </h5>
                          <p className="text-xs text-[#111111]/50 font-medium pb-2">
                            Free Shipping for you
                          </p>
                        </div>
                        <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                          --
                        </h5>
                      </div>

                      <div className="flex justify-between border-b-[1px]">
                        <div>
                          <h5 className="font-medium  text-[#111111]/80">
                            GST Fee
                          </h5>
                        </div>
                        <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                          --
                        </h5>
                      </div>

                      <div className="flex justify-between">
                        <h5 className="font-medium  text-[#111111] uppercase">
                          Total Amount
                        </h5>
                        <h5 className="font-medium  text-[#111111] ">--</h5>
                      </div>
                    </div>
                  )}

                  {ismobileCouponFormOpen && (
                    <div className="inset-0 fixed top-0 z-10 bg-[#000]/20 sm:flex sm:justify-center sm:items-center ">
                      <div className=" bg-[#fff] p-2 lg:p-7 h-dvh sm:h-[90vh]  flex flex-col font-Poppins">
                        <div className="flex justify-between items-center py-3 font-medium">
                          <h2 className="text-[#171717]">Coupon</h2>
                          <button
                            onClick={() => setIsMobileCouponFormOpen(false)}
                          >
                            <MdOutlineCancel size={25} />
                          </button>
                        </div>
                        <div>
                          <form
                            onSubmit={handleCheckCoupon}
                            method="post"
                            className=""
                          >
                            <div className="w-full max-w-md">
                              <div className="flex items-center border border-gray-300 rounded-md ">
                                <input
                                  type="text"
                                  placeholder="Enter coupon code"
                                  value={couponname}
                                  onChange={(e) =>
                                    setCouponname(e.target.value)
                                  }
                                  required
                                  className="w-3/4 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="w-1/4 px-5 py-3 text-[#304778] text-sm font-medium leading-7 tracking-wider uppercase"
                                >
                                  Check
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>

                        <div className="mt-6 flex-1 overflow-y-scroll space-y-2">
                          {allCoupons.map((coupon, index) => (
                            <CouponCard
                              key={index}
                              coupon={coupon}
                              mobilecouponname={mobilecouponname}
                              setmobilecouponname={setmobilecouponname}
                              calculateTotalDiffertoShow={
                                calculateTotalDiffertoShow
                              }
                            />
                          ))}
                        </div>

                        <div className="flex justify-between items-center font-Poppins gap-2 ">
                          <div className="space-y-3">
                            <h2 className="text-sm leading-4 uppercase text-nowrap">
                              Maximum Saving :
                            </h2>
                            <p className="font-semibold text-xl text-[#000] leading-[15px] tracking-[1.2px]">
                              ₹ {differenceInPricetoshow?.toFixed(2) || 0}
                            </p>
                            {/* <p className="font-semibold text-xl text-[#000] leading-[15px] tracking-[1.2px]">
                    ₹ {differenceInPrice.toFixed(2) || 0}
                  </p> */}
                          </div>
                          <div>
                            <button
                              onClick={() =>
                                handleApplyofCoupon(mobilecouponname)
                              }
                              className="px-[65px] py-[17px] text-white bg-[#334A78] border border-[#212B36]"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {orignalTotalPrice > 0 && (
                    <button
                      // onClick={handlebtnClick}
                      onClick={handlePlaceOrder}
                      className="hidden uppercase text-xl text-[#ffffff] tracking-wider w-full lg:flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
                    >
                      place ORDER
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* You may also like */}
            <section className="pt-6 pb-14 lg:py-14">
              <h3 className="uppercase text-sm font-medium lg:font-semibold lg:text-3xl text-[#171717]">
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

      {orignalTotalPrice > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-center items-center mb-2">
          <div className="w-[90%]">
            <button
              onClick={handlePlaceOrder}
              className="uppercase text-xl text-white tracking-wider w-full bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
            >
              place order
            </button>
          </div>
        </div>
      )}

      {checkPin && <CheckPinCode onClose={onClose} />}

      <div className="hidden lg:block">
        {" "}
        <BottomTabs />
      </div>
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

  async function handleRemoveItem(product) {
    if (isAuthenticated) {
      try {
        const { data, error } = await supabase
          .from("userProductCollection")
          .delete()
          .eq("id", product.id);

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
      if (imagePath.startsWith("addon/")) {
        imagePath = imagePath.replace(/^addon\//, "");
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
  const cartItemTotal = cartitem.productId.price * cartitem.quantity;

  return (
    <>
      <div className="flex items-center gap-2 lg:border border-[#CCCCCC] rounded-lg relative py-2">
        <img
          src={signedUrl}
          alt=""
          className="w-24 h-24 md:h-32 md:w-28 lg:h-40 lg:w-36 object-contain "
          onClick={() => navigate(`/productview/${cartitem.productId?.id}`)}
          onError={refreshSignedUrl}
        />
        <div className="flex-1 font-Poppins space-y-3 font-medium text-[10px] lg:text-sm">
          <div>
            <h5
              onClick={() => navigate(`/productview/${cartitem.productId?.id}`)}
              className="leading-[22.5px] font-medium text-[#111111] uppercase cursor-pointer"
            >
              {cartitem.productId?.title}
            </h5>
            <h5 className=" text-[#111111]/50 capitalize">
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
            <h5 className=" font-medium text-[#111111]">
              Rs. {cartitem.productId?.price}
            </h5>
            <h5 className=" font-medium text-[#111111]/50">
              <del>Rs. 1699.00</del>
            </h5>{" "}
            <h5 className="font-medium text-[#C20000]/50">Rs. 900 OFF</h5>
          </div>
          <p className="text-xs font-bold text-[#111]">
            Total : Rs. {cartItemTotal}
          </p>
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

function ClearCartPopUp({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000]/30">
      <div className="w-full max-w-md space-y-7 rounded-lg bg-[#fff] p-7 font-garamond">
        <div className="flex justify-center items-center">
          <div className="flex justify-center w-24 h-24 relative items-center ">
            <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-[#FDECEC] arrive-out" />
            <div className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE5E5] arrive-mid" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FAD1D1] z-10">
              <IoCartSharp size={25} color="#D14242" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl font-medium text-[#101828]">
            Are you sure you want to clear your cart?{" "}
          </p>
          <p className="text-sm text-[#4D4D4D]">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-around gap-10">
          <button
            onClick={onClose}
            className="text-[#344054] border flex-1 rounded-xl py-2.5"
          >
            Keep my cart
          </button>
          <button
            onClick={onConfirm}
            className="border bg-[#225378] text-[#fff] flex-1 rounded-xl py-2.5"
          >
            Clear Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

function CouponCard({
  coupon,
  setmobilecouponname,
  mobilecouponname,
  calculateTotalDiffertoShow,
}) {
  console.log(mobilecouponname, "hello");

  return (
    <div className="flex items-start space-x-2 font-Poppins ">
      <input
        type="checkbox"
        checked={mobilecouponname?.couponName === coupon?.couponName}
        onChange={(e) => {
          if (e.target.checked) {
            setmobilecouponname(coupon);
            calculateTotalDiffertoShow(coupon);
          } else {
            setmobilecouponname("");
          }
        }}
        className="w-5 h-5 accent-[#304778] mt-1 cursor-pointer"
      />

      <div className="flex-1 ">
        <div className="inline-block border-2 border-dashed border-[#304778] text-[#304778] text-[10px] px-4 py-1 font-semibold tracking-wider mb-[10px]">
          {coupon?.couponName}
        </div>

        <p className="font-semibold text-xs leading-[28.8px] text-black">
          Save {coupon?.discountPerc}%
        </p>
        <p className="text-xs text-[#304778] leading-[28.8px]">
          {coupon?.discountPerc}% off on minimum purchase of Rs.
          {coupon?.minAmount}.
        </p>

        <p className="text-xs text-[#304778] leading-[28.8px]">
          <span className="font-semibold">Expires on:</span>{" "}
          {coupon?.expiryDate}
          <span className="mx-2">|</span>
          <span className="font-semibold">11:59 PM</span>
        </p>
      </div>
    </div>
  );
}

function ClearCartPopUp({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000]/30">
      <div className="w-full max-w-md space-y-7 rounded-lg bg-[#fff] p-7 font-garamond">
        <div className="flex justify-center items-center">
          <div className="flex justify-center w-24 h-24 relative items-center ">
            <div className="absolute flex h-24 w-24 items-center justify-center rounded-full bg-[#FDECEC] arrive-out" />
            <div className="absolute flex h-20 w-20 items-center justify-center rounded-full bg-[#FFE5E5] arrive-mid" />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FAD1D1] z-10">
              <IoCartSharp size={25} color="#D14242" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xl font-medium text-[#101828]">
            Are you sure you want to clear your cart?{" "}
          </p>
          <p className="text-sm text-[#4D4D4D]">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-around gap-10">
          <button
            onClick={onClose}
            className="text-[#344054] border flex-1 rounded-xl py-2.5"
          >
            Keep my cart
          </button>
          <button
            onClick={onConfirm}
            className="border bg-[#225378] text-[#fff] flex-1 rounded-xl py-2.5"
          >
            Clear Anyway
          </button>
        </div>
      </div>
    </div>
  );
}
