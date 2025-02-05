import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
function LandingNavbar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="px-5 pt-3 absolute top-0 w-full z-10">
      {/* Navbar Container */}
      <div className="bg-white bg-opacity-[0.72] flex justify-between items-center border rounded-full px-5 py-1.5">
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo/logo.png" alt="Logo" className="h-12 w-20" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden xl:flex">
          <ul className="flex gap-8 text-[#1A3A36] font-semibold uppercase">
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
              Our Services
            </li>
            <li onClick={() => navigate("/Blog")} className="cursor-pointer">
              Our Blog
            </li>
            <li
              onClick={() => navigate("/Contactus")}
              className="cursor-pointer"
            >
              Contact Us
            </li>
          </ul>
        </div>

        {/* Login Button (Desktop) */}
        <div className="hidden xl:block">
          <button
            onClick={() => navigate("/Login")}
            className="px-6 py-1.5 bg-[#1F5C54] border border-[#15423C] rounded-3xl text-white"
          >
            Log In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="xl:hidden flex items-center">
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
        <div className="xl:hidden bg-white border mt-2 rounded-3xl p-5 transition-transform ease-in-out duration-500 ">
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
              Our Services
            </li>
            <li onClick={() => navigate("/Blog")} className="cursor-pointer">
              Our Blog
            </li>
            <li
              onClick={() => navigate("/Contactus")}
              className="cursor-pointer"
            >
              Contact Us
            </li>
            <li>
              <button
                onClick={() => navigate("/Login")}
                className="px-6 py-1.5 bg-[#1F5C54] border border-[#15423C] rounded-3xl text-white w-full"
              >
                Log In
              </button>
            </li>
          </ul>

          {/* Login Button (Mobile) */}
          {/* <div className="mt-4 text-center">
           
          </div> */}
        </div>
      )}
    </div>
  );
}

export default LandingNavbar;
