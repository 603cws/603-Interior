import React from "react";
import { IoCloseOutline } from "react-icons/io5";

function CheckPinCode({ onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-[#000]/20">
        <div className="max-w-screen-sm w-full bg-[#fff] fixed bottom-0 font-Poppins py-2">
          <div className="flex justify-between py-2 px-4">
            <h3 className="text-[10px] text-[#111111] font-medium uppercase">
              Enter Address detail
            </h3>
            <button onClick={onClose}>
              <IoCloseOutline color="#334A78" />
            </button>
          </div>
          <div className="h-1 w-full bg-[#000000]/20 my-1" />
          <div className="flex justify-between border border-[#cccccc] my-2 mx-4">
            <input
              type="number"
              name=""
              id=""
              placeholder="Enter pin code"
              className="border-r-2 w-3/4 p-2 text-[8px]"
            />
            <button className="uppercase text-[#304778] text-[8px] w-1/4">
              check
            </button>
          </div>
          <div className="h-1 w-full bg-[#000000]/20 my-1" />
          <h3 className="uppercase text-[10px] text-[#111111] font-medium px-4">
            Saved address
          </h3>
          <div className="h-1 w-full bg-[#000000]/20 my-1" />
          <div className="px-4">
            <div className="flex gap-1 my-2">
              <input type="radio" name="" id="" />
              <p className="capitalize text-[#000000] text-[10px] font-medium">
                Name
              </p>
            </div>
            <p className="text-[8px] text-[#000000]/60">
              Makhija Arcade, 35th Rd, Khar, Khar West, Mumbai,
              <br /> Maharashtra 400052
            </p>
            <div className="flex capitalize text-[10px]">
              <p className=" text-[#000000]/60 ">mobile</p>
              <p className="text-[#000000]">9876543210</p>
            </div>
            <div className="flex gap-3 [&_button]:capitalize [&_button]:border [&_button]:rounded-sm [&_button]:px-5 [&_button]:py-2 text-[10px] my-2">
              {/* <button>remove</button> */}
              <button>edit</button>
            </div>
          </div>
          <div className="h-1 w-full bg-[#000000]/20 my-1" />
          {/* <div className="px-4 my-1">
            <button className="uppercase text-[#334A78] border border-[#334A78] w-full text-[10px] font-semibold py-2">
              add new address
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default CheckPinCode;
