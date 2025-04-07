import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import PDFGenerator from "./PDFGenerator";
import { useState, useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { FiUploadCloud } from "react-icons/fi";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { fetchProductsData } from "../utils/dataFetchers";
import { createPortal } from "react-dom";
import BoqPrompt from "./BoqPrompt";
import Boqcompleted from "../../common-components/Boqcompleted";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { BiCheckCircle, BiDownload } from "react-icons/bi";
// import useAuthRefresh from "../../Context/useAuthRefresh";

function Navbar({ toggleProfile, iconRef }) {
  // const progress = 0;
  const [isOpen, setIsOpen] = useState(false);
  const [boqList, setBoqList] = useState([]);
  const [existingBoqs, setExistingBoqs] = useState([]); // Stores fetched BOQs
  const [showBoqPrompt, setShowBoqPrompt] = useState(false);
  const [completed100, setCompleted100] = useState(() => {
    return localStorage.getItem("boqCompleted") === "done" ? false : false;
  });

  const dropdownRef = useRef(null);

  //dropdown mobile
  const [mobileDropDown, setMobileDropDown] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // const { signOutUser } = useAuthRefresh(); // Get signOutUser from hook

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    progress,
    selectedData,
    setSelectedData,
    accountHolder,
    categories,
    setUserId,
    setTotalArea,
    totalArea,
    userId,
    userResponses,
    selectedPlan,
    areasData,
    boqTotal,
    setBoqTotal,
    isMobile,
  } = useApp();

  useEffect(() => {
    const boqCompleted = localStorage.getItem("boqCompleted");

    if (progress === 100 && boqCompleted !== "done" && !completed100) {
      setCompleted100(true);
      localStorage.setItem("boqCompleted", "done"); // ✅ Store "done" properly
    }
  }, [progress, completed100]); // ✅ Added `completed100` to prevent unnecessary re-triggers

  const naviagte = useNavigate();

  const handleGoTOlayout = () => {
    naviagte("/Layout");
  };

  const handlelogo = () => {
    naviagte("/");
  };

  // console.log("total", calculateGrandTotal().toLocaleString("en-IN"));

  // const toggleProfile = () => {
  //   setShowProfile(!showProfile);
  // };

  const fetchFilteredBOQProducts = async (reconstructedData) => {
    try {
      if (!Array.isArray(reconstructedData) || reconstructedData.length === 0) {
        console.warn(
          "fetchFilteredBOQProducts received invalid data:",
          reconstructedData
        );
        return [];
      }

      // Fetch all products including addons
      const allProducts = await fetchProductsData();

      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        console.warn("No products found in the database.");
        return [];
      }

      // Filter products that match BOQ data
      const filteredBOQProducts = reconstructedData
        .map((boqItem) => {
          // Find matching product from allProducts
          const matchingProduct = allProducts.find((product) =>
            product.product_variants?.some(
              (variant) => variant.id === boqItem.product_variant?.variant_id
            )
          );

          if (!matchingProduct) return null;

          // Find matching variant inside the product
          const matchingVariant = matchingProduct.product_variants?.find(
            (variant) => variant.id === boqItem.product_variant?.variant_id
          );

          // ✅ Fetch addons that match the BOQ item's addons
          const matchingAddons = boqItem.addons
            ?.map(({ addonid, id, finalPrice }) => {
              // Ensure finalPrice is used
              // Find the corresponding product that contains the addon
              const addonProduct = allProducts.find((product) =>
                product.addons?.some((addon) => addon.id === addonid)
              );

              if (!addonProduct) return null;

              // Get the addon from the matching product
              const addon = addonProduct.addons?.find((a) => a.id === addonid);
              if (!addon) return null;

              // Find the correct addon variant
              const addonVariant = addon.addon_variants?.find(
                (variant) => variant.id === id
              );
              if (!addonVariant) return null;

              return {
                addonid: addon.id,
                // typetitle: addon.title,
                price: addonVariant.price,
                id: addonVariant.id,
                title: addonVariant.title,
                status: addonVariant.status,
                vendorId: addonVariant.vendorId,
                image: addonVariant.image,
                finalPrice: finalPrice || addonVariant.price || 0, // ✅ Use saved finalPrice
              };
            })
            .filter(Boolean); // Remove null values

          return {
            id: matchingVariant?.id || matchingProduct.id,
            category: boqItem.category,
            subcategory: boqItem.subcategory,
            subcategory1: boqItem.subcategory1,
            product_variant: {
              variant_id: matchingVariant?.id || matchingProduct.id,
              variant_title: matchingVariant?.title || matchingProduct.title,
              variant_details:
                matchingVariant?.details || matchingProduct.details,
              variant_image: matchingVariant?.image || matchingProduct.image,
              variant_price: matchingVariant?.price || matchingProduct.price,
              additional_images: JSON.parse(
                matchingVariant?.additional_images || "[]"
              ),
            },
            addons: matchingAddons, // ✅ Addons now include fetched finalPrice
            groupKey: boqItem.groupKey,
            finalPrice: boqItem.finalPrice || matchingVariant?.price || 0, // Ensure finalPrice is carried over
          };
        })
        .filter(Boolean); // Remove null entries

      console.log("Formatted BOQ Products:", filteredBOQProducts);
      return filteredBOQProducts;
    } catch (error) {
      console.error("Error fetching and filtering BOQ products:", error);
      return [];
    }
  };

  const handleDeleteBOQ = async (boqId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this BOQ?"
    );

    if (!isConfirmed) return; // If user cancels, stop execution

    try {
      const { error } = await supabase.from("boqdata").delete().eq("id", boqId);

      if (error) {
        console.error("Error deleting BOQ:", error);
        toast.error("Failed to delete BOQ");
        return;
      }

      toast.success("BOQ deleted successfully!");
      fetchSavedBOQs(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting BOQ:", err);
    }
  };

  // Function to load a BOQ
  const handleLoadBOQ = async (boqId) => {
    try {
      // Fetch BOQ data from Supabase
      const { data, error } = await supabase
        .from("boqdata")
        .select("*")
        .eq("id", boqId)
        .single();

      if (error) {
        console.error("Error fetching BOQ:", error);
        toast.error("Failed to load BOQ");
        return;
      }

      if (!data) {
        toast.error("BOQ not found");
        return;
      }

      // Convert stored comma-separated values into arrays
      const productVariantIds =
        data.product_variant_id?.split(",").map((id) => id.trim()) || [];
      const addonIds = data.addon_id?.split(",").map((id) => id.trim()) || [];
      const addonVariantIds =
        data.addon_variant_id?.split(",").map((id) => id.trim()) || [];
      const groupKeys =
        data.group_key?.split(",").map((key) => key.trim()) || [];
      const finalPrices =
        data.final_price
          ?.split(",")
          .map((price) => parseFloat(price.trim()) || 0) || [];
      const addonFinalPrices =
        data.addon_final_price
          ?.split(",")
          .map((price) => parseFloat(price.trim()) || 0) || [];

      // ✅ Reconstruct products and addons based on groupKey
      const reconstructedData = groupKeys.map((groupKey, index) => {
        let category = "";
        let subcategory = "";
        let subcategory1 = "";
        let productId = "";

        const parts = groupKey.split("-");

        if (groupKey.includes("L-Type Workstation")) {
          // ✅ Special handling for "L-Type Workstation"
          category = parts[0];
          subcategory = "L-Type Workstation"; // Keep it intact
          subcategory1 = parts.length > 3 ? parts[3] : "";
          productId = parts[parts.length - 1];
        } else {
          // Default split behavior
          [category, subcategory, subcategory1, productId] = parts;
        }

        return {
          id: productId,
          category,
          subcategory,
          subcategory1,
          product_variant: {
            variant_id: productVariantIds[index] || productId,
          },
          addons:
            addonIds.length > index
              ? [
                  {
                    addonid: addonIds[index],
                    id: addonVariantIds[index],
                    finalPrice: addonFinalPrices[index] || 0, // ✅ Assign finalPrice for addons
                  },
                ]
              : [],
          groupKey,
          finalPrice: finalPrices[index] || 0, // Assign final price for product
        };
      });

      console.log("Reconstructed BOQ Data:", reconstructedData);

      // Fetch and transform BOQ-related products and addons
      const formattedBOQProducts = await fetchFilteredBOQProducts(
        reconstructedData
      );

      // ✅ Update state with the final BOQ structure
      setSelectedData(formattedBOQProducts);
      setUserId(data.userId);
      setTotalArea(data.total_area);

      toast.success(`Loaded BOQ: ${data.title}`);
      localStorage.removeItem("boqCompleted");
    } catch (err) {
      console.error("Error loading BOQ:", err);
      toast.error("Error loading BOQ");
    }
  };

  const fetchSavedBOQs = async () => {
    try {
      const { data, error } = await supabase
        .from("boqdata")
        .select("id, created_at, title") // Fetch BOQs for the user
        .eq("userId", userId)
        .order("created_at", { ascending: false }); // Sort by latest first

      if (error) {
        console.error("Error fetching BOQs:", error);
        return;
      }

      setBoqList(data); // Update state with fetched BOQs
    } catch (err) {
      console.error("Error fetching BOQs:", err);
    }
  };

  const handleSave = async () => {
    if (!selectedData || selectedData.length === 0) {
      toast.error("No selected data to save.");
      return;
    }

    // Fetch user's existing BOQs
    const { data: existingBOQs, error: fetchError } = await supabase
      .from("boqdata")
      .select("id, title") // Fetch ID and title
      .eq("userId", userId);

    if (fetchError) {
      console.error("Error fetching user BOQs:", fetchError);
      return;
    }

    if (existingBOQs.length >= 3) {
      toast.error("You can only save up to 3 BOQs.");
      return;
    }

    if (existingBOQs.length > 0) {
      setShowBoqPrompt(true); // Show the prompt for choosing or naming the BOQ
      setExistingBoqs(existingBOQs); // Store the fetched BOQs for selection
    } else {
      setShowBoqPrompt(true); // If no existing BOQs, directly show naming prompt
    }
  };

  const calculateGrandTotal = () => {
    // Ensure selectedData is an array before calling reduce
    let grandTotal = (Array.isArray(selectedData) ? selectedData : []).reduce(
      (total, product) => {
        // Sum the product's final price
        let productTotal = product.finalPrice || 0;

        // Sum all the addons' final prices
        let addonsTotal = (product.addons || []).reduce(
          (addonSum, addon) => addonSum + (addon.finalPrice || 0),
          0
        );

        return total + productTotal + addonsTotal;
      },
      0
    );
    // Add 150 * totalArea if flooring is bareShell
    if (userResponses.flooring === "bareShell") {
      grandTotal += 150 * totalArea;
    }

    // console.log("from grandtotal", grandTotal);
    // console.log("from grandtotal area", totalArea);
    console.log("grand total", grandTotal);
    setBoqTotal(grandTotal);
    console.log("boq total", boqTotal);
  };

  useEffect(() => {
    calculateGrandTotal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  const insertDataIntoSupabase = async (
    selectedData,
    userId,
    boqTitle,
    totalArea
  ) => {
    try {
      // Check how many BOQs the user has already saved
      const { data: existingBOQs, error: fetchError } = await supabase
        .from("boqdata")
        .select("id", { count: "exact" })
        .eq("userId", userId);

      if (fetchError) {
        console.error("Error fetching user BOQ count:", fetchError);
        return;
      }

      if (existingBOQs.length >= 3) {
        console.warn("User has reached the BOQ limit.");
        toast.error("You can only save up to 3 BOQs.");
        return;
      }

      // Ask for BOQ title only if the user has room for more BOQs
      if (!boqTitle) {
        boqTitle = window.prompt("Enter a name for your BOQ:");
        if (!boqTitle) {
          toast.error("BOQ name cannot be empty.");
          return;
        }
      }

      // Prepare formatted data
      const formattedData = {
        product_id: selectedData.map((item) => item.id).join(","),
        product_variant_id: selectedData
          .map((item) => item.product_variant?.variant_id || "")
          .join(","),
        addon_id: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map((addon) => addon.addonid)
              : []
          )
          .join(","),
        addon_variant_id: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map((addon) => addon.id)
              : []
          )
          .join(","),
        addon_final_price: selectedData
          .flatMap((item) =>
            item.addons
              ? Object.values(item.addons).map(
                  (addon) => addon.finalPrice || ""
                )
              : []
          )
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple addon final prices as comma-separated values
        group_key: selectedData
          .map((item) => item.groupKey || "")
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple group keys as comma-separated values
        userId: userId,
        title: boqTitle, // Save the entered BOQ name
        total_area: totalArea,
        height: userResponses.height,
        flooring: userResponses.flooring,
        demolishTile: userResponses.demolishTile,
        hvacType: userResponses.hvacType,
        planType: selectedPlan,
        final_price: selectedData
          .map((item) => item.finalPrice || "")
          .filter(Boolean) // Removes empty strings
          .join(","), // Store multiple product final prices as comma-separated values
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from("boqdata")
        .insert([formattedData]);

      if (error) {
        console.error("Error inserting data into Supabase:", error);
      } else {
        console.log("Data inserted successfully:", data);
        toast.success("BOQ saved successfully!");
      }
    } catch (error) {
      console.error("Error during insertion:", error);
    }
  };

  const updateExistingBoq = async (boqId) => {
    try {
      const { error } = await supabase
        .from("boqdata")
        .update({
          product_id: selectedData.map((item) => item.id).join(","),
          product_variant_id: selectedData
            .map((item) => item.product_variant?.variant_id || "")
            .join(","),
          addon_id: selectedData
            .flatMap((item) =>
              item.addons
                ? Object.values(item.addons).map((addon) => addon.addonid)
                : []
            )
            .join(","),
          addon_variant_id: selectedData
            .flatMap((item) =>
              item.addons
                ? Object.values(item.addons).map((addon) => addon.id)
                : []
            )
            .join(","),
          addon_final_price: selectedData
            .flatMap((item) =>
              item.addons
                ? Object.values(item.addons).map(
                    (addon) => addon.finalPrice || ""
                  )
                : []
            )
            .filter(Boolean)
            .join(","),
          group_key: selectedData
            .map((item) => item.groupKey || "")
            .filter(Boolean)
            .join(","),
          final_price: selectedData
            .map((item) => item.finalPrice || "")
            .filter(Boolean)
            .join(","),
          total_area: totalArea,
          height: userResponses.height,
          flooring: userResponses.flooring,
          demolishTile: userResponses.demolishTile,
          hvacType: userResponses.hvacType,
          planType: selectedPlan,
        })
        .eq("id", boqId);

      if (error) {
        console.error("Error updating existing BOQ:", error);
        toast.error("Failed to update BOQ.");
      } else {
        toast.success("BOQ updated successfully!");
      }
    } catch (error) {
      console.error("Error during update:", error);
    }
  };

  const handleBoqNameConfirm = (nameOrId, isNew = true) => {
    setShowBoqPrompt(false);

    if (isNew) {
      insertDataIntoSupabase(selectedData, userId, nameOrId, totalArea);
    } else {
      updateExistingBoq(nameOrId); // If updating an existing BOQ, use its ID
    }
  };

  const handleMobileDropDown = () => {
    if (mobileDropDown) {
      setMobileDropDown(false);
    } else {
      setMobileDropDown(true);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true); // Show loading animation
    setIsCompleted(false);

    try {
      await PDFGenerator.generatePDF(
        selectedData,
        calculateGrandTotal,
        accountHolder.companyName,
        accountHolder.location,
        areasData,
        categories
      );
      setIsDownloading(false);
      setIsCompleted(true);

      // Reset button after 2 seconds
      setTimeout(() => setIsCompleted(false), 2000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="navbar sticky top-0 z-20">
      <div className="flex justify-between bg-gradient-to-r from-[#1A3A36] to-[#48A095] items-center px-4 h-[50px]">
        {/* logo */}
        <button className="" onClick={handlelogo}>
          <img
            src="/logo/workved-logo-white.png"
            alt="603 logo"
            className="h-auto md:h-8 lg:h-10 w-16 lg:w-18 "
          />
        </button>
        {/* button for generate boq */}
        <div className="pr-2 flex gap-3 items-center">
          {boqTotal > 0 && (
            <div
              // onClick={signOutUser}
              className="flex justify-center items-center bg-[#FFF] rounded-xl text-xs px-5 h-fit py-3 self-center text-black border-solid border-1 border-black"
            >
              <span className="font-bold">Total</span>: ₹{" "}
              {boqTotal.toLocaleString("en-IN")}
            </div>
          )}

          {/* <div
          // onClick={signOutUser}
          className="flex justify-center items-center bg-[#FFF] rounded-xl text-xs py-2 px-5 text-black  border-solid border-1 border-black"
        >
          <span className="font-bold">Total</span>: ₹ {calculateGrandTotal()}
        </div> */}

          {/* prfile icon */}
          <div className="z-30" ref={iconRef}>
            <img
              onClick={toggleProfile}
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-8 md:w-12 h-8 md:h-12 cursor-pointer rounded-full"
            />
          </div>
        </div>
      </div>
      {isMobile ? (
        <div className="bg-[#1A3A36] py-1 flex  justify-around items-center px-5 relative">
          {/* <div className=" flex items-center">
          <button
            className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px] border-black"
            onClick={handleGoTOlayout}
          >
            Layout
          </button>
        </div> */}
          <div className="w-7/12 mx-auto  py-2.5">
            <div className="relative h-3 bg-[#385682] rounded-full">
              <div
                className="absolute h-full bg-[#34BFAD] rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-[#CCCCCC] border-2 border-white rounded-full glowing-circle"
                style={{ left: `${progress}%`, width: "16px", height: "16px" }}
              ></div>
            </div>
            {/* Progress Label */}
            <div className="text-center mt-2 text-[#C7DDFF] text-[10px]">
              {progress}% Completed
            </div>
          </div>
          {mobileDropDown ? (
            <button onClick={handleMobileDropDown}>
              <MdOutlineCancel color="white" size={25} />
            </button>
          ) : (
            <button onClick={handleMobileDropDown}>
              <CiMenuFries color="white" size={26} />
            </button>
          )}

          {mobileDropDown && (
            <div className="absolute z-20 translate-y-[60%] right-0 transform transition-all duration-700 ease-in-out opacity-100 scale-100">
              {/* <div className="absolute z-20 translate-y-[60%] translate-x-[60%] transform transition-transform ease-in-out duration-700 "> */}
              <ul className="text-[#34BFAD] bg-[#00453C] bg-opacity-90 m-3 p-2 text-start">
                {/* <li className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 px-2">
                view boq{" "}
              </li> */}
                <li
                  onClick={handleGoTOlayout}
                  className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg cursor-pointer"
                >
                  Layout
                </li>
                <li
                  onClick={() =>
                    PDFGenerator.generatePDF(
                      selectedData,
                      calculateGrandTotal,
                      accountHolder.companyName,
                      accountHolder.location,
                      areasData,
                      categories
                    )
                  }
                  className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg cursor-pointer"
                >
                  Download
                </li>
                <li className=" hover:bg-white hover:text-[#1A3A36] mb-2 py-1 px-2 rounded-lg">
                  <div className=" flex items-center" ref={dropdownRef}>
                    <button
                      onClick={handleSave}
                      // className="bg-white text-xs py-2 px-3 text-black rounded-l-full"
                    >
                      Save BOQ
                    </button>
                    <button
                      onClick={() => {
                        fetchSavedBOQs();
                        setIsOpen(!isOpen);
                      }}
                      // className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-full"
                    >
                      <RiArrowDropDownLine />
                    </button>

                    {isOpen && (
                      <ul className="absolute left-0 -bottom-1/3 min-w-[100px] mt-2 w-auto text-xs bg-white border border-gray-300 rounded-lg shadow-md">
                        <li className="px-4 py-2 grid grid-cols-[2fr_1fr] font-semibold bg-gray-200 text-center rounded-lg shadow-md">
                          <span className="text-left">Title</span>
                          <span className="text-center">Actions</span>
                        </li>
                        {boqList.length > 0 ? (
                          boqList.map((boq) => (
                            <li
                              key={boq.id}
                              className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100 cursor-pointer"
                              // className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100 cursor-pointer"
                            >
                              <span className="text-left break-words whitespace-normal">
                                {boq.title}
                              </span>

                              <div className="flex justify-center gap-2">
                                <FiUploadCloud
                                  className="cursor-pointer"
                                  onClick={() => handleLoadBOQ(boq.id)}
                                />
                                <FaTrash
                                  className="text-red-500 cursor-pointer"
                                  onClick={() => handleDeleteBOQ(boq.id)}
                                />
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-500 text-center">
                            No BOQs saved
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          )}

          {/* <div className="flex items-center gap-2">
          {import.meta.env.MODE === "development" && (
            <MdClear
              color="red"
              size={30}
              title="Clear selected data"
              onClick={() => {
                localStorage.removeItem("selectedData");
                window.location.reload();
              }}
              className="cursor-pointer"
            />
          )}
          <div
            className="relative inline-flex items-center border border-black rounded-full"
            ref={dropdownRef}
          >
            <button
              onClick={handleSave}
              className="bg-white text-xs py-2 px-3 text-black rounded-l-full"
            >
              Save BOQ
            </button>
            <button
              onClick={() => {
                fetchSavedBOQs();
                setIsOpen(!isOpen);
              }}
              className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-full"
            >
              <RiArrowDropDownLine />
            </button>

            {isOpen && (
              <ul className="absolute left-0 top-7 min-w-[200px] mt-2 w-auto bg-white border border-gray-300 rounded-lg shadow-md">
                <li className="px-4 py-2 grid grid-cols-[2fr_1fr] font-semibold bg-gray-200 text-center rounded-lg shadow-md">
                  <span className="text-left">Title</span>
                  <span className="text-center">Actions</span>
                </li>
                {boqList.length > 0 ? (
                  boqList.map((boq) => (
                    <li
                      key={boq.id}
                      className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="text-left break-words whitespace-normal">
                        {boq.title}
                      </span>

                      <div className="flex justify-center gap-2">
                        <FiUploadCloud
                          className="cursor-pointer"
                          onClick={() => handleLoadBOQ(boq.id)}
                        />
                        <FaTrash
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteBOQ(boq.id)}
                        />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-center">
                    No BOQs saved
                  </li>
                )}
              </ul>
            )}
          </div>
          <div className="flex items-center downloadB">
            <button
              onClick={() =>
                PDFGenerator.generatePDF(
                  selectedData,
                  calculateGrandTotal,
                  accountHolder.companyName,
                  accountHolder.location,
                  areasData,
                  categories
                )
              }
              className="bg-[#1A3A36] text-xs py-2 px-5 text-white rounded-full border-solid border-[1px] border-[#34BFAD] hover:bg-[#34BFAD]"
            >
              Download
            </button>
          </div>
        </div> */}
        </div>
      ) : (
        <div className="bg-[#1A3A36] py-1 flex px-5">
          <div className=" flex items-center">
            <button
              className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px] border-black"
              onClick={handleGoTOlayout}
            >
              Go to Layout
            </button>
          </div>
          <div className="w-7/12 mx-auto pl-10 py-2.5">
            {/* Progress Bar Container */}
            <div className="relative h-3 bg-[#385682] rounded-full">
              {/* Filled Progress */}
              <div
                className="absolute h-full bg-[#34BFAD] rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
              {/* Progress Circle */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-[#CCCCCC] border-2 border-white rounded-full glowing-circle"
                style={{ left: `${progress}%`, width: "16px", height: "16px" }}
              ></div>
            </div>
            {/* Progress Label */}
            <div className="text-center mt-2 text-[#C7DDFF] text-[10px]">
              {progress}% Completed
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <div className=""> */}
            {/* <button
          className="bg-[#FFF] text-xs py-2 px-5 text-black rounded-full border-solid border-[1px]border-black"
          onClick={clearSelectedData}
        >
          Save BOQ
        </button> */}
            {/* </div> */}
            {/* <div className="justify-items-end"> */}
            {import.meta.env.MODE === "development" && (
              <MdClear
                color="red"
                size={30}
                title="Clear selected data"
                onClick={() => {
                  localStorage.removeItem("selectedData");
                  window.location.reload();
                }}
                className="cursor-pointer"
              />
            )}
            <div
              className="relative inline-flex items-center border border-black rounded-full"
              ref={dropdownRef}
            >
              <button
                onClick={handleSave}
                className="bg-white text-xs py-2 px-3 text-black rounded-l-full"
              >
                Save BOQ
              </button>
              <button
                onClick={() => {
                  fetchSavedBOQs();
                  setIsOpen(!isOpen);
                }}
                className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-full"
              >
                <RiArrowDropDownLine />
              </button>

              {isOpen && (
                <ul className="absolute left-0 top-7 min-w-[200px] mt-2 w-auto bg-white border border-gray-300 rounded-lg shadow-md">
                  {/* Header Row */}
                  <li className="px-4 py-2 grid grid-cols-[2fr_1fr] font-semibold bg-gray-200 text-center rounded-lg shadow-md">
                    <span className="text-left">Title</span>
                    <span className="text-center">Actions</span>
                  </li>

                  {/* BOQ List */}
                  {boqList.length > 0 ? (
                    boqList.map((boq) => (
                      <li
                        key={boq.id}
                        className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100 cursor-pointer"
                      >
                        {/* Title with word wrap */}
                        <span className="text-left break-words whitespace-normal">
                          {boq.title}
                        </span>

                        {/* Action Icons */}
                        <div className="flex justify-center gap-2">
                          <FiUploadCloud
                            className="cursor-pointer"
                            onClick={() => handleLoadBOQ(boq.id)}
                          />
                          <FaTrash
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDeleteBOQ(boq.id)}
                          />
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500 text-center">
                      No BOQs saved
                    </li>
                  )}
                </ul>
              )}
            </div>
            {/* </div> */}
            <div className="flex items-center downloadB">
              {/* <button
                onClick={() =>
                  PDFGenerator.generatePDF(
                    selectedData,
                    calculateGrandTotal,
                    accountHolder.companyName,
                    accountHolder.location,
                    areasData,
                    categories
                  )
                }
                className="bg-[#1A3A36] text-xs py-2 px-5 text-white rounded-full border-solid border-[1px] border-[#34BFAD] hover:bg-[#34BFAD]"
              >
                Download
              </button> */}
              <button
                onClick={handleDownload}
                className={`relative flex items-center justify-center gap-2 bg-[#1A3A36] text-xs py-2 px-6 text-white rounded-full border border-[#34BFAD] transition-all duration-300 ease-in-out 
                ${
                  isDownloading
                    ? "bg-[#267D6E] border-[#34BFAD] scale-95 cursor-not-allowed"
                    : isCompleted
                    ? "bg-green-500 border-green-500 scale-105 animate-bounce"
                    : "hover:bg-[#34BFAD]"
                }
              `}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <span className="absolute w-4 h-4 bg-white opacity-30 rounded-full animate-ping"></span>
                    <span className="relative w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="relative">Downloading...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <BiCheckCircle size={16} className="text-white" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <BiDownload size={16} className="text-white" />
                    <span>Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {showBoqPrompt &&
        createPortal(
          <BoqPrompt
            existingBoqs={existingBoqs}
            onConfirm={handleBoqNameConfirm}
            onCancel={() => setShowBoqPrompt(false)}
          />,
          document.body // Mounts it at the root level
        )}
      {completed100 &&
        createPortal(
          <Boqcompleted setCompleted100={setCompleted100} />,
          document.body // Mounts it at the root level
        )}
    </div>
  );
}

export default Navbar;
