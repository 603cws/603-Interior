import React, { useEffect, useRef } from "react";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Footer from "../common-components/Footer";
import LandingNavbar from "../common-components/LandingNavbar";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import toast from "react-hot-toast";

import { useState } from "react";

// import { useNavigate } from "react-router-dom";
// import emailjs from "@emailjs/browser";

const BecomeSeller = () => {
  const sectionRef = useRef(null);

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

  // const navigate = useNavigate();

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current?.classList.add("animate-bikeSlide");
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { threshold: 0.5 }
    );

    sectionRef.current && observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1800, // Tailwind's custom 3xl breakpoint
        settings: {
          slidesToShow: 5, // Show 5 slides only on 3xl screens
        },
      },
    ],
  };

  const scrollToSection = () => {
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="h-[85vh] flex flex-col">
        <div>
          <LandingNavbar bgColor={true} />
        </div>
        <div className="container mx-auto flex-1 flex justify-around items-center ">
          <div className="w-1/2">
            <h3 className="text-[#1F5C54]  uppercase font-extrabold text-lg mb-3">
              Become a 603 interior Seller
            </h3>

            <h1 className="text-4xl xl:text-5xl font-extrabold uppercase text-[#1F5C54]">
              connect. <span className="text-[#54DED3]">collab.</span> <br />{" "}
              innovate.
            </h1>

            {/* <a
              href="#contact"
              className="px-5 py-3 bg-[#1F5C54] border-1 border-[#15423C] rounded-3xl uppercase text-white"
            >
              get started
            </a> */}
            <button
              onClick={scrollToSection}
              className="px-10 py-3 mt-20 bg-[#1F5C54] border-1 font-Poppins font-bold border-[#15423C] rounded-3xl uppercase text-white"
            >
              get started
            </button>
          </div>

          <div className="w-1/2 relative h-full mt-60 3xl:mt-96">
            {/* <img src="/images/becomeseller.png" alt="seller herosection" /> */}
            <img
              src="/images/collab-bg-2.png"
              alt=""
              className="absolute top-0 left-0 w-2/3 xl:w-3/4"
            />
            <img
              src="/images/collab-bg-1.png"
              alt=""
              className="absolute top-36 right-0 w-2/3 xl:w-3/4"
            />
          </div>
        </div>
      </section>
      {/* how it works */}
      <section className="my-10">
        <div className="font-Poppins uppercase container mx-auto ">
          {/* text */}
          <div className="text-center my-7 flex flex-col justify-center items-center gap-2">
            <img src="/images/serviceIcon.png" alt="service icon" />
            <h2 className="uppercase font-bold text-3xl">how it works</h2>
          </div>
          {/* infor */}
          <div className="flex justify-center gap-4 bg-[#F4F4F4] rounded-2xl py-5">
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>1</span>
                </div>
                <div className="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div>
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold text-base my-3">create account</h3>
                <p className="text-sm">All you need is :</p>
              </div>
            </div>
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>2</span>
                </div>
                <div className="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div>
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold text-base my-2">List Products</h3>
                <p className="text-sm uppercase">
                  List the products <br /> you want to sell in <br /> your
                  supplier panel
                </p>
              </div>
            </div>
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>3</span>
                </div>
                <div className="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div>
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold text-base my-2">Get Orders</h3>
                <p className="text-sm">
                  Start getting orders <br /> from crores of Indians <br />{" "}
                  actively shopping on our <br /> platform.
                </p>
              </div>
            </div>
            {/* info card */}
            <div className="max-w-sm">
              <div className="flex  items-center gap-3">
                <div className="w-12 h-12 bg-[#1F5C54] rounded-full text-white text-lg flex justify-center items-center">
                  <span>4</span>
                </div>
                {/* <div className="w-[158px] h-[0px] border-2 border-[#1f5c54]"></div> */}
              </div>
              {/* info of card */}
              <div>
                <h3 className="font-semibold text-base my-2">
                  Receive Payments
                </h3>
                <p className="text-sm">
                  APayments are deposited directly <br /> to your bank account{" "}
                  <br />
                  following a 7-day payment <br /> cycle from order delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* bring your brand */}
      <section className="w-full container mx-auto px-10">
        <div className="bring-your-brand w-full bg-[#7AC2AE] overflow-hidden rounded-[30px]">
          {/* Remove the static animate-bikeSlide className and add it dynamically via the ref */}
          <div ref={sectionRef} className="flex gap-5 pt-16 px-4">
            <div className="w-1/3">
              {/* <img
                src="/images/delivery-truck.png"
                alt="Bike or Brand"
                className="h-full w-full"
              /> */}
              <img
                src="/images/truck.png"
                alt="Bike or Brand"
                className="h-full w-full"
              />
            </div>
            <div className="w-2/3 flex flex-col gap-5 px-5 justify-center items-start font-Poppins">
              <h2 className="text-3xl font-bold">
                Bring your brand on 603 Interior
              </h2>
              <p>
                Use 603 interior tools to help customers discover your unique
                products and protect your intellectual property.
              </p>
              <button className="flex justify-center items-center gap-4 font-semibold text-xl">
                Launch your brand
                <LiaLongArrowAltRightSolid color="#1A3A36" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* our client section */}
      {/* section 5 */}
      <section className="mt-6 relative bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
        {/* container */}
        <div className="container mx-auto flex flex-col py-10">
          {/* text */}
          <div className="flex flex-col justify-center items-center mb-3">
            <p className="font-sans mb-1 text-[#1F5C54] font-bold uppercase text-sm tracking-wider">
              Our Clients
            </p>
            <img src="/images/serviceIcon.png" alt="service icon" />
          </div>
          {/* logo slider */}
          <div className="flex justify-center items-center mx-4 w-full max-w-screen">
            <Slider {...settings} className="w-full">
              <div className="slider-image w-56 h-16 flex justify-center items-center">
                <img
                  src="/images/iide-logo.svg"
                  alt="iide"
                  className="w-full max-h-full"
                />
              </div>
              <div className=" slider-image">
                <img
                  src="/images/credilio-svg-logo.svg"
                  alt="credilio"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-56 h-16 flex justify-center items-center">
                <img
                  src="/images/tripjack-logo.png"
                  alt="tripjack"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-32 h-[70px] flex justify-center items-center px-5">
                <img
                  src="/images/bajaj-electricals-logo.jpg"
                  alt="bajaj"
                  className="w-full max-h-full"
                />
              </div>
              <div className="slider-image w-28 h-16 flex justify-center items-center px-5">
                <img
                  src="/logo/logo.png"
                  alt="603"
                  className="w-full max-h-full"
                />
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* contact section */}
      <section id="contact" className="">
        <div className="flex container mx-auto my-10 gap-5">
          {/* img */}
          <div className="flex-1 w-1/2">
            <img
              src="/images/becomesellercontact.png"
              className="w-full"
              alt="becomeseller contact"
            />
          </div>
          {/* form */}
          {/* form section */}
          <div className="flex-1 w-1/2 border-2 rounded-3xl">
            <div className="px-10  pb-5">
              {/* text */}
              <div className="font-Poppins font-semibold py-3">
                <p className="text-sm text-[#34BFAD]">Get in Touch!</p>
                <img src="/images/serviceIcon.png" alt="service icon" />
                <h4 className="text-2xl my-2">Love to hear from you</h4>
                <h5 className="text-2xl mb-2">Get in Touch!</h5>
              </div>
              {/* form part */}
              <div className="font-Poppins pl-2">
                <form action="" className="font-semibold">
                  <div className="mb-2 flex flex-col">
                    <label className="font-semibold ">Name*</label>
                    <input
                      type="text"
                      name="name"
                      className="font-medium w-full rounded-lg p-2 mb-2 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] capitalize"
                      placeholder="John Doe"
                      value={form.name}
                      // onChange={setname((e) => e.target.value)}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="mt-2">Email*</label>
                    <input
                      type="email"
                      name="email"
                      className="font-medium w-full rounded-lg p-2 mb-2 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] "
                      placeholder="example@gmail.com"
                      // value={email}
                      // onChange={setEmail((e) => e.target.value)}
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
                      className="w-full rounded-lg p-2 mb-2 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] font-medium"
                      required
                      //   placeholder="John Doe"
                      // value={companyName}
                      // onChange={setCompanyName((e) => e.target.value)}
                      value={form.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="font-semibold mt-2">Mobile No*</label>
                    <input
                      type="number"
                      name="mobileNo"
                      className="w-full rounded-lg p-2 mb-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#D1D5DB] bg-[#F8F8F8] placeholder:text-[#CCC] font-medium"
                      placeholder="Enter Mobile No"
                      // value={mobileNo}
                      // onChange={setMobileNo((e) => e.target.value)}
                      value={form.mobileNo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className=" mt-2">Message*</label>
                    <textarea
                      rows="4"
                      name="message"
                      className="w-full rounded-lg p-2 mb-2 border-2 border-[#D1D5DB] bg-[#F8F8F8] focus:outline-none placeholder:text-[#CCC] font-medium"
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
                    type="submit"
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
      </section>

      {/* footer */}
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default BecomeSeller;
