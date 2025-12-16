import { useEffect, useState } from "react";
import { categoriesWithTwoLevelCheck } from "../../constants/constant";
import AddonSelector from "./AddonSelector";
import AreaSelector from "./AreaSelector";
import { AddToCartToast } from "../../utils/AddToCartToast";
import { useBoqApp } from "../../Context/BoqContext";

function SelectArea({
  setShowSelectArea,
  image,
  selectedAreas,
  setSelectedAreas,
  selectedProductView,
  allAddons,
  setShowBackground,
  selectedCategory,
  selectedSubCategory,
  selectedSubCategory1,
}) {
  //Don't call the selectedCategory, selectedSubCategory, selectedSubCategory1, subCategories from Context => Sunny
  const { selectedData, productQuantity, handleSelectedData } = useBoqApp();

  const [showAddon, setShowAddon] = useState(false);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [selectedAddonsMap, setSelectedAddonsMap] = useState({});
  const [commonSubcategories, setCommonSubcategories] = useState([]);

  useEffect(() => {
    const addonsMap = {};
    selectedData.forEach((item) => {
      addonsMap[item.groupKey] = item.addons || [];
    });
    setSelectedAddonsMap(addonsMap);
  }, [selectedData]);

  useEffect(() => {
    if (!allAddons || allAddons.length === 0) setSubmitBtn(true);
  }, [allAddons]);

  useEffect(() => {
    const common = selectedProductView.subcategory.filter((item) =>
      selectedCategory.subcategories.includes(item)
    );
    setCommonSubcategories(common);
  }, [selectedCategory, selectedProductView]);
  const subCategories = commonSubcategories;

  useEffect(() => {
    if (allSubcategories.length > 0) {
      setSelectedRoom(allSubcategories[0]);
    }
  }, [allSubcategories]);

  useEffect(() => {
    if (Array.isArray(selectedData) && selectedData.length > 0) {
      const displayedSubCategories = subCategories.flatMap((subCat) => {
        if (
          selectedCategory.category === "Furniture" &&
          selectedSubCategory1 === "Chair" &&
          subCat === "Md Cabin"
        ) {
          return ["Md Cabin Main", "Md Cabin Visitor"];
        }
        if (
          selectedCategory.category === "Furniture" &&
          selectedSubCategory1 === "Chair" &&
          subCat === "Manager Cabin"
        ) {
          return ["Manager Cabin Main", "Manager Cabin Visitor"];
        }
        return [subCat];
      });

      const initialSelectedAreas = displayedSubCategories.filter((subCat) =>
        selectedData.some((item) =>
          categoriesWithTwoLevelCheck.includes(item.category)
            ? `${item.category}-${item.subcategory}` ===
              `${selectedCategory.category}-${subCat}`
            : `${item.category}-${item.subcategory}-${item.subcategory1}` ===
              `${selectedCategory.category}-${subCat}-${selectedSubCategory1}`
        )
      );

      setSelectedAreas(initialSelectedAreas);
    } else {
      setSelectedAreas([]);
    }
  }, [
    subCategories,
    selectedData,
    selectedCategory,
    selectedSubCategory1,
    setSelectedAreas,
  ]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setShowSelectArea(false);
        setShowBackground(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isIncluded(category, subCategory, selectedSubCategory1, config) {
    const categoryRules = config[category] || {};
    const excludes = categoryRules[subCategory]?.exclude || [];
    return !excludes.includes(selectedSubCategory1);
  }

  function isExcluded(category, subCategory, selectedSubCategory1, config) {
    const categoryRules = config[category] || {};
    const rules = categoryRules[subCategory] || categoryRules.Default || {};

    if (rules.exclude && Array.isArray(rules.exclude)) {
      return rules.exclude.includes(selectedSubCategory1);
    }

    return false;
  }

  const displayedSubCategories = commonSubcategories.flatMap((subCategory) => {
    if (
      selectedCategory.category === "Furniture" &&
      selectedSubCategory1 === "Chair" &&
      subCategory === "Md Cabin"
    ) {
      return ["Md Cabin Main", "Md Cabin Visitor"];
    }
    if (
      selectedCategory.category === "Furniture" &&
      selectedSubCategory1 === "Chair" &&
      subCategory === "Manager Cabin"
    ) {
      return ["Manager Cabin Main", "Manager Cabin Visitor"];
    }
    return [subCategory];
  });

  const isItemSelected = (
    selectedData,
    selectedCategory,
    subCat,
    selectedSubCategory1,
    selectedProductView
  ) => {
    return (
      Array.isArray(selectedData) &&
      selectedData.some((item) => {
        if (
          item.product_variant?.variant_title === selectedProductView?.title
        ) {
          return false;
        }
        const compareSubCat = subCat;

        if (categoriesWithTwoLevelCheck.includes(selectedCategory.category)) {
          return (
            `${item.category}-${item.subcategory}` ===
            `${selectedCategory.category}-${compareSubCat}`
          );
        } else {
          return (
            `${item.category}-${item.subcategory}-${item.subcategory1}` ===
            `${selectedCategory.category}-${compareSubCat}-${selectedSubCategory1}`
          );
        }
      })
    );
  };

  const handleDoneClick = () => {
    let displayedSubCategories = subCategories.flatMap((subCat) => {
      if (
        selectedCategory.category === "Furniture" &&
        selectedSubCategory1 === "Chair" &&
        subCat === "Md Cabin"
      ) {
        return ["Md Cabin Main", "Md Cabin Visitor"];
      }
      if (
        selectedCategory.category === "Furniture" &&
        selectedSubCategory1 === "Chair" &&
        subCat === "Manager Cabin"
      ) {
        return ["Manager Cabin Main", "Manager Cabin Visitor"];
      }
      return [subCat];
    });

    let selectedSubcategories = displayedSubCategories
      .filter((subCat) => selectedAreas.includes(subCat))
      .filter(
        (subCat) =>
          !isItemSelected(
            selectedData,
            selectedCategory,
            subCat,
            selectedSubCategory1,
            selectedProductView
          )
      );

    setAllSubcategories(selectedSubcategories);

    displayedSubCategories.forEach((subCat) => {
      const isChecked = selectedAreas.includes(subCat);
      if (
        isItemSelected(
          selectedData,
          selectedCategory,
          subCat,
          selectedSubCategory1,
          selectedProductView
        )
      ) {
        return;
      }

      handleSelectedData(
        selectedProductView,
        selectedCategory,
        subCat,
        selectedSubCategory1,
        isChecked,
        productQuantity
      );
    });

    if (selectedSubcategories.length > 0) {
      if (!allAddons || allAddons.length === 0) {
        setShowSelectArea(false);
        setShowBackground(false);
        AddToCartToast(selectedProductView, "boq");
      } else {
        setShowAddon(true);
      }
    } else {
      setShowSelectArea(false);
      setShowBackground(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-20">
      <div className="relative bg-gradient-to-br from-[#334A78] to-[#68B2DC] p-5 md:p-6 scrollbar-hide">
        <img
          src="../images/icons/close_btn.svg"
          alt="close"
          className="absolute top-1 right-1 lg:top-1 lg:right-1 cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
          onClick={() => {
            setShowBackground(false);
            setShowSelectArea(false);
          }}
        />

        <div className="bg-white p-6 rounded-lg border-[3px] border-[#FFD500]">
          {!showAddon && (
            <AreaSelector
              setSelectedAreas={setSelectedAreas}
              subCategories={subCategories}
              selectedCategory={selectedCategory}
              selectedSubCategory1={selectedSubCategory1}
              selectedAreas={selectedAreas}
              selectedProductView={selectedProductView}
              setAllSubcategories={setAllSubcategories}
              allAddons={allAddons}
              setShowSelectArea={setShowSelectArea}
              setShowBackground={setShowBackground}
              setShowAddon={setShowAddon}
              commonSubcategories={commonSubcategories}
              image={image}
              submitBtn={submitBtn}
              isIncluded={isIncluded}
              isExcluded={isExcluded}
              displayedSubCategories={displayedSubCategories}
              isItemSelected={isItemSelected}
              handleDoneClick={handleDoneClick}
            />
          )}

          {showAddon && (
            <AddonSelector
              allSubcategories={allSubcategories}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              setShowAddon={setShowAddon}
              allAddons={allAddons}
              selectedProductView={selectedProductView}
              selectedAddons={selectedAddons}
              setSelectedAddons={setSelectedAddons}
              selectedAddonsMap={selectedAddonsMap}
              setSelectedAddonsMap={setSelectedAddonsMap}
              setShowSelectArea={setShowSelectArea}
              setShowBackground={setShowBackground}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              selectedSubCategory1={selectedSubCategory1}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectArea;
