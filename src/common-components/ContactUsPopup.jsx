import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { MdClose } from "react-icons/md";

function ContactUsPopup({ onClose }) {
  const [form, setFormData] = useState({
    message: "",
    name: "",
    email: "",
    mobileNo: "",
    companyName: "",
  });
  const [isSubmitting, setisSubmitting] = useState(false);

  const templateID = "template_0355bfq";
  const serviceid = "service_ae0sgim";
  const your_public_key = "dR0YyJ3Be6H6xVsT7";

  const handleChange = (e) => {
    setFormData({ ...form, [e.target.name]: e.target.value });
  };

  const handleformsubmit = async (e) => {
    e.preventDefault();

    console.log("hii from log");

    if (
      !form.email ||
      !form.companyName ||
      !form.name ||
      !form.mobileNo ||
      !form.message
    ) {
      toast.error("form not filled");
      return;
    } else {
      const data = {
        service_id: serviceid,
        template_id: templateID,
        user_id: your_public_key,
        template_params: {
          name: form.name,
          mobile: form.mobileNo,
          company: form.companyName,
          email: form.email,
          message: form.message,
        },
      };

      try {
        setisSubmitting(true);
        const response = await axios.post(
          "https://api.emailjs.com/api/v1.0/email/send",
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log("Email sent successfully:", response.data);
        // alert("Your mail is sent!");
        toast.success("we will shortly reach you");
        // setFormData({ username: "", user_email: "", message: "" }); // Reset form

        //reset form
        setFormData({
          message: "",
          name: "",
          email: "",
          mobileNo: "",
          companyName: "",
        });
      } catch (error) {
        console.error("Error sending email:", error);
        alert(
          "Oops... " + JSON.stringify(error.response?.data || error.message)
        );
      } finally {
        setisSubmitting(false);
      }
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 z-30 flex justify-center items-center ">
      <div className="bg-white  max-w-sm lg:max-w-lg w-full mx-auto rounded-2xl relative">
        <div className="flex justify-end items-center mb-4 absolute top-3 right-5">
          <MdClose
            className="text-xl cursor-pointer text-gray-600"
            onClick={onClose}
          />
        </div>
        <div className="px-10  rounded-3xl pb-5">
          {/* text */}
          <div className="font-Poppins font-semibold py-3">
            <p className="text-sm text-[#34BFAD]">Get in Touch!</p>
            <img src="/images/serviceIcon.png" alt="service icon" />
            <h4 className="text-xl">Love to hear from you</h4>
            <h5 className="text-xl">Get in Touch!</h5>
          </div>
          {/* form part */}
          <div className="font-Poppins pl-2">
            <form action="" className="font-semibold ">
              <div className="mb-2 flex flex-col gap-1.5">
                <label className="font-semibold text-sm">Name*</label>
                <input
                  type="text"
                  name="name"
                  className="font-medium w-full rounded-lg p-2 mb-1 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] capitalize text-sm"
                  placeholder="John Doe"
                  value={form.name}
                  // onChange={setname((e) => e.target.value)}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2 flex flex-col gap-1.5">
                <label className="mt-2 text-sm">Email id*</label>
                <input
                  type="email"
                  name="email"
                  className="font-medium w-full rounded-lg p-2 mb-1 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] text-sm"
                  placeholder="example@gmail.com"
                  // value={email}
                  // onChange={setEmail((e) => e.target.value)}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2 flex flex-col gap-1.5">
                <label className="mt-2 text-sm">Company Name*</label>
                <input
                  type="text"
                  name="companyName"
                  className="w-full rounded-lg p-2 mb-1 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] font-medium text-sm"
                  required
                  //   placeholder="John Doe"
                  // value={companyName}
                  // onChange={setCompanyName((e) => e.target.value)}
                  value={form.companyName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2 flex flex-col gap-1.5">
                <label className="font-semibold mt-2 text-sm">
                  Mobile Number*
                </label>
                <input
                  type="Number"
                  name="mobileNo"
                  className="w-full rounded-lg p-2 mb-1 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#D1D5DB] bg-[#F8F8F8] placeholder:text-[#CCC] font-medium text-sm"
                  placeholder="Enter Mobile No"
                  // value={mobileNo}
                  // onChange={setMobileNo((e) => e.target.value)}
                  value={form.mobileNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2 flex flex-col gap-1.5">
                <label className=" mt-2 text-sm">Message*</label>
                <textarea
                  rows="4"
                  name="message"
                  className="w-full rounded-lg p-2 mb-1 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] font-medium text-sm"
                  placeholder="your message..."
                  // value={message}
                  // onChange={(e) => setMessage(e.target.value)}
                  value={form.message}
                  onChange={handleChange}
                >
                  {" "}
                </textarea>
              </div>
              <button
                className="px-10 py-2 font-bold rounded-lg bg-[#1F5C54] border-black border border-1 mb-2 text-white"
                onClick={handleformsubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="spinner">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPopup;
