import { useState } from "react";
import { CiCalculator1 } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useApp } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Typewriter from "typewriter-effect";
import { supabase } from "../../services/supabase";

// import ErrorModal from "../../components/ErrorModal";

// function Navbar({ totalArea, setTotalArea, MIN_AREA, MAX_AREA, resetAll }) {
function Navbar({ MIN_AREA, MAX_AREA, resetAll, areaQuantities, areaValues }) {
  const [error, setError] = useState(false);

  const {
    setTotalArea,
    totalArea,
    inputValue,
    setInputValue,
    setTotalAreaSource,
    userId,
    showProfile,
    setShowProfile,
  } = useApp();

  // const [warning,setWarning]=useState(false)
  console.log(
    "total area",
    totalArea,
    "quantity",
    areaQuantities,
    "area values",
    areaValues
  );
  console.log("user id", userId);

  const navigate = useNavigate();

  const mapAreaValues = (userId, areaValues, totalArea = null) => {
    return {
      userId: userId || null,
      linear: areaValues.linear,
      lType: areaValues.lType,
      md: areaValues.md,
      manager: areaValues.manager,
      small: areaValues.small,
      ups: areaValues.ups,
      bms: areaValues.bms,
      server: areaValues.server,
      reception: areaValues.reception,
      lounge: areaValues.lounge,
      sales: areaValues.sales,
      phoneBooth: areaValues.phoneBooth,
      discussionRoom: areaValues.discussionRoom,
      interviewRoom: areaValues.interviewRoom,
      conferenceRoom: areaValues.conferenceRoom,
      boardRoom: areaValues.boardRoom,
      meetingRoom: areaValues.meetingRoom,
      meetingRoomLarge: areaValues.meetingRoomLarge,
      hrRoom: areaValues.hrRoom,
      financeRoom: areaValues.financeRoom,
      breakoutRoom: areaValues.breakoutRoom,
      executiveWashroom: areaValues.executiveWashroom,
      videoRecordingRoom: areaValues.videoRecordingRoom,
      other: areaValues.other,
      ...(totalArea !== null && { totalArea }),
    };
  };

  const handlegenrateboq = async () => {
    if (!totalArea) {
      toast.error("Enter the Area");
    }
    if (totalArea) {
      const areaData = mapAreaValues(userId, areaValues, totalArea);
      const quantityData = mapAreaValues(userId, areaQuantities);

      // Insert into tables
      const { data: aData, error: areasInsertError } = await supabase
        .from("areas")
        .insert([areaData])
        .select("areaId")
        .single();

      if (areasInsertError) {
        console.error("Error inserting into areas:", areasInsertError.message);
      }

      console.log("Area Data:", aData);

      const { data: qData, error: quantityInsertError } = await supabase
        .from("quantity")
        .insert([quantityData])
        .select("quantityId")
        .single();

      if (quantityInsertError) {
        console.error(
          "Error inserting into quantity:",
          quantityInsertError.message
        );
      }

      console.log("Quantity Data:", qData);

      if (!userId) {
        navigate("/Login", {
          state: {
            totalArea: totalArea,
            areaValues: areaValues,
            areaQuantities: areaQuantities,
            quantityId: qData.quantityId,
            areaId: aData.areaId,
          },
        });
      } else {
        navigate("/boq");
      }
    }
  };
  // const handlegenrateboq = ()=>{

  //     // if(totalArea){
  //     //     navigate('/boq')
  //     // }
  //     setWarning(true)
  // }

  const handleInputChange = (e) => {
    if (e.target.value.length <= 5) {
      setTotalAreaSource("NoErrorModal"); // Set the source
      setInputValue(e.target.value);
      setError(false); // Reset error state on input change
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "e" ||
      e.key === "E" ||
      e.key === "+" ||
      e.key === "-" ||
      e.key === "."
    ) {
      e.preventDefault(); // Prevent the default behavior
    }
  };

  const handleSubmit = () => {
    const area = parseInt(inputValue, 10);
    if (!isNaN(area)) {
      if (area >= MIN_AREA && area <= MAX_AREA) {
        setTotalArea(area);
        setError(false);
      } else if (area === 0 || area === undefined) {
        setError(false);
        resetAll();
      } else {
        setError(true); // Set error state if area is out of range
        resetAll();
      }
    } else {
      setError(true); // Set error state if input is invalid
    }
  };

  const handleReset = () => {
    setInputValue("");
    setError(false);
    resetAll(); // Call the resetAll function passed from the parent component
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div>
      {/* navbar */}
      {/* <div className="flex justify-evenly bg-[#003366] py-2 items-center rounded-full mx-2 mt-2"> */}
      <div className="flex justify-around bg-gradient-to-r from-[#1A3A36] to-[#48A095] py-4 items-center px-5">
        {/* logo */}
        <button className="self-start" onClick={() => navigate("/")}>
          <img src="/logo/logo.png" alt="603 logo" className="h-auto w-20" />
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
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleSubmit}
            placeholder="Enter total area (sq ft)"
            title="Set the area value here"
            // className={`set-area-input ${error ? 'error' : ''}`}
            aria-label="Total Area Input"
            data-tip="Enter the total area in square feet"
            autoFocus
          />
          {/* <div className="absolute top-3 left-7 text-gray-300 text-sm">
            {!inputValue && (
              <Typewriter
                options={{
                  strings: ["Enter total area (sq ft)"], // Your placeholder text
                  autoStart: true,
                  loop: true,
                  delay: 100, // Speed of typing
                }}
              />
            )}
          </div> */}
        </div>
        {error && (
          <div
            className="error-message text-[#FFD43B] font-medium text-xs mt-1 flex items-center absolute top-1 bg-transparent left-1/3 bg-gradient-to-r from-[#325B56] to-[#3D6F68]"
            aria-live="polite"
          >
            <span className="warning-icon">⚠️</span>
            Invalid area value. Must be between {MIN_AREA} and {MAX_AREA} square
            feet.
          </div>
        )}
        {/* button for generate boq */}
        {/* <div> */}
        <button
          className="generateBoq bg-[#1A3A36] mt-2 rounded-3xl text-sm py-2 px-5 text-white mb-2 border-2 border-[#34BFAD]"
          onClick={handlegenrateboq}
        >
          Generate BOQ
        </button>
        <img
          onClick={toggleProfile}
          src="/images/usericon.png"
          alt="usericon"
          className="w-12 h-12 cursor-pointer"
        />
        {/* </div> */}
      </div>
      {/* {warning && <ErrorModal onclose={()=>setWarning(false)} />} */}
    </div>
  );
}

export default Navbar;
