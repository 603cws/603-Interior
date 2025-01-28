import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function AboutUs() {
  return (
    <div>
      {/* <section className="flex flex-col h-[80vh] bg-[url('/images/AboutUs.png')] bg-cover bg-center">
        <div>
          <LandingNavbar />
        </div>

        <div className="flex-1  flex justify-end items-center">
          <div className="mx-10 font-lato font-extrabold">
            <h1 className=" text-6xl"> ABOUT US</h1>
            <p className="text-xl text-end">THIS IS WHO WE ARE</p>
          </div>
        </div>
      </section> */}

      <section className="bg-[url('/images/AboutUsbg.png')] bg-cover bg-center">
        <div className="">
          <LandingNavbar />
        </div>
        <div className="flex-1 flex">
          {/* img */}
          <div className="">
            <img
              src="/images/aboutimg.png"
              alt="about us"
              className="bg-contain"
            />
          </div>
          {/* text */}
          <div className=" flex justify-end items-center">
            <div className="mx-10 font-lato font-extrabold">
              <h1 className=" text-6xl"> ABOUT US</h1>
              <p className="text-xl text-end">THIS IS WHO WE ARE</p>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default AboutUs;
