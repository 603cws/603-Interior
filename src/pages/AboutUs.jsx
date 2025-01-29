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
      {/* why choose us section */}
      <section className="container mx-auto">
        <div className="flex justify-center items-center lg:py-8">
          <h2 className="uppercase lg:text-5xl font-extrabold font-Poppins">
            Why Choose us?
          </h2>
        </div>
      </section>
      {/* why choose us cards */}
      <section className="container mx-auto my-4 lg:my-6">
        {/* div for cards */}
        <div className="flex  gap-2">
          {/* div for each card */}
          <div className="border-r-2 flex flex-col gap-3  border-[#1F5C54]">
            {/* div for text */}
            <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
              <h3 className="font-extrabold lg:text-2xl text-center ">
                Experience
              </h3>
              <p className="text-center  text-sm">
                 With a proven track record in designing our own coworking
                spaces, we have the expertise to handle projects of any scale.
              </p>
            </div>
            {/* div for image */}
            <div>
              <img src="/images/aboutuscard1.png" alt="" />
            </div>
          </div>
          {/* div for each card */}
          <div className="border-r-2 flex flex-col gap-3  border-[#1F5C54]">
            {/* div for text */}
            <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
              <h3 className="font-extrabold lg:text-2xl text-center ">
                Customization
              </h3>
              <p className="text-center  text-sm">
                Every project is unique, and we take pride in offering
                personalized solutions that meet your specific requirements.
              </p>
            </div>
            {/* div for image */}
            <div>
              <img src="/images/aboutuscard2.png" alt="customization" />
            </div>
          </div>
          {/* div for each card */}
          <div className="border-r-2 flex flex-col gap-3  border-[#1F5C54]">
            {/* div for text */}
            <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
              <h3 className="font-extrabold lg:text-2xl text-center ">
                quality
              </h3>
              <p className="text-center  text-sm">
                We are committed to maintaining the highest standards of quality
                in every aspect of our work, from materials to craftsmanship.
              </p>
            </div>
            {/* div for image */}
            <div>
              <img src="/images/aboutuscard3.png" alt="quality" />
            </div>
          </div>
          {/* div for each card */}
          <div className=" flex flex-col gap-3  ">
            {/* div for text */}
            <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
              <h3 className="font-extrabold lg:text-2xl text-center ">
                Innovation
              </h3>
              <p className="text-center  text-sm">
                Our designs are forward-thinking, integrating the latest trends
                and technologies to create future-ready work spaces.
              </p>
            </div>
            {/* div for image */}
            <div>
              <img src="/images/aboutuscard4.png" alt="innovaction" />
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
