import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useApp } from "../Context/Context";
function LandingNavbar({ bgColor = false }) {
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { setShowProfile, showProfile, isAuthenticated, accountHolder } =
    useApp();

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const bgcolor = bgColor ? "bg-[#ccc]" : "bg-white";
  return (
    <div className="px-5 pt-3 absolute top-0 w-full z-10">
      {/* Navbar Container */}
      <div
        className={`${bgcolor} bg-opacity-[0.72] flex justify-between items-center border rounded-full  px-5 py-1.5 container mx-auto`}
      >
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img
            src="/logo/workved-interior.png"
            alt="Logo"
            className="h-12 w-20"
          />
        </div>
        {/* <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo/logo.png" alt="Logo" className="h-12 w-20" />
        </div> */}

        {/* Desktop Menu */}
        <nav className="hidden lg:flex justify-center items-center py-4">
          <ul className="flex gap-8 text-[#1A293A] font-semibold uppercase stroke-nav [&_li]:cursor-pointer ">
            <li
              onClick={() => navigate("/")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              Home
            </li>
            <li
              onClick={() => navigate("/Aboutus")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/Aboutus" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              About Us
            </li>
            <li
              onClick={() => navigate("/OurServices")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/OurServices" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              Services
            </li>
            <li
              onClick={() => navigate("/Blog")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/Blog" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              Blog
            </li>
            <li
              onClick={() => navigate("/becomeseller")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/becomeseller" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              Our Work
            </li>
            <li
              onClick={() => navigate("/Contactus")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/Contactus" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              Contact Us
            </li>
            <li
              onClick={() => navigate("/brands")}
              className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-[#1A3A36] after:transition-all after:duration-300 ${
                pathname === "/brands" ? "after:w-full" : "after:w-0"
              } hover:after:w-full`}
            >
              Brands
            </li>
          </ul>
        </nav>

        {/* Login Button (Desktop) */}
        <div className="hidden lg:block">
          {isAuthenticated ? (
            <button
              className=""
              onClick={() => navigate("/dashboard")}
              // disabled={!isadmin}
            >
              <img
                onClick={toggleProfile}
                src={accountHolder.profileImage}
                alt="usericon"
                className="w-12 h-12 cursor-pointer rounded-full"
              />
            </button>
          ) : (
            <button
              onClick={() => navigate("/Login")}
              className="px-8 py-1.5 bg-[#1F3B5C] border border-[#1F3B5C] rounded-3xl text-white uppercase"
            >
              Log In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <FiX className="size-7 text-[#1A3A36]" />
            ) : (
              <FiMenu className="size-7 text-[#1A3A36]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`xl:hidden bg-white border mt-2 rounded-3xl p-5 transition-transform ease-in-out duration-500 transform animate-fade-in ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <ul className="flex flex-col gap-4 text-[#1A3A36] font-semibold uppercase bg-white z-10">
            <li onClick={() => navigate("/")} className="cursor-pointer">
              Home
            </li>
            {/* <li className="cursor-pointer">Spaces</li> */}
            <li onClick={() => navigate("/Aboutus")} className="cursor-pointer">
              About Us
            </li>
            <li
              onClick={() => navigate("/OurServices")}
              className="cursor-pointer"
            >
              Services
            </li>
            <li onClick={() => navigate("/Blog")} className="cursor-pointer">
              Blog
            </li>
            <li
              className="cursor-pointer"
              onClick={() => navigate("/becomeseller")}
            >
              Our Work
            </li>
            <li
              onClick={() => navigate("/Contactus")}
              className="cursor-pointer"
            >
              Contact Us
            </li>
            <li>
              {isAuthenticated ? (
                <button
                  className="px-6 py-1.5 bg-[#1F5C54] border border-[#15423C] rounded-3xl text-white w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate("/Login")}
                  className="px-6 py-1.5 bg-[#1F3B5C] border border-[#1F3B5C] rounded-3xl text-white w-full uppercase"
                >
                  Log In
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default LandingNavbar;
