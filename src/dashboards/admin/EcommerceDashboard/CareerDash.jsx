import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { MdArrowBackIos } from "react-icons/md";
import { supabase } from "../../../services/supabase";

import { FaLocationDot } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { HiClock } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { resumeUrl } from "../../../utils/HelperConstant";
function handlesidebarState(state, action) {
  switch (action.type) {
    case "TOGGLE_SECTION":
      return {
        jobposting: action?.payload === SECTIONS?.JOBPOSTINGS,
        addposting: action?.payload === SECTIONS?.ADDJOB,
        editPosting: action?.payload === SECTIONS?.EditJob,
        viewDetails: action?.payload === SECTIONS?.VIEWJOBDETAILS,
        canditateDetail: action?.payload === SECTIONS?.CANDITATEDETAILS,
      };
    default:
      return state;
  }
}

const SECTIONS = {
  JOBPOSTINGS: "jobpostings",
  ADDJOB: "addJob",
  EditJob: "editJob",
  VIEWJOBDETAILS: "viewJobDetails",
  CANDITATEDETAILS: "canditateDetails",
};
function CareerDash() {
  const [jobPostings, setJobPostings] = useState();
  const [jobApplication, setJobApplication] = useState();
  const [jobEditData, setjobEditData] = useState();
  const [allCanditate, setAllCanditate] = useState();
  const [canditateDetail, setCanditateDetail] = useState();

  const sidebarInitialState = {
    jobposting: true,
    addposting: false,
    editPosting: false,
    viewDetails: false,
    canditateDetail: false,
  };

  const [careerstate, careerDispatch] = useReducer(
    handlesidebarState,
    sidebarInitialState
  );

  useEffect(() => {
    async function GetAllJobPosting() {
      try {
        const { data, error } = await supabase.from("JobPosting").select("*");
        setJobPostings(data);
        if (error) throw error;
      } catch (error) {
        console.error("error", error);
      }
    }
    GetAllJobPosting();
    async function GetAllJobApplication() {
      try {
        const { data, error } = await supabase
          .from("JobApplication")
          .select("*");
        setJobApplication(data);
        if (error) throw error;
      } catch (error) {
        console.error("error", error);
      }
    }
    GetAllJobApplication();
  }, []);

  const onsuccess = () => {
    // setCreateJobPost(false);
    // setIsJobEdit(false);
  };
  return (
    <div className="font-Poppins overflow-y-auto gradient-scrollbar">
      <div className="flex justify-between items-center py-2 px-3">
        <h2 className="flex items-center text-xl md:text-2xl font-semibold text-[#374A75] ">
          {(careerstate?.addposting ||
            careerstate?.editPosting ||
            careerstate?.viewDetails) && (
            <button
              onClick={() => {
                careerDispatch({
                  type: "TOGGLE_SECTION",
                  payload: SECTIONS?.JOBPOSTINGS,
                });
              }}
            >
              <MdArrowBackIos />
            </button>
          )}
          {careerstate?.canditateDetail && (
            <button
              onClick={() => {
                careerDispatch({
                  type: "TOGGLE_SECTION",
                  payload: SECTIONS?.VIEWJOBDETAILS,
                });
              }}
            >
              <MdArrowBackIos />
            </button>
          )}
          Job post
        </h2>
        {careerstate?.jobposting && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                careerDispatch({
                  type: "TOGGLE_SECTION",
                  payload: SECTIONS?.ADDJOB,
                });
              }}
              className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1] flex items-center gap-1"
            >
              + <span className="hidden lg:block">Add Job</span>
            </button>
          </div>
        )}
      </div>
      <hr />
      {careerstate?.jobposting && (
        <div className="p-4 grid grid-cols-2 gap-x-3 sm:grid-cols-3 gap-y-10">
          {jobPostings?.map((job) => (
            <JobCard
              key={job?.id}
              jobdata={job}
              jobApplication={jobApplication}
              setjobEditData={setjobEditData}
              careerDispatch={careerDispatch}
              setAllCanditate={setAllCanditate}
            />
          ))}
        </div>
      )}
      {careerstate?.addposting && <JobPostForm />}
      {careerstate?.editPosting && (
        <JobPostForm
          jobdata={jobEditData}
          isedit={true}
          onsuccess={onsuccess}
        />
      )}
      {careerstate?.viewDetails && (
        <>
          <div className="p-2  grid grid-cols-2 gap-x-3 sm:grid-cols-4 gap-y-10">
            {allCanditate?.length > 0 &&
              allCanditate?.map((canditate) => {
                return (
                  <Jobdetails
                    canditate={canditate}
                    key={canditate?.id}
                    setCanditateDetail={setCanditateDetail}
                    careerDispatch={careerDispatch}
                  />
                );
              })}
          </div>
          {allCanditate?.length <= 0 && (
            <div className=" flex flex-col gap-6 justify-center items-center py-5 ">
              <div className="flex justify-center items-center rounded-full bg-[#EFEFF1] border border-[#ddd] w-80 ">
                <img
                  src="/images/NOCANDITATE.png"
                  alt="no canditate"
                  className="p-8 w-72"
                />
              </div>
              <h2 className="font-semibold capitalize ">
                Zero Canditate Applied yet{" "}
              </h2>
            </div>
          )}
        </>
      )}
      {careerstate?.canditateDetail && (
        <div>
          <CanditateDetails
            canditate={canditateDetail}
            jobPostings={jobPostings}
          />
        </div>
      )}
    </div>
  );
}

