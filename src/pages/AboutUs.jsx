import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import "../styles/Landing.css";
import ContactUsPopup from "../common-components/ContactUsPopup";

function AboutUs() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const navigate = useNavigate();
  const services = [
    { img: "/images/about-us/about-us-s2-1.png", title: "interior design" },
    { img: "/images/about-us/about-us-s2-2.png", title: "production" },
    { img: "/images/about-us/about-us-s2-3.png", title: "execution" },
    { img: "/images/about-us/about-us-s2-4.png", title: "after service" },
  ];
  return (
    <>
      {/* Hero image */}
      <section
        className="bg-[url('/images/about-us/about-us-bg.png')] w-full h-screen bg-no-repeat bg-cover relative sm:static "
        style={{ backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="z-20 absolute sm:relative w-full">
          <LandingNavbar />
          <div className="flex flex-col justify-center items-center h-screen text-white font-lato gap-3 uppercase font-extrabold">
            <h1 className="text-4xl md:text-5xl lg:text-7xl">About Us</h1>
            <p className="text-lg lg:text-3xl md:text-xl">THIS IS WHO WE ARE</p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="what-we-do container mx-auto py-10 bg-[url('/images/about-us/about-us-s2-bg.png')] bg-no-repeat bg-top bg-[length:100%_50%]">
        <div className="text-center">
          <img
            src="/images/serviceIcon.png"
            alt="service icon"
            className="mx-auto"
          />
          <h3 className="font-extrabold uppercase text-2xl font-Poppins my-5 text-[#1A3A36]">
            what we do
          </h3>
          <p className="font-Poppins font-semibold md:text-xl uppercase">
            We help anyone create great <br /> design for their office
          </p>
        </div>
        <div className=" grid grid-cols-1 sm:grid-cols-3 gap-10 font-Poppins font-bold text-white my-10 pt-5">
          <div className="relative h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us/about-us-what-we-do-1.jpg')] bg-cover bg-center flex justify-center items-center">
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            <h3 className="absolute lg:text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              design
            </h3>
          </div>

          <div className="relative h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us/about-us-what-we-do-2.jpg')] bg-cover bg-center flex justify-center items-center">
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>

            <h3 className="absolute lg:text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              redesign
            </h3>
          </div>

          <div className="relative  h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us/about-us-what-we-do-3.jpg')] bg-cover bg-center flex justify-center items-center">
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            <h3 className="absolute lg:text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              production
            </h3>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="why-choose-us md:container md:mx-auto font-Poppins">
        <div className="text-center">
          <img
            src="/images/serviceIcon.png"
            alt="service icon"
            className="mx-auto"
          />
          <h3 className="font-extrabold uppercase text-2xl  my-5 text-[#1A3A36]">
            why choose us?
          </h3>
          <p className=" font-medium  xl:text-4xl tracking-wide text-[#000] capitalize">
            Our strategy is very personalized <br />
            to meet your needs
          </p>
        </div>
        <div className="grid grid-cols-1 mx-4 sm:mx-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-10  my-10">
          <div className="group  flex flex-col justify-center items-center gap-5 py-12  hover:bg-[#15423C] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img src="/images/about-us/about-us-s2-1.png" alt="" />
            <h4 className="uppercase font-Poppins font-extrabold text-2xl group-hover:text-white">
              interior design
            </h4>
          </div>
          <div className="group  flex flex-col justify-center items-center gap-5 py-12  hover:bg-[#15423C] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img src="/images/about-us/about-us-s2-2.png" alt="" />
            <h4 className="uppercase font-Poppins font-extrabold text-2xl group-hover:text-white">
              production
            </h4>
          </div>
          <div className="group  flex flex-col justify-center items-center gap-5 py-12  hover:bg-[#15423C] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img src="/images/about-us/about-us-s2-3.png" alt="" />
            <h4 className="uppercase font-Poppins font-extrabold text-2xl group-hover:text-white">
              execution
            </h4>
          </div>
          <div className="group  flex flex-col justify-center items-center gap-5 py-12  hover:bg-[#15423C] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
            <img src="/images/about-us/about-us-s2-4.png" alt="" />
            <h4 className="uppercase font-Poppins font-extrabold text-2xl group-hover:text-white">
              after service
            </h4>
          </div>
        </div>
        {/* <div className="my-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="group flex flex-col justify-center items-center gap-5 py-12 hover:bg-[#15423C] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]"
              >
                <img src={service.img} alt={service.title} />
                <h4 className="uppercase font-Poppins font-extrabold text-2xl group-hover:text-white">
                  {service.title}
                </h4>
              </div>
            ))}
          </div>

          <div className="sm:hidden  mx-10">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1.2}
              pagination={{ clickable: true }}
              loop={true}
              className="w-full"
              loopFillGroupWithBlank={false}
            >
              {services.map((service, index) => (
                <SwiperSlide key={index} className="flex">
                  <div className="group flex flex-col justify-center items-center gap-5 py-12 w-[90%] rounded-lg hover:bg-[#15423C] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
                    <img src={service.img} alt={service.title} />
                    <h4 className="uppercase font-Poppins font-extrabold text-2xl group-hover:text-white">
                      {service.title}
                    </h4>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div> */}
      </section>

      {/* who we are */}
      <section className="font-Poppins">
        <div className="relative h-screen md:h-[60vh] lg:h-[80vh] xl:h-screen">
          {/* <div className="relative h-screen md:h-[60vh] lg:h-[80vh] xl:h-screen"> */}
          {/* image */}
          <div className="hidden lg:block  z-10 absolute top-1/2 transform  -translate-y-1/2 max-w-3xl right-1/2 translate-x-[15%]">
            <img src="/images/whoweare.png" alt="who we are " />
          </div>

          <div className="hidden lg:block  absolute z-10 right-1/2 transform translate-x-1/2">
            <div className=" flex flex-col justify-center items-center gap-4">
              <div>
                {" "}
                <img src="/images/whoweareicon.png" alt="service icon" />
              </div>
              <h3 className="uppercase font-extrabold text-xl tracking-wide">
                who we are
              </h3>
            </div>
          </div>

          {/* text */}
          <div className="bg-[#34BFAD] h-full lg:w-1/2 absolute right-0  flex justify-center items-center">
            <div className="font-medium sm:text-xs lg:text-base  xl:text-xl tracking-wide text-[#FFF] text-center   xl:p-2 lg:p-7">
              <div className="lg:hidden  text-center">
                <img
                  src="/images/serviceIcon.png"
                  alt="service icon"
                  className="mx-auto"
                />
                <h3 className="font-extrabold uppercase text-xl  my-5 text-[#1A3A36]">
                  who we are
                </h3>
              </div>
              <p className="mb-5 lg:mb-8 xl:mb-20  xl:text-lg text-center px-8 lg:px-[6rem]">
                At workved interiors, we design functional, inspiring, and
                efficient office spaces tailored to your business needs. Whether
                you're setting up a new office or revamping an existing one, our
                AI-driven platform simplifies the process allowing you to create
                layouts, customize BOQs, and choose from a curated selection of
                furniture, HVAC, lighting, and automation solutions.
              </p>
              <p className=" xl:text-lg text-center px-8 lg:px-[6rem]">
                Backed by our expertise in designing 603 The Coworking Space, we
                bring innovation, precision, and seamless execution to every
                project. With strategic brand collaborations and a
                technology-driven approach, workved interiors is your one-stop
                solution for modern office design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* our team */}
      {/* <section className="our-team container mx-auto my-10">
        <div className="text-center">
          <img
            src="/images/serviceIcon.png"
            alt="service icon"
            className="mx-auto"
          />
          <h3 className="font-extrabold uppercase text-2xl font-Poppins my-5 text-[#1A3A36]">
            our team
          </h3>
          <p className="font-Poppins font-semibold text-xl uppercase">
            We help anyone create great design <br />
            for their office
          </p>
        </div>
        <div className="w-full flex justify-between gap-6 font-Poppins font-bold text-3xl uppercase text-center mt-10">
          <div className="w-1/4 ">
            <img src="/images/our-team.png" alt="team-member" />
            <h2 className="my-3">kean Olivia</h2>
            <h2 className="text-[#B1B1B1]">designer</h2>
          </div>
          <div className="w-1/4 ">
            <img src="/images/our-team.png" alt="team-member" />
            <h2 className="my-3">kean Olivia</h2>
            <h2 className="text-[#B1B1B1]">designer</h2>
          </div>
          <div className="w-1/4">
            <img src="/images/our-team.png" alt="team-member" />
            <h2 className="my-3">kean Olivia</h2>
            <h2 className="text-[#B1B1B1]">designer</h2>
          </div>
        </div>
      </section> */}

      {/* contact us */}
      <section className="contact-us bg-[url('/images/about-us/about-us-s3-bg.png')] bg-no-repeat bg-cover py-10 relative">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white font-Poppins flex flex-col justify-between items-center gap-20 text-center my-7">
          <h2 className="font-extrabold uppercase text-4xl">
            need to redesign your work space
            <br />
            contact us now
          </h2>
          <button
            // onClick={() => navigate("/Contactus")}
            onClick={() => setShowContactPopup(true)}
            className="capitalize bg-[#34BFAD] border-[1px] border-black rounded-lg px-10 py-3"
          >
            contact us
          </button>
        </div>
      </section>

      {/* footer */}
      <Footer />
      {showContactPopup && (
        <ContactUsPopup onClose={() => setShowContactPopup(false)} />
      )}
    </>
  );
}

export default AboutUs;
