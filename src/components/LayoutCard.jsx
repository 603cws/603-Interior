import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

// import { AiOutlineMedium } from "react-icons/ai";



function LayoutCard() {
    return (
        <div className="flex flex-col w-[280px] items-center border border-solid bg-[#fff] p-18 ">
            {/* img */}
            <div className="bg-red-400">
                <img src='/logo/logo.png' alt="sample" className=" object-cover" />
            </div>
            {/* another div for  */}
            <div className="flex flex-col  mt-2 ">
                {/* inc/dec counter */}
                <div className="flex justify-around mt-2 gap-4">
                    {/* btn for dec */}
                    <button>
                       <CiCircleMinus size={30}/>
                    </button>
                    {/* display no */}
                    <div className="w-[20px] border-2 rounded-xl px-8 text-center">1</div>
                    {/* inc btn */}
                    <button>
                        <CiCirclePlus size={30} />
                    </button>
                </div>
                {/* m/l/xl */}
                <div className=" flex gap-2 text-sm bold mt-4 mb-4 justify-around ">
                    <button className="border-2 rounded-full border-[#000] p-1">M</button>
                    <button className="border-2 rounded-full border-[#000] p-1">L</button>
                    <button className="border-2 rounded-full border-[#000] p-1">XL</button>
                </div>

                {/* text */}
                
                <p className="text-center text-sm">Desk size: 3.5 x 2</p>
                <p className="text-center font-bold text-sm">Liner Workstation</p>
            </div>
        </div>
    )
}

export default LayoutCard
