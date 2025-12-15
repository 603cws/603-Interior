export const trackCTA = (label = "CTA Button") => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "cta_click", {
      event_category: "CTA",
      event_label: label,
    });
  }
};
