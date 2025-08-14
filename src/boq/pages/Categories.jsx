import { useState, useRef, useEffect } from "react";
import { useApp } from "../../Context/Context";
import { motion, AnimatePresence } from "framer-motion";

const Categories = ({
  // setSelectedCategory,
  setSelectedSubCategory,
  handleCategoryClick,
}) => {
  const {
    selectedCategory,
    selectedSubCategory,
    selectedData,
    minimizedView,
    categories,
    userResponses,
  } = useApp();

  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [itemsPerPage, setItemsPerPage] = useState(4); // default

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 300) {
        setItemsPerPage(2);
      } else if (width < 420) {
        setItemsPerPage(3);
      } else if (width < 768) {
        setItemsPerPage(4);
      } else if (width < 1024) {
        setItemsPerPage(7);
      } else if (width < 1440) {
        setItemsPerPage(7);
      } else {
        setItemsPerPage(9);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = null;
    let isTouch = false;

    // Mobile touch events
    const handleTouchStart = (e) => {
      isTouch = true;
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      if (!isTouch || startX == null) return;
      const endX = e.changedTouches[0].clientX;
      handleSwipe(startX, endX);
      startX = null;
      isTouch = false;
    };

    // Desktop mouse drag events
    const handleMouseDown = (e) => {
      isTouch = false;
      startX = e.clientX;
      window.addEventListener("mouseup", handleMouseUp);
    };
    const handleMouseUp = (e) => {
      if (startX == null) return;
      const endX = e.clientX;
      handleSwipe(startX, endX);
      startX = null;
      window.removeEventListener("mouseup", handleMouseUp);
    };

    function handleSwipe(start, end) {
      const threshold = 40; // minimum px distance to be considered a swipe
      if (end - start > threshold && currentPage > 0) {
        setCurrentPage((p) => p - 1); // Swipe RIGHT: previous page
      } else if (start - end > threshold && currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1); // Swipe LEFT: next page
      }
    }

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    container.addEventListener("mousedown", handleMouseDown);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentPage, totalPages]); //Drag funtionality

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle scroll events (horizontal wheel)
    function handleWheel(e) {
      // Only act on horizontal scroll (deltaX)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Scroll right: next page
        if (e.deltaX > 10 && currentPage < totalPages - 1) {
          setCurrentPage((p) => p + 1);
          e.preventDefault();
        }
        // Scroll left: previous page
        if (e.deltaX < -10 && currentPage > 0) {
          setCurrentPage((p) => p - 1);
          e.preventDefault();
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [currentPage, totalPages]); //Swipe functionality

  const paginatedItems = categories.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const getCleanedCategoryName = (categoryName) => {
    return categoryName.replace(/[^a-zA-Z0-9]/g, ""); // Removes all non-alphanumeric characters
  };

  const getImageSrcSubCat = (category, subCategory) => {
    if (!subCategory) return "";

    const getCleanedCategoryName = (name) => {
      return name
        .replace(/\//g, " ") // Replace `/` with a space
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters except spaces
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim(); // Trim any leading or trailing spaces
    };

    const getCleanedSubCategoryName = (name) => {
      return name
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .replace(/\s(.)/g, (match, group1) => group1.toUpperCase()) // Convert spaces to camel case
        .replace(/\s+/g, ""); // Remove all spaces
    };

    const cleanedCategoryName = getCleanedCategoryName(category);
    const cleanedSubCategoryName = getCleanedSubCategoryName(subCategory);

    // Handle specific categories except Furniture
    if (
      [
        "Lighting",
        "HVAC",
        "Smart Solutions",
        "Flooring",
        "Civil Plumbing",
        "Paint",
        "Partitions Ceilings",
        "Lux",
      ].includes(cleanedCategoryName)
    ) {
      //Sunny => Maybe reverse logic in future(except Furniture)
      return `/images/boq/${cleanedCategoryName}/${cleanedSubCategoryName}.png`;
    }

    // Default case
    return `/images/boq/${cleanedSubCategoryName}.png`;
  };
  const checkIfSubCategoryCompleted = (category, subCategory) => {
    if (!selectedData || selectedData.length === 0) return false;

    const categoryObject = categories.find(
      (cat) =>
        cat.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    if (!categoryObject) return false;

    // Categories where we need to check all subcategories
    const specialCategories = [
      "furniture",
      "civil / plumbing",
      "lux",
      "smart solutions",
      "paint",
    ];

    if (specialCategories.includes(category.toLowerCase().trim())) {
      let requiredSubCategory1Items = categoryObject.subcategory1 || [];

      const selectedSubCategory1Items = (
        Array.isArray(selectedData) ? selectedData : []
      )
        .filter(
          (item) =>
            item?.category?.toLowerCase().trim() ===
              category?.toLowerCase().trim() &&
            item?.subcategory?.toLowerCase().trim() ===
              subCategory?.toLowerCase().trim()
        )

        .map((item) => item.subcategory1);

      if (category === "Civil / Plumbing" && subCategory === "Pantry") {
        requiredSubCategory1Items = requiredSubCategory1Items.filter(
          (item) => item !== "Pods"
        );
      }

      const isCompleted =
        requiredSubCategory1Items.length > 0 &&
        requiredSubCategory1Items.every((subCat1) =>
          selectedSubCategory1Items.includes(subCat1)
        );
      return isCompleted;
    } else {
      // For other categories, check if only one subcategory1 is added
      const selectedSubCategory1Items = (
        Array.isArray(selectedData) ? selectedData : []
      )
        .filter(
          (item) =>
            item?.category?.toLowerCase().trim() ===
              category?.toLowerCase().trim() &&
            item?.subcategory?.toLowerCase().trim() ===
              subCategory?.toLowerCase().trim()
        )

        .map((item) => item.subcategory1);

      // If only one subcategory1 is selected, mark as completed
      return selectedSubCategory1Items.length === 1;
    }
  };

  const checkIfCategoryCompleted = (category) => {
    // Check if selectedData is available
    if (!selectedData || selectedData.length === 0) return false;

    const categoryObject = categories.find(
      (cat) =>
        cat.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    if (!categoryObject) return false;

    const requiredSubCategories = categoryObject.subcategories || [];

    if (category === "HVAC") {
      const hasCentralizedProduct = selectedData.some(
        (product) =>
          product.category === "HVAC" && product.subcategory === "Centralized"
      );

      const nonCentralizedSubcategories = requiredSubCategories.filter(
        (sub) => sub.toLowerCase().trim() !== "centralized"
      );

      const areOtherSubcategoriesCompleted = nonCentralizedSubcategories.every(
        (subCategory) => checkIfSubCategoryCompleted(category, subCategory)
      );

      // Mark as completed if HVAC has a "Centralized" product OR all other subcategories are completed
      if (hasCentralizedProduct || areOtherSubcategoriesCompleted) return true;
    }
    // Loop through all subcategories to check if all are marked as completed
    const isCompleted = requiredSubCategories.every((subCategory) =>
      checkIfSubCategoryCompleted(category, subCategory)
    );

    return isCompleted;
  };

  const getCategoryFill = (category, selectedCategory) => {
    const isSelected = category === selectedCategory?.category;
    const isCompleted = checkIfCategoryCompleted(category);

    return minimizedView
      ? isCompleted
        ? "#fff"
        : "#374A75"
      : isSelected
      ? "#fff"
      : "#374A75";
  };

  const categorySvgMap = {
    Furniture: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 hover:animate-bounce
        "
      >
        <path
          d="M5 34.1903C5.23269 34.0745 5.16668 33.8116 5.22139 33.6249C6.03033 30.8578 8.39427 29.0263 11.0004 29.1722C13.7352 29.3254 15.9378 31.357 16.4783 34.2198C17.0206 37.0921 17.565 39.9641 18.1117 42.8356C18.5742 45.2646 20.1674 46.6558 22.5414 46.6583C30.8762 46.6666 39.2111 46.6616 47.5459 46.6616C50.8025 46.6616 54.0589 46.6649 57.3155 46.6606C59.8721 46.6573 61.3894 45.3596 61.9104 42.7C62.4586 39.9024 62.991 37.1012 63.5097 34.2974C64.0588 31.3287 66.3591 29.2177 69.13 29.1714C71.9435 29.1246 74.274 31.1582 74.8826 34.1858C74.8939 34.2417 74.9597 34.2855 75 34.3348C75 35.346 75 36.3572 75 37.3684C74.6991 37.8594 74.8244 38.4264 74.787 38.9511C74.5636 42.094 74.3479 45.2384 74.2014 48.3861C73.9857 53.0206 70.2351 56.986 65.8386 57.1552C65.6792 57.1614 65.5198 57.1633 65.3603 57.1633C48.4575 57.1637 31.5547 57.1687 14.6518 57.16C10.5056 57.1579 6.96493 54.2156 6.02268 49.9652C5.61619 48.1318 5.70683 46.2331 5.56276 44.3652C5.3835 42.0395 5.26916 39.708 5.12619 37.3792C5.11926 37.2636 5.13713 37.1345 5 37.0794C5 36.1163 5 35.1533 5 34.1903Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Furniture") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Furniture", selectedCategory)}
        />
        <path
          d="M20.4562 59.4753C20.0567 61.1154 19.7426 62.7139 19.2707 64.2587C18.7477 65.9703 16.9972 66.8524 15.3574 66.3701C13.7313 65.8921 12.7389 64.1402 13.0885 62.311C13.2457 61.4885 13.4649 60.6792 13.6555 59.8637C13.7129 59.6181 13.789 59.462 14.0997 59.4649C16.193 59.4847 18.2867 59.4753 20.4562 59.4753Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Furniture") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Furniture", selectedCategory)}
        />
        <path
          d="M59.5508 59.4733C61.7386 59.4733 63.8322 59.4835 65.9257 59.4629C66.2573 59.4597 66.2935 59.6631 66.3484 59.889C66.5401 60.6793 66.7452 61.467 66.9055 62.2648C67.2836 64.1456 66.2361 65.9653 64.5518 66.3917C62.7694 66.8429 61.1118 65.8075 60.6154 63.8927C60.2439 62.4601 59.9201 61.0138 59.5508 59.4733Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Furniture") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Furniture", selectedCategory)}
        />
        <path
          d="M39.6579 14.0017C46.0148 14.0017 52.3716 13.9987 58.7285 14.0029C63.0764 14.0056 66.506 16.55 67.8031 20.6854C68.4283 22.6785 68.272 24.6655 67.8908 26.669C67.837 26.9523 67.6716 27.006 67.4752 27.0604C63.7688 28.0856 61.8294 30.7223 61.1849 34.6196C60.7507 37.2453 60.2124 39.8519 59.7018 42.463C59.4576 43.7118 58.7477 44.3232 57.5417 44.3239C45.8534 44.3295 34.1648 44.3295 22.4764 44.3243C21.2335 44.3237 20.5432 43.7233 20.2859 42.4137C19.6945 39.4033 19.163 36.3794 18.5344 33.3781C17.8197 29.9658 15.1966 27.4542 11.9371 26.9528C11.6574 26.9099 11.459 26.8735 11.3538 26.5037C9.85312 21.238 12.8296 15.6476 17.8775 14.3012C18.7645 14.0646 19.6728 13.9996 20.5872 14C26.9441 14.0031 33.301 14.0015 39.6579 14.0017Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Furniture") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Furniture", selectedCategory)}
        />
      </svg>
    ),
    Lighting: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group relative"
      >
        <path
          d="M39.25 1.75C39.1094 1.89062 39.0625 4.40625 39.0625 12.1406V22.3438H40H40.9375V12.1406C40.9375 4.40625 40.8906 1.89062 40.75 1.75C40.6406 1.64062 40.3125 1.5625 40 1.5625C39.6875 1.5625 39.3594 1.64062 39.25 1.75Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
        />
        <path
          d="M38.75 23.2969C38.0625 23.5781 37.1875 24.5469 36.9688 25.2656L36.8594 25.625H40H43.1406L43.0469 25.2656C42.8906 24.7656 42.2656 23.9844 41.6875 23.5625C41.1094 23.1562 39.4375 23 38.75 23.2969Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
        />
        <path
          d="M36.875 28.2344V29.1406H40H43.125V28.2344V27.3438H40H36.875V28.2344Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
        />
        <path
          d="M36.3594 31.0312C30.9688 31.8594 26.3125 34.25 22.5 38.125C18.5156 42.1719 16.0938 47.4375 15.5469 53.3125L15.4375 54.375H40H64.5625L64.4531 53.3125C63.6719 44.9688 59.0938 37.875 51.9062 33.8438C48.1875 31.7656 44.25 30.7656 39.8438 30.7969C38.6875 30.8125 37.1094 30.9062 36.3594 31.0312ZM30 37.0312C30.3906 37.2344 30.6562 37.7188 30.5312 38.0156C30.4844 38.1562 29.9375 38.6406 29.3125 39.125C27.7812 40.2969 25.25 42.9219 24.1719 44.4688C23.6719 45.1719 23.1719 45.7969 23.0312 45.8438C22.7188 45.9688 22.2344 45.7031 22.0156 45.2969C21.875 45 21.9688 44.7812 22.7188 43.6875C24.3594 41.2656 26.9219 38.6562 28.9531 37.3125C29.7188 36.8125 29.625 36.8281 30 37.0312Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
        />
        <path
          d="M33.3125 57.2195C33.5156 59.9695 35.0312 62.0008 37.6094 62.9695C38.8438 63.4383 40.875 63.3914 42.0781 62.907C44.6094 61.8602 46.0312 59.9227 46.2188 57.2195L46.2969 56.0945H39.7656H33.2344L33.3125 57.2195Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
        />
        <path
          d="M29.0312 69.5628C26.9375 71.7347 26.5625 72.1878 26.5625 72.5941C26.5625 73.4847 27.5781 73.9222 28.2344 73.3128C28.4062 73.1722 29.5469 72.016 30.75 70.766C33.1562 68.266 33.3281 67.9691 32.5625 67.3597C32.3281 67.1722 32 67.0316 31.8125 67.0316C31.5938 67.0316 30.7031 67.8441 29.0312 69.5628Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
          className="opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-200"
        />
        <path
          d="M47.4376 67.36C46.6719 67.9694 46.8438 68.2663 49.2501 70.7663C50.4532 72.0163 51.5938 73.1725 51.7657 73.3132C52.4376 73.9225 53.4376 73.4694 53.4376 72.5632C53.4376 72.1882 53.0001 71.6569 50.9688 69.5632C49.2969 67.8444 48.4063 67.0319 48.1876 67.0319C48.0001 67.0319 47.6719 67.1725 47.4376 67.36Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
          className="opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-200 delay-150"
        />
        <path
          d="M39.3281 70.4375C39.0938 70.6875 39.0625 71.2031 39.0625 74.3906C39.0625 77.0469 39.1094 78.1094 39.25 78.25C39.5 78.5 40.5 78.5 40.75 78.25C40.8906 78.1094 40.9375 77.0312 40.9375 74.375C40.9375 70.9844 40.9062 70.6562 40.6562 70.4219C40.2812 70.0781 39.6406 70.0938 39.3281 70.4375Z"
          // fill="#374A75"
          // fill={checkIfCategoryCompleted("Lighting") ? "#fff" : "#374A75"}
          fill={getCategoryFill("Lighting", selectedCategory)}
          className="opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-200 delay-200"
        />
      </svg>
    ),
    HVAC: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative group"
      >
        <path
          d="M17.2656 22.002C17.0898 22.0898 16.8359 22.3438 16.709 22.5684L16.4648 22.9785V38.4375C16.4648 53.7402 16.4648 53.9062 16.6602 54.2969C16.7676 54.5215 16.9824 54.7852 17.1289 54.8926C17.3926 55.0879 17.5488 55.0879 40 55.0879C62.4512 55.0879 62.6074 55.0879 62.8711 54.8926C63.0176 54.7852 63.2324 54.5215 63.3398 54.2969C63.5352 53.9062 63.5352 53.7402 63.5352 38.4668V23.0371L63.3105 22.6172C63.1836 22.373 62.9492 22.1191 62.7539 22.0215C62.4219 21.8457 61.6504 21.8359 40 21.8359C19.5215 21.8359 17.5586 21.8555 17.2656 22.002ZM59.4336 38.4863V51.3281H54.2578H49.082V38.4863V25.6445H54.2578H59.4336V38.4863ZM35.3027 26.1914C36.9727 26.4941 38.623 27.1582 40.1172 28.1543C41.0254 28.75 42.8418 30.5664 43.4375 31.4551C44.8926 33.6621 45.5762 35.9082 45.5762 38.4863C45.5762 41.9043 44.3457 44.8535 41.9141 47.2852C40.0488 49.1504 37.7832 50.3418 35.2637 50.791C34.1211 50.9961 32.1094 50.9961 30.9668 50.791C27.1191 50.1074 23.7305 47.5781 21.9434 44.043C20.5176 41.2012 20.2441 37.793 21.2109 34.707C22.2949 31.2402 25.0391 28.2812 28.4375 26.9238C30.7031 26.0156 32.9297 25.7715 35.3027 26.1914Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
        <path
          d="M51.5908 28.0078C51.2197 28.3008 51.2197 29.0332 51.5908 29.3164C51.7275 29.4141 52.3135 29.4434 54.2666 29.4531C56.7471 29.4531 56.7666 29.4531 56.9717 29.2285C57.2646 28.916 57.2549 28.3789 56.9619 28.1055C56.7373 27.9004 56.6689 27.8906 54.2471 27.8906C52.4014 27.8906 51.7178 27.9199 51.5908 28.0078Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
        <path
          d="M51.5539 32.0117C51.2317 32.3535 51.2219 32.8613 51.5246 33.1641C51.7102 33.3496 51.8469 33.3594 54.2395 33.3594C56.7493 33.3594 56.7688 33.3594 56.9739 33.1348C57.2864 32.8027 57.2668 32.2656 56.9348 32.002C56.6907 31.8066 56.5539 31.7969 54.2102 31.7969C51.7883 31.7969 51.7493 31.7969 51.5539 32.0117Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
        <path
          d="M51.5727 35.9277C51.2309 36.2109 51.2113 36.7968 51.5141 37.1093C51.7191 37.3046 51.8266 37.3144 54.0336 37.3437C55.3129 37.3632 56.4555 37.3437 56.5727 37.3144C57.1879 37.1582 57.4027 36.3964 56.9438 35.9472L56.7094 35.7031H54.268C51.8656 35.7031 51.8266 35.7031 51.5727 35.9277Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
        <path
          d="M51.5234 44.3945V48.3984H54.2578H56.9922V44.3945V40.3906H54.2578H51.5234V44.3945Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
        <path
          d="M27.8613 30.3329C27.3242 30.4696 26.5625 30.8798 26.1328 31.2704C25.3027 32.0223 24.8633 33.077 24.8633 34.3368C24.8633 37.12 26.6699 38.9364 29.9316 39.4442L30.7617 39.5712L30.4883 39.7762C30.0977 40.0887 29.3848 40.2157 28.7012 40.0887C27.1094 39.786 25.7227 40.4208 25.1367 41.7098C24.9707 42.0809 24.9219 42.3837 24.9121 42.9891C24.9121 43.702 24.9414 43.8387 25.2832 44.5126C25.9473 45.87 27.1484 46.6512 28.6719 46.7196C31.6113 46.8563 33.6133 44.9716 34.0625 41.661L34.1797 40.8016L34.4043 41.0946C34.7266 41.5341 34.8438 42.2177 34.7168 42.9012C34.1895 45.7137 36.543 47.5106 39.1797 46.3094C39.8926 45.9774 40.625 45.2255 40.9961 44.4247C41.2402 43.9071 41.3184 43.6044 41.3477 42.9794C41.5039 39.9423 39.5215 37.8817 36.0352 37.4813L35.3613 37.413L35.8496 37.12C36.2891 36.8563 36.3965 36.8368 37.0703 36.8661C38.6621 36.9442 39.1602 36.9149 39.6191 36.7098C40.2539 36.4266 40.7324 35.9677 41.0449 35.3329C41.4258 34.5516 41.4258 33.4774 41.0449 32.6376C40.332 31.0848 39.0039 30.2352 37.3047 30.2352C35.7812 30.2352 34.668 30.6844 33.75 31.661C32.8516 32.6278 32.2656 34.0341 32.1191 35.5673L32.0605 36.1923L31.8359 35.8895C31.4844 35.411 31.377 34.7762 31.5137 33.995C31.7773 32.452 31.2207 31.1727 30 30.577C29.4238 30.2938 28.457 30.1864 27.8613 30.3329ZM33.8965 36.7684C35.2539 37.3837 35.3906 39.2391 34.1309 40.0692C33.1738 40.704 31.875 40.3231 31.3965 39.2684C30.6738 37.6864 32.3145 36.0458 33.8965 36.7684Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
          className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]"
          style={{ transformOrigin: "33px 39px" }}
        />
        <path
          d="M21.0547 57.3828V58.1641H24.0332H27.0117V57.3828V56.6016H24.0332H21.0547V57.3828Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
        <path
          d="M52.9883 57.3828V58.1641H55.9668H58.9453V57.3828V56.6016H55.9668H52.9883V57.3828Z"
          // fill="#374A75"
          fill={getCategoryFill("HVAC", selectedCategory)}
        />
      </svg>
    ),
    SmartSolutions: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-in-out hover:rotate-[-30deg]"
      >
        <path
          d="M30.8449 18.1357C30.2492 18.4287 30.1418 18.5556 25.3762 24.4736C22.7101 27.8037 20.4152 30.7236 20.2883 30.958C19.9855 31.5537 19.9074 32.4716 20.1223 33.1943C20.2394 33.6142 20.4055 33.8779 20.7961 34.2783C21.3137 34.8154 46.0012 52.5107 46.4992 52.6962C46.8508 52.833 47.2609 52.8232 47.593 52.6767C47.7394 52.6084 51.1574 49.9228 55.1711 46.7099C61.1769 41.9052 62.5051 40.8017 62.632 40.5087C62.8078 40.0986 62.7492 39.4443 62.5051 39.0732C62.2805 38.7314 33.7453 18.1455 33.257 17.9795C33.0324 17.9013 32.5344 17.833 32.1437 17.833C31.5578 17.833 31.343 17.8818 30.8449 18.1357ZM52.466 38.6826C53.0812 39.083 53.2766 39.9912 52.8664 40.5966C52.0949 41.749 50.3566 41.2314 50.3566 39.8447C50.3566 38.7802 51.5871 38.1064 52.466 38.6826Z"
          // fill="#374A75"
          fill={getCategoryFill("Smart Solutions", selectedCategory)}
        />
        <path
          d="M25.8833 42.998C25.3169 43.8086 25.2192 44.0137 25.1899 44.4336C25.1313 45.127 25.3657 45.5176 26.1177 46.0449L26.7427 46.4746L26.4595 46.709C25.4341 47.5781 24.106 48.2715 22.8364 48.6133C22.2212 48.7793 21.7036 48.8281 20.0142 48.8574L17.9341 48.9062V47.0703C17.9341 45.4297 17.9146 45.1953 17.7485 44.9414C17.4458 44.4922 17.0747 44.2969 16.4692 44.2969C15.8638 44.2969 15.4927 44.4922 15.1899 44.9414C15.0142 45.2148 15.0044 45.5469 15.0044 53.2324C15.0044 60.918 15.0142 61.25 15.1899 61.5234C15.4927 61.9727 15.8638 62.168 16.4692 62.168C17.0747 62.168 17.4458 61.9727 17.7485 61.5234C17.9146 61.2695 17.9341 61.0449 17.9341 59.502V57.7734H19.3403C24.8481 57.7734 29.311 56.0352 33.1099 52.4023L34.0181 51.5332L34.8774 52.1094C35.6489 52.6367 35.7856 52.6953 36.2446 52.6953C36.6157 52.6953 36.8501 52.6367 37.0845 52.4707C37.4263 52.2461 38.5688 50.6738 38.4907 50.5469C38.4321 50.4492 26.6743 42.0508 26.5962 42.0508C26.5669 42.0508 26.2446 42.4805 25.8833 42.998Z"
          // fill="#374A75"
          fill={getCategoryFill("Smart Solutions", selectedCategory)}
        />
        <path
          d="M58.2181 47.8711C55.1614 50.3125 52.6224 52.3535 52.5735 52.3926C52.5052 52.4609 53.7259 53.3789 55.4642 54.5703C56.0501 54.9805 56.1966 55.0391 56.636 55.0391C56.9583 55.0391 57.2513 54.9707 57.4368 54.8633C57.72 54.6875 64.7903 46.0254 64.927 45.6836C65.0442 45.3809 65.0052 44.5898 64.8587 44.3066C64.7415 44.0625 63.9895 43.418 63.8431 43.418C63.804 43.418 61.2845 45.4199 58.2181 47.8711Z"
          // fill="#374A75"
          fill={getCategoryFill("Smart Solutions", selectedCategory)}
          className=""
        />
      </svg>
    ),
    Flooring: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-wrapper"
      >
        <path
          d="M47.0586 23.1937C47 23.2132 46.8438 23.5257 46.7363 23.8675C46.6191 24.2191 46.2969 24.8343 46.0332 25.2347C45.3203 26.3089 44.3535 27.0218 42.9082 27.5687C42.5078 27.7151 42.4395 27.7835 42.4395 28.0081C42.4395 28.2327 42.498 28.2913 42.8594 28.389C43.5039 28.5843 44.5 29.1409 45.0469 29.6194C45.6523 30.1468 46.3164 31.1429 46.6582 32.012C47.0879 33.1058 47.3613 33.0667 47.8398 31.8655C48.5039 30.2347 49.5781 29.1702 51.1602 28.5941C51.9023 28.3206 52.0098 28.2425 52.0098 27.9593C52.0098 27.7835 51.8828 27.6956 51.3066 27.471C50.3691 27.1097 49.3828 26.4554 48.8359 25.8304C48.3477 25.2737 47.791 24.2679 47.625 23.6526C47.5176 23.262 47.3223 23.1058 47.0586 23.1937Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
          className="svg-stroke"
        />
        <path
          d="M23.8189 25.6172C22.8033 25.9004 22.0025 26.6328 21.6314 27.6094C21.358 28.3516 21.3971 29.5137 21.7389 30.207C22.0318 30.8223 22.6373 31.418 23.2525 31.7305C23.6725 31.9258 23.8775 31.9648 24.6686 31.9648C25.44 31.9648 25.6744 31.9258 26.0553 31.7305C26.6705 31.4375 27.2369 30.8711 27.5689 30.2363C27.8131 29.7773 27.8424 29.6113 27.8424 28.791C27.8424 27.9707 27.8131 27.7949 27.5689 27.3066C26.9049 25.959 25.2545 25.207 23.8189 25.6172Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
        />
        <path
          d="M32.3714 29.0537C31.7073 29.3955 31.2581 29.9717 31.1116 30.6845C30.7698 32.3252 32.0687 33.8095 33.6995 33.6435C34.6858 33.5459 35.555 32.8525 35.7991 31.9541C35.9456 31.4267 35.8773 30.499 35.6624 30.0888C35.0569 28.9072 33.5823 28.4482 32.3714 29.0537Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
        />
        <path
          d="M38.2305 33.0586C34.7344 34.8555 28.9629 37.9316 28.9629 37.9805C28.9629 38.0195 31.4531 39.3574 34.4902 40.9492L40.0176 43.8594L40.3691 43.6641C40.5742 43.5566 43.0449 42.248 45.8867 40.7539C48.7188 39.2695 51.0332 38.0195 51.0332 37.9805C51.0332 37.9512 48.7383 36.7109 45.9258 35.2363L40.8281 32.5508L40.0859 32.5215C39.3535 32.4824 39.3438 32.4824 38.2305 33.0586Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
        />
        <path
          d="M23.1432 37.9512C23.0846 37.9902 22.8795 38.3613 22.6842 38.7715C22.1569 39.9336 21.5221 40.4805 20.0475 41.0859C19.8131 41.1738 19.7741 41.2422 19.8034 41.5059C19.8327 41.7891 19.8913 41.8379 20.4186 42.043C21.5514 42.4727 22.3913 43.332 22.8795 44.5625C23.0455 44.9922 23.1041 45.0508 23.3483 45.0508C23.5534 45.0508 23.6608 44.9824 23.7487 44.8066C24.4616 43.2441 24.9889 42.6582 26.1803 42.1211C26.9323 41.7793 27.1178 41.5742 26.942 41.3105C26.8444 41.1445 26.8541 41.1445 25.9166 40.7148C25.0866 40.3242 24.2858 39.4844 23.983 38.6836C23.8659 38.3711 23.7291 38.0684 23.6705 38C23.5534 37.8633 23.3092 37.834 23.1432 37.9512Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
          className="svg-stroke"
        />
        <path
          d="M26.7964 39.0547C26.5913 39.1621 26.4253 39.2891 26.4253 39.3379C26.4253 39.3867 26.5913 39.4746 26.7964 39.5332C28.1538 39.8945 28.857 41.4375 28.1343 42.4824C27.8999 42.8145 27.6656 42.9902 27.021 43.3027C26.0054 43.791 25.5269 44.25 25.2534 44.9727C24.9019 45.9199 24.4722 46.3301 23.6226 46.5059C22.8023 46.6914 21.8843 46.0566 21.523 45.0605C21.23 44.2598 20.6245 43.6543 19.8238 43.3613C19.0913 43.0977 19.0523 43.0977 18.7105 43.3418C17.939 43.8887 17.9292 45.4316 18.7007 45.9688C19.1402 46.2715 27.1773 50.4707 27.314 50.4707C27.5386 50.4609 38.271 44.7676 38.2613 44.6602C38.2515 44.543 27.5191 38.8594 27.3042 38.8594C27.2261 38.8594 26.9917 38.9473 26.7964 39.0547Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
        />
        <path
          d="M47.1465 41.7109C44.1875 43.2832 41.7461 44.6016 41.7363 44.6602C41.7266 44.7578 52.4492 50.4609 52.6641 50.4707C52.8399 50.4707 53.6699 50.0508 53.6699 49.9629C53.6699 49.9141 53.5918 49.8555 53.5039 49.8164C53.4063 49.7871 53.0547 49.6309 52.7227 49.4746C51.9024 49.0938 51.7168 48.7812 51.7168 47.8047C51.7168 47.1504 51.7461 47.0332 51.9707 46.7695C52.1074 46.6035 52.6543 46.2422 53.1914 45.9688C54.2559 45.4219 54.4805 45.1973 54.6856 44.5039C54.9688 43.5469 55.6328 42.9512 56.3945 42.9512C57.4102 42.9512 57.9863 43.3516 58.3477 44.3086C58.7383 45.3535 59.1387 45.7344 60.2715 46.125C60.7598 46.3008 60.7891 46.3008 61.1016 46.1152C61.6191 45.8125 61.8731 45.3535 61.8731 44.748C61.8731 44.123 61.7852 43.8594 61.4336 43.5176C61.1602 43.2441 52.8887 38.8398 52.6738 38.8594C52.6055 38.8594 50.1152 40.1484 47.1465 41.7109Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
        />
        <path
          d="M56.3262 44.4445C56.2578 44.5226 56.1504 44.7667 56.0723 44.9816C55.6816 46.0949 54.6562 47.0421 53.4551 47.4327C53.1523 47.5304 53.084 47.5988 53.084 47.8136C53.084 48.048 53.1719 48.1163 53.8066 48.3995C54.9883 48.9367 55.6719 49.6398 56.082 50.7628C56.248 51.2023 56.3262 51.3097 56.541 51.3292C56.7168 51.3488 56.8145 51.3097 56.8535 51.1827C57.3125 49.8351 58.0938 48.9367 59.2656 48.4191C60.3301 47.9503 60.3691 47.6964 59.4316 47.3546C58.875 47.1495 58.1328 46.6417 57.7227 46.1827C57.625 46.0656 57.3516 45.6066 57.1367 45.1671C56.7461 44.3761 56.541 44.1906 56.3262 44.4445Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
          className="svg-stroke"
        />
        <path
          d="M34.4609 48.3901C31.4336 49.9819 28.9629 51.3101 28.9629 51.3394C28.9629 51.4175 38.6992 56.5444 39.168 56.7202C39.5488 56.8667 40.4473 56.8667 40.8281 56.7202C41.2969 56.5444 51.0332 51.4175 51.0332 51.3394C51.0332 51.2905 40.0762 45.4897 39.9883 45.4897C39.9688 45.4995 37.4785 46.7983 34.4609 48.3901Z"
          // fill="#374A75"
          fill={getCategoryFill("Flooring", selectedCategory)}
        />
      </svg>
    ),
    CivilPlumbing: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-wrapper"
      >
        <path
          d="M15.4883 24.2285V32.9688H26.4746H37.4609V24.2285V15.4883H26.4746H15.4883V24.2285ZM35.3125 24.2285V30.8203H26.4746H17.6367V24.2285V17.6367H26.4746H35.3125V24.2285Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing")}
        />
        <path
          d="M18.6133 24.2285V29.8438H21.6895H24.7656V24.2285V18.6133H21.6895H18.6133V24.2285ZM23.2031 23.3887C23.252 23.4961 23.3008 23.8867 23.3008 24.2676C23.3008 24.834 23.2617 25 23.1055 25.1562C22.998 25.2637 22.8711 25.3516 22.8125 25.3516C22.7637 25.3516 22.627 25.2637 22.5195 25.1562C22.3633 25 22.3242 24.834 22.3242 24.2676C22.3242 23.4277 22.4316 23.2031 22.8125 23.2031C22.998 23.2031 23.1348 23.2715 23.2031 23.3887Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M25.6445 24.2285V29.8438H26.4258H27.207V24.2285V18.6133H26.4258H25.6445V24.2285Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M28.1836 24.2285V29.8438H31.2598H34.3359V24.2285V18.6133H31.2598H28.1836V24.2285ZM30.498 23.4961C30.6445 23.7891 30.6641 24.6484 30.5371 24.9902C30.4102 25.3223 30.0781 25.4199 29.834 25.1953C29.6777 25.0586 29.6484 24.8926 29.6484 24.2285C29.6484 23.7305 29.6973 23.3887 29.7656 23.3203C29.9609 23.125 30.3613 23.2227 30.498 23.4961Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M58.0664 17.6074C57.8906 17.6758 56.7969 18.7207 56.7969 18.8281C56.7969 18.8672 58.0957 18.9062 59.6875 18.9062H62.5879L62.5293 18.5449C62.4902 18.3301 62.3438 18.0664 62.168 17.8809L61.875 17.5879L60.0391 17.5684C59.0332 17.5586 58.1445 17.5781 58.0664 17.6074Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M43.9659 19.9023C43.4679 20.0391 42.8136 20.6934 42.6573 21.2109C42.5011 21.7383 42.4913 32.0508 42.6476 32.6074C42.7745 33.0859 43.2628 33.6328 43.7609 33.8574C44.132 34.0332 44.6691 34.043 53.5851 34.043H63.0187L63.4484 33.8184C63.6827 33.6914 64.0148 33.3984 64.171 33.1738L64.464 32.7539L64.4933 27.1777C64.5128 23.3301 64.4933 21.4746 64.4152 21.2207C64.2882 20.791 63.8292 20.2344 63.3995 20C63.1163 19.8438 62.3448 19.834 53.7218 19.8145C47.4523 19.8047 44.2198 19.834 43.9659 19.9023ZM47.9405 22.0508C48.2433 22.207 48.3898 22.4316 48.3995 22.7344C48.4093 23.4473 48.087 23.5938 46.5148 23.5938C45.4503 23.5938 45.2745 23.5742 45.0499 23.3984C44.5812 23.0273 44.6495 22.3242 45.1769 22.0605C45.4991 21.8945 47.6476 21.8848 47.9405 22.0508Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M42.8125 34.9902L42.5879 35.3613L42.5586 47.9785L42.5391 60.6055H53.5254H64.5117V48.0762V35.5469L64.2969 35.1172C64.0527 34.6387 64.0527 34.6387 63.2422 34.873C62.7832 35 61.4941 35.0195 53.4766 35.0195C44.6094 35.0098 44.2285 35.0098 43.7109 34.8242C43.418 34.7168 43.1445 34.6387 43.1055 34.6289C43.0762 34.6289 42.9395 34.7949 42.8125 34.9902ZM47.998 36.6309C48.6328 36.9531 48.4863 37.9199 47.7734 38.1055C47.6465 38.1348 47.0117 38.1445 46.3574 38.125C45.293 38.0957 45.1562 38.0762 44.9609 37.8809C44.6387 37.5586 44.668 37.0117 45.0195 36.7188C45.2637 36.5039 45.3613 36.4844 46.5039 36.4844C47.3828 36.4844 47.8027 36.5234 47.998 36.6309Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M16.5625 40.0488V43.125H22.4219H28.2812V40.0488V36.9727H22.4219H16.5625V40.0488ZM22.4219 40.5859V42.0508H20.6152H18.8086V40.5859V39.1211H20.6152H22.4219V40.5859ZM26.1328 40.5859V42.0508H24.8145H23.4961V40.5859V39.1211H24.8145H26.1328V40.5859Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
          className="svg-stroke"
        />
        <path
          d="M15.4883 45.5176V46.9336H28.5254H41.5625V45.5176V44.1016H28.5254H15.4883V45.5176Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M15.4883 54.7949V61.6797H28.5254H41.5625V54.7949V47.9102H28.5254H15.4883V54.7949Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M42.5391 63.0469V64.5117H44.4922H46.4453V63.0469V61.582H44.4922H42.5391V63.0469Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M47.4219 63.0469V64.5117H53.5742H59.7266V63.0469V61.582H53.5742H47.4219V63.0469Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M60.7031 63.0469V64.5117H62.6074H64.5117V63.0469V61.582H62.6074H60.7031V63.0469Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
        <path
          d="M16.6602 63.584V64.5117H29.1113H41.5625V63.584V62.6562H29.1113H16.6602V63.584Z"
          // fill="#374A75"
          fill={getCategoryFill("Civil / Plumbing", selectedCategory)}
        />
      </svg>
    ),
    Paint: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="roller hover:animate-paintPath transition-transform duration-700 ease-in-out"
      >
        <path
          d="M43.2769 15.2384C42.5737 15.5705 15.5034 42.6603 15.2104 43.3244C15.0737 43.6271 15.0054 43.9787 15.0054 44.4474C15.0054 45.6877 15.0542 45.756 18.9897 49.6916C22.8862 53.5978 22.9155 53.6076 24.1362 53.6076C25.4546 53.6076 24.3706 54.6037 39.4878 39.4865C54.605 24.3693 53.6089 25.4533 53.6089 24.1349C53.6089 22.9142 53.5991 22.8849 49.6929 18.9884C45.7573 15.0529 45.689 15.0041 44.4487 15.0041C43.9312 15.0041 43.6479 15.0627 43.2769 15.2384Z"
          // fill="#374A75"
          fill={getCategoryFill("Paint", selectedCategory)}
        />
        <path
          d="M50.0835 16.8887L49.5757 17.4062L50.4058 18.2266L51.2358 19.0469L51.7241 18.5684C51.9878 18.3047 52.2124 18.041 52.2124 17.9824C52.2124 17.8848 50.7476 16.3711 50.6401 16.3711C50.6206 16.3711 50.3667 16.6055 50.0835 16.8887Z"
          // fill="#374A75"
          fill={getCategoryFill("Paint", selectedCategory)}
        />
        <path
          d="M41.5188 42.9732C41.2551 43.0416 40.8645 43.1685 40.6497 43.2564C39.4876 43.7642 39.136 44.0865 32.2903 50.8931C26.929 56.2252 25.3958 57.6998 25.0149 57.8853C24.6145 58.0806 24.3704 58.1197 23.6965 58.1197C22.4661 58.1197 22.1829 57.9537 20.5129 56.3033C19.0481 54.8482 18.7747 54.4478 18.5989 53.5103C18.4915 52.9341 18.5891 52.3677 18.9212 51.5474L19.0579 51.2349L18.2473 50.4244L17.4368 49.6236L17.2512 49.8677C16.0696 51.4107 15.9622 54.0084 17.0169 55.8736C17.4172 56.5865 20.0344 59.2134 20.7864 59.6627C22.5051 60.6881 24.5657 60.7369 26.3821 59.7994C26.8704 59.5455 28.0715 58.4029 33.8528 52.6412C40.1028 46.4302 40.7962 45.7662 41.3723 45.483C41.7239 45.317 42.2122 45.1509 42.4563 45.1216C43.2376 45.0142 43.5501 45.19 44.8587 46.4791C45.513 47.1138 46.0794 47.6216 46.1282 47.6119C46.1672 47.5924 46.5383 47.231 46.9387 46.8111L47.6614 46.0494L46.3528 44.731C44.7122 43.0904 44.3997 42.9146 42.9837 42.8756C42.388 42.856 41.8118 42.8951 41.5188 42.9732Z"
          // fill="#374A75"
          fill={getCategoryFill("Paint", selectedCategory)}
        />
        <path
          d="M48.3745 48.3837C46.939 49.8192 45.7671 51.0399 45.7671 51.0887C45.7671 51.1473 48.7456 54.1649 52.3882 57.7977C59.8394 65.2489 59.4292 64.9071 60.9819 64.9852C62.2124 65.0536 63.1108 64.7313 63.9214 63.9208C64.7319 63.1102 65.0542 62.2118 64.9858 60.9813C64.9077 59.4286 65.2495 59.8387 57.7983 52.3778C54.1655 48.745 51.1479 45.7665 51.0894 45.7665C51.0308 45.7665 49.8198 46.9384 48.3745 48.3837Z"
          // fill="#374A75"
          fill={getCategoryFill("Paint", selectedCategory)}
        />
      </svg>
    ),
    Lux: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="lux-svg-wrapper"
      >
        <path
          d="M29.0854 16.4434V17.8789L29.6519 18.4258C31.1069 19.8027 33.9194 20.7988 37.3667 21.1699L38.4604 21.2871V24.666C38.4604 27.8691 38.4702 28.0645 38.6558 28.3672C38.939 28.8262 39.3979 29.0703 39.9741 29.0703C40.5796 29.0703 41.0776 28.8262 41.3608 28.3965C41.5854 28.0645 41.5854 28.0352 41.5854 24.6758V21.2871L42.689 21.1602C46.1362 20.7891 48.9097 19.8223 50.3257 18.4844L50.9604 17.8887V16.4434V15.0078H40.0229H29.0854V16.4434Z"
          // fill="#374A75"
          fill={getCategoryFill("Lux", selectedCategory)}
        />
        <path
          className="lux-sparkle"
          d="M19.2221 26.1016C18.2943 26.2871 17.0541 26.8828 16.4193 27.4492C15.8529 27.957 15.2963 28.9531 15.1205 29.7637C14.9252 30.6621 15.0424 32.6348 15.3647 33.709C16.019 35.9258 17.015 37.9082 18.685 40.3594C19.5346 41.5996 20.765 43.2305 20.8529 43.2305C20.8725 43.2305 21.2533 42.9082 21.6928 42.5176C22.1322 42.1367 22.6986 41.6484 22.9525 41.4434L23.4115 41.0625L22.601 40.0762C20.3744 37.3613 18.9291 34.7539 18.4897 32.6738C17.9428 30.0957 19.0463 28.3477 21.5072 27.8984C22.3471 27.7422 24.3295 27.8203 25.4233 28.0449C29.5248 28.8945 34.5736 31.3164 39.4955 34.7832C42.7182 37.0586 46.8197 40.8574 49.4467 44.002C49.8178 44.4414 50.1498 44.793 50.1889 44.793C50.2475 44.793 51.976 43.5723 52.7768 42.9668L53.06 42.752L52.3275 42.0293C51.2533 40.9746 49.3295 39.3047 47.8842 38.1719C47.1908 37.625 46.4584 37.0488 46.2729 36.9023C45.9506 36.6484 44.642 35.7012 43.7826 35.0957C36.9174 30.2812 29.5346 26.9512 23.8412 26.0918C22.6303 25.9062 20.1986 25.916 19.2221 26.1016Z"
          // fill="#374A75"
          fill={getCategoryFill("Lux", selectedCategory)}
        />
        <path
          className="lux-sparkle"
          d="M53.8902 29.2656C50.9313 29.6758 47.4742 30.5645 44.2711 31.7559C43.734 31.9512 43.2652 32.1465 43.2262 32.1855C43.1871 32.2148 43.568 32.5176 44.066 32.8398L44.9742 33.4355L45.7945 33.1035C48.2652 32.1074 51.3316 31.2383 53.568 30.916C55.3063 30.6621 57.8258 30.6914 58.8219 30.9746C60.15 31.3457 60.9801 31.9219 61.4586 32.791C61.859 33.5332 61.9176 34.7051 61.6051 35.7207C60.9508 37.8887 59.0172 40.4766 56.1363 43.0352C55.6871 43.4355 55.2281 43.8457 55.1109 43.9434C54.2906 44.6855 51.1559 46.8926 49.4957 47.8887C47.2594 49.2363 43.8317 50.9551 41.8297 51.7266C41.6637 51.7949 41.7027 51.834 42.1227 52.0195C43.4508 52.6055 46.6051 53.4844 47.3766 53.4844C47.5133 53.4844 47.9039 53.3086 48.2359 53.1035C48.5777 52.8887 49.1442 52.5371 49.4957 52.3223C50.609 51.6484 53.1481 49.832 54.6715 48.6113C59.9352 44.4023 63.3727 40.2617 64.6617 36.5605C64.9547 35.7207 64.9742 35.584 64.9742 34.2949V32.9277L64.6129 32.1855C63.8414 30.6035 62.152 29.5879 59.6813 29.2168C58.3531 29.0117 55.5602 29.041 53.8902 29.2656Z"
          // fill="#374A75"
          fill={getCategoryFill("Lux", selectedCategory)}
        />
        <path
          className="lux-sparkle"
          d="M35.0913 35.9363C24.769 41.6882 17.3862 48.5925 15.394 54.3933C15.1011 55.2331 15.0815 55.3796 15.0718 56.6589V58.0359L15.4429 58.7781C16.1069 60.1355 17.3569 61.0242 19.3687 61.5613C20.3062 61.8152 20.4526 61.8249 22.8354 61.8249C24.4272 61.8347 25.6284 61.7859 26.1558 61.7077C27.6987 61.4734 29.5151 61.1023 30.8433 60.7605C32.5034 60.3308 35.8237 59.2468 35.8237 59.1394C35.8237 59.0906 35.4136 58.7878 34.9253 58.4558C33.4214 57.4597 32.2202 56.6101 31.0972 55.7507C30.1694 55.0476 29.9937 54.9499 29.7495 54.9988C29.1831 55.1257 26.605 55.0671 25.8823 54.9109C23.9683 54.5105 23.0796 53.6413 23.0991 52.2156C23.1382 49.2566 27.6206 44.1784 34.4761 39.3445C35.1011 38.905 36.2437 38.1433 37.0151 37.655C37.7866 37.1765 38.4507 36.737 38.4897 36.698C38.5776 36.6101 36.7808 35.321 36.5073 35.2624C36.4292 35.2429 35.7944 35.5456 35.0913 35.9363Z"
          // fill="#374A75"
          fill={getCategoryFill("Lux", selectedCategory)}
        />
        <path
          d="M38.7925 41.7762C38.48 41.8934 38.0991 42.157 37.8061 42.45C36.2827 43.9637 36.7124 46.6004 38.6167 47.5379C39.31 47.8797 40.4233 47.9188 41.1948 47.6258C41.8686 47.3719 42.5425 46.7567 42.8745 46.0828C43.1968 45.4188 43.2358 44.2567 42.9624 43.5145C42.6792 42.782 41.9468 42.0399 41.2241 41.7664C40.5307 41.5125 39.476 41.5125 38.7925 41.7762Z"
          // fill="#374A75"
          fill={getCategoryFill("Lux", selectedCategory)}
        />
        <path
          className="lux-sparkle"
          d="M28.4995 47.3131C27.5816 48.2896 26.7124 49.3541 26.7612 49.4615C26.8198 49.608 28.7144 51.2682 30.2085 52.4791C32.8745 54.6373 35.6577 56.61 38.4507 58.2896C40.4722 59.5201 41.0191 59.8228 43.0991 60.8775C47.2691 62.9869 51.312 64.3834 54.6714 64.8717C56.0777 65.067 58.7046 65.0182 59.603 64.774C61.5952 64.2271 62.8745 63.0455 63.3237 61.3463C63.4995 60.7017 63.4995 59.0611 63.314 58.1236C62.8745 55.7896 61.3609 52.733 59.1343 49.6275C58.7437 49.1002 58.4019 48.6217 58.3726 48.5728C58.3335 48.5142 57.7866 48.9146 57.1519 49.4517C56.5073 49.9791 55.7066 50.6334 55.355 50.8971C55.0034 51.151 54.6812 51.3951 54.6421 51.4342C54.603 51.4732 54.7007 51.8053 54.8667 52.1764C55.4234 53.3971 55.6773 54.4127 55.687 55.4381C55.6968 56.2877 55.6773 56.4049 55.4136 56.8834C54.8472 57.8892 53.939 58.231 52.0347 58.1432C48.7925 57.9967 43.8511 56.0045 37.562 52.3228C35.2769 50.9752 31.2046 48.2017 29.6616 46.9225L29.2026 46.5514L28.4995 47.3131Z"
          // fill="#374A75"
          fill={getCategoryFill("Lux", selectedCategory)}
        />
      </svg>
    ),
    PartitionsCeilings: (
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="svg-wrapper"
      >
        <path
          d="M19.0078 18.1836C19.0078 18.2129 20.668 21.5527 22.6895 25.6055L26.3809 32.9785H40.0234H53.6758L57.3867 25.5566L61.0977 18.1348H40.0527C28.4805 18.1348 19.0078 18.1543 19.0078 18.1836ZM57.2793 20.7227C57.377 20.8301 57.4941 21.0156 57.5234 21.123C57.5723 21.2793 56.9473 22.6172 55.1602 26.2109C53.8125 28.8867 52.6406 31.1426 52.5527 31.2207C52.2891 31.4453 27.7188 31.4453 27.4551 31.2207C27.3672 31.1426 26.1953 28.8867 24.8477 26.2109C23.0508 22.5977 22.4355 21.2793 22.4844 21.123C22.5723 20.8301 22.8066 20.5957 23.0508 20.5469C23.1582 20.5273 30.873 20.5078 40.1699 20.5176C56.957 20.5273 57.0938 20.5273 57.2793 20.7227Z"
          // fill="#374A75"
          //
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M25.1602 23.6035L25.9414 25.166H32.582H39.2227V23.6035V22.041H31.8008H24.3789L25.1602 23.6035Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M40.7852 23.6035V25.166H47.4258H54.0664L54.8477 23.6035L55.6289 22.041H48.207H40.7852V23.6035Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M27.5039 28.291L28.2852 29.8535H33.7539H39.2227V28.291V26.7285H32.9727H26.7227L27.5039 28.291Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M40.7852 28.291V29.8535H46.2539H51.7227L52.5039 28.291L53.2852 26.7285H47.0352H40.7852V28.291Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M18.1382 40.8203C18.1285 52.4121 18.1675 61.8847 18.2066 61.8652C18.2554 61.8554 19.8375 60.6054 21.7222 59.1015L25.15 56.3672V45.039V33.7109L21.6441 26.7285L18.1382 19.7461V40.8203Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M58.3438 26.8257L54.8477 33.8764L54.8574 45.1264V56.3667L58.3242 59.1303C60.2383 60.6538 61.8203 61.8843 61.8398 61.855C61.8594 61.8354 61.8691 52.353 61.8594 40.7905L61.8301 19.7651L58.3438 26.8257Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
        />
        <path
          d="M26.7227 45.0879V55.6348H40.0039H53.2852V45.0879V34.541H40.0039H26.7227V45.0879Z"
          // fill="#374A75"
          fill={getCategoryFill("Partitions / Ceilings", selectedCategory)}
          className="svg-stroke"
        />
      </svg>
    ),
  };

  return (
    <>
      <div
        className={`categories flex flex-col pb-1.5 md:pb-3 ${
          minimizedView ? "px-6" : ""
        }`}
      >
        {/* Categories List */}
        <div
          className={`cat flex overflow-x-auto gap-1 md:gap-3  scrollbar-hide ${
            minimizedView ? "px-0 justify-between" : "pb-2 px-2 lg:px-5 "
          }`}
        >
          {/* === FULL VIEW === */}
          {!minimizedView && (
            <div className="flex flex-col items-center w-full px-2 py-2 ">
              {/* Scrollable container */}
              <div
                ref={containerRef}
                className={`flex flex-row gap-[21px] items-center py-2 relative overflow-hidden w-full swipe-cursor justify-around ${
                  currentPage < 1 ? "lg:justify-around" : "md:justify-start"
                }`}
              >
                {paginatedItems.map(({ id, category, subcategories }) => {
                  const isSelected = selectedCategory?.id === id;
                  const cleanedCategoryName = getCleanedCategoryName(category);
                  // const imageSrc = `/images/icons/${cleanedCategoryName}.png`;
                  const SvgIcon = categorySvgMap[cleanedCategoryName];

                  return (
                    <div
                      key={id}
                      onClick={() =>
                        handleCategoryClick(id, category, subcategories)
                      }
                      className="shrink-0 w-[72px] lg:w-28 h-[72px] lg:h-28 group transition-transform duration-[300ms] ease-in-out hover:scale-90 rounded-[10px]"
                    >
                      {/* Gradient border wrapper */}
                      <div className="p-[3px] rounded-[10px] bg-gradient-to-br from-[#334A78] to-[#68B2DC] h-full w-full">
                        <div
                          className={`flex flex-col hover:cursor-pointer items-center justify-around w-full h-full rounded-[10px] border shadow-[0_2px_6px_1px_rgba(0,0,0,0.5),_inset_0_2px_6px_0px_rgba(0,0,0,0.1)] ${
                            isSelected
                              ? "border-transparent text-white"
                              : "bg-white border-transparent text-[#252525]"
                          }`}
                        >
                          <div className="flex flex-row gap-2 items-center justify-center w-[50px]">
                            {/* <img
                              className="w-8 lg:w-[50px] h-8 lg:h-[50px] object-contain"
                              src={imageSrc}
                              alt={`${category} icon`}
                            /> */}
                            <div className="w-8 lg:w-[60px] h-8 lg:h-[60px] flex items-center justify-center">
                              {SvgIcon}
                            </div>
                          </div>
                          <div className=" text-center font-['Poppins-Regular',_sans-serif] text-[10px] lg:text-base leading-5 font-normal">
                            {category}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dot Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-3 gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${
                        index === currentPage ? "bg-[#334A78]" : "bg-[#D9D9D9]"
                      } transition-colors duration-300`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === MINIMIZED VIEW === */}
          {minimizedView &&
            categories.map(({ id, category, subcategories }) => {
              const cleanedCategoryName = getCleanedCategoryName(category);
              const isCategoryCompleted = checkIfCategoryCompleted(category);
              const isSelected = selectedCategory?.id === id;
              // const imageSrc = `/images/icons/${cleanedCategoryName}.png`;
              const SvgIcon = categorySvgMap[cleanedCategoryName];

              return (
                <div
                  key={id}
                  onClick={() =>
                    handleCategoryClick(id, category, subcategories)
                  }
                  className={`transition-transform duration-500 ease-in-out cursor-pointer ${
                    isSelected ? "scale-100" : "scale-95"
                  } px-0 py-1`}
                >
                  <div
                    className={`font-Poppins flex flex-col justify-center items-center text-xs gap-1 md:gap-2 md:mt-3 relative group`}
                  >
                    <div
                      className={` bg-[#fff] p-2 ${
                        isCategoryCompleted && isSelected
                          ? "shadow-[inset_6px_6px_12px_rgba(0,0,0,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.1)] bg-gradient-to-r from-[#334A78] to-[#68B2DC]"
                          : isCategoryCompleted
                          ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC] shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.3)]"
                          : isSelected
                          ? "bg-[#fff] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.8)] scale-105"
                          : "bg-[#fff] shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.8)] group-hover:scale-105"
                      } w-14 md:w-16 lg:w-20 h-14 md:h-16 lg:h-20 rounded-full flex justify-center items-center group-hover:scale-105 transition-transform duration-[1000ms] ease-in-out`}
                    >
                      {SvgIcon}
                    </div>
                    <div
                      className={`group-hover:visible ${
                        isSelected ? "visible" : "invisible"
                      } transition-all duration-[500ms] ease-in-out`}
                    >
                      <p>{category}</p>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* {categories.map(({ id, category, subcategories }) => {
            const cleanedCategoryName = getCleanedCategoryName(category);
            const isCategoryCompleted = checkIfCategoryCompleted(category); // Check if the category is completed
            const isSelected = selectedCategory?.id === id;
            const imageSrc = `/images/icons/${cleanedCategoryName}.png`;
            return (
              <div
                key={id}
                onClick={() => handleCategoryClick(id, category, subcategories)}
                className={`transition-transform duration-500 ease-in-out cursor-pointer ${
                  isSelected ? "scale-100" : "scale-95"
                } ${minimizedView ? "px-2 py-1" : "p-0"}`}
              >
                {!minimizedView && (
                  <div
                    className={` flex flex-row gap-[21px] top-1 items-center justify-start relative overflow-auto group`} // Added 'group' class here for hover effect
                  >
                    <div
                      className={`${
                        selectedCategory?.id === id
                          ? "bg-[#347ABF] bg-opacity-10 border-[#334A78]"
                          : "bg-[#ffffff] border-black"
                      } border-solid  border-2 flex flex-col gap-0 items-center justify-around rounded-lg shrink-0 w-28 h-28 relative group-hover:scale-90 transition-transform duration-[300ms] ease-in-out`} // Added hover effect here
                    >
                      <div className="flex flex-row gap-2 items-center justify-center shrink-0 w-[50px] relative">
                        <img
                          className="flex flex-col gap-2.5 items-start justify-start shrink-0 w-5 lg:w-[50px] h-5 lg:h-[50px] relative overflow-hidden"
                          src={imageSrc}
                          alt={`${category} icon`}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5 items-start justify-start shrink-0 relative overflow-hidden">
                        <div className="flex flex-row gap-2.5 items-center justify-center shrink-0 relative overflow-hidden">
                          <div className="text-[#252525] text-center font-['Poppins-Regular',_sans-serif] text-md leading-5 font-normal relative flex items-center justify-center">
                            {category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {minimizedView && (
                  <div
                    // className={` flex flex-row items-center justify-start relative group py-2`}
                    className={`font-Poppins flex flex-col justify-center items-center text-xs gap-1 md:gap-2 md:mt-3 relative group`}
                  >
                    <div
                      className={`border-2 ${
                        isCategoryCompleted && selectedCategory?.id === id
                          ? "shadow-[0_0_10px_#93FCEE] bg-[#34BFAD] animate-pulse"
                          : isCategoryCompleted
                          ? "border-[#f4f4f4] border-[1px] bg-[#34BFAD]  "
                          : selectedCategory?.id === id
                          ? "border-[#34BFAD] scale-110"
                          : "border-[#000000] "
                      }  w-14 md:w-16 h-14 md:h-16 rounded-full flex justify-center items-center group-hover:scale-105 transition-transform duration-[1000ms] ease-in-out`}
                    >
                      <img
                        // className="rounded-full w-[30px] h-[30px] object-contain"
                        className="w-7 md:w-10 h-7 md:h-10"
                        src={imageSrc}
                        alt={`${category} icon`}
                      />
                    </div>
                    <div
                      className={` group-hover:visible ${
                        selectedCategory.id === id ? "visible" : "invisible"
                      } transition-all duration-[500ms] ease-in-out`}
                    >
                      <p>{category}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })} */}
        </div>

        {/* Subcategories */}
        {selectedCategory && (
          <div className="md:mt-2 font-Poppins">
            {minimizedView && (
              <motion.div
                key={selectedCategory.category} // Ensures animation applies on category change
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="subcat  flex flex-row items-center justify-start overflow-auto scrollbar-hide py-1"
              >
                {selectedCategory?.subcategories
                  ?.filter(
                    (subCategory) =>
                      selectedCategory.category === "HVAC" // Apply logic only for HVAC
                        ? userResponses.hvacType === "Centralized"
                          ? subCategory === "Centralized" // Show only "Centralized"
                          : subCategory !== "Centralized" // Exclude "Centralized"
                        : true // Show all subcategories for non-HVAC categories
                  )
                  .map((subCategory, index) => {
                    const isCompleted = checkIfSubCategoryCompleted(
                      selectedCategory.category,
                      subCategory
                    );
                    return (
                      <motion.div
                        key={index}
                        onClick={() => setSelectedSubCategory(subCategory)}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className={`group rounded flex flex-row items-start justify-center shrink-0 mr-5 group hover:bg-[#E0F0FF] ${
                          isCompleted ? " bg-[#374A75]" : ""
                        } ${
                          selectedSubCategory === subCategory && !isCompleted
                            ? "bg-[#E0F0FF]"
                            : ""
                        }`}
                      >
                        <p
                          className={`relative text-[#252525] text-center text-xs md:text-sm flex items-center justify-center py-3 cursor-pointer group-hover:text-[#334A78] md:px-5 ${
                            isCompleted
                              ? "font-semibold text-[#fff]"
                              : "font-normal"
                          }`}
                        >
                          {subCategory}
                          <span
                            className={`absolute left-0 bottom-0 block w-0 h-1 bg-[#334A78] transition-all duration-300 ease-in-out ${
                              selectedSubCategory === subCategory
                                ? "w-full"
                                : "group-hover:w-full"
                            } ${
                              isCompleted
                                ? "bg-[#E0F0FF] group-hover:bg-[#334A78]"
                                : ""
                            }`}
                          ></span>
                        </p>
                      </motion.div>
                    );
                  })}
              </motion.div>
            )}

            {!minimizedView && (
              <AnimatePresence>
                <motion.div
                  key={selectedCategory.category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* <h3 className="text-base lg:text-lg font-semibold text-gray-800 lg:ms-5">
                    Subcategories of {selectedCategory.category}
                  </h3> */}

                  {/* <div className="subcat grid grid-cols-3 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 gap-5 mt-5 justify-center"> */}
                  <div className="subcat grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 justify-center">
                    {selectedCategory.subcategories
                      .filter(
                        (subCategory) =>
                          selectedCategory.category === "HVAC" // Apply logic only for HVAC
                            ? userResponses.hvacType === "Centralized"
                              ? subCategory === "Centralized" // Show only "Centralized"
                              : subCategory !== "Centralized" // Exclude "Centralized"
                            : true // Show all subcategories for non-HVAC categories
                      )
                      .map((subCategory, index) => {
                        const imageSrcSubCat = getImageSrcSubCat(
                          selectedCategory.category,
                          subCategory
                        );

                        return (
                          <motion.div
                            key={index}
                            onClick={() => setSelectedSubCategory(subCategory)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex flex-col items-center justify-evenly flex-wrap relative">
                              <div className="flex flex-col gap-1 lg:gap-[21px] items-center justify-center w-full relative cursor-pointer hover:scale-105 transition-transform duration-500 ease-in-out">
                                {/* <div className="relative w-[90px] md:w-[130px] lg:w-[160px] h-24 md:h-[130px] lg:h-[170px] flex items-center justify-center bg-gradient-to-r from-[#003442] to-[#34BFAD] rounded-3xl lg:rounded-[26px]"> */}
                                <div className="relative w-28 md:w-40 lg:w-52 h-28 md:h-40 lg:h-52 flex items-center justify-center bg-gradient-to-r from-[#334A78] to-[#347ABF] rounded-xl lg:rounded-[26px]">
                                  <img
                                    // className="rounded-2xl md:rounded-3xl w-[75px] md:w-[110px] lg:w-[150px] h-[80px] md:h-[115px] lg:h-[150px] object-cover"
                                    className="rounded-xl lg:rounded-3xl w-[102px] md:w-36 lg:w-48 h-[102px] md:h-36 lg:h-48 object-cover"
                                    src={imageSrcSubCat}
                                    alt={`${subCategory} subcategory`}
                                  />
                                </div>
                                <p className="text-[#444444] text-center font-Poppins text-[10px] md:text-[13px] lg:text-lg font-medium relative">
                                  {subCategory}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Categories;
