import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LandingNavbar from "../common-components/LandingNavbar";
import { FaLocationDot } from "react-icons/fa6";
import jobData from "../utils/jobData"; // Import the central job data
import { IoCalendarSharp } from "react-icons/io5";
import { HiClock } from "react-icons/hi2";
import { motion } from "framer-motion";

const JobPage = () => {
  const { jobTitle } = useParams(); // Get the job title from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const jobDetails = jobData[jobTitle];

    if (jobDetails) {
      setJob(jobDetails);
    } else {
      navigate("/Career"); // Redirect if job not found
    }
  }, [jobTitle, navigate]);

  if (!job) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <header className="bg-white shadow-lg z-50 relative hidden lg:block">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      {/* <section
        className="relative h-[50vh] lg:flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100 hidden"
        style={{
          backgroundImage: `url(/images/blognewpage.png)`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase mt-10">
          <h1 className="text-3xl sm:text-2xl lg:text-4xl font-extrabold font-lato text-white drop-shadow-lg tracking-wider">
            Career
          </h1>
        </div>
      </section> */}
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
            <img src="/images/carrer.png" alt="job posting" />
            {/* <img src="/images/career page/careerHero.png" alt="" /> */}
          </motion.div>
        </div>
      </section>

      {/* Job Details */}
      <div className="min-h-screen bg-white flex justify-center lg:p-6 font-Georgia">
        <div className="max-w-7xl w-full bg-white p-6">
          {/* Back to Jobs - Full Width */}
          <button
            onClick={() => navigate("/Career")}
            className="text-[#334A78] text-sm w-full text-left"
          >
            &lt; Back to Jobs
          </button>

          <h1 className="text-3xl font-bold mt-2 text-[#334A78]">{jobTitle}</h1>

          {/* Job Info: Left & Right Alignment */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 lg:space-x-6 text-[#334A78] flex-wrap lg:flex-nowrap">
              <p className="flex items-center">
                <FaLocationDot className="mr-2" />
                {job.location}
              </p>
              <p className="flex items-center">
                <IoCalendarSharp className="mr-2" />
                {job.experience}
              </p>
              <p className="flex items-center">
                <HiClock className="mr-2" />
                {job.type}
              </p>
            </div>

            {/* Apply Now Button - Right Aligned */}
            <button className="bg-[#334A78] text-white py-2 px-4 rounded-lg hover:bg-[#34BFAD] transition text-nowrap">
              Apply Now
            </button>
          </div>

          {/* Job Description */}
          <h2 className="text-lg font-semibold mt-6">Description</h2>
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{ __html: job.description }}
          ></p>

          {/* Responsibilities */}
          <h2 className="text-lg font-semibold mt-6">Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
            {job.responsibilities?.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>

          {/* Requirements */}
          <h2 className="text-lg font-semibold mt-6">Requirements</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
            {job.requirements?.map((requirement, idx) => (
              <li
                key={idx}
                dangerouslySetInnerHTML={{ __html: requirement }}
              ></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default JobPage;
