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
import { numOfCoats } from "../constants/constant";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const session = supabase.storageKey;
  const searchQuery = "";
  const [totalArea, setTotalArea] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [totalAreaSource, setTotalAreaSource] = useState("");
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubCategory1, setSelectedSubCategory1] = useState(null);
  const [selectedData, setSelectedData] = useState(
    JSON.parse(localStorage.getItem("selectedData")) || []
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedProductView, setSelectedProductView] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCat1, setSubCat1] = useState([]);
  const [userResponses, setUserResponses] = useState({
    height: 10,
    flooring: "basicTiling",
    demolishTile: "no",
    hvacType: "Centralized",
  });
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

  const prevSelectedData = useRef(selectedData);
  const prevCategories = useRef(categories);
  const prevSubCat1 = useRef(subCat1);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
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

  const [refreshCartItens, SetRefreshCartItems] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 10000],
    brands: [],
  });
  const [BOQTitle, setBOQTitle] = useState(
    sessionStorage.getItem("BOQTitle") || ""
  );
  const [BOQID, setBOQID] = useState(sessionStorage.getItem("BOQID") || "");
  const [formulaMap, setFormulaMap] = useState({});
  const [formulasLoading, setFormulasLoading] = useState(true);
  const [compare, setCompare] = useState([]);
  const [mobileCouponName, setMobileCouponName] = useState("");
  const [disableApplyCoupon, setDisableApplyCoupon] = useState(false);
  const [orignalTotalPrice, setOriginalTotalPrice] = useState(0);
  const [differenceInPrice, setDifferenceInPrice] = useState(0);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isSaveBOQ, setIsSaveBOQ] = useState(true);
  const [productQuantity, setProductQuantity] = useState({});
  const [allProductQuantities, setAllProductQuantities] = useState({});
  const [pendingProduct, setPendingProduct] = useState(() => {
    const stored = sessionStorage.getItem("addToWishlistProduct");
    return stored ? JSON.parse(stored) : null;
  });
  const [categoryConfig, setCategoryConfig] = useState(null);

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
    async function fetchConfig() {
      const { data, error } = await supabase
        .from("category_config")
        .select("config_data");

      if (error) {
        console.error(error);
      } else {
        setCategoryConfig(data?.[0]?.config_data || {});
      }
    }
    fetchConfig();
  }, []);

  const updateCategoryConfig = async (newConfig) => {
    setCategoryConfig(newConfig);
    const { error } = await supabase
      .from("category_config")
      .update({ config_data: newConfig, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) {
      console.error("Error updating config:", error);
    }
  };

  useEffect(() => {
    const newSeatCountData = normalizeObjectKeys(seatCountData);
    const newQuantityData = normalizeObjectKeys(quantityData);
    const allQuantities = {};

    subCategories.forEach((subcategory) => {
      const key = normalizeKey(subcategory);
      const categoryProducts = subCat1[selectedCategory?.category] || [];
      const productQuantities = {};

      const selectedItem = selectedData?.find(
        (item) =>
          item.category === selectedCategory?.category &&
          item.subcategory === subcategory
      );

      if (selectedItem) {
        categoryProducts.forEach((productName) => {
          if (productName === selectedItem.subcategory1) {
            productQuantities[productName] = selectedItem.quantity ?? 0;
          } else {
            let value;
            if (
              selectedCategory?.category === "Furniture" &&
              productName === "Chair"
            ) {
              value = newSeatCountData[key] ?? newQuantityData[0][key] ?? 0;
            } else {
              value = newQuantityData[0][key] ?? 0;
            }

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

      if (
        selectedCategory?.category === "Furniture" &&
        subcategory === "Md Cabin" &&
        "Chair" in productQuantities
      ) {
        const value = productQuantities["Chair"] ?? 0;

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

    const globalQuantities = {};

    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        const key = normalizeKey(subcategory);

        if (!globalQuantities[subcategory]) {
          globalQuantities[subcategory] = {};
        }

        const products = category.subcategory1 || [];

        products.forEach((productName) => {
          let value;

          if (category.category === "Furniture" && productName === "Chair") {
            value = newSeatCountData[key] ?? newQuantityData[0][key] ?? 0;
          } else {
            value = newQuantityData[0][key] ?? 0;
          }

          if (
            category.category === "Furniture" &&
            ![
              "Linear Workstation",
              "L-Type Workstation",
              "Md Cabin",
              "Manager Cabin",
            ].includes(subcategory) &&
            productName === "Chair"
          ) {
            value = value * (newQuantityData[0][key] ?? 1);
          }

          globalQuantities[subcategory][productName] = value;

          if (
            category.category === "Furniture" &&
            ["Md Cabin", "Manager Cabin"].includes(subcategory) &&
            "Chair" in globalQuantities[subcategory]
          ) {
            const chairValue = globalQuantities[subcategory]["Chair"] ?? 0;

            const mainValue = chairValue > 0 ? 1 : 0;
            const visitorValue = chairValue > 0 ? chairValue - 1 : 0;

            globalQuantities[`${subcategory} Main`] = { Chair: mainValue };
            globalQuantities[`${subcategory} Visitor`] = {
              Chair: visitorValue,
            };
          }
        });
      });
    });
    setAllProductQuantities(globalQuantities);
  }, [subCategories, seatCountData, quantityData, selectedCategory]);

  const handleBOQTitleChange = (title) => {
    if (isSaveBOQ) setBOQTitle(title);
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
        };
      });
      setFormulaMap(map);
    }

    setFormulasLoading(false);
  };

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
      }
    } catch (err) {
      console.error("Auto-save error:", err);
    }
  };

  useEffect(() => {
    if (!BOQID || !BOQTitle) return;
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

      if (!data || data.length === 0) {
        setCartItems([]);
        setWishlistItems([]);
        return;
      }

      const uniqueImages = [
        ...new Set(data.map((item) => item.productId.image)),
      ];

      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon")
        .createSignedUrls(uniqueImages, 3600);

      if (signedUrlError) {
        console.error("Error generating signed URLs:", signedUrlError);
        return;
      }

      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      const updatedProducts = data.map((item) => ({
        ...item,
        productId: {
          ...item.productId,
          image: urlMap[item.productId.image] || item.productId.image,
        },
      }));

      const cartProductsRaw = updatedProducts.filter(
        (item) => item.type === "cart"
      );
      const wishlistProductsRaw = updatedProducts.filter(
        (item) => item.type === "wishlist"
      );

      const cartProducts = [
        ...new Map(
          cartProductsRaw.map((item) => [item.productId.id, item])
        ).values(),
      ];
      const wishlistProducts = [
        ...new Map(
          wishlistProductsRaw.map((item) => [item.productId.id, item])
        ).values(),
      ];

      setCartItems(cartProducts);
      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCartItems();
  }, [refreshCartItens]);

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

        setCategories(categoriesData);

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

        if (
          (processedQuantityData &&
            Object.keys(processedQuantityData).length > 0) ||
          (processedAreasData && Object.keys(processedAreasData).length > 0)
        ) {
          categoriesData.forEach((category) => {
            category.subcategories = category.subcategories.filter(
              (subcategory) => {
                const normalize = (str) =>
                  str.toLowerCase().replace(/[^a-z0-9]/g, "");
                const subcategoryKey = normalize(subcategory);

                const ignoreCat =
                  normalize(category.category) === "civilplumbing";
                if (ignoreCat) {
                  return true;
                }

                const roomCount = processedQuantityData || {};

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
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedData && selectedData.length > 0) {
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
    }
  }, [selectedData]);

  useEffect(() => {
    async function fetchdata() {
      const sessionData = JSON.parse(sessionStorage.getItem(session));

      const usertoken = sessionData?.access_token;

      if (!usertoken) {
        setIsAuthenticated(false);
        setIsAuthLoading(false);
      }
      if (usertoken) {
        const { data, error } = await supabase.auth.getUser(usertoken);
        if (error) {
          console.warn("Error fetching user:", error);
          setIsAuthenticated(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.id === selectedCategory.id);

      if (category) {
        setSubCategories(category.subcategories || []);
      }
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    if (subCat1 && selectedCategory?.category) {
      const subCategories = subCat1[selectedCategory.category];
      if (subCategories && subCategories.length > 0) {
        setSelectedSubCategory1(subCategories[0]);
      } else {
        setSelectedSubCategory1(null);
      }
    }
  }, [subCat1, selectedCategory]);

  useEffect(() => {
    if (
      !subCat1 ||
      !Array.isArray(categories) ||
      categories.length === 0 ||
      !Array.isArray(selectedData) ||
      selectedData.length === 0
    ) {
      return;
    }

    if (
      selectedData !== prevSelectedData.current ||
      categories !== prevCategories.current ||
      subCat1 !== prevSubCat1.current
    ) {
      handleProgressBar(selectedData, categories, subCat1);
      prevSelectedData.current = selectedData;
      prevCategories.current = categories;
      prevSubCat1.current = subCat1;
    }
  }, [selectedData, categories, subCat1]);

  const fetchUserData = async () => {
    try {
      if (isAuthenticated) {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) return;

        const userId = user.id;
        const userEmail = user.email;

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select(
            "phone, company_name,role,allowed_category,profile_image,location,address"
          )
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategorySelection = (categoryData) => {
    setSelectedCategory(categoryData);
  };

  function filterExcludedItems(category, subCategory, items, config) {
    const excludeList =
      config[category]?.[subCategory]?.exclude ||
      config[category]?.Default?.exclude ||
      [];
    return items.filter((item) => !excludeList.includes(item));
  }

  function handleProgressBar(selectedData, categories, subCat1) {
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

      if (category === "HVAC") {
        if (subcategory === "Centralized") {
          validSubcategories = ["Centralized"];
        } else {
          validSubcategories = categoryObj.subcategories.filter(
            (sub) => sub !== "Centralized"
          );
        }
      }

      const subCategoryPercentage =
        categoryPercentage / validSubcategories.length;

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

        if (category === "Civil / Plumbing") {
          validSubCat1List = filterExcludedItems(
            "Civil / Plumbing",
            subcategory,
            validSubCat1List,
            categoryConfig
          );
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

        if (category === "Furniture") {
          validSubCat1List = filterExcludedItems(
            "Furniture",
            subcategory,
            validSubCat1List,
            categoryConfig
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

    totalProgress = Math.min(totalProgress, 100);
    setProgress(Math.round(totalProgress * 100) / 100);
  }

  function multiplyFirstTwoFlexible(dimStr) {
    const [a = NaN, b = NaN] = String(dimStr)
      .split(/[,\sxX*]+/)
      .map((s) => parseFloat(s.trim()));

    return Number.isFinite(a) && Number.isFinite(b) ? Number(a * b) : null;
  }

  const handleSelectedData = (
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
        const updatedData = validPrevData.filter(
          (item) => item.groupKey !== groupKey
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

      const existingProduct = validPrevData.find(
        (item) => item.groupKey === groupKey
      );

      let calQty = 0;

      if (
        (category.category === "Civil / Plumbing" && subcategory1 === "Tile") ||
        (category.category === "Flooring" && subcategory1 !== "Epoxy")
      ) {
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
        addons: existingProduct ? existingProduct.addons : selectedAddons || [],
        finalPrice:
          category.category === "Flooring" ||
          category.category === "HVAC" ||
          category.category === "Lighting" ||
          (category.category === "Civil / Plumbing" &&
            subcategory1 === "Tile") ||
          category.category === "Partitions / Ceilings" ||
          category.category === "Paint"
            ? calculateTotalPrice(
                category.category,
                subCat,
                subcategory1,
                null,
                null,
                null,
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
          category.category === "Paint"
            ? Math.ceil(+areasData[0][normalizeKey(subCat)] / 120) * numOfCoats
            : category.category === "Furniture" &&
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
        const updatedData = validPrevData.map((item) =>
          item.groupKey === groupKey ? productData : item
        );
        localStorage.setItem("selectedData", JSON.stringify(updatedData));
        return updatedData;
      }

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
        userResponses,
        setUserResponses,
        isAuthenticated,
        setIsAuthenticated,
        isAuthLoading,
        accountHolder,
        setAccountHolder,
        selectedPlan,
        setSelectedPlan,
        setIsAuthLoading,
        setLoading,
        loading,
        productData,
        setProductData,
        areasData,
        setAreasData,
        quantityData,
        setQuantityData,
        handleCategorySelection,
        handleSelectedData,
        selectedProductView,
        setSelectedProductView,
        showRecommend,
        setShowRecommend,
        searchQuery,
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
        mobileCouponName,
        setMobileCouponName,
        disableApplyCoupon,
        setDisableApplyCoupon,
        orignalTotalPrice,
        setOriginalTotalPrice,
        differenceInPrice,
        setDifferenceInPrice,
        cartTotalPrice,
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
        allProductQuantities,
        pendingProduct,
        setPendingProduct,
        categoryConfig,
        updateCategoryConfig,
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
