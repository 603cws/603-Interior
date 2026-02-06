import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { supabase } from "../../services/supabase";
function ContactUsPopup({ onClose }) {
  const [isSubmitting, setisSubmitting] = useState(false);

  const [form, setFormData] = useState({
    message: "",
    name: "",
    email: "",
    mobileNo: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...form, [e.target.name]: e.target.value });
  };

  const handleformsubmit = async (e) => {
    e.preventDefault();
    try {
      setisSubmitting(true);
      if (
        !form.email ||
        !form.companyName ||
        !form.name ||
        !form.mobileNo ||
        !form.message
      ) {
        toast.error("form not filled");
        return;
      }
      const { error } = await supabase
        .from("contactUsData")
        .insert([
          {
            name: form.name,
            mobileNo: form.mobileNo,
            companyName: form.companyName,
            email: form.email,
            message: form.message,
          },
        ])
        .select();

      if (error) throw error;
      toast.success("we will shortly reach you");
      // send email to user
      await fetch(
        "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/ContactUsEmailUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            companyName: form.companyName,
          }),
        },
      );
      const AdminEmail = "workvedbusinesscentre@gmail.com";
      // send email to admin
      await fetch(
        "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/ContactUsEmailAdmin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: AdminEmail,
            companyName: form.companyName,
            phone: form.mobileNo,
            message: form.message,
            userEmail: form.email,
            name: form.name,
          }),
        },
      );

      setFormData({
        message: "",
        name: "",
        email: "",
        mobileNo: 0,
        companyName: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setisSubmitting(false);
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: "easeInOut",
        }}
        className="fixed inset-0 flex justify-center items-center bg-[#000]/30 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{
            duration: 0.35,
            ease: "easeInOut",
          }}
          className="max-w-sm md:max-w-xl lg:max-w-3xl 2xl:max-w-4xl w-full mx-2 sm:mx-0 flex bg-[#fff] font-Poppins relative xl:max-h-[90vh] overflow-auto gradient-scrollbar"
        >
          <div className="flex-1 hidden xl:block sticky top-0 left-0">
            <img
              src="/images/contact-us/contact-popup.png"
              alt="contact us background"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 relative flex flex-col">
            <div className="absolute right-3 top-3">
              <button onClick={onClose}>
                <IoIosCloseCircle color="#304778" size={25} />
              </button>
            </div>
            <div className="p-5">
              <div>
                <h4 className="capitalize font-semibold text-[#304778] text-sm lg:text-base">
                  Get in touch!
                </h4>
                <img
                  src="/images/separator.png"
                  alt="separator design icon"
                  className="w-20 mt-3"
                />
              </div>
              <h2 className="font-semibold text-xl lg:text-2xl my-3 xl:my-5">
                Love to hear from you <br /> Get in touch
              </h2>
              <div className="text-[#000]">
                <form
                  onSubmit={handleformsubmit}
                  className="space-y-2 lg:space-y-3 [&_label]:font-semibold [&_input]:border [&_input]:p-1.5 [&_input]:rounded-md [&_input]:text-xs lg:[&_input]:text-sm [&_label]:text-xs lg:[&_label]:text-sm "
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="">Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className=""
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="">Email ID *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="example@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="">Company Name*</label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="your organization name "
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="">Mobile Number*</label>
                    <input
                      type="Number"
                      name="mobileNo"
                      placeholder="Enter Mobile No"
                      value={form.mobileNo}
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="">Message*</label>
                    <textarea
                      rows="4"
                      name="message"
                      placeholder="Write your messages..."
                      value={form.message}
                      onChange={handleChange}
                      className="border rounded-md p-1.5 text-xs lg:text-sm"
                      required
                    >
                      {" "}
                    </textarea>
                  </div>
                  <button
                    className="bg-[#304778] text-[#fff] font-semibold px-10 py-2 rounded-md"
                    disabled={isSubmitting}
                    type="submit"
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
        </motion.div>
      </motion.div>
    </>
  );
}

export default ContactUsPopup;
