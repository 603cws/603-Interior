import { FaCheck, FaFilePdf, FaUser } from "react-icons/fa";
import { useRef } from "react";

import { useNavigate } from "react-router-dom";
import {
  cabins,
  categories,
  features,
  openworkspaces,
  stats,
  subcat,
} from "./constants";

export const LandingScreen = () => (
  <div className="flex flex-col h-full bg-white font-TimesNewRoman overflow-hidden">
    <div className="container flex justify-between items-center font-TimesNewRoman text-[#334A78] py-1.5">
      <div>
        <ul className="flex gap-7 [&_li]:cursor-pointer uppercase text-xs font-bold tracking-wider">
          <li>about us</li>
          <li>our services</li>
          <li>contact us</li>
        </ul>
      </div>
      <div>
        <img
          src="/logo/workved-interior.png"
          alt="company logo"
          className="max-w-[100px]"
        />
      </div>
      <div className="flex gap-10 uppercase text-xs font-bold ">
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            src="/images/icons/calculator.png"
            alt="space calculator icon"
            className="h-5 w-5"
          />
          <p>space calculator</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <img
            src="/images/icons/enquiry.png"
            alt="enquiry icon"
            className="h-5 w-5"
          />
          <p>enquiry</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center gap-2">
            <img
              src="/images/icons/sign-in.png"
              alt="sign in icon"
              className="h-5 w-5"
            />
            <p>log in</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 flex items-center px-12 relative">
      <div className="w-1/2 flex flex-col gap-4 relative">
        <div className="relative w-[400px] h-[240px] rounded-sm overflow-hidden border-l-[8px] border-[#334A78] shadow-2xl z-10">
          <img
            src="/images/home/Hero-image-1.webp"
            className="w-full h-full object-cover"
            alt="Office 1"
          />
        </div>
        <div className="relative w-[400px] h-[240px] rounded-sm overflow-hidden ml-12 -mt-16 shadow-2xl z-20">
          <img
            src="/images/home/Hero-image-2.webp"
            className="w-full h-full object-cover"
            alt="Office 2"
          />
        </div>
        <div className="absolute -left-6 top-24 grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-[#334A78] rounded-full"
            ></div>
          ))}
        </div>
      </div>

      <div className="w-1/2 pl-12 flex flex-col items-start z-30">
        <h1 className="text-6xl font-black text-[#334A78] leading-[0.8] tracking-wider mb-8 font-Alegreya">
          PLAN YOUR <br />
          <span className="font-bold text-[#333] tracking-tight">SPACE</span>
        </h1>
        <div className="w-20 h-1 bg-[#334A78] mb-10"></div>
        <p className="text-gray-500 max-w-sm mb-12 leading-relaxed text-base font-medium">
          Transforming ordinary spaces into extraordinary experiences requires
          more than just a sketch. We provide the full roadmap: a stunning
          custom design and a complete Bill of Quantities (BOQ).
        </p>

        <button
          //   id="start-button"
          className="bg-[#334A78] text-white px-12 py-4 rounded-lg font-bold shadow-2xl text-base uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Get Your BOQ (Free)
        </button>
        <br />
        <br />
        <button id="start-button" className="w-full"></button>
      </div>
    </div>
  </div>
);

