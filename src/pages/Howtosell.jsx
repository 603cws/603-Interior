import LandingNavbar from "../common-components/LandingNavbar";

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
                how to start selling <br /> on 603 interiors
              </h1>
              <p className="text-base font-normal">
                Start selling on 603 interiors. Grow your business and reach{" "}
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
      <section>
        <div className="container">
          <h1>Start selling</h1>
          <p>
            As a 603 Interior seller, you're getting an end-to-end wholesale
            service platform calibrated to help you grow your business, and help
            you provide services to your buyers. Here's how to get up and
            running so you can start making sales.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Howtosell;
