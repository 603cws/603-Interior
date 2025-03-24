import { IoIosMail } from "react-icons/io";
import { FaInstagram, FaAngleUp } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FiFacebook, FiLinkedin } from "react-icons/fi";
import { BsShop } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { PiPhoneCallFill } from "react-icons/pi";

import { useNavigate } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling
    });
  };

  const navigate = useNavigate();
  return (
    <footer className=" bg-[#1F5C54] text-white font-Poppins px-10 xl:px-40 pt-12 pb-5">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-10 mb-20">
        <div className="lg:border-r-2 border-[#34BFAD] capitalize pr-10 xl:pr-28 hidden lg:flex flex-col gap-5 text-sm">
          <div>
            <h3 className="font-semibold">registered office address</h3>
            <h3 className="font-semibold">workved interiors</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-10">
              <FaLocationDot size={20} />
              <p className="font-thin">
                Makhija Arcade, 35th Rd, Khar West, <br />
                Mumbai Maharashtra 400052
              </p>
            </div>
            <div className="flex items-center gap-10">
              <PiPhoneCallFill size={20} />
              <p>+91-9136036603</p>
            </div>
            <div className="flex items-center gap-10">
              <IoIosMail size={20} />
              <p>603coworkingspace@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-12 xl:gap-36 pl-5 xl:pl-0">
          <div className="flex gap-24 capitalize text-sm">
            <ul className="flex flex-col gap-3 font-thin">
              <li className="font-bold">company</li>
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
                onClick={() => navigate("/termsNcondtion")}
                className="hidden xl:block cursor-pointer"
              >
                terms & conditions
              </li>
              <li
                onClick={() => navigate("/termsNcondtion")}
                className="xl:hidden cursor-pointer"
              >
                terms
              </li>
              <li className="cursor-pointer" onClick={() => navigate("/Blog")}>
                blog
              </li>
            </ul>
          </div>
          <div className="capitalize">
            <h3 className="font-semibold text-xl">follow us on</h3>
            <div className="flex gap-4 mt-2">
              <FaInstagram size={24} className="cursor-pointer" />
              <FiFacebook size={24} className="cursor-pointer" />
              <RiTwitterXLine size={24} className="cursor-pointer" />
              <FiLinkedin size={24} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div
          onClick={() => navigate("/howtosell")}
          className="flex justify-center items-center gap-3 cursor-pointer"
        >
          <BsShop size={16} />
          <h4 className="font-semibold">Become a reseller</h4>
        </div>
        <p>&copy; 2019-2025 . Workved Interiors | All Rights Reserved</p>
        <div
          className=" rounded-full bg-[#34BFAD] cursor-pointer"
          onClick={scrollToTop}
        >
          <FaAngleUp className="w-30 h-30 m-3" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
