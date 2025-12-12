import { useEffect, useState, useRef } from "react";
import { CiCalculator1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import UnusedAreaWarning from "./UnusedAreaWarning";
import AlertBox from "../../boq/components/AlertBox";
import EnterAreaModal from "./EnterAreaModal";
import { AnimatedButton } from "../../common-components/AnimatedButton";
import { MIN_AREA, MAX_AREA, mapAreaValues } from "../utils/AreaCalculations";

function Navbar({
  resetAll,
  areaQuantities,
  areaValues,
  toggleProfile,
  iconRef,
  builtArea,
  setAreaQuantities,
  handleVariantChange,
  seatCounts,
}) {
  const [error, setError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unusedArea, setUnusedArea] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);
  const [areaWarn, setAreaWarn] = useState(false);

  const { isAuthenticated, accountHolder } = useApp();

  const {
    setTotalArea,
    totalArea,
    setTotalAreaSource,
    userId,
    setSelectedPlan,
    isMobile,
    setCurrentLayoutID,
    setBoqTotal,
    setProgress,
    setSelectedData,
  } = useApp();

  const navigate = useNavigate();

  useEffect(() => {
    if (showWarning) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }
  }, [showWarning]);

  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const preventScroll = (e) => {
      if (document.activeElement === input) {
        e.preventDefault();
      }
    };

    input.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      input.removeEventListener("wheel", preventScroll);
    };
  }, []);

  const generateBOQclick = () => {
    if (!totalArea) {
      setAreaWarn(true);
    }

    if (totalArea >= MIN_AREA && totalArea <= MAX_AREA) {
      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("hasSeenQuestionPopup");
      setSelectedPlan(null);
      const usedPercentage = (builtArea / totalArea) * 100;

      if (usedPercentage < 90) {
        setUnusedArea(totalArea - builtArea);
        setShowWarning(true);
        return;
      } else {
        handlegenrateboq();
      }
    }
  };

  const handlegenrateboq = async () => {
    try {
      setIsSubmitting(true);
      if (!totalArea) {
        toast.error("Enter the Area");
        return;
      }

      if (totalArea) {
        const layoutData = mapAreaValues(
          userId,
          areaValues,
          areaQuantities,
          totalArea,
          builtArea,
          seatCounts
        );

        const { data, error } = await supabase
          .from("layout")
          .insert([layoutData])
          .select("id")
          .single();

        if (error) {
          console.error("Error inserting into layout:", error.message);
        }
        if (data) {
          const currentLayoutID = data.id;
          setCurrentLayoutID(currentLayoutID);
          sessionStorage.setItem("currentLayoutID", currentLayoutID);
        }

        if (!isAuthenticated) {
          navigate("/Login", {
            state: {
              totalArea: totalArea,
              areaValues: areaValues,
              areaQuantities: areaQuantities,
              layoutId: data.id,
            },
          });
        } else {
          navigate("/boq");
        }
      }
    } finally {
      setIsSubmitting(false);
      setShowWarning(false);
      setTotalArea("");
      localStorage.removeItem("selectedData");
      setSelectedData([]);
      setProgress(0);
      setBoqTotal(0);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.value.length <= 5) {
      setTotalAreaSource("NoErrorModal");
      setTotalArea(e.target.value);
      setError(false);
      const newAreaQuantities = { ...areaQuantities };
      setAreaQuantities(newAreaQuantities);
      handleVariantChange(areaValues);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "e" ||
      e.key === "E" ||
      e.key === "+" ||
      e.key === "-" ||
      e.key === "." ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    const area = +totalArea;
    if (!isNaN(area)) {
      if (area >= MIN_AREA && area <= MAX_AREA) {
        setTotalArea(area);
        setError(false);
      } else if (area === 0 || area === undefined) {
        setError(false);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  const handleReset = () => {
    setError(false);
    resetAll();
    setResetAlert(false);
  };

  return (
    <div>
      {areaWarn && <EnterAreaModal onclose={() => setAreaWarn(false)} />}
      {!isMobile ? (
        <div className="bg-gradient-to-r from-[#23445B] to-[#487BA0]">
          <div className="hidden md:flex justify-between  py-4 items-center px-5 overflow-hidden 3xl:container">
            <button className=" " onClick={() => navigate("/")}>
              <img
                src="/logo/workved-logo.png"
                alt="Workved Interior logo"
                className="h-auto w-20"
              />
            </button>
            <div
              className={`joynavarea flex justify-between w-7/12 border-2 border-[#FFD43B] items-center px-2 rounded-xl relative ${
                error ? "border-t-1" : "border-1"
              }`}
            >
              <CiCalculator1
                size={30}
                color="#FEBF00"
                className="absolute left-0"
              />
              {totalArea > 0 && (
                <button
                  className="absolute group inline-block right-2 cursor-pointer text-[#FFD43B] border-none hover:text-red-300"
                  onClick={() => {
                    if (totalArea >= MIN_AREA) {
                      setResetAlert(true);
                    } else {
                      handleReset();
                    }
                  }}
                >
                  <MdOutlineCancel size={30} />
                  <span
                    className="absolute top-3/4 left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block 
                   bg-[#334A78] text-[#fff] border-l border-t border-[#FFD43B] text-sm px-3 py-1 rounded-sm whitespace-nowrap z-10"
                  >
                    Reset
                  </span>
                </button>
              )}
              <input
                ref={inputRef}
                type="number"
                className={`w-full rounded-md border-none bg-transparent py-2.5 ms-8 [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-white ${
                  error ? "error" : ""
                }`}
                value={totalArea}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleSubmit}
                placeholder="Enter total area (sq ft)"
                title="Enter area value here"
                aria-label="Total Area Input"
                data-tip="Enter the total area in square feet"
                autoFocus
              />
            </div>
            {error && (
              <div
                className="error-message text-[#FFD43B] font-medium text-xs mt-1 flex items-center absolute top-1 left-1/2 bg-transparent -translate-x-1/2 bg-gradient-to-r from-[#23445B] to-[#487BA0]"
                aria-live="polite"
              >
                <span className="warning-icon">⚠️</span>
                Invalid area value. Must be between {MIN_AREA} and {MAX_AREA}{" "}
                square feet.
              </div>
            )}

            <div className="flex items-center gap-5">
              <AnimatedButton
                onClick={generateBOQclick}
                className="generateBoq !bg-[#3A5D7B] text-white capitalize font-Poppins font-semibold tracking-wider"
                variant="default"
                size="lg"
                textEffect="shimmer"
                rounded="custom"
                asChild={false}
                hideAnimations={false}
                shimmerColor="#fff"
                shimmerSize="0.15em"
                shimmerDuration="3s"
                borderRadius="10px"
                background="rgba(48, 71, 120, 1)"
                hovereBackground="linear-gradient(90deg,rgba(85,132,182,1)  0%,  rgba(117,162,190,1) 100%)"
              >
                Create BOQ
              </AnimatedButton>

              {isAuthenticated && (
                <button
                  ref={iconRef}
                  className="z-30 rounded-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
                  }}
                >
                  <img
                    onClick={toggleProfile}
                    src={accountHolder.profileImage}
                    alt="usericon"
                    className="w-8 md:w-12 h-8 p-1 md:h-12 cursor-pointer rounded-full"
                  />
                </button>
              )}
            </div>

            {/* </div> */}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between bg-gradient-to-r from-[#23445B] to-[#487BA0] py-2 items-center px-5">
            {/* logo */}
            <button className=" " onClick={() => navigate("/")}>
              <img
                src="/logo/workved-logo.png"
                alt="Workved Interior logo"
                className="h-auto w-14"
              />
            </button>

            {isAuthenticated && (
              <button
                ref={iconRef}
                className="z-30 rounded-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
                }}
              >
                <img
                  onClick={toggleProfile}
                  src={accountHolder.profileImage}
                  alt="usericon"
                  className="w-8 md:w-12 h-8 p-1 md:h-12 cursor-pointer rounded-full"
                />
              </button>
            )}

            {/* </div> */}
          </div>
          {/* sq feet div */}
          <div className="px-5">
            <div
              className={`joynavarea flex justify-between mx-auto bg-gradient-to-r from-[#23445B] to-[#487BA0] border border-[#FFD43B] items-center px-2 rounded relative my-2 w-full  ${
                error ? "border-t-1" : "border-1"
              }`}
            >
              {/* cal icon */}
              <CiCalculator1
                size={30}
                color="#FEBF00"
                className="absolute left-0"
              />
              {totalArea > 0 && (
                <button
                  title="Reset"
                  className="absolute right-2 cursor-pointer text-[#FFD43B] border-none hover:text-red-300"
                  // onClick={handleReset}
                  onClick={() => setResetAlert(true)}
                >
                  <MdOutlineCancel size={30} />
                  <span
                    className="absolute top-3/4 left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block 
                   bg-[#334A78] text-[#fff] border-l border-t border-[#FFD43B] text-sm px-3 py-1 rounded-sm whitespace-nowrap z-10"
                  >
                    Reset
                  </span>
                </button>
              )}
              <input
                type="number"
                className={`w-full rounded-md border-none bg-transparent py-2.5 ms-8 [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-white ${
                  error ? "error" : ""
                }`}
                value={totalArea}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleSubmit}
                placeholder="Enter total area (sq ft)"
                title="Set the area value here"
                aria-label="Total Area Input"
                data-tip="Enter the total area in square feet"
                autoFocus
              />
              {error && (
                <div
                  className="error-message text-[#FFD43B] font-medium text-[10px] mt-1 flex items-center absolute -top-3 bg-transparent translate-x-4 xs:translate-x-1/4 sm:translate-x-full bg-gradient-to-r from-[#23445B] to-[#487BA0] text-wrap"
                  aria-live="polite"
                >
                  <span className="warning-icon">⚠️</span>
                  Invalid area value. Range {MIN_AREA} to {MAX_AREA} sq ft.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showWarning && (
        <UnusedAreaWarning
          unusedArea={unusedArea}
          onConfirm={handlegenrateboq}
          onCancel={() => {
            setShowWarning(false);
          }}
          isSubmitting={isSubmitting}
        />
      )}
      {resetAlert && (
        <div className="fixed inset-0 bg-[#000]/30 z-20">
          <AlertBox
            onClose={setResetAlert}
            onconfirm={handleReset}
            resetLayout={true}
          />
        </div>
      )}
    </div>
  );
}

export default Navbar;
