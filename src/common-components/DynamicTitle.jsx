import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = "Workved Interiors";

    // Remove trailing slash (except when pathname is just "/")
    let path = location.pathname;
    if (path !== "/" && path.endsWith("/")) {
      path = path.slice(0, -1);
    }

    // Home page
    if (path === "/") {
      document.title = baseTitle;
      return;
    }

    // Convert "/contact-us" → "Contact Us"
    const pageName = path
      .replace("/", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    document.title = `${baseTitle} - ${pageName}`;
  }, [location.pathname]);

  return null;
};

export default DynamicTitle;
