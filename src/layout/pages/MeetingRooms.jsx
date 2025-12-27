import LayoutCard from "../components/LayoutCard";
import { initialAreaValues } from "../utils/Constants";
import { meetingRoomData } from "../utils/WorkspaceConstants";

const MeetingRooms = ({
  areaQuantities,
  updateAreas,
  areaInfo,
  hrRoomConfig,
  salesRoomConfig,
  financeRoomConfig,
  videoRecordingRoomSize,
  setVideoRecordingRoomSize,
  conferenceRoomSize,
  setConferenceRoomSize,
  boardRoomSize,
  setBoardRoomSize,
  boardRoomConfig,
  conferenceRoomConfig,
}) => {
  const { totalArea, builtArea } = areaInfo;

  const valueResolver = {
    conferenceRoomConfig: conferenceRoomConfig,
    boardRoomConfig: boardRoomConfig,
    hrRoomConfig: hrRoomConfig,
    financeRoomConfig: financeRoomConfig,
    salesRoomConfig: salesRoomConfig,
    videoRecordingRoomSize,
    setVideoRecordingRoomSize,
  };
  const resolvePath = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  return (
    <div className="section px-3">
      <h3 className="section-heading bg-[#E4E7ED] shadow-sm text-md pl-2 py-1 sticky top-0 font-semibold z-10">
        Meeting Rooms
      </h3>
      <div className="meeting-rooms grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 3xl:grid-cols-3 gap-5 justify-items-center lg:justify-items-stretch">
        {meetingRoomData.map((room) => {
          let sliderProps = null;

          if (room.slider) {
            const { valueKey, setValueKey } = room.slider;

            const value =
              valueKey && valueKey.includes(".")
                ? resolvePath(valueResolver, valueKey)
                : valueResolver[valueKey] ?? 0;

            const onChange =
              setValueKey && setValueKey.includes(".")
                ? resolvePath(valueResolver, setValueKey)
                : valueResolver[setValueKey] ?? (() => {});

            sliderProps = {
              name: room.slider.name,
              value,
              onChange,
              min2: room.slider.min,
              max2: room.slider.max,
              step2: room.slider.step,
              totalArea,
              builtArea,
              initialAreaValues,
              type: room.type,

              ...(room.type === "hrRoom"
                ? {
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
            };
          }

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
              title={room.title || room.type}
              showAreaCounter={!!room.slider} // Show counter only if room has a slider
              areaCounterProps={sliderProps}
              tooltipText={
                room.type === "conferenceRoom"
                  ? `Size: ${conferenceRoomSize || 250} sq ft \n Seats: ${
                      conferenceRoomConfig.seatCount
                    } pax`
                  : room.type === "boardRoom"
                  ? `Size: ${boardRoomSize || 325} sq ft \n Seats: ${
                      boardRoomConfig.seatCount
                    } pax`
                  : room.type === "hrRoom"
                  ? `Size: ${hrRoomConfig.roomSize || "80"} sq ft \n Seats: ${
                      hrRoomConfig.seatCount
                    } pax`
                  : room.type === "financeRoom"
                  ? `Size: ${
                      financeRoomConfig.roomSize || "100"
                    } sq ft \n Seats: ${financeRoomConfig.seatCount} pax`
                  : room.type === "sales"
                  ? `Size: ${
                      salesRoomConfig.roomSize || "80"
                    } sq ft \n Seats: ${salesRoomConfig.seatCount} pax`
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
