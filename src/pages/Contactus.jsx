import Footer from "../common-components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import HeroSection from "./HeroSection";

function Contactus() {
  const [isSubmitting, setisSubmitting] = useState(false);

  // template id
  const templateID = "template_0355bfq";
  const serviceid = "service_ae0sgim";
  const your_public_key = "dR0YyJ3Be6H6xVsT7";

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

  // const [source] = useState(
  //   "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19404.103720641866!2d72.8237966008724!3d19.057896067431624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91140262913%3A0xc53b6407e4d39f76!2sMakhija%20Arcade%2C%2035th%20Rd%2C%20Khar%2C%20Khar%20West%2C%20Mumbai%2C%20Maharashtra%20400052!5e0!3m2!1sen!2sin!4v1737115916330!5m2!1sen!2sin"
  // );

  const background = "/images/contact-us/contactpage.png";

  const handleformsubmit = async (e) => {
    e.preventDefault();

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
          mobileNo: 0,
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
    <>
      <div className="">
        <HeroSection background={background} title={"contact"} />
      </div>

      <section className="hidden sm:block pt-8 lg:h-screen 3xl:h-[50vh] md:container md:mx-auto">
        <div className=" py-3 flex flex-col-reverse lg:flex-row lg:justify-center lg:items-center  gap-10 h-full 3xl:h-[600px] relative -top-1/6">
          <div className="lg:relative lg:flex-1 lg:h-full  3xl:h-[600px]">
            <div className="max-w-2xl bg-[#304778] text-white lg:absolute lg:-top-1/4">
              <div className="px-10 py-10 rounded-3xl pb-5 ">
                {/* text */}
                <div className="[&_p]:font-Poppins  font-semibold py-3">
                  <h2 className="font-lora font-medium  text-5xl  pb-4">
                    Let’s Connect with us!
                  </h2>
                  <p className="text-[14.9px] leading-6 text-[#F8F9FA] text-opacity-80">
                    We believe in collaboration and value your input throughout
                    the design process. We encourage clients to actively
                    participate in discussions,share their ideas, preferences,
                    and feedback.
                  </p>
                </div>
                {/* form part */}
                <div className="font-Poppins pl-2">
                  <form
                    action=""
                    className="font-semibold  [&_label]:text-[#F8F9FA] [&_input]:text-[#DBDBDB] [&_input]:bg-[#304778] [&_textarea]:bg-[#304778] [&_input]:border-[#DEE2E6] [&_input]:border-opacity-40 [&_textarea]:border-[#DEE2E6] [&_textarea]:border-opacity-40 "
                  >
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="font-semibold ">Full Name*</label>
                      <input
                        type="text"
                        name="name"
                        className="font-medium w-full  p-2 mb-2 border   focus:outline-none  capitalize"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="mt-2">Email Address*</label>
                      <input
                        type="email"
                        name="email"
                        className="font-medium w-full rounded-lg p-2 mb-2 border  focus:outline-none "
                        placeholder="example@gmail.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="mt-2">Company Name*</label>
                      <input
                        type="text"
                        name="companyName"
                        className="w-full rounded-lg p-2 mb-2 border focus:outline-none  font-medium"
                        required
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="your organization name "
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="font-semibold mt-2">
                        Mobile Number*
                      </label>
                      <input
                        type="Number"
                        name="mobileNo"
                        className="w-full rounded-lg p-2 mb-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border font-medium"
                        placeholder="Enter Mobile No"
                        value={form.mobileNo}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        required
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className=" mt-2">Message*</label>
                      <textarea
                        rows="4"
                        name="message"
                        className="w-full rounded-lg p-2 mb-2 border border-[#D1D5DB] focus:outline-none  font-medium"
                        placeholder="Write your messages..."
                        value={form.message}
                        onChange={handleChange}
                      >
                        {" "}
                      </textarea>
                    </div>
                    <button
                      className="px-10 py-4 font-Poppins rounded-3xl  border-white border  mb-2 text-white"
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
                        "Send a message"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="font-inter lg:flex-1 space-y-4">
            <h2 className="text-[#1C346B] text-[31.1px] font-medium leading-[48px] ">
              Interested in working with us!
            </h2>
            <p className="text-[#525B5B] text-[17.6px] leading-8">
              We encourage our team to fearlessly challenge conventions <br />{" "}
              and pioneer new paths.
            </p>
            <div className="flex gap-3 items-center [&_h3]:text-[#304778] [&_h4]:text-[#304778] [&_h3]:text-[19.5px] [&_p]:text-[#525B5B] [&_p]:text-[15px]">
              <div>
                <h3>Working Mail</h3>
                <p className="">sales@603thecoworkingspace.com</p>
              </div>
              <div>
                <h3>Office Phone</h3>
                <p>+91-9136036603</p>
              </div>
            </div>
            <div>
              <h4 className="text-[#304778] text-[19.5px] ">Office Address</h4>
              <p className="text-[#525B5B] text-[15px]">
                Makhija Arcade, 35th Rd, Khar West, Mumbai Maharashtra 400052
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* mobile view */}
      <section className="sm:hidden pt-8 relative h-[1300px]">
        <div className=" mt-3 flex flex-col-reverse  bg-white absolute -top-[8%] mx-4">
          <div className=" flex-1 ">
            <div className="max-w-2xl bg-[#304778] text-white ">
              <div className="px-4 pt-10 pb-4 rounded-3xl ">
                {/* text */}
                <div className="[&_p]:font-Poppins  font-semibold py-3">
                  <h2 className="font-lora font-medium  text-4xl  pb-4">
                    Let’s Connect with us!
                  </h2>
                  <p className="text-base font-Poppins text-[#F8F9FA] text-opacity-80">
                    We believe in collaboration and value your input throughout
                    the design process. We encourage clients to actively
                    participate in discussions,share their ideas, preferences,
                    and feedback.
                  </p>
                </div>
                {/* form part */}
                <div className="font-Poppins ">
                  <form
                    action=""
                    className="font-semibold  [&_label]:text-[#F8F9FA] [&_input]:text-[#DBDBDB] [&_input]:bg-[#304778] [&_textarea]:bg-[#304778] [&_input]:border-[#DEE2E6] [&_input]:border-opacity-40 [&_textarea]:border-[#DEE2E6] [&_textarea]:border-opacity-40 "
                  >
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="font-semibold ">Full Name*</label>
                      <input
                        type="text"
                        name="name"
                        className="font-medium w-full  p-2 mb-2 border   focus:outline-none  capitalize"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="mt-2">Email Address*</label>
                      <input
                        type="email"
                        name="email"
                        className="font-medium w-full  p-2 mb-2 border  focus:outline-none "
                        placeholder="example@gmail.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="mt-2">Company Name*</label>
                      <input
                        type="text"
                        name="companyName"
                        className="w-full  p-2 mb-2 border focus:outline-none  font-medium"
                        required
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="your organization name "
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className="font-semibold mt-2">
                        Mobile Number*
                      </label>
                      <input
                        type="Number"
                        name="mobileNo"
                        className="w-full  p-2 mb-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border font-medium"
                        placeholder="Enter Mobile No"
                        value={form.mobileNo}
                        onChange={handleChange}
                        onWheel={(e) => e.target.blur()}
                        required
                      />
                    </div>
                    <div className="mb-2 flex flex-col gap-2">
                      <label className=" mt-2">Message*</label>
                      <textarea
                        rows="4"
                        name="message"
                        className="w-full  p-2 mb-2 border border-[#D1D5DB] focus:outline-none  font-medium"
                        placeholder="Write your messages..."
                        value={form.message}
                        onChange={handleChange}
                      >
                        {" "}
                      </textarea>
                    </div>
                    <button
                      className="px-10 py-4 font-Poppins rounded-3xl  border-white border  mb-2 text-white"
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
                        "Send a message"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="font-inter bg-white flex-1 space-y-2 px-4 pt-10 pb-4 border">
            <h2 className="text-[#1C346B] text-3xl ">
              Interested in working with us!
            </h2>
            <p className="text-[#525B5B] text-lg">
              We encourage our team to fearlessly challenge conventions <br />{" "}
              and pioneer new paths.
            </p>
            <div className="flex flex-col gap-3 [&_h3]:text-[#304778] [&_h4]:text-[#304778] [&_h3]:text-[19.5px] [&_p]:text-[#525B5B] [&_p]:text-[15px]">
              <div>
                <h3>Working Mail</h3>
                <p className="">sales@603thecoworkingspace.com</p>
              </div>
              <div>
                <h3>Office Phone</h3>
                <p>+91-9136036603</p>
              </div>
            </div>
            <div>
              <h4 className="text-[#304778] text-[19.5px] ">Office Address</h4>
              <p className="text-[#525B5B] text-[15px]">
                Makhija Arcade, 35th Rd, Khar West, Mumbai Maharashtra 400052
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer key="contactus" />
    </>
  );
}

export default Contactus;
