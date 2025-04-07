import React from "react";
import { IoMdClose } from "react-icons/io";
import { LuClock } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { useApp } from "../../Context/Context";

function AppointmentConfirmation({ onClose, time }) {
  const { accountHolder } = useApp();

  console.log("time confirmation", time);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="max-w-sm md:max-w-2xl bg-white rounded-3xl border-2 p-7 font-Poppins relative">
        <div className="absolute right-5 top-5">
          <IoMdClose onClick={onClose} size={20} className="cursor-pointer" />
        </div>
        <div className="flex justify-center items-center">
          <img
            src="/images/appointment-confirm.png"
            alt="confirmation display"
          />
        </div>
        <div className="my-7 flex flex-col gap-4">
          <h1 className=" md:text-lg text-center font-bold">
            ✨ Thank you! Your appointment is confirmed. ✨
          </h1>
          <div className="flex items-center gap-4 px-3 py-2 border-2 border-[#0BA1A1] rounded-3xl">
            <span className="bg-[#D6FFFF] px-3 py-1.5 rounded-3xl text-xs">
              Email sent
            </span>
            <p className="text-xs">
              Check your inbox with an email with all details!
            </p>
          </div>
        </div>
        <div className="border-2 rounded-2xl p-5">
          <div className="flex justify-between items-center border-b-2 py-2">
            <h3 className="text-sm font-semibold">
              {accountHolder.companyName}
            </h3>
            <img
              src={accountHolder.profileImage}
              alt=""
              className="h-10 w-10"
            />
          </div>
          <div className="flex flex-col gap py-5">
            <div className="flex gap-3 items-center border-b-2 py-1">
              {/* <img
                src="/images/icons/time-icon.png"
                alt=""
                className="h-10 w-10"
              /> */}
              <LuClock size={25} color="gray" />
              <h4 className="font-semibold text-xs">Time</h4>
              <p className="text-xs text-[#757575]">{time}</p>
            </div>
            <div className="flex gap-3 items-center border-b-2 py-1">
              {/* <img
                src="/images/icons/email-icon.png"
                alt=""
                className="h-10 w-10"
              /> */}
              <MdOutlineEmail size={25} color="gray" />
              <h4 className="font-semibold text-xs">Email</h4>
              <p className="text-xs text-[#757575]">{accountHolder.email}</p>
            </div>
            <div className="flex gap-3 items-center py-1">
              {/* <img
                src="/images/icons/details-icon.png"
                alt=""
                className="h-10 w-10"
              /> */}
              <HiMenuAlt2 size={25} color="gray" />
              <h4 className="font-semibold text-xs">Details</h4>
              <p className="text-xs text-[#757575]">
                We’ve sent a email with your booking details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentConfirmation;
