import { IoCallOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import { IoIosMail } from "react-icons/io";
import {
  FaArrowRight,
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaAngleUp,
} from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling
    });
  };

  const navigation = useNavigate();
  return (
    <footer className="bg-[#1F5C54]  ">
      {/* container div */}
      <div className="container mx-auto">
        {/* container will contain two part one for all the logo and all ,second for copy right and top scroll */}
        <div className="text-white lg:flex lg:gap-10  items-center gap-10 justify-around pt-5 mb-3">
          {/* 3div */}
          <div className="text-white font-lexend ">
            <img
              src="/logo/logo.png"
              alt="logo for footer"
              width={80}
              height={80}
            />
            <p className="font-semibold pt-2">Head office :</p>
            <p className="font-semibold">603 The Interiors</p>
            <div className="flex flex-col font-extralight gap-2 mt-1 text-md">
              <div className="flex gap-4 items-center">
                <CiLocationOn size={22} />
                <p className="font-thin">
                  Makhija Arcade, 35th Rd, Khar West, <br /> Mumbai Maharashtra
                  400052
                </p>
              </div>
              <div className="flex gap-4 items-center font-extralight">
                <IoCallOutline size={22} />
                <p>+91-9136036603</p>
              </div>
              <div className="flex gap-4 items-center font-extralight">
                <IoIosMail size={22} />
                <p>603coworkingspace@gmail.com</p>
              </div>
            </div>
          </div>
          {/* second div */}
          <div className="">
            <h2 className="font-lexend font-semibold text-xl my-3">
              Quicklinks
            </h2>
            <div className="flex gap-5">
              <ul className="font-Poppins flex flex-col gap-1 font-extralight text-md ">
                <li onClick={() => navigation("/")} className="cursor-pointer">
                  Home
                </li>
                {/* <li className="cursor-pointer">Company</li>
                <li className="cursor-pointer">Brand</li>
                <li className="cursor-pointer">Products</li> */}
                <li
                  className="cursor-pointer"
                  onClick={() => navigation("/help")}
                >
                  Help & FAQ
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => navigation("/termsNcondtion")}
                >
                  Terms N Condition
                </li>

                <li
                  className="cursor-pointer"
                  onClick={() => navigation("/becomeseller")}
                >
                  Become a reseller
                </li>
              </ul>
              <ul className="font-Poppins flex flex-col gap-1 font-extralight text-md">
                <li
                  onClick={() => navigation("/Contactus")}
                  className="cursor-pointer"
                >
                  Contact Us
                </li>
                <li
                  className="cursor-pointer"
                  onClick={() => navigation("/Career")}
                >
                  Career
                </li>
                <li
                  onClick={() => navigation("/Blog")}
                  className="cursor-pointer"
                >
                  Blogs
                </li>
              </ul>
            </div>
          </div>
          {/* third div */}
          <div className="captialize font-Poppins">
            <p className="my-3 text-xl font-semibold">Subscribe</p>
            <div className="font-extralight text-md">
              <p>
                Sign up for Alerts, Special Offers, Education <br /> and
                Updates.
              </p>
              <div className="flex items-center bg-[#34BFAD] mt-2">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full text-black p-2 focus:outline-none"
                />
                <button>
                  <FaArrowRight color="white" className="mx-3" />
                </button>
              </div>

              <div className="mt-2">
                <p>Follow us on</p>
                <ul className="flex items-center gap-3 mt-2">
                  <li>
                    <FaLinkedin size={26} />
                  </li>
                  <li>
                    <FaFacebookSquare size={26} />
                  </li>
                  <li>
                    <FaInstagram size={26} />
                  </li>
                  <li>
                    <RiTwitterXLine size={26} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* copyright part */}
        <div className="text-white flex justify-around items-center pb-3 pt-5">
          <p className="w-3/4 text-center text-base font-thin">
            © 2024 . All Rights Reserved | Crafted by 603 Interiors
          </p>
          <div
            className=" rounded-full bg-[#34BFAD] cursor-pointer"
            onClick={scrollToTop}
          >
            <FaAngleUp className="w-30 h-30 m-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