function JobCard({
  jobdata,
  jobApplication,
  setjobEditData,
  careerDispatch,
  setAllCanditate,
}) {
  return (
    <div className="max-w-sm font-Poppins border border-[#ccc] p-2 rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold italic">{jobdata?.jobTitle}</h2>
        <div className="flex gap-3 items-center text-xl ">
          <button
            onClick={() => {
              setjobEditData(jobdata);
              careerDispatch({
                type: "TOGGLE_SECTION",
                payload: SECTIONS?.EditJob,
              });
            }}
          >
            <MdEdit />
          </button>
        </div>
      </div>
      <div className="flex gap-2 lg:space-x-6 text-[#334A78] flex-wrap lg:flex-nowrap">
        <p className="flex items-center text-xs leading-4 tracking-[1.2px]">
          <HiClock className="mr-2" />
          {jobdata?.positionType}
        </p>
        <p className="flex items-center text-xs leading-4 tracking-[1.2px]">
          <IoCalendarSharp className="mr-2" />
          {jobdata?.experience} years
        </p>
        <p className="flex items-center text-xs leading-4 tracking-[1.2px]">
          <FaLocationDot className="mr-2" />
          {jobdata?.location}
        </p>
      </div>
      <div className="border border-[#ccc] rounded-lg px-3 my-6 py-2">
        <div className="flex flex-col">
          <h3 className="font-bold italic">
            {
              jobApplication?.filter(
                (item) =>
                  item?.Position?.toLowerCase() ===
                  jobdata?.jobTitle?.toLowerCase()
              )?.length
            }{" "}
          </h3>
          <p className="text-xs font-light">Candidate Applied</p>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          onClick={() => {
            careerDispatch({
              type: "TOGGLE_SECTION",
              payload: SECTIONS?.VIEWJOBDETAILS,
            });
            setAllCanditate(
              jobApplication?.filter(
                (item) =>
                  item?.Position?.toLowerCase() ===
                  jobdata?.jobTitle?.toLowerCase()
              )
            );
          }}
          className="flex gap-1 items-center justify-center hover:underline"
        >
          view details <MdKeyboardArrowRight size={22} color="#334A78" />
        </button>
      </div>
    </div>
  );
}

function Jobdetails({ canditate, setCanditateDetail, careerDispatch }) {
  return (
    <div className="max-w-xs border border-[#ccc] py-5 px-[18px] font-Poppins rounded-lg">
      <div className="flex gap-3 items-center">
        <img
          src="/images/profile-card/profile-icon.png"
          alt="profile card"
          className="w-12 h-12 border border-[#cccc] rounded-full"
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{canditate?.FullName}</h2>
          <p className="text-[#aaa] text-sm">
            Applied at{" "}
            <span className="text-[#111]">
              {canditate?.created_at?.split("T")?.[0] || "date"}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-5">
        <button
          onClick={() => {
            setCanditateDetail(canditate);
            careerDispatch({
              type: "TOGGLE_SECTION",
              payload: SECTIONS?.CANDITATEDETAILS,
            });
          }}
          className="text-sm border text-[#0D894F] bg-[#E7F4EE] rounded-xl p-1 hover:text-green-900"
        >
          Applied
        </button>
      </div>
    </div>
  );
}

