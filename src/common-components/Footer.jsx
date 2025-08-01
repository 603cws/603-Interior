import { IoIosMail } from "react-icons/io";
import { FaInstagram, FaAngleUp } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { BsShop } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { PiPhoneCallFill } from "react-icons/pi";
import { supabase } from "../services/supabase";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling
    });
  };

  // Email regex validator
  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  //newsletter
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const { data, error } = await supabase
      .from("news_letter")
      .insert([{ email, subscribed: true }]);

    if (error) {
      // setMessage("This email is already subscribed or invalid.");
      console.log(error);

      toast.error("Invalid email");
    } else {
      toast.success("subscribed sucessfully");
      setEmail("");
    }
  };

  const navigate = useNavigate();
  return (
    <footer className=" bg-[#232323] text-white font-Poppins px-6 lg:px-10 xl:px-40 pt-6 pb-3 lg:pt-12 lg:pb-5">
      <div className="md:container lg:flex justify-stretch w-full mb-10">
        <div className="font-lato flex-1 space-y-2">
          <h4 className="text-2xl text-[#fffff] font-bold">
            Sign Up To Get Latest Update
          </h4>
          <p>
            Sign up for our monthly newsletter for the latest news & articles
          </p>
        </div>
        <form
          onSubmit={handleSubscribe}
          className="flex-1 flex justify-center items-center font-lato"
        >
          <input
            type="text"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-y-[1px] border-l-[1px] border-[#777777] w-full py-3.5 bg-transparent px-2 focus:outline-none focus:ring-0"
            name="subscribe-email"
          />
          <button className="capitalize bg-[#EBEFF9] text-[#000000] text-nowrap py-3.5 border-y-[1px] border-r-[1px] border-[#777777] font-bold px-1">
            subscribe now
          </button>
        </form>
      </div>
      <div className="md:container md:mx-auto  flex flex-col md:flex-row justify-between md:justify-center lg:justify-between   gap-10 mb-20">
        <div className="border-r-2 border-[#FFD074]  pr-10 xl:pr-28  lg:flex flex-col gap-5 text-sm">
          <div className="capitalize">
            <h3 className="font-semibold mb-3 lg:mb-0">
              registered office address
            </h3>
            <h3 className="font-semibold mb-2 lg:mb-0 capitalize">
              Workved Interiors
            </h3>
          </div>
          <div className="flex mb-5 lg:mb-0 lg:flex-col gap-2.5">
            {/* Address */}
            <div className="flex items-center gap-10 capitalize">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Makhija+Arcade,+35th+Rd,+Khar+West,+Mumbai+Maharashtra+400052"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLocationDot
                  size={20}
                  className="cursor-pointer hover:text-blue-500"
                />
              </a>
              <p className="hidden lg:block font-thin">
                Makhija Arcade, 35th Rd, Khar West, <br />
                Mumbai Maharashtra 400052
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-10 capitalize">
              <a href="tel:+919136036603">
                <PiPhoneCallFill
                  size={20}
                  className="cursor-pointer hover:text-green-500"
                />
              </a>
              <p className="hidden lg:block">+91-9136036603</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-10">
              <a href="mailto:sales@603thecoworkingspace.com">
                <IoIosMail
                  size={20}
                  className="cursor-pointer hover:text-red-500"
                />
              </a>
              <p className="hidden lg:block">sales@603thecoworkingspace.com</p>
            </div>
          </div>
          <div
            className="lg:hidden
           capitalize"
          >
            <h3 className="font-semibold lg:text-xl">follow us on</h3>
            <div className="flex gap-4 mt-2">
              <a
                href=" https://www.instagram.com/603.interiors/"
                target="_blank"
              >
                <FaInstagram size={24} className="cursor-pointer " />
              </a>
              <a
                href=" https://www.facebook.com/profile.php?id=61561253712041"
                target="_blank"
              >
                <FiFacebook size={24} className="cursor-pointer" />
              </a>
              <RiTwitterXLine size={24} className="cursor-pointer" />
              <FiLinkedin size={24} className="cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-12 xl:gap-36 lg:pl-5 xl:pl-0">
          <div className="flex gap-24 capitalize text-xs lg:text-sm">
            <ul className="flex flex-col gap-3 font-thin ">
              <li className=" font-bold">company</li>
              <li className="cursor-pointer" onClick={scrollToTop}>
                home
              </li>
              <li
                className="cursor-pointer"
                onClick={() => navigate("/Aboutus")}
              >
                about us
              </li>
              <li
                className="cursor-pointer"
                onClick={() => navigate("/OurServices")}
              >
                services
              </li>
              <li
                className="cursor-pointer"
                onClick={() => navigate("/Career")}
              >
                career
              </li>
            </ul>
            <ul className="font-thin flex flex-col gap-3">
              <li className="font-bold">resources</li>
              <li
                className="cursor-pointer"
                onClick={() => navigate("/Contactus")}
              >
                contact us
              </li>
              <li
                onClick={() => navigate("/help")}
                className="hidden xl:block cursor-pointer"
              >
                help & FAQ's
              </li>
              <li
                onClick={() => navigate("/help")}
                className="xl:hidden cursor-pointer"
              >
                FAQ's
              </li>
              <li
                onClick={() => navigate("/termsNcondition")}
                className="hidden xl:block cursor-pointer"
              >
                terms & conditions
              </li>
              <li
                onClick={() => navigate("/termsNcondition")}
                className="xl:hidden cursor-pointer"
              >
                terms
              </li>
              <li
                onClick={() => navigate("/privacy-policy")}
                className=" cursor-pointer"
              >
                Privacy Policy
              </li>
              <li className="cursor-pointer" onClick={() => navigate("/Blog")}>
                blog
              </li>
            </ul>
          </div>
          <div className="capitalize hidden lg:block ">
            <h3 className="font-semibold text-xl">follow us on</h3>
            <div className="flex gap-4 mt-2">
              <a
                href=" https://www.instagram.com/603.interiors/"
                target="_blank"
              >
                <FaInstagram size={24} className="cursor-pointer" />
              </a>
              <a
                href=" https://www.facebook.com/profile.php?id=61561253712041"
                target="_blank"
              >
                <FiFacebook size={24} className="cursor-pointer" />
              </a>
              <RiTwitterXLine size={24} className="cursor-pointer" />
              <FiLinkedin size={24} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="md:container md:mx-auto  flex flex-col md:flex-row items-start gap-5 lg:gap-0 md:justify-between md:items-center text-sm">
        <div
          onClick={() => navigate("/howtosell")}
          className="flex justify-center items-center gap-3 cursor-pointer"
        >
          <BsShop size={16} />
          <h4 className="font-semibold">How to sell</h4>
        </div>
        <p className=" text-xs">
          &copy; 2019-2025 . Workved Interiors | All Rights Reserved
        </p>
        <div
          className=" rounded-full bg-[#FFD074] cursor-pointer "
          onClick={scrollToTop}
        >
          <FaAngleUp className="w-30 h-30 m-3" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
