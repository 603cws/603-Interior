import Footer from "../common-components/Footer";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { HiClock } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import jobListings from "../utils/jobData";
import { IoCalendarSharp } from "react-icons/io5";
import HeroSection from "./HeroSection";

function Carrer() {
  const background = "/images/career-page-bg.png";
  return (
    <div className="font-Poppins">
      <HeroSection title={"Join us"} background={background} />

      {/* second section */}
      <div className="md:container px-5 md:px-12 md:mx-auto">
        <section className=" py-10 flex flex-col gap-10 lg:gap-8 lg:flex-row justify-between items-center">
          {/* div for image */}
          <div className=" flex justify-center items-center">
            <div className="max-w-xl xl:max-w-2xl">
              <img
                src="/images/carrerLifeAtInterior.png"
                className="w-full"
                alt="life at interior"
              />
            </div>
          </div>
          {/* div for text */}
          <div className="flex-1 flex justify-center items-center gap-4 text-[#232323] ">
            <div>
              <div className="flex justify-center items-center mb-7">
                <img
                  src="/images/serviceIcon.png"
                  alt="service icon"
                  className=""
                />
              </div>
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
      <div className="md:container px-5 md:px-12 md:mx-auto">
        <section className="md:px-4">
          {/* Section Heading */}
          <div className="py-3 pb-5 text-center flex flex-col justify-center items-center">
            <img
              src="/images/serviceIcon.png"
              alt="service icon"
              className="service icon"
            />
            <h2 className="font-lora font-bold text-2xl lg:text-4xl text-[#232323]">
              Our Open Positions
            </h2>
          </div>

          {/* Career Cards Grid */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6">
            {Object.entries(jobListings).map(([key, job], index) => (
              <div
                key={index}
                className="hover:bg-[#A9D3CE] bg-white p-8 border-[#000] border flex flex-col justify-between h-full "
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
                      <HiClock color="#1F5C54" />
                      <p className="text-sm">{job.type}</p>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center space-x-2">
                      <IoCalendarSharp color="#1F5C54" />
                      <p className="text-sm">{job.experience}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 mt-3">
                    <FaLocationDot color="#1F5C54" />
                    <p className="text-sm">{job.location}</p>
                  </div>
                </div>

                {/* Button */}
                <div className="pt-6">
                  <Link
                    to={`${encodeURIComponent(key)}`}
                    className="font-Poppins font-semibold text-sm text-black capitalize flex items-center gap-2"
                  >
                    View Details <IoIosArrowForward color="#1F5C54" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default Carrer;
