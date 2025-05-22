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
import { extractAreaAndQuantity } from "../../utils/layoutUtils";

const initialAreaValues = {
  linear: 24,
  lType: 34,
  md: 120,
  manager: 80,
  small: 80,
  ups: 60,
  bms: 60,
  server: 40,
  reception: 80,
  lounge: 80,
  sales: 80,
  phoneBooth: 25,
  discussionRoom: 380,
  interviewRoom: 100,
  conferenceRoom: 250,
  boardRoom: 380,
  meetingRoom: 120,
  meetingRoomLarge: 150,
  hrRoom: 80,
  financeRoom: 100,
  breakoutRoom: 80,
  executiveWashroom: 60,
  videoRecordingRoom: 80,
  other: 1,
  // maleWashroom: 60,
  // femaleWashroom: 60,
  washrooms: 100,
};

const initialQuantities = {
  linear: 0,
  lType: 0,
  md: 0,
  manager: 0,
  small: 0,
  ups: 0,
  bms: 0,
  server: 0,
  reception: 0,
  lounge: 0,
  sales: 0,
  phoneBooth: 0,
  discussionRoom: 0,
  interviewRoom: 0,
  conferenceRoom: 0,
  boardRoom: 0,
  meetingRoom: 0,
  meetingRoomLarge: 0,
  hrRoom: 0,
  financeRoom: 0,
  breakoutRoom: 0,
  executiveWashroom: 0,
  videoRecordingRoom: 0,
  other: 0,
  // maleWashroom: 0,
  // femaleWashroom: 0,
  washrooms: 0,
};

const MAX_AREA = 25000;
const MIN_AREA = 1000;

const calculateReceptionArea = (totalArea) => {
  if (totalArea >= MIN_AREA && totalArea <= MAX_AREA) {
    if (totalArea >= 1000 && totalArea <= 2000) {
      return Math.round(totalArea * 0.055);
    } else if (totalArea >= 2000 && totalArea <= 10000) {
      return Math.round(totalArea * 0.05);
    } else if (totalArea >= 10000 && totalArea <= 12000) {
      return Math.round(totalArea * 0.0475);
    } else if (totalArea >= 12000 && totalArea <= 14000) {
      return Math.round(totalArea * 0.045);
    } else if (totalArea >= 14000 && totalArea <= 16000) {
      return Math.round(totalArea * 0.0425);
    } else if (totalArea >= 16000 && totalArea <= 18000) {
      return Math.round(totalArea * 0.04);
    } else if (totalArea >= 18000 && totalArea <= 19000) {
      return Math.round(totalArea * 0.0375);
    } else if (totalArea >= 19000 && totalArea <= 20000) {
      return Math.round(totalArea * 0.035);
    } else if (totalArea >= 20000 && totalArea <= 21000) {
      return Math.round(totalArea * 0.0325);
    } else if (totalArea >= 21000 && totalArea <= 22000) {
      return Math.round(totalArea * 0.03);
    } else if (totalArea >= 22000 && totalArea <= 23000) {
      return Math.round(totalArea * 0.0275);
    } else if (totalArea >= 23000 && totalArea <= 24000) {
      return Math.round(totalArea * 0.025);
    } else if (totalArea >= 24000 && totalArea <= 25000) {
      return Math.round(totalArea * 0.02);
    }
  } else {
    return 1;
  }
};

const calculateLoungeArea = (totalArea) => {
  if (totalArea >= 1000 && totalArea < 2000) {
    return Math.round(totalArea * 0.11);
  } else if (totalArea >= 2000 && totalArea < 3000) {
    return Math.round(totalArea * 0.08);
  } else if (totalArea >= 3000 && totalArea < 4000) {
    return Math.round(totalArea * 0.065);
  } else if (totalArea >= 4000 && totalArea < 5000) {
    return Math.round(totalArea * 0.06);
  } else if (totalArea >= 5000 && totalArea < 6000) {
    return Math.round(totalArea * 0.05);
  } else if (totalArea >= 6000 && totalArea < 7000) {
    return Math.round(totalArea * 0.047);
  } else if (totalArea >= 7000 && totalArea < 8000) {
    return Math.round(totalArea * 0.046);
  } else if (totalArea >= 8000 && totalArea < 12000) {
    return Math.round(totalArea * 0.045);
  } else if (totalArea >= 12000 && totalArea < 13000) {
    return Math.round(totalArea * 0.043);
  } else if (totalArea >= 13000 && totalArea < 14000) {
    return Math.round(totalArea * 0.0407);
  } else if (totalArea >= 14000 && totalArea <= 25000) {
    return Math.round(totalArea * 0.04);
  } else {
    return 0;
  }
};

