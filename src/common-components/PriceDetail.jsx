import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../Context/Context";
import AppliedCoupon from "./AppliedCoupon";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isCouponValid } from "../utils/ResuableFunctions";
import { supabase } from "../services/supabase";
import { useLocation, useNavigate } from "react-router-dom";

function PriceDetail({ handlebtnClick }) {
  const {
    cartItems,
    isAuthenticated,
    localcartItems,
    disableApplycoupon,
    setDisableApplycoupon,
    mobilecouponname,
    setmobilecouponname,
    orignalTotalPrice,
    setOriginalToalPrice,
    differenceInPrice,
    setDifferenceInPrice,
    carttotalPrice,
    setCartTotalPrice,
  } = useApp();

  // const [orignalTotalPrice, setOriginalToalPrice] = useState(0);
  // const [disableApplycoupon, setDisableApplycoupon] = useState(false);
  // const [differenceInPrice, setDifferenceInPrice] = useState(0);
  const [differenceInPricetoshow, setDifferenceInPricetoshow] = useState();
  const [allCoupons, setAllCoupons] = useState([]);
  const [ismobileCouponFormOpen, setIsMobileCouponFormOpen] = useState(false);
  const [couponname, setCouponname] = useState("");

  const [gst, setGst] = useState();
  const [shippingcharge, setshippingCharge] = useState();
  // const [totalPrice, setTotalPrice] = useState(0);
  // const [mobilecouponname, setmobilecouponname] = useState("");

  // const value = carttotalPrice > 0 ? carttotalPrice : orignalTotalPrice;
  // const finalValue = value + shippingcharge + gst;
  const finalValue = (
    orignalTotalPrice -
    differenceInPrice +
    shippingcharge +
    gst
  ).toFixed(2);

  const navigate = useNavigate();
  const location = useLocation();

  console.log("location", location.pathname);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems?.reduce(
        (acc, curr) => acc + curr.productId?.price * curr.quantity,
        0
      );
      // setCartTotalPrice(total || 0);
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
    if (carttotalPrice === 0) return setCouponname("");
    setCouponname("");
    toast.success("remove coupon");
    setDisableApplycoupon(false);
    setCartTotalPrice(orignalTotalPrice);

    const Getgstprice = calculateGst(orignalTotalPrice);
    setGst(Getgstprice);

    //differnce 0
    setDifferenceInPrice(0);
  };

  useEffect(() => {
    const price = orignalTotalPrice.toFixed(2);
    const Getgstprice = calculateGst(price);
    setGst(Getgstprice);
    const shippiingFee = GetDeliveryCharges(orignalTotalPrice);
    setshippingCharge(shippiingFee);

    console.log("hii from the useeffect");
  }, [orignalTotalPrice]);

  useEffect(() => {
    if (orignalTotalPrice === 0) {
      handleRemoveCoupon();
      setDifferenceInPrice(0);
      setCartTotalPrice(0);
      setCouponname("");
      setmobilecouponname();
    }

    if (
      orignalTotalPrice > 0 &&
      mobilecouponname &&
      location.pathname === "/cart"
    ) {
      handleRemoveCoupon();
      // setDifferenceInPrice(0);
      // setCartTotalPrice(0);
      setCouponname("");
      setmobilecouponname();
    }
  }, [orignalTotalPrice]);

  const handleCheckCoupon = async (e) => {
    e.preventDefault();

    console.log("hello", couponname);

    if (carttotalPrice === 0) return toast.error("cart is empty");

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

      console.log("allcoupons", coupon);

      setAllCoupons(coupon);

      if (fetchError) throw new Error(fetchError);
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

  const handleApplyofCoupon = async (coupon) => {
    if (orignalTotalPrice === 0) return toast.error("cart is empty");

    if (disableApplycoupon) return toast.error("coupon already applied");
    if (!isCouponValid(coupon, orignalTotalPrice))
      return toast.error("coupon is expired or min purchase not reached");
    try {
      const discountedprice =
        orignalTotalPrice - (orignalTotalPrice * coupon?.discountPerc) / 100;
      setDisableApplycoupon(true);
      // setmobilecouponname(coupon);
      // localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
      calculateTotalDiffer(coupon);
      const gstprice = calculateGst(discountedprice);
      setGst(gstprice);
      toast.success("coupon is valid");
      setCartTotalPrice(discountedprice);
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
  async function createOrder() {
    try {
      // get the current user
      //get all the cart items
      // shipping address
    } catch (error) {}
  }

  function calculateGst(price) {
    return price * 0.18;
  }

  function GetDeliveryCharges(price) {
    return price > 1000 ? 0 : 200;
  }

  return (
    <>
      <div className="flex-1 lg:border-l-[1px] lg:pl-10 text-sm lg:text-base">
        <h4 className="uppercase mb-3 lg:mb-7">
          price details (
          {isAuthenticated ? cartItems?.length : localcartItems?.length} Items)
        </h4>
        {orignalTotalPrice > 0 ? (
          <div className="space-y-3 lg:space-y-6 lg:pb-6">
            <div className="flex justify-between">
              <h5 className="font-medium  text-[#111111]/80">Total MRP</h5>
              <h5 className="font-medium  text-[#111111]/80 ">
                Rs {orignalTotalPrice || "--"}
              </h5>
            </div>

            <div className="flex justify-between">
              <h5 className="font-medium  text-[#111111]/80">
                Discount on MRP
              </h5>
              <h5 className="font-medium  text-[#34BFAD]/80 ">-Rs 0</h5>
            </div>

            <div className="flex justify-between">
              <h5 className="font-medium  text-[#111111]/80">
                Coupon Discount
              </h5>
              {disableApplycoupon ? (
                <div className="font-medium  text-[#34BFAD]/80 ">
                  -Rs{" "}
                  {orignalTotalPrice > 0 ? differenceInPrice.toFixed(2) : "--"}
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
                <h5 className="font-medium  text-[#111111]/80">Shipping Fee</h5>
                <p className="text-xs text-[#111111]/50 font-medium pb-2">
                  Free Shipping for you
                </p>
              </div>
              <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                {orignalTotalPrice > 0
                  ? shippingcharge === 0
                    ? "Free"
                    : shippingcharge
                  : "--"}
              </h5>
            </div>

            <div className="flex justify-between border-b-[1px]">
              <div>
                <h5 className="font-medium  text-[#111111]/80">GST Fee</h5>
                {/* <p className="text-xs text-[#111111]/50 font-medium pb-2">
                Free Shipping for you
              </p> */}
              </div>
              <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                {orignalTotalPrice > 0 ? gst?.toFixed(2) : "--"}
              </h5>
            </div>

            <div className="flex justify-between">
              <h5 className="font-medium  text-[#111111] uppercase">
                Total Amount
              </h5>
              <h5 className="font-medium  text-[#111111] ">
                {orignalTotalPrice > 0 ? finalValue : "--"}
              </h5>
              {/* <h5 className="font-medium  text-[#111111] ">
              Rs {carttotalPrice || orignalTotalPrice}
            </h5> */}
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-6 lg:pb-6">
            <div className="flex justify-between">
              <h5 className="font-medium  text-[#111111]/80">Total MRP</h5>
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
                <h5 className="font-medium  text-[#111111]/80">Shipping Fee</h5>
                <p className="text-xs text-[#111111]/50 font-medium pb-2">
                  Free Shipping for you
                </p>
              </div>
              <h5 className="font-medium  text-[#34BFAD]/80 uppercase">--</h5>
            </div>

            <div className="flex justify-between border-b-[1px]">
              <div>
                <h5 className="font-medium  text-[#111111]/80">GST Fee</h5>
              </div>
              <h5 className="font-medium  text-[#34BFAD]/80 uppercase">--</h5>
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
                    calculateTotalDiffertoShow={calculateTotalDiffertoShow}
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
        {orignalTotalPrice > 0 && (
          <button
            onClick={handlebtnClick}
            // onClick={handlePlaceOrder}
            className="hidden uppercase text-xl text-[#ffffff] tracking-wider w-full lg:flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
          >
            place ORDER
          </button>
        )}
      </div>

      {orignalTotalPrice > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-center items-center mb-2">
          <div className="w-[90%]">
            <button
              onClick={handlebtnClick}
              // onClick={handlePlaceOrder}
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
