import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
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
    other: "Other" // Add new category here
};

const TreeMap = ({ totalArea, areaQuantities, areaValues }) => {
    const [hoveredArea, setHoveredArea] = useState(null);
    const [isLegendVisible, setIsLegendVisible] = useState(false);

    const colors = {
        'Linear Workspace': '#6A89A7',
        'L-Type Workspace': '#855762',
        'MD Cabin': '#92E5BB',
        'Manager Cabin': '#90C680',
        'Small Cabin': '#E491A5',
        'UPS Room': '#BCDDFC',
        'BMS Room': '#87BDF2',
        'Server Room': '#384959',
        'Reception': '#272757',
        'Lounge/Pantry': '#8686AC',
        'Fitness Zone': '#505081',
        'Sales Team': '#0F0E47',
        'Phone Booth': '#2D6F40',
        'Discussion Room': '#574B90',
        'Interview Room': '#68BA7F',
        'Conference Room': '#253D2C',
        'Board Room': '#F7D794',
        'Meeting Room': '#3DC1D3',
        'Meeting Room (Large)': '#546DE5',
        'HR Room': '#E15F41',
        'Finance Room': '#63CDDA',
        'Executive Washroom': '#C44569',
        'Available Space': '#ADDFFF',
        'Other': '#778BEB' // Color for the "Other" category
    };

    const validTotalArea = totalArea > 0 ? totalArea : 4000;
    const builtArea = Object.keys(areaQuantities).reduce((acc, key) => acc + areaQuantities[key] * areaValues[key], 0);
    const availableArea = validTotalArea - builtArea;

    const series = [
        ...Object.keys(areaQuantities).map(key => {
            const areaOccupied = areaQuantities[key] * areaValues[key];
            const percentage = ((areaOccupied / validTotalArea) * 100).toFixed(2);
            return {
                x: `${fullNames[key] || key}: ${percentage}%`,
                y: areaOccupied,
                fillColor: colors[fullNames[key]] || '#000000'
            };
        }),
        {
            x: `Available Space: ${((availableArea / validTotalArea) * 100).toFixed(2)}%`,
            y: availableArea,
            fillColor: colors['Available Space']
        }
    ];

    const options = {
        chart: {
            type: 'treemap',
            height: 350,
            toolbar: {
                show: true
            },
            events: {
                dataPointMouseEnter: (event, chartContext, config) => {
                    const hoveredLabel = config.w.config.series[0].data[config.dataPointIndex].x;
                    setHoveredArea(hoveredLabel);
                },
                dataPointMouseLeave: () => {
                    setHoveredArea(null);
                }
            }
        },
        title: {
            text: 'Area Distribution of Workspaces',
            align: 'center',
            style: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#263238'
            }
        },
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false
            }
        },
        tooltip: {
            y: {
                formatter: (value) => `${value} sq ft`
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                colors: ['#FFFFFF']
            },
            formatter: (val, opts) => {
                if (typeof val === 'number') {
                    const percentage = ((val / validTotalArea) * 100).toFixed(2);
                    return `${opts.w.globals.labels[opts.dataPointIndex]} (${percentage}%)`;
                }
                return `${opts.w.globals.labels[opts.dataPointIndex]}: ${val}`;
            }
        }
    };

    const generateLegendItems = () => {
        return series
            .filter(item => item.y > 0)
            .map(item => (
                <div
                    key={item.x}
                    className={`legend-item ${hoveredArea === item.x ? 'blink' : ''}`}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        marginBottom: '4px'
                    }}
                    onMouseEnter={() => setHoveredArea(item.x)}
                    onMouseLeave={() => setHoveredArea(null)}
                >
                    <span
                        className={`legend-color ${hoveredArea === item.x ? 'blink' : ''}`}
                        style={{
                            backgroundColor: item.fillColor,
                            width: '10px',
                            height: '10px',
                            marginRight: '10px',
                            borderRadius: '50%'
                        }}
                    ></span>
                    <span className="legend-label" style={{ fontSize: '13px' }}>
                        {item.x}
                    </span>
                </div>
            ));
    };
    const toggleLegend = () => {
        setIsLegendVisible(!isLegendVisible);
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 426) {
                setIsLegendVisible(true);
            } else {
                setIsLegendVisible(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.addEventListener('resize', handleResize);
        };
    }, []);

    console.log("total area in chart", totalArea)
    console.log("areaQuantities in chart", areaValues)
    console.log("quantity in chart", areaQuantities)
    return (
        <div id="chart" style={{ position: 'relative' }}>
            <ReactApexChart options={options} series={[{ data: series }]} type="treemap" className='distribution-chart' />
            <button
                className="arrow-button"
                onClick={() => toggleLegend(!isLegendVisible)}
                style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '200px',
                    opacity: '50%',
                    zIndex: 1,
                    display: window.innerWidth <= 425 ? 'block' : 'none',
                }}
            >
                {/* <FontAwesomeIcon icon={isLegendVisible ? faChevronLeft : faChevronRight} /> */}
            </button>
            <div
                className="legend-container"
                style={{
                    transform: isLegendVisible ? 'translateX(0)' : 'translateX(-100%)', // Start hidden and slide in
                    transition: 'transform 1s ease-in-out',
                    position: 'absolute',
                    bottom: -50,
                    left: '0',
                    background: '#fff',
                    padding: '10px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    visibility: isLegendVisible ? 'visible' : 'hidden', // Fully hide off-screen
                }}
            >
                {generateLegendItems()}
            </div>
        </div>
    );
};

export default TreeMap;
