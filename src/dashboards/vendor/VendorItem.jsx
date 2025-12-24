import { useState, useEffect, useRef } from "react";
import { useApp } from "../../Context/Context";
import VendorNewAddon from "./VendorNewAddon";
import VendorNewProduct from "./VendorNewProduct";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import Spinner from "../../common-components/Spinner";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import DashboardProductCard from "./DashboardProductCard";
import VendorProductEdit from "./VendorProductEdit";
import VendorEditAddon from "./VendorEditAddon";
import ItemList from "./ItemList";
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";

function VendorItem({ isExpanded }) {
  const [toggle, setToggle] = useState(true);
  const [selectedTab, setSelectedTab] = useState("products");
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [selectedproduct, setSelectedproduct] = useState(null);
  const [editAddon, setEditAddon] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedProductview, setSelectedProductview] = useState({
    product_name: "",
    product_price: "",
    product_image: "",
    product_description: "",
  });
  const [productPreview, setProductPreview] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [isproductRefresh, setIsProductRefresh] = useState(false);
  const [isaddonRefresh, setIsAddonRefresh] = useState(false);

  const menuRef = useRef({});
  const buttonRef = useRef({});
  const productview = useRef(null);
  const [isloading, setIsloading] = useState(false);

  const [productlist, setProductlist] = useState(true);

  const [products, setProducts] = useState([]);
  const [addons, setAddons] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredAddons, setFilteredAddons] = useState([]);

  const items = toggle ? filteredProducts : filteredAddons;
  const checkitemsinOriginal = toggle ? products : addons;

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { name: "Products", value: "products" },
    { name: "Add-Ons", value: "addons" },
  ];

  const showtabs = products.length > 0 || addons.length > 0;

  const { accountHolder } = useApp();

  const handleTabClick = (event) => {
    setProductlist(true);
    setIsAddProduct(false);
    const tab = event.target.value;
    setSelectedTab(tab);
    setToggle(tab === "products");
  };
  const fetchProducts = async () => {
    setIsloading(true);

    try {
      const { data } = await supabase
        .from("product_variants")
        .select(
          `
            *,
              products (category, subcategory, subcategory1)
            `
        )
        .eq("vendor_id", accountHolder.userId);

      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setProducts(sortedData);
      setFilteredProducts(sortedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsloading(false);
    }
  };

  const fetchAddons = async () => {
    const { data, error } = await supabase
      .from("addon_variants")
      .select("*")
      .eq("vendorId", accountHolder.userId);

    if (error) {
      console.error("Error fetching addons:", error);
    } else {
      const sortedData = data.sort((a, b) => {
        // Prioritize "pending" status
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;

        // If both are "pending" or both are not "pending", sort by date
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setAddons(sortedData);
      setFilteredAddons(sortedData);
    }
  };

  const filterItems = (query) => {
    if (toggle) {
      if (!query) {
        setFilteredProducts(products); // Reset to original list when input is empty
        return;
      }
      const filtered = products.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      if (!query) {
        setFilteredAddons(addons); // Reset to original list when input is empty
        return;
      }
      const filtered = addons.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAddons(filtered);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isproductRefresh]);

  useEffect(() => {
    fetchAddons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isaddonRefresh]);

  const handlenewproduct = () => {
    setProductlist(false);
    setIsAddProduct(true);
  };

  const handleAddproductclose = () => {
    setProductlist(true);
    setIsAddProduct(false);
  };

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

  const handleProductPreview = (product) => {
    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleProductEdit = (product) => {
    setSelectedproduct(product);
    setEditProduct(true);
  };

  const handleAddonEdit = (addon) => {
    setSelectedAddon(addon);
    setEditAddon(true);
  };

  const handleDelete = async (selectedProductview) => {
    try {
      if (selectedProductview && selectedProductview.type === "product") {
        await supabase
          .from("product_variants") // Ensure this matches your table name
          .delete()
          .eq("id", selectedProductview.id);

        toast.success("Product deleted successfully!");
        setIsProductRefresh((prev) => !prev);
      }

      if (selectedProductview.type === "addon") {
        await supabase
          .from("addon_variants") // Ensure this matches your table name
          .delete()
          .eq("id", selectedProductview.id);
        toast.success("Addon deleted successfully!");
        setIsAddonRefresh((prev) => !prev);
      }

      let imagePaths = [];

      if (selectedProductview.image) {
        imagePaths.push(selectedProductview.image);
      }
      if (selectedProductview.additional_images) {
        try {
          const parsedAdditionalImages = JSON.parse(
            selectedProductview.additional_images
          );
          if (Array.isArray(parsedAdditionalImages)) {
            imagePaths = imagePaths.concat(parsedAdditionalImages);
          }
        } catch (parseError) {
          console.error("error parsing error", parseError);
        }
      }

      if (imagePaths.length > 0) {
        const { storageError } = await supabase.storage
          .from("addon")
          .remove(imagePaths);

        if (storageError) throw storageError;
      }

      setProductPreview(false); // Close the modal after deletion
    } catch (error) {
      console.error(error);
    } finally {
      selectedProductview.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);
    }
    setDeleteWarning(false);
  };

  return (
    <>
      <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] rounded-3xl relative ">
        {addNewProduct ? (
          <VendorNewProduct
            setAddNewProduct={setAddNewProduct}
            setProductlist={setProductlist}
            setIsProductRefresh={setIsProductRefresh}
          />
        ) : addNewAddon ? (
          <VendorNewAddon
            setAddNewProduct={setAddNewAddon}
            setIsAddonRefresh={setIsAddonRefresh}
            setProductlist={setProductlist}
          />
        ) : editProduct ? (
          <VendorProductEdit
            setEditProduct={setEditProduct}
            setProductlist={setProductlist}
            setIsProductRefresh={setIsProductRefresh}
            selectedproduct={selectedproduct}
          />
        ) : editAddon ? (
          <VendorEditAddon
            seteditAddon={setEditAddon}
            selectedAddon={selectedAddon}
            setProductlist={setProductlist}
            setIsAddonRefresh={setIsAddonRefresh}
          />
        ) : (
          <>
            <div className=" sticky top-0 z-20 bg-white">
              <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 ">
                <h3 className="capitalize font-semibold text-xl ">
                  product list
                </h3>

                <button
                  onClick={handlenewproduct}
                  className="capitalize bg-[#374A75] text-white shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                >
                  <IoIosAdd size={20} />
                  add product
                </button>
              </div>
              <div
                className={`relative flex justify-between items-center gap-3 px-2 md:px-4 py-2 border-b-2 border-b-gray-400 ${
                  !showtabs && "hidden"
                }`}
              >
                <div className="flex gap-3 items-center">
                  {showtabs &&
                    tabs.map((tab) => (
                      <button
                        key={tab.value}
                        className={`flex items-center text-[#374A75] text-xs lg:text-base text-nowrap gap-2 px-6 py-2 border border-[#374A75]  rounded-lg ${
                          selectedTab === tab.value
                            ? "bg-[#D3E3F0] "
                            : "bg-white "
                        }`}
                        value={tab.value}
                        onClick={handleTabClick}
                      >
                        {tab.name}
                      </button>
                    ))}
                </div>

                <div className="lg:hidden">
                  {checkitemsinOriginal?.length > 0 && (
                    <button
                      onClick={() => setMobileSearchOpen(true)}
                      className="py-1.5 px-2 flex justify-center items-center border rounded"
                    >
                      <IoIosSearch size={20} color="#374A75" />
                    </button>
                  )}
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
                          setSearchQuery(e.target.value);
                          filterItems(e.target.value);
                        }}
                        className="w-3/4 px-2 py-2.5 border rounded-sm text-[10px]"
                      />
                      <button onClick={() => setMobileSearchOpen(false)}>
                        <IoCloseCircle size={25} color="#374A75" />
                      </button>
                    </div>
                  )}
                </div>

                {checkitemsinOriginal?.length > 0 && (
                  <div className="hidden lg:block w-3/2 ml-auto">
                    <input
                      type="text"
                      value={searchQuery}
                      className="w-full rounded-md px-2 py-1 outline-none border-2 border-gray-400"
                      placeholder="search...."
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        filterItems(e.target.value);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/*  */}

            {productlist &&
              (isloading ? (
                <Spinner />
              ) : items.length > 0 ? (
                <>
                  <section className="px-2 h-[85%] font-Poppins overflow-hidden">
                    <ItemList
                      handleProductPreview={handleProductPreview}
                      handleProductEdit={handleProductEdit}
                      handleAddonEdit={handleAddonEdit}
                      items={items}
                      isExpanded={isExpanded}
                    />
                  </section>
                </>
              ) : (
                <>
                  {checkitemsinOriginal?.length === 0 && (
                    <div className="flex justify-center items-center h-[80%]">
                      <EmptyStateCard
                        toggle={toggle}
                        onAdd={handlenewproduct}
                      />
                    </div>
                  )}
                  {checkitemsinOriginal?.length > 0 && searchQuery && (
                    <p className="text-center font-semibold text-black capitalize pt-6">
                      no item found with this {searchQuery} name
                    </p>
                  )}
                </>
              ))}

            {isAddProduct && (
              <div className="flex flex-col md:justify-center md:items-center h-[80%] font-Poppins overflow-auto ">
                <AddItem
                  handleAddproductclose={handleAddproductclose}
                  setAddNewAddon={setAddNewAddon}
                  setAddNewProduct={setAddNewProduct}
                  setIsAddProduct={setIsAddProduct}
                />
              </div>
            )}
          </>
        )}
      </div>
      {productPreview && (
        <div ref={productview}>
          <DashboardProductCard
            onClose={() => {
              setProductPreview(false);
            }}
            product={selectedProductview}
            handleDelete={handleDelete}
            deleteWarning={deleteWarning}
            setDeleteWarning={setDeleteWarning}
          />
        </div>
      )}

      {deleteWarning && (
        <div className="flex justify-center items-center h-screen fixed inset-0 z-30 top-0 w-screen">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white relative py-7 px-20">
            <div className="flex justify-center items-center">
              <img
                src="images/icons/delete-icon.png"
                alt="delete icon"
                className="h-12 w-12"
              />
            </div>

            <h4 className="font-semibold my-5">
              Do you want to delete {selectedProductview.title}?
            </h4>
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setDeleteWarning(false);
                }}
                className="px-5 py-2 bg-[#EEEEEE] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedProductview)}
                className="px-5 py-2 bg-[#B4EAEA] rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorItem;

