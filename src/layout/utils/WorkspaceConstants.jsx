export const workspaceData = [
  {
    type: "linear",
    image: "/images/workstation-wp/linear.webp",
    description: "This is a linear workspace, designed for open collaboration.",
    sizes: ["M", "L", "XL"], // Corresponds to sizeMapping keys
    tooltipText:
      "M: 3X2 ft (20 sq ft) \n L: 3.5X2 ft (24 sq ft) \n XL: 4X2 ft (29 sq ft)", // Default tooltip text for Linear Workstation
    title: "Linear Workstation",
  },
  {
    type: "lType",
    image: "/images/workstation-wp/lType.webp",
    description:
      "This is an L-type workspace, providing a semi-private environment.",
    tooltipText: "Size: 34 sq ft",
    title: "L-Type Workstation",
  },
];

export const cabinData = [
  {
    type: "md",
    image: "/images/workstation-wp/md.webp",
    description:
      "This is the MD's cabin, designed for maximum comfort and productivity.",
    slider: {
      name: "MD Cabin Size",
      min: 120,
      max: 240,
      step: 5,
      valueKey: "mdCabinSize",
      setValueKey: "setMdCabinSize",
    },
    title: "MD Cabin",
  },
  {
    type: "manager",
    image: "/images/workstation-wp/manager.webp",
    description:
      "This is the Manager's cabin, equipped with all necessary amenities.",
    slider: {
      name: "Manager Cabin Size",
      min: 80,
      max: 180,
      step: 5,
      valueKey: "managerCabinSize",
      setValueKey: "setManagerCabinSize",
    },
    title: "Manager Cabin",
  },
  {
    type: "small",
    image: "/images/workstation-wp/smallCabin.webp",
    description: "This is a small cabin, suitable for individual work.",
    tooltipText: "Size :80 sqft",
    slider: {
      name: "Select Seats",
      min: 4,
      max: 24,
      step: 2,
      valueKey: "smallCabinConfig.seatCount",
      setValueKey: "smallCabinConfig.setSeatCount",
      additionalData: {
        roomSizeKey: "smallCabinConfig.roomSize",
        setRoomSizeKey: "smallCabinConfig.setRoomSize",
      },
    },
    title: "Small Cabin",
  },
];

export const meetingRoomData = [
  {
    type: "interviewRoom",
    image: "/images/workstation-wp/interview.webp",
    description:
      "This is the interview room, designed for conducting interviews.",
    tooltipText: "Size: 100 sq ft",
    title: "Interview Room",
  },
  {
    type: "conferenceRoom",
    image: "/images/workstation-wp/conferenceRoom.webp",
    description: "This is the conference room, suitable for large meetings.",
    slider: {
      name: "Conference Room Size",
      valueKey: "conferenceRoomConfig.roomSize",
      setValueKey: "conferenceRoomConfig.setRoomSize",
      min: 250,
      max: 500,
      step: 5,
    },
    title: "Conference Room",
  },
  {
    type: "boardRoom",
    image: "/images/workstation-wp/boardRoom.webp",
    description: "This is the board room, equipped for executive meetings.",
    slider: {
      name: "Board Room Size",
      valueKey: "boardRoomConfig.roomSize",
      setValueKey: "boardRoomConfig.setRoomSize",
      min: 380,
      max: 650,
      step: 5,
    },
    tooltipText: "size: 18 pax",
    title: "Board Room",
  },
  {
    type: "meetingRoom",
    image: "/images/workstation-wp/meetingRoom.webp",
    description: "This is the meeting room, perfect for team meetings.",
    tooltipText: "Size: 120 sq ft \n Seats: 6 pax",
    title: "Meeting Room",
  },
  {
    type: "meetingRoomLarge",
    image: "/images/workstation-wp/meetingRoomLarge.webp",
    description: "This is the large meeting room, accommodating larger groups.",
    tooltipText: "Size: 150 sq ft \n Seats: 8 pax",
    title: "Meeting Room(Large)",
  },
  {
    type: "hrRoom",
    image: "/images/workstation-wp/hrRoom.webp",
    description: "This is the HR room, designated for HR activities.",
    tooltipText: "size: 80 sqft",
    slider: {
      name: "Select Seats",
      valueKey: "hrRoomConfig.seatCount",
      setValueKey: "hrRoomConfig.setSeatCount",
      min: 4,
      max: 24,
      step: 2,
      cabinSizeKey: "roomSize",
      setCabinSizeKey: "setRoomSize",
    },
    title: "HR Room",
  },
  {
    type: "financeRoom",
    image: "/images/workstation-wp/financeRoom.webp",
    description: "This is the finance room, used for financial discussions.",
    tooltipText: "size: 100 sqft",
    slider: {
      name: "Select Seats",
      valueKey: "financeRoomConfig.seatCount",
      setValueKey: "financeRoomConfig.setSeatCount",
      min: 4,
      max: 24,
      step: 2,
      cabinSizeKey: "roomSize",
      setCabinSizeKey: "setRoomSize",
    },
    title: "Finance Room",
  },
  {
    type: "sales",
    image: "/images/workstation-wp/salesRoom.webp",
    description: "This is the sales area, designed for sales team activities.",
    tooltipText: "size: 80 sqft",
    slider: {
      name: "Select Seats",
      valueKey: "salesRoomConfig.seatCount",
      setValueKey: "salesRoomConfig.setSeatCount",
      min: 4,
      max: 24,
      step: 2,
      cabinSizeKey: "roomSize",
      setCabinSizeKey: "setRoomSize",
    },
    title: "Sales Room",
  },
  {
    type: "videoRecordingRoom",
    image: "/images/workstation-wp/videoRoom.webp",
    description:
      "This is the video recording room, designed for creating professional video content.",
    slider: {
      name: "Video Recording Room Size",
      valueKey: "videoRecordingRoomSize",
      setValueKey: "setVideoRecordingRoomSize",
      min: 80,
      max: 160,
      step: 5,
    },
    title: "Video Recording Room",
  },
];

