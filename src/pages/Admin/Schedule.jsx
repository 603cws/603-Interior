import { LuPlus } from "react-icons/lu";
import "./../../styles/calender.css";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { supabase } from "../../services/supabase";

const timeSlots = [
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

const columns = ["GMT+5", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];
function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [scheduleData, setScheduleData] = useState();

  const formatScheduleData = (data) => {
    let scheduleData = {};

    data.forEach((entry) => {
      const parsedTimeSlot = JSON.parse(entry.time_slot);
      const company = entry.company_name;

      for (const [day, slots] of Object.entries(parsedTimeSlot)) {
        if (!scheduleData[day]) {
          scheduleData[day] = {};
        }

        for (const [startTime, timeRange] of Object.entries(slots)) {
          scheduleData[day][startTime] = {
            timeRange,
            company,
          };
        }
      }
    });

    return scheduleData;
  };

  const getWeekRange = (date) => {
    const dayOfWeek = date.getDay();
    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setDate(date.getDate() - dayOfWeek + 1);
    endDate.setDate(date.getDate() + (6 - dayOfWeek));

    const formatDate = (d) =>
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    return { start: formatDate(startDate), end: formatDate(endDate) };
  };
  useEffect(() => {
    const newWeekRange = getWeekRange(selectedDate);
    setWeekRange(newWeekRange);
  }, [selectedDate]);

  useEffect(() => {
    if (weekRange.start !== "" && weekRange.end !== "") {
      getdata();
    }
  }, [weekRange]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const newWeekRange = getWeekRange(date);
    setWeekRange(newWeekRange);
  };

  function formatDate(d) {
    const [day, month, year] = d.split("/");
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }

  const getdata = async (date) => {
    try {
      const formatted = {
        start: formatDate(weekRange.start),
        end: formatDate(weekRange.end),
      };

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("date_new", formatted?.start)
        .lte("date_new", formatted?.end);

      const appointmentdetails = formatScheduleData(data);
      setScheduleData(appointmentdetails);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 lg:border-[#334A78] lg:rounded-lg bg-white ">
      <div className="w-full  overflow-y-auto scrollbar-hide h-[calc(100vh-110px)] py-2 ">
        <div>
          <div className="text-xl text-[#000] capitalize font-semibold border-b-2 border-b-[#CCCCCC] py-2">
            <h2 className="px-4 ">schedule</h2>
          </div>
          <div className="lg:grid grid-cols-[1fr,2fr]">
            <div className="">
              <div className="bg-[#374A75] flex justify-center items-center gap-2 py-3 m-3 rounded text-[#fff]">
                <LuPlus />
                <p className="">Appointment</p>
              </div>
              <div className="flex justify-center items-center my-10">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={({ date }) =>
                    date < new Date().setHours(0, 0, 0, 0) ||
                    date.getDay() === 0
                  }
                />
              </div>
              <div className="text-[#000] capitalize border border-[#CCC] rounded-lg m-3 p-2">
                <div className="">
                  <div className="flex justify-between items-center border-b border-b-[#CCCCCC] ">
                    <h3 className="font-medium">Event Type</h3>
                    <BsThreeDots />
                  </div>
                  <ul className=" list-inside">
                    <li className="flex justify-between items-center ">
                      <p className="before:content-['•'] before:mr-2">
                        meeting
                      </p>{" "}
                      <BsThreeDots />{" "}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <h4 className="border-b-2 border-b-[#000] text-[#3D194F] capitalize">
                {weekRange
                  ? `${weekRange.start}-${weekRange.end}`
                  : "select a date"}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#ccc] text-[#3D194F] ">
                  <thead>
                    <tr className="">
                      {columns.map((col, index) => (
                        <th
                          key={index}
                          className="border border-[#ccc] px-4 py-2 text-left"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="3xl:[&_td]:py-4">
                    {timeSlots.map((time, rowIndex) => (
                      <tr key={rowIndex} className="">
                        <td className="border border-[#ccc] px-4 py-2 font-bold">
                          {time}
                        </td>
                        {scheduleData &&
                          columns.slice(1).map((day, colIndex) => (
                            <td
                              key={colIndex}
                              className="border border-[#ccc] px-4 py-2 relative"
                            >
                              {scheduleData[day]?.[time] && (
                                <div className="bg-purple-100 rounded-lg p-2 shadow-md flex ">
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {scheduleData[day][time].company}
                                    </p>
                                    <p className="text-xs">
                                      {scheduleData[day][time].timeRange}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="lg:hidden">
              {scheduleData && (
                <div className="m-3">
                  <p className="text-sm text-[#374A75] my-7 text-left font-semibold">
                    {weekRange.start} - {weekRange.end}
                  </p>
                  {Object.entries(scheduleData).map(([day, slots]) =>
                    Object.entries(slots).map(([time, details]) => (
                      <div
                        key={day + time}
                        className="bg-[#EFF4FF] text-[#374A75] mb-7 p-3 rounded-2xl flex items-center gap-4"
                      >
                        <div>
                          <img
                            src="/images/user.png"
                            alt="user profile icon"
                            className="h-10 w-10"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">
                            {details.company}
                          </h4>
                          <p className="text-xs">
                            {day} - {details.timeRange}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
