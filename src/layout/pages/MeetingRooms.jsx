import React from "react";
import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard.js

const meetingRoomData = [
    {
        type: "discussionRoom",
        image: "/images/discussionRoom.png",
        description: "This is the discussion room, ideal for small group discussions.",
        tooltipText: "size: 380 sqft"
    },
    {
        type: "interviewRoom",
        image: "/images/interviewRoom.png",
        description: "This is the interview room, designed for conducting interviews.",
        tooltipText: "size: 100 sqft"

    },
    {
        type: "conferenceRoom",
        image: "/images/conferenceRoom.png",
        description: "This is the conference room, suitable for large meetings.",
        slider: {
            name: "Conference Room Size",
            valueKey: "conferenceRoomSize",
            setValueKey: "setConferenceRoomSize",
            min: 250,
            max: 500,
            step: 5,
        },
    },
    {
        type: "boardRoom",
        image: "/images/boardRoom.png",
        description: "This is the board room, equipped for executive meetings.",
        slider: {
            name: "Board Room Size",
            valueKey: "boardRoomSize",
            setValueKey: "setBoardRoomSize",
            min: 325,
            max: 650,
            step: 5,
        },
    },
    {
        type: "meetingRoom",
        image: "/images/meetingRoom.png",
        description: "This is the meeting room, perfect for team meetings.",
        tooltipText: "size: 100 sqft",

    },
    {
        type: "meetingRoomLarge",
        image: "/images/meetingRoomLarge.png",
        description: "This is the large meeting room, accommodating larger groups.",
        tooltipText: "size: 120 sqft",
    },
    {
        type: "hrRoom",
        image: "/images/hrRoom.png",
        description: "This is the HR room, designated for HR activities.",
        tooltipText: "size: 80 sqft",
        slider: {
            name: "Add. Seat Count",
            valueKey: "hrRoomSeatCount",
            setValueKey: "setHrRoomSeatCount",
            min: 0,
            max: 24,
            step: 2,
            cabinSizeKey: "roomSize",
            setCabinSizeKey: "setRoomSize",
        },
    },
    {
        type: "financeRoom",
        image: "/images/financeRoom.png",
        description: "This is the finance room, used for financial discussions.",
        tooltipText: "size: 100 sqft",
        slider: {
            name: "Add. Seat Count",
            valueKey: "financeRoomSeatCount",
            setValueKey: "setFinanceRoomSeatCount",
            min: 0,
            max: 24,
            step: 2,
            cabinSizeKey: "roomSize",
            setCabinSizeKey: "setRoomSize",
        },
    },
    {
        type: "sales",
        image: "/images/sales.png",
        description: "This is the sales area, designed for sales team activities.",
        tooltipText: "size: 80 sqft",
        slider: {
            name: "Add. Seat Count",
            valueKey: "salesSeatCount",
            setValueKey: "setSalesSeatCount",
            min: 0,
            max: 24,
            step: 2,
            cabinSizeKey: "roomSize",
            setCabinSizeKey: "setRoomSize",
        },
    },
    {
        type: "videoRecordingRoom",
        image: "/images/videoRecordingRoom.png",
        description: "This is the video recording room, designed for creating professional video content.",
        slider: {
            name: "Video Recording Room Size",
            valueKey: "videoRecordingRoomSize",
            setValueKey: "setVideoRecordingRoomSize",
            min: 80,
            max: 160,
            step: 5,
        },
    },
];


const MeetingRooms = ({
    areaQuantities,
    updateAreas,
    areaInfo,
    initialAreaValues,
    hrRoomConfig,
    salesRoomConfig,
    financeRoomConfig,
    videoRecordingRoomSize,
    setVideoRecordingRoomSize,
    conferenceRoomSize,
    setConferenceRoomSize,
    boardRoomSize,
    setBoardRoomSize,
    hrRoomSeatCount,
    setHrRoomSeatCount,
    salesSeatCount, setSalesSeatCount, financeRoomSeatCount, setFinanceRoomSeatCount,
}) => {
    const { totalArea, builtArea } = areaInfo;

    const handleChange = (type, value) => {
        const parsedValue = parseInt(value, 10);
        if (parsedValue >= 0) updateAreas(type, parsedValue);
    };

    return (
        <div className="section px-3">
            <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold">Meeting Rooms</h3>
            <div className="meeting-rooms grid grid-cols-2">
                {meetingRoomData.map((room) => {
                    const sliderProps = room.slider
                        ? {
                            name: room.slider.name,
                            value: room.slider.valueKey
                                ? eval(room.slider.valueKey) // Dynamically evaluate the value (e.g., videoRecordingRoomSize)
                                : 0, // Default to 0 if no dynamic value is found
                            onChange: room.slider.setValueKey
                                ? eval(room.slider.setValueKey) // Dynamically evaluate the setter function (e.g., setVideoRecordingRoomSize)
                                : () => { }, // Default empty function if no setter is provided
                            min2: room.slider.min,
                            max2: room.slider.max,
                            step2: room.slider.step,
                            totalArea,
                            builtArea,
                            initialAreaValues,
                            type: room.type,
                            ...(room.type === "hrRoom"
                                ? {
                                    // valueKey: hrRoomSeatCount,
                                    // setValueKey: setHrRoomSeatCount,
                                    cabinSize: hrRoomConfig.roomSize,
                                    setCabinSize: hrRoomConfig.setRoomSize,
                                }
                                : room.type === "financeRoom"
                                    ? {
                                        cabinSize: financeRoomConfig.roomSize,
                                        setCabinSize: financeRoomConfig.setRoomSize,
                                    }
                                    : room.type === "sales"
                                        ? {
                                            cabinSize: salesRoomConfig.roomSize,
                                            setCabinSize: salesRoomConfig.setRoomSize,
                                        }
                                        : room.type === "videoRecordingRoom"
                                            ? {
                                                cabinSize: videoRecordingRoomSize,
                                                setCabinSize: setVideoRecordingRoomSize,
                                            }
                                            : room.type === "conferenceRoom"
                                                ? {
                                                    cabinSize: conferenceRoomSize,
                                                    setCabinSize: setConferenceRoomSize,
                                                }
                                                : room.type === "boardRoom"
                                                    ? {
                                                        cabinSize: boardRoomSize,
                                                        setCabinSize: setBoardRoomSize,
                                                    }
                                                    : {}),
                        }
                        : null;

                    return (
                        <LayoutCard
                            key={room.type}
                            image={room.image}
                            description={room.description}
                            counterValue={areaQuantities[room.type] || 0}
                            onIncrement={() =>
                                handleChange(room.type, (areaQuantities[room.type] || 0) + 1)
                            }
                            onDecrement={() => {
                                const newValue = (areaQuantities[room.type] || 0) - 1;
                                if (newValue >= 0) {
                                    handleChange(room.type, newValue);
                                }
                            }}
                            onChange={(value) => handleChange(room.type, value)}
                            title={`${room.type.charAt(0).toUpperCase() + room.type.slice(1)}`}
                            showAreaCounter={!!room.slider} // Show counter only if room has a slider
                            areaCounterProps={sliderProps}
                            tooltipText={room.tooltipText}
                        />
                    );
                })}
            </div>
        </div>
    );
};




export default MeetingRooms;
