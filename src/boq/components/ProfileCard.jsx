import { RiDashboardFill } from "react-icons/ri";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { LuCalendarClock } from "react-icons/lu";
import { RxVideo } from "react-icons/rx";
import { BsQuestionCircle } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { PiListStarFill } from "react-icons/pi";
import { BiUnite } from "react-icons/bi";
import BookAppointment from "./BookAppointment";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
// import useAuthRefresh from "../../Context/useAuthRefresh";

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
}) {
  const {
    setIsAuthenticated,
    accountHolder,
    setAccountHolder,
    setTotalArea,
    setSelectedPlan,
    progress,
    setProgress,
    setBoqTotal,
  } = useApp();
  const profileRef = useRef(null);
  const [showBookAppointment, setShowBookAppointment] = useState(false);

  let isadmin = accountHolder.role === "user" ? true : false;
  const navigate = useNavigate();

  //   const { signOutUser } = useAuthRefresh(); // Get signOutUser from hook

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("User signed out successfully");
      toast.success("User signed out successfully");
      setIsAuthenticated(false);
      isadmin = false;
      setAccountHolder({
        companyName: "",
        email: "",
        phone: "",
        role: "",
        userId: "",
      });
      setTotalArea("");
      localStorage.removeItem("currentLayoutID");
      localStorage.removeItem("session");
      localStorage.removeItem("usertoken");
      navigate("/");
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-30 z-20">
      <motion.div
        ref={profileRef}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={profileVariants}
        className={`fixed right-0 ${
          layout
            ? "h-dvh md:h-[calc(100vh-85px)] top-0 md:top-[85px]"
            : "h-dvh md:h-[calc(100vh-50px)] top-0 md:top-[50px]"
        } font-Poppins bg-white z-20 md:rounded-bl-[60px] md:rounded-tl-[60px] md:shadow-lg  md:max-w-sm w-3/4`}
      >
        <div className="md:hidden flex justify-end items-center mb-4 absolute top-3 left-5">
          <MdClose
            className="text-xl cursor-pointer text-gray-600"
            // onClick={onClose}
            onClick={() => setIsOpen(false)}
          />
        </div>
        {/* Profile Card Content */}
        <div className="md:rounded-bl-[60px] md:rounded-tl-[60px]  shadow-lg overflow-hidden w-full h-full bg-white">
          {/* Profile Header */}
          <div className="h-1/3 flex flex-col">
            <div className="h-1/2 flex justify-center items-end">
              <img
                src={accountHolder.profileImage}
                alt="usericon"
                className="w-16 h-16"
              />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="font-semibold text-lg">
                {accountHolder.companyName}
              </p>
              <p className="font-sm">{accountHolder.email}</p>
            </div>
          </div>

          {/* Features Section */}
          <div className="font-semibold xl:text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] border-y-2 border-[#ccc] flex flex-col gap-4">
            <div className="flex items-center mx-4 gap-3">
              <RiDashboardFill />
              <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            </div>
            {!layout && (
              <>
                <div className="flex items-center mx-4 gap-3">
                  <BiUnite />
                  <button onClick={() => navigate("/Layout")}>Layout</button>
                </div>
                {selectedPlan && (
                  <div className="flex items-center mx-4 gap-3">
                    <PiListStarFill />
                    <button
                      onClick={() => {
                        // setSelectedPlan(null);
                        setIsOpen(false);
                        // setProgress(0);
                        // localStorage.removeItem("selectedData");
                        // setBoqTotal(0);
                        setShowBoqPrompt(true);
                        setIsProfileCard(true);
                      }}
                    >
                      Select Your Plan
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center mx-4 gap-3">
              <RxVideo />
              <p>How it works</p>
            </div>

            {accountHolder.role === "user" && (
              <div
                className={`flex items-center mx-4 gap-3 ${
                  progress < 90 ? "text-gray-400 cursor-not-allowed" : ""
                }`}
              >
                <LuCalendarClock />
                <button onClick={handleAppointment}>Book Appointment</button>
              </div>
            )}
          </div>

          {/* Help & Settings Section */}
          <div className="font-semibold xl:text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] border-b-2 border-[#ccc] flex flex-col gap-4">
            <div className="flex items-center mx-4 gap-3">
              <BsQuestionCircle />
              <button
                onClick={() =>
                  navigate("/dashboard", { state: { openHelp: true } })
                }
              >
                Help
              </button>
            </div>
            <div className="flex items-center mx-4 gap-3">
              <IoSettingsSharp />
              <button
                onClick={() =>
                  navigate("/dashboard", { state: { openSettings: true } })
                }
              >
                Settings
              </button>
            </div>
            <div className="flex items-center mx-4 gap-3">
              <VscSignOut />
              <button onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>

        {/* Book Appointment Modal */}
        {showBookAppointment && (
          <BookAppointment onClose={() => setShowBookAppointment(false)} />
        )}
      </motion.div>
    </div>
  );
}

export default ProfileCard;
