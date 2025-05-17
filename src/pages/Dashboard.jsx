import { RiDashboardFill } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { VscEye } from "react-icons/vsc";
import { CiMenuKebab } from "react-icons/ci";
import UserProfile from "./user/UserProfile";
import UserSetting from "./user/UserSetting";
import { FaArrowLeft } from "react-icons/fa6";
import { VscSignOut } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import { LuBlend } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";
import { BsQuestionCircle } from "react-icons/bs";
import Spinner from "../common-components/Spinner";
import DashboardProductCard from "./vendor/DashboardProductCard";
import SidebarItem from "../common-components/SidebarItem";
import Help from "./user/Help";
import ReactApexChart from "react-apexcharts";
import { TbFileInvoice } from "react-icons/tb";
// const percentage = 66;

const fullNames = {
  linear: "Linear Workspace",
  lType: "L-Type Workspace",
  md: "MD Cabin",
  manager: "Manager Cabin",
  small: "Small Cabin",
  ups: "UPS Room",
  bms: "BMS Room",
  server: "Server Room",
  reception: "Reception",
  lounge: "Lounge/Pantry",
  fitness: "Fitness Zone",
  sales: "Sales Team",
  phoneBooth: "Phone Booth",
  discussionRoom: "Discussion Room",
  interviewRoom: "Interview Room",
  conferenceRoom: "Conference Room",
  boardRoom: "Board Room",
  meetingRoom: "Meeting Room",
  meetingRoomLarge: "Meeting Room (Large)",
  hrRoom: "HR Room",
  financeRoom: "Finance Room",
  executiveWashroom: "Executive Washroom",
  breakoutRoom: "Breakout Room",
  videoRecordingRoom: "Video Recording Room",
  other: "Other", // Add new category here
  // maleWashroom: "Male Washroom",
  // femaleWashroom: "Female Washroom",
  washrooms: "Washrooms",
};

