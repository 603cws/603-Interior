import Spinner from "../../common-components/Spinner";
import MultipleDeleteWarningCard from "../components/MultipleDeleteWarningCard";
import DashboardProductCard from "../vendor/DashboardProductCard";
import SelectSubcategories from "./SelectSubcategories";
import { baseImageUrl } from "../../utils/HelperConstant";
import { VscEye } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import {
  HiArrowsUpDown,
  HiBarsArrowDown,
  HiBarsArrowUp,
  HiXMark,
} from "react-icons/hi2";
import PagInationNav from "../../common-components/PagInationNav";
import MobileTabProductCard from "../user/MobileTabProductCard";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { IoCheckmark } from "react-icons/io5";
import DeleteWarning from "../components/DeleteWarning";
import { handleError } from "../../common-components/handleError";

const formatDateTime = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Table({
  items,
  toggle,
  currentPage,
  setSelectedproduct,
  setSelectedAddon,
  setEditProduct,
  setEditAddon,
  multipleDeleteWaring,
  setMultipleDeleteWaring,
  filteredAddons,
  filteredProducts,
  setCurrentPage,
  setIsAddonRefresh,
  setIsProductRefresh,
  setSelectedItemForDelete,
  selectedItemForDelete,
  isloading,
}) {
  const [deleteWarning, setDeleteWarning] = useState(false);
  const [selectSubcategories, setSelectSubcategories] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReasonPopup, setRejectReasonPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedProductview, setSelectedProductview] = useState();
  const [productPreview, setProductPreview] = useState(false);
  const [sortField, setSortField] = useState(""); // e.g. "price" or "title" etc.
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [openMenuId, setOpenMenuId] = useState(null);
  const tableRef = useRef(null);
  const buttonRef = useRef({});
  const scrollContainerRef = useRef(null);
  const itemsPerPage = 10;

  const menuRef = useRef({});

  const sortedSource = useMemo(() => {
    const source = toggle ? filteredProducts : filteredAddons; // your filtered lists
    if (!sortField) return source;

    const copy = [...source];

    const getVal = (item, field) => {
      // price -> numeric
      if (field === "price") {
        const v =
          item.price ??
          item.products?.price ??
          item.price?.amount ??
          item.price?.value;
        if (typeof v === "string")
          return Number(String(v).replace(/[^\d.-]/g, "")) || 0;
        return typeof v === "number" ? v : 0;
      }

      // date -> timestamp (ms). Return a numeric fallback so numeric compare works.
      if (field === "date") {
        const d =
          item.created_at ??
          item.createdAt ??
          item.products?.created_at ??
          item.products?.createdAt ??
          item.products?.date ??
          item.date;
        if (!d) return Number.NEGATIVE_INFINITY; // missing date -> place consistently
        const t = Date.parse(d);
        return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
      }

      // title -> string
      if (field === "title") return (item.title ?? "").toString();

      // fallback: if the value is number return it, else string
      const val = item[field];
      if (typeof val === "number") return val;
      if (typeof val === "string") return val.toLowerCase();
      return val ?? "";
    };

    copy.sort((a, b) => {
      const A = getVal(a, sortField);
      const B = getVal(b, sortField);

      // numeric compare if both numbers (covers price/date)
      if (typeof A === "number" && typeof B === "number") {
        return sortOrder === "asc" ? A - B : B - A;
      }

      // string compare
      const sA = (A ?? "").toString().toLowerCase();
      const sB = (B ?? "").toString().toLowerCase();
      if (sA > sB) return sortOrder === "asc" ? 1 : -1;
      if (sA < sB) return sortOrder === "asc" ? -1 : 1;
      return 0;
    });

    return copy;
  }, [filteredProducts, filteredAddons, sortField, sortOrder, toggle]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openMenuId !== null &&
        (menuRef.current[openMenuId]?.contains(event.target) ||
          buttonRef.current[openMenuId]?.contains(event.target))
      ) {
        return;
      }
      setOpenMenuId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = sortedSource.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const handleCheckboxChange = (blogId) => {
    setSelectedItemForDelete((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
    );
  };

  const toggleSort = (field) => {
    // if clicking a different field, start with ASC
    if (sortField !== field) {
      setSortField(field);
      setSortOrder("asc");
      return;
    }

    // if same field: cycle asc → desc → none
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      // go to unsorted state
      setSortField("");
      setSortOrder("asc"); // default next time
    }
  };

  const handleMenuToggle = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleProductPreview = (product) => {
    setProductPreview(true);
    setSelectedProductview(product);
  };

  const handleRejectClick = (product) => {
    setSelectedProductview(product);
    setRejectReasonPopup(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason) {
      toast.error("Please enter a reason for rejecting the product");
      return;
    }
    handleUpdateStatus(selectedProductview, "rejected", rejectReason);
  };

  const handleDelete = async (selectedProductview) => {
    try {
      if (selectedProductview && selectedProductview.type === "product") {
        await supabase
          .from("product_variants")
          .delete()
          .eq("id", selectedProductview.id);

        toast.success("Product deleted successfully!");
        setIsProductRefresh(true);
      }

      if (selectedProductview.type === "addon") {
        await supabase
          .from("addon_variants")
          .delete()
          .eq("id", selectedProductview.id);
        toast.success("Product deleted successfully!");
        setIsAddonRefresh(true);
      }

      let imagePaths = [];

      if (selectedProductview.image) {
        imagePaths.push(selectedProductview.image);
      }
      if (selectedProductview.additional_images) {
        try {
          const parsedAdditionalImages = JSON.parse(
            selectedProductview.additional_images,
          );
          if (Array.isArray(parsedAdditionalImages)) {
            imagePaths = imagePaths.concat(parsedAdditionalImages);
          }
        } catch (parseError) {
          handleError(parseError, {
            prodMessage: "Something went wrong. Please try again.",
          });
        }
      }

      if (imagePaths.length > 0) {
        const { storageError } = await supabase.storage
          .from("addon")
          .remove(imagePaths);

        if (storageError) throw storageError;
      }

      setProductPreview(false);
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    } finally {
      selectedProductview.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);
    }
    setDeleteWarning(false);
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  async function handleMultipleDelete(selectedProducts) {
    if (selectedProducts?.length === 0) return;

    // Filter the items you want to delete
    const filteredItems = items.filter((item) =>
      selectedProducts?.includes(item.id),
    );

    try {
      for (const product of filteredItems) {
        // DELETE FROM SUPABASE
        if (product?.type === "product") {
          await supabase
            .from("product_variants")
            .delete()
            .eq("id", product?.id);
        }

        if (product?.type === "addon") {
          await supabase.from("addon_variants").delete().eq("id", product?.id);
        }

        // DELETE IMAGES (Main + Additional)
        let imagePaths = [];

        if (product.image) {
          imagePaths.push(product.image);
        }

        if (product.additional_images) {
          try {
            const parsed = JSON.parse(product.additional_images);

            if (Array.isArray(parsed)) {
              imagePaths = imagePaths.concat(parsed);
            }
          } catch (err) {
            handleError(err, {
              prodMessage: "Something went wrong. Please try again.",
            });
          }
        }

        if (imagePaths.length > 0) {
          const { storageError } = await supabase.storage
            .from("addon") // Or your bucket name
            .remove(imagePaths);

          if (storageError) throw storageError;
        }
      }

      toast.success("Selected items deleted successfully!");
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    } finally {
      setMultipleDeleteWaring(false);
      setSelectedItemForDelete([]);
      setIsProductRefresh(true);
      setIsAddonRefresh(true);
    }
  }
  const handleDeleteClick = (item) => {
    setDeleteWarning(true);
    setSelectedProductview(item);
  };

  const handleUpdateStatus = async (product, newStatus, reason = "") => {
    try {
      if (product && product.type === "product") {
        if (newStatus !== "approved") {
          await supabase
            .from("product_variants")
            .update({
              status: newStatus,
              reject_reason: reason,
              defaultSubCat: null,
              default: null,
            })
            .eq("id", product.id);
        } else {
          await supabase
            .from("product_variants")
            .update({
              status: newStatus,
              reject_reason: reason,
            })
            .eq("id", product.id);
        }
        toast.success(`product ${newStatus}`);
        setRejectReasonPopup(false);
        setRejectReason("");
      }

      if (product.type === "addon") {
        await supabase
          .from("addon_variants") // Ensure this matches your table name
          .update({ status: newStatus }) // New status
          .eq("id", product.id); // Matching row
        toast.success(`Addon ${newStatus}`);
      }
    } finally {
      product.type === "product"
        ? setIsProductRefresh(true)
        : setIsAddonRefresh(true);

      if (productPreview) {
        setProductPreview(false);
      }
    }
  };
  return (
    <>
      {isloading ? (
        <Spinner />
      ) : items?.length > 0 ? (
        <>
          <section className="hidden lg:block h-[72%] font-Poppins overflow-hidden">
            <div
              className="w-full h-full border-t border-b border-[#CCCCCC] overflow-y-auto custom-scrollbar"
              ref={scrollContainerRef}
            >
              <table className="min-w-full border-collapse" ref={tableRef}>
                <thead className="bg-[#FFFFFF] sticky top-0 z-10 px-8 text-center text-[#000] text-base">
                  <tr>
                    <th className="p-3 font-medium">SR</th>

                    {toggle ? (
                      <th className="p-3 font-medium">Product Name</th>
                    ) : (
                      <th className="p-3 font-medium">Addon Name</th>
                    )}
                    <SortableHeader
                      label="Date"
                      field="date"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      toggleSort={toggleSort}
                    />

                    <SortableHeader
                      label="Price"
                      field="price"
                      sortField={sortField}
                      sortOrder={sortOrder}
                      toggleSort={toggleSort}
                    />

                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className=" text-sm">
                  {paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="border border-gray-200 p-3 align-middle">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onClick={(e) => e.stopPropagation()}
                            checked={selectedItemForDelete?.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 align-middle w-1/2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`${baseImageUrl}${item.image}`}
                            alt={item.title}
                            className="w-10 h-10 object-contain rounded"
                          />

                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="border border-gray-200 p-3 align-middle text-center">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="border border-gray-200 p-3 align-middle text-center">
                        ₹{item.price}
                      </td>

                      <td className="border border-gray-200 p-3 align-middle text-center group relative">
                        {item.status === "pending" ? (
                          <div className="flex items-center justify-center">
                            <span className="text-[#13B2E4]">Pending</span>
                            <div className="absolute top-0 left-0 w-full h-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="bg-gray-100 text-green-600 p-3 rounded-full mr-2 hover:text-gray-100 hover:bg-green-600"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setSelectSubcategories(true);
                                }}
                              >
                                <IoCheckmark size={20} />
                              </button>
                              <button
                                className="bg-gray-100 text-red-600 p-3 rounded-full mr-2 hover:text-gray-100 hover:bg-red-600"
                                onClick={() => handleRejectClick(item)}
                              >
                                <HiXMark size={20} />
                              </button>
                            </div>
                          </div>
                        ) : item.status === "approved" ? (
                          <span className="text-green-400">approved</span>
                        ) : (
                          <span className="text-red-400">
                            {item.status || "N/A"}
                          </span>
                        )}
                      </td>

                      <td className="border border-gray-200 p-3 align-middle flex justify-center items-center relative">
                        <button
                          ref={(el) => (buttonRef.current[item.id] = el)}
                          className="bg-white flex justify-center items-center py-1.5 w-20 mb-2"
                          onClick={() => handleMenuToggle(item.id)}
                        >
                          <CiMenuKebab size={25} />
                        </button>

                        {openMenuId === item.id && (
                          <div
                            ref={(el) => (menuRef.current[item.id] = el)}
                            className="absolute top-1/2 left-0 transform mt-2 bg-white border border-gray-300 shadow-md rounded-md w-24 z-10"
                          >
                            <button
                              onClick={() => {
                                handleProductPreview(item);
                              }}
                              className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                            >
                              <VscEye /> View
                            </button>
                            {toggle ? (
                              <button
                                onClick={() => {
                                  setSelectedproduct(item);
                                  setEditProduct(true);
                                }}
                                className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                              >
                                <VscEye /> Edit
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedAddon(item);
                                  setEditAddon(true);
                                }}
                                className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                              >
                                <VscEye /> Edit
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDeleteClick(item);
                              }}
                              className="flex gap-2 items-center w-full text-left px-3 py-2 hover:bg-gray-200"
                            >
                              <MdOutlineDelete /> Delete
                            </button>
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
            {paginatedItems.map((item) => (
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
          <p className="p-5 text-gray-500 text-center">
            No {toggle ? "products" : "addons"} found.
          </p>
        </>
      )}

      <PagInationNav
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={goToPage}
      />

      {selectSubcategories && (
        <SelectSubcategories
          onClose={() => setSelectSubcategories(false)}
          product={selectedItem}
          handleUpdateStatus={handleUpdateStatus}
          setRejectReason={setRejectReason}
        />
      )}

      {productPreview && (
        <DashboardProductCard
          onClose={() => {
            setProductPreview(false);
          }}
          product={selectedProductview}
          handleDelete={handleDelete}
          updateStatus={handleUpdateStatus}
          deleteWarning={deleteWarning}
          setDeleteWarning={setDeleteWarning}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          handleConfirmReject={handleConfirmReject}
          setSelectedItem={setSelectedItem}
          setSelectSubcategories={setSelectSubcategories}
        />
      )}

      {deleteWarning && (
        <DeleteWarning
          selectedProductview={selectedProductview}
          setDeleteWarning={setDeleteWarning}
          handleDelete={handleDelete}
        />
      )}

      {rejectReasonPopup && (
        <RejectReasonPopup
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          setRejectReasonPopup={setRejectReasonPopup}
          handleConfirmReject={handleConfirmReject}
        />
      )}

      {multipleDeleteWaring && (
        <MultipleDeleteWarningCard
          setDeleteWarning={setMultipleDeleteWaring}
          selectedItemForDelete={selectedItemForDelete}
          handleMultipleDelete={handleMultipleDelete}
        />
      )}
    </>
  );
}

export default Table;

function SortableHeader({ label, field, sortField, sortOrder, toggleSort }) {
  const isActive = sortField === field;

  return (
    <th className="p-3 font-medium text-center">
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className="flex items-center gap-2 mx-auto"
      >
        <span>{label}</span>

        <span aria-hidden className="text-md">
          {isActive ? (
            sortOrder === "asc" ? (
              <HiBarsArrowUp title="Sort ascending" />
            ) : (
              <HiBarsArrowDown title="Sort descending" />
            )
          ) : (
            <HiArrowsUpDown title={`Click to sort ${label}`} />
          )}
        </span>
      </button>
    </th>
  );
}

function RejectReasonPopup({
  rejectReason,
  setRejectReason,
  setRejectReasonPopup,
  handleConfirmReject,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30 font-Poppins">
      <div className="bg-white py-6 px-10 rounded-2xl shadow-lg ">
        <h2 className="text-lg font-semibold mb-3">Rejection Reason</h2>
        <textarea
          className="w-full p-2 border rounded-md"
          rows="3"
          placeholder="Provide a reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <div className="mt-7 flex gap-20 justify-between">
          <button
            className="border-[1px] border-[#BBBBBB] px-4 py-2 rounded-md mr-2"
            onClick={() => setRejectReasonPopup(false)}
          >
            Cancel
          </button>
          <button
            className="border-[1px] border-red-600 px-4 py-2 rounded-md"
            onClick={handleConfirmReject}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}
