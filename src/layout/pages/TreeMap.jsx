import { useState, useEffect } from "react";
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
import { PiStarFourFill } from "react-icons/pi";
import { colors } from "../../constants/constant";

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
    "Meeting Room (L)": "/images/workspace-image/meetingRoomLarge.png",
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

  // function splitTreemapLabels(root) {
  //   const labels = root.querySelectorAll(
  //     ".apexcharts-treemap .apexcharts-datalabel"
  //   );

  //   labels.forEach((label) => {
  //     const txt = label.textContent || "";
  //     if (!txt.includes("|||")) return;

  //     // ✅ Go up to the series group (which contains both rect + label)
  //     const rect = label.closest(
  //       "g.apexcharts-data-labels"
  //     )?.previousElementSibling;

  //     if (rect) {
  //       const width = parseFloat(rect.getAttribute("width"));
  //       const height = parseFloat(rect.getAttribute("height"));

  //       if (width > 0 && height > 0) {
  //         const aspectRatio = width / height;
  //         console.log("Block size:", { txt, width, height, aspectRatio });
  //       }
  //     } else {
  //       console.warn("⚠️ No rect found for label:", label.textContent);
  //     }

  //     const x = label.getAttribute("x");

  //     // Split lines and clear existing content
  //     const lines = txt.split("|||");
  //     while (label.firstChild) label.removeChild(label.firstChild);

  //     // Optional: vertically center the block
  //     const lh = 1.1;
  //     const startDy = (-(lines.length - 1) * lh) / 2 + "em";

  //     lines.forEach((line, i) => {
  //       const tspan = document.createElementNS(
  //         "http://www.w3.org/2000/svg",
  //         "tspan"
  //       );
  //       tspan.setAttribute("x", x);
  //       tspan.setAttribute("dy", i === 0 ? startDy : `${lh}em`);
  //       tspan.textContent = line;
  //       label.appendChild(tspan);
  //     });
  //   });
  // }
  // function splitTreemapLabels(root) {
  //   const labels = root.querySelectorAll(
  //     ".apexcharts-treemap .apexcharts-datalabel"
  //   );

  //   labels.forEach((label) => {
  //     const txt = label.textContent || "";
  //     if (!txt.includes("|||")) return;

  //     const rect = label.closest(
  //       "g.apexcharts-data-labels"
  //     )?.previousElementSibling;

  //     let aspectRatio = 1;
  //     if (rect) {
  //       const width = parseFloat(rect.getAttribute("width"));
  //       const height = parseFloat(rect.getAttribute("height"));

  //       if (width > 0 && height > 0) {
  //         aspectRatio = width / height;
  //         console.log("Block size:", { txt, width, height, aspectRatio });
  //       }
  //     } else {
  //       console.warn("⚠️ No rect found for label:", label.textContent);
  //     }

  //     const x = label.getAttribute("x");

  //     // Decide whether to split or not
  //     // 👉 Example thresholds:
  //     // very wide blocks (aspectRatio > 2.5) = keep text in one line
  //     // very tall blocks (aspectRatio < 0.4) = keep text in one line
  //     // else split normally
  //     const shouldSplit = aspectRatio >= 0.4 && aspectRatio <= 2.5;

  //     const lines = shouldSplit ? txt.split("|||") : [txt];

  //     // Clear old content
  //     while (label.firstChild) label.removeChild(label.firstChild);

  //     // Optional: vertically center
  //     const lh = 1.1;
  //     const startDy = (-(lines.length - 1) * lh) / 2 + "em";

  //     lines.forEach((line, i) => {
  //       const tspan = document.createElementNS(
  //         "http://www.w3.org/2000/svg",
  //         "tspan"
  //       );
  //       tspan.setAttribute("x", x);
  //       tspan.setAttribute("dy", i === 0 ? startDy : `${lh}em`);
  //       tspan.textContent = line;
  //       label.appendChild(tspan);
  //     });
  //   });
  // }

  function splitTreemapLabels(root) {
    const labels = root.querySelectorAll(
      ".apexcharts-treemap .apexcharts-datalabel"
    );

    labels.forEach((label) => {
      const txt = label.textContent || "";
      if (!txt.includes("|||")) return;

      const rect = label.closest(
        "g.apexcharts-data-labels"
      )?.previousElementSibling;

      let aspectRatio = 1;
      if (rect) {
        const width = parseFloat(rect.getAttribute("width"));
        const height = parseFloat(rect.getAttribute("height"));

        if (width > 0 && height > 0) {
          aspectRatio = width / height;
          console.log("Block size:", { txt, width, height, aspectRatio });
        }
      } else {
        console.warn("⚠️ No rect found for label:", label.textContent);
      }

      const x = label.getAttribute("x");

      // Decide whether to split or not
      const shouldSplit = aspectRatio >= 0.4 && aspectRatio <= 2.5;

      // Prepare lines
      const lines = shouldSplit
        ? txt.split("|||")
        : [txt.replace(/\|\|\|/g, " ")];

      // Clear old content
      while (label.firstChild) label.removeChild(label.firstChild);

      // Optional: vertically center
      const lh = 1.1;
      const startDy = (-(lines.length - 1) * lh) / 2 + "em";

      lines.forEach((line, i) => {
        const tspan = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan"
        );
        tspan.setAttribute("x", x);
        tspan.setAttribute("dy", i === 0 ? startDy : `${lh}em`);
        tspan.textContent = line;
        label.appendChild(tspan);
      });
    });
  }

  const options = {
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
        return newVal.split(" ").join("|||");
      },
    },
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
        mounted: (ctx) =>
          requestAnimationFrame(() => splitTreemapLabels(ctx.el)),
        // rendered fires after animations; safest place
        rendered: (ctx) => splitTreemapLabels(ctx.el),
        // if your React state causes chart updates, re-split after each update
        updated: (ctx) => splitTreemapLabels(ctx.el),
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
          sessionStorage.setItem("currentLayoutID", currentLayoutID);
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
    <>
      <div id="chart" className="relative border px-2">
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
          className="legend-container w-full h-full grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-0 overflow-auto absolute lg:static lg:overflow-visible inset-0 z-20 transition-transform duration-700 ease-in-out lg:transition-none"
          style={{
            transform: isLegendVisible ? "translateX(0)" : "translateX(-100%)", // Start hidden and slide in
            // transition: "transform 1s ease-in-out",
            // position: "absolute",
            // top: "0",
            // left: "0",
            background: "#fff",
            padding: "0px",
            // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            visibility: isLegendVisible ? "visible" : "hidden", // Fully hide off-screen
          }}
        >
          {generateLegendItems()}
        </div>

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
      {/* button for generate boq */}
      {isMobile && (
        <div className="flex justify-center items-center mt-3">
          <button
            onClick={generateBOQclick}
            className="generateBoq glow-on-hover relative flex items-center w-36 h-10 px-4 py-2 mb-2 bg-[#212B36] border border-[#1A8FE3] text-white overflow-hidden group rounded-[4px] font-Poppins text-xs hover:bg-gradient-to-b from-[#3F56EA] to-[#7c80f3] hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <span className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden group-hover:block">
              <span className="glow-line glow-top"></span>
              <span className="glow-line glow-right"></span>
              <span className="glow-line glow-bottom"></span>
              <span className="glow-line glow-left"></span>
            </span>
            <div className="flex gap-3 w-full h-full">
              <div className="relative pointer-events-none z-0 w-1/4  h-full">
                <div className="absolute top-0 left-0 text-[8px] group-hover:blink-on-hover">
                  <PiStarFourFill />
                </div>
                <div className="absolute bottom-0 left-[2px] text-[10px] group-hover:blink-on-hover group-hover:del-200">
                  <PiStarFourFill />
                </div>
                <div className="absolute right-0 top-1/4 text-sm group-hover:blink-on-hover group-hover:del-300">
                  <PiStarFourFill />
                </div>
              </div>
              <span className="flex justify-center items-center">
                Create BOQ
              </span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default TreeMap;
