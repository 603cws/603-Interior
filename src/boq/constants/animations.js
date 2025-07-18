export const selectAreaAnimation = {
  initial: { x: "100vw", opacity: 0 },
  animate: {
    x: "0",
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    x: "-100vw",
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" },
  },
};

export const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.0, ease: "easeOut" } },
  exit: { opacity: 0, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};
