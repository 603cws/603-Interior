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

    console.log("Extracted Areas and Quantities:", areas, quantities);

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
  // selectedboq
  //   {
  //     "id": "94b2dbfd-d40f-4ee3-a1ae-a4aef73a3348",
  //     "created_at": "2025-08-05T05:00:41.167669+00:00",
  //     "product_id": "8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,cb49b241-4be9-4a23-8e64-bc91a958146c,cb49b241-4be9-4a23-8e64-bc91a958146c,cb49b241-4be9-4a23-8e64-bc91a958146c,cb49b241-4be9-4a23-8e64-bc91a958146c,4273f792-c25c-4d56-bd31-1b90466ea9e3,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,40861111-e2d6-4c7d-9de8-0f75f2ad1efd,e1a7742e-e8bf-4541-a4c8-7eb0cb1f1770,e1a7742e-e8bf-4541-a4c8-7eb0cb1f1770,04c62ab1-02e1-4298-8a83-a572c7e29b6b,04c62ab1-02e1-4298-8a83-a572c7e29b6b,76a3ed5a-7431-470e-9597-5f281160ead3,76a3ed5a-7431-470e-9597-5f281160ead3,76a3ed5a-7431-470e-9597-5f281160ead3,76a3ed5a-7431-470e-9597-5f281160ead3,a758001a-12f8-4858-9582-e077527a3f33,a758001a-12f8-4858-9582-e077527a3f33,a758001a-12f8-4858-9582-e077527a3f33,a758001a-12f8-4858-9582-e077527a3f33,d94739fd-a28e-4942-96f7-b8f2845d523d,d94739fd-a28e-4942-96f7-b8f2845d523d,d94739fd-a28e-4942-96f7-b8f2845d523d,d94739fd-a28e-4942-96f7-b8f2845d523d,41c99ebd-7c18-4dae-8e5d-39f52ef2323e,41c99ebd-7c18-4dae-8e5d-39f52ef2323e,41c99ebd-7c18-4dae-8e5d-39f52ef2323e,41c99ebd-7c18-4dae-8e5d-39f52ef2323e",
  //     "addon_id": "",
  //     "product_variant_id": "8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8ff55e5d-77fd-4772-a403-362543bdd3c4,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,cb49b241-4be9-4a23-8e64-bc91a958146c,cb49b241-4be9-4a23-8e64-bc91a958146c,cb49b241-4be9-4a23-8e64-bc91a958146c,cb49b241-4be9-4a23-8e64-bc91a958146c,4273f792-c25c-4d56-bd31-1b90466ea9e3,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,40861111-e2d6-4c7d-9de8-0f75f2ad1efd,e1a7742e-e8bf-4541-a4c8-7eb0cb1f1770,e1a7742e-e8bf-4541-a4c8-7eb0cb1f1770,04c62ab1-02e1-4298-8a83-a572c7e29b6b,04c62ab1-02e1-4298-8a83-a572c7e29b6b,76a3ed5a-7431-470e-9597-5f281160ead3,76a3ed5a-7431-470e-9597-5f281160ead3,76a3ed5a-7431-470e-9597-5f281160ead3,76a3ed5a-7431-470e-9597-5f281160ead3,a758001a-12f8-4858-9582-e077527a3f33,a758001a-12f8-4858-9582-e077527a3f33,a758001a-12f8-4858-9582-e077527a3f33,a758001a-12f8-4858-9582-e077527a3f33,d94739fd-a28e-4942-96f7-b8f2845d523d,d94739fd-a28e-4942-96f7-b8f2845d523d,d94739fd-a28e-4942-96f7-b8f2845d523d,d94739fd-a28e-4942-96f7-b8f2845d523d,41c99ebd-7c18-4dae-8e5d-39f52ef2323e,41c99ebd-7c18-4dae-8e5d-39f52ef2323e,41c99ebd-7c18-4dae-8e5d-39f52ef2323e,41c99ebd-7c18-4dae-8e5d-39f52ef2323e",
  //     "addon_variant_id": "",
  //     "userId": "21e0b7e5-6276-4608-9f0f-0d0b0f802f46",
  //     "title": "603dev",
  //     "group_key": "Furniture-Linear Workstation-Chair-8ff55e5d-77fd-4772-a403-362543bdd3c4,Furniture-Md Cabin-Chair-8ff55e5d-77fd-4772-a403-362543bdd3c4,Furniture-Meeting Room-Chair-8ff55e5d-77fd-4772-a403-362543bdd3c4,Furniture-Reception-Chair-8ff55e5d-77fd-4772-a403-362543bdd3c4,Furniture-Pantry-Chair-8ff55e5d-77fd-4772-a403-362543bdd3c4,Furniture-Linear Workstation-Table-8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,Furniture-Md Cabin-Table-8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,Furniture-Meeting Room-Table-8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,Furniture-Reception-Table-8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,Furniture-Pantry-Table-8d9f5cb3-b63f-4c72-8f7d-54a53c72209c,Lighting-Open Workspaces-Ambient-cb49b241-4be9-4a23-8e64-bc91a958146c,Lighting-Cabins-Ambient-cb49b241-4be9-4a23-8e64-bc91a958146c,Lighting-Meeting Rooms-Ambient-cb49b241-4be9-4a23-8e64-bc91a958146c,Lighting-Public Spaces-Ambient-cb49b241-4be9-4a23-8e64-bc91a958146c,HVAC-Centralized-Centralized AC-4273f792-c25c-4d56-bd31-1b90466ea9e3,Flooring-Open Workspaces-Tile-2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,Flooring-Cabins-Tile-2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,Flooring-Meeting Rooms-Tile-2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,Flooring-Public Spaces-Tile-2bd93ead-202f-4a12-bee5-ce3cda8ba3fb,Civil / Plumbing-Washrooms-Pods-40861111-e2d6-4c7d-9de8-0f75f2ad1efd,Civil / Plumbing-Washrooms-Basin-e1a7742e-e8bf-4541-a4c8-7eb0cb1f1770,Civil / Plumbing-Pantry-Basin-e1a7742e-e8bf-4541-a4c8-7eb0cb1f1770,Civil / Plumbing-Washrooms-Tile-04c62ab1-02e1-4298-8a83-a572c7e29b6b,Civil / Plumbing-Pantry-Tile-04c62ab1-02e1-4298-8a83-a572c7e29b6b,Paint-Open Workspaces-Doors-76a3ed5a-7431-470e-9597-5f281160ead3,Paint-Cabins-Doors-76a3ed5a-7431-470e-9597-5f281160ead3,Paint-Meeting Rooms-Doors-76a3ed5a-7431-470e-9597-5f281160ead3,Paint-Public Spaces-Doors-76a3ed5a-7431-470e-9597-5f281160ead3,Paint-Open Workspaces-Walls-a758001a-12f8-4858-9582-e077527a3f33,Paint-Cabins-Walls-a758001a-12f8-4858-9582-e077527a3f33,Paint-Meeting Rooms-Walls-a758001a-12f8-4858-9582-e077527a3f33,Paint-Public Spaces-Walls-a758001a-12f8-4858-9582-e077527a3f33,Paint-Open Workspaces-Ceilings-d94739fd-a28e-4942-96f7-b8f2845d523d,Paint-Cabins-Ceilings-d94739fd-a28e-4942-96f7-b8f2845d523d,Paint-Meeting Rooms-Ceilings-d94739fd-a28e-4942-96f7-b8f2845d523d,Paint-Public Spaces-Ceilings-d94739fd-a28e-4942-96f7-b8f2845d523d,Partitions / Ceilings-Open Workspaces-Glass Partition-41c99ebd-7c18-4dae-8e5d-39f52ef2323e,Partitions / Ceilings-Cabins-Glass Partition-41c99ebd-7c18-4dae-8e5d-39f52ef2323e,Partitions / Ceilings-Meeting Rooms-Glass Partition-41c99ebd-7c18-4dae-8e5d-39f52ef2323e,Partitions / Ceilings-Public Spaces-Glass Partition-41c99ebd-7c18-4dae-8e5d-39f52ef2323e",
  //     "total_area": "1500",
  //     "final_price": "55100,2900,2900,2900,2900,26562,1398,1398,1398,1398,94190,26990,22990,88590,404800,36024,9480,7900,33812,3419820,990000,907500,44640,40920,923400,243000,202500,866700,902880,237600,198000,847440,1128600,297000,247500,1059300,439695.00000000006,216000,225000,550260",
  //     "height": 10,
  //     "flooring": "basicTiling",
  //     "demolishTile": "no",
  //     "hvacType": "Centralized",
  //     "planType": "Exclusive",
  //     "addon_final_price": "",
  //     "totalprice": 14811385
  // }

  return (
    <div className="lg:w-full container mx-auto max-w-sm md:max-w-full flex flex-col lg:flex-row overflow-auto lg:overflow-y-auto scrollbar-hide  py-2 px-3 font-Poppins">
      {/* dashboard area layout */}
      <div className="xl:w-2/3">
        <div className="p-2 lg:p-4 border border-[#ccc] rounded-lg">
          <h2 className="capitalize font-bold mb-2 text-base lg:text-xl">
            Layout Information : selected boq {selectedBoq?.boqTitle || "NA"}
          </h2>
          {/* div containing information */}
          <div
            className={`flex flex-col ${
              isExpanded ? "flex-wrap" : "md:flex-wrap xl:flex-nowrap"
            } items-center gap-3 md:items-stretch md:flex-row lg:gap-10`}
          >
            {/* each icon  */}
            <LayoutInfoCard
              selectedBoq={selectedBoq}
              value={selectedBoq?.layout.totalArea}
              title={"total Area"}
              image={"/images/layouticon.png"}
              spanvalue={"sqft"}
            />
            <LayoutInfoCard
              selectedBoq={selectedBoq}
              value={selectedBoq?.products.length}
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
            {/* each icon  */}
            {/* <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
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
            </div> */}
            {/* each icon  */}
            {/* <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
              <div>
                <img
                  src="/images/grandtotal.png"
                  alt=" dashboard layout "
                  className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                />
              </div>
              <div className="capitalize pr-10">
                <p className="font-bold text-lg">
                  {selectedBoq && selectedBoq.totalprice} <span>INR</span>
                </p>
                <p className="text-base">Total Amount</p>
              </div>
            </div> */}
          </div>
        </div>
        {/* dashboard boq part */}
        <div className="p-3 border border-[#ccc] rounded-lg mt-6 ">
          <h3 className="capitalize font-bold mb-2">BOQ generated</h3>
          {/* boq card */}
          <div className="flex gap-2 flex-wrap justify-center md:justify-normal">
            {isboqavailable &&
              boqdata.map((boq, index) => {
                return (
                  // <div
                  //   key={boq.boqTitle}
                  //   className="rounded-lg border-2 border-[#ccc] max-w-sm p-2 mb-3"
                  // >
                  //   <div className="flex justify-end gap-2 p-2">
                  //     {/* <MdOutlineModeEdit size={30} /> */}
                  //     <button
                  //       className={`px-5 py-1  rounded-lg capitalize border ${
                  //         selectedBoq?.boqTitle === boq?.boqTitle
                  //           ? " bg-[#374A75] border-[#374a75] text-white"
                  //           : "bg-white border-[#ccc] text-[#374a75]"
                  //       }`}
                  //       onClick={() => handlecheckboqdetails(boq)}
                  //     >
                  //       details
                  //     </button>
                  //     <button
                  //       onClick={() => handledeleteBoq(boq)}
                  //       className="hover:text-red-600"
                  //     >
                  //       {" "}
                  //       <MdDeleteOutline size={30} />
                  //     </button>
                  //   </div>
                  //   <div>
                  //     <h3 className="font-bold">{boq.boqTitle}</h3>
                  //   </div>
                  // </div>
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
        <div className="border-2 p-2 lg:p-4 rounded-xl  lg:h-96">
          <div className="w-[300px] h-[200px] lg:w-[370px] lg:h-[270px] sm:w-full sm:h-[270px]">
            <ReactApexChart
              options={options}
              series={[{ data: series }]}
              type="treemap"
              width="100%"
              height="100%"
              className="distribution-chart"
            />
          </div>
          {/* <ReactApexChart
            options={options}
            series={[{ data: series }]}
            type="treemap"
            className="distribution-chart"
            height={270}
            width={370}
          /> */}
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
          alt=" dashboard layout "
          className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
        />
      </div>
      <div className="capitalize lg:pr-10 flex-1">
        <p className="font-bold text-lg">
          {/* {selectedBoq.total_area} */}
          {selectedBoq && value}
          {spanvalue && <span>{spanvalue}</span>}
        </p>
        <p className="text-base">{title}</p>
      </div>
    </div>
  );
}

function GeneratedBOQCard({ boq, onDelete, selectedBoq }) {
  return (
    <div
      className={`w-[270px]  border border-[#CCCCCC] font-Poppins p-2 rounded-lg text-[#000] ${
        selectedBoq.id === boq.id
          ? "bg-gradient-to-br from-[#23445B] to-[#487BA0] text-[#fff]"
          : ""
      }`}
    >
      <div className="flex justify-between mb-1.5">
        <h5 className="font-bold text-xl">{boq.boqTitle}</h5>
        <button onClick={() => onDelete(boq)} className="hover:text-red-600">
          {" "}
          <MdDeleteOutline size={25} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5 font-semibold ">
        <p>Total Area</p>
        <p>{boq.layout.totalArea} sqft.</p>
        <p>Used</p>
        <p> {boq.layout.usedSpace} sqft.</p>
        <p>Unused</p>
        <p> {boq.layout.totalArea - boq.layout.usedSpace}sqft.</p>
      </div>
    </div>
  );
}
