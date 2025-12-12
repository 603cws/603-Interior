import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import PDFGenerator from "./PDFGenerator";
import { useState, useEffect, useRef } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { fetchProductsData } from "../utils/dataFetchers";
import { createPortal } from "react-dom";
import BoqPrompt from "./BoqPrompt";
import Boqcompleted from "../../common-components/Boqcompleted";
import { CiMenuFries } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import AlertBox from "./AlertBox";
import CurrentLayoutDetails from "./CurrentLayoutDetails";
import GobackLayoutWarning from "./GobackLayoutWarning";
import { AnimatedButton } from "../../common-components/AnimatedButton";

function Navbar({
  toggleProfile,
  iconRef,
  showBoqPrompt,
  setShowBoqPrompt,
  isProfileCard,
  setIsProfileCard,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [boqList, setBoqList] = useState([]);
  const [completed100, setCompleted100] = useState(() => {
    return localStorage.getItem("boqCompleted") === "done" ? false : false;
  });
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedboqid, setSelectedboqid] = useState(null);
  const dropdownRef = useRef(null);
  const [mobileDropDown, setMobileDropDown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLayoutDetails, setShowLayoutDetails] = useState(false);
  const [isLayoutWarning, setIslayoutWarning] = useState(false);

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
    totalArea,
    userId,
    userResponses,
    selectedPlan,
    areasData,
    boqTotal,
    setBoqTotal,
    isMobile,
    setSelectedPlan,
    BOQTitle,
    setBOQTitle,
    currentLayoutData,
    setCurrentLayoutData,
    BOQID,
    setBOQID,
    setCurrentLayoutID,
    quantityData,
    setIsSaveBOQ,
    productQuantity,
  } = useApp();

  useEffect(() => {
    const boqCompleted = localStorage.getItem("boqCompleted");

    if (progress === 100 && boqCompleted !== "done" && !completed100) {
      setCompleted100(true);
      localStorage.setItem("boqCompleted", "done");
    }
  }, [progress, completed100]);

  useEffect(() => {
    if (showLayoutDetails) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showLayoutDetails]);

  const naviagte = useNavigate();

  const handleGoTOlayout = () => {
    naviagte("/Layout");
  };

  const handlelogo = () => {
    naviagte("/");
  };

  const fetchFilteredBOQProducts = async (products = [], addons = []) => {
    try {
      if (!products.length) {
        console.warn("No products passed to fetchFilteredBOQProducts.");
        return [];
      }

      const allProducts = await fetchProductsData();
      if (!allProducts.length) {
        console.warn("No products found in database.");
        return [];
      }

      return products
        .map((product, index) => {
          const { id: variantId, groupKey, finalPrice = 0, quantity } = product;
          const parts = groupKey.split("-");
          const isLType = groupKey.includes("L-Type Workstation");
          const category = parts[0];
          const subcategory = isLType ? "L-Type Workstation" : parts[1];
          const subcategory1 = isLType ? parts[3] || "" : parts[2];

          let matchedVariant, matchedProduct;
          for (const prod of allProducts) {
            matchedVariant = prod.product_variants?.find(
              (v) => v.id === variantId
            );
            if (matchedVariant) {
              matchedProduct = prod;
              break;
            }
          }
          if (!matchedProduct) return null;

          const addonData = addons?.[index];
          const matchingAddons = addonData
            ? (() => {
                const addonProduct = allProducts.find((p) =>
                  p.addons?.some((a) => a.id === addonData.addonId)
                );
                const addon = addonProduct?.addons?.find(
                  (a) => a.id === addonData.addonId
                );
                const addonVariant = addon?.addon_variants?.find(
                  (v) => v.id === addonData.variantId
                );
                return addon && addonVariant
                  ? [
                      {
                        addonid: addon.id,
                        id: addonVariant.id,
                        title: addonVariant.title,
                        price: addonVariant.price,
                        image: addonVariant.image,
                        status: addonVariant.status,
                        vendorId: addonVariant.vendorId,
                        finalPrice:
                          addonData.finalPrice || addonVariant.price || 0,
                      },
                    ]
                  : [];
              })()
            : [];

          return {
            id: matchedVariant?.id || matchedProduct.id,
            category,
            subcategory,
            subcategory1,
            groupKey,
            finalPrice: finalPrice || matchedVariant?.price || 0,
            quantity,
            product_variant: {
              variant_id: matchedVariant?.id || matchedProduct.id,
              variant_title: matchedVariant?.title || matchedProduct.title,
              variant_details:
                matchedVariant?.details || matchedProduct.details,
              variant_image: matchedVariant?.image || matchedProduct.image,
              variant_price: matchedVariant?.price || matchedProduct.price,
              additional_images: JSON.parse(
                matchedVariant?.additional_images || "[]"
              ),
            },
            addons: matchingAddons,
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error("Error in fetchFilteredBOQProducts:", error);
      return [];
    }
  };

  const handleDeleteBOQ = async (boqId) => {
    try {
      const { error } = await supabase
        .from("boq_data_new")
        .delete()
        .eq("id", boqId);

      if (error) {
        console.error("Error deleting BOQ:", error);
        toast.error("Failed to delete BOQ");
        return;
      }

      toast.success("BOQ deleted successfully!");
      fetchSavedBOQs();
      setDeleteAlert(false);
    } catch (err) {
      console.error("Error deleting BOQ:", err);
    }
  };

  const handleLoadBOQ = async (boqId) => {
    try {
      const { data, error } = await supabase
        .from("boq_data_new")
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

      const { data: layoutData, error: layoutError } = await supabase
        .from("layout")
        .select("*")
        .eq("id", data.layoutId)
        .single();
      if (layoutError) {
        console.error("Error fetching layout:", layoutError);
        return;
      }
      setCurrentLayoutData(layoutData);
      setCurrentLayoutID(layoutData.id);

      const formattedBOQProducts = await fetchFilteredBOQProducts(
        data.products,
        data.addons
      );

      setSelectedData(formattedBOQProducts);
      setUserId(data.userId);
      setSelectedPlan(data?.planType);
      setBOQTitle(data.boqTitle);
      setBoqTotal(data.boqTotalPrice);
      setBOQID(data.id);
      toast.success(
        `Loaded BOQ: ${
          data.boqTitle.length > 50
            ? data.boqTitle.slice(0, 50) + "..."
            : data.boqTitle
        }`
      );
      localStorage.removeItem("boqCompleted");
    } catch (err) {
      console.error("Error loading BOQ:", err);
      toast.error("Error loading BOQ");
    }
  };

  const fetchSavedBOQs = async () => {
    try {
      const { data, error } = await supabase
        .from("boq_data_new")
        .select("id, created_at, boqTitle")
        .eq("userId", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching BOQs:", error);
        return;
      }

      setBoqList(data);
    } catch (err) {
      console.error("Error fetching BOQs:", err);
    }
  };

  const calculateGrandTotal = () => {
    let grandTotal = (Array.isArray(selectedData) ? selectedData : []).reduce(
      (total, product) => {
        let productTotal = product.finalPrice || 0;

        let addonsTotal = (product.addons || []).reduce(
          (addonSum, addon) => addonSum + (addon.finalPrice || 0),
          0
        );

        return total + productTotal + addonsTotal;
      },
      0
    );
    if (userResponses.flooring === "bareShell") {
      grandTotal += 150 * totalArea;
    }
    setBoqTotal(grandTotal);
  };

  useEffect(() => {
    calculateGrandTotal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  const handleSaveBOQ = async (boqTitle) => {
    try {
      const products = selectedData.map((product) => ({
        id: product.product_variant?.variant_id,
        title: product.product_variant?.variant_title,
        finalPrice: product.finalPrice || "",
        groupKey: product.groupKey,
        quantity: product.quantity,
      }));
      const addons = selectedData.flatMap((product) =>
        (product.addons || []).map((addon) => ({
          variantId: addon.id,
          addonId: addon.addonid,
          title: addon.title,
          finalPrice: addon.price || "",
          productId: product.product_variant?.variant_id,
        }))
      );
      const answers = [
        {
          height: userResponses.height || "",
          flooring: userResponses.flooring || "",
          demolishTile: userResponses.demolishTile || "",
          hvacType: userResponses.hvacType || "",
        },
      ];

      const { error } = await supabase.from("boq_data_new").insert([
        {
          userId: accountHolder.userId,
          products: products,
          addons: addons,
          boqTitle: boqTitle,
          layoutId: currentLayoutData.id,
          answers: answers,
          planType: selectedPlan,
          boqTotalPrice: boqTotal,
        },
      ]);
      if (error) {
        console.error("Error during insertion:", error);
      } else {
        toast.success("BOQ saved successfully!");
        setBOQTitle(boqTitle);
      }
    } catch (error) {
      console.error("Error during insertion:", error);
    }
  };

  const handleUpdateBOQ = async (boqId) => {
    try {
      const products = selectedData.map((product) => ({
        id: product.product_variant?.variant_id,
        title: product.product_variant?.variant_title,
        finalPrice: product.finalPrice || "",
        groupKey: product.groupKey,
        quantity: product.quantity,
      }));
      const addons = selectedData.flatMap((product) =>
        (product.addons || []).map((addon) => ({
          variantId: addon.id,
          addonId: addon.addonid,
          title: addon.title,
          finalPrice: addon.price || "",
          productId: product.product_variant?.variant_id,
        }))
      );
      const answers = [
        {
          height: userResponses.height || "",
          flooring: userResponses.flooring || "",
          demolishTile: userResponses.demolishTile || "",
          hvacType: userResponses.hvacType || "",
        },
      ];
      const { error } = await supabase
        .from("boq_data_new")
        .update({
          products: products,
          addons: addons,
          answers: answers,
          planType: selectedPlan,
          boqTotalPrice: boqTotal,
        })
        .eq("id", boqId);
      if (error) {
        console.error("Error updating existing BOQ:", error);
        toast.error("Failed to update BOQ.");
      } else {
        toast.success("BOQ updated successfully!");
      }
    } catch (error) {
      console.error("Error during update", error);
    }
  };

  const handleBoqNameConfirm = (nameOrId, isNew = true) => {
    setShowBoqPrompt(false);

    if (isNew) {
      handleSaveBOQ(nameOrId);
    } else {
      handleUpdateBOQ(nameOrId);
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
    if (selectedData.length === 0) {
      toast.error("Please add a product to download BOQ.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("boq_data_new")
        .select("isDraft, boqTitle")
        .eq("id", BOQID)
        .single();

      if (error) {
        console.error("Error fetching BOQ details:", error);
        toast.error("Unable to check BOQ status. Please try again.");
        return;
      }

      if (data?.isDraft && data?.boqTitle === BOQTitle) {
        toast.error("Please save the BOQ before downloading.");
        setShowBoqPrompt(true);
        return;
      }

      setIsDownloading(true);

      await PDFGenerator.generatePDF(
        selectedData,
        boqTotal,
        accountHolder.companyName,
        accountHolder.location,
        quantityData,
        areasData,
        categories,
        BOQTitle,
        userResponses,
        productQuantity
      );

      setIsDownloading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="navbar sticky top-0 z-30 font-Poppins">
      <div className="flex justify-between bg-gradient-to-r from-[#23445B] to-[#487BA0] items-center px-3 md:px-6 3xl:px-40 h-[50px]">
        <div className="hidden sm:block absolute lg:flex gap-2 right-1/4 lg:right-20 -translate-x-full"></div>
        <button className="" onClick={handlelogo}>
          <img
            src="/logo/workved-logo.png"
            alt="Workved Interior logo"
            className="h-auto md:h-8 lg:h-10 w-16 lg:w-24 "
          />
        </button>
        <div className="flex gap-3 items-center">
          {BOQTitle && (
            <h1 className="hidden sm:block text-white font-semibold text-sm pr-3">
              {BOQTitle.length > 20 ? BOQTitle.slice(0, 20) + "..." : BOQTitle}
            </h1>
          )}
          {boqTotal > 0 && (
            <div className="flex justify-center items-center bg-[#FFF] rounded-sm text-[10px] md:text-xs px-2 md:px-5 h-fit py-2 md:py-3 self-center text-black border-solid border-1 border-black">
              <span className="font-bold">Total</span>: ₹{" "}
              {boqTotal.toLocaleString("en-IN")}
            </div>
          )}
          <div
            className="z-30 rounded-full"
            ref={iconRef}
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              onClick={toggleProfile}
              src={accountHolder.profileImage}
              alt="usericon"
              className="w-10 md:w-12 h-10 p-1 md:h-12 cursor-pointer rounded-full"
            />
          </div>
        </div>
      </div>
      {isMobile ? (
        selectedPlan ? (
          <div className="bg-[#212B36] py-1 flex justify-between items-center px-3 md:px-6 relative">
            <div className="w-10/12 py-2.5">
              <div className="relative h-5 bg-[#385682] rounded-sm">
                <div
                  className="absolute h-full bg-[#85AED2] rounded-sm"
                  style={{ width: `${progress}%` }}
                ></div>
                <div
                  className="absolute top-0 transform -translate-x-1/2 bg-gradient-to-br from-[#334A78] to-[#1F2937] border-white rounded-sm glowing-circle"
                  style={{
                    left: `${progress}%`,
                    width: "10px",
                    height: "19px",
                  }}
                ></div>
              </div>
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
                <ul className="bg-white text-[#374A75] rounded-md m-3 py-6 px-4 text-center border">
                  <li
                    onClick={() => setIslayoutWarning((prev) => !prev)}
                    className="hover:px-2 hover:bg-[#334A78] hover:text-white mb-0 py-2 px-2 cursor-pointer border border-[#CCCCCC]"
                  >
                    Go To Layout
                  </li>
                  <li
                    onClick={() => {
                      setShowLayoutDetails(true);
                      setMobileDropDown(false);
                    }}
                    className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-0 py-2 px-2 cursor-pointer border border-[#CCCCCC]"
                  >
                    Layout Details
                  </li>
                  <li
                    onClick={() => {
                      handleDownload();
                      setMobileDropDown(false);
                    }}
                    className="hover:px-2 hover:bg-white hover:text-[#1A3A36] mb-0 py-2 px-2 cursor-pointer border border-[#CCCCCC]"
                  >
                    Download
                  </li>
                  <li className="hover:bg-white hover:text-[#1A3A36] mb-0 py-2 px-2 border border-[#CCCCCC]">
                    <div
                      className="flex items-center text-center justify-center ml-2"
                      ref={dropdownRef}
                    >
                      <button
                        onClick={() => {
                          if (!selectedData || selectedData.length === 0) {
                            toast.error("No selected data to save.");
                            return;
                          }
                          setShowBoqPrompt(true);
                          setIsProfileCard(false);
                          setIsSaveBOQ(true);
                          setMobileDropDown(false);
                        }}
                      >
                        Save BOQ
                      </button>
                      <button
                        onClick={() => {
                          fetchSavedBOQs();
                          setIsOpen(!isOpen);
                        }}
                      >
                        <RiArrowDropDownLine />
                      </button>

                      {isOpen && (
                        <ul className="absolute left-0 top-0 min-w-[100px] mt-2 w-auto text-xs bg-white rounded-lg shadow-md">
                          <li className="px-4 py-3 grid grid-cols-[2fr_1fr] font-semibold bg-[#374A75] text-center text-white rounded-t-lg shadow-md">
                            <span className="text-left">Title</span>
                            <span className="text-center">Actions</span>
                          </li>
                          {boqList.length > 0 ? (
                            boqList.map((boq) => (
                              <li
                                key={boq.id}
                                className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100"
                              >
                                <span className="text-left break-words text-[#374A75] whitespace-normal">
                                  {boq.boqTitle}
                                  {boq.boqTitle === BOQTitle && "*"}
                                </span>

                                <div className="flex justify-center gap-2">
                                  <img
                                    src="../images/icons/download.png"
                                    alt="Downlaod"
                                    className="cursor-pointer h-6 w-6"
                                    onClick={() => handleLoadBOQ(boq.id)}
                                  />
                                  <img
                                    src="../images/icons/delete.png"
                                    alt="Delete"
                                    className="cursor-pointer h-6 w-6"
                                    onClick={() => {
                                      if (boq.id === BOQID) {
                                        toast.error(
                                          "Cannot delete current BOQ!"
                                        );
                                      } else {
                                        setDeleteAlert(true);
                                        setSelectedboqid(boq.id);
                                      }
                                    }}
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
          </div>
        ) : null
      ) : selectedPlan ? (
        <div className="bg-[#212B36] py-2.5 flex px-3 md:px-6 3xl:px-40">
          <div className=" flex items-center gap-1">
            <button
              className="bg-[#FFF] text-xs py-2 px-5 text-[#000] font-semibold rounded-[4px] border-solid border-[1px] border-black"
              onClick={() => setIslayoutWarning((prev) => !prev)}
            >
              Go to Layout
            </button>
            <button
              onClick={() => setShowLayoutDetails(true)}
              className="bg-[#FFF] text-xs py-2 px-5 text-[#000] font-semibold rounded-[4px] border-solid border-[1px] border-black capitalize"
            >
              layout details
            </button>
          </div>
          <div className="w-7/12 lg:w-2/5 xl:w-7/12 mx-auto pl-2 py-2.5">
            <div className="relative h-5 bg-[#385682] rounded-sm">
              <div
                className="absolute h-full bg-[#85AED2] rounded-sm"
                style={{ width: `${progress}%` }}
              ></div>
              <div
                className="absolute top-0 transform -translate-x-full bg-gradient-to-br from-[#334A78] to-[#1F2937]  rounded-sm glowing-circle"
                style={{ left: `${progress}%`, width: "10px", height: "18px" }}
              ></div>
              <div
                className={`absolute -top-full -translate-y-3/4 bg-[#f4f4f4] text-black text-[10px] px-3 py-1 rounded-md`}
                style={{ left: `${progress - 3}%` }}
              >
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></span>
                {`${progress}%`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="relative inline-flex items-center border border-black rounded-[4px] bg-white"
              ref={dropdownRef}
            >
              <button
                onClick={() => {
                  if (!selectedData || selectedData.length === 0) {
                    toast.error("No selected data to save.");
                    return;
                  }
                  setShowBoqPrompt(true);
                  setIsProfileCard(false);
                }}
                className="bg-white text-xs py-2 px-3 text-black rounded-l-[4px] font-semibold"
              >
                Save BOQ
              </button>
              <button
                onClick={() => {
                  fetchSavedBOQs();
                  setIsOpen(!isOpen);
                }}
                className="bg-white px-3 py-2 border-l border-black flex items-center rounded-r-[4px] h-full"
              >
                <RiArrowDropDownLine />
              </button>

              {isOpen && (
                <ul className="absolute left-0 top-7 min-w-[200px] mt-2 w-auto bg-white rounded-lg shadow-md">
                  <li className="px-4 py-3 grid grid-cols-[2fr_1fr] font-semibold bg-[#374A75] text-center text-white rounded-t-lg shadow-md">
                    <span className="text-left">Title</span>
                    <span className="text-center">Actions</span>
                  </li>

                  {boqList.length > 0 ? (
                    boqList.map((boq) => (
                      <li
                        key={boq.id}
                        className="px-4 py-2 grid grid-cols-[2fr_1fr] items-center hover:bg-gray-100"
                      >
                        <div
                          className="flex items-center cursor-default max-w-[100px]"
                          title={boq.boqTitle}
                          aria-label={boq.boqTitle}
                        >
                          {boq.boqTitle === BOQTitle && (
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shrink-0"></span>
                          )}
                          <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                            {boq.boqTitle}
                          </span>
                        </div>
                        <div className="flex justify-left gap-3">
                          <img
                            src="../images/icons/download.png"
                            alt="Download"
                            className="cursor-pointer h-6 w-6"
                            onClick={() => handleLoadBOQ(boq.id)}
                            title="Load BOQ"
                            aria-label="Load BOQ"
                          />
                          <img
                            src="../images/icons/delete.png"
                            alt="Delete"
                            className="cursor-pointer h-6 w-6"
                            title="Delete BOQ"
                            aria-label="Delete BOQ"
                            onClick={() => {
                              if (boq.id === BOQID) {
                                toast.error("Cannot delete current BOQ!");
                              } else {
                                setDeleteAlert(true);
                                setSelectedboqid(boq.id);
                              }
                            }}
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
              <AnimatedButton
                onClick={handleDownload}
                className="!bg-[#3A5D7B] text-white capitalize font-Georgia font-semibold tracking-wider !px-6 !py-4 transition-shadow" //hover:shadow-[10px_10px_20px_rgba(0,0,0,0.8)]
                variant="default"
                size="sm"
                textEffect="shimmer"
                rounded="custom"
                asChild={false}
                hideAnimations={false}
                shimmerColor="#fff"
                shimmerSize="0.15em"
                shimmerDuration="3s"
                borderRadius="10px"
                background="rgba(48, 71, 120, 1)"
                hovereBackground="linear-gradient(90deg,rgba(85,132,182,1)  0%,  rgba(117,162,190,1) 100%)"
              >
                {isDownloading ? "Downloading..." : "Download"}
              </AnimatedButton>
            </div>
          </div>
        </div>
      ) : null}
      {showBoqPrompt &&
        createPortal(
          <BoqPrompt
            onConfirm={handleBoqNameConfirm}
            onCancel={() => setShowBoqPrompt(false)}
            isProfileCard={isProfileCard}
            setIsProfileCard={setIsProfileCard}
          />,
          document.body
        )}
      {completed100 &&
        createPortal(
          <Boqcompleted setCompleted100={setCompleted100} />,
          document.body
        )}
      {showLayoutDetails && (
        <CurrentLayoutDetails onClose={() => setShowLayoutDetails(false)} />
      )}

      {deleteAlert && (
        <div className="fixed inset-0 bg-black/20 pt-4">
          <AlertBox
            onClose={setDeleteAlert}
            onconfirm={handleDeleteBOQ}
            boqid={selectedboqid}
            removeboqid={setSelectedboqid}
          />
        </div>
      )}

      {isLayoutWarning && (
        <GobackLayoutWarning
          onConfirm={handleGoTOlayout}
          onCancel={() => setIslayoutWarning(false)}
        />
      )}
    </div>
  );
}

export default Navbar;
