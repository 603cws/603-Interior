import { AnimationStep } from "./types.js";

import { CategorySvgMap } from "../../common-components/CategorySvgMap";
export const STEPS = [
  {
    id: AnimationStep.LANDING,
    title: "Landing",
    description: "Start your journey at Workved.",
  },
  {
    id: AnimationStep.LAYOUT,
    title: "Layout",
    description: "Define your office area and distribution.",
  },
  {
    id: AnimationStep.PLAN_SELECTION,
    title: "Plan",
    description: "Choose a plan that fits your vision.",
  },
  {
    id: AnimationStep.PRODUCT_CUSTOMIZATION,
    title: "Customize",
    description: "Select specific furniture and fixtures.",
  },
  {
    id: AnimationStep.DOWNLOAD,
    title: "Finish",
    description: "Download your professional BOQ report.",
  },
];

export const COLORS = {
  primary: "#334A78", // Workved Navy
  secondary: "#3b5998", // Workved Blue
  accent: "#f1c40f", // Workved Yellow/Gold
  bg: "#f8fafc",
};

export const stats = [
  "Linear: 40.0%",
  "Cabins: 8.5%",
  "Meeting: 4.8%",
  "Lounge: 4.0%",
  "Washrooms: 4.5%",
];

export const openworkspaces = [
  {
    name: "Linear Workspace",
    img: "/images/workstation-wp/linear.webp",
    count: 250,
  },
  {
    name: "L-Type Workspace",
    img: "/images/workstation-wp/lType.webp",
    count: 15,
  },
];

export const cabins = [
  {
    name: "MD Cabin",
    img: "/images/workstation-wp/md.webp",
    count: 5,
  },
  {
    name: "Manager Cabin",
    img: "/images/workstation-wp/manager.webp",
    count: 6,
  },
];

export const features = [
  "Premium materials with a refined look.",
  "Stylish finishes and modern features.",
  "Balanced cost and luxury.",
  "Energy-efficient solutions.",
];

export const categories = [
  { name: "Furniture", icon: CategorySvgMap.Furniture, active: true },
  { name: "Lighting", icon: CategorySvgMap.Lighting },
  { name: "HVAC", icon: CategorySvgMap.HVAC },
  { name: "Flooring", icon: CategorySvgMap.Flooring },
  { name: "Civil", icon: CategorySvgMap.CivilPlumbing },
  { name: "Partitions", icon: CategorySvgMap.PartitionsCeilings },
  { name: "Paint", icon: CategorySvgMap.Paint },
  { name: "Smart", icon: CategorySvgMap["Smart Solutions"] },
  { name: "Lux", icon: CategorySvgMap.Lux },
];

export const subcat = [
  {
    name: "Linear Workstation",
    img: "/images/boq/LinearWorkstation.png",
  },
  {
    name: "L-Type Workstation",
    img: "/images/boq/LTypeWorkstation.png",
  },
  {
    name: "Md Cabin",
    img: "/images/boq/MdCabin.png",
    active: true,
  },
  {
    name: "Manager Cabin",
    img: "/images/boq/ManagerCabin.png",
  },
  {
    name: "Small Cabin",
    img: "/images/boq/SmallCabin.png",
  },
];
