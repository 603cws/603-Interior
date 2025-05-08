import { useEffect, useState } from "react";
import { CiCalculator1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import UnusedAreaWarning from "./UnusedAreaWarning";

// function Navbar({ totalArea, setTotalArea, MIN_AREA, MAX_AREA, resetAll }) {
function Navbar({
  MIN_AREA,
  MAX_AREA,
  resetAll,
  areaQuantities,
  areaValues,
  toggleProfile,
  iconRef,
  builtArea,
  setAreaQuantities,
}) {
  const [error, setError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unusedArea, setUnusedArea] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const {
    isAuthenticated,
    layoutImgRef,
    layoutImage = "",
    accountHolder,
  } = useApp();

  const {
    setTotalArea,
    totalArea,
    setTotalAreaSource,
    userId,
    setSelectedPlan,
    isMobile,
    setCurrentLayoutID,
  } = useApp();

  const navigate = useNavigate();

  useEffect(() => {
    if (showWarning) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }
  }, [showWarning]);

  const mapAreaValues = (
    userId,
    areaValues,
    areaQuantities,
    totalArea = null,
    imageFilename,
    builtArea
  ) => {
    return {
      userId: userId || null,
      linearArea: areaValues.linear,
      linearQty: areaQuantities.linear || 0,
      lTypeArea: areaValues.lType,
      lTypeQty: areaQuantities.lType || 0,
      mdArea: areaValues.md,
      mdQty: areaQuantities.md || 0,
      managerArea: areaValues.manager,
      managerQty: areaQuantities.manager || 0,
      smallArea: areaValues.small,
      smallQty: areaQuantities.small || 0,
      upsArea: areaValues.ups,
      upsQty: areaQuantities.ups || 0,
      bmsArea: areaValues.bms,
      bmsQty: areaQuantities.bms || 0,
      serverArea: areaValues.server,
      serverQty: areaQuantities.server || 0,
      receptionArea: areaValues.reception,
      receptionQty: areaQuantities.reception || 0,
      loungeArea: areaValues.lounge,
      loungeQty: areaQuantities.lounge || 0,
      salesArea: areaValues.sales,
      salesQty: areaQuantities.sales || 0,
      phoneBoothArea: areaValues.phoneBooth,
      phoneBoothQty: areaQuantities.phoneBooth || 0,
      discussionRoomArea: areaValues.discussionRoom,
      discussionRoomQty: areaQuantities.discussionRoom || 0,
      interviewRoomArea: areaValues.interviewRoom,
      interviewRoomQty: areaQuantities.interviewRoom || 0,
      conferenceRoomArea: areaValues.conferenceRoom,
      conferenceRoomQty: areaQuantities.conferenceRoom || 0,
      boardRoomArea: areaValues.boardRoom,
      boardRoomQty: areaQuantities.boardRoom || 0,
      meetingRoomArea: areaValues.meetingRoom,
      meetingRoomQty: areaQuantities.meetingRoom || 0,
      meetingRoomLargeArea: areaValues.meetingRoomLarge,
      meetingRoomLargeQty: areaQuantities.meetingRoomLarge || 0,
      hrRoomArea: areaValues.hrRoom,
      hrRoomQty: areaQuantities.hrRoom || 0,
      financeRoomArea: areaValues.financeRoom,
      financeRoomQty: areaQuantities.financeRoom || 0,
      breakoutRoomArea: areaValues.breakoutRoom,
      breakoutRoomQty: areaQuantities.breakoutRoom || 0,
      executiveWashroomArea: areaValues.executiveWashroom,
      executiveWashroomQty: areaQuantities.executiveWashroom || 0,
      videoRecordingRoomArea: areaValues.videoRecordingRoom,
      videoRecordingRoomQty: areaQuantities.videoRecordingRoom || 0,
      otherArea: areaValues.other,
      otherQty: areaQuantities.other || 0,
      // maleWashroomArea: areaValues.maleWashroom,
      // maleWashroomQty: areaQuantities.maleWashroom || 0,
      // femaleWashroomArea: areaValues.femaleWashroom,
      // femaleWashroomQty: areaQuantities.femaleWashroom || 0,
      washroomsArea: areaValues.washrooms,
      washroomsQty: areaQuantities.washrooms || 0,
      ...(totalArea !== null && { totalArea }),
      layoutImg: imageFilename,
      usedSpace: builtArea,
    };
  };

  const uploadImage = async (imageDataUrl) => {
    try {
      // ✅ Convert Base64 to Blob Properly
      const blob = await fetch(imageDataUrl)
        .then((res) => res.blob())
        .catch((error) => {
          console.error("Error converting Base64 to Blob:", error);
          return null;
        });

      if (!blob) {
        console.error("Blob conversion failed");
        return null;
      }

      // ✅ Ensure Correct Filename
      const fileName = `area_distribution_${Date.now()}.png`;

      // ✅ Upload Image to Supabase Storage
      const { error } = await supabase.storage
        .from("addon")
        .upload(fileName, blob, { contentType: "image/png" });

      if (error) {
        console.error("Image upload failed:", error);
        return null;
      }

      return fileName; // ✅ Store filename in DB
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const generateBOQclick = () => {
    if (!totalArea) {
      toast.error("Enter the Area");
      return;
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

      // Trigger export and wait for image to be available
      if (layoutImgRef.current) {
        await layoutImgRef.current();
      }

      // Upload image to Supabase
      // const imageUrl = await uploadImage(layoutImage || "");
      const imageFilename = await uploadImage(layoutImage);

      if (totalArea) {
        const layoutData = mapAreaValues(
          userId,
          areaValues,
          areaQuantities,
          totalArea,
          imageFilename,
          builtArea
        );

        // Insert into tables
        const { data, error } = await supabase
          .from("layout")
          .insert([layoutData])
          .select("id")
          .single();

        if (error) {
          console.error("Error inserting into layout:", error.message);
        }

        console.log("layout Data:", data);

        if (data) {
          const currentLayoutID = data.id;
          setCurrentLayoutID(currentLayoutID);
          localStorage.setItem("currentLayoutID", currentLayoutID);
        }

        if (!userId) {
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
      setTotalArea();
    }
  };

  const handleInputChange = (e) => {
    if (e.target.value.length <= 5) {
      setTotalAreaSource("NoErrorModal"); // Set the source
      // setInputValue(e.target.value);
      setTotalArea(e.target.value);
      setError(false); // Reset error state on input change
      const newAreaQuantities = { ...areaQuantities };
      console.log("newAreaQuantities", newAreaQuantities);

      setAreaQuantities(newAreaQuantities);
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
      e.preventDefault(); // Prevent the default behavior
    }
  };

  const handleSubmit = () => {
    // const area = parseInt(totalArea, 10);
    const area = +totalArea;
    if (!isNaN(area)) {
      if (area >= MIN_AREA && area <= MAX_AREA) {
        setTotalArea(area);
        setError(false);
      } else if (area === 0 || area === undefined) {
        setError(false);
        // resetAll();
      } else {
        setError(true); // Set error state if area is out of range
        // resetAll();
      }
    } else {
      setError(true); // Set error state if input is invalid
    }
  };

  const handleReset = () => {
    // setInputValue("");
    // setTotalArea();
    setError(false);
    resetAll(); // Call the resetAll function passed from the parent component
  };

  return (
    <div>
      {!isMobile ? (
        <div className="hidden md:flex justify-around bg-gradient-to-r from-[#1A3A36] to-[#48A095] py-4 items-center px-5">
          {/* logo */}
          <button className=" " onClick={() => navigate("/")}>
            <img
              src="/logo/workved-logo-white.png"
              alt="Workved Interior logo"
              className="h-auto w-20"
            />
          </button>
          {/* sq feet div */}
          <div
            className={`joynavarea flex justify-between w-7/12 border-2 border-[#FFD43B] items-center px-2 rounded-xl relative ${
              error ? "border-t-1" : "border-1"
            }`}
          >
            {/* cal icon */}
            <CiCalculator1
              size={30}
              color="#FEBF00"
              className="absolute left-0"
            />
            <MdOutlineCancel
              size={30}
              className="absolute right-2 cursor-pointer text-[#FFD43B] border-none hover:text-red-300"
              onClick={handleReset}
            />
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
          </div>
          {error && (
            <div
              className="error-message text-[#FFD43B] font-medium text-xs mt-1 flex items-center absolute top-1 bg-transparent left-1/3 bg-gradient-to-r from-[#325B56] to-[#3D6F68]"
              aria-live="polite"
            >
              <span className="warning-icon">⚠️</span>
              Invalid area value. Must be between {MIN_AREA} and {MAX_AREA}{" "}
              square feet.
            </div>
          )}
          {/* button for generate boq */}
          <button
            className="generateBoq bg-[#1A3A36] mt-2 rounded-3xl text-sm py-2 px-5 text-white mb-2 border-2 border-[#34BFAD]"
            onClick={generateBOQclick}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Generate BOQ"
            )}
          </button>
          {isAuthenticated && (
            <button ref={iconRef} className="z-30">
              <img
                onClick={toggleProfile}
                src={accountHolder.profileImage}
                alt="usericon"
                className="w-12 h-12 cursor-pointer rounded-full"
              />
            </button>
          )}

          {/* </div> */}
        </div>
      ) : (
        <div>
          <div className="flex  justify-between bg-gradient-to-r from-[#1A3A36] to-[#48A095] py-2 items-center px-5">
            {/* logo */}
            <button className=" " onClick={() => navigate("/")}>
              <img
                src="/logo/workved-logo-white.png"
                alt="Workved Interior logo"
                className="h-auto w-14"
              />
            </button>

            {isAuthenticated && (
              <button ref={iconRef}>
                <img
                  onClick={toggleProfile}
                  src={accountHolder.profileImage}
                  alt="usericon"
                  className="w-12 h-12 cursor-pointer rounded-full"
                />
              </button>
            )}

            {/* </div> */}
          </div>
          {/* sq feet div */}
          <div
            className={`joynavarea flex justify-between mx-auto bg-gradient-to-r from-[#1A3A36] to-[#48A095]  border-2 border-[#FFD43B] items-center px-2 rounded-xl relative my-2 w-[90%]  ${
              error ? "border-t-1" : "border-1"
            }`}
          >
            {/* cal icon */}
            <CiCalculator1
              size={30}
              color="#FEBF00"
              className="absolute left-0"
            />
            <MdOutlineCancel
              size={30}
              className="absolute right-2 cursor-pointer text-[#FFD43B] border-none hover:text-red-300"
              onClick={handleReset}
            />
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
                className="error-message text-[#FFD43B] font-medium text-[11px] mt-1 flex items-center absolute -top-3 bg-transparent left-14 bg-gradient-to-r from-[#325B56] to-[#3D6F68] text-wrap"
                aria-live="polite"
              >
                <span className="warning-icon">⚠️</span>
                Invalid area value. Range {MIN_AREA} to {MAX_AREA} sq ft.
              </div>
            )}
          </div>
        </div>
      )}
      {/*desktop navbar */}

      {/* mobile navbar */}

      {/* {warning && <ErrorModal onclose={()=>setWarning(false)} />} */}
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
    </div>
  );
}

export default Navbar;