const calculateLinear = (totalArea) => {
  if (totalArea >= 1000 && totalArea < 2000) {
    return Math.round(totalArea * 0.3);
  } else if (totalArea >= 2000 && totalArea < 6000) {
    return Math.round(totalArea * 0.36);
  } else if (totalArea >= 6000 && totalArea < 10000) {
    return Math.round(totalArea * 0.38);
  } else if (totalArea >= 10000 && totalArea <= 25000) {
    return Math.round(totalArea * 0.4);
  } else {
    return 0;
  }
};

const calculateLType = (totalArea, areaValues) => {
  if (totalArea >= 8000 && totalArea < 9000) {
    return areaValues.lType * 5;
  } else if (totalArea >= 9000 && totalArea < 14000) {
    return areaValues.lType * 10;
  } else if (totalArea >= 14000 && totalArea < 18000) {
    return areaValues.lType * 15;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.lType * 20;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.lType * 25;
  } else {
    return 0;
  }
};

const calculateMd = (totalArea, areaValues) => {
  if (totalArea >= 1000 && totalArea < 6000) {
    return areaValues.md * 1;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.md * 2;
  } else if (totalArea >= 9000 && totalArea < 12000) {
    return areaValues.md * 3;
  } else if (totalArea >= 12000 && totalArea < 15000) {
    return areaValues.md * 4;
  } else if (totalArea >= 15000 && totalArea < 18000) {
    return areaValues.md * 5;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.md * 6;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.md * 7;
  } else {
    return 0;
  }
};

const calculateManager = (totalArea, areaValues) => {
  if (totalArea >= 2000 && totalArea < 3000) {
    return areaValues.manager * 1;
  } else if (totalArea >= 3000 && totalArea < 6000) {
    return areaValues.manager * 2;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.manager * 3;
  } else if (totalArea >= 9000 && totalArea < 12000) {
    return areaValues.manager * 4;
  } else if (totalArea >= 12000 && totalArea < 15000) {
    return areaValues.manager * 5;
  } else if (totalArea >= 15000 && totalArea < 18000) {
    return areaValues.manager * 6;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.manager * 7;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.manager * 8;
  } else {
    return 0;
  }
};

const calculateSmall = (totalArea, areaValues) => {
  if (totalArea >= 2000 && totalArea < 3000) {
    return areaValues.small * 1;
  } else if (totalArea >= 3000 && totalArea < 6000) {
    return areaValues.small * 2;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.small * 3;
  } else if (totalArea >= 9000 && totalArea <= 25000) {
    return areaValues.small * 4;
  } else {
    return 0;
  }
};

// const calculateDiscussionRoom = (totalArea, areaValues) => {
//   if (totalArea >= 12000 && totalArea <= 25000) {
//     return areaValues.discussionRoom * 1;
//   } else {
//     return 0;
//   }
// };

const calculateInterviewRoom = (totalArea, areaValues) => {
  if (totalArea >= 6000 && totalArea < 12000) {
    return areaValues.interviewRoom * 1;
  } else if (totalArea >= 12000 && totalArea <= 25000) {
    return areaValues.interviewRoom * 2;
  } else {
    return 0;
  }
};

const calculateConferenceRoom = (totalArea, areaValues) => {
  if (totalArea >= 3000 && totalArea < 8000) {
    return areaValues.conferenceRoom * 1;
  } else if (totalArea >= 8000 && totalArea < 15000) {
    return areaValues.conferenceRoom * 2;
  } else if (totalArea >= 15000 && totalArea < 18000) {
    return areaValues.conferenceRoom * 3;
  } else if (totalArea >= 18000 && totalArea < 21000) {
    return areaValues.conferenceRoom * 4;
  } else if (totalArea >= 21000 && totalArea <= 25000) {
    return areaValues.conferenceRoom * 5;
  } else {
    return 0;
  }
};

const calculateBoardRoom = (totalArea, areaValues) => {
  if (totalArea >= 12000 && totalArea <= 25000) {
    return areaValues.boardRoom * 1;
  } else {
    return 0;
  }
};

