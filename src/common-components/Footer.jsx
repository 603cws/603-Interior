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
import { getDateInfo } from "../utils/dateUtils";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";

function Footer() {
  const [email, setEmail] = useState("");
  // const [error, setError] = useState("");
  const { currentYear } = getDateInfo();

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

    const { error } = await supabase
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
    <footer className="relative bg-[url('/images/bg/footer-bg.png')] bg-cover bg-center bg-no-repeat w-full font-TimesNewRoman py-5">
      <div className="relative px-4 lg:container">
        <div className="lg:flex justify-stretch w-full mb-10">
          <div className="flex-1 space-y-2">
            <p className="text-lg font-bold tracking-wide text-[#fff]">
              Get more insights deliverd <br /> straight to your inbox
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex-1 flex justify-center items-center"
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
        <div className="lg:border-t lg:border-b flex flex-col-reverse lg:flex-row gap-5 lg:gap-20 justify-evenly">
          {/* logo */}
          <div className="py-5 flex justify-center items-center">
            <img src="/logo/workved-logo.png" alt="" className="max-w-xs" />
          </div>
          {/* content */}
          <div className="lg:flex flex-1 justify-around lg:border-l">
            <div className="flex gap-24 capitalize text-xs lg:text-base text-[#fff] lg:border-r flex-1">
              <div className="flex justify-center items-center flex-1 border-t border-b lg:border-none py-5 lg:py-0 lg:px-14">
                <ul className="flex flex-col gap-3 font-thin flex-1">
                  <li
                    className="cursor-pointer"
                    onClick={() => {
                      navigate("/");
                      scrollToTop();
                    }}
                  >
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
                  <li
                    onClick={() => navigate("/brands")}
                    className="cursor-pointer"
                  >
                    brands
                  </li>
                </ul>
                <ul className="font-thin flex flex-col gap-3 flex-1">
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
                  <li
                    className="cursor-pointer"
                    onClick={() => navigate("/Blog")}
                  >
                    blog
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-[#fff] flex-1 lg:px-14 py-5">
              <h3 className="font-bold text-xl tracking-wide ">Contact</h3>
              <div className="text-base">
                <div className="flex gap-5 items-center">
                  <a
                    href="tel:+919136036603"
                    className="border h-7 w-7 flex justify-center items-center"
                  >
                    <FaPhone size={15} className="cursor-pointer" />
                  </a>
                  <div>
                    <p>Phone Number</p>
                    <p className="">+91-9136036603</p>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <a
                    href="mailto:sales@603thecoworkingspace.com"
                    className="border h-7 w-7 flex justify-center items-center"
                  >
                    <MdEmail size={15} className="cursor-pointer" />
                  </a>
                  <div>
                    <p>Email Address</p>
                    <p className="">sales@603thecoworkingspace.com</p>
                  </div>
                </div>
                <div className="flex gap-5 items-center">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Makhija+Arcade,+35th+Rd,+Khar+West,+Mumbai+Maharashtra+400052"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border h-7 w-7 flex justify-center items-center"
                  >
                    <MdLocationOn size={15} className="cursor-pointer" />
                  </a>
                  <div>
                    <p>Location</p>
                    <p className="">
                      Makhija Arcade, 35th Rd, Khar West, <br />
                      Mumbai Maharashtra 400052
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:flex justify-between text-[#fff] pt-4">
          <p className=" text-xs">
            &copy; 2019-{currentYear} . Workved Interiors | All Rights Reserved
          </p>

          <div className="flex gap-4 mt-2 lg:mt-0">
            <a href=" https://www.instagram.com/603.interiors/" target="_blank">
              <FaInstagram
                size={15}
                className="cursor-pointer flex justify-center items-center w-7 h-7 border p-1"
              />
            </a>
            <a
              href=" https://www.facebook.com/profile.php?id=61561253712041"
              target="_blank"
            >
              <FiFacebook
                size={15}
                className="cursor-pointer flex justify-center items-center w-7 h-7 border p-1"
              />
            </a>
            <RiTwitterXLine
              size={15}
              className="cursor-pointer flex justify-center items-center w-7 h-7 border p-1"
            />
            <FiLinkedin
              size={15}
              className="cursor-pointer flex justify-center items-center w-7 h-7 border p-1"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
