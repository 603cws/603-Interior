import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../Context/Context";
import AppliedCoupon from "./AppliedCoupon";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isCouponValid } from "../utils/ResuableFunctions";
import { supabase } from "../services/supabase";
import { useLocation, useNavigate } from "react-router-dom";

function PriceDetail() {
  const { cartItems, isAuthenticated, localcartItems } = useApp();
  const [orignalTotalPrice, setOriginalToalPrice] = useState(0);
  const [disableApplycoupon, setDisableApplycoupon] = useState(false);
  const [differenceInPrice, setDifferenceInPrice] = useState(0);
  const [allCoupons, setAllCoupons] = useState([]);
  const [ismobileCouponFormOpen, setIsMobileCouponFormOpen] = useState(false);
  const [couponname, setCouponname] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [mobilecouponname, setmobilecouponname] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleRemoveCoupon = async () => {
    if (totalPrice === 0) return setCouponname("");
    setCouponname("");
    toast.success("remove coupon");
    setDisableApplycoupon(false);
    setTotalPrice(orignalTotalPrice);
  };

  const handleCheckCoupon = async (e) => {
    e.preventDefault();

    console.log("hello", couponname);

    if (totalPrice === 0) return toast.error("cart is empty");

    if (disableApplycoupon) return toast.error("coupon already applied");

    if (couponname.trim() === 0) return toast.error("enter the coupon");
    try {
      // const checkcoupon = couponname.toUpperCase();
      const { data: coupon, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .eq("couponName", couponname)
        .single();

      // console.log(checkcoupon, "name");

      if (fetchError) throw new Error(fetchError.message);
      console.log("couponfromdb", coupon);

      if (!isCouponValid(coupon.expiryDate))
        return toast.error("coupon is expired");
      calculateTotalDiffer(coupon);
      setmobilecouponname(coupon);
    } catch (error) {
      console.log(error);
      toast.error("Invalid Coupon");
    }
  };

  function calculateTotalDiffer(coupon) {
    //we get the entire coupon for already haved coupon name
    const discountedprice =
      totalPrice - (totalPrice * coupon?.discountPerc) / 100;
    const difference = orignalTotalPrice - discountedprice;

    setDifferenceInPrice(difference);
  }

  const getallthecouponsFromDB = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("newUser, usedWelcomeCoupon")
        .eq("id", userId)
        .single();

      const { data: allCoupons } = await supabase.from("coupons").select("*");

      // console.log("allcoupons", allCoupons);

      // Attach disabled status if coupon is new-user only
      const couponsWithStatus = allCoupons.map((coupon) => {
        const isWelcomeCoupon = coupon?.couponName
          ?.toLowerCase()
          ?.includes("welcome");
        const shouldDisable = isWelcomeCoupon && profile?.usedWelcomeCoupon;

        return {
          ...coupon,
          isDisabled: shouldDisable,
        };
      });

      setAllCoupons(couponsWithStatus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallthecouponsFromDB();
  }, []);

  const handlePlaceOrder = () => {
    if (isAuthenticated) {
      console.log("user is logged in ");
      navigate("/address");
    } else {
      // navigate("/login");
      navigate("/login", { state: { from: location.pathname } });
    }
  };

  //Below code => When coupon redeemed then disable the coupon in the db.
  // const handleSubmit = async () => {
  //   const { data: user, error: userError } = await supabase.auth.getUser();

  //   console.log("user", user);

  //   if (userError || !user?.user?.id) {
  //     toast.error("User not found. Please Login.");
  //     return;
  //   }

  //   const userId = user.user.id;

  //   // 1. Update profile fields after placing order
  //   const { error } = await supabase
  //     .from("profiles")
  //     .update({
  //       usedWelcomeCoupon: true,
  //       newUser: false,
  //     })
  //     .eq("id", userId);

  //   if (error) {
  //     toast.error(error);
  //     return;
  //   }

  //   // 2. Show popup / toast
  //   toast.success("🎉 Order placed successfully!");

  //   // Refresh after 2 seconds
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 2000);
  // };

  const handleApplyofCoupon = async (coupon) => {
    if (totalPrice === 0) return toast.error("cart is empty");

    if (disableApplycoupon) return toast.error("coupon already applied");
    if (!isCouponValid(coupon.expiryDate))
      return toast.error("coupon is expired");
    try {
      const discountedprice =
        totalPrice - (totalPrice * coupon?.discountPerc) / 100;
      setDisableApplycoupon(true);
      toast.success("coupon is valid");
      setTotalPrice(discountedprice);
    } catch (error) {
      console.log(error);
      toast.error("Invalid Coupon");
    } finally {
      setIsMobileCouponFormOpen(false);
    }
  };

  return (
    <>
      <div className="flex-1 lg:border-l-[1px] lg:pl-10 text-sm lg:text-base">
        <h4 className="uppercase mb-3 lg:mb-7">
          price details (
          {isAuthenticated ? cartItems?.length : localcartItems?.length} Items)
        </h4>
        <div className="space-y-3 lg:space-y-6 lg:pb-6">
          <div className="flex justify-between">
            <h5 className="font-medium  text-[#111111]/80">Total MRP</h5>
            <h5 className="font-medium  text-[#111111]/80 ">
              Rs {orignalTotalPrice || 0}
            </h5>
          </div>

          <div className="flex justify-between">
            <h5 className="font-medium  text-[#111111]/80">Discount on MRP</h5>
            <h5 className="font-medium  text-[#34BFAD]/80 ">-Rs 0</h5>
          </div>

          <div className="flex justify-between">
            <h5 className="font-medium  text-[#111111]/80">Coupon Discount</h5>
            {disableApplycoupon ? (
              <div className="font-medium  text-[#34BFAD]/80 ">
                -Rs {differenceInPrice.toFixed(2) || 0}
              </div>
            ) : (
              <button
                onClick={() =>
                  totalPrice > 0
                    ? setIsMobileCouponFormOpen(true)
                    : toast.error("no item in the cart")
                }
                className="text-[#F87171] hover:underline"
              >
                Apply Coupon
              </button>
            )}
          </div>

          {disableApplycoupon && (
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
              <h5 className="font-medium  text-[#111111]/80">Shipping Fee</h5>
              <p className="text-xs text-[#111111]/50 font-medium pb-2">
                Free Shipping for you
              </p>
            </div>
            <h5 className="font-medium  text-[#34BFAD]/80 uppercase">Free</h5>
          </div>

          <div className="flex justify-between">
            <h5 className="font-medium  text-[#111111] uppercase">
              Total Amount
            </h5>
            <h5 className="font-medium  text-[#111111] ">
              Rs {totalPrice || 0}
            </h5>
          </div>
        </div>

        {ismobileCouponFormOpen && (
          <div className="inset-0 fixed top-0 z-10 bg-[#000]/20 sm:flex sm:justify-center sm:items-center ">
            <div className=" bg-[#fff] p-2 lg:p-7 h-dvh sm:h-[90vh]  flex flex-col font-Poppins">
              <div className="flex justify-between items-center py-3 font-medium">
                <h2 className="text-[#171717]">Coupon</h2>
                <button onClick={() => setIsMobileCouponFormOpen(false)}>
                  <MdOutlineCancel size={25} />
                </button>
              </div>
              <div>
                <form onSubmit={handleCheckCoupon} method="post" className="">
                  <div className="w-full max-w-md">
                    <div className="flex items-center border border-gray-300 rounded-md ">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponname}
                        onChange={(e) => setCouponname(e.target.value)}
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
                    calculateTotalDiffer={calculateTotalDiffer}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center font-Poppins gap-2 ">
                <div className="space-y-3">
                  <h2 className="text-sm leading-4 uppercase text-nowrap">
                    Maximum Saving :
                  </h2>
                  <p className="font-semibold text-xl text-[#000] leading-[15px] tracking-[1.2px]">
                    ₹ {differenceInPrice.toFixed(2) || 0}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleApplyofCoupon(mobilecouponname)}
                    className="px-[65px] py-[17px] text-white bg-[#334A78] border border-[#212B36]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <button
            onClick={handlePlaceOrder}
            className="hidden uppercase text-xl text-[#ffffff] tracking-wider w-full lg:flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
          >
            place ORDER
          </button>
        )}
      </div>

      {totalPrice > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-center items-center mb-2">
          <div className="w-[90%]">
            <button
              onClick={handlePlaceOrder}
              className="uppercase text-xl text-white tracking-wider w-full bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
            >
              place ORDER
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PriceDetail;

function CouponCard({
  coupon,
  setmobilecouponname,
  mobilecouponname,
  calculateTotalDiffer,
}) {
  console.log(mobilecouponname, "hello");

  return (
    <div
      className={`flex items-start space-x-2 font-Poppins ${
        coupon?.isDisabled ? "opacity-70 cursor-not-allowed" : "opacity-100"
      }`}
    >
      <input
        type="checkbox"
        checked={mobilecouponname?.couponName === coupon?.couponName}
        disabled={coupon?.isDisabled}
        onChange={(e) => {
          if (e.target.checked) {
            setmobilecouponname(coupon);
            calculateTotalDiffer(coupon);
          } else {
            setmobilecouponname("");
          }
        }}
        className="w-5 h-5 accent-[#304778] mt-1 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex-1">
        <div className="inline-block border-2 border-dashed border-[#304778] text-[#304778] text-[10px] px-4 py-1 font-semibold tracking-wider mb-[10px]">
          {coupon?.couponName}
        </div>
        {coupon?.isDisabled && (
          <p className="inline ml-4 text-red-600 text-xs">Already Used*</p>
        )}

        <p className="font-semibold text-xs leading-[28.8px] text-black">
          Save {coupon?.discountPerc}%
        </p>
        <p className="text-xs text-[#304778] leading-[28.8px]">
          {coupon?.discountPerc}% off on minimum purchase of Rs. 10000
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