const calculateMeetingRoom = (totalArea, areaValues) => {
  if (totalArea >= 1000 && totalArea < 3000) {
    return areaValues.meetingRoom * 1;
  } else if (totalArea >= 3000 && totalArea < 6000) {
    return areaValues.meetingRoom * 2;
  } else if (totalArea >= 6000 && totalArea < 9000) {
    return areaValues.meetingRoom * 3;
  } else if (totalArea >= 9000 && totalArea < 12000) {
    return areaValues.meetingRoom * 4;
  } else if (totalArea >= 12000 && totalArea <= 25000) {
    return areaValues.meetingRoom * 6;
  } else {
    return 0;
  }
};

const calculateMeetingRoomLarge = (totalArea, areaValues) => {
  if (totalArea >= 14000 && totalArea < 15000) {
    return areaValues.meetingRoomLarge * 1;
  } else if (totalArea >= 15000 && totalArea <= 25000) {
    return areaValues.meetingRoomLarge * 2;
  } else {
    return 0;
  }
};

const calculateVideoRecordingRoom = (totalArea, areaValues) => {
  if (totalArea >= 15000 && totalArea <= 25000) {
    return areaValues.videoRecordingRoom * 1;
  } else {
    return 0;
  }
};

const calculatePhoneBooth = (totalArea, areaValues) => {
  if (totalArea >= 3000 && totalArea < 9000) {
    return areaValues.phoneBooth * 2;
  } else if (totalArea >= 9000 && totalArea < 18000) {
    return areaValues.phoneBooth * 4;
  } else if (totalArea >= 18000 && totalArea <= 25000) {
    return areaValues.phoneBooth * 8;
  } else {
    return 0;
  }
};

const calculateServer = (totalArea, areaValues) => {
  if (totalArea >= 2000 && totalArea < 6000) {
    return areaValues.server * 1;
  } else if (totalArea >= 6000 && totalArea < 12000) {
    return areaValues.server * 2;
  } else if (totalArea >= 12000 && totalArea < 18000) {
    return areaValues.server * 4;
  } else if (totalArea >= 18000 && totalArea <= 25000) {
    return areaValues.server * 8;
  } else {
    return 0;
  }
};

// const calculateExecutiveWashroom = (totalArea, areaValues) => {
//   if (totalArea >= 9000 && totalArea <= 25000) {
//     return areaValues.executiveWashroom * 2;
//   } else {
//     return 0;
//   }
// };
// const calculateMaleWashroomArea = (totalArea) => {
//   if (totalArea >= 1000 && totalArea < 2000) {
//     return Math.round(totalArea * 0.06);
//   } else if (totalArea >= 2000 && totalArea < 3000) {
//     return Math.round(totalArea * 0.05);
//   } else if (totalArea >= 3000 && totalArea < 4000) {
//     return Math.round(totalArea * 0.04);
//   } else if (totalArea >= 4000 && totalArea < 10000) {
//     return Math.round(totalArea * 0.025);
//   } else if (totalArea >= 10000 && totalArea < 12000) {
//     return Math.round(totalArea * 0.02375);
//   } else if (totalArea >= 12000 && totalArea < 14000) {
//     return Math.round(totalArea * 0.023);
//   } else if (totalArea >= 14000 && totalArea < 16000) {
//     return Math.round(totalArea * 0.0225);
//   } else if (totalArea >= 16000 && totalArea < 20000) {
//     return Math.round(totalArea * 0.022);
//   } else if (totalArea >= 20000 && totalArea < 22000) {
//     return Math.round(totalArea * 0.0215);
//   } else if (totalArea >= 22000 && totalArea < 24000) {
//     return Math.round(totalArea * 0.021);
//   } else if (totalArea >= 24000 && totalArea <= 25000) {
//     return Math.round(totalArea * 0.02);
//   } else {
//     return 0;
//   }
// };

