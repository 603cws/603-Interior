import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactUsPopup from "../pages/ContactUsPopup";
import { FiMenu, FiX } from "react-icons/fi";
import { useApp } from "../Context/Context";
import { motion } from "framer-motion";

function LandingNavbar() {
  const pathname = window.location.pathname;

  const [enquiry, setEnquiry] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, accountHolder } = useApp();
  console.log(accountHolder, isAuthenticated);

  const navigate = useNavigate();
  return (
    <div className="bg-[#334A78] py-2 relative">
      {/* desktop navbar */}
      <div className="hidden container lg:flex justify-between items-center font-TimesNewRoman">
        <div>
          <ul className="flex gap-5 [&_li]:cursor-pointer uppercase text-xs xl:text-sm font-bold text-[#fff] tracking-wider">
            {/* <li>shop</li> */}
            <li
              onClick={() => navigate("/aboutUs")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                pathname === "/aboutUs" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              about us
            </li>
            <li
              onClick={() => navigate("/OurServices")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                pathname === "/OurServices" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              our services
            </li>
            <li
              onClick={() => navigate("/Contactus")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                pathname === "/Contactus" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              contact us
            </li>
          </ul>
        </div>
        <div onClick={() => navigate("/")}>
          <img
            src="/logo/workved-logo.png"
            alt=""
            className="h-[60px] w-[140px] cursor-pointer"
          />
        </div>
        <div className="flex gap-10 uppercase text-xs xl:text-sm font-bold text-[#fff]">
          <div
            onClick={() => navigate("/layout")}
            className="flex flex-col justify-center items-center gap-2 cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:w-0 after:transition-all after:duration-300
           hover:after:w-full"
          >
            <img
              src="/images/icons/calculator-white.png"
              alt=""
              className="h-8 w-8"
            />
            <p>space calculator</p>
          </div>
          <div
            onClick={() => setEnquiry(true)}
            className="flex flex-col justify-center items-center gap-2 cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:w-0 after:transition-all after:duration-300 hover:after:w-full"
          >
            <img
              src="/images/icons/enquiry-white.png"
              alt=""
              className="h-8 w-8"
            />
            <p>enquiry</p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
            {isAuthenticated ? (
              <button
                className="z-30 rounded-full"
                onClick={() => navigate("/dashboard")}
                style={{
                  backgroundImage:
                    "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
                }}
              >
                <img
                  src={accountHolder.profileImage}
                  alt="usericon"
                  className="w-8 md:w-12 h-8 p-1 md:h-12 cursor-pointer rounded-full"
                />
              </button>
            ) : (
              <div onClick={() => navigate("/Login")}>
                <img
                  src="/images/icons/sign-in-white.png"
                  alt=""
                  className="h-8 w-8"
                />
                <p>log in</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile navbar */}
      <div className="flex lg:hidden justify-between items-center px-2">
        <div onClick={() => navigate("/")}>
          <img
            src="/logo/workved-logo.png"
            alt=""
            className="h-10 cursor-pointer"
          />
        </div>
        <div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <FiX className="size-7 text-[#fff]" />
            ) : (
              <FiMenu className="size-7 text-[#fff]" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{
              scaleY: isMobileMenuOpen ? 1 : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            style={{
              transformOrigin: "top",
              overflow: "hidden",
              pointerEvents: isMobileMenuOpen ? "auto" : "none",
            }}
            className="bg-white w-full absolute top-full left-0 px-2 py-3 overflow-hidden z-10"
          >
            <ul className="text-sm font-bold text-[#334A78] uppercase space-y-5">
              <li onClick={() => navigate("/aboutUs")}>about us</li>
              <li onClick={() => navigate("/OurServices")}>our services</li>
              <li onClick={() => navigate("/ContactUs")}>contact us</li>
              <li onClick={() => navigate("/layout")} className="flex gap-2">
                <img
                  src="/images/icons/calculator.png"
                  alt=""
                  className="h-5 w-5"
                />{" "}
                <span>space calculator</span>
              </li>
              <li onClick={() => setEnquiry(true)} className="flex gap-2">
                <img
                  src="/images/icons/enquiry.png"
                  alt=""
                  className="h-5 w-5"
                />{" "}
                <span>enquiry</span>
              </li>
              <li className="flex gap-2">
                {isAuthenticated ? (
                  <button
                    className="px-6 py-1.5  bg-[#1F3B5C] border border-[#1F3B5C] rounded-3xl text-white w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                ) : (
                  <div onClick={() => navigate("/login")}>
                    <img
                      src="/images/icons/sign-in.png"
                      alt=""
                      className="h-5 w-5"
                    />{" "}
                    <span>log in</span>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </div>
      {enquiry && <ContactUsPopup onClose={() => setEnquiry(false)} />}
    </div>
  );
}

export default LandingNavbar;
