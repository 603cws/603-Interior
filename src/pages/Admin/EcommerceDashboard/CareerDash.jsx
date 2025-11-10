import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdArrowBackIos } from "react-icons/md";
import { supabase } from "../../../services/supabase";
import { BsThreeDots } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoCalendarSharp } from "react-icons/io5";
import { HiClock } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function CareerDash() {
  const [createJobPost, setCreateJobPost] = useState(false);
  const [jobPostings, setJobPostings] = useState();
  const [jobApplication, setJobApplication] = useState();
  const [isJobEdit, setIsJobEdit] = useState(false);
  const [jobEditData, setjobEditData] = useState();

  useEffect(() => {
    async function GetAllJobPosting() {
      try {
        const { data, error } = await supabase.from("JobPosting").select("*");
        setJobPostings(data);
        if (error) throw error;
      } catch (error) {
        console.log("error", error);
      }
    }
    GetAllJobPosting();
    async function GetAllJobApplication() {
      try {
        const { data, error } = await supabase
          .from("JobApplication")
          .select("Position");
        setJobApplication(data);
        if (error) throw error;
      } catch (error) {
        console.log("error", error);
      }
    }
    GetAllJobApplication();
  }, []);

  const onsuccess = () => {
    setCreateJobPost(false);
    setIsJobEdit(false);
  };
  return (
    <div className="font-Poppins overflow-y-auto gradient-scrollbar">
      <div className="flex justify-between items-center py-2 px-3">
        <h2 className="flex items-center text-xl md:text-2xl font-semibold text-[#374A75] ">
          {(createJobPost || isJobEdit) && (
            <button
              onClick={() => {
                setCreateJobPost(false);
                setIsJobEdit(false);
              }}
            >
              <MdArrowBackIos />
            </button>
          )}
          Job post
        </h2>
        {!createJobPost && !isJobEdit && (
          <div className="flex gap-2">
            <button
              onClick={() => setCreateJobPost((prev) => !prev)}
              className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1] flex items-center gap-1"
            >
              + <span className="hidden lg:block">Add Job</span>
            </button>
          </div>
        )}
      </div>
      <hr />
      {createJobPost ? (
        <JobPostForm />
      ) : isJobEdit ? (
        <JobPostForm
          jobdata={jobEditData}
          isedit={true}
          onsuccess={onsuccess}
        />
      ) : (
        <div className="p-4 grid grid-cols-2 gap-x-3 sm:grid-cols-3 gap-y-10">
          {jobPostings?.map((job) => (
            <JobCard
              key={job?.id}
              jobdata={job}
              jobApplication={jobApplication}
              setIsJobEdit={setIsJobEdit}
              setjobEditData={setjobEditData}
              setCreateJobPost={setCreateJobPost}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function JobCard({
  jobdata,
  jobApplication,
  setIsJobEdit,
  setjobEditData,
  setCreateJobPost,
}) {
  return (
    <div className="max-w-sm font-Poppins border border-[#ccc] p-2 rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold italic">{jobdata?.jobTitle}</h2>
        <div className="flex gap-3 items-center text-xl ">
          {/* <button>
            <MdDeleteOutline />
          </button> */}
          <button
            onClick={() => {
              setIsJobEdit(true);
              setjobEditData(jobdata);
              setCreateJobPost(false);
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
        <button className="flex gap-1 items-center justify-center">
          view details <MdKeyboardArrowRight size={22} color="#334A78" />
        </button>
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
    console.log("formdata", formData);

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

        console.log("editing data ", data);
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
      // {
      //               jobTitle: formData?.JobTitle,
      //               experience: formData?.Experience,
      //               location: formData?.Location,
      //               positionType: formData?.PositionType,
      //               description: formData?.description,
      //               responsibilities: formData?.Responsibilities,
      //               requirements: formData?.Requirements,
      //             },
      //   console.log("data", data);
    } catch (error) {
      console.log("error", error);
      toast.error("something went wrong");
    }
  }
  return (
    <div>
      <form
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     e.preventDefault();
        //   }
        // }}
        onSubmit={handleSubmit(handlejobCreate)}
      >
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