// const calculateFemaleWashroomArea = (totalArea) => {
//   if (totalArea >= 1000 && totalArea < 2000) {
//     return Math.round(totalArea * 0.06);
//   } else if (totalArea >= 2000 && totalArea < 3000) {
//     return Math.round(totalArea * 0.05);
//   } else if (totalArea >= 3000 && totalArea < 4000) {
//     return Math.round(totalArea * 0.04);
//   } else if (totalArea >= 4000 && totalArea < 10000) {
//     return Math.round(totalArea * 0.025);
//   } else if (totalArea >= 10000 && totalArea < 12000) {
//     return Math.round(totalArea * 0.02375);
//   } else if (totalArea >= 12000 && totalArea < 14000) {
//     return Math.round(totalArea * 0.023);
//   } else if (totalArea >= 14000 && totalArea < 16000) {
//     return Math.round(totalArea * 0.0225);
//   } else if (totalArea >= 16000 && totalArea < 20000) {
//     return Math.round(totalArea * 0.022);
//   } else if (totalArea >= 20000 && totalArea < 22000) {
//     return Math.round(totalArea * 0.0215);
//   } else if (totalArea >= 22000 && totalArea < 24000) {
//     return Math.round(totalArea * 0.021);
//   } else if (totalArea >= 24000 && totalArea <= 25000) {
//     return Math.round(totalArea * 0.02);
//   } else {
//     return 0;
//   }
// };

const calculateWashroomsArea = (totalArea) => {
  if (totalArea >= 1000 && totalArea < 2000) {
    return Math.round(totalArea * 0.12);
  } else if (totalArea >= 2000 && totalArea < 3000) {
    return Math.round(totalArea * 0.1);
  } else if (totalArea >= 3000 && totalArea < 4000) {
    return Math.round(totalArea * 0.08);
  } else if (totalArea >= 4000 && totalArea < 10000) {
    return Math.round(totalArea * 0.05);
  } else if (totalArea >= 10000 && totalArea < 12000) {
    return Math.round(totalArea * 0.0475);
  } else if (totalArea >= 12000 && totalArea < 14000) {
    return Math.round(totalArea * 0.046);
  } else if (totalArea >= 14000 && totalArea < 16000) {
    return Math.round(totalArea * 0.045);
  } else if (totalArea >= 16000 && totalArea < 20000) {
    return Math.round(totalArea * 0.044);
  } else if (totalArea >= 20000 && totalArea < 22000) {
    return Math.round(totalArea * 0.043);
  } else if (totalArea >= 22000 && totalArea < 24000) {
    return Math.round(totalArea * 0.042);
  } else if (totalArea >= 24000 && totalArea <= 25000) {
    return Math.round(totalArea * 0.04);
  } else {
    return 0;
  }
};

