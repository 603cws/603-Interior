import LandingNavbar from "../common-components/LandingNavbar";

import Footer from "../common-components/Footer";

import { FaLocationDot } from "react-icons/fa6";
import { GiPadlock } from "react-icons/gi";
import { HiClock } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";

function Carrer() {
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
      {/* section1 */}
      <section className="flex flex-col bg-[url('/images/CareerPage.png')] bg-contain bg-right bg-no-repeat h-[80vh]">
        <LandingNavbar />
        <div className="container mx-auto flex-1 flex  items-center font-lato font-extrabold text-6xl uppercase">
          <h1 className="pb-32">
            Join our team <br /> now!
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
              <button className="px-10 py-3 font-semibold text-[#34BFAD] uppercase border-t border-l border-[#34BFAD] border-r-black border-b-black border-r-2 border-b-2 bg-[#f8f8f8] hover:bg-[#34BFAD] hover:text-white tracking-widest">
                Read More
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* section 3 */}
      <div className="bg-[#A9D3CE] bg-opacity-20">
        <section className="container mx-auto">
          <div className="py-3 pb-5">
            <h2 className="font-Poppins font-semibold text-3xl">
              {" "}
              Our Open Position
            </h2>
          </div>

          {/* div for carrer card */}
          <div className="py-4 grid grid-cols-2 gap-5 3xl:grid-cols-3 3xl:gap-5">
            {career603.map((carrercard, index) => {
              return (
                <div
                  key={index}
                  className="hover:bg-[#A9D3CE] bg-[#fff] lg:w-[400px] lg:h-[220px] p-10 rounded-3xl"
                >
                  <div className="pb-4">
                    <h2 className="font-Poppins font-semibold text-3xl">
                      {carrercard.jobTitle}
                    </h2>
                  </div>
                  {/* icons  */}
                  <div className="flex flex-col gap-5 text-black">
                    {/* flex for two */}
                    <div className="flex gap-24">
                      <div className="flex items-center space-x-2">
                        <HiClock color="#1F5C54" />
                        <p className="text-sm ">{carrercard.time}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GiPadlock color="#1F5C54" />
                        <p className="text-sm ">{carrercard.experince} </p>
                      </div>
                    </div>
                    {/* one icon */}
                    <div className="flex items-center space-x-2">
                      <FaLocationDot color="#1F5C54" />
                      <p className="text-sm ">{carrercard.location} </p>
                    </div>
                  </div>

                  {/* button */}
                  <div className="flex items-center pt-8">
                    <button className="font-Poppins font-semibold text-black capitalize">
                      View Details
                    </button>
                    <IoIosArrowForward color="#1F5C54" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default Carrer;
