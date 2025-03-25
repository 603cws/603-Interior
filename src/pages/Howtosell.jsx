import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function Howtosell() {
  return (
    <div>
      {/* Hero section */}
      <section className="w-full h-screen">
        <div className="bg-[url('images/how-to-sell-bg.png')] bg-cover bg-no-repeat h-full">
          <div className="relative">
            <LandingNavbar />
          </div>
          <div className="flex-1 flex justify-between items-center h-full pl-20">
            <div className="flex-1 flex flex-col gap-8 mt-24 font-extrabold text-[#1F5C54] font-lato">
              <h1 className=" text-5xl font-extrabold uppercase">
                how to start selling <br /> on Workved Interiors
              </h1>
              <p className="text-base font-normal">
                Start selling on Workved Interiors. Grow your business and reach{" "}
                <br /> customer around the world. Here’s how to get started!
              </p>
            </div>
            <div className="flex-1 h-full w-1/2 flex justify-end items-end relative">
              <img
                src="/images/how-to-sell-girl.png"
                alt=""
                className="w-full h-3/4 scale-x-[-1]"
              />
            </div>
          </div>
        </div>
      </section>
      {/* section start selling */}
      <section className="my-10">
        <div className="container font-Poppins text-[#1F5C54] mx-auto flex justify-center">
          <div>
            <h1 className=" text-3xl font-bold mb-4">Start selling</h1>
            <p className="text-lg">
              As a Workved Interiors seller, you're getting an end-to-end
              wholesale service platform calibrated to help you grow your
              business, and <br /> help you provide services to your buyers.
              Here's how to get up and running so you can start making sales.
            </p>
          </div>
        </div>
      </section>
      {/* steps of selling */}
      <section>
        <div className="container mx-auto font-Poppins flex justify-center">
          <div className="max-w-4xl">
            {/* step card */}
            <div className="flex justify-center  gap-16 items-stretch my-10">
              <div className="">
                <img src="/images/step1.png" alt="singup card" />
              </div>
              <div className=" flex flex-col justify-evenly ">
                <h2 className="text-[#34BFAD]">01</h2>
                <h3 className="font-bold text-[#333] text-3xl">
                  Open an account
                </h3>
                <p className="text-base pb-10 ">
                  As a new seller, you may have multiple types of selling <br />
                  packages/plans to choose from, depending on the business your{" "}
                  <br />
                  in. Follow a few easy steps to register for <br /> 603
                  Interior seller account and build trust between you and your{" "}
                  <br />
                  potential buyers.{" "}
                </p>
              </div>
            </div>
            {/* step card 2*/}
            <div className="flex justify-center  gap-16 items-stretch my-10 flex-row-reverse">
              <div className="">
                <img src="/images/step2.png" alt="step2" />
              </div>
              <div className=" flex flex-col justify-evenly ">
                <h2 className="text-[#34BFAD]">02</h2>
                <h3 className="font-bold text-[#333] text-3xl">
                  Post your products
                </h3>
                <p className="text-base pb-10 ">
                  It's important to add all of the products in your catalog to{" "}
                  <br />
                  your account. Having more products in your account <br />{" "}
                  increases your chances of showing up in buyers' search <br />{" "}
                  results. This means you'll potentially get more exposure and{" "}
                  <br /> secure more customers as a result.
                </p>
              </div>
            </div>
            {/* step card 3*/}
            <div className="flex justify-center  gap-16 items-stretch my-10 ">
              <div className="">
                <img src="/images/step3.png" alt="step3" />
              </div>
              <div className=" flex flex-col justify-evenly ">
                <h2 className="text-[#34BFAD]">03</h2>
                <h3 className="font-bold text-[#333] text-3xl">
                  Start getting orders
                </h3>
                <p className="text-base pb-10 ">
                  After listing your products, you will begin receiving
                  inquiries <br /> from us. As a true B2B platform,we will help
                  you to get <br /> orders.
                </p>
              </div>
            </div>
            {/* step card 4*/}
            <div className="flex justify-center  gap-16 items-stretch my-10 flex-row-reverse">
              <div className="">
                <img src="/images/step4.png" alt="step4" />
              </div>
              <div className=" flex flex-col justify-evenly ">
                <h2 className="text-[#34BFAD]">04</h2>
                <h3 className="font-bold text-[#333] text-3xl">Payment</h3>
                <p className="text-base pb-10 ">
                  The payment for your orders is securely deposited <br />{" "}
                  directly in your bank account on the 7th day from order <br />
                  delivery, including Cash on Delivery orders.
                </p>
              </div>
            </div>

            {/* button */}
            <div className="flex justify-center my-10">
              <div className="uppercase font-bold bg-[#1F5C54] text-white px-7 py-3 rounded-xl border-1 border-[#15423C]">
                download kit
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start selling */}
      <section>
        <div className=" bg-[url('/images/how-to-sell-bg-2.png')] bg-cover bg-no-repeat">
          <div className="flex justify-center items-center">
            <div className="w-1/2 text-[#1F5C54] ps-20">
              <h1 className="font-bold text-5xl mb-5">Start selling now!</h1>
              <p className="leading-8">
                Join the fastest growing e-commerce platform in India <br /> and
                sell to crores of users and grow your business.
              </p>
              <button className="bg-[#1F5C54] uppercase px-7 py-3 rounded-3xl text-white font-bold text-sm">
                start selling
              </button>
            </div>
            <div className="w-1/2 flex items-end justify-end">
              <img
                src="images/Delivery-lustrator.png"
                alt=""
                className="h-80 self-end"
              />
            </div>
          </div>
        </div>
      </section>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Howtosell;
