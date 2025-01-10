import { useEffect, useState } from "react"
import Navbar from '../components/Navbar'
import Spacebar from "../components/Spacebar"
import TreeMap from "../pages/TreeMap";
// import LayoutCard from "./layout/components/LayoutCard"
import OpenWorkspaces from "../pages/OpenWorkspaces";
import Cabins from "../pages/Cabins";
import MeetingRooms from "../pages/MeetingRooms";
import { useApp } from "../../Context/Context";
import SupportSpaces from "./SupportSpaces";
import PublicSpaces from "./PublicSpaces";
import ErrorModal from "../../components/ErrorModal";
// import QnaPopup from "./components/QnaPopup"

const initialAreaValues = {
    linear: 24,
    lType: 34,
    md: 120,
    manager: 80,
    small: 80,
    ups: 90,
    bms: 90,
    server: 40,
    reception: 80,
    lounge: 80,
    sales: 80,
    phoneBooth: 25,
    discussionRoom: 380,
    interviewRoom: 100,
    conferenceRoom: 250,
    boardRoom: 325,
    meetingRoom: 100,
    meetingRoomLarge: 120,
    hrRoom: 80,
    financeRoom: 100,
    breakoutRoom: 80,
    executiveWashroom: 60,
    videoRecordingRoom: 80,
    other: 1,
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
};

const MAX_AREA = 25000;
const MIN_AREA = 1000;

const calculateReceptionArea = (totalArea) => {
    if (totalArea >= 1000 && totalArea < 3500) {
        return Math.round(totalArea * 0.08);
    } else if (totalArea >= 3500 && totalArea < 4500) {
        return Math.round(totalArea * 0.06);
    } else if (totalArea >= 4500 && totalArea < 5500) {
        return Math.round(totalArea * 0.05);
    } else if (totalArea >= 5500 && totalArea < 6500) {
        return Math.round(totalArea * 0.045);
    } else if (totalArea >= 6500 && totalArea < 12000) {
        return 300;
    } else if (totalArea >= 12000 && totalArea < 18000) {
        return 500;
    } else if (totalArea >= 18000 && totalArea <= 25000) {
        return 700;
    } else {
        return 0;
    }
};

const calculateLoungeArea = (totalArea) => {
    if (totalArea >= 1000 && totalArea < 2500) {
        return Math.round(totalArea * 0.11);
    } else if (totalArea >= 2500 && totalArea < 4500) {
        return Math.round(totalArea * 0.06);
    } else if (totalArea >= 4500 && totalArea < 6500) {
        return Math.round(totalArea * 0.05);
    } else if (totalArea >= 6500 && totalArea < 8500) {
        return Math.round(totalArea * 0.045);
    } else if (totalArea >= 8500 && totalArea <= 10000) {
        return Math.round(totalArea * 0.04);
    } else if (totalArea > 10000 && totalArea <= 25000) {
        return Math.round(totalArea * 0.04);
    } else {
        return 0;
    }
};

const calculateLinear = (totalArea) => {
    if (totalArea >= 1000 && totalArea <= 25000) {
        return Math.round(totalArea * 0.40);
    } else {
        return 0;
    }
};

