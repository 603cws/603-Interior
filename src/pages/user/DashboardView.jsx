import ReactApexChart from "react-apexcharts";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";

function DashboardView({
  currentLayoutData,
  currentLayoutID,
  totalArea,
  selectedBoq,
  isboqavailable,
  products,
  boqdata,
  handlecheckboqdetails,
  handledeleteBoq,
}) {
  const [currentAreaValues, setCurrentAreaValues] = useState({});
  const [currentAreaQuantities, setCurrentAreaQuantities] = useState({});
  useEffect(() => {
    if (!currentLayoutData) return;

    const areas = {};
    const quantities = {};

    Object.entries(currentLayoutData).forEach(([key, value]) => {
      if (key.includes("Area")) {
        const name = key.replace("Area", "");
        areas[name] = value;
      } else if (key.includes("Qty")) {
        const name = key.replace("Qty", "");
        quantities[name] = value;
      }
    });

    console.log("Extracted Areas and Quantities:", areas, quantities);

    setCurrentAreaValues(areas);
    setCurrentAreaQuantities(quantities);
  }, [currentLayoutData, totalArea, currentLayoutID]);

  const fullNames = {
    linear: "Linear Workspace",
    lType: "L-Type Workspace",
    md: "MD Cabin",
    manager: "Manager Cabin",
    small: "Small Cabin",
    ups: "UPS Room",
    bms: "BMS Room",
    server: "Server Room",
    reception: "Reception",
    lounge: "Lounge/Pantry",
    fitness: "Fitness Zone",
    sales: "Sales Team",
    phoneBooth: "Phone Booth",
    discussionRoom: "Discussion Room",
    interviewRoom: "Interview Room",
    conferenceRoom: "Conference Room",
    boardRoom: "Board Room",
    meetingRoom: "Meeting Room",
    meetingRoomLarge: "Meeting Room (Large)",
    hrRoom: "HR Room",
    financeRoom: "Finance Room",
    executiveWashroom: "Executive Washroom",
    breakoutRoom: "Breakout Room",
    videoRecordingRoom: "Video Recording Room",
    other: "Other", // Add new category here
    // maleWashroom: "Male Washroom",
    // femaleWashroom: "Female Washroom",
    washrooms: "Washrooms",
  };

  const colors = {
    "Linear Workspace": "#62897E",
    "L-Type Workspace": "#3F5855",
    "MD Cabin": "#1D3130",
    "Manager Cabin": "#293C3E",
    "Small Cabin": "#4A5E65",
    "UPS Room": "#737F85",
    "BMS Room": "#8CDDCE",
    "Server Room": "#54A08C",
    Reception: "#368772",
    "Lounge/Pantry": "#2A3338",
    "Video Recording Room": "#354044",
    "Sales Team": "#3C464F",
    "Phone Booth": "#515554",
    "Discussion Room": "#868A8E",
    "Interview Room": "#A4ACAF",
    "Conference Room": "#488677",
    "Board Room": "#3A4B45",
    "Meeting Room": "#1E8D78",
    "Meeting Room (Large)": "#07281D",
    "HR Room": "#233736",
    "Finance Room": "#081011",
    "Executive Washroom": "#567F7D",
    "Breakout Room": "#74D0C1",
    "Available Space": "#1F5C54",
    Other: "#5E9B96", // Color for the "Other" category
    // "Male Washroom": "#95D5B2",
    // "Female Washroom": "#85CEA8",
    Washrooms: "#85CEA8",
  };

  const validTotalArea = currentAreaValues.total;
  const builtArea = Object.keys(currentAreaQuantities).reduce(
    (acc, key) => acc + currentAreaQuantities[key] * currentAreaValues[key],
    0
  );
  const availableArea = validTotalArea - builtArea;

  const series = [
    ...Object.keys(currentAreaQuantities).map((key) => {
      const areaOccupied = currentAreaQuantities[key] * currentAreaValues[key];
      const percentage = ((areaOccupied / validTotalArea) * 100).toFixed(2);
      return {
        x: `${fullNames[key] || key}: ${percentage}%`,
        y: `${areaOccupied} sq ft`,
        fillColor: colors[fullNames[key]] || "#000000",
      };
    }),
    {
      x: `Available Space: ${((availableArea / validTotalArea) * 100).toFixed(
        2
      )}%`,
      y: availableArea,
      fillColor: colors["Available Space"],
    },
  ];

  const options = {
    chart: {
      type: "treemap",
      height: 250,
      toolbar: {
        show: true,
      },
    },
    title: {
      text: "Area Distribution of Workspaces",
      align: "center",
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    dataLabels: {
      enabled: totalArea < 2000 ? true : false,
      style: {
        fontSize: "14rem",
        fontWeight: "bold",
        colors: ["#FFFFFF"],
      },
      formatter: (val, opts) => {
        if (typeof val === "number") {
          const percentage = ((val / validTotalArea) * 100).toFixed(2);
          return `${
            opts.w.globals.labels[opts.dataPointIndex]
          } (${percentage}%)`;
        }
        return `${opts.w.globals.labels[opts.dataPointIndex]}: ${val}`;
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.1,
        },
      },
    },
  };

  return (
    <div className="w-full flex overflow-y-auto scrollbar-hide  py-2 px-3 font-Poppins">
      {/* dashboard area layout */}
      <div className="w-2/3">
        <div className="p-4 border border-[#ccc] rounded-lg">
          <h2 className="capitalize font-bold mb-2 text-xl">
            Layout Information : selected boq {selectedBoq?.title || "NA"}
          </h2>
          {/* div containing information */}
          <div className="flex gap-10">
            {/* each icon  */}
            <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
              <div>
                <img
                  src="/images/layouticon.png"
                  alt=" dashboard layout "
                  className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                />
              </div>
              <div className="capitalize pr-10">
                <p className="font-bold text-lg">
                  {/* {selectedBoq.total_area} */}
                  {selectedBoq && selectedBoq.total_area}
                  <span>sqft</span>
                </p>
                <p className="text-base">total area</p>
              </div>
            </div>
            {/* each icon  */}
            <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
              <div>
                <img
                  src="/images/totalproduct.png"
                  alt=" dashboard layout "
                  className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                />
              </div>
              <div className="capitalize pr-10">
                <p className="font-bold text-lg">
                  {selectedBoq && products && products.length}{" "}
                </p>
                <p className="text-base">Total No Product</p>
              </div>
            </div>
            {/* each icon  */}
            <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
              <div>
                <img
                  src="/images/grandtotal.png"
                  alt=" dashboard layout "
                  className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                />
              </div>
              <div className="capitalize pr-10">
                <p className="font-bold text-lg">
                  {/* 1500 <span>sqft</span> */}
                  {selectedBoq && selectedBoq.totalprice} <span>INR</span>
                </p>
                <p className="text-base">Total Amount</p>
              </div>
            </div>
          </div>
        </div>
        {/* dashboard boq part */}
        <div className="p-3 border border-[#ccc] rounded-lg mt-6 ">
          <h3 className="capitalize font-bold ">BOQ generated</h3>
          {/* boq card */}
          {isboqavailable &&
            boqdata.map((boq, index) => {
              return (
                <div
                  key={boq.title}
                  className="rounded-lg border-2 border-[#ccc] max-w-sm p-2 mb-3"
                >
                  <div className="flex justify-end gap-2 p-2">
                    {/* <MdOutlineModeEdit size={30} /> */}
                    <button
                      className={`px-5 py-1  rounded-lg capitalize border ${
                        selectedBoq.title == boq.title
                          ? " bg-[#374A75] border-[#374a75] text-white"
                          : "bg-white border-[#ccc] text-[#374a75]"
                      }`}
                      onClick={() => handlecheckboqdetails(boq)}
                    >
                      details
                    </button>
                    <button
                      onClick={() => handledeleteBoq(boq)}
                      className="hover:text-red-600"
                    >
                      {" "}
                      <MdDeleteOutline size={30} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold">{boq.title}</h3>
                  </div>
                </div>
              );
            })}

          {!isboqavailable && (
            <div>
              <h3>You havent saved a BOQ yet</h3>
            </div>
          )}
        </div>
      </div>
      <div className="w-1/3  flex justify-center">
        <div className="border-2 p-4 rounded-xl h-96">
          <ReactApexChart
            options={options}
            series={[{ data: series }]}
            type="treemap"
            className="distribution-chart"
            height={270}
            width={370}
          />
          <p className="text-sm text-center">
            This layout is of total area{" "}
            <span className="font-bold">{currentAreaValues.total} sq. ft.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
