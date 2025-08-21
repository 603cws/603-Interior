import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import BookAppointment from "./BookAppointment";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { useLogout } from "../../utils/HelperFunction";
import GobackLayoutWarning from "./GobackLayoutWarning";

const profileVariants = {
  hidden: { x: "100%", opacity: 0 }, // Start off-screen (right side)
  visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }, // Slide in
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  }, // Slide out
};

function ProfileCard({
  layout = false,
  isOpen,
  setIsOpen,
  iconRef,
  selectedPlan = null,
  setShowBoqPrompt,
  setIsProfileCard,
  setIsDBPlan,
}) {
  const logout = useLogout();
  const {
    accountHolder,
    setSelectedPlan,
    progress,
    setProgress,
    setBoqTotal,
    setSelectedData,
  } = useApp();
  const profileRef = useRef(null);
  const [showBookAppointment, setShowBookAppointment] = useState(false);

  // layout warning
  const [isLayoutWarning, setIslayoutWarning] = useState(false);

  let isadmin = accountHolder.role === "user" ? true : false;
  const navigate = useNavigate();

  // Close profile card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current?.contains(event.target) ||
        iconRef.current?.contains(event.target)
      ) {
        return; // If clicked inside, do nothing
      } else {
        setIsOpen(() => false);
      }
      // setIsOpen(false); // Otherwise, close it
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // useEffect(() => {
  //   console.log("profile card", isOpen);
  //   if (isOpen) {
  //     document.body.style.overflow = "hidden"; // Disable scroll
  //   } else {
  //     document.body.style.overflow = "auto"; // Enable scroll
  //   }
  // }, [isOpen]);

  const handleAppointment = () => {
    if (progress >= 90) {
      setShowBookAppointment(true);
    } else {
      toast("Atleast Complete 90% of the BOQ before booking appointment!", {
        style: {
          border: "1px solid #1A3A36",
          padding: "16px",
          color: "#1A3A36",
        },
        icon: "🔐",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-30">
      <motion.div
        ref={profileRef}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={profileVariants}
        className={`fixed right-0 ${
          layout
            ? "h-dvh md:h-[calc(100vh-85px)] top-0 md:top-[82px]"
            : "h-dvh md:h-[calc(100vh-50px)] top-0 md:top-[50px]"
        } font-Poppins bg-white z-20 md:shadow-lg md:max-w-sm w-3/4`}
      >
        <div className="md:hidden flex justify-end items-center mb-4 absolute top-3 left-5">
          <MdClose
            className="text-xl cursor-pointer text-gray-600"
            // onClick={onClose}
            onClick={() => setIsOpen(false)}
          />
        </div>
        {/* Profile Card Content */}
        <div className="shadow-lg overflow-hidden w-full h-full bg-white">
          {/* Profile Header */}
          <div className="h-1/3 flex flex-col">
            <div className="h-1/2 flex justify-center items-end">
              <div
                className="z-30 rounded-full"
                ref={iconRef}
                style={{
                  backgroundImage:
                    "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
                }}
              >
                <img
                  src={accountHolder.profileImage}
                  alt="usericon"
                  className="w-20 h-20 p-1 cursor-pointer rounded-full"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="font-semibold text-lg">
                {accountHolder.companyName}
              </p>
              <p className="font-sm">{accountHolder.email}</p>
            </div>
          </div>

          {/* Features Section */}
          <div className="font-semibold xl:text-lg capitalize leading-normal tracking-wide py-5 text-[#262626] border-y-2 border-[#ccc] flex flex-col gap-2">
            <div
              className="flex items-center mx-4 gap-3 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-2 py-1.5"
              onClick={() => navigate("/dashboard")}
            >
              <img
                src="/images/profile-card/dashboard.png"
                alt="dashboard"
                className="w-6 h-6"
              />
              <button>Dashboard</button>
            </div>
            {!layout && (
              <>
                <div
                  className="flex items-center mx-4 gap-3 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-2 py-1.5"
                  onClick={() => setIslayoutWarning(true)}
                  // onClick={() => navigate("/Layout")}
                >
                  <img
                    src="/images/profile-card/layout.png"
                    alt="layout"
                    className="w-6 h-6"
                  />
                  <button>Layout</button>
                </div>
                {selectedPlan && (
                  <div
                    className="flex items-center mx-4 gap-3 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-2 py-1.5"
                    onClick={() => {
                      // setSelectedPlan(null);
                      setIsOpen(false);
                      // setProgress(0);
                      // localStorage.removeItem("selectedData");
                      // setBoqTotal(0);
                      setIsDBPlan(false);
                      if (import.meta.env.MODE !== "development") {
                        setShowBoqPrompt(true);
                        setIsProfileCard(true);
                      } else {
                        setSelectedPlan(null);
                        setProgress(0);
                        localStorage.removeItem("selectedData");
                        setSelectedData([]);
                        setBoqTotal(0);
                      }
                    }}
                  >
                    <img
                      src="/images/profile-card/plancard.png"
                      alt="layout"
                      className="w-6 h-6"
                    />
                    <button>Select Your Plan</button>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center mx-4 gap-3 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-2 py-1.5">
              <img
                src="/images/profile-card/video.png"
                alt="video"
                className="w-6 h-6"
              />
              <p>How it works</p>
            </div>

            {accountHolder.role === "user" && (
              <div
                onClick={handleAppointment}
                className={`flex items-center mx-4 gap-3 pl-2 py-1.5 ${
                  progress < 90
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:rounded-lg hover:bg-[#E5F4FF] hover:cursor-pointer"
                }`}
              >
                <img
                  src="/images/profile-card/Appointment.png"
                  alt="Question"
                  className="w-6 h-6"
                />
                <button>Book Appointment</button>
              </div>
            )}
          </div>

          {/* Help & Settings Section */}
          <div className="font-semibold xl:text-lg capitalize leading-normal tracking-wide py-5 text-[#262626] border-b-2 border-[#ccc] flex flex-col gap-2">
            <div
              className="flex items-center mx-4 gap-3 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-2 py-1.5"
              onClick={() =>
                navigate("/dashboard", { state: { openHelp: true } })
              }
            >
              <img
                src="/images/profile-card/Question.png"
                alt="Question"
                className="w-6 h-6"
              />
              <button>Help</button>
            </div>
            <div
              className="flex items-center mx-4 gap-3 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-2 py-1.5"
              onClick={() =>
                navigate("/dashboard", { state: { openSettings: true } })
              }
            >
              <img
                src="/images/profile-card/setting.png"
                alt="settings"
                className="w-6 h-6"
              />
              <button>Settings</button>
            </div>
            <div
              className="flex items-center mx-4 gap-2 hover:bg-[#E5F4FF] hover:cursor-pointer hover:rounded-lg pl-3 py-1.5"
              onClick={logout}
            >
              <img
                src="/images/profile-card/signout.png"
                alt="logout"
                className="w-6 h-6"
              />
              <button>Sign out</button>
            </div>
          </div>
        </div>

        {/* Book Appointment Modal */}
        {showBookAppointment && (
          <BookAppointment onClose={() => setShowBookAppointment(false)} />
        )}

        {isLayoutWarning && (
          <GobackLayoutWarning
            onCancel={() => setIslayoutWarning((prev) => !prev)}
            onConfirm={() => navigate("/Layout")}
          />
        )}
      </motion.div>
    </div>
  );
}

export default ProfileCard;
