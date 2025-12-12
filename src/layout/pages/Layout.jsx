import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Spacebar from "../components/Spacebar";
import TreeMap from "../pages/TreeMap";
import OpenWorkspaces from "../pages/OpenWorkspaces";
import Cabins from "../pages/Cabins";
import MeetingRooms from "../pages/MeetingRooms";
import { useApp } from "../../Context/Context";
import SupportSpaces from "./SupportSpaces";
import PublicSpaces from "./PublicSpaces";
import ErrorModal from "../../common-components/ErrorModal";
import Joyride, { STATUS } from "react-joyride";
import EnterAreaModal from "../components/EnterAreaModal";
import ProfileCard from "../../boq/components/ProfileCard";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { extractAreaAndQuantity } from "../../utils/LayoutUtils";
import {
  initialAreaValues,
  initialQuantities,
  initialSeatCounts,
} from "../utils/Constants";
import {
  calculateReceptionArea,
  calculateLoungeArea,
  calculateLinear,
  calculateLType,
  calculateMd,
  calculateManager,
  calculateSmall,
  calculateInterviewRoom,
  calculateConferenceRoom,
  calculateBoardRoom,
  calculateMeetingRoom,
  calculateMeetingRoomLarge,
  calculateVideoRecordingRoom,
  calculatePhoneBooth,
  calculateServer,
  calculateWashroomsArea,
  MAX_AREA,
  MIN_AREA,
} from "../utils/AreaCalculations";

//setps for joyride
const tourSteps = [
  {
    target: ".joynavarea", // CSS class in the Navbar component
    content:
      "This is the Input bar where you can Enter the Total area of your space.",

    disableBeacon: true,
    disableOverlayClose: true,
    placement: "bottom",
  },
  {
    target: ".workspacedescription", // Add className in OpenWorkspaces component
    content: "Configure your Work spaces based on your Requirement.",
    disableBeacon: true,
    //   placement: "bottom",
  },
  {
    target: ".generateBoq", // Add className in Spacebar component
    content:
      "After complemention of your configuration click here to generate BOQ",
    disableBeacon: true,
    placement: "top",
  },
];

