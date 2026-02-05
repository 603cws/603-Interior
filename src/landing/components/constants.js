import { AnimationStep } from "./types.js";

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
