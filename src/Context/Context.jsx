import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import {
  fetchCategories,
  fetchRoomData,
  fetchCategoriesandSubCat1,
  fetchProductsData,
} from "../boq/utils/dataFetchers";
import processData from "../boq/utils/dataProcessor";
import { calculateTotalPrice } from "../boq/utils/productUtils";
import { calculateSeatCountTotals } from "../boq/utils/dataProcessor";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const session = supabase.storageKey;
  // const categoriesWithModal = ["Flooring", "HVAC"]; // Array of categories that should show the modal/questions when clicked

  // const categoriesWithTwoLevelCheck = [
  //   "Flooring",
  //   "Partitions / Ceilings",
  //   "HVAC",
  //   "Lighting",
  // ]; //Array of Categories where save data works on dependent subcategories

  // const naviagte = useNavigate();
  const searchQuery = "";
  // const priceRange = [1, 15000000];

  const [totalArea, setTotalArea] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [totalAreaSource, setTotalAreaSource] = useState(""); // Track the source of updates
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null); //Gets value after data fetching
  const [selectedSubCategory, setSelectedSubCategory] = useState(null); //Gets value after data fetching
  const [selectedSubCategory1, setSelectedSubCategory1] = useState(null);
  const [selectedData, setSelectedData] = useState(
    JSON.parse(localStorage.getItem("selectedData")) || []
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedProductView, setSelectedProductView] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]); // Extracted subcategories
  const [subCat1, setSubCat1] = useState([]);
  const [userResponses, setUserResponses] = useState({
    height: 10,
    flooring: "basicTiling",
    demolishTile: "no",
    hvacType: "Centralized",
  });
  // const [showProfile, setShowProfile] = useState(false);
  const [accountHolder, setAccountHolder] = useState({
    userId: "",
    email: "",
    phone: "",
    companyName: "",
    role: "",
    allowedCategory: [] || undefined,
    profileImage: null,
    location: "",
    boqName: "",
    address: [] || undefined,
  });
  const [selectedPlan, setSelectedPlan] = useState(
    sessionStorage.getItem("selectedPlan") || null
  );

  const prevSelectedData = useRef(selectedData); // Ref to store previous selectedData
  const prevCategories = useRef(categories); // Ref to store previous categories
  const prevSubCat1 = useRef(subCat1); // Ref to store previous subCat1

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  // const [defaultProduct, setDefaultProduct] = useState(true);

  const [productData, setProductData] = useState([]);
  const [areasData, setAreasData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);
  const [seatCountData, setSeatCountData] = useState([]);

  const [showRecommend, setShowRecommend] = useState(false);
  const [boqTotal, setBoqTotal] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentLayoutData, setCurrentLayoutData] = useState({});
  const [currentLayoutID, setCurrentLayoutID] = useState(
    sessionStorage.getItem("currentLayoutID")
  );

  const [cartItems, setCartItems] = useState([]);
  const [localcartItems, setLocalCartItems] = useState(
    JSON.parse(localStorage.getItem("cartitems")) || []
  );

  const [resfreshCartItens, SetRefreshCartItems] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 10000],
  });
  const [BOQTitle, setBOQTitle] = useState(
    sessionStorage.getItem("BOQTitle") || ""
  );
  const [BOQID, setBOQID] = useState(sessionStorage.getItem("BOQID") || "");

  const [formulaMap, setFormulaMap] = useState({});
  const [formulasLoading, setFormulasLoading] = useState(true);

  const [compare, setCompare] = useState([]);

  // ecommerce state
  const [mobilecouponname, setmobilecouponname] = useState("");
  const [disableApplycoupon, setDisableApplycoupon] = useState(false);
  const [orignalTotalPrice, setOriginalToalPrice] = useState(0);
  const [differenceInPrice, setDifferenceInPrice] = useState(0);
  const [carttotalPrice, setCartTotalPrice] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isSaveBOQ, setIsSaveBOQ] = useState(true);
  const [productQuantity, setProductQuantity] = useState({});
  function normalizeKey(subcategory) {
    return subcategory
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .replace("workstation", "")
      .replace("mdcabin", "md")
      .replace("managercabin", "manager")
      .replace("smallcabin", "small");
  }
  function normalizeObjectKeys(obj) {
    const normalized = {};
    Object.entries(obj).forEach(([key, value]) => {
      normalized[normalizeKey(key)] = value;
    });
    return normalized;
  }
  useEffect(() => {
    const newSeatCountData = normalizeObjectKeys(seatCountData);
    const newQuantityData = normalizeObjectKeys(quantityData);

    const allQuantities = {};

    subCategories.forEach((subcategory) => {
      const key = normalizeKey(subcategory);

      const categoryProducts = subCat1[selectedCategory?.category] || [];
      const productQuantities = {};

      // ✅ First check in selectedData
      const selectedItem = selectedData?.find(
        (item) =>
          item.category === selectedCategory?.category &&
          item.subcategory === subcategory
      );

      if (selectedItem) {
        categoryProducts.forEach((productName) => {
          if (productName === selectedItem.subcategory1) {
            // ✅ Only update the matched product
            productQuantities[productName] = selectedItem.quantity ?? 0;
          } else {
            // ✅ Preserve or recalc the others
            let value;
            if (
              selectedCategory?.category === "Furniture" &&
              productName === "Chair"
            ) {
              value = newSeatCountData[key] ?? newQuantityData[0][key] ?? 0;
            } else {
              value = newQuantityData[0][key] ?? 0;
            }

            // ✅ Special Furniture logic
            if (
              selectedCategory?.category === "Furniture" &&
              subcategory !== "Linear Workstation" &&
              subcategory !== "L-Type Workstation" &&
              subcategory !== "Md Cabin" &&
              subcategory !== "Manager Cabin" &&
              productName === "Chair"
            ) {
              value = value * (newQuantityData[0][key] ?? 1);
            }

            productQuantities[productName] = value;
          }
        });
      } else {
        categoryProducts.forEach((productName) => {
          let value;
          if (
            selectedCategory?.category === "Furniture" &&
            productName === "Chair"
          ) {
            value = newSeatCountData[key] ?? newQuantityData[0][key] ?? 0;
          } else {
            value = newQuantityData[0][key] ?? 0;
          }

          // ✅ Apply special Furniture logic
          if (
            selectedCategory?.category === "Furniture" &&
            subcategory !== "Linear Workstation" &&
            subcategory !== "L-Type Workstation" &&
            subcategory !== "Md Cabin" &&
            subcategory !== "Manager Cabin" &&
            productName === "Chair"
          ) {
            value = value * (newQuantityData[0][key] ?? 1);
          }

          productQuantities[productName] = value;
        });
      }

      // ✅ Split Md Cabin into Main + Visitor
      if (
        selectedCategory?.category === "Furniture" &&
        subcategory === "Md Cabin" &&
        "Chair" in productQuantities
      ) {
        const value = productQuantities["Chair"] ?? 0;

        // keep original Md Cabin value
        allQuantities["Md Cabin"] = productQuantities;

        const mainValue = value > 0 ? 1 : 0;
        const visitorValue = value > 0 ? value - 1 : 0;
        allQuantities["Md Cabin Main"] = { Chair: mainValue };
        allQuantities["Md Cabin Visitor"] = { Chair: visitorValue };
      } else if (
        selectedCategory?.category === "Furniture" &&
        subcategory === "Manager Cabin" &&
        "Chair" in productQuantities
      ) {
        const value = productQuantities["Chair"] ?? 0;

        // keep original Md Cabin value
        allQuantities["Manager Cabin"] = productQuantities;

        const mainValue = value > 0 ? 1 : 0;
        const visitorValue = value > 0 ? value - 1 : 0;
        allQuantities["Manager Cabin Main"] = { Chair: mainValue };
        allQuantities["Manager Cabin Visitor"] = { Chair: visitorValue };
      } else {
        allQuantities[subcategory] = productQuantities;
      }
    });

    setProductQuantity(allQuantities);
  }, [subCategories, seatCountData, quantityData, selectedCategory]);

  console.log(
    "Product Quantity:",
    productQuantity,
    "quantityData",
    quantityData[0],
    "seatCountData",
    seatCountData,
    categories,
    subCategories
  );

  const handleBOQTitleChange = (title) => {
    if (isSaveBOQ) setBOQTitle(title);
    else console.log("Not allowed to change BOQ Title");
  };

  const fetchFormulas = async () => {
    setFormulasLoading(true);

    const { data, error } = await supabase.from("formulas").select("*");

    if (error) {
      console.error("Error fetching formulas:", error);
    } else {
      const map = {};

      data.forEach((row) => {
        map[row.category] = {
          formula: row.formula,
          description: row.description ?? "",
          // you can include more fields if needed
        };
      });

      setFormulaMap(map); // ✅ Store full object instead of just string
    }

    setFormulasLoading(false);
  };

  // 🟢 Fetch once on load
  useEffect(() => {
    fetchFormulas();
  }, []);

  useEffect(() => {
    const items = { BOQID, BOQTitle, selectedPlan, currentLayoutID };

    Object.entries(items).forEach(([key, value]) => {
      if (value) sessionStorage.setItem(key, value);
    });
  }, [BOQID, BOQTitle, selectedPlan, currentLayoutID]);

  const handleUpdateBOQ = async (boqId) => {
    if (!boqId) return;
    try {
      const payload = {};

      if (selectedData.length > 0) {
        payload.products = selectedData.map((p) => ({
          id: p.product_variant?.variant_id,
          title: p.product_variant?.variant_title,
          finalPrice: p.finalPrice || "",
          groupKey: p.groupKey,
          quantity: p.quantity,
        }));
        payload.addons = selectedData.flatMap((product) =>
          (product.addons || []).map((addon) => ({
            variantId: addon.id,
            addonId: addon.addonid,
            title: addon.title,
            finalPrice: addon.price || "",
            productId: product.product_variant?.variant_id,
          }))
        );
      }

      if (Object.values(userResponses).some((v) => v)) {
        payload.answers = [userResponses];
      }

      if (selectedPlan) {
        payload.planType = selectedPlan;
      }

      if (boqTotal !== null && boqTotal !== undefined) {
        payload.boqTotalPrice = boqTotal;
      }

      if (Object.keys(payload).length === 0) return;

      const { error } = await supabase
        .from("boq_data_new")
        .update(payload)
        .eq("id", boqId);

      if (error) {
        console.error(error);
      } else {
        console.log("Auto-saved draft BOQ");
      }
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!BOQID && !BOQTitle) return;
    handleUpdateBOQ(BOQID);
  }, [selectedPlan, selectedData, userResponses, boqTotal]);

  async function getCartItems() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) return [];

      const { data, error } = await supabase
        .from("userProductCollection")
        .select("*,productId(*)")
        .eq("userId", user.id);

      if (error) throw new Error(error);

      //  If there's no data or it's empty, set empty states and return early
      if (!data || data.length === 0) {
        setCartItems([]);
        setWishlistItems([]);
        return;
      }

      // 1. Extract unique image names
      const uniqueImages = [
        ...new Set(data.map((item) => item.productId.image)),
      ];

      // 2. Generate signed URLs from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls(uniqueImages, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URLs:", signedUrlError);
        return;
      }

      // 3. Create a map from image name to signed URL
      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      // 4. Replace image names with URLs in the array
      const updatedProducts = data.map((item) => ({
        ...item,
        productId: {
          ...item.productId,
          image: urlMap[item.productId.image] || item.productId.image,
        },
      }));

      //for safety even if a product is added multiple times it will get filtered into one
      const uniquecartitems = [
        ...new Map(
          updatedProducts.map((item) => [item.productId.id, item])
        ).values(),
      ];
      const cartProducts = uniquecartitems.filter(
        (item) => item.type === "cart"
      );
      const wishlistProducts = uniquecartitems.filter(
        (item) => item.type === "wishlist"
      );
      setCartItems(cartProducts);
      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCartItems();
  }, [resfreshCartItens]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, productsData, roomDataResult, subCategory1Data] =
          await Promise.all([
            fetchCategories(),
            fetchProductsData(),
            fetchRoomData(userId, currentLayoutID),
            fetchCategoriesandSubCat1(),
          ]);

        setCategories(categoriesData); // Remove 0 quantity subcategories

        setProductData(productsData);

        var processedQuantityData = {};
        var processedAreasData = {};

        if (roomDataResult.layoutData && roomDataResult.layoutData.length > 0) {
          setTotalArea(roomDataResult.layoutData[0]?.totalArea);
          setCurrentLayoutData(roomDataResult.layoutData[0]);

          const baseSeatCount = roomDataResult.layoutData[0].seatCount;
          const seatCountWithTotals = {
            ...baseSeatCount,
            ...calculateSeatCountTotals(baseSeatCount),
          };

          setSeatCountData(seatCountWithTotals);

          processedQuantityData = processData(
            roomDataResult.layoutData,
            "quantity"
          );
          if (processedQuantityData) {
            setQuantityData([processedQuantityData]);
          }

          processedAreasData = processData(
            roomDataResult.layoutData,
            "areas",
            roomDataResult.layoutData
          );
          if (processedAreasData) {
            setAreasData([processedAreasData]);
          }
        }

        // ✅ Fix: Check if they are undefined before accessing length
        if (
          (processedQuantityData &&
            Object.keys(processedQuantityData).length > 0) ||
          (processedAreasData && Object.keys(processedAreasData).length > 0)
        ) {
          categoriesData.forEach((category) => {
            category.subcategories = category.subcategories.filter(
              (subcategory) => {
                // Normalize the strings for comparison
                const normalize = (str) =>
                  str.toLowerCase().replace(/[^a-z0-9]/g, ""); //output of "Civil / Plumbing" => "civilplumbing"
                const subcategoryKey = normalize(subcategory);

                // Skip filtering if the category is not "Furniture"
                const ignoreCat =
                  normalize(category.category) === "civilplumbing";
                if (ignoreCat) {
                  return true;
                }

                // Get the room data from quantityData
                const roomCount = processedQuantityData || {};

                // Handle Meeting Room Large and Meeting Room
                const meetingRoomLargeQuantity =
                  roomCount["meetingroomlarge"] || 0;
                const meetingRoomQuantity = roomCount["meetingroom"] || 0;

                if (subcategoryKey === "meetingroomlarge") {
                  if (meetingRoomLargeQuantity === 0) return false;
                  return true;
                }

                if (
                  subcategoryKey === "meetingroom" &&
                  meetingRoomLargeQuantity === 0
                ) {
                  if (meetingRoomQuantity === 0) return false;
                  return true;
                }

                // General logic: check the quantity of the subcategory or matching base room key
                const baseRoomKey = Object.keys(roomCount).find((roomKey) => {
                  const normalizedRoomKey = normalize(roomKey);
                  return (
                    subcategoryKey === normalizedRoomKey ||
                    subcategoryKey.includes(normalizedRoomKey)
                  );
                });

                if (!baseRoomKey || roomCount[baseRoomKey] === 0) {
                  return false;
                }

                return true;
              }
            );
          });

          setCategories(categoriesData);
          handleCategorySelection(categoriesData[0]);
          setSelectedSubCategory(categoriesData[0].subcategories[0] || null);
        }

        setSubCat1(subCategory1Data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if ((userId, currentLayoutID)) {
      loadData();
    }
  }, [userId, currentLayoutID]);

  useEffect(() => {
    if (selectedPlan !== "Custom") {
      setUserResponses((prevResponses) => ({
        ...prevResponses,
        hvacType: "Centralized",
        flooring: "basicTiling",
        demolishTile: "no",
      }));

      if (selectedCategory?.category === "HVAC") {
        setSelectedSubCategory("Centralized");
      }
    }
  }, [selectedPlan]); // On Plan change subCat not updating proeprly for HVAC

  useEffect(() => {
    // Check if selectedData is valid and not empty
    if (selectedData && selectedData.length > 0) {
      // Save the data as a JSON string
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
    }
  }, [selectedData]);

  useEffect(() => {
    async function fetchdata() {
      const sessionData = JSON.parse(sessionStorage.getItem(session));

      // const usertoken = localStorage.getItem("usertoken");
      const usertoken = sessionData?.access_token;

      if (!usertoken) {
        setIsAuthenticated(false); // Set auth to false if no token
        setIsAuthLoading(false);
        // naviagte("/");
      }
      if (usertoken) {
        const { data, error } = await supabase.auth.getUser(usertoken);
        if (error) {
          console.warn("Error fetching user:", error);
          setIsAuthenticated(false); // Set auth to false if no token
          setIsAuthLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (selectedCategory) {
      // Find the category object matching the selected category ID
      const category = categories.find((cat) => cat.id === selectedCategory.id);

      // Update the subcategories state
      if (category) {
        setSubCategories(category.subcategories || []);
      }
    } else {
      setSubCategories([]); // Reset subcategories if no category is selected
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    // Automatically select the first subcategory when the category changes
    if (subCat1 && selectedCategory?.category) {
      const subCategories = subCat1[selectedCategory.category];
      if (subCategories && subCategories.length > 0) {
        setSelectedSubCategory1(subCategories[0]); // Set the first subcategory as the default
      } else {
        setSelectedSubCategory1(null);
      }
    }
  }, [subCat1, selectedCategory]);

  useEffect(() => {
    // Prevent handleProgressBar if subCat1 is undefined
    if (
      !subCat1 || // 🚀 Prevent call if subCat1 is undefined
      !Array.isArray(categories) ||
      categories.length === 0 ||
      !Array.isArray(selectedData) ||
      selectedData.length === 0
    ) {
      return;
    }

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
          .select(
            "phone, company_name,role,allowed_category,profile_image,location,address"
          )
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
          location: data.location || "",
          address: JSON.parse(data.address) || [],
        });
      }
    } catch (error) {
      console.warn("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile & Tablet: < 768px
    };
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategorySelection = (categoryData) => {
    setSelectedCategory(categoryData);
  };

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
        console.log(`Category "${category}" not found.`);
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
          subCat1 &&
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
        if (category === "Furniture" && subcategory === "Md Cabin") {
          const mainFilled = selectedData.some(
            (item) =>
              item.category === "Furniture" &&
              item.subcategory === "Md Cabin Main" &&
              item.subcategory1 === "Chair"
          );
          const visitorFilled = selectedData.some(
            (item) =>
              item.category === "Furniture" &&
              item.subcategory === "Md Cabin Visitor" &&
              item.subcategory1 === "Chair"
          );

          // ✅ Only exclude Chair if both Main & Visitor are filled
          if (mainFilled && visitorFilled) {
            validSubCat1List = validSubCat1List.filter(
              (item) => item !== "Chair"
            );
          }
        }

        if (category === "Furniture" && subcategory === "Manager Cabin") {
          const mainFilled = selectedData.some(
            (item) =>
              item.category === "Furniture" &&
              item.subcategory === "Manager Cabin Main" &&
              item.subcategory1 === "Chair"
          );
          const visitorFilled = selectedData.some(
            (item) =>
              item.category === "Furniture" &&
              item.subcategory === "Manager Cabin Visitor" &&
              item.subcategory1 === "Chair"
          );

          if (mainFilled && visitorFilled) {
            validSubCat1List = validSubCat1List.filter(
              (item) => item !== "Chair"
            );
          }
        }

        if (
          category === "Furniture" &&
          (subcategory === "Reception" ||
            subcategory === "Pantry" ||
            subcategory === "Breakout Room")
        ) {
          validSubCat1List = validSubCat1List.filter(
            (item) => item !== "Storage"
          );
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

  function multiplyFirstTwoFlexible(dimStr) {
    const [a = NaN, b = NaN] = String(dimStr)
      .split(/[,\sxX*]+/) // comma / space / x / * as separators
      .map((s) => parseFloat(s.trim()));

    return Number.isFinite(a) && Number.isFinite(b) ? Number(a * b) : null;
  }

  const handelSelectedData = (
    product,
    category,
    subCat,
    subcategory1,
    isChecked,
    productQuantity
  ) => {
    if (!product) return;

    const groupKey = `${category.category}-${subCat}-${subcategory1}-${product.id}`;

    setSelectedData((prevData) => {
      const validPrevData = Array.isArray(prevData) ? prevData : [];

      if (!isChecked) {
        // ❌ Remove the product when unchecked
        const updatedData = validPrevData.filter(
          (item) => item.groupKey !== groupKey
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

      // 🔍 Check if the product already exists
      const existingProduct = validPrevData.find(
        (item) => item.groupKey === groupKey
      );

      let calQty = 0;

      if (
        (category.category === "Civil / Plumbing" && subcategory1 === "Tile") ||
        (category.category === "Flooring" && subcategory1 !== "Epoxy")
      ) {
        console.log(subcategory1, subCat);

        calQty = Math.ceil(
          +areasData[0][normalizeKey(subCat)] /
            multiplyFirstTwoFlexible(product?.dimensions)
        );
      } else {
        calQty = productQuantity[subCat]?.[selectedSubCategory1];
      }

      const productData = {
        groupKey,
        id: product.id,
        category: category.category,
        subcategory: subCat,
        subcategory1,
        product_variant: {
          variant_title: product.title,
          variant_image: product.image,
          variant_details: product.details,
          variant_price: product.price,
          variant_id: product.id,
          additional_images: JSON.parse(product.additional_images || "[]"),
        },
        // 🔥 Preserve existing addons if the product exists
        addons: existingProduct ? existingProduct.addons : selectedAddons || [],
        finalPrice:
          category.category === "Flooring" ||
          category.category === "HVAC" ||
          category.category === "Lighting" ||
          (category.category == "Civil / Plumbing" &&
            subcategory1 === "Tile") ||
          category.category === "Partitions / Ceilings" ||
          category.category === "Paint"
            ? calculateTotalPrice(
                category.category,
                subCat,
                subcategory1,
                null, // selectedCategory is not used in this specific calculation, using direct category parameter instead.
                null, // selectedSubCategory is not used in this specific calculation, using direct subCat parameter instead.
                null, // selectedSubCategory1 is not used in this specific calculation, using direct subcategory1 parameter instead.
                quantityData,
                areasData,
                userResponses,
                selectedProductView,
                formulaMap,
                seatCountData
              )
            : category.category === "Furniture" &&
              subcategory1 === "Chair" &&
              (subCat === "Md Cabin Main" || subCat === "Md Cabin Visitor")
            ? product.price *
              (productQuantity[subCat]?.[selectedSubCategory1] ?? 0) *
              (quantityData[0]["md"] ?? 1)
            : category.category === "Furniture" &&
              subcategory1 === "Chair" &&
              (subCat === "Manager Cabin Main" ||
                subCat === "Manager Cabin Visitor")
            ? product.price *
              (productQuantity[subCat]?.[selectedSubCategory1] ?? 0) *
              (quantityData[0]["manager"] ?? 1)
            : product.price *
              (productQuantity[subCat]?.[selectedSubCategory1] ?? 0),
        quantity:
          category.category === "Furniture" &&
          subcategory1 === "Chair" &&
          (subCat === "Md Cabin Main" || subCat === "Md Cabin Visitor")
            ? calQty * (quantityData[0]["md"] ?? 1)
            : category.category === "Furniture" &&
              subcategory1 === "Chair" &&
              (subCat === "Manager Cabin Main" ||
                subCat === "Manager Cabin Visitor")
            ? calQty * (quantityData[0]["manager"] ?? 1)
            : calQty,
      };

      if (existingProduct) {
        // 🛠 Replace the existing product while keeping the previous addons
        const updatedData = validPrevData.map((item) =>
          item.groupKey === groupKey ? productData : item
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

      // ➕ Add a new product if it doesn't exist
      const updatedData = [...validPrevData, productData];
      localStorage.setItem("selectedData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

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
        // categoriesWithModal,
        // categoriesWithTwoLevelCheck,
        userResponses,
        setUserResponses,
        // showProfile,
        // setShowProfile,
        isAuthenticated,
        setIsAuthenticated,
        isAuthLoading,
        accountHolder,
        setAccountHolder,
        selectedPlan,
        setSelectedPlan,
        // defaultProduct,
        // setDefaultProduct,
        setIsAuthLoading,
        setLoading,
        loading,
        // layoutImgRef,
        // layoutImage,
        // setLayoutImage,
        productData,
        setProductData,
        areasData,
        setAreasData,
        quantityData,
        setQuantityData,
        handleCategorySelection,
        handelSelectedData,
        selectedProductView,
        setSelectedProductView,
        showRecommend,
        setShowRecommend,
        searchQuery,
        // priceRange,
        boqTotal,
        setBoqTotal,
        isMobile,
        setIsMobile,
        currentLayoutData,
        setCurrentLayoutData,
        currentLayoutID,
        setCurrentLayoutID,
        cartItems,
        setCartItems,
        SetRefreshCartItems,
        getCartItems,
        wishlistItems,
        setWishlistItems,
        localcartItems,
        setLocalCartItems,
        fetchUserData,
        filters,
        setFilters,
        compare,
        setCompare,
        mobilecouponname,
        setmobilecouponname,
        disableApplycoupon,
        setDisableApplycoupon,
        orignalTotalPrice,
        setOriginalToalPrice,
        differenceInPrice,
        setDifferenceInPrice,
        carttotalPrice,
        setCartTotalPrice,
        showLoginPopup,
        setShowLoginPopup,
        formulaMap,
        formulasLoading,
        BOQTitle,
        setBOQTitle: handleBOQTitleChange,
        BOQID,
        setBOQID,
        refetchFormulas: fetchFormulas,
        selectedClient,
        setSelectedClient,
        setIsSaveBOQ,
        seatCountData,
        setSeatCountData,
        productQuantity,
        setProductQuantity,
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
