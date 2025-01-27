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
        <div className="text-white flex  items-center gap-10 justify-around pt-5 mb-3">
          {/* 3div */}
          <div className="text-white font-lexend ">
            <img
              src="/logo/logo.png"
              alt="logo for footer"
              width={80}
              height={80}
            />
            <p className="font-semibold">Head office :</p>
            <p className="font-semibold">603 The Interiors</p>
            <div className="flex flex-col font-light gap-2 mt-1">
              <div className="flex gap-4 items-center">
                <CiLocationOn />
                <p>
                  Makhija Arcade, 35th Rd, Khar West, <br /> Mumbai Maharashtra
                  400052
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <IoCallOutline />
                <p>+91-123-123456</p>
              </div>
              <div className="flex gap-4 items-center">
                <IoIosMail />
                <p>603coworkingspace@gmail.com</p>
              </div>
            </div>
          </div>
          {/* second div */}
          <div className="">
            <h2 className="font-lexend font-medium text-xl my-3">Quicklinks</h2>
            <div className="flex gap-5">
              <ul className="">
                <li onClick={() => navigation("/")} className="cursor-pointer">
                  Home
                </li>
                <li className="cursor-pointer">Company</li>
                <li className="cursor-pointer">Brand</li>
                <li className="cursor-pointer">Products</li>
                <li className="cursor-pointer">Help & FAQ</li>
                <li className="cursor-pointer">Become a reseller</li>
              </ul>
              <ul>
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
                  Carrer
                </li>
                <li className="cursor-pointer">Blogs</li>
              </ul>
            </div>
          </div>
          {/* third div */}
          <div className="captialize font-lexend">
            <p className="my-3 text-xl">Subscribe</p>
            <div className="">
              <p>
                Sign up for Alerts, Special Offers, Education <br /> and
                Updates.
              </p>
              <div className="flex items-center bg-[#34BFAD] mt-2">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full text-black p-2"
                />
                <button>
                  <FaArrowRight color="white" className="mx-3" />
                </button>
              </div>

              <div className="mt-2">
                <p>Follow us on</p>
                <ul className="flex items-center gap-2 mt-2">
                  <li>
                    <FaLinkedin />
                  </li>
                  <li>
                    <FaFacebookSquare />
                  </li>
                  <li>
                    <FaInstagram />
                  </li>
                  <li>
                    <RiTwitterXLine />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* copyright part */}
        <div className="text-white flex items-center justify-center pb-3">
          <p className="w-3/4 text-center">
            © 2024 . All Rights Reserved | Crafted by 603 The Coworking Space
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
