import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { SlCalender } from "react-icons/sl";
import { PiWarningCircleFill } from "react-icons/pi";
import "./calender.css";
import axios from "axios";
import toast from "react-hot-toast";

import Calendar from "react-calendar";
import { useApp } from "../../Context/Context";
function BookAppointment() {
  const [value, onChange] = useState(new Date());
  const [selectedTIme, setSelectedTime] = useState();
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isappointmentbooked, setIsappointmentbooked] = useState(false);

  const { accountHolder } = useApp();

  // template id
  //   const templateID = "template_zovcusr";
  //   const serviceid = "service_ae0sgim";
  //   const your_public_key = "dR0YyJ3Be6H6xVsT7";

  const clienttemplateID = "template_lcl6e5q";
  const adminTemplateID = "template_biqmorg";
  const serviceid = "service_jyxdbel";
  const your_public_key = "jKWDQroc1z20rCjSB";

  console.log(value);

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

  const handletime = (time) => {
    console.log(time);
    setSelectedTime(time);
  };

  const handlesubmi = async () => {
    const date = value.getDate();
    const month = value.getMonth() + 1;
    const year = value.getFullYear();
    const formattedDate = `${date}/${month}/${year}`;
    console.log(formattedDate, selectedTIme);
    setisSubmitting(true);
    try {
      if (selectedTIme) {
        const data = {
          service_id: serviceid,
          template_id: clienttemplateID,
          user_id: your_public_key,
          template_params: {
            our_companyname: "603 Interior",
            username: accountHolder.companyName,
            date: formattedDate,
            time: selectedTIme,
            to_email: accountHolder.email,
          },
        };
        const Admindata = {
          service_id: serviceid,
          template_id: adminTemplateID,
          user_id: your_public_key,
          template_params: {
            our_companyname: "603 Interior",
            companyname: accountHolder.companyName,
            date: formattedDate,
            time: selectedTIme,
            user_email: accountHolder.email,
            user_phoneno: accountHolder.phone,
          },
        };

        const response = await axios.post(
          "https://api.emailjs.com/api/v1.0/email/send",
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const adminResponse = await axios.post(
          "https://api.emailjs.com/api/v1.0/email/send",
          Admindata,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("Email sent successfully:", response.data);
        console.log("admin email sent", adminResponse.data);

        // alert("Your mail is sent!");
        toast.success("we will shortly reach you");
        setIsappointmentbooked(true);
      } else {
        toast.error("please select the time");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    if (isappointmentbooked) {
      const timer = setTimeout(() => setIsappointmentbooked(false), 3000); // Close modal after duration
      return () => clearTimeout(timer);
    }
  }, [isappointmentbooked]);

  return (
    <div className="fixed inset-0 font-Poppins flex justify-center items-center ">
      <div className="max-w-4xl rounded-2xl border bg-[#fff] ">
        <h2 className="font-semibold text-lg text-[#000] capitalize border border-b-[#CCCCCC]">
          appointment
        </h2>
        <div className=" flex justify-center items-center ">
          {!isappointmentbooked ? (
            <div className="max-w-3xl p-4 my-5">
              <h3 className="text-[#0BA1A1] text-2xl font-bold text-center my-3">
                Book an Appointment
              </h3>
              {/* div for calender and times  */}
              <div className="flex justify-around items-stretch gap-4 xl:gap-6">
                {/* calender */}
                <div>
                  <h3 className="text-sm text-[#111] font-medium ">
                    Schedule date*
                  </h3>
                  <div className="flex gap-2 items-center rounded-xl bg-[#FAFAFA] border-[#757575] border px-2 mb-3">
                    <div>
                      {" "}
                      <SlCalender />{" "}
                    </div>
                    <h2 className="text-[#C4C4C4]">Select the date</h2>
                  </div>
                  <div className="">
                    <Calendar
                      onChange={onChange}
                      value={value}
                      minDate={new Date()}
                      tileDisabled={({ date }) =>
                        date < new Date().setHours(0, 0, 0, 0)
                      } // Disable past dates
                    />
                  </div>
                </div>
                {/* times */}
                <div>
                  <h4 className="text-[#111] font-medium text-base mb-3">
                    select time*
                  </h4>
                  <div className="grid grid-cols-3 gap-x-5 gap-y-3">
                    {times.map((time, index) => (
                      <button
                        key={time}
                        onClick={(e) => handletime(time)}
                        className={` border border-[#757575] px-4 py-3 rounded-xl text-xs xl:text-sm ${
                          selectedTIme === time
                            ? "text-[#ebffff] bg-[#194f48]"
                            : "text-[#194F48] bg-[#EBFFFF]"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center bg-[#FEF4EB] gap-2 mt-10">
                    <div>
                      <PiWarningCircleFill color="#D59E61" size={20} />
                    </div>
                    <h2 className="text-sm text-[#000]">
                      All times are in central Time(India)
                    </h2>
                  </div>
                </div>
              </div>
              {/* button for submit */}
              <div className="flex justify-center items-center my-4">
                <button
                  onClick={handlesubmi}
                  className="px-5 py-3 bg-[#0BA1A1] text-[#fafafa] rounded-lg"
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
            <div className="max-w-3xl p-4 my-5 flex justify-center items-center ">
              <div className="w-[280px] h-[250px] m-20 ">
                <img
                  src="/images/Appointment.gif"
                  alt="bookedappointment gif"
                  className="h-full w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
// import { useEffect, useState } from "react";
// import axios from "axios";
// function BookAppointment() {
//   const getTheme = (darkMode) => ({
//     background: {
//       default: darkMode ? "#121212" : "#F5F5F5",
//     },
//     text: {
//       primary: darkMode ? "#E0E0E0" : "#212121",
//     },
//   });

//   const [quantity, setQuantity] = useState(1);

//   const times2 = [
//     "9:00 am",
//     "9:30 am",
//     "10:00 am",
//     "10:30 am",
//     "11:00 am",
//     "11:30 am",
//     "12:00 pm",
//     "12:30 pm",
//     "1:00 pm",
//     "1:30 pm",
//     "2:00 pm",
//     "2:30 pm",
//     "3:00 pm",
//     "3:30 pm",
//     "4:00 pm",
//     "4:30 pm",
//     "5:00 pm",
//     "5:30 pm",
//     "6:00 pm",
//     "6:30 pm",
//     "7:00 pm",
//     "7:30 pm",
//     "8:00 pm",
//     "8:30 pm",
//     "9:00 pm",
//     "10:00 pm",
//   ];

//   const getTimeInMinutes = (timeStr) => {
//     const [time, period] = timeStr.split(" ");
//     const [hourStr, minuteStr] = time.split(":");
//     const hour = parseInt(hourStr, 10);
//     const minute = parseInt(minuteStr, 10);

//     return ((hour % 12) + (period === "pm" ? 12 : 0)) * 60 + minute;
//   };

//   const getFilteredTimes = (selectedDay, currentTime) => {
//     if (selectedDay === null) {
//       return times;
//     }

//     const today = new Date();
//     const selectedDate = new Date(
//       currentTime.getFullYear(),
//       currentTime.getMonth(),
//       selectedDay
//     );
//     if (selectedDate.toDateString() === today.toDateString()) {
//       const currentTimeInMinutes =
//         currentTime.getHours() * 60 + currentTime.getMinutes();
//       return times.filter((time) => {
//         const timeInMinutes = getTimeInMinutes(time);
//         return timeInMinutes > currentTimeInMinutes;
//       });
//     } else {
//       return times;
//     }
//   };

//   const handledecQuan = () => {
//     if (quantity <= 1) return;
//     setQuantity(() => quantity - 1);
//   };

//   //handle inc
//   const handleincQuan = () => {
//     if (quantity >= 20) return;
//     setQuantity(() => quantity + 1);
//   };

//   const [selectedDate, setSelectedDate] = useState("");
//   const [showcalenderconfroom, setshowcalenderconfroom] = useState(false);
//   const [showcalenderdaypass, setshowcalenderdaypass] = useState(false);
//   const [showcalendermeetroom, setshowcalendermeetroom] = useState(false);
//   useEffect(() => {
//     console.log("selectedDate", selectedDate);
//   });
//   const [selectedLocation, setselectedLocation] = useState("");
//   const [spacetype, setspacetype] = useState("");
//   const [selectedStartTime, setSelectedStartTime] = useState("");
//   const [selectedEndTime, setSelectedEndTime] = useState("");
//   const [unavailabledaypasses, setunavailabledaypasses] = useState([]);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [timedifference, settimedifference] = useState(0);
//   const [enableconftime, setenableconftime] = useState(false);
//   const [enabledaypasstime, setenabledaypasstime] = useState(false);
//   const [enablemeettime, setenablemeettime] = useState(false);
//   const [timings, setTimings] = useState([]);
//   const [availableStartTimes, setAvailableStartTimes] = useState([]);
//   const [availableEndTimes, setAvailableEndTimes] = useState([]);
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // const [coupon, setCoupon] = useState("");

//   //daypass price manipulation based on quantity

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const calendarStyle = {
//     justifyContent: "center",
//     display: "grid",
//     gridTemplateColumns: "repeat(7, 1fr)",
//     gap: windowWidth > 390 ? "10px" : "6px",
//     margin: "20px 0",
//   };

//   const dayStyle = {
//     width: "22px",
//     height: "22px",
//     fontSize: "14px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: "5px",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//     cursor: "pointer",
//   };

//   //   const dayStyle = {
//   //     width:
//   //       windowWidth > 1280
//   //         ? "60px"
//   //         : windowWidth > 545
//   //         ? "45px"
//   //         : windowWidth > 377
//   //         ? "40px"
//   //         : "35px",
//   //     height: windowWidth > 440 ? "40px" : "35px",
//   //     fontSize: windowWidth > 582 ? undefined : "14px",
//   //     display: "flex",
//   //     justifyContent: "center",
//   //     alignItems: "center",
//   //     borderRadius: "5px",
//   //     fontFamily: "Poppins, sans-serif",
//   //     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   //     cursor: "pointer",
//   //   };

//   const availableStyle1 = {
//     backgroundColor: "white", // green-400
//     color: "black",
//   };

//   const selectedStyle = {
//     backgroundColor: "#34D399", // green-400
//     color: "white",
//   };

//   const partiallyBookedStyle = {
//     backgroundColor: "#fff778", // yellow-400
//   };

//   const pastDayStyle = {
//     backgroundColor: "#d3d3d3", // gray
//     color: "#a9a9a9", // dark gray
//     cursor: "not-allowed",
//   };

//   useEffect(() => {
//     const updateCurrentTime = () => setCurrentTime(new Date());
//     const interval = setInterval(updateCurrentTime, 60000); // Update every minute

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (selectedStartTime && selectedEndTime) {
//       const startMinutes = getTimeInMinutes(selectedStartTime);
//       const endMinutes = getTimeInMinutes(selectedEndTime);
//       const difference = (endMinutes - startMinutes) / 60;
//       settimedifference(difference);
//     } else {
//       settimedifference(0);
//     }
//   }, [selectedStartTime, selectedEndTime]);

//   const changeday = (day) => {
//     setSelectedStartTime("");
//     setSelectedEndTime("");

//     let availableStartTimesUnfiltered = getFilteredTimes(day, currentTime);
//     console.log("Initial available times:", availableStartTimesUnfiltered);

//     if (timings.length > 0) {
//       timings.forEach(([start, end]) => {
//         const startTimeInMinutes = getTimeInMinutes(start.toString());
//         const endTimeInMinutes = getTimeInMinutes(end.toString());

//         availableStartTimesUnfiltered = availableStartTimesUnfiltered.filter(
//           (time) => {
//             const timeInMinutes = getTimeInMinutes(time);
//             // Keep the end time but filter out times within the interval
//             if (timeInMinutes === endTimeInMinutes) {
//               return true;
//             }
//             return (
//               timeInMinutes < startTimeInMinutes ||
//               timeInMinutes > endTimeInMinutes
//             );
//           }
//         );
//       });
//     }

//     setAvailableStartTimes(availableStartTimesUnfiltered);
//     console.log("Filtered start times:", availableStartTimesUnfiltered);
//   };

//   const selectendtimefunction = (starttime) => {
//     const startIndex = availableStartTimes.indexOf(starttime);
//     if (startIndex === -1) return;

//     const endTimes = [];

//     for (let i = startIndex + 1; i < availableStartTimes.length; i++) {
//       const currentEndTime = availableStartTimes[i];
//       const previousTime = availableStartTimes[i - 1];

//       const currentEndTimeInMinutes = getTimeInMinutes(currentEndTime);
//       const previousTimeInMinutes = getTimeInMinutes(previousTime);

//       const differenceInMinutes =
//         currentEndTimeInMinutes - previousTimeInMinutes;
//       if (differenceInMinutes == 30) {
//         endTimes.push(currentEndTime);
//       } else {
//         const y = times2.indexOf(previousTime);
//         console.log(y, "rjojro");
//         endTimes.push(times2[y + 1]);
//         break;
//       }
//     }

//     setAvailableEndTimes(endTimes);
//     console.log("Filtered end times:", endTimes);
//   };

//   useEffect(() => {
//     if (selectedStartTime !== "") {
//       selectendtimefunction(selectedStartTime);
//     }
//   }, [selectedStartTime]);

//   useEffect(() => {
//     if (selectedDay !== null) {
//       changeday(selectedDay);
//     }
//   }, [selectedDay, timings, currentTime]);

//   useEffect(() => {
//     setSelectedDate("");
//   }, [selectedLocation]);

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const calendarHeaderStyle = {
//     // display: "flex",
//     justifyContent: "space-between",
//     width: "100%",
//     padding: windowWidth > 560 ? "0 2rem" : "0 0.5rem",
//   };

//   const inputContainerStyle = {
//     display: "flex",
//     flexDirection: "column",
//     width: "100%",
//     alignItems: "center",
//   };

//   const inputStyle = {
//     padding: "10px",
//     fontSize: "16px",
//     width: "100%",
//     borderRadius: "8px",
//     border: "1px solid #d1d5db", // gray-300
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//     marginTop: "5px",
//   };

//   const labelStyle = {
//     fontSize: "15px",
//     width: "100%",
//     color: "#4B5563",
//     fontFamily: "Poppins, sans-serif",
//     textAlign: "left",
//     marginTop: "10px",
//   };

//   const buttonStyle = {
//     backgroundColor: "#e1e1e1",
//     padding: "2px 8px",
//     borderRadius: "80%",
//     boxShadow: "0 10px 20px rgba(194, 194, 194, 0.1)",
//     fontSize: "20px",
//     cursor: "pointer",
//   };

//   const headerStyle = {
//     marginBottom: "15px",
//     fontSize: windowWidth > 390 ? "15px" : "14px",
//     paddingTop: "10px",
//     fontWeight: "bold",
//     color: "#4B5563",
//     fontFamily: "Poppins, sans-serif",
//   };

//   const timestyle = {
//     fontSize: windowWidth > 350 ? undefined : "13px",
//     display: "flex",
//     alignItems: "center",
//     color: "black",
//     fontWeight: "bold",
//   };

//   useEffect(() => {
//     if (selectedDay !== null) {
//       const date = `${selectedDay}/${currentMonth + 1}/${currentYear}`;
//       setSelectedDate(date);
//     }
//   }, [selectedDay, currentMonth, currentYear]);

//   useEffect(() => {
//     const date = `${selectedDay}/${currentMonth + 1}/${currentYear}`;
//     setSelectedDate(date);
//   }, [currentMonth, currentYear, selectedLocation]);

//   useEffect(() => {
//     const updateCurrentTime = () => setCurrentTime(new Date());
//     const interval = setInterval(updateCurrentTime, 60000); // Update every minute

//     return () => clearInterval(interval);
//   }, []);

//   const isWeekend = (day, month, year) => {
//     const date = new Date(year, month, day);
//     const dayOfWeek = date.getDay();
//     return dayOfWeek === 0 || dayOfWeek === 6;
//   };

//   const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

//   const changeMonth = (increment) => {
//     let newMonth = currentMonth + increment;
//     let newYear = currentYear;

//     if (newMonth < 0) {
//       newMonth = 11;
//       newYear -= 1;
//     } else if (newMonth > 11) {
//       newMonth = 0;
//       newYear += 1;
//     }
//     setCurrentMonth(newMonth);
//     setCurrentYear(newYear);
//     setSelectedDay(null);
//     setSelectedStartTime("");
//     setSelectedEndTime("");
//   };

//   const handleStartTimeChange = (event) => {
//     setSelectedStartTime(event.target.value);
//     setSelectedEndTime("");
//   };

//   const handleEndTimeChange = (event) => {
//     setSelectedEndTime(event.target.value);
//   };

//   const isPastDay = (day) => {
//     const today = new Date();
//     const date = new Date(currentYear, currentMonth, day);
//     today.setHours(0, 0, 0, 0);
//     return date < today;
//   };
//   const times = [
//     "09:00 am",
//     "10:00 am",
//     "11:00 am",
//     "12:00 pm",
//     "01:00 pm",
//     "02:00 pm",
//     "03:00 pm",
//     "04:00 pm",
//     "05:00 pm",
//     "06:00 pm",
//     "07:00 pm",
//     "08:00 pm",
//   ];
//   return (
//     <div className="font-Poppins">
//       <div className="max-w-4xl rounded-xl bg-[#fff]">
//         <h2 className="font-semibold text-lg text-[#000] capitalize border border-b-[#CCCCCC]">
//           appointment
//         </h2>

//         <div>
//           <h3>Book an Appointment</h3>
//           {/* div for calender and times  */}
//           <div className="flex justify-around items-center">
//             {/* calender */}
//             <div>
//               <div className="flex justify-around">
//                 <button style={buttonStyle} onClick={() => changeMonth(-1)}>
//                   {"<"}
//                 </button>
//                 <h2 style={timestyle}>{`${new Date(
//                   currentYear,
//                   currentMonth
//                 ).toLocaleString("default", {
//                   month: "long",
//                 })} ${currentYear}`}</h2>
//                 <button style={buttonStyle} onClick={() => changeMonth(1)}>
//                   {">"}
//                 </button>
//               </div>
//               <div className="grid justify-center grid-cols-7 gap-2 my-5">
//                 {Array.from(
//                   { length: daysInMonth(currentMonth, currentYear) },
//                   (_, index) => index + 1
//                 ).map((day) => (
//                   <div
//                     key={day}
//                     className="w-[22px] h-[22px] text-[14px] flex justify-center items-center rounded-[5px] shadow-md cursor-pointer"
//                     style={{
//                       ...(isPastDay(day)
//                         ? pastDayStyle
//                         : isWeekend(day, currentMonth, currentYear)
//                         ? partiallyBookedStyle
//                         : availableStyle1),
//                       ...(selectedDay === day && selectedStyle),
//                     }}
//                     onClick={() => {
//                       if (!isPastDay(day)) {
//                         setSelectedDay(day);
//                         setSelectedStartTime("");
//                         setSelectedEndTime("");
//                         setenableconftime(true);
//                       }
//                     }}
//                   >
//                     {day}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* times */}
//             <div>
//               <h4 className="text-[#111] font-medium text-base">
//                 select time*
//               </h4>
//               <div className="grid grid-cols-3">
//                 {times.map((time) => (
//                   <button className="bg-[#EBFFFF] border-[#757575] px-4 py-3 rounded-xl">
//                     {time}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BookAppointment;
