import { vi } from "vitest";
import "@testing-library/jest-dom";
import React from "react";

/* scrollTo */
window.scrollTo = vi.fn();

/* ResizeObserver mock */
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

/* lottie-web */
vi.mock("lottie-web", () => ({
  default: {
    loadAnimation: vi.fn(() => ({
      play: vi.fn(),
      stop: vi.fn(),
      destroy: vi.fn(),
    })),
  },
}));

/* lottie-react */
vi.mock("lottie-react", () => ({
  default: () => React.createElement("div", { "data-testid": "lottie-mock" }),
}));

/* react-apexcharts */
vi.mock("react-apexcharts", () => ({
  default: () =>
    React.createElement("div", { "data-testid": "apexchart-mock" }),
}));

/* apexcharts (safety) */
vi.mock("apexcharts", () => ({
  default: class {
    render() {}
    destroy() {}
  },
}));

/* react-joyride */
vi.mock("react-joyride", () => ({
  default: () => null, // completely disable Joyride in tests
}));
