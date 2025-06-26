import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LandingNavbar from "../common-components/LandingNavbar";
import { FaLocationDot } from "react-icons/fa6";
import jobData from "../utils/jobData"; // Import the central job data
import { IoCalendarSharp } from "react-icons/io5";
import { HiClock } from "react-icons/hi2";

const JobPage = () => {
  const { jobTitle } = useParams(); // Get the job title from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Retrieve job from jobData using jobTitle as the key
    const jobDetails = jobData[jobTitle];

    if (jobDetails) {
      setJob(jobDetails);
      localStorage.setItem("selectedJob", JSON.stringify(jobDetails)); // Save job for persistence
    } else {
      const savedJob = JSON.parse(localStorage.getItem("selectedJob"));
      if (savedJob) {
        setJob(savedJob);
      } else {
        navigate("/Career"); // Redirect if job not found
      }
    }
  }, [jobTitle, navigate]);

  if (!job) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <header className="bg-white shadow-lg z-50 relative hidden lg:block">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
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
      </section>

      {/* Job Details */}
      <div className="min-h-screen bg-white flex justify-center lg:p-6">
        <div className="max-w-4xl w-full bg-white p-6">
          {/* Back to Jobs - Full Width */}
          <button
            onClick={() => navigate("/Career")}
            className="text-blue-500 text-sm w-full text-left"
          >
            &lt; Back to Jobs
          </button>

          <h1 className="text-3xl font-bold mt-2 text-[#1F5C54]">{jobTitle}</h1>

          {/* Job Info: Left & Right Alignment */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 lg:space-x-6 text-[#1F5C54] flex-wrap lg:flex-nowrap">
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
            <button className="bg-[#1F5C54] text-white py-2 px-4 rounded-lg hover:bg-[#34BFAD] transition text-nowrap">
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
