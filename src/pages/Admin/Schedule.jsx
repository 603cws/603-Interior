import { LuPlus } from "react-icons/lu";
import "./../../styles/calender.css";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { supabase } from "../../services/supabase";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [scheduleData, setScheduleData] = useState();

  const columns = ["GMT+5", "Mon", "Tue", "Wed", "Thrus", "Fri", "Sat"];

  const formatScheduleData = (data) => {
    let scheduleData = {};

    data.forEach((entry) => {
      const parsedTimeSlot = JSON.parse(entry.time_slot); // Parse the JSON string
      const company = entry.company_name; // Extract company name

      for (const [day, slots] of Object.entries(parsedTimeSlot)) {
        if (!scheduleData[day]) {
          scheduleData[day] = {}; // Initialize the day if not present
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

  const rows = Array.from({ length: 12 }, (_, rowIndex) => rowIndex + 1);

  // Function to get start and end date of the week in 'date/month/year' format
  const getWeekRange = (date) => {
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setDate(date.getDate() - dayOfWeek + 1); // Move to Monday
    endDate.setDate(date.getDate() + (6 - dayOfWeek)); // Move to Sunday

    const formatDate = (d) =>
      `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    return { start: formatDate(startDate), end: formatDate(endDate) };
  };

  // Update weekRange whenever selectedDate changes
  useEffect(() => {
    const newWeekRange = getWeekRange(selectedDate);
    setWeekRange(newWeekRange);
  }, [selectedDate]);

  console.log(selectedDate, weekRange);

  useEffect(() => {
    if (weekRange.start !== "" && weekRange.end !== "") {
      getdata();
    }
  }, [weekRange]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const newWeekRange = getWeekRange(date);
    setWeekRange(newWeekRange); // This will trigger the useEffect above
  };

  const getdata = async (date) => {
    console.log(date);
    console.log(weekRange);

    try {
      //   console.log(startweekday, endweekday);

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("date", weekRange.start)
        .lte("date", weekRange.end);

      console.log(data);

      const appointmentdetails = formatScheduleData(data);

      console.log(formatScheduleData(data));
      setScheduleData(appointmentdetails);

      if (error) {
        console.log(error);
      }
    } catch (error) {}
  };

  return (
    <div className="w-full  border-2 border-[#000] rounded-3xl  my-2.5">
      {/* <div className="w-full  border-2 border-[#000] rounded-3xl bg-[#EBF0FF] my-2.5"> */}
      <div className="w-full  overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-2 ">
        <div>
          <div className="text-xl text-[#000] capitalize font-semibold border-b-2 border-b-[#CCCCCC] ">
            <h2 className="px-4">schedule</h2>
          </div>
          <div className="grid grid-cols-[1fr,2fr]">
            <div className="">
              <div className="bg-[#C0C0FF] flex justify-center items-center gap-2 py-3 mx-4 my-2">
                <LuPlus />
                <p className="text-[#3D194F]">Appointment</p>
              </div>
              {/* calender */}
              <div className="flex justify-center items-center">
                <Calendar
                  onChange={handleDateChange}
                  //   onChange={getdata}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={({ date }) =>
                    date < new Date().setHours(0, 0, 0, 0) ||
                    date.getDay() === 0
                  }
                />
              </div>
              <div className="text-[#000] capitalize ">
                <div className="mx-3">
                  <div className="flex justify-between items-center border-b-2 border-b-[#CCCCCC] ">
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
                    {/* <li className="flex justify-between items-center">
                      <p>meeting</p> <BsThreeDots />{" "}
                    </li>
                    <li className="flex justify-between items-center">
                      <p>meeting</p> <BsThreeDots />{" "}
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>

            {/* second div of grid for table */}
            <div>
              <h4 className="border-b-2 border-b-[#000] text-[#3D194F] capitalize">
                {weekRange
                  ? `${weekRange.start}-${weekRange.end}`
                  : "select a date"}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[#ccc] text-[#3D194F] ">
                  {/* Table Header */}
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

                  {/* Table Body */}
                  <tbody className="3xl:[&_td]:py-4">
                    {timeSlots.map((time, rowIndex) => (
                      <tr key={rowIndex} className="">
                        {/* Time Slot Column */}
                        <td className="border border-[#ccc] px-4 py-2 font-bold">
                          {time}
                        </td>

                        {/* Dynamic Data Columns for Mon-Sat */}
                        {scheduleData &&
                          columns.slice(1).map((day, colIndex) => (
                            <td
                              key={colIndex}
                              className="border border-[#ccc] px-4 py-2 relative"
                            >
                              {scheduleData[day]?.[time] && (
                                <div className="bg-purple-100 rounded-lg p-2 shadow-md flex ">
                                  {/* <img
                                    src="https://via.placeholder.com/20"
                                    alt="icon"
                                    className="mr-2"
                                  /> */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
