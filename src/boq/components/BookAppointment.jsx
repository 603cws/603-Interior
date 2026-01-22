import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { SlCalender } from "react-icons/sl";
import { PiWarningCircleFill } from "react-icons/pi";
import "../../styles/calender.css";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";

import Calendar from "react-calendar";
import { useApp } from "../../Context/Context";
import AppointmentConfirmation from "./AppointmentConfirmation";
import { IoMdClose } from "react-icons/io";

const times = [
  "09:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
  "01:00 pm",
  "02:00 pm",
  "03:00 pm",
  "04:00 pm",
  "05:00 pm",
  "06:00 pm",
  "07:00 pm",
  "08:00 pm",
];
function BookAppointment({ onClose, isdashboardbooking = false }) {
  const [value, onChange] = useState(new Date());
  const [selectedTIme, setSelectedTime] = useState();
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isappointmentbooked, setIsappointmentbooked] = useState(false);
  const [todayBookedTimmings, setTodayBookedTimmings] = useState([]);

  const { accountHolder } = useApp();

  const filteredTimings = times?.filter(
    (time) =>
      !todayBookedTimmings?.some((booked) => booked?.start_time === time)
  );

  const handletime = (time) => {
    setSelectedTime(time);
  };

  const getNextTime = (selectedTime) => {
    const index = times.indexOf(selectedTime);
    return index !== -1 && index < times.length - 1
      ? times[index + 1]
      : "09:00 pm";
  };

  const handlesubmit = async () => {
    const date = String(value.getDate()).padStart(2, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const year = value.getFullYear();
    const formattedDate = `${date}/${month}/${year}`;

    const newDate = `${year}/${month}/${date}`;
    setisSubmitting(true);

    const weekday = value.toLocaleDateString("en-US", { weekday: "short" });

    const endtime = getNextTime(selectedTIme);

    try {
      if (selectedTIme) {
        toast.success("we will shortly reach you");
        setIsappointmentbooked(true);
        saveBookingDatainDB(formattedDate, weekday, endtime, newDate);
        CheckThebookingOnSameDateAndGetTimes(value);
        await fetch(
          "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/BookAppointmentEmailClient",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyName: accountHolder.companyName,
              date: formattedDate,
              time: selectedTIme,
              email: accountHolder.email,
            }),
          }
        );
        // admin email
        await fetch(
          "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/BookAppointmentEmailAdmin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "workvedbusinesscentre@gmail.com",
              companyName: accountHolder.companyName,
              date: formattedDate,
              time: selectedTIme,
              userEmail: accountHolder.email,
              phoneNo: accountHolder?.phone,
            }),
          }
        );
      } else {
        toast.error("please select the time");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setisSubmitting(false);
    }
  };

  async function CheckThebookingOnSameDateAndGetTimes(value) {
    try {
      const date = String(value.getDate()).padStart(2, "0");
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const year = value.getFullYear();
      const formattedDate = `${date}/${month}/${year}`;

      const { data, error } = await supabase
        .from("appointments")
        .select("start_time")
        .eq("date", formattedDate);

      if (error) throw new Error("Something went wrong");

      setTodayBookedTimmings(data);
    } catch (error) {
      console.error("error", error);
    }
  }

  useEffect(() => {
    CheckThebookingOnSameDateAndGetTimes(value);
  }, [value]);

  const saveBookingDatainDB = async (date, weekday, endtime, newDate) => {
    try {
      const { error } = await supabase.from("appointments").insert([
        {
          user_id: accountHolder.userId,
          date,
          date_new: newDate,
          time_slot: JSON.stringify({
            [weekday]: { [selectedTIme]: `${selectedTIme}-${endtime}` },
          }),
          company_name: accountHolder.companyName,
          start_time: selectedTIme,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Appointment booked successfully");
    } catch (error) {
      console.error("Error inserting data:", error.message);
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div
      className={`${
        !isdashboardbooking ? "fixed inset-0  z-20 bg-black bg-opacity-80" : ""
      } font-Poppins flex justify-center items-center`}
    >
      <div
        className={`${
          !isdashboardbooking
            ? "max-w-sm md:max-w-4xl rounded-2xl border bg-[#fff] p-5 relative  overflow-auto h-[85vh] md:h-auto"
            : "w-full "
        }`}
      >
        {!isdashboardbooking && (
          <div className="absolute right-5 top-5">
            <IoMdClose onClick={onClose} size={20} className="cursor-pointer" />
          </div>
        )}
        <h2
          className={`font-semibold text-sm md:text-lg text-[#000] capitalize border-b-2 border-[#CCCCCC] hidden lg:block ${
            isdashboardbooking && "px-3 py-3"
          } `}
        >
          appointment
        </h2>
        <div
          className={`flex justify-center  items-center ${
            isdashboardbooking &&
            "overflow-auto h-[85vh] lg:h-[80vh] gradient-scrollbar pt-56 sm:pt-10 md:pt-0"
          }`}
        >
          {!isappointmentbooked ? (
            <div className="max-w-xs md:max-w-2xl lg:max-w-4xl lg:p-2 mb-5 lg:my-3">
              <h3 className="text-[#374A75] text-lg md:text-2xl font-bold text-center my-2">
                Book an Appointment
              </h3>
              <div className=" flex flex-col md:flex-row justify-around items-stretch gap-4 xl:gap-6 mx-3 md:mx-0">
                <div className="flex-1">
                  <h3 className="text-sm text-[#111] xl:mb-2 font-medium ">
                    Schedule date*
                  </h3>
                  <div className="flex gap-2 items-center rounded-lg bg-[#FAFAFA] border-[#757575] border px-2 mb-3">
                    <div>
                      <SlCalender />
                    </div>
                    <h2 className="text-[#C4C4C4]">Select the date</h2>
                  </div>
                  <div className="">
                    <Calendar
                      onChange={onChange}
                      value={value}
                      minDate={new Date()}
                      tileDisabled={({ date }) =>
                        date < new Date().setHours(0, 0, 0, 0) ||
                        date.getDay() === 0
                      }
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-[#111] font-medium text-sm md:text-base mb-3">
                    select time*
                  </h4>
                  <div
                    className={`${
                      filteredTimings?.length > 0
                        ? "grid grid-cols-3 gap-x-5 gap-y-3"
                        : ""
                    }`}
                  >
                    {filteredTimings?.length > 0 ? (
                      filteredTimings?.map((time) => {
                        const now = new Date();

                        const selectedDate = new Date(value);
                        const isToday =
                          selectedDate.getDate() === now.getDate() &&
                          selectedDate.getMonth() === now.getMonth() &&
                          selectedDate.getFullYear() === now.getFullYear();

                        const [hourMin, meridian] = time.split(" ");
                        let [hour, minute] = hourMin.split(":").map(Number);

                        if (meridian.toLowerCase() === "pm" && hour !== 12)
                          hour += 12;
                        if (meridian.toLowerCase() === "am" && hour === 12)
                          hour = 0;

                        const slotTime = new Date(selectedDate);
                        slotTime.setHours(hour, minute, 0, 0);

                        const isPast = isToday && slotTime < now;
                        return (
                          <button
                            disabled={isPast}
                            key={time}
                            onClick={() => handletime(time)}
                            className={`  border  px-2 py-1 md:px-4 md:py-3 rounded-lg text-xs  border-[#757575]  ${
                              isPast
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : selectedTIme === time
                                ? "text-[#F3F8FF] bg-[#374A75]"
                                : "text-[#374A75] bg-[#F3F8FF] hover:shadow-md"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })
                    ) : (
                      <p>No slots available For Today </p>
                    )}
                  </div>
                  <div className="flex items-center bg-[#FEF4EB] gap-2 mt-4 md:mt-10 p-2">
                    <div>
                      <PiWarningCircleFill color="#D59E61" size={20} />
                    </div>
                    <h2 className="text-sm text-[#000] ">
                      All times are in central Time(India)
                    </h2>
                  </div>
                </div>
              </div>
              <div className=" flex justify-center items-center my-2 md:my-4">
                <button
                  onClick={handlesubmit}
                  className="px-2 py-1 md:px-5 md:py-3 bg-[#374A75] text-[#fafafa] rounded-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="spinner">
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
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <AppointmentConfirmation
              onClose={() => setIsappointmentbooked(false)}
              time={`${value.toDateString()}-${selectedTIme}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
