// note for civil/plumbing and hvac there will be different logic

export const AllCatArray = [
  {
    name: "Furniture",
    subcategories: [
      "Linear Workstation",
      "L-Type Workstation",
      "Md Cabin",
      "Manager Cabin",
      "Small Cabin",
      "Discussion Room",
      "Interview Room",
      "Conference Room",
      "Board Room",
      "Meeting Room",
      "Meeting Room Large",
      "HR Room",
      "Finance Room",
      "Sales",
      "Video Recording Room",
      "Reception",
      "Pantry",
      "Phone Booth",
      "Break Out Room",
      "UPS",
      "BMS",
      "Server Room",
      "Executive Washroom",
      "Other Area",
    ],
    subCat1: ["Table", "Chair", "Storage"],
    // subCat1: ["table", "chair"],
  },
  {
    name: "Lighting",
    subcategories: [
      "Open Workspaces",
      "Cabins",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
    subCat1: ["Ambient", "Task", "Accent"],
  },
  {
    name: "Smart Solutions",
    subcategories: [
      "Open Workspaces",
      "Cabins",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
    subCat1: ["CCTV", "Biometric", "Locker"],
  },
  {
    name: "Flooring",
    subcategories: [
      "Open Workspaces",
      "Cabins",
      "Meeting Rooms",
      "Public Spaces",
    ],
    subCat1: ["Tile", "Vinyl", "Carpet", "Epoxy"],
  },
  {
    name: "Paint",
    subcategories: [
      "Open Workspaces",
      "Cabins",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
    subCat1: ["Doors", "Walls", "Ceilings"],
  },
  {
    name: "Lux",
    subcategories: [
      "Open Workspaces",
      "Cabins",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
    subCat1: ["Deco", "Lights"],
  },
  {
    name: "Partitions / Ceilings",
    subcategories: [
      "Open Workspaces",
      "Cabins",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
    subCat1: ["Glass Partition", "Gypsum Partition"],
  },
  {
    name: "HVAC",
    subcategories: [
      "Cabins",
      "Open Workspaces",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
      "Centralized",
    ],
    subCat1: ["Centralized AC", "Combination", "AC", "VRV"],
  },
  {
    name: "Civil / Plumbing",
    subcategories: ["Washrooms", "Pantry"],
    subCat1: ["Tile", "Basin", "Pods"],
  },
];

export const specialArray = [
  {
    name: "HVAC",
    type: "Centralized AC",
    subcategories: ["Centralized"],
  },
  {
    name: "HVAC",
    type: "other",
    subcategories: [
      "Cabins",
      "Open Workspaces",
      "Meeting Rooms",
      "Public Spaces",
      "Support Spaces",
    ],
  },
  {
    name: "Civil / Plumbing",
    type: "other",
    subcategories: ["Washrooms", "Pantry"],
  },
  {
    name: "Civil / Plumbing",
    type: "Pods",
    subcategories: ["Washrooms"],
  },
];

// export default AllCatArray;
