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
import { colors } from "../../constants/constant";
import { AnimatedButton } from "../../common-components/AnimatedButton";

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
  meetingRoomLarge: "Meeting Room (L)",
  hrRoom: "HR Room",
  financeRoom: "Finance Room",
  executiveWashroom: "Executive Washroom",
  breakoutRoom: "Breakout Room",
  videoRecordingRoom: "Video Recording Room",
  other: "Other",
  washrooms: "Wash rooms",
};

const TreeMap = ({ totalArea, areaQuantities, areaValues }) => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unusedArea, setUnusedArea] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [chartHeight, setChartHeight] = useState("400px");

  const navigate = useNavigate();
  const { userId, setSelectedPlan, isMobile } = useApp();

  const MIN_AREA = 1000;
  const MAX_AREA = 25000;

  const workspaceImages = {
    "Linear Workspace": "/images/workstation-wp/linear.webp",
    "L-Type Workspace": "/images/workstation-wp/lType.webp",
    "MD Cabin": "/images/workstation-wp/md.webp",
    "Manager Cabin": "/images/workstation-wp/manager.webp",
    "Small Cabin": "/images/workstation-wp/smallCabin.webp",
    "UPS Room": "/images/workstation-wp/ups.webp",
    "BMS Room": "/images/workstation-wp/bms.webp",
    "Server Room": "/images/workstation-wp/serverRoom.webp",
    Reception: "/images/workstation-wp/reception.webp",
    Lounge: "/images/workstation-wp/lounge.webp",
    "Video Recording Room": "/images/workstation-wp/videoRoom.webp",
    "Sales Team": "/images/workstation-wp/salesRoom.webp",
    "Phone Booth": "/images/workstation-wp/phoneBooth.webp",
    "Discussion Room": "/images/workspace-image/discussionRoom.png",
    "Interview Room": "/images/workstation-wp/interview.webp",
    "Conference Room": "/images/workstation-wp/conferenceRoom.webp",
    "Board Room": "/images/workstation-wp/boardRoom.webp",
    "Meeting Room": "/images/workstation-wp/meetingRoom.webp",
    "Meeting Room (L)": "/images/workstation-wp/meetingRoomLarge.webp",
    "HR Room": "/images/workstation-wp/hrRoom.webp",
    "Finance Room": "/images/workstation-wp/financeRoom.webp",
    "Executive Washroom": "/images/workstation-wp/executiveWashroom.webp",
    "Breakout Room": "/images/workstation-wp/breakout.webp",
    Other: "/images/workstation-wp/others.webp",
    "Wash rooms": "/images/workstation-wp/washroom.webp",
  };

  useEffect(() => {
    if (showWarning) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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
        }
      } else {
        console.warn("No rect found for label:", label.textContent);
      }

      const x = label.getAttribute("x");
      const shouldSplit = aspectRatio >= 0.15 && aspectRatio <= 2.5;
      const lines = shouldSplit
        ? txt.split("|||")
        : [txt.replace(/\|\|\|/g, " ")];

      while (label.firstChild) label.removeChild(label.firstChild);

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
      animations: {
        enabled: false,
        dynamicAnimation: { enabled: false },
      },
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
        mounted: (ctx) =>
          requestAnimationFrame(() => splitTreemapLabels(ctx.el)),
        rendered: (ctx) =>
          requestAnimationFrame(() => splitTreemapLabels(ctx.el)),
        updated: (ctx) =>
          requestAnimationFrame(() => splitTreemapLabels(ctx.el)),
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

        const workspaceName = dataPoint.x.split(":")[0];
        const occupiedArea = dataPoint.areaOccupied;
        const percentage = dataPoint.x.split(":")[1];
        const imageUrl = workspaceImages[workspaceName] || null;

        const isMobile = window.innerWidth < 640;
        const imageHeight = isMobile ? 120 : 180;

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
          className={`legend-item flex items-center mr-[5px] ${
            hoveredArea === item.x ? "animate-blink" : ""
          }`}
          onMouseEnter={() => setHoveredArea(item.x)}
          onMouseLeave={() => setHoveredArea(null)}
        >
          <span
            className={`legend-color w-[10px] h-[10px] mr-[5px] rounded-full ${
              hoveredArea === item.x ? "animate-blink" : ""
            }`}
            style={{
              backgroundColor: item.fillColor,
            }}
          ></span>
          <span className="legend-label pr-2 text-xs">{item.x}</span>
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
      washroomsArea: areaValues.washrooms,
      washroomsQty: areaQuantities.washrooms || 0,
      ...(totalArea !== null && { totalArea }),
      usedSpace: builtArea,
    };
  };

  const generateBOQclick = () => {
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

      if (totalArea) {
        const layoutData = mapAreaValues(
          userId,
          areaValues,
          areaQuantities,
          totalArea,
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
          {isLegendVisible ? (
            <MdKeyboardDoubleArrowLeft size={30} />
          ) : (
            <MdKeyboardDoubleArrowRight size={30} />
          )}
        </button>
        <div
          className="legend-container w-full h-full grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-0 overflow-auto absolute lg:static lg:overflow-visible inset-0 z-20 transition-transform duration-700 ease-in-out lg:transition-none"
          style={{
            transform: isLegendVisible ? "translateX(0)" : "translateX(-100%)",
            background: "#fff",
            padding: "0px",
            visibility: isLegendVisible ? "visible" : "hidden",
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
      {isMobile && (
        <div className="flex justify-center items-center mt-3">
          <AnimatedButton
            onClick={generateBOQclick}
            className="!bg-[#3A5D7B] text-white capitalize font-Georgia font-semibold tracking-wider"
            variant="default"
            size="lg"
            textEffect="shimmer"
            rounded="custom"
            asChild={false}
            hideAnimations={false}
            shimmerColor="#fff"
            shimmerSize="0.15em"
            shimmerDuration="3s"
            borderRadius="10px"
            background="rgba(48, 71, 120, 1)"
            hovereBackground="linear-gradient(90deg,rgba(85,132,182,1)  0%,  rgba(117,162,190,1) 100%)"
          >
            Create BOQ
          </AnimatedButton>
        </div>
      )}
    </>
  );
};

export default TreeMap;
