import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import {
  fetchCategories,
  fetchCategoriesandSubCat1,
  fetchProductsData,
  fetchRoomData,
} from "../boq/utils/dataFetchers";
import processData, {
  calculateSeatCountTotals,
} from "../boq/utils/dataProcessor";
import { calculateTotalPrice } from "../boq/utils/productUtils";
import { numOfCoats } from "../constants/constant";
import { useSelectedData } from "../hooks/useSelectedData";
import { useProgressBar } from "../hooks/useProgressBar";

const BoqContext = createContext();

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
function filterExcludedItems(category, subCategory, items, config) {
  const excludeList =
    config[category]?.[subCategory]?.exclude ||
    config[category]?.Default?.exclude ||
    [];
  return items.filter((item) => !excludeList.includes(item));
}
function multiplyFirstTwoFlexible(dimStr) {
  const [a = NaN, b = NaN] = String(dimStr)
    .split(/[,\sxX*]+/)
    .map((s) => parseFloat(s.trim()));

  return Number.isFinite(a) && Number.isFinite(b) ? Number(a * b) : null;
}
export const BoqAppProvider = ({ children }) => {
  const session = supabase.storageKey;
  const searchQuery = "";
  const [totalArea, setTotalArea] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [totalAreaSource, setTotalAreaSource] = useState("");
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState(null);
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

  const [selectedPlan, setSelectedPlan] = useState(
    sessionStorage.getItem("selectedPlan") || null
  );

  const prevSelectedData = useRef(selectedData);
  const prevCategories = useRef(categories);
  const prevSubCat1 = useRef(subCat1);

  const [productData, setProductData] = useState([]);
  const [areasData, setAreasData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);
  const [seatCountData, setSeatCountData] = useState([]);
  const [showRecommend, setShowRecommend] = useState(false);
  const [boqTotal, setBoqTotal] = useState(0);
  const [currentLayoutData, setCurrentLayoutData] = useState({});
  const [currentLayoutID, setCurrentLayoutID] = useState(
    sessionStorage.getItem("currentLayoutID")
  );

  const [BOQTitle, setBOQTitle] = useState(
    sessionStorage.getItem("BOQTitle") || ""
  );
  const [BOQID, setBOQID] = useState(sessionStorage.getItem("BOQID") || "");
  const [formulaMap, setFormulaMap] = useState({});
  const [formulasLoading, setFormulasLoading] = useState(true);
  const [isSaveBOQ, setIsSaveBOQ] = useState(true);
  const [productQuantity, setProductQuantity] = useState({});
  const [allProductQuantities, setAllProductQuantities] = useState({});

  const [categoryConfig, setCategoryConfig] = useState(null);

  useEffect(() => {
    async function fetchdata() {
      const sessionData = JSON.parse(sessionStorage.getItem(session));
      const usertoken = sessionData?.access_token;

      if (usertoken) {
        const { data, error } = await supabase.auth.getUser(usertoken);
        if (error) {
          console.warn("Error fetching user:", error);
          return null;
        }

        if (data) {
          setUserId(data.user.id);
        }
      }
    }

    fetchdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

                // const ignoreCat =
                //   normalize(category.category) === "civilplumbing";
                // if (ignoreCat) {
                //   return true;
                // }

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

  const handleCategorySelection = (categoryData) => {
    setSelectedCategory(categoryData);
  };

  const handleProgressBar = useProgressBar({
    setProgress,
    filterExcludedItems,
    categoryConfig,
  });

  const handleSelectedData = useSelectedData({
    setSelectedData,
    areasData,
    quantityData,
    userResponses,
    selectedProductView,
    formulaMap,
    seatCountData,
    selectedSubCategory1,
    selectedAddons,
    numOfCoats,
    normalizeKey,
    multiplyFirstTwoFlexible,
    calculateTotalPrice,
  });

  return (
    <BoqContext.Provider
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
        selectedPlan,
        setSelectedPlan,
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
        currentLayoutData,
        setCurrentLayoutData,
        currentLayoutID,
        setCurrentLayoutID,
        formulaMap,
        formulasLoading,
        BOQTitle,
        setBOQTitle: handleBOQTitleChange,
        BOQID,
        setBOQID,
        refetchFormulas: fetchFormulas,
        setIsSaveBOQ,
        seatCountData,
        setSeatCountData,
        productQuantity,
        setProductQuantity,
        allProductQuantities,
        categoryConfig,
        setCategoryConfig,
      }}
    >
      {children}
    </BoqContext.Provider>
  );
};
export const useBoqApp = () => {
  const context = useContext(BoqContext);
  if (context === undefined) {
    throw new Error("useBoqApp must be used within a app provider");
  }
  return context;
};