export const publicSpacesData = [
  {
    type: "reception",
    image: "/images/workstation-wp/reception.webp",
    description:
      "This is the reception area, the first point of contact for visitors.",
    slider: {
      name: "Reception Size",
      valueKey: "receptionSize",
      setValueKey: "setReceptionSize",
      min: 50,
      max: 700,
      step: 5,
    },
    title: "Reception",
  },
  {
    type: "lounge",
    image: "/images/workstation-wp/lounge.webp",
    description:
      "This is the lounge, a comfortable area for informal meetings.",
    slider: {
      name: "Lounge Size",
      valueKey: "loungeSize",
      setValueKey: "setLoungeSize",
      min: 80,
      max: 1000,
      step: 5,
    },
    title: "Lounge",
  },
  {
    type: "phoneBooth",
    image: "/images/workstation-wp/phoneBooth.webp",
    description: "This is the phone booth, providing a quiet space for calls.",
    tooltipText: "Size: 25 sq ft",
    title: "Phone Booth",
  },
  {
    type: "breakoutRoom",
    image: "/images/workstation-wp/breakout.webp",
    description:
      "This is the breakout room, a flexible space for small group discussions.",
    slider: {
      name: "Breakout Room Size",
      valueKey: "breakoutRoomSize",
      setValueKey: "setBreakoutRoomSize",
      min: 80,
      max: 160,
      step: 5,
    },
    tooltipText: "size: 80 sqft",
    title: "Breakout Room",
  },
  {
    type: "washrooms",
    image: "/images/workstation-wp/washroom.webp",
    description:
      "Common Washroom Area – This includes designated spaces for both male and female washrooms.",
    tooltipText: "size: 100 sqft",
    slider: {
      name: "Washroom Size",
      valueKey: "washroomsSize",
      setValueKey: "setWashroomsSize",
      min: 100,
      max: 1200,
      step: 5,
    },
    title: "Washrooms",
  },
];

export const supportSpacesData = [
  {
    type: "ups",
    image: "/images/workstation-wp/ups.webp",
    description: "This is the UPS room, ensuring uninterrupted power supply.",
    slider: {
      name: "UPS Room Size",
      valueKey: "upsRoomSize",
      setValueKey: "setUpsRoomSize",
      min: 60,
      max: 100,
      step: 5,
    },
    tooltipText: "Size: 60 sq ft",
    title: "UPS Room",
  },
  {
    type: "bms",
    image: "/images/workstation-wp/bms.webp",
    description: "This is the BMS room, managing building systems.",
    slider: {
      name: "BMS Room Size",
      valueKey: "bmsRoomSize",
      setValueKey: "setBmsRoomSize",
      min: 60,
      max: 100,
      step: 5,
    },
    tooltipText: "Size: 60 sq ft",
    title: "BMS Room",
  },
  {
    type: "server",
    image: "/images/workstation-wp/serverRoom.webp",
    description: "This is the server room, housing critical IT infrastructure.",
    tooltipText: "Size: 40 sq ft",
    title: "Server Room",
  },
  {
    type: "executiveWashroom",
    image: "/images/workstation-wp/executiveWashroom.webp",
    description:
      "This is the Executive Washroom, providing premium facilities.",
    tooltipText: "Size: 60 sq ft",
    title: "Executive Washroom",
  },
  {
    type: "other",
    image: "/images/workstation-wp/others.webp",
    description: "This is an additional space for miscellaneous purposes.",
    title: "Other Area",
  },
];
