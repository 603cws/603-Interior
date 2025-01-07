import { CiCalculator1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";

function Navbar() {
    const progress = 70;

    return (
        <div>
            <div className="flex justify-around bg-gradient-to-r from-[#1A3A36] to-[#48A095] items-center">
                {/* logo */}
                <div className="">
                    <img src='/logo/logo.png' alt="603 logo" className="h-12 w-20 " />
                </div>
                {/* button for generate boq */}
                <div className="pl-60">
                    <button className="bg-[#FFF] rounded-xl text-sm py-2 px-5 text-black font-bold border-solid border-2 border-black">
                        Grand Total: ₹4000
                    </button>
                </div>
            </div>
            <div className="bg-[#1A3A36] py-5 flex">
                <div className="pl-10">
                    <button className="bg-[#FFF] text-sm py-2 px-5 text-black rounded-full font-bold border-solid border-2 border-black">
                        Go to Layout
                    </button>
                </div>
                <div className="w-full max-w-md mx-auto pl-10">
                    {/* Progress Bar Container */}
                    <div className="relative h-4 bg-[#385682] rounded-full">
                        {/* Filled Progress */}
                        <div
                            className="absolute h-full bg-[#34BFAD] rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                        {/* Progress Circle */}
                        <div
                            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-[#CCCCCC] border-2 border-white rounded-full"
                            style={{ left: `${progress}%`, width: "16px", height: "16px" }}
                        ></div>
                    </div>
                    {/* Progress Label */}
                    <div className="text-center mt-2 text-[#C7DDFF] font-medium">
                        {progress}% Completed
                    </div>
                </div>
                <div className="pl-42 ">
                    <button className="bg-[#FFF] text-sm py-2 px-5 text-black rounded-full font-bold border-solid border-2 border-black">
                        Save BOQ
                    </button>
                </div>
                <div className="px-4 justify-items-end">
                    <button className="bg-[#FFF] text-sm py-2 px-5 text-black rounded-full font-bold border-solid border-2 border-black">
                        View BOQ
                    </button>
                </div>
                <div className="pl-4">
                    <button className="bg-[#1A3A36] text-sm py-2 px-5 text-white rounded-full font-bold border-solid border-2 border-[#34BFAD]">
                        Download
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Navbar
