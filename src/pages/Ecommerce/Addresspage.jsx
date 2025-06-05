import Header from "./Header";
import { useEffect, useState } from "react";
import { useApp } from "../../Context/Context";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";
import BottomTabs from "./BottomTabs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function Addresspage() {
  const [wishListed, setWishListed] = useState(false);

  // get the cart items from the cart table
  const { cartItems } = useApp();

  // created a reduce function to calculate the total price
  const totalPrice = cartItems?.reduce(
    (acc, curr) => acc + curr.productId?.price * curr.quantity,
    0
  );
  return (
    <>
      <Header />
      <div className="container">
        <div className="!my-10 flex items-center justify-center text-[#334A78] text-lg capitalize font-Poppins leading-[16.8px]">
          <div className="flex items-center gap-2">
            <p className="text-[#334A78]">cart</p>
            <hr class="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p className="text-[#549DC7]">Address</p>
            <hr class="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p>Payment</p>
          </div>
        </div>

        <section>
          <div className="flex gap-10 font-Poppins">
            <div className="flex-1 space-y-5">
              <div className="border border-[#CCCCCC] rounded-lg font-Poppins">
                <div className="p-4 space-y-3">
                  <h2 className="font-semibold text-[#171717] text-sm">
                    CONTACT DETAILS
                  </h2>
                  <div className="text-[#AAAAAA] w-full">
                    <input
                      type="text"
                      placeholder="Name*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
                    />
                  </div>
                  <div className="text-[#AAAAAA] w-full">
                    <input
                      type="text"
                      placeholder="Mobile No*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
                    />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h2 className="font-semibold text-[#171717] text-sm">
                    ADDRESS
                  </h2>
                  <div className="text-[#AAAAAA] w-full">
                    <input
                      type="text"
                      placeholder="Address (House No, Building, Street, Area)*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
                    />
                  </div>
                  <div className="text-[#AAAAAA] w-full">
                    <input
                      type="text"
                      placeholder="Locality / Town*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
                    />
                  </div>
                  <div className="text-[#AAAAAA] w-full">
                    <input
                      type="text"
                      placeholder="Pin Code*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
                    />
                  </div>
                  <div className="text-[#AAAAAA] ">
                    <input
                      type="text"
                      placeholder="City / District*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-1/2 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="State*"
                      required
                      className="border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-1/2 rounded-md"
                    />
                  </div>
                </div>
                <div className="p-4 flex gap-2">
                  <input type="checkbox" />
                  <h2>Make this as my default address</h2>
                </div>
              </div>
            </div>

            <div className="flex-1 border-l-[1px] pl-10">
              <h4 className="uppercase mb-7">
                price details ({cartItems?.length} Items)
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
      </div>
      <div className="mt-10">
        <BottomTabs />
      </div>
    </>
  );
}

export default Addresspage;
