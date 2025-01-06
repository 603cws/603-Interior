import { CiCalculator1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";

function Navbar() {
    return (
        <div>
            {/* div for in and enlish */}
            {/* <div className=" flex justify-end py-1 items-center text-white bg-[#828C96]"> */}
            <div className=" flex justify-end pr-10 text-sm py-1 items-center text-white bg-gradient-to-r from-[#828C96] to-[#003366]">
                <CiGlobe size={15} color="white"/>
                <span className="text-sm">In | English</span>
            </div>
            {/* navbar */}
            {/* <div className="flex justify-evenly bg-[#003366] py-2 items-center rounded-full mx-2 mt-2"> */}
            <div className="flex justify-evenly bg-gradient-to-r from-[#003366] to-[#828C96]  py-2 items-center rounded-full mx-2 mt-2">
                {/* logo */}
                <div className=" ">
                    <img src='/logo/logo.png' alt="603 logo" className="h-10 w-20" />
                </div>
                {/* sq feet div */}
                <div className="flex justify-between w-1/2 border-2 border-[#FFD43B] items-center px-2 rounded-xl ">
                    {/* cal icon */}
                    <CiCalculator1 size={30} color="#FEBF00" />
                    <MdOutlineCancel size={30} color="#333333"/>
                </div>
                {/* button for generate boq */}
                <div>
                 <button className="bg-[#003366] mt-2 rounded-xl text-sm py-2 px-5 text-white">
                    Generate BOQ
                 </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar
