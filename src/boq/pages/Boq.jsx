import { useEffect, useState, useMemo } from "react";
import Navbar from "../../boq/components/Navbar";
import Categories from "./Categories";
import { fetchCategories, fetchProductsData, fetchWorkspaces, fetchRoomData } from "../utils/dataFetchers";
import MainPage from "./MainPage";
import ProductCard from "../components/ProductCard";
import RecommendComp from "../components/RecommendComp";
import processData from "../utils/dataProcessor";
import ProductOverview from "../components/ProductOverview";
import { useApp } from "../../Context/Context";

function Boq() {
  // const [selectedProducts, setSelectedProducts] = useState([]);

  const [subCat1, setSubCat1] = useState(null);
  const [selectedProductView, setSelectedProductView] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]); // Extracted subcategories
  const [productsData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 15000000]);

  const [workspaces, setWorkspaces] = useState([]);
  const [roomData, setRoomData] = useState({ quantityData: [], areasData: [] });
  const [areasData, setAreasData] = useState([]);
  const [quantityData, setQuantityData] = useState([]);

  const [minimizedView, setMinimizedView] = useState(false);
  const [showProductView, setShowProductView] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const { selectedCategory, setSelectedCategory, selectedSubCategory, setSelectedSubCategory,
    selectedSubCategory1, setSelectedSubCategory1, selectedData, setSelectedData } = useApp();

  // useEffect(() => {
  //     document.title = '603 BOQ';
  // }, []);

  useEffect(() => {
    var temp = JSON.parse(localStorage.getItem("selectedData"));
    setSelectedData(temp);
  }, []);

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
    const loadData = async () => {
      const [categoriesData, productsData, workspacesData, roomDataResult] =
        await Promise.all([
          fetchCategories(),
          fetchProductsData(),
          fetchWorkspaces(),
          fetchRoomData(),
        ]);

      setCategories(categoriesData);

      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0]);
        setSelectedSubCategory(categoriesData[0].subcategories[0] || null);
      }

      setProductData(productsData);
      setWorkspaces(workspacesData);
      setRoomData(roomDataResult);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (roomData.quantityData && roomData.quantityData.length > 0) {
      const processedQuantityData = processData(
        roomData.quantityData,
        "quantity"
      );
      if (processedQuantityData) {
        setQuantityData([processedQuantityData]);
      }
    }

    if (roomData.areasData && roomData.areasData.length > 0) {
      const processedAreasData = processData(roomData.areasData, "areas");
      if (processedAreasData) {
        setAreasData([processedAreasData]);
      }
    }
  }, [roomData]);

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

  // Filter products based on search query, price range, and category
  const filteredProducts = useMemo(() => {
    // if (!selectedCategory) return false;
    return productsData.filter((product) => {
      if (!product.product_variants || product.product_variants.length === 0) {
        return false;
      }

      const matchesVariant = product.product_variants.some((variant) => {
        const matchesSearch =
          variant.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          variant.details?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice =
          variant.price >= priceRange[0] && variant.price <= priceRange[1];

        return matchesSearch && matchesPrice;
      });

      const matchesCategory =
        selectedCategory?.category === "" ||
        product.category === selectedCategory?.category;
      return matchesVariant && matchesCategory;
    });
  }, [productsData, searchQuery, priceRange, selectedCategory]);

  // Group products by category and subcategory
  const groupedProducts = useMemo(() => {
    const grouped = {};

    filteredProducts.forEach((product) => {
      const subcategories = product.subcategory
        .split(",")
        .map((sub) => sub.trim());

      subcategories.forEach((subcategory) => {
        if (!grouped[product.category]) {
          grouped[product.category] = {};
        }
        if (!grouped[product.category][subcategory]) {
          grouped[product.category][subcategory] = [];
        }
        grouped[product.category][subcategory].push(product);
      });
    });
    return grouped;
  }, [filteredProducts]);

  const handleCategorySelection = (categoryData) => {
    setSelectedCategory(categoryData);
    console.log("Selected Category: ", categoryData.category);
  };

  const handleSelectedSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setMinimizedView(true);
    console.log("Selected SubCat: ", subCategory);
  };

  const handleSelectedSubCategory1 = (subCategory1) => {
    setSelectedSubCategory1(subCategory1);
    console.log("Selected SubCat1: ", subCategory1);
  };

  const handleSelectedProductView = (variant) => {
    setSelectedProductView(variant);
  };

  const handleAddOnChange = (variant) => {
    console.log("addon added");

    // Ensure the variant object has title, price, and image
    if (!variant || !variant.title || variant.price == null || !variant.image)
      return;

    setSelectedAddons((prevSelectedAddOns) => {
      // Check if the add-on is already selected
      const isAlreadySelected = prevSelectedAddOns[variant.title];

      if (isAlreadySelected) {
        // If already selected, remove the add-on
        const { [variant.title]: _, ...rest } = prevSelectedAddOns;
        return rest;
      } else {
        // If not selected, add the add-on
        return {
          ...prevSelectedAddOns,
          [variant.title]: {
            addon_title: variant.title || "No Title",
            addon_price: variant.price || "No Price",
            addon_image: variant.image || "No Image",
            addonId: variant.addonid || "No Id",
            variantID: variant.id || "No Id",
          },
        };
      }
    });
  };

  const handelSelectedData = (product, category, subCat, subcategory1) => {
    if (!product) return;

    // Unique group key to ensure only one selection per group
    const groupKey = `${category.category}-${subCat}-${subcategory1}`;

    const productData = {
      groupKey, // For group-level management
      id: product.id,
      category: category.category,
      subcategory: subCat,
      subcategory1, // added subcategory1 as an argument
      product_variant: {
        variant_title: product.title,
        variant_image: product.image,
        variant_details: product.details,
        variant_price: product.price,
        variant_id: product.id,
        additional_images: JSON.parse(product.additional_images || "[]"), // Parse the string to an array
      },
      addons: selectedAddons || [], // Assuming addons might be optional
    };

    // Update selectedData to replace any existing product in the group
    setSelectedData((prevData) => {
      // Check if there's already a product with the same groupKey
      const existingProductIndex = prevData.findIndex(
        (item) => item.groupKey === groupKey
      );

      if (existingProductIndex !== -1) {
        // Replace the existing product in the group
        const updatedData = [...prevData];
        updatedData[existingProductIndex] = productData; // Replace the product with new data
        localStorage.setItem("selectedData", JSON.stringify(updatedData)); // Persist updated state
        return updatedData;
      }

      // If no existing product with the same groupKey, add the new product
      const updatedData = [...prevData, productData];
      localStorage.setItem("selectedData", JSON.stringify(updatedData)); // Persist updated state
      return updatedData;
    });

    console.log("Processed group key:", groupKey);
  };

  // console.log("selected addons", selectedAddons);
  console.log("selected products", selectedData);
  return (
    <div>
      <Navbar />
      {!showProductView && (
        <div className="container px-5">
          <Categories
            categories={categories}
            setSelectedCategory={handleCategorySelection}
            setSelectedSubCategory={handleSelectedSubCategory}
            minimizedView={minimizedView}
          />

          {minimizedView && (
            <div>
              <MainPage
                selectedCategory={selectedCategory}
                selectedSubCategory1={selectedSubCategory1}
                setSelectedSubCategory1={handleSelectedSubCategory1}
              />
              <ProductCard
                products={groupedProducts}
                selectedProductView={selectedProductView}
                setShowProductView={setShowProductView}
                setSelectedProductView={handleSelectedProductView}
              />
            </div>
          )}
        </div>
      )}
      {showProductView && (
        <div>
          <ProductOverview
            selectedProductView={selectedProductView}
            quantityData={quantityData}
            areasData={areasData}
            setShowProductView={setShowProductView}
            showRecommend={showRecommend}
            setShowRecommend={setShowRecommend}
            subCategories={subCategories}
            filteredProducts={filteredProducts}
            handleAddOnChange={handleAddOnChange}
            handelSelectedData={handelSelectedData}
          />
          {showRecommend && (
            <RecommendComp
              showRecommend={showRecommend}
              setShowRecommend={setShowRecommend}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Boq;
