import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LandingNavbar from "../components/LandingNavbar";
import { FaLocationDot } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { HiClock } from "react-icons/hi2";
import { MdCancel } from "react-icons/md";
import { BsFileEarmarkPdf, BsFileEarmarkWord, BsUpload } from "react-icons/bs";
import Footer from "../../common-components/Footer";
import { useForm } from "react-hook-form";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import HeroSection from "../components/HeroSection";
import { v4 as uuidv4 } from "uuid";

const JobPage = () => {
  const { jobTitle } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [jobForm, SetJobForm] = useState(false);
  const location = useLocation();
  const jobdata = location?.state;

  useEffect(() => {
    const jobDetails = jobdata;

    if (jobDetails) {
      setJob(jobDetails);
    } else {
      navigate("/Career");
    }
  }, [jobTitle, jobdata, navigate]);

  if (!job) return <div className="text-center py-10">Loading...</div>;

  return (
    <>
      <header className="bg-white shadow-lg z-50 relative ">
        <LandingNavbar className="relative" />
      </header>

      <HeroSection
        title={"Design your future \n with us"}
        description={` We're not just building <br /> offices - we're shaping the \n future of how people work. \n Be part of the journey.`}
        imagePath={`/images/carrer.png`}
        showBtn={false}
      />

      <div className="min-h-screen bg-white flex justify-center lg:p-6 font-Georgia">
        <div className="max-w-7xl w-full bg-white p-6">
          <button
            onClick={() => navigate("/Career")}
            className="text-[#334A78] text-sm w-full text-left"
          >
            &lt; Back to Jobs
          </button>

          <h1 className="text-3xl font-bold mt-2 text-[#334A78]">
            {jobdata?.jobTitle}
          </h1>

          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 lg:space-x-6 text-[#334A78] flex-wrap lg:flex-nowrap font-TimesNewRoman">
              <p className="flex items-center capitalize">
                <FaLocationDot className="mr-2" />
                {jobdata?.location}
              </p>
              <p className="flex items-center">
                <IoCalendarSharp className="mr-2" />
                {jobdata?.experience > 0 ? (
                  <span>{jobdata?.experience}+ years</span>
                ) : (
                  <span>Fresher</span>
                )}
              </p>
              <p className="flex items-center">
                <HiClock className="mr-2" />
                {jobdata?.positionType === "FullTIme"
                  ? "Full Time"
                  : jobdata?.positionType}
              </p>
            </div>

            <button
              onClick={() => SetJobForm((prev) => !prev)}
              className="bg-[#334A78] text-white py-2 px-4 rounded hover:bg-[#FFF] hover:text-[#334A78] border border-[#334A78] transition text-nowrap"
            >
              Apply Now
            </button>
          </div>

          <h2 className="text-lg font-semibold mt-6">Description</h2>
          <p className="text-gray-700">{jobdata.description}</p>

          <h2 className="text-lg font-semibold mt-6">Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
            {jobdata?.responsibilities
              ?.split(/\r?\n/)
              ?.filter((line) => line.trim() !== "")
              ?.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
          </ul>

          <h2 className="text-lg font-semibold mt-6">Requirements</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-2">
            {jobdata?.requirements
              ?.split(/\r?\n/)
              ?.filter((line) => line.trim() !== "")
              ?.map((requirement, idx) => (
                <li key={idx}>{requirement}</li>
              ))}
          </ul>
        </div>
      </div>

      {jobForm && (
        <div className="fixed inset-0 bg-[#000]/30 z-50">
          <JobForm SetJobForm={SetJobForm} jobTitle={jobTitle} job={jobdata} />
        </div>
      )}

      <Footer />
    </>
  );
};

export default JobPage;

function JobForm({ SetJobForm, jobTitle, job }) {
  const [resume, setResume] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or Word documents are allowed.");
      return;
    }

    setResume(file);
    setPreview(file.name);
    setValue("Resume", file, { shouldValidate: true });
    trigger("Resume");
  };

  const removeFile = () => {
    setPreview(null);
    setResume(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setValue("Resume", null);
    trigger("Resume");
  };

  const handleformSubmit = async (formData) => {
    try {
      const fileUuid = uuidv4();
      const fileName = `${formData?.Resume?.name}-${fileUuid}`;
      const { data, error: uploadError } = await supabase.storage
        .from("jobData")
        .upload(fileName, formData?.Resume);
      if (uploadError) {
        if (uploadError.error === "Duplicate") {
          toast.error("this file was already uploaded");
        }

        console.error("Error uploading image:", uploadError);
        return;
      }

      if (data) {
        const { data: jobTableData, error: ApplicationError } = await supabase
          .from("JobApplication")
          .insert([
            {
              FullName: formData?.FullName,
              Position: formData?.Position,
              Experience: formData?.YearsOfExp,
              CurrentCTC: formData?.CurrentCTC,
              ExpectedCTC: formData?.ExpectedCTC,
              NoticePeriod: formData?.NoticePeriod,
              EmailID: formData?.EmailID,
              MobNo: formData?.MobileNumber,
              ResumePath: data?.path,
              JobID: job?.id,
            },
          ])
          .select();

        if (jobTableData) {
          reset();
          removeFile();
          toast.success("Job Application submitted successfully");
        }

        if (ApplicationError) {
          console.error("error", ApplicationError);
          if (ApplicationError?.code === "23505") {
            toast.error("this email was already registered");
          }
          await supabase.storage
            .from("jobData")
            .remove([formData?.Resume?.name]);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="my-4 rounded-md max-w-2xl mx-auto border border-[#ccc] inset-0 fixed z-50 bg-white font-Georgia overflow-auto gradient-scrollbar">
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onSubmit={handleSubmit(handleformSubmit)}
        className="p-4 space-y-5"
      >
        <div className="flex justify-between items-center ">
          <h2 className="text-[#304778] text-lg font-semibold">
            Candidate Details
          </h2>
          <button type="button" onClick={() => SetJobForm((prev) => !prev)}>
            <MdCancel size={25} color="#304778" />
          </button>
        </div>
        <div className="flex flex-col space-y-3 ">
          <label htmlFor="" className="font-semibold text-black text-lg">
            Full Name
          </label>
          <input
            type="text"
            {...register("FullName", {
              required: true,
              maxLength: { value: 50, message: "max 50 character " },
            })}
            placeholder="John Doe"
            className="p-2 border border-[#ccc]"
          />
          {errors?.FullName && (
            <p className="text-red-800 text-sm capitalize">
              {errors?.FullName?.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-3 ">
          <label htmlFor="" className="font-semibold text-black text-lg">
            Position (Auto-filled)
          </label>
          <input
            type="text"
            placeholder="Web developer"
            {...register("Position", {
              required: true,
              maxLength: { value: 50, message: "max 50 character " },
            })}
            value={jobTitle}
            disabled={true}
            className="p-2 border border-[#ccc] disabled:cursor-not-allowed"
            readOnly
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 ">
          <div className="flex-1 flex flex-col space-y-3 ">
            <label htmlFor="" className="font-semibold text-black text-lg">
              Years of Experience
            </label>
            <input
              type="number"
              {...register("YearsOfExp", {
                required: true,
                min: 0,
                max: { value: 99, message: "Max 2 digits" },
              })}
              placeholder="e.g., 2"
              className="p-2 border border-[#ccc]"
              min={0}
            />
            {errors?.YearsOfExp && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.YearsOfExp?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col space-y-3 ">
            <label htmlFor="" className="font-semibold text-black text-lg">
              Notice Period (in days)
            </label>
            <input
              type="number"
              {...register("NoticePeriod", {
                required: true,
                min: 0,
                max: { value: 180, message: "Max 3 digits" },
              })}
              placeholder="e.g., 2"
              className="p-2 border border-[#ccc]"
            />
            {errors?.NoticePeriod && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.NoticePeriod?.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 ">
          <div className="flex-1 flex flex-col space-y-3 ">
            <label htmlFor="" className="font-semibold text-black text-lg">
              Current CTC
            </label>
            <input
              type="number"
              {...register("CurrentCTC", {
                required: true,
                min: { value: 0, message: "value should be greater than 0" },
              })}
              min={0}
              placeholder="Rs"
              className="p-2 border border-[#ccc]"
            />
            {errors?.CurrentCTC && (
              <p className="text-red-800 text-sm capitalize mt-2">
                {errors?.CurrentCTC?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col space-y-3 ">
            <label htmlFor="" className="font-semibold text-black text-lg">
              Expected CTC
            </label>
            <input
              type="number"
              {...register("ExpectedCTC", {
                required: true,
                min: { value: 0, message: "value should be greater than 0" },
              })}
              min={0}
              placeholder="Rs"
              className="p-2 border border-[#ccc]"
            />
            {errors?.ExpectedCTC && (
              <p className="text-red-800 text-sm capitalize mt-2">
                {errors.ExpectedCTC.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3 ">
          <label htmlFor="" className="font-semibold text-black text-lg">
            Email id*
          </label>
          <input
            type="email"
            {...register("EmailID", {
              required: "email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
            placeholder="example@gmail.com"
            className="p-2 border border-[#ccc]"
          />
          {errors?.EmailID && (
            <p className="text-red-800 text-sm capitalize mt-2">
              {errors.EmailID.message}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-3 ">
          <label htmlFor="" className="font-semibold text-black text-lg">
            Mobile Number*
          </label>
          <input
            type="number"
            {...register("MobileNumber", {
              required: "Mobile number is required",
              min: 0,
              pattern: {
                // eslint-disable-next-line no-useless-escape
                value: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
                message: "Please enter a valid mobile number",
              },
            })}
            placeholder="Enter mobile no."
            className="p-2 border border-[#ccc]"
          />
          {errors?.MobileNumber && (
            <p className="text-red-800 text-sm capitalize mt-2">
              {errors.MobileNumber.message}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-3 ">
          <label htmlFor="" className="font-semibold text-black text-lg">
            Resume
          </label>

          <div className="flex items-start gap-4">
            {!resume && (
              <div
                className="w-full h-28 p-2 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-400"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="Resume"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  {...register("Resume", {
                    required: "Please upload your resume (PDF or Word file).",
                    onChange: (e) => handleFileChange(e),
                  })}
                />

                <label
                  htmlFor="Resume"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <BsUpload className="w-6 h-6 mb-1 text-gray-500" />
                  <span className="text-xs">
                    <span className="text-blue-500 underline">
                      Click to upload
                    </span>
                    <br />
                    or drag and drop
                  </span>
                </label>

                {errors?.Resume && (
                  <p className="text-red-800 text-sm capitalize mt-2">
                    {errors.Resume.message}
                  </p>
                )}
              </div>
            )}

            {resume && (
              <div className="relative w-full h-28 border rounded-lg overflow-hidden p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  {resume.type === "application/pdf" ? (
                    <BsFileEarmarkPdf className="text-red-600 w-8 h-8" />
                  ) : (
                    <BsFileEarmarkWord className="text-blue-600 w-8 h-8" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
                      {preview}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(resume.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={removeFile}
                    type="button"
                    className="text-white text-xs bg-red-600 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="rounded-md py-3 px-4 bg-[#304778] border border-[#000] text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
