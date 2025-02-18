import { useState } from "react";
import { useApp } from "../Context/Context";

// Example bullet points for each plan.
// You can replace them with your existing content from your original Plans component.
const plansData = [
  {
    id: 0,
    planNumber: "01",
    title: "Minimal",
    bullets: [
      "The brand proposes their budget",
      "The brand proposes their budget",
      "The brand proposes their budget",
      "The brand proposes their budget",
    ],
    image: "/images/plan1.png",
    planKey: "Minimal",
  },
  {
    id: 1,
    planNumber: "02",
    title: "Exclusive",
    bullets: [
      "The brand proposes their budget",
      "The brand proposes their budget",
      "The brand proposes their budget",
      "The brand proposes their budget",
    ],
    image: "/images/plan1.png",
    planKey: "Exclusive",
  },
  {
    id: 2,
    planNumber: "03",
    title: "Luxury",
    bullets: [
      "The brand proposes their budget",
      "The brand proposes their budget",
      "The brand proposes their budget",
      "The brand proposes their budget",
    ],
    image: "/images/plan1.png",
    planKey: "Luxury",
  },
  {
    id: 3,
    planNumber: "04",
    title: "Custom",
    bullets: [
      "The brand proposes their budget",
      "Dedicated brand webinar or",
      "Co-branded marketing campaigns",
      "Offline exposure at 603 Co workings",
    ],
    image: "/images/plan1.png",
    planKey: "Custom", // used when "Select" is clicked
  },
];

/**
 * Utility: Returns a grid-template-columns string so that the hovered plan
 * is wide, and the others are narrow. Adjust the ratio (e.g. 2fr vs. 1fr) if desired.
 */
function getGridTemplateColumns(hoveredId) {
  // For 4 plans, default to plan #0 expanded if none is hovered.
  switch (hoveredId) {
    case 0:
      return "4fr 1fr 1fr 1fr"; // Plan #0 is wide, others narrow
    case 1:
      return "1fr 4fr 1fr 1fr"; // Plan #1 is wide, others narrow
    case 2:
      return "1fr 1fr 4fr 1fr";
    case 3:
      return "1fr 1fr 1fr 4fr";
    default:
      return "2.5fr 1fr 1fr 1fr"; // Fallback
  }
}

function Plans() {
  const { setSelectedPlan } = useApp();

  // Hovered plan state. 0 = first plan expanded by default.
  const [hoveredPlan, setHoveredPlan] = useState(1);

  return (
    <div className="container mx-auto my-8 font-Poppins">
      <h2 className="text-center font-semibold text-3xl capitalize text-[#34BFAD] my-4">
        please select your plan
      </h2>
      {/* 
        A grid with 4 columns, where the hovered plan is wide, and the others are narrow.
        Adjust the gap, height, etc. as needed.
      */}
      <div
        className="grid transition-all duration-500 h-[450px] gap-2"
        style={{ gridTemplateColumns: getGridTemplateColumns(hoveredPlan) }}
        onMouseLeave={() => setHoveredPlan(1)}
        // ^ If you want the layout to revert to the first plan after leaving the row.
        // Remove if you prefer the last hovered plan to remain expanded.
      >
        {plansData.map((plan) => {
          const isExpanded = plan.id === hoveredPlan;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              className="relative overflow-hidden bg-[#E4F0EC]"
            >
              {/* 
                If expanded, show the "large" layout: 
                - Plan # + Title + Bullets + Image + "Select" button 
              */}
              {isExpanded ? (
                <div className="w-full h-full flex flex-row bg-[#183d3d]">
                  {/* Left side: plan text & bullet points */}
                  <div className="h-full px-7 py-10 flex items-end justify-center relative font-Poppins text-white border-r-2">
                    {/* Plan number in the top-left corner */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2  text-3xl font-bold">
                      {plan.planNumber}
                    </div>

                    {/* Plan title vertically centered; can rotate or use writing-mode */}
                    <div
                      className="text-2xl font-bold rotate-180 text-end"
                      style={{ writingMode: "vertical-lr" }}
                    >
                      {plan.title}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col-reverse xl:flex-row ">
                    <div className="flex-1 py-3 px-6  text-white flex flex-col justify-between">
                      {/* Plan Number & Title */}
                      <div>
                        <h2 className="text-3xl font-bold mb-4">
                          {plan.title}
                        </h2>

                        {/* Bullet Points */}
                        <ul className="xl:space-y-2 text-sm">
                          {plan.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-center xl:gap-2 ">
                              <img
                                src="/images/Check_ring.png"
                                alt="check"
                                className="mt-1"
                              />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* "Select" Button */}
                      <div className="text-left mt-4">
                        <button
                          onClick={() => setSelectedPlan(plan.planKey)}
                          className="bg-[#34BFAD] text-black px-4 py-2 rounded-3xl font-semibold hover:bg-gray-200 transition"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                    {/* Right side: plan image */}
                    <div className="flex-1 px-5 xl:py-7">
                      <img
                        src={plan.image}
                        alt={plan.title}
                        className="w-full h-52 xl:h-full object-cover rounded-3xl"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* If collapsed, show the "small" layout with vertical text. */
                <div className="w-full h-full flex items-end justify-center relative font-Poppins text-[#34BFAD] py-10">
                  {/* Plan number in the top-left corner */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2  text-3xl font-bold">
                    {plan.planNumber}
                  </div>

                  {/* Plan title vertically centered; can rotate or use writing-mode */}
                  <div
                    className="text-2xl font-bold rotate-180 text-end"
                    style={{ writingMode: "vertical-lr" }}
                  >
                    {plan.title}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Plans;
