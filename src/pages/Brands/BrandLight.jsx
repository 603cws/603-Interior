import React from "react";
import Header from "../Ecommerce/Header";

function BrandLight() {
  return (
    <>
      <div className="font-Poppins">
        <Header />
        <section className="lg:container px-4 my-5">
          <div className="flex justify-center my-5">
            <img
              src="/images/brands/acco-led.png"
              alt="acco led"
              className="w-full md:w-3/4 lg:w-1/2"
            />
          </div>
          <div className="grid grid-cols-2 justify-items-center gap-3 md:gap-7 ">
            <img
              src="/images/brands/brand-light-1.png"
              alt="Brand Light 1"
              className="max-w-sm lg:max-w-[500px] w-full"
            />
            <img
              src="/images/brands/brand-light-2.png"
              alt="Brand Light 2"
              className="max-w-sm lg:max-w-[500px] w-full"
            />
          </div>
          <div className="h-[100vh] max-w-5xl mx-auto py-10">
            <img
              src="/images/brands/brand-light-3.png"
              alt="Brand Light 3"
              className="h-full w-full"
            />
          </div>
        </section>

        <section className="mb-10">
          <div className="relative h-80 w-screen flex justify-center items-center overflow-hidden">
            <div className="absolute inset-0 bg-center bg-cover bg-no-repeat grayscale bg-[url('/images/brands/brand-light-bg.png')]" />
            <div className="absolute inset-0 bg-black/10" />
            <h1 className="font-semibold text-5xl lg:text-6xl text-center text-white relative z-10">
              Browse our collection
            </h1>
          </div>
        </section>

        <section className="lg:container mx-auto px-4 grid grid-cols-2 justify-items-center gap-3 md:gap-7">
          <img
            src="/images/brands/brand-light-1.png"
            alt="brand light 1"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-2.png"
            alt="brand light 2"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-3.png"
            alt="brand light 3"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-1.png"
            alt="brand light 1"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-2.png"
            alt="brand light 2"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-3.png"
            alt="brand light 3"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-1.png"
            alt="brand light 1"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-2.png"
            alt="brand light 2"
            className="max-w-sm lg:max-w-[500px] w-full"
          />
          <img
            src="/images/brands/brand-light-3.png"
            alt="brand light 3"
            className="max-w-sm lg:max-w-[500px] w-full"
          />{" "}
          <img
            src="/images/brands/brand-light-1.png"
            alt="brand light 1"
            className="max-w-sm lg:max-w-[500px] w-full"
          />
        </section>
      </div>
    </>
  );
}

export default BrandLight;
