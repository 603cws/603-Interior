import { useState } from "react";
import { useApp } from "../../Context/Context";
import { MdDeleteOutline } from "react-icons/md";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";

function DashboardProductCard({
  onClose,
  product,
  handleDelete,
  updateStatus,
}) {
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(product.status);
  const { accountHolder } = useApp();

  console.log("product status", product);
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  return (
    <div className="flex justify-center items-center h-screen absolute z-30 top-0 w-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="font-Poppins max-w-xl p-10 rounded-3xl border-2 relative bg-white">
        <div className="flex gap-4">
          <div className="flex-1">
            <img src={`${baseImageUrl}${product.image}`} alt="product" />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <h2 className="font-semibold text-3xl text-[#111] uppercase">
              {product.title}
            </h2>
            <p className="uppercase text-[#334A78] font-medium text-xs">
              {product.details}
            </p>
            <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
              Category:{product.products?.category}
            </h5>
            <h5 className="uppercase text-[#334A78] font-medium text-xs opacity-80">
              Specification:{product.products?.subcategory1}
            </h5>
            <p className="text-[#334A78] text-sm font-medium">Final Price</p>
            <p className="font-semibold text-[#000] text-xl">
              ₹{product.price} 
            </p>
          </div>
        </div>
        <div className="flex text-[#000] justify-between  w-full p-4">
          {accountHolder.role !== "user" && (
            <button
              onClick={() => {
                handleDelete(product);
              }}
              className="px-3 py-2 capitalize border-[#FF6666] border-2 rounded-2xl flex justify-center items-center gap-2"
            >
              <MdDeleteOutline /> delete
            </button>
          )}
          {accountHolder.role === "admin" && (
            <div className="relative inline-block">
              {/* Update Status Button */}
              <button
                onClick={() => setStatusDropdown(!statusDropdown)}
                className="px-3 py-2 capitalize border-[#BBBBBB] border-2 bg-[#fff] rounded-2xl"
              >
                Update Status
              </button>

              {/* Dropdown Options */}
              {statusDropdown && (
                <div className="absolute mt-2 w-36 bg-white border border-gray-300 rounded-lg shadow-md">
                  {["pending", "approved", "rejected"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(product, status); // Call the function from props
                        setSelectedStatus(status); // Update UI
                        setStatusDropdown(false); // Close dropdown
                      }}
                      className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${
                        selectedStatus === status ? "bg-gray-200 font-bold" : ""
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <button
              onClick={onClose}
              className=" px-3 py-2 capitalize border-[#BBBBBB] border-2 bg-[#fff] rounded-2xl"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardProductCard;