export const LayoutScreen = () => {
  return (
    <div className="flex flex-col h-full bg-[#f4f7f9] font-TimesNewRoman">
      <div className="bg-[#334A78] p-4 flex justify-between items-center h-20 shrink-0">
        <img src="/logo/logo-new.png" alt="" className="max-w-[100px] h-auto" />
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl bg-[#334A78] border border-yellow-500 rounded-lg py-2 px-6 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-4">
              <i className="fas fa-calculator text-yellow-500 text-lg"></i>
              <span className="text-white font-black text-lg tracking-widest">
                15000
              </span>
            </div>
            <i className="fas fa-times-circle text-white/40 cursor-pointer text-lg"></i>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            id="create-boq-btn"
            className="bg-[#3b5998] text-white px-10 py-2.5 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-xl"
          >
            Create BOQ
          </button>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 border border-white/10">
            <i className="fas fa-user">
              <FaUser />
            </i>
          </div>
        </div>
      </div>

      <div className="flex-1 flex p-6 gap-6 overflow-hidden">
        <div className="w-[55%] bg-white rounded-md shadow-xl border border-gray-100 flex flex-col p-6 overflow-hidden">
          <div className="text-center font-black text-[#334A78] mb-4 text-lg tracking-tight uppercase">
            Area Distribution of Workspaces
          </div>
          <div className="flex-1 grid grid-cols-6 grid-rows-6 gap-0.5 rounded overflow-hidden border-2 border-white">
            <div className="col-span-3 row-span-6 bg-[#002441] flex items-center justify-center p-4 text-center">
              <span className="text-white text-[11px] font-black uppercase leading-[1.2]">
                Linear <br /> Workspace
              </span>
            </div>
            <div className="bg-[#118f95] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                L-Type
              </span>
            </div>
            <div className="bg-[#139ba1] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Interview
              </span>
            </div>
            <div className="bg-[#139ba1] col-span-1 flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Conference
              </span>
            </div>
            <div className="bg-[#334A78] row-span-3 flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                MD Cabin
              </span>
            </div>
            <div className="bg-[#15aab1] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Video
              </span>
            </div>
            <div className="bg-[#15aab1] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Board
              </span>
            </div>
            <div className="bg-[#15aab1] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Meeting
              </span>
            </div>
            <div className="bg-[#334A78] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Manager
              </span>
            </div>
            <div className="bg-[#15aab1] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Reception
              </span>
            </div>
            <div className="bg-[#334A78] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Booth
              </span>
            </div>
            <div className="bg-[#334A78] flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Server
              </span>
            </div>
            <div className="bg-[#15aab1] row-span-2 flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Lounge
              </span>
            </div>
            <div className="bg-[#15aab1] row-span-2 flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Washrooms
              </span>
            </div>
            <div className="bg-[#334A78] row-span-2 flex flex-col items-center justify-center p-1 text-center">
              <span className="text-white text-[7px] font-bold leading-tight">
                Available
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 mt-6 gap-x-4 gap-y-2">
            {stats?.map((stat) => (
              <div
                key={stat}
                className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest"
              >
                <div className="w-2 h-2 rounded-full bg-[#334A78]"></div>
                {stat}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
            <h3 className="font-black text-[#334A78] mb-4 text-[11px] uppercase tracking-widest border-b pb-2">
              Open Workspaces
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {openworkspaces?.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-32 rounded-sm overflow-hidden bg-gray-100 border">
                    <img
                      src={item.img}
                      className="w-full h-full object-contain"
                      alt={item.name}
                    />
                  </div>
                  <div className="text-[9px] font-black text-gray-800 leading-tight uppercase truncate">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 border px-2 py-1 rounded">
                    <button className="text-[11px] font-bold text-gray-400 hover:text-[#334A78]">
                      -
                    </button>
                    <span className="text-[10px] font-black text-[#334A78]">
                      {item.count}
                    </span>
                    <button
                      id={`plus-item-${i}`}
                      className="text-[11px] font-bold text-gray-400 hover:text-[#334A78]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-md p-4 shadow-sm border border-gray-100">
            <h3 className="font-black text-[#334A78] mb-4 text-[11px] uppercase tracking-widest border-b pb-2">
              Cabins
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {cabins?.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-32 rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={item.img}
                      className="w-full h-full object-contain"
                      alt={item.name}
                    />
                  </div>
                  <div className="text-[9px] font-black text-gray-800 leading-tight uppercase truncate">
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 border px-2 py-1 rounded">
                    <button className="text-[11px] font-bold text-gray-400">
                      -
                    </button>
                    <span className="text-[10px] font-black">{item.count}</span>
                    <button className="text-[11px] font-bold text-gray-400">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlanSelectionScreen = () => {
  const exclusiveBtnRef = useRef(null);
  return (
    <div className="flex flex-col h-[300px] bg-white relative font-TimesNewRoman">
      {/* Minimal Header */}
      <div className="bg-[#334A78] p-4 flex justify-between items-center h-14 shrink-0">
        <img src="/logo/logo-new.png" alt="" className="max-w-[100px] h-auto" />

        <div className="flex items-center gap-6">
          <span className="text-white text-xs font-bold">Draft BOQ</span>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#334A78]">
            <i className="fas fa-user text-sm">
              <FaUser />
            </i>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f4f7f9]/30">
        <h2 className="text-3xl font-bold text-[#334A78]/80 mb-8">
          Please Select Your Plan
        </h2>

        <div className="flex items-stretch gap-2 w-full max-w-6xl h-[350px]">
          {/* Plan 01 - Minimal */}
          <div className="flex-none w-24 bg-[#e6efed] rounded-lg flex flex-col items-center py-8 relative">
            <span className="text-3xl font-black text-[#334A78]/30 mb-auto">
              01
            </span>
            <span className="text-2xl font-black text-[#334A78]/40 -rotate-90 origin-center whitespace-nowrap mb-12">
              Minimal
            </span>
          </div>

          {/* Plan 02 - Exclusive (Active) */}
          <div className="flex-1 bg-[#334A78] rounded-lg flex shadow-2xl overflow-hidden relative border border-white/10">
            {/* Vertical Number */}
            <div className="w-20 border-r border-white/10 flex flex-col items-center py-8">
              <span className="text-3xl font-black text-white mb-auto">02</span>
              <span className="text-2xl font-black text-white -rotate-90 origin-center whitespace-nowrap mb-12">
                Exclusive
              </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex p-10 gap-10">
              <div className="flex-1 flex flex-col">
                <h3 className="text-4xl font-bold text-white mb-6">
                  Exclusive
                </h3>
                <ul className="space-y-4 mb-auto">
                  {features?.map((text, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-white/90 text-sm font-medium"
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fas fa-check text-[10px] text-blue-200">
                          <FaCheck />
                        </i>
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
                <button
                  id="get-exclusive-btn"
                  ref={exclusiveBtnRef}
                  className="bg-blue-400/40 text-white border border-white/20 px-8 py-3 rounded-xl font-bold text-sm self-start hover:bg-blue-400/60 transition-colors"
                >
                  Get Exclusive
                </button>
              </div>

              <div className="flex-1 rounded-md overflow-hidden shadow-2xl">
                <img
                  src="/images/plan-exclusive.jpg"
                  className="w-full h-full object-cover"
                  alt="Exclusive Plan Interior"
                />
              </div>
            </div>
          </div>

          {/* Plan 03 - Luxury */}
          <div className="flex-none w-24 bg-[#e6efed] rounded-lg flex flex-col items-center py-8 relative">
            <span className="text-3xl font-black text-[#334A78]/30 mb-auto">
              03
            </span>
            <span className="text-2xl font-black text-[#334A78]/40 -rotate-90 origin-center whitespace-nowrap mb-12">
              Luxury
            </span>
          </div>

          {/* Plan 04 - Custom */}
          <div className="flex-none w-24 bg-[#e6efed] rounded-lg flex flex-col items-center py-8 relative">
            <span className="text-3xl font-black text-[#334A78]/30 mb-auto">
              04
            </span>
            <span className="text-2xl font-black text-[#334A78]/40 -rotate-90 origin-center whitespace-nowrap mb-12">
              Custom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomizationScreen = () => (
  <div className="flex flex-col h-full bg-white font-TimesNewRoman">
    <div className="bg-[#334A78] p-6 flex justify-between items-center shrink-0">
      <div className="flex gap-3">
        <button className="bg-white text-[10px] font-black uppercase px-6 py-2 rounded border tracking-widest text-[#334A78]">
          Go to Layout
        </button>
        <button className="bg-white text-[10px] font-black uppercase px-6 py-2 rounded border tracking-widest text-[#334A78]">
          Layout Details
        </button>
      </div>
      <div className="flex-1 mx-16 relative flex items-center">
        <div className="h-3.5 w-full bg-[#385682] rounded overflow-hidden">
          <div className="h-full w-[70.13%] bg-[#85AED2] rounded-full relative shadow-[0_0_10px_white]"></div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">
            Draft BOQ
          </div>
          <div className="text-white font-black text-sm">
            Total: ₹ 1,61,89,493.5
          </div>
        </div>
        <button
          id="download-final-btn"
          className="bg-[#3b5998] text-white px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl"
        >
          Download
        </button>
      </div>
    </div>

    <div className="flex justify-between px-12 py-6 bg-gray-50 border-b shadow-sm">
      {categories?.map((cat) => (
        <div key={cat.name} className="flex flex-col items-center gap-3 group">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${cat.active ? "bg-[#3b5998] text-white shadow-xl scale-110" : "bg-white text-[#334A78]/20 border-2 border-gray-100"}`}
          >
            <div className="flex items-center justify-center h-10 w-10">
              {typeof cat.icon === "function" ? (
                cat.icon(cat.active ? "#ffffff" : "#374A75")
              ) : (
                <i
                  className={`fas ${cat.icon} ${
                    cat.active ? "text-white" : "text-[#374A78]/40"
                  }`}
                />
              )}
            </div>
          </div>
          <span
            className={`text-[8px] font-black uppercase tracking-[0.2em] ${cat.active ? "text-[#3b5998]" : "text-gray-300"}`}
          >
            {cat?.name}
          </span>
        </div>
      ))}
    </div>

    <div className="flex-1 p-10 overflow-y-auto bg-gray-50/30">
      <div className="grid grid-cols-5 gap-8">
        {subcat?.map((prod, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <div
              className={`w-full aspect-square overflow-hidden border transition-all bg-gradient-to-r from-[#334A78] to-[#347ABF] p-2 shadow-lg rounded-2xl ${prod.active ? "border-[#3b5998] shadow-2xl scale-105" : "border-gray-100"}`}
            >
              <img
                src={prod?.img}
                className="w-full h-full object-cover"
                alt={prod?.name}
              />
            </div>
            <span className="text-[10px] font-black text-[#334A78]/70 uppercase tracking-widest text-center truncate w-full px-2">
              {prod?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DownloadScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#f4f7f9] p-16 text-center font-TimesNewRoman">
      <div className="relative mb-12">
        <div className="w-48 h-48 bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] flex items-center justify-center border-4 border-white ring-1 ring-gray-100">
          <i className="fas fa-file-pdf text-8xl text-red-500">
            <FaFilePdf />
          </i>
        </div>
        <div className="absolute -top-4 -right-4 w-14 h-14 bg-green-500 rounded-full border-8 border-[#f4f7f9] flex items-center justify-center text-white shadow-xl">
          <i className="text-lg">
            <FaCheck />
          </i>
        </div>
      </div>
      <h2 className="text-4xl font-black text-[#334A78] mb-6 uppercase">
        BOQ Generated!
      </h2>
      <p className="text-gray-400 max-sm mb-12 text-sm font-bold uppercase tracking-[0.2em] leading-relaxed">
        Your professional comprehensive cost report is ready.
      </p>
      <div className="flex gap-6">
        <button
          id="download-pdf-btn"
          onClick={() => navigate("/layout")}
          className="px-12 py-4 bg-[#334A78] text-white rounded-2xl font-black animate-bounce text-xs uppercase tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 transition-all"
        >
          <i className="fas fa-file-download text-base"></i>
          Start Your Journey
        </button>
        {/* <button
          id="start-journey-btn"
          onClick={() => navigate("/layout")}
          className="px-12 py-4 bg-[#3b5998] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 transition-all "
        >
          Start Your Journey
        </button> */}
      </div>
    </div>
  );
};
