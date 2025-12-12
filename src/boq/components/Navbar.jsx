import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import PDFGenerator from "./PDFGenerator";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import BoqPrompt from "./BoqPrompt";
import Boqcompleted from "../../common-components/Boqcompleted";
import AlertBox from "./AlertBox";
import CurrentLayoutDetails from "./CurrentLayoutDetails";
import GobackLayoutWarning from "./GobackLayoutWarning";
import TopBar from "./TopBar";
import DesktopActions from "./DesktopActions";
import MobileActions from "./MobileActions";
import { fetchFilteredBOQProducts } from "../utils/BoqUtils";

const useBodyNoScroll = (active) => {
  useEffect(() => {
    if (active) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [active]);
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};

const formatBoqTitle = (title, max = 50) =>
  title.length > max ? `${title.slice(0, max)}...` : title;

const buildProductsPayload = (selectedData) =>
  selectedData.map((p) => ({
    id: p.product_variant?.variant_id,
    title: p.product_variant?.variant_title,
    finalPrice: p.finalPrice || "",
    groupKey: p.groupKey,
    quantity: p.quantity,
  }));

const buildAddonsPayload = (selectedData) =>
  selectedData.flatMap((product) =>
    (product.addons || []).map((addon) => ({
      variantId: addon.id,
      addonId: addon.addonid,
      title: addon.title,
      finalPrice: addon.price || "",
      productId: product.product_variant?.variant_id,
    }))
  );

const buildAnswersPayload = (userResponses) => [
  {
    height: userResponses.height || "",
    flooring: userResponses.flooring || "",
    demolishTile: userResponses.demolishTile || "",
    hvacType: userResponses.hvacType || "",
  },
];

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
  const [completed100, setCompleted100] = useState(
    () => localStorage.getItem("boqCompleted") === "done"
  );
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedboqid, setSelectedboqid] = useState(null);
  const dropdownRef = useRef(null);
  const [mobileDropDown, setMobileDropDown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLayoutDetails, setShowLayoutDetails] = useState(false);
  const [isLayoutWarning, setIslayoutWarning] = useState(false);

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
  } = useApp();

  useClickOutside(dropdownRef, () => setIsOpen(false));
  useBodyNoScroll(showLayoutDetails);

  useEffect(() => {
    const ok =
      progress === 100 &&
      localStorage.getItem("boqCompleted") !== "done" &&
      !completed100;
    if (ok) {
      setCompleted100(true);
      localStorage.setItem("boqCompleted", "done");
    }
  }, [progress, completed100]);

  const navigate = useNavigate();
  const handleGoTOlayout = () => navigate("/Layout");
  const handleLogo = () => navigate("/");

  const handleDeleteBOQ = async (boqId) => {
    try {
      const { error } = await supabase
        .from("boq_data_new")
        .delete()
        .eq("id", boqId);
      if (error) {
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
      if (error || !data) {
        toast.error("Failed to load BOQ");
        return;
      }
      const { data: layoutData, error: layoutError } = await supabase
        .from("layout")
        .select("*")
        .eq("id", data.layoutId)
        .single();
      if (layoutError) return;

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
      toast.success(`Loaded BOQ: ${formatBoqTitle(data.boqTitle)}`);
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
      if (error) return;
      setBoqList(data || []);
    } catch (err) {
      console.error("Error fetching BOQs:", err);
    }
  };

  const calculateGrandTotal = () => {
    const grandTotal = (Array.isArray(selectedData) ? selectedData : []).reduce(
      (total, product) => {
        const productTotal = product.finalPrice || 0;
        const addonsTotal = (product.addons || []).reduce(
          (addonSum, addon) => addonSum + (addon.finalPrice || 0),
          0
        );
        return total + productTotal + addonsTotal;
      },
      0
    );
    const withFloor =
      userResponses.flooring === "bareShell"
        ? grandTotal + 150 * totalArea
        : grandTotal;
    setBoqTotal(withFloor);
  };

  useEffect(() => {
    calculateGrandTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  const handleSaveBOQ = async (boqTitle) => {
    try {
      const { error } = await supabase.from("boq_data_new").insert([
        {
          userId: accountHolder.userId,
          products: buildProductsPayload(selectedData),
          addons: buildAddonsPayload(selectedData),
          boqTitle,
          layoutId: currentLayoutData.id,
          answers: buildAnswersPayload(userResponses),
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
      const { error } = await supabase
        .from("boq_data_new")
        .update({
          products: buildProductsPayload(selectedData),
          addons: buildAddonsPayload(selectedData),
          answers: buildAnswersPayload(userResponses),
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
    if (isNew) handleSaveBOQ(nameOrId);
    else handleUpdateBOQ(nameOrId);
  };

  const handleDownload = async () => {
    if (!selectedData.length) {
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
        quantityData,
        areasData,
        categories,
        BOQTitle,
        userResponses
      );
      setIsDownloading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsDownloading(false);
    }
  };

  const dropdownPropsBase = {
    boqList,
    BOQTitle,
    BOQID,
    isOpen,
    setIsOpen,
    dropdownRef,
    fetchSavedBOQs,
    handleLoadBOQ,
    setDeleteAlert,
    setSelectedboqid,
  };

  const onSaveClick = () => {
    if (!selectedData?.length) {
      toast.error("No selected data to save.");
      return;
    }
    setShowBoqPrompt(true);
    setIsProfileCard(false);
    setIsSaveBOQ(true);
  };

  const dropdownProps = { ...dropdownPropsBase, onSaveClick };

  return (
    <div className="navbar sticky top-0 z-30 font-Poppins">
      <TopBar
        handleLogo={handleLogo}
        BOQTitle={BOQTitle}
        boqTotal={boqTotal}
        accountHolder={accountHolder}
        iconRef={iconRef}
        toggleProfile={toggleProfile}
      />
      {selectedPlan &&
        (isMobile ? (
          <MobileActions
            progress={progress}
            mobileDropDown={mobileDropDown}
            setMobileDropDown={setMobileDropDown}
            setIslayoutWarning={setIslayoutWarning}
            setShowLayoutDetails={setShowLayoutDetails}
            dropdownProps={dropdownProps}
            handleDownload={handleDownload}
          />
        ) : (
          <DesktopActions
            progress={progress}
            setIslayoutWarning={setIslayoutWarning}
            setShowLayoutDetails={setShowLayoutDetails}
            dropdownProps={dropdownProps}
            handleDownload={handleDownload}
            isDownloading={isDownloading}
          />
        ))}
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
