import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseCircle, IoCloudDownloadOutline } from "react-icons/io5";
import { category } from "../../utils/AllCatArray";
import MobileTabProductCard from "../user/MobileTabProductCard";
import Spinner from "../../common-components/Spinner";
import { CiMenuKebab } from "react-icons/ci";
import { VscEye } from "react-icons/vsc";
import { baseImageUrl } from "../../utils/HelperConstant";
import { IoIosSearch } from "react-icons/io";
import ProductView from "../user/ProductView";
import PagInationNav from "../../common-components/PagInationNav";
function ClientBoq({ setClientBoqs }) {
  const [savedBoqs, setSavedBoqs] = useState([]);
  const [selectedBoq, setSelectedBoq] = useState();
  const [isboqavailable, setIsboqavailable] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [lastPageBeforeSearch, setLastPageBeforeSearch] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productlist, setProductlist] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOPen] = useState(false);

  const items = toggle ? filteredProducts : filteredAddons;
  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const tableRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const buttonRef = useRef({});
  const menuRef = useRef({});

  const { selectedClient } = useApp();

  const fetchUserBoqs = async () => {
    try {
      setIsloading(true);
      const { data, error } = await supabase
        .from("boq_data_new")
        .select("*")
        .eq("userId", selectedClient.id);
      if (data) {
        setSavedBoqs(data);
        setSelectedBoq(data[0]);
        setIsboqavailable(true);
      }
      if (error) console.log(error);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchUserBoqs();
  }, [selectedClient]);

  const fetchAddonsByIds = async () => {
    try {
      setIsloading(true);
      if (!selectedBoq) {
        return;
      }

      if (selectedBoq && selectedBoq.addons) {
        // const productIdsArray = selectedBoq.addon_varaint_id
        //   .split(",")
        //   .map((id) => id.trim());
        const productIdsArray = selectedBoq.addons.map(
          (addon) => addon.variantId
        );

        const { data } = await supabase
          .from("addon_variants")
          .select("*")
          .in("id", productIdsArray); // Use Supabase `in()` filter

        console.log(data);

        setAddons(data);
        setFilteredAddons(data);
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

        console.log("selectedboq", selectedBoq);

        // const productIdsArray = selectedBoq.product_variant_id
        //   .split(",")
        //   .map((id) => id.trim()); // Convert to array of ids
        const productIdsArray = selectedBoq.products.map(
          (product) => product.id
        );

        const { data, error } = await supabase
          .from("product_variants")
          .select("*,products(*)")
          .neq("productDisplayType", "ecommerce")
          .in("id", productIdsArray); // Use Supabase `in()` filter

        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }

        if (error) {
          throw new Error(error);
        }

        console.log(data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    fetchProductsByIds();
    fetchAddonsByIds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBoq]);

  const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();
  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const applyFilters = ({ query = "", category = "", status = "" }) => {
    const source = toggle ? products : addons;

    // Store last page before searching if this is a new search
    if ((query || category || status) && !isSearching) {
      setLastPageBeforeSearch(currentPage);
      setIsSearching(true);
    }

    // Reset case: No query, category, or status
    if (!query && !category && !status) {
      toggle ? setFilteredProducts(products) : setFilteredAddons(addons);
      if (isSearching) {
        setCurrentPage(lastPageBeforeSearch);
        setIsSearching(false);
      }
      return;
    }

    // Apply filters
    const filtered = source.filter((item) => {
      const titleMatch = query
        ? normalize(item.title).includes(normalize(query))
        : true;

      const categoryMatch = category
        ? toggle
          ? item.products?.category?.toLowerCase() === category.toLowerCase()
          : item.title?.toLowerCase().includes(category.toLowerCase())
        : true;

      const statusMatch = status
        ? item.status?.toLowerCase() === status.toLowerCase()
        : true;

      return titleMatch && categoryMatch && statusMatch;
    });

    // Apply filtered result
    if (toggle) {
      setFilteredProducts(filtered);
    } else {
      setFilteredAddons(filtered);
    }

    setCurrentPage(1); // Always reset to first page on filter
  };

  const handleTabClick = (event) => {
    setProductlist(true);
    // setIsAddProduct(false);
    const tab = event.target.value; // Get value from button
    setSelectedTab(tab);
    setToggle(tab === "products"); // Set toggle dynamically
    setSearchQuery("");
    setSelectedCategory("");
  };
  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleProductPreview = (product) => {
    console.log("in function handleProductPreview", product);

    setProductPreview(true);
    setSelectedProductview(product);
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden lg:border-2 border-[#334A78] rounded-lg bg-white">
      <div className="flex-1 ">
        {isloading ? (
          <Spinner />
        ) : savedBoqs.length > 0 ? (
          <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-95px)] relative ">
            {/* // Default product list and add product UI */}
            <div className=" sticky top-0 z-20 bg-white">
              <button
                onClick={() => setClientBoqs(false)}
                className="capitalize font-semibold flex items-center text-xs text-[#A1A1A1] "
              >
                <IoIosArrowBack /> Back to client list
              </button>
              <div className="flex flex-col md:flex-row md:items-center px-2 gap-3 lg:gap-5 lg:px-4 py-2 border-b-2 border-b-gray-400 ">
                <div className="flex justify-between ">
                  <h3 className="text-sm md:text-base font-semibold lg:text-xl text-[#374A75] ">
                    Created BOQs
                  </h3>
                  <div className="relative md:hidden flex items-center gap-5">
                    <button>
                      <IoCloudDownloadOutline size={22} color="#374A75" />
                    </button>
                    <button
                      onClick={() => setMobileFilterOPen(!mobileFilterOpen)}
                    >
                      <img src="/images/icons/filter-icon.png" alt="" />
                    </button>
                  </div>
                  {mobileFilterOpen && (
                    <div className="absolute top-10 right-0 bg-white w-[200px] z-30 p-4 space-y-1 border border-[#ccc]">
                      <h4 className="font-semibold text-sm">Select Category</h4>
                      {category?.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            applyFilters({
                              query: searchQuery,
                              category: cat,
                            });
                            setMobileFilterOPen(false);
                          }}
                          className={`block w-full text-left py-1 rounded hover:bg-gray-100 text-xs ${
                            selectedCategory === cat ? "bg-gray-200" : ""
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2 xl:gap-4">
                  {isboqavailable &&
                    savedBoqs.map((boq, index) => {
                      return (
                        <div
                          key={boq?.id}
                          className={` rounded-lg border-2  px-5 py-2 ${
                            selectedBoq?.id === boq?.id
                              ? "bg-[#374A75] text-white border-[#374a75]"
                              : "bg-white text-[#374a75] border-[#ccc]"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setSelectedBoq(boq);
                              setSearchQuery("");
                              setSelectedCategory("");
                            }}
                            className="text-sm lg:text-lg"
                          >
                            {boq.boqTitle}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="flex  items-center justify-between gap-3 px-2 lg:px-4 py-2 border-b-2 border-b-gray-400 bg-white z-20 relative">
                <div className="flex gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.value}
                      className={`flex items-center gap-2 px-3 lg:px-6 py-2 border rounded-lg  text-[#374A75] text-sm lg:text-lg ${
                        selectedTab === tab.value
                          ? "bg-[#D3E3F0]  border-[#374A75]"
                          : "bg-white border-[#374A75]"
                      }`}
                      value={tab.value}
                      onClick={handleTabClick} // Dynamically sets the tab
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                <div className="lg:hidden">
                  <button
                    onClick={() => setMobileSearchOpen(true)}
                    className="py-1.5 px-2 flex justify-center items-center border rounded"
                  >
                    <IoIosSearch size={20} color="#374A75" />
                  </button>
                  {mobileSearchOpen && (
                    <div
                      className={`absolute top-0 bg-[#fff] w-full h-full z-30 flex justify-between items-center px-3 !transition-all !duration-700 !ease-in-out ${
                        mobileSearchOpen
                          ? "opacity-100 translate-x-0 left-0"
                          : "opacity-0 -translate-x-full right-0"
                      }`}
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        placeholder="......search by product name"
                        onChange={(e) => {
                          const value = e.target.value;
                          setSearchQuery(value);
                          applyFilters({
                            query: value,
                          });
                        }}
                        className="w-3/4 px-2 py-2.5 border rounded-sm text-[10px]"
                      />
                      <button onClick={() => setMobileSearchOpen(false)}>
                        <IoCloseCircle size={25} color="#374A75" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="hidden lg:block w-1/2 ml-auto">
                  <input
                    type="text"
                    value={searchQuery}
                    className="w-full rounded-lg px-2 py-1 outline-none border-2 border-gray-400"
                    placeholder="......search by product name"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      applyFilters({
                        query: value,
                      });
                    }}
                  />
                </div>
                {toggle && (
                  <div className="hidden lg:block">
                    <select
                      name="category"
                      value={selectedCategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedCategory(value);
                        applyFilters({
                          query: searchQuery,
                          category: value,
                        });
                      }}
                      id="category"
                    >
                      <option value="">All categories</option>
                      {category.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            {/*  */}
            {productlist &&
              (isloading ? (
                <Spinner />
              ) : selectedBoq && items.length > 0 ? (
                // <section className="mt-2 flex-1 overflow-hidden px-8">
                <>
                  <section className="hidden lg:block h-[90%] font-Poppins overflow-hidden">
                    {/* <section className=" h-[90%] font-Poppins overflow-hidden"> */}
                    <div
                      ref={scrollContainerRef}
                      className=" w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
                    >
                      <table
                        className="min-w-full border-collapse"
                        ref={tableRef}
                      >
                        <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                          <tr>
                            {toggle ? (
                              <th className="p-3 font-medium">Product Name</th>
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
                                <td className="border border-gray-200 p-3 align-middle ">
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
                  <section className="lg:hidden mb-5">
                    {selectedBoq &&
                      paginatedItems.map((item) => (
                        <MobileTabProductCard
                          key={item?.id}
                          product={item}
                          handleProductPreview={handleProductPreview}
                        />
                      ))}
                  </section>
                </>
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
            {selectedBoq && (
              <div className="z-30 sticky bottom-0 bg-white py-1 text-[#3d194f]">
                <PagInationNav
                  totalPages={totalPages}
                  handlePageChange={goToPage}
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="">
            <button
              onClick={() => setClientBoqs(false)}
              className="capitalize font-semibold flex items-center text-xs text-[#A1A1A1] "
            >
              <IoIosArrowBack /> Back to client list
            </button>
            <div className="flex justify-center items-center">
              <p className="text-[#374A75]">
                No Saved BOQ's for {selectedClient.company_name}
              </p>
            </div>
          </div>
        )}
      </div>
      {productPreview && (
        <ProductView
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
        />
      )}
    </div>
  );
}

export default ClientBoq;