const colors = {
  "Linear Workspace": "#62897E",
  "L-Type Workspace": "#3F5855",
  "MD Cabin": "#1D3130",
  "Manager Cabin": "#293C3E",
  "Small Cabin": "#4A5E65",
  "UPS Room": "#737F85",
  "BMS Room": "#8CDDCE",
  "Server Room": "#54A08C",
  Reception: "#368772",
  "Lounge/Pantry": "#2A3338",
  "Video Recording Room": "#354044",
  "Sales Team": "#3C464F",
  "Phone Booth": "#515554",
  "Discussion Room": "#868A8E",
  "Interview Room": "#A4ACAF",
  "Conference Room": "#488677",
  "Board Room": "#3A4B45",
  "Meeting Room": "#1E8D78",
  "Meeting Room (Large)": "#07281D",
  "HR Room": "#233736",
  "Finance Room": "#081011",
  "Executive Washroom": "#567F7D",
  "Breakout Room": "#74D0C1",
  "Available Space": "#1F5C54",
  Other: "#5E9B96", // Color for the "Other" category
  // "Male Washroom": "#95D5B2",
  // "Female Washroom": "#85CEA8",
  Washrooms: "#85CEA8",
};

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  // const [productlist, setProductlist] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [iseditopen, setIsEditopen] = useState(true);
  const [dashboard, setDashboard] = useState(true);
  const [currentSection, setCurrentSection] = useState("Dashboard");
  const [help, setHelp] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [boqdata, setboqdata] = useState();
  const {
    accountHolder,
    setAccountHolder,
    setIsAuthLoading,
    setIsAuthenticated,
    setTotalArea,
    // layoutImage,
    currentLayoutData,
    totalArea,
    currentLayoutID,
  } = useApp();

  //selectedboq
  const [selectedBoq, setSelectedBoq] = useState();

  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);

  const menuRef = useRef({});
  const buttonRef = useRef({});

  // loading
  const [isloading, setIsloading] = useState(false);
  const [productlist, setProductlist] = useState(true);
  const [imageIsLoaded, setImageIsLoaded] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null); // Store the ID of the row with an open menu
  // const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);

  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default (gets updated dynamically)
  const [currentPage, setCurrentPage] = useState(1);
  const items = toggle ? products : addons;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const tableRef = useRef(null);
  //boqdata available or not
  const [isboqavailable, setIsboqavailable] = useState(false);
  const [isfetchBoqDataRefresh, setisfetchBoqDataRefresh] = useState(false);
  const [currentAreaValues, setCurrentAreaValues] = useState({});
  const [currentAreaQuantities, setCurrentAreaQuantities] = useState({});

  //baseurlforimg
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchAddonsByIds = async () => {
    try {
      setIsloading(true);
      if (!selectedBoq) {
        return;
      }

      if (selectedBoq && selectedBoq.addon_varaint_id) {
        const productIdsArray = selectedBoq.addon_varaint_id
          .split(",")
          .map((id) => id.trim());

        const { data } = await supabase
          .from("addon_variants")
          .select("*")
          .in("id", productIdsArray); // Use Supabase `in()` filter

        console.log(data);

        setAddons(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  //fetch the product based on the selected boq
  const fetchProductsByIds = async () => {
    console.log("hello from the product ");

    try {
      if (selectedBoq) {
        setIsloading(true);

        console.log(selectedBoq);

        const productIdsArray = selectedBoq.product_variant_id
          .split(",")
          .map((id) => id.trim()); // Convert to array of numbers

        const { data, error } = await supabase
          .from("product_variants")
          .select("*,products(*)")
          .in("id", productIdsArray); // Use Supabase `in()` filter

        if (data) {
          setProducts(data);
        }

        if (error) {
          throw new Error(error);
        }

        console.log(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };
  // const fetchProductsByIds = async () => {
  //   console.log("hello from the product ");

  //   try {
  //     setIsloading(true);
  //     if (!selectedBoq) {
  //       return;
  //     }

  //     console.log(selectedBoq);

  //     const productIdsArray = selectedBoq.product_variant_id
  //       .split(",")
  //       .map((id) => id.trim()); // Convert to array of numbers

  //     const { data } = await supabase
  //       .from("product_variants")
  //       .select("*,products(*)")
  //       .in("id", productIdsArray); // Use Supabase `in()` filter

  //     console.log(data);

  //     setProducts(data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsloading(false);
  //   }
  // };
  useEffect(() => {
    if (!currentLayoutData) return;

    const areas = {};
    const quantities = {};

    Object.entries(currentLayoutData).forEach(([key, value]) => {
      if (key.includes("Area")) {
        const name = key.replace("Area", "");
        areas[name] = value;
      } else if (key.includes("Qty")) {
        const name = key.replace("Qty", "");
        quantities[name] = value;
      }
    });

    console.log("Extracted Areas and Quantities:", areas, quantities);

    setCurrentAreaValues(areas);
    setCurrentAreaQuantities(quantities);
    console.log("current areas", currentAreaValues);
    console.log("current quantities", currentAreaQuantities);
  }, [currentLayoutData, totalArea, currentLayoutID]);

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleProductPreview = (product) => {
    console.log("in function handleProductPreview", product);

    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleDelete = async (product) => {
    if (!product.id) return;

    try {
      const { error } = await supabase
        .from("product_variants") // Ensure this matches your table name
        .delete()
        .eq("id", product.id);

      if (error) throw error; // Throw error to be caught in catch block

      toast.success("Product deleted successfully!");
      setProductPreview(false); // Close the modal after deletion
    } catch (error) {
      toast.error("Failed to delete product.");
      console.error("Delete error:", error);
    }
    // fetchProducts(1); // Fetch products after deletion
  };

  const handleTabClick = (event) => {
    setProductlist(true);
    // setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
  };

  const handlesetting = () => {
    setIsProductOpen(false);
    setDashboard(false);
    setIsSettingOpen(true);
    setHelp(false);
    setCurrentSection("Setting");
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setDashboard(false);
    setIsProductOpen(true);
    setHelp(false);
    setCurrentSection("Product");
  };

  const handlecheckboqdetails = (boq) => {
    setIsSettingOpen(false);
    setDashboard(false);
    setIsProductOpen(true);
    setHelp(false);
    setSelectedBoq(boq);
    setCurrentSection("Product");
  };

  const handledashboard = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(true);
    setHelp(false);
    setCurrentSection("Dashboard");
  };

  const handlehelp = () => {
    setIsSettingOpen(false);
    setIsProductOpen(false);
    setDashboard(false);
    setHelp(true);
    setCurrentSection("Help");
  };

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Error signing out:", error.message);
      } else {
        toast.success("User signed out successfully");
        setAccountHolder({
          companyName: "",
          email: "",
          phone: "",
          role: "",
          userId: "",
        });
        console.log("hello");
        setTotalArea("");
        localStorage.removeItem("currentLayoutID");
        navigate("/");
        setIsAuthenticated(false);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const fetchboq = async () => {
    try {
      const { data } = await supabase
        .from("boqdata")
        .select("*")
        .eq("userId", accountHolder.userId);

      console.log("fetch boq data", data);

      setboqdata(data);
      // selectedBoq(data.boq);
      if (data.length > 0) {
        setSelectedBoq(data[0]);
        setIsboqavailable(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handledeleteBoq = async (boq) => {
    setisfetchBoqDataRefresh(true);
    try {
      const { error } = await supabase
        .from("boqdata") // Replace with your table name
        .delete()
        .eq("id", boq.id); // Filtering by id

      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      console.log("something went wrong", error);
    } finally {
      setSelectedBoq(() => null);
      setisfetchBoqDataRefresh(false);
    }
  };

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (tableRef.current) {
        const tableHeight = tableRef.current.clientHeight; // Get table's available height
        const rowHeight = 60; // Approximate row height (adjust if needed)
        const headerHeight = 50; // Height of the table header
        const maxRows = Math.floor((tableHeight - headerHeight) / rowHeight);

        // setItemsPerPage(maxRows > 0 ? maxRows : 1); // Ensure at least 1 row is shown
      }
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  useEffect(() => {
    fetchProductsByIds();
    fetchAddonsByIds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoq, isfetchBoqDataRefresh]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking inside the menu OR the menu button, do nothing
      if (
        openMenuId !== null &&
        (menuRef.current[openMenuId]?.contains(event.target) ||
          buttonRef.current[openMenuId]?.contains(event.target))
      ) {
        return;
      }

      // Otherwise, close the menu
      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  // console.log("layout image", layoutImage);

  useEffect(() => {
    if (location.state?.openSettings) {
      setIsProductOpen(false);
      setDashboard(false);
      setIsSettingOpen(true);
      setHelp(false);
      setCurrentSection("Setting");
    }
    if (location.state?.openHelp) {
      setIsSettingOpen(false);
      setIsProductOpen(false);
      setDashboard(false);
      setHelp(true);
      setCurrentSection("Help");
    }
  }, [location.state]);

  useEffect(() => {
    fetchboq();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isfetchBoqDataRefresh]);

  // useEffect(() => {
  //   if (layoutImage && !imageIsLoaded) {
  //     setImageIsLoaded(true);
  //   }
  // }, [layoutImage, imageIsLoaded]);

  // console.log("selectedboq", selectedBoq);

  const validTotalArea = currentAreaValues.total;
  const builtArea = Object.keys(currentAreaQuantities).reduce(
    (acc, key) => acc + currentAreaQuantities[key] * currentAreaValues[key],
    0
  );
  const availableArea = validTotalArea - builtArea;

  const series = [
    ...Object.keys(currentAreaQuantities).map((key) => {
      const areaOccupied = currentAreaQuantities[key] * currentAreaValues[key];
      const percentage = ((areaOccupied / validTotalArea) * 100).toFixed(2);
      return {
        x: `${fullNames[key] || key}: ${percentage}%`,
        y: `${areaOccupied} sq ft`,
        fillColor: colors[fullNames[key]] || "#000000",
      };
    }),
    {
      x: `Available Space: ${((availableArea / validTotalArea) * 100).toFixed(
        2
      )}%`,
      y: availableArea,
      fillColor: colors["Available Space"],
    },
  ];

  const options = {
    chart: {
      type: "treemap",
      height: 250,
      toolbar: {
        show: true,
      },
    },
    title: {
      text: "Area Distribution of Workspaces",
      align: "center",
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14rem",
        fontWeight: "bold",
        colors: ["#FFFFFF"],
      },
      formatter: (val, opts) => {
        if (typeof val === "number") {
          const percentage = ((val / validTotalArea) * 100).toFixed(2);
          return `${
            opts.w.globals.labels[opts.dataPointIndex]
          } (${percentage}%)`;
        }
        return `${opts.w.globals.labels[opts.dataPointIndex]}: ${val}`;
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.1,
        },
      },
    },
  };

  return (
    <div className="bg-[url('images/bg/vendor.png')] bg-cover bg-center bg-no-repeat p-3 xl:p-5">
      <div className="flex gap-3 max-h-fit overflow-hidden bg-white rounded-3xl">
        {/* sidebar */}
        <div
          className={`max-h-screen sticky left-0 top-0 bottom-0 bg-white shadow-lg transition-all duration-300 ${
            isExpanded ? "max-w-sm w-60 absolute" : "w-16"
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          {/* Logo */}
          <div className="cursor-pointer flex justify-center items-center py-4">
            <img
              src="/logo/workved-interior.png"
              alt="Logo"
              className={`${isExpanded ? "h-20 w-32" : "size-12"}`}
              onClick={() => navigate("/")}
            />
          </div>

          {/* Menu Items */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
            <h3
              className={`capitalize text-[#A1A1A1] ${
                isExpanded ? "mx-4" : "hidden"
              }`}
            >
              main
            </h3>
            <SidebarItem
              icon={<TbFileInvoice />}
              text="BOQ"
              onClick={() => navigate("/boq")}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<RiDashboardFill />}
              text="Dashboard"
              onClick={handledashboard}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<LuBlend />}
              text="Product"
              onClick={handleproduct}
              isExpanded={isExpanded}
            />
          </div>

          {/* Other Items */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-4 text-[#262626] flex flex-col gap-4 px-3">
            <h3
              className={`capitalize text-[#A1A1A1] ${
                isExpanded ? "mx-4" : "hidden"
              }`}
            >
              other
            </h3>
            <SidebarItem
              icon={<BsQuestionCircle />}
              text="Help"
              onClick={handlehelp}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<IoSettingsSharp />}
              text="Setting"
              onClick={handlesetting}
              isExpanded={isExpanded}
            />
            <SidebarItem
              icon={<VscSignOut />}
              text="Logout"
              onClick={handleLogout}
              isExpanded={isExpanded}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 border-[#194F48] rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">
                {currentSection}
              </h3>
            </div>
            <div className="mx-3">
              <img
                src={accountHolder.profileImage}
                alt="usericon"
                className="w-10 h-10"
              />
            </div>
          </div>

          {/* div for dashboard */}
          {dashboard && (
            <div className="w-full  border-2 border-[#194F48] rounded-3xl my-2.5">
              {/* for dashboard */}
              <div className="w-full flex overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] py-2 px-3">
                {/* dashboard area layout */}
                <div className="w-2/3">
                  <div className="p-4">
                    <h2 className="capitalize font-bold mb-2">
                      Layout Information
                    </h2>
                    {/* div containing information */}
                    <div className="flex gap-10">
                      {/* each icon  */}
                      <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
                        <div>
                          <img
                            src="/images/layouticon.png"
                            alt=" dashboard layout "
                            className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                          />
                        </div>
                        <div className="capitalize pr-10">
                          <p className="font-bold text-lg">
                            {/* {selectedBoq.total_area} */}
                            {selectedBoq && selectedBoq.total_area}
                            <span>sqft</span>
                          </p>
                          <p className="text-base">total area</p>
                        </div>
                      </div>
                      {/* each icon  */}
                      <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
                        <div>
                          <img
                            src="/images/totalproduct.png"
                            alt=" dashboard layout "
                            className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                          />
                        </div>
                        <div className="capitalize pr-10">
                          <p className="font-bold text-lg">
                            {/* 1500 <span>sqft</span> */}
                            {/* {products.length} */}
                            {selectedBoq && products && products.length}{" "}
                          </p>
                          <p className="text-base">Total No Product</p>
                        </div>
                      </div>
                      {/* each icon  */}
                      <div className="xl:flex justify-around items-center gap-3  py-3 px-2">
                        <div>
                          <img
                            src="/images/grandtotal.png"
                            alt=" dashboard layout "
                            className="w-[45px] h-[45px] xl:w-[60px] xl:h-[60px]"
                          />
                        </div>
                        <div className="capitalize pr-10">
                          <p className="font-bold text-lg">
                            {/* 1500 <span>sqft</span> */}
                            {selectedBoq && selectedBoq.totalprice}{" "}
                            <span>INR</span>
                          </p>
                          <p className="text-base">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* dashboard boq part */}
                  <div className="p-3">
                    <h3 className="capitalize font-bold ">BOQ generated</h3>

                    {/* boq card */}
                    {isboqavailable &&
                      boqdata.map((boq, index) => {
                        return (
                          <div
                            key={boq.title}
                            className="rounded-3xl border-2 border-[#ccc] max-w-sm p-2 mb-3"
                          >
                            <div className="flex justify-end gap-2 p-2">
                              {/* <MdOutlineModeEdit size={30} /> */}
                              <button
                                className="px-5 py-1 bg-green-300  rounded-2xl capitalize"
                                onClick={() => handlecheckboqdetails(boq)}
                              >
                                details
                              </button>
                              <button onClick={() => handledeleteBoq(boq)}>
                                {" "}
                                <MdDeleteOutline size={30} />
                              </button>
                            </div>
                            <div>
                              <h3 className="font-bold">{boq.title}</h3>
                            </div>
                          </div>
                        );
                      })}

                    {!isboqavailable && (
                      <div>
                        <h3>You havent saved a BOQ yet</h3>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-1/3  flex justify-center">
                  <div className="border-2 p-4 rounded-xl h-96">
                    {/* {imageIsLoaded ? (
                      <img
                        src={layoutImage}
                        alt="layout"
                        className="h-80 w-80"
                      />
                    ) : (
                      <Spinner />
                    )} */}
                    <ReactApexChart
                      options={options}
                      series={[{ data: series }]}
                      type="treemap"
                      className="distribution-chart"
                      height={270}
                      width={370}
                    />
                    <p className="text-sm text-center">
                      This layout is of total area{" "}
                      <span className="font-bold">
                        {currentAreaValues.total} sq. ft.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* setting */}
          {isSettingOpen && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5">
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-120px)] py-2 relative">
                <div className="flex flex-col justify-between  pt-2 sticky top-0">
                  <div className="border-b-2 border-b-[#ccc] py-2 px-4">
                    {iseditopen ? (
                      <button className="capitalize font-medium text-base px-10 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA]">
                        Profile
                      </button>
                    ) : (
                      <div className="capitalize font-medium text-base px-10  ">
                        <button
                          className="text-sm text-[#A1A1A1] flex justify-center items-center gap-3"
                          onClick={() => setIsEditopen(true)}
                        >
                          <FaArrowLeft /> back to profile
                        </button>
                        <h3>profile edit</h3>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center h-[90%] font-Poppins ">
                  {iseditopen ? (
                    <div className="flex justify-center items-center w-full  h-full">
                      <UserProfile setIsEditopen={setIsEditopen} />
                    </div>
                  ) : (
                    <UserSetting />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* product */}
          {isProductOpen && (
            <div className="flex-1  border-2 border-[#000] rounded-3xl my-2.5">
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-120px)] rounded-3xl relative ">
                {/* // Default product list and add product UI */}
                <div className=" sticky top-0 z-20 bg-white">
                  <div className="flex items-center gap-5 px-4 py-2 border-b-2 border-b-gray-400 ">
                    <h3 className=" font-semibold text-xl ">BOQs</h3>
                    {isboqavailable &&
                      boqdata.map((boq, index) => {
                        return (
                          <div
                            key={boq.title}
                            className={`rounded-3xl border-2 border-[#ccc] px-5 py-3 ${
                              selectedBoq.title === boq.title
                                ? "bg-[#B4EAEA]"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() => setSelectedBoq(boq)}
                              className="font-bold"
                            >
                              {boq.title}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  <div className="flex gap-3 px-4 py-2 border-b-2 border-b-gray-400 bg-white z-20">
                    {tabs.map((tab) => (
                      <button
                        key={tab.value}
                        className={`flex items-center gap-2 px-6 py-2 border rounded-xl ${
                          selectedTab === tab.value
                            ? "bg-[#B4EAEA]"
                            : "bg-white "
                        }`}
                        value={tab.value}
                        onClick={handleTabClick} // Dynamically sets the tab
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/*  */}
                {productlist &&
                  (isloading ? (
                    <Spinner />
                  ) : selectedBoq && items.length > 0 ? (
                    // <section className="mt-2 flex-1 overflow-hidden px-8">
                    <section className=" h-[90%] font-Poppins overflow-hidden">
                      <div className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar">
                        <table
                          className="min-w-full border-collapse"
                          ref={tableRef}
                        >
                          <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                            <tr>
                              {toggle ? (
                                <th className="p-3 font-medium">
                                  Product Name
                                </th>
                              ) : (
                                <th className="p-3 font-medium">Addon ID</th>
                              )}
                              <th className="p-3  font-medium">Price</th>
                              {toggle ? (
                                <>
                                  {/* <th className="p-3 font-medium">
                                        Details
                                      </th> */}
                                  <th className="p-3 font-medium">Category</th>
                                  <th className="p-3 font-medium">
                                    specification
                                  </th>
                                </>
                              ) : (
                                <th className="p-3 font-medium">Addon Title</th>
                              )}
                              <th className="p-3 font-medium">Action</th>
                            </tr>
                          </thead>
                          <tbody className=" text-sm">
                            {selectedBoq &&
                              paginatedItems.map((item) => (
                                <tr
                                  key={item.id}
                                  className="hover:bg-gray-50 cursor-pointer"
                                >
                                  <td className="border border-gray-200 p-3 align-middle">
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={`${baseImageUrl}${item.image}`}
                                        alt={item.title}
                                        className="w-10 h-10 object-cover rounded"
                                      />
                                      {toggle ? (
                                        <span>{item.title}</span>
                                      ) : (
                                        <span className="text-wrap">
                                          {item.id}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="border border-gray-200 p-3 align-middle">
                                    ₹{item.price}
                                  </td>
                                  {toggle ? (
                                    <>
                                      <td className="border border-gray-200 p-3 align-middle">
                                        {item.products?.category || "N/A"}
                                      </td>
                                      <td className="border border-gray-200 p-3 align-middle">
                                        {item.products?.subcategory1 || "N/A"}
                                      </td>
                                    </>
                                  ) : (
                                    <td className="border border-gray-200 p-3 align-middle">
                                      {item.addons?.title || item.title}
                                    </td>
                                  )}
                                  <td className="border border-gray-200 p-3 align-middle flex justify-center items-center relative">
                                    <button
                                      ref={(el) =>
                                        (buttonRef.current[item.id] = el)
                                      }
                                      className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                                      onClick={() => handleMenuToggle(item.id)}
                                    >
                                      <CiMenuKebab size={25} />
                                    </button>

                                    {openMenuId === item.id && (
                                      <div
                                        ref={(el) =>
                                          (menuRef.current[item.id] = el)
                                        }
                                        className="absolute top-1/2 left-0 transform mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-10"
                                      >
                                        <button
                                          onClick={() => {
                                            handleProductPreview(item);
                                          }}
                                          className=" flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                        >
                                          <VscEye /> view
                                        </button>
                                        {/* <button
                                        onClick={() => {
                                          handleDelete(item);
                                        }}
                                        className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                                      >
                                        <MdOutlineDelete /> Delete
                                      </button> */}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ) : (
                    <>
                      {selectedBoq ? (
                        <p className="p-5 text-gray-500 text-center">
                          No {toggle ? "products" : "addons"} found.
                        </p>
                      ) : (
                        <p className="p-5 text-gray-500 text-center">
                          please select a boq
                        </p>
                      )}
                    </>
                  ))}
                {/* Pagination Controls (Always Visible) */}
                {selectedBoq && totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 z-30 sticky bottom-0 bg-[#EBF0FF] mb-4 text-[#3d194f]">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1) ? (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-8 h-8 flex items-center justify-center  ${
                              currentPage === page
                                ? "bg-[#aca9d3] text-white rounded-full "
                                : "rounded-md text-[#3d194f]"
                            }`}
                          >
                            {page}
                          </button>
                        ) : page === currentPage + 2 ||
                          page === currentPage - 2 ? (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        ) : null
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* help */}
          {help && <Help isvendor={false} />}
        </div>
      </div>
      {/* product preview */}
      {productPreview && (
        <DashboardProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          // fetchProducts={fetchProducts}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Dashboard;