function CanditateDetails({ canditate, jobPostings }) {
  const jobdata = jobPostings?.filter(
    (job) => job?.jobTitle.toLowerCase() === canditate?.Position.toLowerCase()
  );

  return (
    <div className="p-4 space-y-3">
      <div className=" border border-[#ccc] py-5 px-[18px] font-Poppins ">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <img
              src="/images/profile-card/profile-icon.png"
              alt="profile card"
              className="w-12 h-12 border border-[#cccc] rounded-full"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">{canditate?.FullName}</h2>
              <p className="text-[#aaa] text-sm">
                Applied at{" "}
                <span className="text-[#111]">
                  {canditate?.created_at?.split("T")?.[0] || "date"}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5">
            <button className="text-sm border text-[#0D894F] bg-[#E7F4EE] rounded-xl p-1">
              Applied
            </button>
          </div>
        </div>
      </div>
      <div className=" border border-[#ccc]  p-[18px] font-Poppins space-y-2">
        <div>
          <h3 className="font-bold italic text-[#000] text-lg leading-7">
            Personal Information
          </h3>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[14px] font-light capitalize">
            <h4>email</h4>
            <p className="text-[#0D894F]">{canditate?.EmailID}</p>
          </div>
          <div className="flex justify-between items-center text-[14px] font-light capitalize">
            <h4>Phone number</h4>
            <p className="text-[#0D894F]">{canditate?.MobNo}</p>
          </div>
        </div>
      </div>
      <div className=" border border-[#ccc]  p-[18px] font-Poppins space-y-2">
        <div>
          <h3 className="font-bold italic text-[#000] text-lg leading-7">
            {jobdata[0]?.jobTitle}
          </h3>
        </div>
        <div className="flex gap-2 lg:space-x-6 text-[#334A78] flex-wrap lg:flex-nowrap">
          <p className="flex items-center text-xs leading-4 tracking-[1.2px]">
            <HiClock className="mr-2" />
            {jobdata[0]?.positionType}
          </p>
          <p className="flex items-center text-xs leading-4 tracking-[1.2px]">
            <IoCalendarSharp className="mr-2" />
            {jobdata[0]?.experience} years
          </p>
          <p className="flex items-center text-xs leading-4 tracking-[1.2px]">
            <FaLocationDot className="mr-2" />
            {jobdata[0]?.location}
          </p>
        </div>
        <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
          <div className="flex flex-col gap-2  text-sm leading-4">
            <h4 className="font-light">Experience in Year</h4>
            <p className="text-[#000] font-semibold">
              {canditate?.Experience ?? "0"}
            </p>
          </div>
          <div className="flex flex-col gap-2  text-sm leading-4">
            <h4 className="font-light">Notice Period</h4>
            <p className="text-[#000] font-semibold">
              {canditate?.NoticePeriod}
            </p>
          </div>
          <div className="flex flex-col gap-2  text-sm leading-4">
            <h4 className="font-light">Current Salary</h4>
            <p className="text-[#000] font-semibold">{canditate?.CurrentCTC}</p>
          </div>
          <div className="flex flex-col gap-2  text-sm leading-4">
            <h4 className="font-light">Expected Salary</h4>
            <p className="text-[#000] font-semibold">
              {canditate?.ExpectedCTC}
            </p>
          </div>
        </div>
      </div>
      <div className=" border border-[#ccc]  p-[18px] font-Poppins space-y-2">
        <div className="space-y-3">
          <h6 className="text-[#374A75] font-semibold text-xl">Resume</h6>
          <div>
            <a
              href={`${resumeUrl}/${canditate?.ResumePath}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-md border border-[#ccc] "
            >
              open
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobPostForm({ jobdata = null, isedit = false, onsuccess = null }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (jobdata) {
      reset({
        JobTitle: jobdata?.jobTitle || "",
        Location: jobdata?.location || "",
        Experience: jobdata?.experience || "",
        PositionType: jobdata?.positionType || "",
        description: jobdata?.description || "",
        Responsibilities: jobdata?.responsibilities || "",
        Requirements: jobdata?.requirements || "",
      });
    }
  }, [jobdata, reset]);

  async function handlejobCreate(formData) {
    try {
      const job = {
        jobTitle: formData?.JobTitle,
        experience: formData?.Experience,
        location: formData?.Location,
        positionType: formData?.PositionType,
        description: formData?.description,
        responsibilities: formData?.Responsibilities,
        requirements: formData?.Requirements,
      };
      if (isedit) {
        const { data, error } = await supabase
          .from("JobPosting")
          .update(job)
          .eq("id", jobdata?.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          toast.success("data updated succcesfully");
          onsuccess();
        }
      } else {
        const { data, error } = await supabase
          .from("JobPosting")
          .insert([job])
          .select();
        if (error) throw error;

        if (data) {
          reset();
          toast.success("data inserted successfully");
        }
      }
    } catch (error) {
      console.error("error", error);
      toast.error("something went wrong");
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(handlejobCreate)}>
        <div className="border border-[#ccc] rounded-md m-3 space-y-9">
          <div className="flex flex-col p-3 space-y-3">
            <label className="font-medium text-lg lg:text-xl text-[#000]">
              Job Title
            </label>
            <input
              {...register("JobTitle", {
                required: true,
                maxLength: { value: 50, message: "max 50 character " },
              })}
              placeholder="eg Web developer"
              type="text"
              required
              className="p-1 border-2 border-[#ccc]"
            />
            {errors?.JobTitle && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.JobTitle?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">Location</label>
            <input
              type="text"
              placeholder="e.g., Mumbai"
              {...register("Location", {
                required: true,
              })}
              required
              className="p-1 border-2 border-[#ccc] "
            />
            {errors?.Location && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.Location?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Experience
            </label>
            <input
              type="number"
              placeholder="e.g., 2 years"
              required
              {...register("Experience", {
                required: true,
                min: { value: 0, message: "min year should be 0" },
              })}
              min={0}
              className="p-1 border-2 border-[#ccc] rounded-md"
            />
            {errors?.Experience && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.Experience?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Position type
            </label>
            <select
              {...register("PositionType", {
                required: true,
              })}
              className="p-1 border-2 border-[#ccc] "
              required
            >
              <option value="">select</option>
              <option value="FullTIme">FullTIme</option>
              <option value="Internship">Internship</option>
            </select>
            {errors?.PositionType && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.PositionType?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col p-3 space-y-3 border border-[#ccc] rounded-md m-3 ">
          <label className="font-medium text-xl text-[#000] capitalize">
            description
          </label>

          <textarea
            rows="3"
            {...register("description", {
              required: true,
            })}
            placeholder="job description"
            className="p-1 border-2 border-[#ccc] rounded-md"
          ></textarea>
          {errors?.description && (
            <p className="text-red-800 text-sm capitalize">
              {errors?.description?.message}
            </p>
          )}
        </div>
        <div className="flex-1 flex flex-col p-3 space-y-3 border border-[#ccc] rounded-md m-3 ">
          <label className="font-medium text-xl text-[#000]">
            Responsibilities
          </label>

          <textarea
            rows="5"
            placeholder="Enter one responsibility per line"
            className="p-1 border-2 border-[#ccc] rounded-md"
            {...register("Responsibilities", {
              required: true,
            })}
          ></textarea>
          {errors?.Responsibilities && (
            <p className="text-red-800 text-sm capitalize">
              {errors?.Responsibilities?.message}
            </p>
          )}
        </div>
        <div className="flex-1 flex flex-col p-3 space-y-3 border border-[#ccc] rounded-md m-3 ">
          <label className="font-medium text-xl text-[#000]">
            Requirements
          </label>
          <textarea
            rows="5"
            placeholder="Enter one Requirement per line"
            className="p-1 border-2 border-[#ccc] rounded-md"
            {...register("Requirements", {
              required: true,
            })}
          ></textarea>
          {errors?.Requirements && (
            <p className="text-red-800 text-sm capitalize">
              {errors?.Requirements?.message}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-6 m-3">
          <button
            className="border border-[#ccc] px-5 py-3 text-[#111] rounded-lg "
            type="button"
            onClick={reset}
          >
            Discard
          </button>
          <button
            className="border border-[#ccc] px-5 py-3 text-[#fff] bg-[#374A75] rounded-lg "
            type="submit"
          >
            {isedit ? "update" : "save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CareerDash;
