import { useState, useEffect, useCallback } from "react";
import { AnimationStep } from "./types.js";
import { STEPS } from "./constants.js";

import Cursor from "./Cursor.jsx";
import {
  LandingScreen,
  LayoutScreen,
  PlanSelectionScreen,
  CustomizationScreen,
  DownloadScreen,
} from "./WalkthroughAnimation.jsx";
import { FaMagic } from "react-icons/fa";
import { HiArrowPath } from "react-icons/hi2";

const AnimationWrapper = () => {
  const [currentStep, setCurrentStep] = useState(AnimationStep.LANDING);
  const [cursorTarget, setCursorTarget] = useState("start-button");
  const [isClicking, setIsClicking] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isUserNavigating, setIsUserNavigating] = useState(false);

  const simulateStep = useCallback(
    async (step) => {
      const actionsMap = {
        [AnimationStep.LANDING]: {
          target: "start-button",
          next: AnimationStep.LAYOUT,
          delay: 2500,
        },
        [AnimationStep.LAYOUT]: {
          target: "create-boq-btn",
          next: AnimationStep.PLAN_SELECTION,
          delay: 4500,
        },
        [AnimationStep.PLAN_SELECTION]: {
          target: "get-exclusive-btn",
          next: AnimationStep.PRODUCT_CUSTOMIZATION,
          delay: 3000,
        },
        [AnimationStep.PRODUCT_CUSTOMIZATION]: {
          target: "download-final-btn",
          next: AnimationStep.DOWNLOAD,
          delay: 4500,
        },
        [AnimationStep.DOWNLOAD]: {
          target: "download-pdf-btn",
          next: null,
          delay: 2000,
        },
      };

      const action = actionsMap[step];
      if (!action) return;

      // Do not auto-run if user clicked a step or if animation is done.
      if (hasCompleted || isUserNavigating) return;

      // Set cursor target
      setCursorTarget(action.target);

      // Initial movement delay
      await new Promise((r) => setTimeout(r, 1200));

      if (hasCompleted || isUserNavigating) return;

      // For the Layout step, let's hover over some specific items first for realism
      if (step === AnimationStep.LAYOUT) {
        setCursorTarget("plus-item-0");
        await new Promise((r) => setTimeout(r, 800));
        setIsClicking(true);
        await new Promise((r) => setTimeout(r, 100));
        setIsClicking(false);
        await new Promise((r) => setTimeout(r, 500));
        setCursorTarget(action.target); // Back to main target
        await new Promise((r) => setTimeout(r, 800));
      }

      // Perform final click
      setIsClicking(true);
      await new Promise((r) => setTimeout(r, 200));
      setIsClicking(false);

      // Screen transition delay
      await new Promise((r) => setTimeout(r, 800));

      // Move to next step
      if (action.next) {
        setCurrentStep(action.next);
        return;
      }

      // Final step ends the animation (no looping)
      setHasCompleted(true);
    },
    [hasCompleted, isUserNavigating],
  );

  useEffect(() => {
    simulateStep(currentStep);
  }, [currentStep, simulateStep]);

  const handleStepClick = (stepId) => {
    setIsUserNavigating(true);
    setHasCompleted(true);
    setCurrentStep(stepId);

    const targetMap = {
      [AnimationStep.LANDING]: "start-button",
      [AnimationStep.LAYOUT]: "create-boq-btn",
      [AnimationStep.PLAN_SELECTION]: "get-exclusive-btn",
      [AnimationStep.PRODUCT_CUSTOMIZATION]: "download-final-btn",
      [AnimationStep.DOWNLOAD]: "download-pdf-btn",
    };

    setCursorTarget(targetMap[stepId] || "start-button");
    setIsClicking(false);
  };
  const handleRestart = () => {
    setIsUserNavigating(false);
    setHasCompleted(false);
    setCurrentStep(AnimationStep.LANDING);
    setCursorTarget("start-button");
    setIsClicking(false);
  };

  const renderScreen = () => {
    switch (currentStep) {
      case AnimationStep.LANDING:
        return <LandingScreen />;
      case AnimationStep.LAYOUT:
        return <LayoutScreen />;
      case AnimationStep.PLAN_SELECTION:
        return <PlanSelectionScreen />;
      case AnimationStep.PRODUCT_CUSTOMIZATION:
        return <CustomizationScreen />;
      case AnimationStep.DOWNLOAD:
        return <DownloadScreen />;
      default:
        return <LandingScreen />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-0 overflow-hidden font-TimesNewRoman h-full">
      {/* <div className="bg-white max-w-6xl relative"> */}

      <div className="bg-white max-w-7xl relative w-full py-4 px-10">
        <h2 className="font-Georgia font-bold text-3xl text-center tracking-wide pb-4">
          How we Work
        </h2>
        {/* Progress Steps */}
        <div className="w-full px-12 mb-10">
          <div className="flex gap-6">
            {STEPS.map((s, idx) => {
              const stepIdx = STEPS.findIndex(
                (step) => step.id === currentStep,
              );
              const isActive = s.id === currentStep;
              const isPast = stepIdx > idx;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleStepClick(s.id)}
                  className="flex-1 flex flex-col gap-3 group text-left"
                >
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-1000 ease-out ${
                        isActive
                          ? "w-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                          : isPast
                            ? "w-full bg-emerald-500"
                            : "w-0"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                        isActive
                          ? "text-blue-400"
                          : isPast
                            ? "text-emerald-500"
                            : "text-slate-600"
                      }`}
                    >
                      {idx + 1}. {s.title}
                    </span>
                    {isPast && (
                      <i className="fas fa-check-circle text-[10px] text-emerald-500"></i>
                    )}
                  </div>
                </button>
              );
            })}
            <button
              title="restart"
              className="text-lg font-black place-self-start"
              onClick={handleRestart}
            >
              <HiArrowPath color="#334A78" />
            </button>
          </div>
        </div>

        {/* The Simulation Frame */}
        <div className="relative aspect-[2/1] bg-white rounded-lg overflow-hidden border-4 border-slate-900 ring-1 ring-white/10">
          {/* Active Screen Rendering */}
          <div className="h-full">{renderScreen()}</div>

          {/* Simulation Overlay Components */}
          <Cursor targetId={cursorTarget} isClicking={isClicking} />

          {/* Smart Tooltip */}
          <div className="absolute bottom-4 left-4 z-50 bg-transparent">
            <div className="bg-slate-900/95 backdrop-blur-2xl text-white px-5 py-2 rounded-[1rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-5 border border-white/10 animate-in slide-in-from-left-12 duration-1000 max-w-sm">
              <div className="relative shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-6 transition-transform">
                  <i className="fas fa-magic">
                    <FaMagic />
                  </i>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
              <div className="pr-4">
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1.5 opacity-80">
                  Workflow Phase
                </div>
                <div className="text-white">
                  {STEPS.find((s) => s.id === currentStep)?.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default AnimationWrapper;
