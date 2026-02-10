import { useLocation } from "react-router-dom";
import { useState } from "react";
import { FaWhatsapp, FaQuestion } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import AnimationWrapper from "../landing/components/AnimationWrapper";
import { HiSquaresPlus } from "react-icons/hi2";

const noWhatsappPopupRoutes = [
  "/",
  "/Aboutus",
  "/OurServices",
  "/Contactus",
  "/ourstory",
  "/Career",
  "/help",
  "/termsNcondition",
  "/privacy-policy",
  "/Blog",
];

const matchDynamicRoute = (route, path) => {
  const routeRegex = new RegExp(`^${route.replace(/:\w+/g, "[^/]+")}$`);
  return routeRegex.test(path);
};

export default function FloatingActionMenu() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const shouldShow = noWhatsappPopupRoutes.some((route) =>
    matchDynamicRoute(route, location.pathname),
  );

  if (!shouldShow) return null;

  const phoneNumber = "919136036603";
  const message = "Hello, I’m interested in your Office Interior services";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-center gap-3">
        <div
          className={`flex flex-col gap-3 transition-all duration-300 ${
            open
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <button
            onClick={() => {
              setShowWalkthrough(true);
              setOpen(false);
            }}
            className="hidden xl:flex w-11 h-11 bg-[#78A3FF] rounded-full items-center justify-center shadow-lg hover:scale-110 transition"
          >
            <FaQuestion />
          </button>

          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
          >
            <FaWhatsapp size={22} />
          </a>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-12 h-12 bg-[#334A78] text-white rounded-full flex items-center justify-center shadow-xl
             transition-all duration-300 ease-out
             hover:scale-105"
        >
          <span
            className={`transition-all duration-300 ${
              open
                ? "rotate-90 scale-90 opacity-0 absolute"
                : "rotate-0 scale-100 opacity-100"
            }`}
          >
            <HiSquaresPlus size={26} />
          </span>

          <span
            className={`transition-all duration-300 ${
              open
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-75 opacity-0 absolute"
            }`}
          >
            <IoMdClose size={26} />
          </span>
        </button>
      </div>

      {showWalkthrough && (
        <div className="fixed inset-0 z-[9999] hidden xl:flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-[95%] max-w-6xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button
              className="absolute right-4 top-4 z-50 rounded-full bg-black/10 hover:bg-black/20 p-2"
              onClick={() => setShowWalkthrough(false)}
            >
              <IoMdClose size={20} />
            </button>

            <AnimationWrapper />
          </div>
        </div>
      )}
    </>
  );
}
