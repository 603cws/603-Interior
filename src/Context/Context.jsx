import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const session = supabase.storageKey;
  const categoriesWithModal = ["Flooring", "HVAC"]; // Array of categories that should show the modal/questions when clicked

  const categoriesWithTwoLevelCheck = [
    "Flooring",
    "Partitions / Ceilings",
    "HVAC",
    "Lighting",
  ]; //Array of Categories where save data works on dependent subcategories

  const [totalArea, setTotalArea] = useState();
  const [inputValue, setInputValue] = useState("");
  const [totalAreaSource, setTotalAreaSource] = useState(""); // Track the source of updates
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  const [height, setHeight] = useState(10);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null); //Gets value after data fetching
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); //Gets value after data fetching
  const [selectedSubCategory1, setSelectedSubCategory1] = useState(null);
  const [selectedData, setSelectedData] = useState(
    JSON.parse(localStorage.getItem("selectedData")) || []
  );
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]); // Extracted subcategories
  const [subCat1, setSubCat1] = useState([]);
  const [userResponses, setUserResponses] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [accountHolder, setAccountHolder] = useState({
    userId: "",
    email: "",
    phone: "",
    companyName: "",
    role: "",
    allowedCategory: [] || undefined,
    profileImage: null,
  });
  // const [accountHolder, setAccountHolder] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const prevSelectedData = useRef(selectedData); // Ref to store previous selectedData
  const prevCategories = useRef(categories); // Ref to store previous categories
  const prevSubCat1 = useRef(subCat1); // Ref to store previous subCat1

  // auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [defaultProduct, setDefaultProduct] = useState(true);

  // get the totalarea based on current layout id
  useEffect(() => {
    const currentLayoutID = localStorage.getItem("currentLayoutID");

    const fetchdata = async () => {
      try {
        if (currentLayoutID) {
          // get the layout details from the supabase
          const { data, error } = await supabase
            .from("layout")
            .select()
            .eq("id", currentLayoutID); // Filter by userId

          console.log("layout details from context ", data);
          setTotalArea(data[0].totalArea);
          console.log(totalArea);

          if (error) throw error;
        }
      } catch (error) {}
    };

    fetchdata();
  }, []);

  // useEffect(() => {
  //   var temp = JSON.parse(localStorage.getItem("selectedData")) || [];
  //   setSelectedData(temp);
  // }, []);

  useEffect(() => {
    // Check if selectedData is valid and not empty
    if (selectedData && selectedData.length > 0) {
      // Save the data as a JSON string
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
    }
  }, [selectedData]);

  useEffect(() => {
    console.log("Progress: ", progress);
  }, [progress]);

  useEffect(() => {
    console.log("userId: ", userId);

    async function fetchdata() {
      const sessionData = JSON.parse(localStorage.getItem(session));
      // const usertoken = localStorage.getItem("usertoken");
      const usertoken = sessionData?.access_token;

      if (!usertoken) {
        setIsAuthenticated(false); // Set auth to false if no token
        setIsAuthLoading(false);
      }
      if (usertoken) {
        const { data, error } = await supabase.auth.getUser(usertoken);
        if (error) {
          console.warn("Error fetching user:", error);
          return null;
        }

        if (data) {
          setUserId(data.user.id);
          setIsAuthenticated(true);
          setIsAuthLoading(false);
        }
      }
    }

    fetchdata();
    // setUserId(userId);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isAuthenticated) {
          // Retrieve the currently authenticated user
          const {
            data: { user },
            error: authError,
          } = await supabase.auth.getUser();

          if (authError) throw authError;
          if (!user) return;

          // Extract user ID and email from authentication
          const userId = user.id;
          const userEmail = user.email;

          // Query the profiles table for phone and companyName
          const { data, error: profileError } = await supabase
            .from("profiles")
            .select("phone, company_name,role,allowed_category,profile_image")
            .eq("id", userId)
            .single();

          if (profileError) throw profileError;

          // Update state with user details
          // setAccountHolder({
          //   userId,
          //   email: userEmail,
          //   phone: profileError ? "" : data.phone || "",
          //   companyName: profileError ? "" : data.company_name || "",
          //   role: profileError ? "" : data.role || "",
          // });
          // Update state with user details
          setAccountHolder({
            userId,
            email: userEmail,
            phone: data.phone || "",
            companyName: data.company_name || "",
            role: data.role || "",
            allowedCategory: JSON.parse(data.allowed_category) || undefined,
            profileImage: data.profile_image || null,
          });
        }
      } catch (error) {
        console.warn("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);
  console.log("current user", accountHolder);

  function handleProgressBar(selectedData, categories, subCat1) {
    // Validate selectedData and categories to prevent errors
    if (!Array.isArray(selectedData) || selectedData.length === 0) {
      console.warn("Invalid or empty selectedData.");
      setProgress(0);
      return;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      console.warn("Invalid or empty categories.");
      setProgress(0);
      return;
    }

    let totalProgress = 0;
    selectedData.forEach((item) => {
      const { category, subcategory, subcategory1 } = item;

      const categoryObj = categories.find((cat) => cat.category === category);
      if (!categoryObj) {
        console.warn(`Category "${category}" not found.`);
        return;
      }

      const totalCategories = categories.length;
      const categoryPercentage = 100 / totalCategories;

      const subCategoryIndex = categoryObj.subcategories.indexOf(subcategory);
      if (subCategoryIndex === -1) {
        console.warn(`Subcategory "${subcategory}" not found.`);
        return;
      }

      let validSubcategories = categoryObj.subcategories;

      // ✅ Special Logic for HVAC category
      if (category === "HVAC") {
        if (subcategory === "Centralized") {
          validSubcategories = ["Centralized"]; // Only Centralized should be counted
        } else {
          validSubcategories = categoryObj.subcategories.filter(
            (sub) => sub !== "Centralized"
          ); // Exclude Centralized for Combination
        }
      }

      const subCategoryPercentage =
        categoryPercentage / validSubcategories.length;

      // Handle subCategory1 logic with exclusion for "pods" in "Pantry"
      if (
        (subcategory1 &&
          subCat1[category] &&
          Array.isArray(subCat1[category]) &&
          category === "Furniture") ||
        category === "Smart Solutions" ||
        category === "Civil / Plumbing" ||
        category === "Lux" ||
        category === "Paint"
      ) {
        let validSubCat1List = subCat1[category];

        // Exclude "pods" when subcategory is "Pantry" under "Civil / Plumbing"
        if (category === "Civil / Plumbing" && subcategory === "Pantry") {
          validSubCat1List = validSubCat1List.filter((item) => item !== "Pods");
        }

        const subCategory1Index = validSubCat1List.indexOf(subcategory1);
        if (subCategory1Index !== -1) {
          const subCategory1Percentage =
            subCategoryPercentage / validSubCat1List.length;
          totalProgress += subCategory1Percentage;
        } else {
          console.warn(`SubCategory1 "${subcategory1}" not found or excluded.`);
        }
      } else {
        totalProgress += subCategoryPercentage;
      }
    });

    // Ensure progress does not exceed 100%
    totalProgress = Math.min(totalProgress, 100);
    setProgress(Math.round(totalProgress * 100) / 100);
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
        showProfile,
        setShowProfile,
        isAuthenticated,
        setIsAuthenticated,
        isAuthLoading,
        accountHolder,
        setAccountHolder,
        selectedPlan,
        setSelectedPlan,
        defaultProduct,
        setDefaultProduct,
        setIsAuthLoading,
        setLoading,
        loading,
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
