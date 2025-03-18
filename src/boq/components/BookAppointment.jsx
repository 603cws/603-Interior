import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { SlCalender } from "react-icons/sl";
import { PiWarningCircleFill } from "react-icons/pi";
import "../../styles/calender.css";
import axios from "axios";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";

import Calendar from "react-calendar";
import { useApp } from "../../Context/Context";
import AppointmentConfirmation from "./AppointmentConfirmation";
import { IoMdClose } from "react-icons/io";
function BookAppointment({ onClose }) {
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

  const getNextTime = (selectedTime) => {
    const index = times.indexOf(selectedTime);
    return index !== -1 && index < times.length - 1
      ? times[index + 1]
      : "09:00 pm";
  };

  const handlesubmi = async () => {
    const date = value.getDate();
    const month = value.getMonth() + 1;
    const year = value.getFullYear();
    const formattedDate = `${date}/${month}/${year}`;
    console.log(formattedDate, selectedTIme);
    setisSubmitting(true);
    console.log(value.toLocaleDateString("en-US", { weekday: "short" }));

    const weekday = value.toLocaleDateString("en-US", { weekday: "short" });

    const endtime = getNextTime(selectedTIme);

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

        saveBookingDatainDB(formattedDate, weekday, endtime);
      } else {
        toast.error("please select the time");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisSubmitting(false);
    }
  };

  const saveBookingDatainDB = async (date, weekday, endtime) => {
    //
    try {
      const { data, error } = await supabase.from("appointments").insert([
        {
          user_id: accountHolder.userId, // Assuming accountHolder contains user ID
          date,
          time_slot: JSON.stringify({
            [weekday]: { [selectedTIme]: `${selectedTIme}-${endtime}` },
          }),
          company_name: accountHolder.companyName,
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error.message);
        toast.error("Failed to book appointment");
        return;
      }

      toast.success("Appointment booked successfully");
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (isappointmentbooked) {
  //     const timer = setTimeout(() => setIsappointmentbooked(false), 3000); // Close modal after duration
  //     return () => clearTimeout(timer);
  //   }
  // }, [isappointmentbooked]);

  return (
    <div className="fixed inset-0 font-Poppins flex justify-center items-center z-20 bg-black bg-opacity-80">
      <div className="max-w-4xl rounded-2xl border bg-[#fff] p-5 relative">
        <div className="absolute right-5 top-5">
          <IoMdClose onClick={onClose} size={20} className="cursor-pointer" />
        </div>
        <h2 className="font-semibold text-lg text-[#000] capitalize border-b-2 border-[#CCCCCC]">
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
                        date < new Date().setHours(0, 0, 0, 0) ||
                        date.getDay() === 0
                      } // Disable past dates and Sundays
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
            // <div className="max-w-3xl p-4 my-5 flex justify-center items-center ">
            //   <div className="w-[280px] h-[250px] m-20 ">
            //     <img
            //       src="/images/Appointment.gif"
            //       alt="bookedappointment gif"
            //       className="h-full w-full"
            //     />
            //   </div>
            // </div>
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
