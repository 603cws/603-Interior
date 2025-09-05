import React from "react";
import Header from "./Header";

function BrandHVAC() {
  return (
    <>
      <div className="font-Poppins">
        <Header />
        <section className="lg:container px-4 my-10">
          <div className="space-y-5">
            <img src="/images/brands/hvac-hero-1.png" alt="" />
            <img src="/images/brands/hvac-hero-2.png" alt="" />
          </div>
        </section>
        <section className="lg:container px-4 my-10">
          <img src="/images/brands/hvac-section-2.png" alt="" />
        </section>
        <section className="lg:container px-4 my-10 grid grid-cols-2 justify-items-center gap-3 md:gap-7">
          <img
            src="/images/brands/hvac-sec3-1.png"
            alt=""
            className="max-w-sm lg:max-w-[500px] w-full"
          />
          <img
            src="/images/brands/hvac-sec3-2.png"
            alt=""
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/hvac-sec3-3.png"
            alt=""
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/hvac-sec3-4.png"
            alt=""
            className="max-w-sm lg:max-w-[500px] w-full"
          />
        </section>

        <section className="lg:container px-4 my-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase text-center my-10">
            our popular products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-7">
            <img
              src="/images/brands/brand-hvac-1.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-2.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-3.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-4.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-5.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-1.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-2.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
            <img
              src="/images/brands/brand-hvac-3.png"
              alt=""
              className="w-full h-full p-2 bg-[#fff] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default BrandHVAC;
