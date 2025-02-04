import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

import { useState } from "react";
import {
  RiFacebookCircleFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
} from "react-icons/ri";
import { PiMapPinAreaFill } from "react-icons/pi";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { HiClock } from "react-icons/hi";

function Contactus() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");

  const [source] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19404.103720641866!2d72.8237966008724!3d19.057896067431624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c91140262913%3A0xc53b6407e4d39f76!2sMakhija%20Arcade%2C%2035th%20Rd%2C%20Khar%2C%20Khar%20West%2C%20Mumbai%2C%20Maharashtra%20400052!5e0!3m2!1sen!2sin!4v1737115916330!5m2!1sen!2sin"
  );

  return (
    <>
      {/* section 1 */}
      <section className="h-[75vh] flex flex-col bg-[#1F5C54] ">
        {/* navbar */}
        <div className="">
          <LandingNavbar />
        </div>
        {/* div for image & text */}
        <div className="flex container mx-auto">
          {/* image */}
          <div className="flex-1">
            <img
              src="images/contact.png"
              alt="contactus"
              className="h-[60vh] w-full"
            />
          </div>
          {/* text */}
          <div className=" flex justify-end items-center text-white">
            <div className="mx-10 font-lato font-extrabold uppercase">
              <h1 className=" text-6xl">contact Us</h1>
              <p className="text-xl text-end">connect with us</p>
            </div>
          </div>
        </div>
      </section>
      {/* section2 */}
      <section className="bg-[url('/images/AdressCont.png')] bg-cover">
        {/* container */}
        <div className="container mx-auto flex justify-center gap-12 font-Poppins py-4 items-center ">
          {/* content card */}
          <div className="border border-1 border-[#000] text-center p-2 w-[215px] h-[255px] ">
            <div className="w-full flex justify-center my-4">
              <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                <PiMapPinAreaFill size={35} />
              </div>
            </div>
            <h2 className="font-semibold text-2xl uppercase mb-2">Address</h2>
            <h3 className="text-xl font-medium mb-1">Head Office:</h3>
            <p className="text-[#111111]">
              Makhija Arcade, 35th Rd,
              <br /> Khar West, Mumbai <br /> Maharashtra 400052
            </p>
          </div>
          {/* content card */}
          <div className="border border-1 border-[#000] text-center p-2  w-[215px] h-[255px] ">
            <div className="w-full flex justify-center my-4">
              <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                <IoIosCall size={35} />
              </div>
            </div>
            <h2 className="font-semibold text-2xl uppercase mb-3">phone</h2>
            <h3 className="text-xl font-medium mb-2">Head Office:</h3>
            <p className="text-[#111111] font-medium">
              +91-22-12345678 / <br />
              +91-22-12345678
            </p>
          </div>
          {/* content card */}
          <div className="border border-1 border-[#000] text-center p-2  w-[215px] h-[255px]  ">
            <div className="w-full flex justify-center my-4">
              <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                <MdEmail size={35} />
              </div>
            </div>
            <h2 className="font-semibold text-2xl uppercase mb-2">Email</h2>
            <h3 className="text-xl font-medium mb-1">Head Office:</h3>
            <p className="text-[#111111] font-medium">603@Coworking.com</p>
          </div>
          {/* content card */}
          <div className="border border-1 border-[#000] text-center p-2  w-[215px] h-[255px]  ">
            <div className="w-full flex justify-center my-4">
              <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                <HiClock size={35} />
              </div>
            </div>
            <h2 className="font-semibold text-2xl uppercase mb-2">Time</h2>
            <h3 className="text-xl font-medium mb-1">Mon-sat:</h3>
            <p className="text-[#111111] font-medium">9am-9pm</p>
          </div>
        </div>
      </section>

      {/* section 3 */}
      <section className="bg-[#F4F4F4] pt-8">
        <div className="flex container mx-auto gap-10 py-3">
          {/* form section */}
          <div className="flex-1">
            <div className="px-10 bg-[#1A3A36] rounded-3xl pb-5">
              {/* text */}
              <div className="font-Poppins font-semibold py-3">
                <p className="text-sm text-[#34BFAD]">Get in Touch!</p>
                <img src="/images/serviceIcon.png" alt="service icon" />
                <h4 className="text-2xl text-white">Love to hear from you</h4>
                <h5 className="text-2xl text-white">Get in Touch!</h5>
              </div>
              {/* form part */}
              <div className="font-Poppins pl-2">
                <form action="" className="">
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="font-semibold text-white ">Name*</label>
                    <input
                      type="text"
                      className="w-full rounded-lg p-2 mb-2 focus:outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="font-semibold text-white ">Email*</label>
                    <input
                      type="email"
                      className="w-full rounded-lg p-2 mb-2 focus:outline-none"
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="font-semibold text-white">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg p-2 mb-2 focus:outline-none"
                      required
                      //   placeholder="John Doe"
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="font-semibold text-white ">
                      Mobile No*
                    </label>
                    <input
                      type="Number"
                      className="w-full rounded-lg p-2 mb-2 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter Mobile No"
                      required
                    />
                  </div>
                  <div className="mb-2 flex flex-col gap-2">
                    <label className="font-semibold text-white ">
                      Message*
                    </label>
                    <textarea
                      rows="4"
                      className="w-full rounded-lg p-2 mb-2 focus:outline-none"
                      placeholder="your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    >
                      {" "}
                    </textarea>
                  </div>
                  <button className="px-10 py-2 font-semibold rounded-lg bg-[#1F5C54] border-black border border-1 mb-2 text-white">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className=" my-2 flex-1">
            <div className="flex flex-col gap-4 p-2">
              {/* div for text */}
              <div className="flex justify-center items-center mb-4">
                <div className="font-Poppins">
                  <h2 className=" font-medium text-4xl text-[#34BFAD] text-center">
                    SEE US AT:
                  </h2>
                  <div className="flex justify-center items-center">
                    <img src="/images/serviceIcon.png" alt="service icon" />
                  </div>
                  <p className="text-sm text-center">
                    Makhija Arcade, 35th Rd, Khar West,
                    <br />
                    Mumbai Maharashtra 400052
                  </p>
                </div>
              </div>

              {/* div for map */}
              <div className="flex-1 bg-gradient-to-r from-gray-100 to-yellow-100">
                <iframe
                  src={source}
                  className="w-full h-96 rounded-lg shadow-lg"
                  loading="lazy"
                  title="makhija archade"
                ></iframe>
              </div>

              {/* social media */}
              <div className="flex-1 flex flex-col justify-start pt-16 ">
                {/* <div> */}
                <h3 className="mb-4 font-semibold font-Poppins">
                  Social Media
                </h3>
                <div className="flex gap-3 items-center">
                  {/* <RiInstagramFill size={50} color="#1F5C54" /> */}
                  <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                    <RiInstagramFill size={35} />
                  </div>
                  <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                    <RiFacebookCircleFill size={35} />
                  </div>
                  <div className="cursor-pointer w-12 h-12 rounded-full bg-[#34BFAD] flex justify-center items-center">
                    <RiLinkedinBoxFill size={35} />
                  </div>
                  {/* <img
                    src="/images/Insta.png"
                    alt="social media"
                    className="cursor-pointer"
                  />
                  <img
                    src="/images/Insta.png"
                    alt="social media"
                    className="cursor-pointer"
                  /> */}
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <Footer key="contactus" />

      {/* contatus form button  */}
      {/* <button className="rotate-90 absolute top-50 right-0 bg-red-600 px-5 py-2">
        Contact Form
        </button> */}
    </>
  );
}

export default Contactus;

// <div className="h-[120vh]">
//         <section className="flex flex-col h-[75vh] bg-[url('/images/contactuspage.png')] bg-contain bg-no-repeat  ">
{
  /* <section className="flex flex-col h-[75vh]  bg-[url('/images/resize2.png')] bg-contain bg-center bg-no-repeat"> */
}
//       <div>
//         <LandingNavbar />
//       </div>

//       <div className="flex-1  flex justify-end items-center">
//         <div className="mx-10 font-lato font-extrabold uppercase">
//           <h1 className=" text-6xl">contact Us</h1>
//           <p className="text-xl text-end">connect with us</p>
//         </div>
//       </div>
//     </section>
//   </div>
