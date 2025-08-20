import LayoutCard from "../components/LayoutCard"; // Ensure the correct path to LayoutCard.js

const meetingRoomData = [
  // {
  //   type: "discussionRoom",
  //   // image: "/images/workspace-image/discussionRoom.png",
  //   image: "/images/workstation-wp/discuss-wp.webp",
  //   description:
  //     "This is the discussion room, ideal for small group discussions.",
  //   tooltipText: "size: 380 sqft",
  // },
  {
    type: "interviewRoom",
    image: "/images/workspace-image/interviewRoom.webp",
    // image: "/images/workstation-wp/interview-wp.webp",
    description:
      "This is the interview room, designed for conducting interviews.",
    tooltipText: "Size: 100 sq ft",
    title: "Interivew Room",
  },
  {
    type: "conferenceRoom",
    image: "/images/workspace-image/conferenceRoom.webp",
    // image: "/images/workstation-wp/conf-wp.webp",
    description: "This is the conference room, suitable for large meetings.",
    slider: {
      name: "Conference Room Size",
      valueKey: "conferenceRoomSize",
      setValueKey: "setConferenceRoomSize",
      min: 250,
      max: 500,
      step: 5,
    },
    title: "Conference Room",
  },
  {
    type: "boardRoom",
    image: "/images/workspace-image/boardRoom.webp",
    // image: "/images/workstation-wp/boardroom-wp.webp",
    description: "This is the board room, equipped for executive meetings.",
    slider: {
      name: "Board Room Size",
      valueKey: "boardRoomSize",
      setValueKey: "setBoardRoomSize",
      min: 380,
      max: 650,
      step: 5,
    },
    tooltipText: "size: 18 pax",
    title: "Board Room",
  },
  {
    type: "meetingRoom",
    image: "/images/workspace-image/meetingRoom.png",
    // image: "/images/workstation-wp/meetingroom-wp.webp",
    description: "This is the meeting room, perfect for team meetings.",
    tooltipText: "Size: 120 sq ft \n Seats: 6 pax",
    title: "Meeting Room",
  },
  {
    type: "meetingRoomLarge",
    image: "/images/workspace-image/meetingRoomLarge.png",
    // image: "/images/workstation-wp/meetroomlarge-wp.webp",
    description: "This is the large meeting room, accommodating larger groups.",
    tooltipText: "Size: 150 sq ft \n Seats: 8 pax",
    title: "Meeting Room(Large)",
  },
  {
    type: "hrRoom",
    image: "/images/workspace-image/hrRoom.webp",
    // image: "/images/workstation-wp/hr-wp.webp",
    description: "This is the HR room, designated for HR activities.",
    tooltipText: "size: 80 sqft",
    slider: {
      name: "Add Extra Seats",
      valueKey: "hrRoomSeatCount",
      setValueKey: "setHrRoomSeatCount",
      min: 0,
      max: 24,
      step: 2,
      cabinSizeKey: "roomSize",
      setCabinSizeKey: "setRoomSize",
    },
    title: "HR Room",
  },
  {
    type: "financeRoom",
    image: "/images/workspace-image/financeRoom.webp",
    // image: "/images/workstation-wp/finance-wp.webp",
    description: "This is the finance room, used for financial discussions.",
    tooltipText: "size: 100 sqft",
    slider: {
      name: "Add Extra Seats",
      valueKey: "financeRoomSeatCount",
      setValueKey: "setFinanceRoomSeatCount",
      min: 0,
      max: 24,
      step: 2,
      cabinSizeKey: "roomSize",
      setCabinSizeKey: "setRoomSize",
    },
    title: "Finance Room",
  },
  {
    type: "sales",
    image: "/images/workspace-image/sales.png",
    // image: "/images/workstation-wp/sales-wp.webp",
    description: "This is the sales area, designed for sales team activities.",
    tooltipText: "size: 80 sqft",
    slider: {
      name: "Add Extra Seats",
      valueKey: "salesSeatCount",
      setValueKey: "setSalesSeatCount",
      min: 0,
      max: 24,
      step: 2,
      cabinSizeKey: "roomSize",
      setCabinSizeKey: "setRoomSize",
    },
    title: "Sales Room",
  },
  {
    type: "videoRecordingRoom",
    image: "/images/workspace-image/videoRecordingRoom.png",
    // image: "/images/workstation-wp/videocon-wp.webp",
    description:
      "This is the video recording room, designed for creating professional video content.",
    slider: {
      name: "Video Recording Room Size",
      valueKey: "videoRecordingRoomSize",
      setValueKey: "setVideoRecordingRoomSize",
      min: 80,
      max: 160,
      step: 5,
    },
    title: "Video Recording Room",
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
  salesSeatCount,
  setSalesSeatCount,
  financeRoomSeatCount,
  setFinanceRoomSeatCount,
  boardRoomConfig,
  conferenceRoomConfig,
}) => {
  const { totalArea, builtArea } = areaInfo;

  return (
    <div className="section px-3">
      <h3 className="section-heading bg-white shadow-sm text-md pl-2 py-1.5 sticky top-0 font-semibold z-10">
        Meeting Rooms
      </h3>
      {/* <div className="meeting-rooms grid grid-cols-2 4xl:grid-cols-3 gap-5"> */}
      <div className="meeting-rooms grid grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {meetingRoomData.map((room) => {
          const sliderProps = room.slider
            ? {
                name: room.slider.name,
                value: room.slider.valueKey
                  ? eval(room.slider.valueKey) // Dynamically evaluate the value (e.g., videoRecordingRoomSize)
                  : 0, // Default to 0 if no dynamic value is found
                onChange: room.slider.setValueKey
                  ? eval(room.slider.setValueKey) // Dynamically evaluate the setter function (e.g., setVideoRecordingRoomSize)
                  : () => {}, // Default empty function if no setter is provided
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
                      seatCount: hrRoomConfig.seatCount,
                      setSeatCount: hrRoomConfig.setSeatCount,
                    }
                  : room.type === "financeRoom"
                  ? {
                      cabinSize: financeRoomConfig.roomSize,
                      setCabinSize: financeRoomConfig.setRoomSize,
                      seatCount: financeRoomConfig.seatCount,
                      setSeatCount: financeRoomConfig.setSeatCount,
                    }
                  : room.type === "sales"
                  ? {
                      cabinSize: salesRoomConfig.roomSize,
                      setCabinSize: salesRoomConfig.setRoomSize,
                      seatCount: salesRoomConfig.seatCount,
                      setSeatCount: salesRoomConfig.setSeatCount,
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
                      seatCount: conferenceRoomConfig.seatCount,
                      setSeatCount: conferenceRoomConfig.setSeatCount,
                    }
                  : room.type === "boardRoom"
                  ? {
                      cabinSize: boardRoomSize,
                      setCabinSize: setBoardRoomSize,
                      seatCount: boardRoomConfig.seatCount,
                      setSeatCount: boardRoomConfig.setSeatCount,
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
                updateAreas(room.type, (areaQuantities[room.type] || 0) + 1)
              }
              onDecrement={() => {
                const newValue = (areaQuantities[room.type] || 0) - 1;
                if (newValue >= 0) {
                  updateAreas(room.type, newValue);
                }
              }}
              onChange={(value) => updateAreas(room.type, value)}
              // title={`${
              //   room.type.charAt(0).toUpperCase() + room.type.slice(1)
              // }`}
              title={room.title || room.type}
              showAreaCounter={!!room.slider} // Show counter only if room has a slider
              areaCounterProps={sliderProps}
              tooltipText={
                room.type === "conferenceRoom"
                  ? `Size: ${conferenceRoomSize || 250} sq ft \n Seats: ${
                      12 + conferenceRoomConfig.seatCount
                    } pax`
                  : room.type === "boardRoom"
                  ? `Size: ${boardRoomSize || 325} sq ft \n Seats: ${
                      18 + boardRoomConfig.seatCount
                    } pax`
                  : room.type === "hrRoom"
                  ? `Size: ${hrRoomConfig.roomSize || "80"} sq ft \n Seats: ${
                      4 + hrRoomSeatCount
                    } pax`
                  : room.type === "financeRoom"
                  ? `Size: ${
                      financeRoomConfig.roomSize || "100"
                    } sq ft \n Seats: ${4 + financeRoomSeatCount} pax`
                  : room.type === "sales"
                  ? `Size: ${
                      salesRoomConfig.roomSize || "80"
                    } sq ft \n Seats: ${4 + salesSeatCount} pax`
                  : room.type === "videoRecordingRoom"
                  ? `Size: ${videoRecordingRoomSize || 80} sq ft`
                  : room.tooltipText
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default MeetingRooms;