const calculateLType = (totalArea, areaValues) => {
    if (totalArea >= 9000 && totalArea < 12000) {
        return areaValues.lType * 5;
    } else if (totalArea >= 12000 && totalArea < 15000) {
        return areaValues.lType * 10;
    } else if (totalArea >= 15000 && totalArea < 18000) {
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
    if (totalArea >= 1500 && totalArea < 3000) {
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
    if (totalArea >= 1000 && totalArea < 3000) {
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

const calculateDiscussionRoom = (totalArea, areaValues) => {
    if (totalArea >= 12000 && totalArea <= 25000) {
        return areaValues.discussionRoom * 1;
    } else {
        return 0;
    }
};

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
    if (totalArea >= 9000 && totalArea < 15000) {
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
    if (totalArea >= 15000 && totalArea <= 25000) {
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
    if (totalArea >= 1000 && totalArea < 6000) {
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

const calculateExecutiveWashroom = (totalArea, areaValues) => {
    if (totalArea >= 9000 && totalArea <= 25000) {
        return areaValues.executiveWashroom * 2;
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
    const [variant, setVariant] = useState("large");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [mdCabinSize, setMdCabinSize] = useState(areaValues.md);
    const [breakoutRoomSize, setBreakoutRoomSize] = useState(areaValues.breakoutRoom);
    const [videoRecordingRoomSize, setVideoRecordingRoomSize] = useState(areaValues.videoRecordingRoom);
    const [conferenceRoomSize, setConferenceRoomSize] = useState(areaValues.conferenceRoom);
    const [boardRoomSize, setBoardRoomSize] = useState(areaValues.boardRoom);
    const [smallCabinSize, setSmallCabinSize] = useState(areaValues.small);
    const [hrRoomSize, setHrRoomSize] = useState(areaValues.hrRoom);
    const [salesRoomSize, setSalesRoomSize] = useState(areaValues.sales);
    const [financeRoomSize, setFinanceRoomSize] = useState(areaValues.financeRoom);
    const [managerCabinSize, setManagerCabinSize] = useState(areaValues.manager);
    const [receptionSize, setReceptionSize] = useState(areaValues.reception);
    const [loungeSize, setLoungeSize] = useState(areaValues.lounge)
    const [smallCabinSeatCount, setSmallCabinSeatCount] = useState(0);
    const [hrRoomSeatCount, setHrRoomSeatCount] = useState(0);
    const [salesSeatCount, setSalesSeatCount] = useState(0);
    const [financeRoomSeatCount, setFinanceRoomSeatCount] = useState(0);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [warning, setWarning] = useState(false);

    const { totalArea, setTotalArea } = useApp()


    // useEffect(() => {
    //     document.title = '603 Layout';
    // }, []);

    useEffect(() => {
        const linear = calculateLinear(totalArea);
        const lType = calculateLType(totalArea, areaValues);
        const md = calculateMd(totalArea, areaValues);
        const manager = calculateManager(totalArea, areaValues);
        const small = calculateSmall(totalArea, areaValues);
        const discussionRoom = calculateDiscussionRoom(totalArea, areaValues);
        const interviewRoom = calculateInterviewRoom(totalArea, areaValues);
        const conferenceRoom = calculateConferenceRoom(totalArea, areaValues);
        const boardRoom = calculateBoardRoom(totalArea, areaValues);
        const meetingRoom = calculateMeetingRoom(totalArea, areaValues);
        const meetingRoomLarge = calculateMeetingRoomLarge(totalArea, areaValues);
        const videoRecordingRoom = calculateVideoRecordingRoom(totalArea, areaValues);
        const phoneBooth = calculatePhoneBooth(totalArea, areaValues);
        const server = calculateServer(totalArea, areaValues);
        const executiveWashroom = calculateExecutiveWashroom(totalArea, areaValues);
        const receptionArea = calculateReceptionArea(totalArea);
        const loungeArea = calculateLoungeArea(totalArea);
        const otherArea = 0;

        setAreaQuantities((prevAreaQuantities) => ({
            ...prevAreaQuantities,
            linear: Math.round(linear / areaValues.linear),
            lType: lType / areaValues.lType,
            md: Math.round(md / areaValues.md),
            manager: manager / areaValues.manager,
            small: small / areaValues.small,
            discussionRoom: discussionRoom / areaValues.discussionRoom,
            interviewRoom: interviewRoom / areaValues.interviewRoom,
            conferenceRoom: conferenceRoom / areaValues.conferenceRoom,
            boardRoom: boardRoom / areaValues.boardRoom,
            meetingRoom: meetingRoom / areaValues.meetingRoom,
            meetingRoomLarge: meetingRoomLarge / areaValues.meetingRoomLarge,
            videoRecordingRoom: videoRecordingRoom / areaValues.videoRecordingRoom,
            phoneBooth: phoneBooth / areaValues.phoneBooth,
            server: server / areaValues.server,
            executiveWashroom: executiveWashroom / areaValues.executiveWashroom,
            reception: Math.round(receptionArea / areaValues.reception),
            lounge: Math.round(loungeArea / areaValues.lounge),
            other: otherArea / areaValues.other,
        }))

    }, [totalArea])

    const setErrorMessageHandler = (message) => {
        setError(true);
        // setShowModal(true);
        setErrorMessage(message);
        setWarning(true);
    };

    // Calculate builtArea and set it to state
    useEffect(() => {
        const calculatedBuiltArea = Object.keys(areaQuantities).reduce(
            (acc, key) => acc + areaQuantities[key] * areaValues[key],
            0
        );
        setBuiltArea(calculatedBuiltArea);
        // console.log("Built area cal:", calculatedBuiltArea, "Areas:", areas, "Area values:", areaValues);
    }, [areaQuantities, areaValues]);

    // Calculate availableArea based on totalArea and builtArea
    useEffect(() => {
        setAvailableArea(totalArea - builtArea);
        // console.log("Available area:", availableArea);
        // console.log("Built area:", builtArea);
    }, [totalArea, builtArea]);

    const updateAreas = (type, value) => {
        // Ensure the total area is entered before making changes
        if (!totalArea) {
            setErrorMessageHandler(
                "The input box for total area cannot be left empty.\n" +
                "Please fill in the total area in square feet before making any changes."
            );
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

        const freeSpace = totalArea * 0.05; // 5% of totalArea
        const usableArea = totalArea - freeSpace; // Area available for building

        // Check if the built area exceeds the usable area
        if (calculatedBuiltArea <= usableArea) {
            setBuiltArea(calculatedBuiltArea); // Update built area
            setAreaQuantities(newAreaQuantities); // Update area quantities
            setAreaValues(newAreaValues); // Update area values
            setError(false);
        } else {
            console.log("Built area exceeds the available space, showing error message");
            setErrorMessageHandler(
                "The built area exceeds the available usable space.\n" +
                "To resolve this, either increase the total area or adjust the number of rooms to ensure the built area fits within the usable space."
            );
        }
    };



    const resetAll = () => {
        setTotalArea(0);
        // setSmallCabinSeatCount(0);
        // setHrRoomSeatCount(0);
        // setSalesSeatCount(0);
        // setFinanceRoomSeatCount(0);
        setAreaQuantities(initialQuantities);
        // setError(false);
        // setShowModal(false); // Hide modal on reset
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
    const handleSmallCabinAreaChange = handleRoomAreaChange("small", setSmallCabinSize);
    const handleHrRoomAreaChange = handleRoomAreaChange("hrRoom", setHrRoomSize);
    const handleSalesRoomAreaChange = handleRoomAreaChange("sales", setSalesRoomSize);
    const handleFinanceRoomAreaChange = handleRoomAreaChange("financeRoom", setFinanceRoomSize);
    const handleBreakoutRoomAreaChange = handleRoomAreaChange("breakoutRoom", setBreakoutRoomSize);
    const handleVideoRecordingRoomAreaChange = handleRoomAreaChange("videoRecordingRoom", setVideoRecordingRoomSize);
    const handleConferenceRoomAreaChange = handleRoomAreaChange("conferenceRoom", setConferenceRoomSize);
    const handleBoardRoomAreaChange = handleRoomAreaChange("boardRoom", setBoardRoomSize);
    const handleManagerCabinSizeChange = handleRoomAreaChange("manager", setManagerCabinSize);
    const handleReceptionSizeChange = handleRoomAreaChange("reception", setReceptionSize);
    const handleLoungeSizeChange = handleRoomAreaChange("lounge", setLoungeSize);


    const handleSeatCountChange = (setter) => (newCount) => {
        setter(newCount);
    };

    const handleSmallCabinSeatCountChange = handleSeatCountChange(setSmallCabinSeatCount);
    const handleHrRoomSeatCountChange = handleSeatCountChange(setHrRoomSeatCount);
    const handleSalesRoomSeatCountChange = handleSeatCountChange(setSalesSeatCount);
    const handleFinanceRoomSeatCountChange = handleSeatCountChange(setFinanceRoomSeatCount);



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

    const areaInfo = {
        totalArea,
        builtArea,
    };

    console.log("area sqft: ", areaValues, "area qty", areaQuantities)
    return (
        <div className="container max-h-lvh overflow-hidden">
            {/* <Navbar
                totalArea={totalArea}
                setTotalArea={setTotalArea}
                MAX_AREA={MAX_AREA}
                MIN_AREA={MIN_AREA}
                resetAll={resetAll}
            /> */}
            <Navbar
                // totalArea={totalArea}
                // setTotalArea={setTotalArea}
                MAX_AREA={MAX_AREA}
                MIN_AREA={MIN_AREA}
                resetAll={resetAll}
            />

            <div className="content w-full flex justify-between gap-3 px-3 mt-5 relative">
                <div className="area-distribution-chart w-1/2 px-3 border-2">
                    <Spacebar
                        builtArea={builtArea}
                        availableArea={availableArea}
                        totalArea={totalArea}
                    />
                    <TreeMap
                        totalArea={totalArea}
                        areaValues={areaValues}
                        areaQuantities={areaQuantities}
                    />
                </div>
                <div className="sections w-1/2 overflow-auto max-h-lvh pb-32">
                    <OpenWorkspaces
                        areaQuantities={areaQuantities}
                        variant={variant}
                        updateAreas={updateAreas}
                        onVariantChange={handleVariantChange}
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
                    />
                    <MeetingRooms
                        areaQuantities={areaQuantities}
                        updateAreas={updateAreas}
                        hrRoomConfig={hrRoomConfig} salesRoomConfig={salesRoomConfig}
                        financeRoomConfig={financeRoomConfig} areaInfo={areaInfo} initialAreaValues={initialAreaValues}
                        videoRecordingRoomSize={videoRecordingRoomSize} setVideoRecordingRoomSize={handleVideoRecordingRoomAreaChange}
                        conferenceRoomSize={conferenceRoomSize} setConferenceRoomSize={handleConferenceRoomAreaChange}
                        boardRoomSize={boardRoomSize} setBoardRoomSize={handleBoardRoomAreaChange}
                        hrRoomSeatCount={hrRoomSeatCount}
                        setHrRoomSeatCount={setHrRoomSeatCount}
                        salesSeatCount={salesSeatCount}
                        setSalesSeatCount={setSalesSeatCount}
                        financeRoomSeatCount={financeRoomSeatCount}
                        setFinanceRoomSeatCount={setFinanceRoomSeatCount}
                    />
                    <PublicSpaces areaQuantities={areaQuantities} updateAreas={updateAreas}
                        breakoutRoomSize={breakoutRoomSize} setBreakoutRoomSize={handleBreakoutRoomAreaChange}
                        totalArea={totalArea} builtArea={builtArea} initialAreaValues={initialAreaValues}
                        receptionSize={receptionSize} setReceptionSize={handleReceptionSizeChange}
                        loungeSize={loungeSize} setLoungeSize={handleLoungeSizeChange}
                    />
                    <SupportSpaces areaQuantities={areaQuantities} updateAreas={updateAreas}
                        setIsOtherSelected={setIsOtherSelected} areaValues={areaValues}
                    />
                </div>
                {warning &&
                    <ErrorModal onclose={() => setWarning(false)} />
                }
            </div>
            {/* <LayoutCard /> */}
            {/* <QnaPopup question="is the flooring project for residental purpose ?" /> */}

        </div>
    )
}

export default Layout
