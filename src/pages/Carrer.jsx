import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { HiClock } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import jobListings from "../utils/jobData";
import { IoCalendarSharp } from "react-icons/io5";

function Carrer() {
  const background = "/images/career-page-bg.png";
  const row1 = [
    {
      imgurl: "/images/career page/careerChair.png",
      header: "Large beautiful office",
      para: " Enjoy a comfortable office  environment with most  modern  and stylish furniture",
    },
    {
      imgurl: "/images/career page/career5.png",
      header: "Easy Location",
      para: " Commute early to work  t yor convenient and enjoy compensation for transport costs.",
    },
    {
      imgurl: "/images/career page/career3.png",
      header: "Free lunch & Snacks",
      para: " Enjoy a comfortable office environment with most modern and stylish furniture ",
    },
  ];

  const row2 = [
    {
      imgurl: "/images/career page/career2.png",
      header: "Great co-workers",
      para: " Work with some of the best talent in the industry and build strong network with them.",
    },
    {
      imgurl: "/images/career page/career4.png",
      header: "Education opportunity",
      para: " Get resource for developing your skills and knowledge to kick start your career.",
    },
    {
      imgurl: "/images/career page/career2.png",
      header: "Performance Award",
      para: " Enjoy a comfortable office environment with most modern and stylish furniture ",
    },
  ];

  const career603 = [
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
    {
      jobTitle: "Web Developer",
      time: "Full time",
      location: "India",
      experince: "2-3years",
    },
  ];
  return (
    <div className="">
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase">
          <h1 className="text-5xl lg:text-7xl font-extrabold font-lato  text-white drop-shadow-lg tracking-wider">
            Join our team now!
          </h1>
        </div>
      </section>

      {/* second section */}
      <div className="bg-[#A9D3CE] bg-opacity-20">
        <section className="container mx-auto py-10 flex">
          {/* div for cards */}
          <div className="flex gap-10">
            {/* cards row 1 */}
            <div className="flex flex-col gap-10">
              {row1.map((card, index) => {
                {
                  /* card  */
                }
                return (
                  <div
                    key={index}
                    className="h-[280px] w-[260px] font-Poppins bg-[#A9D3CE] rounded-xl"
                  >
                    <div className="flex flex-col justify-center p-5 gap-3 ">
                      <div className=" my-4">
                        <img
                          src={card.imgurl}
                          alt="chair"
                          className="w-[50px] h-[50px]"
                        />
                      </div>
                      <h2 className="font-semibold text-lg "> {card.header}</h2>
                      <p className="text-sm">{card.para}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* cards row 2 */}
            <div className="flex flex-col gap-10 pt-20">
              {row2.map((card, index) => {
                {
                  /* card  */
                }
                return (
                  <div
                    key={index}
                    className="h-[280px] w-[260px] font-Poppins bg-[#A9D3CE] rounded-xl"
                  >
                    <div className="flex flex-col justify-center p-5 gap-3">
                      <div className=" my-4">
                        <img
                          src={card.imgurl}
                          alt="chair"
                          className="w-[50px] h-[50px]"
                        />
                      </div>
                      <h2 className="font-semibold text-lg "> {card.header}</h2>
                      <p className="text-sm">{card.para}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* div for text */}
          <div className="flex-1 flex justify-center items-center gap-4">
            {/* text */}
            <div>
              <div className="flex justify-center items-center mb-7">
                <img
                  src="/images/serviceIcon.png"
                  alt="service icon"
                  className=""
                />
              </div>
              <div className="flex justify-center items-center mb-7">
                <h3 className="font-lato font-bold text-5xl ">
                  Your Life At <span className="text-[#34BFAD]">603</span>
                </h3>
              </div>
              <p className="font-sans text-lg mb-7">
                At 603 Interiors, we believe that the right workspace can
                transform the way <br /> you work. we are looking for dynamic
                and creative individuals who are willing <br /> to dedicate
                themselves to providing innovative products and services for our{" "}
                <br /> clients.
              </p>
              <p className="font-sans text-lg mb-5">
                Besides getting the opportunity to unlock your true potential at
                603 <br /> Interiors you can also network with some of the most
                talented people in the <br /> industry
              </p>
              {/* <button className="px-10 py-3 font-semibold text-[#34BFAD] uppercase border-t border-l border-[#34BFAD] border-r-black border-b-black border-r-2 border-b-2 bg-[#f8f8f8] hover:bg-[#34BFAD] hover:text-white tracking-widest">
                Read More
              </button> */}
            </div>
          </div>
        </section>
      </div>

      {/* Section 3 */}
      <div className="bg-[#A9D3CE] bg-opacity-20">
        <section className="container mx-auto px-4">
          {/* Section Heading */}
          <div className="py-3 pb-5 text-center">
            <h2 className="font-Poppins font-semibold text-3xl">
              Our Open Positions
            </h2>
          </div>

          {/* Career Cards Grid */}
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(jobListings).map(([key, job], index) => (
              <div
                key={index}
                className="hover:bg-[#A9D3CE] bg-white p-8 rounded-3xl flex flex-col justify-between h-full"
              >
                {/* Job Title */}
                <div className="pb-4">
                  <h2 className="font-Poppins font-semibold text-2xl break-words">
                    {key}
                  </h2>
                </div>

                {/* Job Details */}
                <div className="text-black flex-grow">
                  <div className="flex flex-wrap gap-4">
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
                  {/* <button className="font-Poppins font-semibold text-black capitalize flex items-center gap-2">
                    View Details <IoIosArrowForward color="#1F5C54" />
                  </button> */}
                  <Link
                    to={`/Career/JobPage/${encodeURIComponent(key)}`}
                    onClick={() =>
                      localStorage.setItem("selectedJob", JSON.stringify(job))
                    }
                    className="font-Poppins font-semibold text-black capitalize flex items-center gap-2"
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
