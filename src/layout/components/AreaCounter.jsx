import React, { useState, useEffect, useRef } from "react";
import ErrorModal from "../../common-components/ErrorModal";
import { layoutRoomconstant } from "../utils/Constants";

const AreaCounter = ({
  name,
  value,
  onChange,
  min2,
  max2,
  step2,
  cabinSize,
  setCabinSize,
  totalArea,
  builtArea,
  type,
  initialAreaValues,
  counterValue,
  seatCount,
  setSeatCount,
  title,
}) => {
  // console.log("seatcount", seatCount);

  const min = min2;
  const max = max2;
  const step = step2;
  const freeSpace = totalArea * 0.02; // 2% of totalArea
  const usableArea = totalArea - freeSpace; // Area available for building
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(false);
  const [fixedValue, setFixedValue] = useState(String(value));
  const [errorMessage, setErrorMessage] = useState();
  const [sizeReached, setSizeReached] = useState(false);

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
  function CheckBuildExceed(
    buildArea,
    value,
    usableArea,
    setCabinSize,
    cabinSize,
    counterValue
  ) {
    let currentbuild = buildArea + value * counterValue;
    // console.log(currentbuild);

    if (currentbuild > usableArea) {
      // console.log("hiiiii");
      setSizeReached(false);
      setWarning(true);
      setErrorMessage(
        `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
          "Adjust the number of workspaces OR.\n" +
          "Increase the total area to add more workspaces."
      );
    } else {
      // console.log("running ok");
      setCabinSize(cabinSize + value);
    }
  }
  function CheckBuildExceedwithseatcount(
    buildArea,
    value,
    usableArea,
    setCabinSize,
    cabinSize,
    counterValue,
    seatCount,
    setSeatCount,
    seatcountvalue
  ) {
    let currentbuild = buildArea + value * counterValue;
    // console.log(currentbuild);

    if (currentbuild > usableArea) {
      // console.log("hiiiii");
      setSizeReached(false);
      setWarning(true);
      setErrorMessage(
        `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
          "Adjust the number of workspaces OR.\n" +
          "Increase the total area to add more workspaces."
      );
    } else {
      // console.log("running ok");
      setCabinSize(cabinSize + value);
      setSeatCount(seatCount + seatcountvalue);
    }
  }

  const handleIncrement = () => {
    let checkbuildarea;
    if (counterValue > 0) {
      if (value < max && totalArea > 0) {
        // onChange(value + step);
        if (type === "financeRoom") {
          // setCabinSize(cabinSize + layoutRoomconstant.financeRoom.CabinSize);
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.financeRoom.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2
          );
          // setSeatCount(seatCount + layoutRoomconstant.financeRoom.SeatCount);
        } else if (
          type === "md" ||
          type === "manager" ||
          type === "reception" ||
          type === "lounge" ||
          type === "videoRecordingRoom" ||
          type === "ups" ||
          type === "bms" ||
          // type === "maleWashroom" ||
          // type === "femaleWashroom"
          type === "washrooms"
        ) {
          // setCabinSize(cabinSize + layoutRoomconstant.commonRooms.CabinSize);
          CheckBuildExceed(
            builtArea,
            5,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue
          );
        } else if (type === "conferenceRoom" || type === "boardRoom") {
          // setCabinSize(cabinSize + layoutRoomconstant.confAndBoard.CabinSize);
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.confAndBoard.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2
          );
          // setSeatCount(seatCount + layoutRoomconstant.confAndBoard.SeatCount);
        } else if (type === "small") {
          // setCabinSize(cabinSize + layoutRoomconstant.small.CabinSize);
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.small.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2
          );
          // setSeatCount(seatCount + layoutRoomconstant.small.SeatCount);
        } else {
          console.log("breakout");
          setCabinSize(cabinSize + 40);
        }
      } else {
        console.log("condition not satisfied");
        setWarning(true);
        setSizeReached(true);
        setErrorMessage(
          `You've reached the maximum allowed size for ${title}. This limit is fixed and cannot be increased further. Please enter a value within the allowed range.`
        );
      }
    } else {
      setError("Add workspace to increase the area");
      setTimeout(() => {
        setError("");
      }, 1500);
    }
  };

  const handleDecrement = () => {
    if (value > min && totalArea > 0 && cabinSize > initialAreaValues[type]) {
      // onChange(value - step);
      if (
        type === "financeRoom"
        // type === "boardRoom" ||
        // type === "conferenceRoom"
      ) {
        setCabinSize(cabinSize - layoutRoomconstant.financeRoom.CabinSize);
        setSeatCount(seatCount - layoutRoomconstant.financeRoom.SeatCount);
      } else if (type === "conferenceRoom" || type === "boardRoom") {
        setCabinSize(cabinSize - layoutRoomconstant.confAndBoard.CabinSize);
        setSeatCount(seatCount - layoutRoomconstant.confAndBoard.SeatCount);
      } else if (
        type === "md" ||
        type === "manager" ||
        type === "reception" ||
        type === "lounge" ||
        type === "videoRecordingRoom" ||
        type === "ups" ||
        type === "bms" ||
        // type === "maleWashroom" ||
        // type === "femaleWashroom"
        type === "washrooms"
      ) {
        setCabinSize(cabinSize - layoutRoomconstant.commonRooms.CabinSize);
      } else if (type === "small") {
        setCabinSize(cabinSize - layoutRoomconstant.small.CabinSize);
        setSeatCount(seatCount - layoutRoomconstant.small.SeatCount);
      } else {
        setCabinSize(cabinSize - 40);
      }
    }
  };

  // const handleInputChange = (event) => {
  //   const newValue = Number(event.target.value);
  //   // console.log("newValue", newValue);
  //   setFixedValue(event.target.value);
  //   if (newValue >= min && newValue <= max) {
  //     console.log("hii");
  //     onChange(newValue);
  //   }
  // };

  // Sync input with value from props/state
  useEffect(() => {
    setFixedValue(String(value));
  }, [value]);

  // const handleInputChange = (event) => {
  //   const raw = event.target.value;
  //   const digitsOnly = raw.replace(/\D/g, "");
  //   const newValue = Number(raw);

  //   setFixedValue(raw); // Always allow typing

  //   // Calculate what builtArea will become if this change is allowed
  //   const projectedBuiltArea =
  //     counterValue * newValue + builtArea - counterValue * value;

  //   // Allow change only if:
  //   if (
  //     digitsOnly.length >= 1 &&
  //     !isNaN(newValue) &&
  //     newValue >= min &&
  //     newValue <= max &&
  //     projectedBuiltArea <= usableArea
  //   ) {
  //     onChange(newValue);
  //     setError("");
  //   } else {
  //     setError(`value must be in range ${min}-${max}sqft`);
  //   }
  // };

  // const handleInputChange = (event) => {
  //   setFixedValue(event.target.value); // let the user type anything (even invalid temporarily)
  // };

  // const handleKeyDown = (event) => {
  //   let checkbuildarea = 0;
  //   if (event.key === "Enter") {
  //     const newValue = Number(fixedvalue);
  //     checkbuildarea =
  //       counterValue * newValue + builtArea - counterValue * value;
  //     console.log(
  //       newValue,
  //       checkbuildarea,
  //       counterValue,
  //       builtArea,
  //       usableArea
  //     );

  //     if (newValue >= min && newValue <= max && checkbuildarea <= usableArea) {
  //       onChange(newValue); // update parent
  //     } else {
  //       // Optionally reset or show warning
  //       console.warn("Value out of range");
  //     }
  //   }
  // };

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
    const digitsOnly = fixedValue.replace(/\D/g, "");
    if (digitsOnly.length >= 3 && /^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (event) => {
    const raw = event.target.value;
    const digitsOnly = raw.replace(/\D/g, "");
    const newValue = Number(raw);

    setFixedValue(raw); // Always allow typing

    const projectedBuiltArea =
      counterValue * newValue + builtArea - counterValue * value;

    // Always clear error before checks
    setError("");

    // Case 1: Non-numeric or invalid digit count
    if (digitsOnly.length < 1 || isNaN(newValue)) {
      return;
    }

    // Case 2: Out of range
    if (newValue < min || newValue > max) {
      setError(`Value must be between ${min}–${max} sqft.`);
      return;
    }

    // Case 3: Built area would exceed usable area
    if (projectedBuiltArea > usableArea) {
      setError(`Total usable area cannot exceed ${usableArea} sqft.`);
      return;
    }

    // ✅ Valid case
    onChange(newValue);
  };

  const handleBlur = () => {
    const trimmed = fixedValue.toString().trim();
    const newValue = Number(trimmed);

    // Reset if empty or invalid
    if (
      trimmed === "" || // empty field
      isNaN(newValue) || // non-numeric
      newValue < min ||
      newValue > max // out of allowed range
    ) {
      setFixedValue(cabinSize); // reset display value
      onChange(cabinSize); // reset parent state
      setError(""); // clear error
    }
  };

  return (
    <div className="text-center">
      {/* <label htmlFor="md-cabin-size" className="text-xs md:text-base">
        {name}:{" "}
      </label> */}
      <div
        className={`flex items-start justify-start gap-2 border-2 rounded-[4px] ${
          error ? "border-red-400" : ""
        }`}
      >
        <button onClick={handleDecrement} className="border-r-2 px-2">
          -
        </button>
        <input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          step={step}
          value={fixedValue}
          // value={value}
          // value={cabinSize}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          readOnly={seatCount !== undefined}
          className={`w-10 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6 ${
            seatCount !== undefined ? "cursor-default" : "cursor-text"
          }`}
        />
        <button onClick={handleIncrement} className="border-l-2 px-2">
          +
        </button>
        {error && (
          <p className="text-red-500 absolute -bottom-1 md:-bottom-2 w-full left-0 text-[8px] md:text-xs z-20">
            {error}
          </p>
        )}
      </div>

      {warning && (
        <ErrorModal
          onclose={() => setWarning(false)}
          message={errorMessage}
          sizeReached={sizeReached}
        />
      )}
    </div>
  );
};

export default AreaCounter;
