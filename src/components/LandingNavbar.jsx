import { useNavigate } from "react-router-dom";
function LandingNavbar() {
  const navigate = useNavigate();

  return (
    // <div className=" mx-3 mt-3 border rounded-3xl">
    <div className="px-10 pt-3 ">
      {/* flex box */}
      <div className="bg-[#FFFFFF] bg-opacity-[0.72] flex justify-between items-center border rounded-3xl">
        {/* logo */}
        <div
          className="mx-3 pl-10 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/logo/logo.png" alt="603 logo" className="h-12 w-20 " />
        </div>
        {/* middle section */}
        <div className="">
          <ul className="flex gap-4 text-[#1A3A36] font-semibold">
            <li onClick={() => navigate("/")} className="cursor-pointer">
              Home
            </li>
            <li className="cursor-pointer">Spaces</li>
            <li onClick={() => navigate("/Aboutus")} className="cursor-pointer">
              About Us
            </li>
            <li className="cursor-pointer">Our Services</li>
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

        {/* last button */}
        <div className="mx-4">
          <button className="px-5 py-1 bg-[#1F5C54] border border-[#15423C] rounded-3xl text-white">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingNavbar;
