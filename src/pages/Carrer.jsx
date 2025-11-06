import Footer from "../common-components/Footer";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { HiClock } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import jobListings from "../utils/jobData";
import { IoCalendarSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import LandingNavbar from "../common-components/LandingNavbar";

function Carrer() {
  return (
    <>
      {/* <HeroSection title={"Join us"} background={background} /> */}
      <LandingNavbar className="relative" />
      <section className="pt-10 xl:pt-0 bg-[#334a78]">
        <div className=" md:container px-4 flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between items-center xl:max-w-7xl xl:px-0">
          <div className=" text-[#304778] flex flex-col justify-center items-center lg:items-start text-center lg:text-start gap-5 flex-1">
            <h2 className="font-TimesNewRoman italic text-3xl xl:text-[44px] xl:leading-[53px] tracking-[0.3px] font-bold text-white capitalize">
              Design your future
              <br /> with us
            </h2>
            <p className="text-base md:text-2xl text-white  font-Georgia tracking-wide">
              We're not just building <br /> offices - we're shaping the <br />{" "}
              future of how people work.
              <br />
              Be part of the journey.
            </p>
          </div>
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className=" xl:py-10 xl:pl-10 flex-1"
          >
            <img src="/images/carrer.png" alt="" />
          </motion.div>
        </div>
      </section>

      {/* second section */}
      <div className="md:container px-5 md:px-12 md:mx-auto xl:max-w-7xl">
        <section className=" py-10 flex flex-col gap-10 lg:gap-8 lg:flex-row justify-between items-center">
          {/* div for image */}
          <div className=" flex justify-center items-center">
            <div className="max-w-xl xl:max-w-2xl">
              <img
                src="/images/career page/carrerLifeAtInterior.png"
                className="w-full object-cover"
                alt="life at interior"
              />
            </div>
          </div>
          {/* div for text */}
          <div className="flex-1 flex justify-center items-center gap-4 text-[#232323] ">
            <div>
              <div className="flex justify-center text-center items-center mb-7">
                <h3 className="font-lora  font-bold text-xl lg:text-5xl ">
                  Your Life At Workved Interior
                </h3>
              </div>
              <p className="text-sm lg:text-lg mb-7 text-center leading-7">
                At Workved Interiors, we believe that the right workspace can
                transform the way you work. we are looking for dynamic and
                creative individuals who are willing to dedicate themselves to
                providing innovative products and services for our clients.
              </p>
              <p className=" text-sm lg:text-lg mb-5 text-center leading-7">
                Besides getting the opportunity to unlock your true potential at
                Workved Interiors you can also network with some of the most
                talented people in the industry
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Section 3 */}
      <div className="md:container px-5 md:px-12 md:mx-auto xl:max-w-7xl lg:py-10">
        <section className="md:px-0">
          {/* Section Heading */}
          <div className="py-3 pb-5 text-center flex flex-col justify-center items-center">
            <h2 className="font-lora font-bold text-2xl lg:text-4xl text-[#232323]">
              Our Open Positions
            </h2>
          </div>

          {/* Career Cards Grid */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6">
            {Object.entries(jobListings).map(([key, job], index) => (
              <div
                key={index}
                className="hover:bg-[#68B2DC]/20 bg-white p-8 border-[#000] border flex flex-col justify-between h-full "
              >
                {/* Job Title */}
                <div className="pb-4">
                  <h2 className="font-Poppins font-semibold text-2xl lg:text-3xl break-words">
                    {key}
                  </h2>
                </div>

                {/* Job Details */}
                <div className="text-black flex-grow">
                  <div className="flex justify-between lg:justify-normal  lg:flex-wrap gap-4 lg:gap-16">
                    {/* Job Type */}
                    <div className="flex items-center space-x-2">
                      <HiClock color="#334A78" />
                      <p className="text-sm">{job.type}</p>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center space-x-2">
                      <IoCalendarSharp color="#334A78" />
                      <p className="text-sm">{job.experience}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 mt-3">
                    <FaLocationDot color="#334A78" />
                    <p className="text-sm">{job.location}</p>
                  </div>
                </div>

                {/* Button */}
                <div className="pt-6">
                  <Link
                    to={`${encodeURIComponent(key)}`}
                    className="font-Poppins font-semibold text-sm text-black capitalize flex items-center gap-2 hover:underline underline-offset-4"
                  >
                    View Details <IoIosArrowForward color="#334A78" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* footer */}
      <Footer />
    </>
  );
}

export default Carrer;