function AddItem({
  setAddNewProduct,
  setIsAddProduct,
  setAddNewAddon,
  handleAddproductclose,
}) {
  return (
    <div className="p-2 border-2 border-gray-200 md:px-28 md:py-14 flex flex-col  md:flex-row justify-center items-center gap-4 md:gap-10 rounded-2xl shadow-lg capitalize relative">
      <Item
        setAddNewitem={setAddNewProduct}
        setIsAddProduct={setIsAddProduct}
        title={"product"}
        img1={"images/pantry-white.png"}
        img2={"images/pantry-blue.png"}
      />
      <Item
        setAddNewitem={setAddNewAddon}
        setIsAddProduct={setIsAddProduct}
        title={"Addon"}
        img1={"images/chair-white.png"}
        img2={"images/chair-blue.png"}
      />

      <div className="absolute top-2 right-2">
        <MdOutlineCancel
          onClick={handleAddproductclose}
          size={25}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}

function Item({ setIsAddProduct, setAddNewitem, title, img1, img2 }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={() => {
        setAddNewitem(true);
        setIsAddProduct(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col border border-[#ccc] justify-center items-center gap-5 p-10 shadow-lg font-bold rounded-xl cursor-pointer hover:bg-[#374A75] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
    >
      <img src={isHovered ? img1 : img2} alt={title} className="w-28" />
      <h2 className="text-lg">{title}</h2>
    </div>
  );
}

function EmptyStateCard({ onAdd, toggle }) {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-8 w-full max-w-sm mx-2 md:max-w-md sm:mx-auto text-center shadow-sm bg-white">
      <HiPlus className="w-8 h-8 text-gray-400 mb-3" />
      <p className="font-semibold text-gray-800">No data found</p>
      <p className="text-gray-400 text-sm mb-4">
        Start Adding {toggle ? "products" : "addons"} to your list.
      </p>
      <button
        onClick={() => onAdd()}
        className="flex items-center gap-2 bg-[#334A78] text-white px-4 py-2 rounded-md hover:bg-[#2c3e67] transition-colors"
      >
        <HiPlus className="w-4 h-4" />
        Add Product
      </button>
    </div>
  );
}
