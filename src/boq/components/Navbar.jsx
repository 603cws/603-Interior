import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import PDFGenerator from "./PDFGenerator";

function Navbar({ clearSelectedData, calculateGrandTotal }) {
  // const progress = 0;

  const { progress, selectedData } = useApp();

  const naviagte = useNavigate();

  const handleGoTOlayout = () => {
    naviagte("/");
  };

  const handlelogo = () => {
    naviagte("/");
  };

  return (
    <div className="navbar sticky top-0 z-20">
      <div className="flex justify-between bg-gradient-to-r from-[#1A3A36] to-[#48A095] items-center px-4">
        {/* logo */}
        <button className="" onClick={handlelogo}>
          <img src="/logo/logo.png" alt="603 logo" className="h-10 w-18 " />
        </button>
        {/* button for generate boq */}
        <div className="pl-60 ">
          <button className="bg-[#FFF] rounded-xl text-xs py-2 px-5 text-black  border-solid border-1 border-black">
            <span className="font-bold">Total</span>: ₹{" "}
            {calculateGrandTotal().toLocaleString("en-IN")}
          </button>
        </div>
      </div>
      <div className="bg-[#1A3A36] py-1 flex px-5">
        <div className=" flex items-center">
          <button
            className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px] border-black"
            onClick={handleGoTOlayout}
          >
            Go to Layout
          </button>
        </div>
        <div className="w-7/12 mx-auto pl-10 py-2.5">
          {/* Progress Bar Container */}
          <div className="relative h-3 bg-[#385682] rounded-full">
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
          <div className="text-center mt-2 text-[#C7DDFF] text-[10px]">
            {progress}% Completed
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <div className=""> */}
          {/* <button
            className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px]border-black"
            onClick={clearSelectedData}
          >
            Save BOQ
          </button> */}
          {/* </div> */}
          {/* <div className="justify-items-end"> */}
          <button
            className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px] border-black"
            onClick={clearSelectedData}
          >
            View BOQ
          </button>
          {/* </div> */}
          <div className="flex items-center">
            <button
              onClick={() => PDFGenerator.generatePDF(selectedData)}
              className="bg-[#1A3A36] text-xs py-2 px-5 text-white rounded-full border-solid border-[1px] border-[#34BFAD]"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
