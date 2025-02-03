import { createContext, useContext, useEffect, useState, useRef } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const categoriesWithModal = ["Flooring", "HVAC"]; // Array of categories that should show the modal/questions when clicked

  const categoriesWithTwoLevelCheck = [
    "Flooring",
    "Partitions / Ceilings",
    "HVAC",
  ]; //Array of Categories where save data works on dependent subcategories

  const [totalArea, setTotalArea] = useState();
  const [inputValue, setInputValue] = useState("");
  const [totalAreaSource, setTotalAreaSource] = useState(""); // Track the source of updates
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  const [height, setHeight] = useState(10);

  const [selectedCategory, setSelectedCategory] = useState(null); //Gets value after data fetching
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); //Gets value after data fetching
  const [selectedSubCategory1, setSelectedSubCategory1] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]); // Extracted subcategories
  const [subCat1, setSubCat1] = useState([]);
  const [userResponses, setUserResponses] = useState({});

  const prevSelectedData = useRef(selectedData); // Ref to store previous selectedData
  const prevCategories = useRef(categories); // Ref to store previous categories
  const prevSubCat1 = useRef(subCat1); // Ref to store previous subCat1

  useEffect(() => {
    var temp = JSON.parse(localStorage.getItem("selectedData"));
    setSelectedData(temp);
  }, []);

  useEffect(() => {
    // Check if selectedData is valid and not empty
    if (selectedData && selectedData.length > 0) {
      // Save the data as a JSON string
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
    }
  }, [selectedData]);

  useEffect(() => {
    console.log("Progress: ", progress);
  }, []);

  useEffect(() => {
    console.log("userId: ", userId);
  }, [userId]);

  useEffect(() => {
    console.log("Selected Data: ", selectedData);
  }, [selectedData]);

  useEffect(() => {
    // Run only if there are actual changes in the data
    if (
      selectedData !== prevSelectedData.current ||
      categories !== prevCategories.current ||
      subCat1 !== prevSubCat1.current
    ) {
      handleProgressBar(selectedData, categories, subCat1);
      // Update refs to avoid redundant calls
      prevSelectedData.current = selectedData;
      prevCategories.current = categories;
      prevSubCat1.current = subCat1;
    }
  }, [selectedData, categories, subCat1]);

  function handleProgressBar(selectedData, categories, subCat1) {
    // Validate selectedData and categories to prevent errors
    if (!Array.isArray(selectedData) || selectedData.length === 0) {
      console.error("Invalid or empty selectedData.");
      setProgress(0); // Reset progress to 0 if no data
      return;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      console.error("Invalid or empty categories.");
      setProgress(0); // Reset progress to 0 if no categories
      return;
    }

    let totalProgress = 0;
    selectedData.forEach((item) => {
      const { category, subcategory, subcategory1 } = item;

      const categoryObj = categories.find((cat) => cat.category === category);
      if (!categoryObj) {
        console.error(`Category "${category}" not found.`);
        return;
      }

      const totalCategories = categories.length;
      const categoryPercentage = 100 / totalCategories;

      const subCategoryIndex = categoryObj.subcategories.indexOf(subcategory);
      if (subCategoryIndex === -1) {
        console.error(`Subcategory "${subcategory}" not found.`);
        return;
      }

      const subCategoryPercentage =
        categoryPercentage / categoryObj.subcategories.length;

      // Handle subCategory1 logic
      if (
        (subcategory1 &&
          subCat1[category] &&
          Array.isArray(subCat1[category]) &&
          category === "Furniture") ||
        category === "Smart Solutions" ||
        category === "Civil / Plumbing" ||
        category === "Lux"
      ) {
        //&& (category === 'Furniture' || category === 'Smart Solutions')
        // if (category === "Flooring") return;
        const subCategory1Index = subCat1[category].indexOf(subcategory1);
        if (subCategory1Index !== -1) {
          const subCategory1Percentage =
            subCategoryPercentage / subCat1[category].length;
          totalProgress += subCategory1Percentage;
        } else {
          console.error(`SubCategory1 "${subcategory1}" not found.`);
        }
      } else {
        totalProgress += subCategoryPercentage;
      }
    });

    // Ensure progress does not exceed 100%
    totalProgress = Math.min(totalProgress, 100);
    setProgress(Math.round(totalProgress * 100) / 100); // Round to 2 decimal places
  }

  return (
    <AppContext.Provider
      value={{
        totalArea,
        setTotalArea,
        inputValue,
        setInputValue,
        totalAreaSource,
        setTotalAreaSource,
        progress,
        setProgress,
        selectedData,
        setSelectedData,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        selectedSubCategory1,
        setSelectedSubCategory1,
        categories,
        setCategories,
        subCategories,
        setSubCategories,
        subCat1,
        setSubCat1,
        handleProgressBar,
        userId,
        setUserId,
        selectedAddons,
        setSelectedAddons,
        categoriesWithModal,
        height,
        setHeight,
        categoriesWithTwoLevelCheck,
        userResponses,
        setUserResponses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
