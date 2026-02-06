import toast from "react-hot-toast";

export const handleError = (
  error,
  {
    devMessage = "Error occurred:",
    prodMessage = "Something went wrong",
    showToast = true,
  } = {},
) => {
  if (import.meta.env.DEV) {
    console.error(devMessage, error);
    return;
  }

  if (import.meta.env.PROD && showToast) {
    toast.error(prodMessage);
  }
};
