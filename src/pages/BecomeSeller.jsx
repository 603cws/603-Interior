import React, { useEffect, useRef } from "react";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

const BecomeSeller = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add("animate-bikeSlide");
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { threshold: 0.5 }
    );

    sectionRef.current && observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* how it works */}
      <section className="my-10">
        <div className="font-Poppins container mx-auto">
          {/* text */}
          <div className="text-center my-7">
            <h2 className="uppercase font-bold text-3xl">how it works</h2>
          </div>
          {/* infor */}
          <div className="flex justify-center gap-4 ">
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>1</span>
                </div>
                <div class="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div>
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold my-3">create account</h3>
                <p className="text-sm">All you need is :</p>
              </div>
            </div>
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>2</span>
                </div>
                <div class="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div>
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold my-2">List Products</h3>
                <p className="text-sm uppercase">
                  List the products <br /> you want to sell in <br /> your
                  supplier panel
                </p>
              </div>
            </div>
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>3</span>
                </div>
                <div class="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div>
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold my-2">Get Orders</h3>
                <p className="text-sm">
                  Start getting orders <br /> from crores of Indians <br />{" "}
                  actively shopping on our <br /> platform.
                </p>
              </div>
            </div>
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>4</span>
                </div>
                {/* <div class="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div> */}
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold my-2">Receive Payments</h3>
                <p className="text-sm">
                  APayments are deposited directly <br /> to your bank account{" "}
                  <br />
                  following a 7-day payment <br /> cycle from order delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* bring your brand */}
      <section className="w-full container mx-auto px-10 py-5">
        <div className="bring-your-brand w-full bg-[#7AC2AE] overflow-hidden rounded-[30px]">
          {/* Remove the static animate-bikeSlide class and add it dynamically via the ref */}
          <div ref={sectionRef} className="flex gap-5">
            <div className="w-1/3">
              <img src="/images/launch-brand.png" alt="Bike or Brand" />
            </div>
            <div className="w-2/3 flex flex-col gap-5 py-9 px-5 justify-center items-start font-Poppins">
              <h2 className="text-3xl font-bold">
                Bring your brand on 603 Interior
              </h2>
              <p>
                Use 603 interior tools to help customers discover your unique
                products and protect your intellectual property.
              </p>
              <button className="flex justify-center items-center gap-4 font-semibold text-xl">
                Launch your brand
                <LiaLongArrowAltRightSolid color="#1A3A36" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BecomeSeller;