function Layout() {
  // const [totalArea, setTotalArea] = useState(0);
  const [builtArea, setBuiltArea] = useState(0);
  const [availableArea, setAvailableArea] = useState(0);
  const [areaValues, setAreaValues] = useState(initialAreaValues);
  const [areaQuantities, setAreaQuantities] = useState(initialQuantities);
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
  // const [maleWashroomSize, setMaleWashroomSize] = useState(
  //   areaValues.maleWashroom
  // );
  // const [femaleWashroomSize, setFemaleWashroomSize] = useState(
  //   areaValues.femaleWashroom
  // );
  const [washroomsSize, setWashroomsSize] = useState(areaValues.washrooms);
  const [smallCabinSeatCount, setSmallCabinSeatCount] = useState(0);
  const [hrRoomSeatCount, setHrRoomSeatCount] = useState(0);
  const [salesSeatCount, setSalesSeatCount] = useState(0);
  const [financeRoomSeatCount, setFinanceRoomSeatCount] = useState(0);
  const [boardRoomSeatCount, setBoardRoomSeatCount] = useState(0);
  const [conferenceRoomSeatCount, setConferenceRoomSeatCount] = useState(0);
  const [warning, setWarning] = useState(false);
  const [otherArea, setOtherArea] = useState();

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

  // const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [areaWarn, setAreaWarn] = useState(false);
  const profileRef = useRef(null);
  const iconRef = useRef(null);

  // const bufferSpace = totalArea < 5000 ? 0.05 : totalArea <= 10000 ? 0.03 : 0; //buffer space
  const bufferSpace = 0.02; //buffer space
  // console.log("male washroom", maleWashroomSize);

  // Toggle profile card visibility
  const toggleProfile = () => {
    setIsOpen((prev) => !prev);
  };

  // Close profile card when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       profileRef.current?.contains(event.target) ||
  //       iconRef.current?.contains(event.target)
  //     ) {
  //       return; // If clicked inside, do nothing
  //     }
  //     setIsOpen(false); // Otherwise, close it
  //   };

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen]);

  useEffect(() => {
    setReceptionSize(areaValues.reception);
    setLoungeSize(areaValues.lounge);
    // setMaleWashroomSize(areaValues.maleWashroom);
    // setFemaleWashroomSize(areaValues.femaleWashroom);
    setWashroomsSize(areaValues.washrooms);
  });

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

  // Handle the completion or skipping of the tour
  const handleTourCallback = (data) => {
    const { status } = data;

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      localStorage.setItem("hasSeenLayoutTour", "true");
    }
  };

  useEffect(() => {
    // Check localStorage to decide if the tour should run
    const hasSeenTour = localStorage.getItem("hasSeenLayoutTour");
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

  // Only run the tour for first-time visitors
  //   useEffect(() => {
  //     const hasSeenTour = localStorage.getItem("hasSeenLayoutTour");
  //     if (hasSeenTour) {
  //       setRunTour(false); // Don't run the tour if already completed
  //     }
  //   }, []);

  // useEffect(() => {
  //     document.title = '603 Layout';
  // }, []);

  let tempVar = "";

  useEffect(() => {
    if (totalAreaSource !== "ErrorModal" || tempVar !== "layoutLoad") {
      const linear = calculateLinear(totalArea);
      const lType = calculateLType(totalArea, areaValues);
      const md = calculateMd(totalArea, areaValues);
      const manager = calculateManager(totalArea, areaValues);
      const small = calculateSmall(totalArea, areaValues);
      // const discussionRoom = calculateDiscussionRoom(totalArea, areaValues);
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
      // const executiveWashroom = calculateExecutiveWashroom(
      //   totalArea,
      //   areaValues
      // );
      const receptionArea = calculateReceptionArea(totalArea);
      const loungeArea = calculateLoungeArea(totalArea);
      const otherArea = 0;
      // const maleWashroom = calculateMaleWashroomArea(totalArea);
      // const femaleWashroom = calculateFemaleWashroomArea(totalArea);
      const washroomsArea = calculateWashroomsArea(totalArea);

      setAreaQuantities((prevAreaQuantities) => ({
        ...prevAreaQuantities,
        linear: Math.round(linear / areaValues.linear),
        lType: lType / areaValues.lType,
        md: Math.round(md / areaValues.md),
        manager: manager / areaValues.manager,
        small: small / areaValues.small,
        // discussionRoom: discussionRoom / areaValues.discussionRoom,
        interviewRoom: interviewRoom / areaValues.interviewRoom,
        conferenceRoom: conferenceRoom / areaValues.conferenceRoom,
        boardRoom: boardRoom / areaValues.boardRoom,
        meetingRoom: meetingRoom / areaValues.meetingRoom,
        meetingRoomLarge: meetingRoomLarge / areaValues.meetingRoomLarge,
        videoRecordingRoom: videoRecordingRoom / areaValues.videoRecordingRoom,
        phoneBooth: phoneBooth / areaValues.phoneBooth,
        server: server / areaValues.server,
        // executiveWashroom: executiveWashroom / areaValues.executiveWashroom,
        // reception: Math.round(receptionArea / areaValues.reception),
        // lounge: Math.round(loungeArea / areaValues.lounge),
        other: otherArea / areaValues.other,
      }));

      if (totalArea >= MIN_AREA && totalArea <= MAX_AREA) {
        setAreaValues((prevAreaValues) => ({
          ...prevAreaValues,
          reception: Math.round(receptionArea),
          lounge: Math.round(loungeArea),
          // maleWashroom: Math.round(maleWashroom),
          // femaleWashroom: Math.round(femaleWashroom),
          washrooms: Math.round(washroomsArea),
        }));
        setAreaQuantities((prevAreaQuantities) => ({
          ...prevAreaQuantities,
          reception: 1,
          lounge: 1,
          // maleWashroom: 1,
          // femaleWashroom: 1,
          washrooms: 1,
        }));
      } else {
        // setAreaQuantities((prevAreaQuantities) => ({
        //   ...prevAreaQuantities,
        //   reception: 0,
        //   lounge: 0,
        //   // maleWashroom: 0,
        //   // femaleWashroom: 0,
        //   washrooms: 0,
        // }));
        setAreaQuantities(initialQuantities);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalArea, totalAreaSource]); //do not add any more dependency

  const setErrorMessageHandler = (message) => {
    // setShowModal(true);
    setErrorMessage(message);
    setWarning(true);
  };

  const totalAreaWarning = () => {
    setAreaWarn(true);
  };

  // Calculate builtArea and set it to state
  useEffect(() => {
    const calculatedBuiltArea = Object.keys(areaQuantities).reduce(
      (acc, key) => acc + areaQuantities[key] * areaValues[key],
      0
    );
    setBuiltArea(calculatedBuiltArea);
  }, [areaQuantities, areaValues]);

  // Calculate availableArea based on totalArea and builtArea
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
    // Ensure the total area is entered before making changes
    if (!totalArea) {
      // setErrorMessageHandler(
      //   "The input box for total area cannot be left empty.\n" +
      //     "Please fill in the total area in square feet before making any changes."
      // );
      totalAreaWarning();
      return;
    }

    // Clone current area values and area quantities
    const newAreaQuantities = { ...areaQuantities };
    const newAreaValues = { ...areaValues };

    if (type === "other") {
      // Update areaValues for 'other'
      newAreaValues[type] = value;

      // Ensure areaQuantities for 'other' is 1 if areaValues of 'other' is greater than 1
      if (value > 1) {
        newAreaQuantities[type] = 1;
      } else {
        newAreaQuantities[type] = 0; // Optional: Set to 0 if value is 0 or less
      }
    } else {
      // Update areaQuantities for other types
      newAreaQuantities[type] = value;
    }

    // Calculate the built area
    const calculatedBuiltArea = Object.keys(newAreaQuantities).reduce(
      (acc, key) => acc + newAreaQuantities[key] * newAreaValues[key],
      0
    );

    const freeSpace = totalArea * bufferSpace;
    const usableArea = totalArea - freeSpace; // Area available for building

    // Check if the built area exceeds the usable area
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
        // "The built area exceeds the available usable space.\n" +
        //   "To resolve this, either increase the total area or adjust the number of rooms to ensure the built area fits within the usable space."
        `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
          "Adjust the number of workspaces OR.\n" +
          "Increase the total area to add more workspaces."
      );
      if (type === "other") {
        setOtherArea(otherArea);
      }
    }
  };

  const resetAll = () => {
    setTotalArea("");
    // setInputValue("");
    setAreaQuantities(initialQuantities);
  };

  const handleVariantChange = (newVariant) => {
    console.log("newVariant", newVariant);
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
  // const handleMaleWashroomSizeChange = handleRoomAreaChange(
  //   "maleWashroom",
  //   setMaleWashroomSize
  // );
  // const handleFemaleWashroomSizeChange = handleRoomAreaChange(
  //   "femaleWashroom",
  //   setFemaleWashroomSize
  // );
  const handleWashroomsSizeChange = handleRoomAreaChange(
    "washrooms",
    setWashroomsSize
  );

  const handleSeatCountChange = (setter) => (newCount) => {
    setter(newCount);
  };

  const handleSmallCabinSeatCountChange = handleSeatCountChange(
    setSmallCabinSeatCount
  );
  const handleHrRoomSeatCountChange = handleSeatCountChange(setHrRoomSeatCount);
  const handleSalesRoomSeatCountChange =
    handleSeatCountChange(setSalesSeatCount);
  const handleFinanceRoomSeatCountChange = handleSeatCountChange(
    setFinanceRoomSeatCount
  );
  const handleBoardRoomSeatCountChange = handleSeatCountChange(
    setBoardRoomSeatCount
  );

  const handleConferenceRoomSeatCountChange = handleSeatCountChange(
    setConferenceRoomSeatCount
  );

  const hrRoomConfig = {
    seatCount: hrRoomSeatCount,
    setSeatCount: handleHrRoomSeatCountChange,
    roomSize: hrRoomSize,
    setRoomSize: handleHrRoomAreaChange,
  };

  const salesRoomConfig = {
    seatCount: salesSeatCount,
    setSeatCount: handleSalesRoomSeatCountChange,
    roomSize: salesRoomSize,
    setRoomSize: handleSalesRoomAreaChange,
  };

  const financeRoomConfig = {
    seatCount: financeRoomSeatCount,
    setSeatCount: handleFinanceRoomSeatCountChange,
    roomSize: financeRoomSize,
    setRoomSize: handleFinanceRoomAreaChange,
  };

  const smallCabinConfig = {
    seatCount: smallCabinSeatCount,
    setSeatCount: handleSmallCabinSeatCountChange,
    roomSize: smallCabinSize,
    setRoomSize: handleSmallCabinAreaChange,
  };
  const boardRoomConfig = {
    seatCount: boardRoomSeatCount,
    setSeatCount: handleBoardRoomSeatCountChange,
    roomSize: boardRoomSize,
    setRoomSize: handleBoardRoomAreaChange,
  };
  const conferenceRoomConfig = {
    seatCount: conferenceRoomSeatCount,
    setSeatCount: handleConferenceRoomSeatCountChange,
    roomSize: conferenceRoomSize,
    setRoomSize: handleConferenceRoomAreaChange,
  };

  const areaInfo = {
    totalArea,
    builtArea,
  };

  return (
    // <div className="max-h-lvh 2xl:overflow-y-hidden">
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
          MAX_AREA={MAX_AREA}
          MIN_AREA={MIN_AREA}
          resetAll={resetAll}
          areaQuantities={areaQuantities}
          areaValues={areaValues}
          toggleProfile={toggleProfile}
          iconRef={iconRef}
          builtArea={builtArea}
          setAreaQuantities={setAreaQuantities}
          handleVariantChange={handleVariantNameChange}
        />
      </div>

      <div className="content w-full lg:flex justify-between gap-3 p-2">
        <div className="area-distribution-chart h-full w-full lg:w-1/2 px-3 border-2 pl-5">
          <Spacebar
            builtArea={builtArea}
            availableArea={availableArea}
            totalArea={totalArea}
            MIN_AREA={MIN_AREA}
          />
          <TreeMap
            totalArea={totalArea}
            areaValues={areaValues}
            areaQuantities={areaQuantities}
          />
        </div>
        <div className="sections w-full lg:w-1/2 lg:overflow-auto lg:max-h-lvh pb-24 scrollbar-hide mt-2 ">
          <OpenWorkspaces
            areaQuantities={areaQuantities}
            variant={variant}
            setVariant={setVariant}
            updateAreas={updateAreas}
            onVariantChange={handleVariantChange}
            totalAreaWarning={totalAreaWarning}
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
            initialAreaValues={initialAreaValues}
            managerCabinSize={managerCabinSize}
            setManagerCabinSize={handleManagerCabinSizeChange}
            smallCabinSeatCount={smallCabinSeatCount}
          />
          <MeetingRooms
            areaQuantities={areaQuantities}
            updateAreas={updateAreas}
            hrRoomConfig={hrRoomConfig}
            salesRoomConfig={salesRoomConfig}
            financeRoomConfig={financeRoomConfig}
            areaInfo={areaInfo}
            initialAreaValues={initialAreaValues}
            videoRecordingRoomSize={videoRecordingRoomSize}
            setVideoRecordingRoomSize={handleVideoRecordingRoomAreaChange}
            conferenceRoomSize={conferenceRoomSize}
            setConferenceRoomSize={handleConferenceRoomAreaChange}
            boardRoomSize={boardRoomSize}
            setBoardRoomSize={handleBoardRoomAreaChange}
            hrRoomSeatCount={hrRoomSeatCount}
            setHrRoomSeatCount={setHrRoomSeatCount}
            salesSeatCount={salesSeatCount}
            setSalesSeatCount={setSalesSeatCount}
            financeRoomSeatCount={financeRoomSeatCount}
            setFinanceRoomSeatCount={setFinanceRoomSeatCount}
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
            initialAreaValues={initialAreaValues}
            receptionSize={receptionSize}
            setReceptionSize={handleReceptionSizeChange}
            loungeSize={loungeSize}
            setLoungeSize={handleLoungeSizeChange}
            // maleWashroomSize={maleWashroomSize}
            // setMaleWashroomSize={handleMaleWashroomSizeChange}
            // femaleWashroomSize={femaleWashroomSize}
            // setFemaleWashroomSize={handleFemaleWashroomSizeChange}
            washroomsSize={washroomsSize}
            setWashroomsSize={handleWashroomsSizeChange}
          />
          <SupportSpaces
            areaQuantities={areaQuantities}
            updateAreas={updateAreas}
            areaValues={areaValues}
            warning={warning}
            otherArea={otherArea}
            setOtherArea={setOtherArea}
            upsRoomSize={upsRoomSize}
            setUpsRoomSize={handleUpsSizeChange}
            bmsRoomSize={bmsRoomSize}
            setBmsRoomSize={handleBmsSizeChange}
            builtArea={builtArea}
            initialAreaValues={initialAreaValues}
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

      {/* <LayoutCard /> */}
      {/* <QnaPopup question="is the flooring project for residental purpose ?" /> */}
    </div>
  );
}

export default Layout;
