import { FaInstagram } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
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
    <footer className="relative bg-[url('../images/bg/footer-bg.png')] bg-cover bg-center bg-no-repeat w-full font-TimesNewRoman py-5">
      <div className="relative px-4 lg:container xl:max-w-7xl xl:px-0 mx-auto pt-5">
        <div className="lg:flex justify-stretch w-full mb-4 lg:mb-10">
          <div className="flex-1 mb-2 lg:mb-0">
            <p className="text-2xl font-bold font-TimesNewRoman tracking-[0.3px] text-[#fff]">
              Get more insights delivered <br /> straight to your inbox
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
              className="border-y-[1px] border-l-[1px] border-[#777777] w-full py-3.5 bg-transparent px-2 focus:outline-none focus:ring-0 text-[#fff]"
              name="subscribe-email"
            />
            <button className="capitalize bg-[#EBEFF9] text-[#000000] text-nowrap py-3.5 border-y-[1px] border-r-[1px] border-[#777777] font-bold px-2 lg:px-4 hover:bg-[#EBEFF9]/80">
              subscribe now
            </button>
          </form>
        </div>
        {/* <div className="lg:border-t lg:border-b flex flex-col-reverse lg:flex-row gap-5 xl:gap-20 justify-evenly"> */}
        <div className="lg:border-t lg:border-b grid grid-cols-1 lg:grid-cols-3 xl:gap-20">
          {/* logo */}
          <div className="lg:py-5 hidden lg:flex items-start lg:border-r ml-2 mt-2">
            <img
              src="/logo/logo-new.png"
              // src="/logo/workved-logo.png"
              alt="company logo"
              className="max-w-48 xl:max-w-xs"
            />
          </div>
          {/* content */}
          {/* <div className="lg:flex flex-1 justify-around lg:border-l"> */}
          <div className="lg:border-r lg:px-2 xl:px-0">
            <div className="flex gap-16 capitalize text-[15px] text-[#fff] py-5">
              <div className="flex justify-center items-start  flex-1 border-t border-b lg:border-none py-5 lg:py-0">
                <ul className="flex flex-col gap-4 flex-1 tracking-wide list-none m-0 p-0">
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => {
                      navigate("/");
                      scrollToTop();
                    }}
                  >
                    home
                  </li>
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => navigate("/Aboutus")}
                  >
                    about us
                  </li>
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => navigate("/OurServices")}
                  >
                    services
                  </li>
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => navigate("/Career")}
                  >
                    career
                  </li>
                  <li
                    onClick={() => navigate("/brands")}
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    brands
                  </li>
                </ul>
                <ul className="flex flex-col gap-4 flex-1 tracking-wide list-none m-0 p-0">
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => navigate("/Contactus")}
                  >
                    contact us
                  </li>
                  <li
                    onClick={() => navigate("/help")}
                    className="hidden xl:block relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
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
                    className="hidden xl:block relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
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
                    className=" relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    Privacy Policy
                  </li>
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => navigate("/Blog")}
                  >
                    blog
                  </li>
                  <li
                    className="relative cursor-pointer w-fit after:content-[''] after:block after:h-[1px] after:bg-white after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    onClick={() => navigate("/products")}
                  >
                    shop products
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-[#fff] flex-1 py-5 space-y-5 lg:px-2 xl:px-0">
            <h3 className="font-bold text-xl tracking-wide">Contact</h3>
            <div className="text-[15px] tracking-wide space-y-4">
              <div className="flex gap-5 items-center">
                <a
                  href="tel:+919136036603"
                  className="border border-[#fff]/40 hover:bg-[#fff]/10 h-9 w-9 flex justify-center items-center"
                >
                  <FaPhone size={15} className="cursor-pointer" />
                </a>
                <div>
                  <p className="font-bold">Phone Number</p>
                  <p className="text-[#fff]/65">+91-9136036603</p>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <a
                  href="mailto:partners@workved.com"
                  className="border border-[#fff]/40 hover:bg-[#fff]/10  h-9 w-9 flex justify-center items-center"
                >
                  <MdEmail size={15} className="cursor-pointer" />
                </a>
                <div>
                  <p className="font-bold">Email Address</p>
                  <p className="text-[#fff]/65">partners@workved.com</p>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Makhija+Arcade,+35th+Rd,+Khar+West,+Mumbai+Maharashtra+400052"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#fff]/40 hover:bg-[#fff]/10  h-9 w-9 flex justify-center items-center"
                >
                  <MdLocationOn size={15} className="cursor-pointer" />
                </a>
                <div className="flex-1">
                  <p className="font-bold">Location</p>
                  <p className="text-[#fff]/65 text-wrap">
                    603, Makhija Arcade, Khar West, Mumbai 400052
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="py-3 lg:hidden flex justify-center items-start lg:border-r">
            <img
              src="/logo/workved-logo.png"
              alt="company logo"
              className="max-w-48 xl:max-w-56"
            />
          </div>
          {/* </div> */}
        </div>
        <div className="lg:flex justify-between items-center text-[#fff] pt-4">
          <p className=" text-xs">
            &copy; 2019-{currentYear} . Workved Interiors | All Rights Reserved
          </p>

          <div className="flex gap-4 mt-2 lg:mt-0">
            <a
              href=" https://www.instagram.com/603.interiors/"
              target="_blank"
              className="cursor-pointer flex justify-center items-center w-9 h-9 border border-[#fff]/40 hover:bg-[#fff]/40 p-0.5"
            >
              <FaInstagram size={15} />
            </a>
            <a
              href=" https://www.facebook.com/profile.php?id=61561253712041"
              target="_blank"
              className="cursor-pointer flex justify-center items-center w-9 h-9 border border-[#fff]/40 hover:bg-[#fff]/40 p-0.5"
            >
              <FiFacebook size={15} />
            </a>
            <span
              // href="#"
              className="cursor-pointer flex justify-center items-center w-9 h-9 border border-[#fff]/40 hover:bg-[#fff]/40 p-0.5"
            >
              <RiTwitterXLine size={15} />
            </span>
            <span
              // href="#"
              className="cursor-pointer flex justify-center items-center w-9 h-9 border border-[#fff]/40 hover:bg-[#fff]/40 p-0.5"
            >
              <FiLinkedin size={15} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
