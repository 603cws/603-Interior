import { useState, useEffect, useRef } from "react";
import ErrorModal from "../../common-components/ErrorModal";
import { layoutRoomconstant } from "../utils/Constants";

const AreaCounter = ({
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
  const min = min2;
  const max = max2;
  const step = step2;
  const freeSpace = totalArea * 0.02;
  const usableArea = totalArea - freeSpace;
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(false);
  const [fixedValue, setFixedValue] = useState(String(value || seatCount));
  const [errorMessage, setErrorMessage] = useState();
  const [sizeReached, setSizeReached] = useState(false);

  const inputRef = useRef(null);
  const errorTimeoutRef = useRef(null);

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
    counterValue,
  ) {
    let currentbuild = buildArea + value * counterValue;

    if (currentbuild > usableArea) {
      setSizeReached(false);
      setWarning(true);
      setErrorMessage(
        `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
          "Adjust the number of workspaces OR.\n" +
          "Increase the total area to add more workspaces.",
      );
    } else {
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
    seatcountvalue,
  ) {
    let currentbuild = buildArea + value * counterValue;

    if (currentbuild > usableArea) {
      setSizeReached(false);
      setWarning(true);
      setErrorMessage(
        `The built area (${builtArea} sqft) exceeds the available space (${usableArea} sqft).\n` +
          "Adjust the number of workspaces OR.\n" +
          "Increase the total area to add more workspaces.",
      );
    } else {
      setCabinSize(cabinSize + value);
      setSeatCount(seatCount + seatcountvalue);
    }
  }

  const handleIncrement = () => {
    if (counterValue > 0) {
      if (value < max && totalArea > 0) {
        if (type === "financeRoom") {
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.financeRoom.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2,
          );
        } else if (
          type === "md" ||
          type === "manager" ||
          type === "reception" ||
          type === "lounge" ||
          type === "videoRecordingRoom" ||
          type === "ups" ||
          type === "bms" ||
          type === "washrooms"
        ) {
          CheckBuildExceed(
            builtArea,
            5,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
          );
        } else if (type === "conferenceRoom" || type === "boardRoom") {
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.confAndBoard.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2,
          );
        } else if (type === "small") {
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.small.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2,
          );
        } else if (type === "hrRoom" || type === "sales") {
          CheckBuildExceedwithseatcount(
            builtArea,
            layoutRoomconstant.hrRoom.CabinSize,
            usableArea,
            setCabinSize,
            cabinSize,
            counterValue,
            seatCount,
            setSeatCount,
            2,
          );
        } else {
          setCabinSize(cabinSize + 40);
        }
      } else {
        // setWarning(true);
        setSizeReached(true);
        // setErrorMessage(
        //   `You've reached the maximum allowed size for ${title}. This limit is fixed and cannot be increased further. Please enter a value within the allowed range (${min}-${max})${
        //     seatCount ? "Seats" : "sqft"
        //   }.`
        // );

        showError(
          `Value must be between ${min}–${max} ${seatCount ? "seats" : "sqft"} .`,
        );
      }
    } else {
      setError("Add workspace to increase the area");
      setTimeout(() => {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }
        setError("");
      }, 1500);
    }
  };

  const handleDecrement = () => {
    if (value <= min) {
      showError(
        `Minimum allowed value is ${min} ${seatCount ? "seats" : "sqft"}.`,
      );
      return;
    }
    if (value > min && totalArea > 0 && cabinSize > initialAreaValues[type]) {
      if (type === "financeRoom") {
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
        type === "washrooms"
      ) {
        setCabinSize(cabinSize - layoutRoomconstant.commonRooms.CabinSize);
      } else if (type === "small") {
        setCabinSize(cabinSize - layoutRoomconstant.small.CabinSize);
        setSeatCount(seatCount - layoutRoomconstant.small.SeatCount);
      } else if (type === "hrRoom" || type === "sales") {
        setCabinSize(cabinSize - layoutRoomconstant.hrRoom.CabinSize);
        setSeatCount(seatCount - layoutRoomconstant.hrRoom.SeatCount);
      } else {
        setCabinSize(cabinSize - 40);
      }
    }
  };

  useEffect(() => {
    setFixedValue(String(value));
  }, [value]);

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
    const digitsOnly = fixedValue.replace(/\D/g, "");
    if (digitsOnly.length >= 3 && /^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (event) => {
    const raw = event.target.value;
    const digitsOnly = raw.replace(/\D/g, "");
    const newValue = Number(raw);

    setFixedValue(raw);

    const projectedBuiltArea =
      counterValue * newValue + builtArea - counterValue * value;
    setError("");
    // Case 1: Non-numeric or invalid digit count
    if (digitsOnly.length < 1 || isNaN(newValue)) {
      return;
    }
    // Case 2: Out of range
    if (newValue < min || newValue > max) {
      showError(`Value must be between ${min}–${max} sqft.`);
      return;
    }
    // Case 3: Built area would exceed usable area
    if (projectedBuiltArea > usableArea) {
      showError(`Total usable area cannot exceed ${usableArea} sqft.`);
      return;
    }
    onChange(newValue);
  };

  const handleBlur = () => {
    const trimmed = fixedValue.toString().trim();
    const newValue = Number(trimmed);

    if (trimmed === "" || isNaN(newValue) || newValue < min || newValue > max) {
      setFixedValue(cabinSize);
      onChange(cabinSize);
      setError("");
    }
  };

  const showError = (msg) => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setError(msg);

    errorTimeoutRef.current = setTimeout(() => {
      setError("");
    }, 1500);
  };

  return (
    <div className="text-center">
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
