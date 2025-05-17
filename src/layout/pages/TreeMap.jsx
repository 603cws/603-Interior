import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { useApp } from "../../Context/Context";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../../services/supabase";
import UnusedAreaWarning from "../components/UnusedAreaWarning";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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
  meetingRoomLarge: "Meeting Room (L)",
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

const TreeMap = ({ totalArea, areaQuantities, areaValues }) => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unusedArea, setUnusedArea] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [chartHeight, setChartHeight] = useState("400px");

  const navigate = useNavigate();

  const {
    // layoutImgRef,
    // setLayoutImage,
    userId,
    setSelectedPlan,
    // layoutImage = "",
    isMobile,
  } = useApp();

  // const chartRef = useRef(null);

  const MIN_AREA = 1000;
  const MAX_AREA = 25000;

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

  const workspaceImages = {
    "Linear Workspace": "/images/workspace-image/linear.webp",
    "L-Type Workspace": "/images/workspace-image/lType.webp",
    "MD Cabin": "/images/workspace-image/md.png",
    "Manager Cabin": "/images/workspace-image/manager.webp",
    "Small Cabin": "/images/workspace-image/small.png",
    "UPS Room": "/images/workspace-image/ups.png",
    "BMS Room": "/images/workspace-image/bms.png",
    "Server Room": "/images/workspace-image/server.png",
    Reception: "/images/workspace-image/reception.png",
    "Lounge/Pantry": "/images/workspace-image/lounge.png",
    "Video Recording Room": "/images/workspace-image/videoRecordingRoom.png",
    "Sales Team": "/images/workspace-image/sales.png",
    "Phone Booth": "/images/workspace-image/phoneBooth.png",
    "Discussion Room": "/images/workspace-image/discussionRoom.png",
    "Interview Room": "/images/workspace-image/interviewRoom.png",
    "Conference Room": "/images/workspace-image/conferenceRoom.webp",
    "Board Room": "/images/workspace-image/boardRoom.webp",
    "Meeting Room": "/images/workspace-image/meetingRoom.png",
    "Meeting Room (Large)": "/images/workspace-image/meetingRoomLarge.png",
    "HR Room": "/images/workspace-image/hrRoom.webp",
    "Finance Room": "/images/workspace-image/financeRoom.webp",
    "Executive Washroom": "/images/workspace-image/executiveWashroom.png",
    "Breakout Room": "/images/workspace-image/breakout.webp",
    Other: "/images/workspace-image/other.png",
    Washrooms: "/images/workspace-image/washroom.png",
  };

  useEffect(() => {
    if (showWarning) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }
  }, [showWarning, setShowWarning]);

  const validTotalArea = totalArea > 0 ? totalArea : 4000;
  const builtArea = Object.keys(areaQuantities).reduce(
    (acc, key) => acc + areaQuantities[key] * areaValues[key],
    0
  );
  const availableArea = validTotalArea - builtArea;

  const series = [
    ...Object.keys(areaQuantities).map((key) => {
      const areaOccupied = areaQuantities[key] * areaValues[key];
      // const areaOccupied = areaQuantities[key] * areaValues[key];
      const percentage = ((areaOccupied / validTotalArea) * 100).toFixed(2);

      let newareaoccupied;

      switch (true) {
        case totalArea >= 20000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 350 ? 600 : areaOccupied;
          break;
        case totalArea > 3000 && totalArea <= 5000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 100 ? 110 : areaOccupied;
          break;
        case totalArea > 5000 && totalArea <= 7000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 100 ? 140 : areaOccupied;
          break;
        case totalArea > 7000 && totalArea <= 9000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 200 ? 200 : areaOccupied;
          break;
        case totalArea > 9000 && totalArea <= 13000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 250 ? 300 : areaOccupied;
          break;
        case totalArea > 13000 && totalArea <= 17000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 250 ? 350 : areaOccupied;
          break;
        case totalArea > 17000 && totalArea < 20000:
          newareaoccupied =
            areaOccupied > 1 && areaOccupied < 300 ? 390 : areaOccupied;
          break;

        default:
          newareaoccupied = areaOccupied;
          break;
      }

      return {
        x: `${fullNames[key] || key}: ${percentage}%`,
        y: newareaoccupied,
        // y: areaOccupied,
        areaOccupied: areaOccupied,
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
      height: chartHeight,
      toolbar: {
        show: true,
      },
      events: {
        dataPointMouseEnter: (event, chartContext, config) => {
          const hoveredLabel =
            config.w.config.series[0].data[config.dataPointIndex].x;
          setHoveredArea(hoveredLabel);
        },
        dataPointMouseLeave: () => {
          setHoveredArea(null);
        },
        // mounted: (chart) => {
        //   chartRef.current = chart; // Store chart instance
        // },
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
        // shadeIntensity: 0, // Disable shade intensity
        // reverseNegativeShade: false, // Prevent hover shade reversal
        // useFillColorAsStroke: true // Maintain original fill color as stroke
      },
    },
    // tooltip: {
    //   y: {
    //     formatter: (value) => `${value} sq ft`,
    //   },
    // },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
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
        const newVal = val.split(":")[0];
        return `${newVal}`;
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
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dataPoint = w.config.series[0].data[dataPointIndex];

        const workspaceName = dataPoint.x.split(":")[0]; // Extract name
        const occupiedArea = dataPoint.areaOccupied;
        // const occupiedArea = dataPoint.y;
        const percentage = dataPoint.x.split(":")[1]; // Extract percentage
        const imageUrl = workspaceImages[workspaceName] || null;

        // Check screen width for mobile responsiveness
        const isMobile = window.innerWidth < 640; // Adjust for small screens
        const imageHeight = isMobile ? 120 : 180; // Smaller image on mobile

        const isAvailable = workspaceName.toLowerCase().includes("available");

        return `
      <div style="
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        max-width: 250px;
        position: relative;
      ">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="${workspaceName}" 
                style="width: 100%; height: ${imageHeight}px; object-fit: cover; border-radius: 5px;" />`
            : ""
        }
        <div style="margin-top: 5px;">
          <strong>${workspaceName}</strong>
          ${
            isAvailable
              ? `<div>Available: ${percentage}</div>`
              : `
                <div>Occupied Area: ${occupiedArea} sq ft</div>
                <div>Usage: ${percentage}</div>
              `
          }
        </div>
      </div>
    `;
      },
    },
  };
  // useEffect(() => {
  //   if (layoutImgRef) {
  //     layoutImgRef.current = exportChart;
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const exportChart = async () => {
  //   if (chartRef.current) {
  //     const imageURI = await chartRef.current.dataURI(); // Get image
  //     setLayoutImage(imageURI.imgURI); // Send to context
  //   }
  // };

  const generateLegendItems = () => {
    return series
      .filter((item) => item.y > 0)
      .map((item) => (
        <div
          key={item.x}
          className={`legend-item ${
            hoveredArea === item.x ? "animate-blink" : ""
          }`}
          style={{
            display: "flex",
            // justifyContent: 'space-evenly',
            alignItems: "center",
            // marginBottom: "4px",
            marginRight: "5px",
          }}
          onMouseEnter={() => setHoveredArea(item.x)}
          onMouseLeave={() => setHoveredArea(null)}
        >
          <span
            className={`legend-color ${
              hoveredArea === item.x ? "animate-blink" : ""
            }`}
            style={{
              backgroundColor: item.fillColor,
              width: "10px",
              height: "10px",
              marginRight: "5px",
              borderRadius: "50%",
            }}
          ></span>
          <span className="legend-label pr-2" style={{ fontSize: "12px" }}>
            {item.x}
          </span>
        </div>
      ));
  };
  const toggleLegend = () => {
    setIsLegendVisible(!isLegendVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1350) {
        setIsLegendVisible(true);
      } else {
        setIsLegendVisible(false);
      }
    };
    const handleChartHeight = () => {
      if (window.innerWidth >= 1024 && window.innerWidth <= 1350) {
        setChartHeight("350px");
      } else if (window.innerWidth >= 1800) {
        setChartHeight("550px");
      }
    };
    window.addEventListener("resize", handleResize, handleChartHeight);
    handleResize();
    handleChartHeight();

    return () => {
      window.addEventListener("resize", handleResize, handleChartHeight);
    };
  }, []);

  const mapAreaValues = (
    userId,
    areaValues,
    areaQuantities,
    totalArea = null,
    imageFilename,
    builtArea
  ) => {
    return {
      userId: userId || null,
      linearArea: areaValues.linear,
      linearQty: areaQuantities.linear || 0,
      lTypeArea: areaValues.lType,
      lTypeQty: areaQuantities.lType || 0,
      mdArea: areaValues.md,
      mdQty: areaQuantities.md || 0,
      managerArea: areaValues.manager,
      managerQty: areaQuantities.manager || 0,
      smallArea: areaValues.small,
      smallQty: areaQuantities.small || 0,
      upsArea: areaValues.ups,
      upsQty: areaQuantities.ups || 0,
      bmsArea: areaValues.bms,
      bmsQty: areaQuantities.bms || 0,
      serverArea: areaValues.server,
      serverQty: areaQuantities.server || 0,
      receptionArea: areaValues.reception,
      receptionQty: areaQuantities.reception || 0,
      loungeArea: areaValues.lounge,
      loungeQty: areaQuantities.lounge || 0,
      salesArea: areaValues.sales,
      salesQty: areaQuantities.sales || 0,
      phoneBoothArea: areaValues.phoneBooth,
      phoneBoothQty: areaQuantities.phoneBooth || 0,
      discussionRoomArea: areaValues.discussionRoom,
      discussionRoomQty: areaQuantities.discussionRoom || 0,
      interviewRoomArea: areaValues.interviewRoom,
      interviewRoomQty: areaQuantities.interviewRoom || 0,
      conferenceRoomArea: areaValues.conferenceRoom,
      conferenceRoomQty: areaQuantities.conferenceRoom || 0,
      boardRoomArea: areaValues.boardRoom,
      boardRoomQty: areaQuantities.boardRoom || 0,
      meetingRoomArea: areaValues.meetingRoom,
      meetingRoomQty: areaQuantities.meetingRoom || 0,
      meetingRoomLargeArea: areaValues.meetingRoomLarge,
      meetingRoomLargeQty: areaQuantities.meetingRoomLarge || 0,
      hrRoomArea: areaValues.hrRoom,
      hrRoomQty: areaQuantities.hrRoom || 0,
      financeRoomArea: areaValues.financeRoom,
      financeRoomQty: areaQuantities.financeRoom || 0,
      breakoutRoomArea: areaValues.breakoutRoom,
      breakoutRoomQty: areaQuantities.breakoutRoom || 0,
      executiveWashroomArea: areaValues.executiveWashroom,
      executiveWashroomQty: areaQuantities.executiveWashroom || 0,
      videoRecordingRoomArea: areaValues.videoRecordingRoom,
      videoRecordingRoomQty: areaQuantities.videoRecordingRoom || 0,
      otherArea: areaValues.other,
      otherQty: areaQuantities.other || 0,
      // maleWashroomArea: areaValues.maleWashroom,
      // maleWashroomQty: areaQuantities.maleWashroom || 0,
      // femaleWashroomArea: areaValues.femaleWashroom,
      // femaleWashroomQty: areaQuantities.femaleWashroom || 0,
      washroomsArea: areaValues.washrooms,
      washroomsQty: areaQuantities.washrooms || 0,
      ...(totalArea !== null && { totalArea }),
      // layoutImg: imageFilename,
      usedSpace: builtArea,
    };
  };

  // const uploadImage = async (imageDataUrl) => {
  //   try {
  //     // ✅ Convert Base64 to Blob Properly
  //     const blob = await fetch(imageDataUrl)
  //       .then((res) => res.blob())
  //       .catch((error) => {
  //         console.error("Error converting Base64 to Blob:", error);
  //         return null;
  //       });

  //     if (!blob) {
  //       console.error("Blob conversion failed");
  //       return null;
  //     }

  //     // ✅ Ensure Correct Filename
  //     const fileName = `area_distribution_${Date.now()}.png`;

  //     // ✅ Upload Image to Supabase Storage
  //     const { error } = await supabase.storage
  //       .from("addon")
  //       .upload(fileName, blob, { contentType: "image/png" });

  //     if (error) {
  //       console.error("Image upload failed:", error);
  //       return null;
  //     }

  //     return fileName; // ✅ Store filename in DB
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     return null;
  //   }
  // };

  const generateBOQclick = () => {
    console.log("hii", totalArea);
    if (!totalArea) {
      toast.error("Enter the Area");
      return;
    }
    if (totalArea >= MIN_AREA && totalArea <= MAX_AREA) {
      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("hasSeenQuestionPopup");
      setSelectedPlan(null);
      const usedPercentage = (builtArea / totalArea) * 100;

      if (usedPercentage < 90) {
        setUnusedArea(totalArea - builtArea);
        setShowWarning(true);
        return;
      } else {
        handlegenrateboq();
      }
    }
  };

  const handlegenrateboq = async () => {
    try {
      setIsSubmitting(true);
      if (!totalArea) {
        toast.error("Enter the Area");
        return;
      }

      // Trigger export and wait for image to be available
      // if (layoutImgRef.current) {
      //   await layoutImgRef.current();
      // }

      // Upload image to Supabase
      // const imageUrl = await uploadImage(layoutImage || "");
      // const imageFilename = await uploadImage(layoutImage);

      if (totalArea) {
        const layoutData = mapAreaValues(
          userId,
          areaValues,
          areaQuantities,
          totalArea,
          // imageFilename,
          builtArea
        );

        // Insert into tables
        const { data, error } = await supabase
          .from("layout")
          .insert([layoutData])
          .select("id")
          .single();

        if (error) {
          console.error("Error inserting into layout:", error.message);
        }

        console.log("layout Data:", data);

        if (data) {
          const currentLayoutID = data.id;
          localStorage.setItem("currentLayoutID", currentLayoutID);
        }

        if (!userId) {
          navigate("/Login", {
            state: {
              totalArea: totalArea,
              areaValues: areaValues,
              areaQuantities: areaQuantities,
              layoutId: data.id,
            },
          });
        } else {
          navigate("/boq");
        }
      }
    } finally {
      setIsSubmitting(false);
      setShowWarning(false);
    }
  };

  return (
    <div id="chart" style={{ position: "relative" }}>
      <ReactApexChart
        options={options}
        series={[{ data: series }]}
        type="treemap"
        className="distribution-chart"
        height={chartHeight}
      />
      <button
        className="arrow-button"
        onClick={() => toggleLegend(!isLegendVisible)}
        style={{
          position: "absolute",
          left: "-25px",
          top: "200px",
          opacity: "50%",
          zIndex: 1,
          display: window.innerWidth <= 1350 ? "block" : "none",
        }}
      >
        {/* <FontAwesomeIcon icon={isLegendVisible ? faChevronLeft : faChevronRight} /> */}
        {isLegendVisible ? (
          <MdKeyboardDoubleArrowLeft size={30} />
        ) : (
          <MdKeyboardDoubleArrowRight size={30} />
        )}
      </button>
      <div
        className="legend-container w-full grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-0 overflow-x-auto "
        style={{
          transform: isLegendVisible ? "translateX(0)" : "translateX(-100%)", // Start hidden and slide in
          transition: "transform 1s ease-in-out",
          position: "absolute",
          top: "10%",
          left: "0",
          background: "#fff",
          padding: "10px",
          // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          visibility: isLegendVisible ? "visible" : "hidden", // Fully hide off-screen
        }}
      >
        {generateLegendItems()}
      </div>
      {/* button for generate boq */}
      {isMobile && (
        <div className="flex justify-center items-center">
          <button
            className="generateBoq bg-[#1A3A36] mt-2 rounded-3xl text-sm py-3 px-10 text-white mb-2 border-2 border-[#34BFAD]"
            onClick={generateBOQclick}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner flex justify-center items-center">
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
              "Generate BOQ"
            )}
          </button>
        </div>
      )}

      {showWarning && (
        <UnusedAreaWarning
          unusedArea={unusedArea}
          onConfirm={handlegenrateboq}
          onCancel={() => {
            setShowWarning(false);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default TreeMap;