function Layout() {
  const [builtArea, setBuiltArea] = useState(0);
  const [availableArea, setAvailableArea] = useState(0);
  const [areaValues, setAreaValues] = useState(initialAreaValues);
  const [areaQuantities, setAreaQuantities] = useState(initialQuantities);
  const [seatCounts, setSeatCounts] = useState(initialSeatCounts);
  const [variant, setVariant] = useState("L");
  const [errorMessage, setErrorMessage] = useState("");
  const [mdCabinSize, setMdCabinSize] = useState(areaValues.md);
  const [breakoutRoomSize, setBreakoutRoomSize] = useState(
    areaValues.breakoutRoom
  );
  const [videoRecordingRoomSize, setVideoRecordingRoomSize] = useState(
    areaValues.videoRecordingRoom
  );
  const [conferenceRoomSize, setConferenceRoomSize] = useState(
    areaValues.conferenceRoom
  );
  const [boardRoomSize, setBoardRoomSize] = useState(areaValues.boardRoom);
  const [smallCabinSize, setSmallCabinSize] = useState(areaValues.small);
  const [hrRoomSize, setHrRoomSize] = useState(areaValues.hrRoom);
  const [salesRoomSize, setSalesRoomSize] = useState(areaValues.sales);
  const [financeRoomSize, setFinanceRoomSize] = useState(
    areaValues.financeRoom
  );
  const [managerCabinSize, setManagerCabinSize] = useState(areaValues.manager);
  const [receptionSize, setReceptionSize] = useState(areaValues.reception);
  const [loungeSize, setLoungeSize] = useState(areaValues.lounge);
  const [upsRoomSize, setUpsRoomSize] = useState(areaValues.ups);
  const [bmsRoomSize, setBmsRoomSize] = useState(areaValues.bms);
  const [washroomsSize, setWashroomsSize] = useState(areaValues.washrooms);
  const [warning, setWarning] = useState(false);
  const [otherArea, setOtherArea] = useState(0);

  const {
    totalArea,
    setTotalArea,
    totalAreaSource,
    currentLayoutData,
    isAuthenticated,
  } = useApp();

  const handleVariantNameChange = (areaValues) => {
    let newVariant;
    switch (areaValues.linear) {
      case 20:
        newVariant = "M";
        break;
      case 29:
        newVariant = "XL";
        break;
      case 24:
      default:
        newVariant = "L";
        break;
    }

    setVariant(newVariant);
  };

  const [runTour, setRunTour] = useState(false); // Controls whether the tour runs
  const [isOpen, setIsOpen] = useState(false);
  const [areaWarn, setAreaWarn] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null);

  const bufferSpace = 0.02; //buffer space

  const toggleProfile = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    setReceptionSize(areaValues.reception);
    setLoungeSize(areaValues.lounge);
    setWashroomsSize(areaValues.washrooms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setSeatCounts((prev) => {
      const newSeatCount = { ...prev };
      newSeatCount.linear = areaQuantities.linear ?? prev.linear;
      newSeatCount.lType = areaQuantities.lType ?? prev.lType;
      newSeatCount.md = areaValues.md >= 150 ? 4 : 3;

      return newSeatCount;
    });
  }, [areaValues, areaQuantities]);

  const handleTourCallback = (data) => {
    const { status } = data;

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem("hasSeenLayoutTour", "true");
    }
  };

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenLayoutTour") === "true";
    if (!hasSeenTour) {
      setRunTour(true); // Start the tour automatically on first visit
    }
  }, []);

  useEffect(() => {
    if (warning || areaWarn) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }
  }, [warning, areaWarn]);

  let tempVar = "";

  useEffect(() => {
    if (totalAreaSource !== "ErrorModal" && tempVar !== "layoutLoad") {
      const linear = calculateLinear(totalArea);
      const lType = calculateLType(totalArea, areaValues);
      const md = calculateMd(totalArea, areaValues);
      const manager = calculateManager(totalArea, areaValues);
      const small = calculateSmall(totalArea, areaValues);
      const interviewRoom = calculateInterviewRoom(totalArea, areaValues);
      const conferenceRoom = calculateConferenceRoom(totalArea, areaValues);
      const boardRoom = calculateBoardRoom(totalArea, areaValues);
      const meetingRoom = calculateMeetingRoom(totalArea, areaValues);
      const meetingRoomLarge = calculateMeetingRoomLarge(totalArea, areaValues);
      const videoRecordingRoom = calculateVideoRecordingRoom(
        totalArea,
        areaValues
      );
      const phoneBooth = calculatePhoneBooth(totalArea, areaValues);
      const server = calculateServer(totalArea, areaValues);
      const receptionArea = calculateReceptionArea(totalArea);
      const loungeArea = calculateLoungeArea(totalArea);
      const washroomsArea = calculateWashroomsArea(totalArea);

      setAreaQuantities((prevAreaQuantities) => ({
        ...prevAreaQuantities,
        linear: Math.round(linear / areaValues.linear),
        lType: lType / areaValues.lType,
        md: Math.round(md / areaValues.md),
        manager: manager / areaValues.manager,
        small: small / areaValues.small,
        interviewRoom: interviewRoom / areaValues.interviewRoom,
        conferenceRoom: conferenceRoom / areaValues.conferenceRoom,
        boardRoom: boardRoom / areaValues.boardRoom,
        meetingRoom: meetingRoom / areaValues.meetingRoom,
        meetingRoomLarge: meetingRoomLarge / areaValues.meetingRoomLarge,
        videoRecordingRoom: videoRecordingRoom / areaValues.videoRecordingRoom,
        phoneBooth: phoneBooth / areaValues.phoneBooth,
        server: server / areaValues.server,
      }));

      if (totalArea >= MIN_AREA && totalArea <= MAX_AREA) {
        setAreaValues((prevAreaValues) => ({
          ...prevAreaValues,
          reception: Math.round(receptionArea),
          lounge: Math.round(loungeArea),
          washrooms: Math.round(washroomsArea),
        }));
        setAreaQuantities((prevAreaQuantities) => ({
          ...prevAreaQuantities,
          reception: 1,
          lounge: 1,
          washrooms: 1,
        }));
      } else {
        setAreaQuantities(initialQuantities);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalArea, totalAreaSource]);

  const setErrorMessageHandler = (message) => {
    // setShowModal(true);
    setErrorMessage(message);
    setWarning(true);
  };

  const totalAreaWarning = () => {
    setAreaWarn(true);
  };

  useEffect(() => {
    const calculatedBuiltArea = Object.keys(areaQuantities).reduce(
      (acc, key) => {
        const qty = Number(areaQuantities[key]);
        const val = Number(areaValues[key]);

        const safeQty = isNaN(qty) ? 0 : qty;
        const safeVal = isNaN(val) ? 0 : val;

        return acc + safeQty * safeVal;
      },
      0
    );

    setBuiltArea(calculatedBuiltArea);
  }, [areaQuantities, areaValues]);

  useEffect(() => {
    setAvailableArea(totalArea - builtArea);
  }, [totalArea, builtArea]);

  useEffect(() => {
    if (currentLayoutData && Object.keys(currentLayoutData).length > 0) {
      if (isAuthenticated) {
        setTotalArea(currentLayoutData?.totalArea);
      }
      tempVar = "layoutLoad";
      const { areaValues, quantities } =
        extractAreaAndQuantity(currentLayoutData);

      setAreaValues(areaValues);
      setAreaQuantities(quantities);

      handleVariantNameChange(areaValues);
    }
  }, [currentLayoutData]); // only runs when currentLayoutData changes

  const updateAreas = (type, value) => {
    if (!totalArea) {
      totalAreaWarning();
      return;
    }

    const newAreaQuantities = { ...areaQuantities };
    const newAreaValues = { ...areaValues };

    if (type === "other") {
      newAreaValues[type] = value;
      if (value > 1) {
        newAreaQuantities[type] = 1;
      } else {
        newAreaQuantities[type] = 0; // Optional: Set to 0 if value is 0 or less
      }
    } else {
      newAreaQuantities[type] = value;
    }

    const calculatedBuiltArea = Object.keys(newAreaQuantities).reduce(
      (acc, key) => {
        const qty = Number(newAreaQuantities[key]);
        const val = Number(newAreaValues[key]);
        const safeQty = isNaN(qty) ? 0 : qty;
        const safeVal = isNaN(val) ? 0 : val;

        return acc + safeQty * safeVal;
      },
      0
    );

    const freeSpace = totalArea * bufferSpace;
    const usableArea = totalArea - freeSpace; // Area available for building

    if (
      totalArea >= MIN_AREA &&
      totalArea <= MAX_AREA &&
      calculatedBuiltArea <= usableArea
    ) {
      setBuiltArea(calculatedBuiltArea); // Update built area
      setAreaQuantities(newAreaQuantities); // Update area quantities
      setAreaValues(newAreaValues); // Update area values
    } else if (totalArea < MIN_AREA) {
      console.log("area is less than min area");
      toast.error("Enter valid area", { duration: 2000 });
    } else {
      console.log(
        "Built area exceeds the available space, showing error message"
      );
      setErrorMessageHandler(
        `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
          "Adjust the number of workspaces OR.\n" +
          "Increase the total area to add more workspaces."
      );
      if (type === "other") {
        setOtherArea(otherArea);
      }
    }
  };
  const updateSeatCounts = (type, value) => {
    const seatValue = Number(value);

    setSeatCounts((prev) => ({
      ...prev,
      [type]: seatValue,
    }));
  };

  const resetAll = () => {
    setTotalArea("");
    setAreaQuantities(initialQuantities);
  };

  const handleVariantChange = (newVariant) => {
    setVariant(newVariant);
    const newAreaValues = { ...areaValues };
    switch (newVariant) {
      case "M":
        newAreaValues.linear = 20;
        break;
      case "XL":
        newAreaValues.linear = 29;
        break;
      case "L":
      default:
        newAreaValues.linear = 24;
        break;
    }
    setAreaValues(newAreaValues);
  };

  const handleRoomAreaChange = (roomType, setRoomSize) => (newCabinSize) => {
    setRoomSize(newCabinSize);
    setAreaValues((prevAreaValues) => ({
      ...prevAreaValues,
      [roomType]: newCabinSize,
    }));
  };

  const handleMdCabinAreaChange = handleRoomAreaChange("md", setMdCabinSize);
  const handleSmallCabinAreaChange = handleRoomAreaChange(
    "small",
    setSmallCabinSize
  );
  const handleHrRoomAreaChange = handleRoomAreaChange("hrRoom", setHrRoomSize);
  const handleSalesRoomAreaChange = handleRoomAreaChange(
    "sales",
    setSalesRoomSize
  );
  const handleFinanceRoomAreaChange = handleRoomAreaChange(
    "financeRoom",
    setFinanceRoomSize
  );
  const handleBreakoutRoomAreaChange = handleRoomAreaChange(
    "breakoutRoom",
    setBreakoutRoomSize
  );
  const handleVideoRecordingRoomAreaChange = handleRoomAreaChange(
    "videoRecordingRoom",
    setVideoRecordingRoomSize
  );
  const handleConferenceRoomAreaChange = handleRoomAreaChange(
    "conferenceRoom",
    setConferenceRoomSize
  );
  const handleBoardRoomAreaChange = handleRoomAreaChange(
    "boardRoom",
    setBoardRoomSize
  );
  const handleManagerCabinSizeChange = handleRoomAreaChange(
    "manager",
    setManagerCabinSize
  );
  const handleReceptionSizeChange = handleRoomAreaChange(
    "reception",
    setReceptionSize
  );
  const handleLoungeSizeChange = handleRoomAreaChange("lounge", setLoungeSize);
  const handleUpsSizeChange = handleRoomAreaChange("ups", setUpsRoomSize);
  const handleBmsSizeChange = handleRoomAreaChange("bms", setBmsRoomSize);
  const handleWashroomsSizeChange = handleRoomAreaChange(
    "washrooms",
    setWashroomsSize
  );

  const hrRoomConfig = {
    seatCount: seatCounts.hrRoom,
    setSeatCount: (value) => updateSeatCounts("hrRoom", value),
    roomSize: hrRoomSize,
    setRoomSize: handleHrRoomAreaChange,
  };

  const salesRoomConfig = {
    seatCount: seatCounts.sales,
    setSeatCount: (value) => updateSeatCounts("sales", value),
    roomSize: salesRoomSize,
    setRoomSize: handleSalesRoomAreaChange,
  };

  const financeRoomConfig = {
    seatCount: seatCounts.financeRoom,
    setSeatCount: (value) => updateSeatCounts("financeRoom", value),
    roomSize: financeRoomSize,
    setRoomSize: handleFinanceRoomAreaChange,
  };

  const smallCabinConfig = {
    seatCount: seatCounts.small,
    setSeatCount: (value) => updateSeatCounts("small", value),
    roomSize: smallCabinSize,
    setRoomSize: handleSmallCabinAreaChange,
  };
  const boardRoomConfig = {
    seatCount: seatCounts.boardRoom,
    setSeatCount: (value) => updateSeatCounts("boardRoom", value),
    roomSize: boardRoomSize,
    setRoomSize: handleBoardRoomAreaChange,
  };
  const conferenceRoomConfig = {
    seatCount: seatCounts.conferenceRoom,
    setSeatCount: (value) => updateSeatCounts("conferenceRoom", value),
    roomSize: conferenceRoomSize,
    setRoomSize: handleConferenceRoomAreaChange,
  };

  const areaInfo = {
    totalArea,
    builtArea,
  };

  return (
    <div className="max-h-lvh xl:overflow-y-hidden">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        callback={handleTourCallback}
        scrollToFirstStep
        styles={{
          options: {
            zIndex: 10000,
            backgroundColor: "#A9D3CE",
            arrowColor: "#A9D3CE",
            primaryColor: "#6366f1", // Tailwind's Indigo-500
            overlayColor: "rgba(0, 0, 0, 0.5)",
          },
          buttonNext: {
            backgroundColor: "#34bfad",
            borderRadius: 4,
            color: "#000",
            padding: 10,
            font: "semibold",
          },
          buttonSkip: {
            color: "#797979",
            font: "semibold",
            fontSize: 16,
          },
        }}
      />
      <div className="navbar">
        <Navbar
          resetAll={resetAll}
          areaQuantities={areaQuantities}
          areaValues={areaValues}
          toggleProfile={toggleProfile}
          iconRef={iconRef}
          builtArea={builtArea}
          setAreaQuantities={setAreaQuantities}
          handleVariantChange={handleVariantNameChange}
          seatCounts={seatCounts}
        />
      </div>

      <div className="content w-full lg:flex justify-between gap-3 p-2 3xl:container">
        <div className="area-distribution-chart h-full w-full lg:w-1/2 px-3">
          <Spacebar
            builtArea={builtArea}
            availableArea={availableArea}
            totalArea={totalArea}
          />
          <TreeMap
            totalArea={totalArea}
            areaValues={areaValues}
            areaQuantities={areaQuantities}
            seatCounts={seatCounts}
          />
        </div>
        <div className="sections w-full lg:w-1/2 lg:overflow-auto lg:max-h-lvh pb-24 scrollbar-hide mt-2 ">
          <OpenWorkspaces
            areaQuantities={areaQuantities}
            variant={variant}
            setVariant={setVariant}
            updateAreas={updateAreas}
            onVariantChange={handleVariantChange}
            builtArea={builtArea}
          />
          <Cabins
            areaQuantities={areaQuantities}
            updateAreas={updateAreas}
            mdCabinSize={mdCabinSize}
            setMdCabinSize={handleMdCabinAreaChange}
            smallCabinConfig={smallCabinConfig}
            totalArea={totalArea}
            builtArea={builtArea}
            managerCabinSize={managerCabinSize}
            setManagerCabinSize={handleManagerCabinSizeChange}
          />
          <MeetingRooms
            areaQuantities={areaQuantities}
            updateAreas={updateAreas}
            hrRoomConfig={hrRoomConfig}
            salesRoomConfig={salesRoomConfig}
            financeRoomConfig={financeRoomConfig}
            areaInfo={areaInfo}
            videoRecordingRoomSize={videoRecordingRoomSize}
            setVideoRecordingRoomSize={handleVideoRecordingRoomAreaChange}
            conferenceRoomSize={conferenceRoomSize}
            setConferenceRoomSize={handleConferenceRoomAreaChange}
            boardRoomSize={boardRoomSize}
            setBoardRoomSize={handleBoardRoomAreaChange}
            boardRoomConfig={boardRoomConfig}
            conferenceRoomConfig={conferenceRoomConfig}
          />
          <PublicSpaces
            areaQuantities={areaQuantities}
            updateAreas={updateAreas}
            breakoutRoomSize={breakoutRoomSize}
            setBreakoutRoomSize={handleBreakoutRoomAreaChange}
            totalArea={totalArea}
            builtArea={builtArea}
            receptionSize={receptionSize}
            setReceptionSize={handleReceptionSizeChange}
            loungeSize={loungeSize}
            setLoungeSize={handleLoungeSizeChange}
            washroomsSize={washroomsSize}
            setWashroomsSize={handleWashroomsSizeChange}
          />
          <SupportSpaces
            areaQuantities={areaQuantities}
            updateAreas={updateAreas}
            otherArea={otherArea}
            setOtherArea={setOtherArea}
            upsRoomSize={upsRoomSize}
            setUpsRoomSize={handleUpsSizeChange}
            bmsRoomSize={bmsRoomSize}
            setBmsRoomSize={handleBmsSizeChange}
            builtArea={builtArea}
          />
        </div>
      </div>
      {warning && (
        <ErrorModal onclose={() => setWarning(false)} message={errorMessage} />
      )}
      {areaWarn && <EnterAreaModal onclose={() => setAreaWarn(false)} />}
      <AnimatePresence>
        {isOpen && (
          <div ref={profileRef}>
            <ProfileCard
              layout={true}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              iconRef={iconRef}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Layout;
