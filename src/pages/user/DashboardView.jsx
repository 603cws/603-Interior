import ReactApexChart from "react-apexcharts";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { colors } from "../../constants/constant";

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
  isExpanded,
}) {
  const [currentAreaValues, setCurrentAreaValues] = useState({});
  const [currentAreaQuantities, setCurrentAreaQuantities] = useState({});
  useEffect(() => {
    if (!selectedBoq?.layout) return;

    const areas = {};
    const quantities = {};

    Object.entries(selectedBoq?.layout).forEach(([key, value]) => {
      if (key.includes("Area")) {
        const name = key.replace("Area", "");
        areas[name] = value;
      } else if (key.includes("Qty")) {
        const name = key.replace("Qty", "");
        quantities[name] = value;
      }
    });

    setCurrentAreaValues(areas);
    setCurrentAreaQuantities(quantities);
  }, [selectedBoq]);

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
    lounge: "Lounge",
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
    washrooms: "Wash rooms",
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
      enabled: false,
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
    <div className="lg:w-full container mx-auto max-w-sm md:max-w-full flex flex-col lg:flex-row overflow-auto lg:overflow-y-auto scrollbar-hide  py-2 px-3 font-Poppins">
      <div className="xl:w-2/3">
        <div className="p-2 lg:p-4 border border-[#ccc] rounded-lg">
          <h2 className="capitalize font-semibold mb-2 text-base lg:text-xl">
            Layout Information : selected boq {selectedBoq?.boqTitle || "NA"}
          </h2>
          <div
            className={`flex flex-col ${
              isExpanded ? "flex-wrap" : "md:flex-wrap xl:flex-nowrap"
            } items-center gap-3 md:items-stretch md:flex-row lg:gap-10`}
          >
            <LayoutInfoCard
              selectedBoq={selectedBoq}
              value={selectedBoq?.layout?.totalArea}
              title={"total Area"}
              image={"/images/layouticon.png"}
              spanvalue={"sqft"}
            />
            <LayoutInfoCard
              selectedBoq={selectedBoq}
              value={selectedBoq?.products?.length}
              title={"Total No Product"}
              image={"/images/totalproduct.png"}
            />
            <LayoutInfoCard
              selectedBoq={selectedBoq}
              value={selectedBoq?.boqTotalPrice}
              title={"Total Amount"}
              image={"/images/grandtotal.png"}
              spanvalue={" INR"}
            />
          </div>
        </div>
        <div className="p-3 border border-[#ccc] rounded-lg mt-6 ">
          <h3 className="capitalize font-semibold mb-2 text-base lg:text-xl">
            BOQ generated
          </h3>
          <div
            className={`flex gap-2 lg:gap-3 flex-wrap justify-center ${
              isExpanded ? "md:justify-normal" : "md:justify-between"
            } `}
          >
            {isboqavailable &&
              boqdata.map((boq, index) => {
                return (
                  <div key={boq.id}>
                    <GeneratedBOQCard
                      boq={boq}
                      onDelete={handledeleteBoq}
                      selectedBoq={selectedBoq}
                    />
                  </div>
                );
              })}
          </div>
          {!isboqavailable && (
            <div>
              <h3>You havent saved a BOQ yet</h3>
            </div>
          )}
        </div>
      </div>
      <div className="my-6 lg:my-0 xl:w-1/3 lg:flex justify-center">
        <div className="border-2 p-2 lg:p-4 rounded-xl  lg:h-96 flex flex-col justify-around">
          <div className="w-[300px] h-[200px] lg:w-[370px] lg:h-[270px] sm:w-full sm:h-[270px] mb-2 lg:mb-3">
            <ReactApexChart
              options={options}
              series={[{ data: series }]}
              type="treemap"
              width="100%"
              height="100%"
              className="distribution-chart"
            />
          </div>
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

function LayoutInfoCard({ selectedBoq, value, title, image, spanvalue }) {
  return (
    <div className="w-full md:w-[267px] flex  justify-between lg:justify-around items-center gap-3 border border-[#ccc] py-3 px-2">
      <div className="flex-1 flex justify-center items-center">
        <img
          src={image}
          alt={title}
          className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
        />
      </div>
      <div className="capitalize lg:pr-10 flex-1">
        <p className="font-semibold text-lg">
          {selectedBoq && value}
          {spanvalue && <span> {spanvalue}</span>}
        </p>
        <p className="text-base">{title}</p>
      </div>
    </div>
  );
}

function GeneratedBOQCard({ boq, onDelete, selectedBoq }) {
  return (
    <div
      className={`w-[270px]  border border-[#CCCCCC] font-Poppins p-2 xl:p-4 rounded-lg text-[#000] ${
        selectedBoq?.id === boq?.id
          ? "bg-gradient-to-br from-[#23445B] to-[#487BA0] text-[#fff]"
          : ""
      }`}
    >
      <div className="flex justify-between mb-1.5">
        <h5
          className="font-semibold text-xl text-ellipsis overflow-hidden text-nowrap"
          title={boq?.boqTitle}
        >
          {boq?.boqTitle}
        </h5>

        <button onClick={() => onDelete(boq)} className="hover:text-red-600">
          {" "}
          <MdDeleteOutline size={25} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5  ">
        <p>Total Area</p>
        <p>{boq?.layout?.totalArea} sqft.</p>
        <p>Used</p>
        <p> {boq?.layout?.usedSpace} sqft.</p>
        <p>Unused</p>
        <p> {boq?.layout?.totalArea - boq?.layout?.usedSpace}sqft.</p>
      </div>
    </div>
  );
}
