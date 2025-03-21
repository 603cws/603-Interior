import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { useApp } from "../../Context/Context";
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
  meetingRoomLarge: "Meeting Room (Large)",
  hrRoom: "HR Room",
  financeRoom: "Finance Room",
  executiveWashroom: "Executive Washroom",
  breakoutRoom: "Breakout Room",
  videoRecordingRoom: "Video Recording Room",
  other: "Other", // Add new category here
};

const TreeMap = ({ totalArea, areaQuantities, areaValues }) => {
  const [hoveredArea, setHoveredArea] = useState(null);
  const [isLegendVisible, setIsLegendVisible] = useState(false);

  const { layoutImgRef, setLayoutImage } = useApp();
  const chartRef = useRef(null);

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
  };

  const workspaceImages = {
    "Linear Workspace": "/images/workstation-wp/linear-wp.webp",
    "L-Type Workspace": "/images/workstation-wp/ltype-wp.webp",
    "MD Cabin": "/images/workstation-wp/md-wp.webp",
    "Manager Cabin": "/images/workstation-wp/manager-wp.webp",
    "Small Cabin": "/images/workstation-wp/small-wp.webp",
    "UPS Room": "/images/workstation-wp/ups-wp.webp",
    "BMS Room": "/images/workstation-wp/BMS-WP.webp",
    "Server Room": "/images/workstation-wp/serverRoom-wp.webp",
    Reception: "/images/workstation-wp/reception-wp.webp",
    "Lounge/Pantry": "/images/workstation-wp/lounge-wp.webp",
    "Video Recording Room": "/images/workstation-wp/videocon-wp.webp",
    "Sales Team": "/images/workstation-wp/sales-wp.webp",
    "Phone Booth": "/images/workstation-wp/phoneBooth-wp.webp",
    "Discussion Room": "/images/workstation-wp/discuss-wp.webp",
    "Interview Room": "/images/workstation-wp/interview-wp.webp",
    "Conference Room": "/images/workstation-wp/conf-wp.webp",
    "Board Room": "/images/workstation-wp/boardroom-wp.webp",
    "Meeting Room": "/images/workstation-wp/meetingroom-wp.webp",
    "Meeting Room (Large)": "/images/workstation-wp/meetroomlarge-wp.webp",
    "HR Room": "/images/workstation-wp/hr-wp.webp",
    "Finance Room": "/images/workstation-wp/finance-wp.webp",
    "Executive Washroom": "/images/workstation-wp/executivewash-wp.webp",
    "Breakout Room": "/images/workstation-wp/breakout-wp.webp",
    Other: "/images/workstation-wp/other-wp.webp",
  };

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
      return {
        x: `${fullNames[key] || key}: ${percentage}%`,
        y: areaOccupied,
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
      height: "auto",
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
        mounted: (chart) => {
          chartRef.current = chart; // Store chart instance
        },
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
    tooltip: {
      y: {
        formatter: (value) => `${value} sq ft`,
      },
    },
    dataLabels: {
      enabled: true,
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
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const dataPoint = w.config.series[0].data[dataPointIndex];
        const workspaceName = dataPoint.x.split(":")[0]; // Extract name
        const occupiedArea = dataPoint.y;
        const percentage = dataPoint.x.split(":")[1]; // Extract percentage
        const imageUrl = workspaceImages[workspaceName] || null;

        return `
          <div style="
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            min-width: 250px;
            position: relative;
          ">
            ${
              imageUrl
                ? `<img src="${imageUrl}" alt="${workspaceName}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px;" />`
                : ""
            }
            <div style="margin-top: 5px;">
              <strong>${workspaceName}</strong>
              <div>Occupied Area: ${occupiedArea} sq ft</div>
              <div>Usage: ${percentage}</div>
            </div>
          </div>
        `;
      },
    },
  };
  useEffect(() => {
    if (layoutImgRef) {
      layoutImgRef.current = exportChart;
    }
  }, []);

  const exportChart = async () => {
    if (chartRef.current) {
      const imageURI = await chartRef.current.dataURI(); // Get image
      setLayoutImage(imageURI.imgURI); // Send to context
    }
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
          <span className="legend-label pr-2" style={{ fontSize: "13px" }}>
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
      if (window.innerWidth > 426) {
        setIsLegendVisible(true);
      } else {
        setIsLegendVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div id="chart" style={{ position: "relative" }}>
      <ReactApexChart
        options={options}
        series={[{ data: series }]}
        type="treemap"
        className="distribution-chart"
        height={400}
      />
      <button
        className="arrow-button"
        onClick={() => toggleLegend(!isLegendVisible)}
        style={{
          position: "absolute",
          left: "-10px",
          top: "200px",
          opacity: "50%",
          zIndex: 1,
          display: window.innerWidth <= 425 ? "block" : "none",
        }}
      >
        {/* <FontAwesomeIcon icon={isLegendVisible ? faChevronLeft : faChevronRight} /> */}
      </button>
      <div
        className="legend-container w-full flex flex-wrap"
        style={{
          transform: isLegendVisible ? "translateX(0)" : "translateX(-100%)", // Start hidden and slide in
          transition: "transform 1s ease-in-out",
          position: "absolute",
          left: "0",
          //   background: "#fff",
          padding: "10px",
          //   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          visibility: isLegendVisible ? "visible" : "hidden", // Fully hide off-screen
        }}
      >
        {generateLegendItems()}
      </div>
    </div>
  );
};

export default TreeMap;
