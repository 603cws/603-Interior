import { useForm } from "react-hook-form";
import { supabase } from "../../../services/supabase";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import EditDiscount from "./EditDiscount";
import PagInationNav from "../../../common-components/PagInationNav";
import { handleError } from "../../../common-components/handleError";

function Discount() {
  const [disocunts, setDisounts] = useState([]);
  const [createDiscount, setCreateDiscount] = useState(false);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [editDiscount, setEditDiscount] = useState(null);
  const [discountsToDelete, setDiscountsToDelete] = useState(null);

  useEffect(() => {
    fetchDiscountCoupons();
  }, []);

  const fetchDiscountCoupons = async () => {
    try {
      const { data, error } = await supabase.from("coupons").select("*");
      if (error)
        handleError(error, {
          prodMessage: "Error fetching discounts. Please try again.",
        });
      setDisounts(data);
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (selectedDiscounts.length === 0) return;

    try {
      const { error } = await supabase
        .from("coupons")
        .delete()
        .in("id", selectedDiscounts);

      if (error) throw error;

      setSelectedDiscounts([]);
      fetchDiscountCoupons();
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div>
      {createDiscount ? (
        <DiscountForm setCreateDiscount={setCreateDiscount} />
      ) : editDiscount ? (
        <EditDiscount
          coupon={editDiscount}
          onClose={() => setEditDiscount(false)}
          onUpdate={fetchDiscountCoupons}
        />
      ) : (
        <div>
          <div className="border-b border-b-[#ccc]">
            <div className="flex justify-between items-center">
              <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg ">
                Discount Management
              </h2>
              <div className="px-2 py-2 flex gap-2">
                {selectedDiscounts.length > 0 && (
                  <button
                    onClick={() => setDiscountsToDelete([...selectedDiscounts])}
                    className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-sm md:text-lg font-medium hover:bg-[#f1f1f1]"
                  >
                    Delete ({selectedDiscounts.length})
                  </button>
                )}
                <button
                  onClick={() => setCreateDiscount((prev) => !prev)}
                  className="px-2 py-1 md:px-4 md:py-2 border border-[#CCCCCC] rounded-md text-[#374A75] text-lg font-medium hover:bg-[#f1f1f1] flex items-center gap-1"
                >
                  + <span className="hidden lg:block">Add Discount</span>
                </button>
              </div>
            </div>
          </div>
          <div>
            <CouponTable
              selectedDiscounts={selectedDiscounts}
              setSelectedDiscounts={setSelectedDiscounts}
              disocunts={disocunts}
              setEditDiscount={setEditDiscount}
            />
          </div>
          {discountsToDelete && (
            <DeleteDiscountWarning
              count={discountsToDelete.length}
              onCancel={() => setDiscountsToDelete(null)}
              onConfirm={async () => {
                await handleDelete(discountsToDelete);
                setDiscountsToDelete(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Discount;

const CouponTable = ({
  selectedDiscounts,
  setSelectedDiscounts,
  disocunts,
  setEditDiscount,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const discountCouponPerPage = 9;

  const indexoflastDisocunt = currentPage * discountCouponPerPage;
  const indexofFirstDiscount = indexoflastDisocunt - discountCouponPerPage;
  const currentBlogs = disocunts.slice(
    indexofFirstDiscount,
    indexoflastDisocunt,
  );

  const totalPages = Math.ceil(disocunts.length / discountCouponPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const allSelected =
    currentBlogs.length > 0 && selectedDiscounts.length === currentBlogs.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDiscounts(currentBlogs.map((b) => b.id));
    } else {
      setSelectedDiscounts([]);
    }
  };

  const handleCheckboxChange = (blogId) => {
    setSelectedDiscounts((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
    );
  };

  return (
    <div className="p-4">
      <table className="w-full text-left">
        <thead className="text-[#232321]/80 font-semibold ">
          <tr className="border-b">
            <th className="py-2">
              <input
                type="checkbox"
                name=""
                id=""
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="py-2">Title</th>
            <th className="py-2">Expiry</th>
            <th className="py-2">Discount Perc(%)</th>
            <th className="py-2">Min Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentBlogs.map((disocunts) => (
            <tr
              key={disocunts.id}
              onClick={() => setEditDiscount(disocunts)}
              className="border-b text-xs md:text-sm text-[#000] font-semibold hover:bg-[#f1f1f1] cursor-pointer"
            >
              <td className="py-3.5">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  onClick={(e) => e.stopPropagation()}
                  checked={selectedDiscounts.includes(disocunts.id)}
                  onChange={() => handleCheckboxChange(disocunts.id)}
                />
              </td>
              <td className="py-3.5">{disocunts?.couponName}</td>
              <td className="py-3.5">{disocunts?.expiryDate}</td>
              <td className="py-3.5">{disocunts?.discountPerc}</td>
              <td className="py-3.5">{disocunts?.minAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PagInationNav
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

function DiscountForm({ setCreateDiscount }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function handleDiscountSubmit(formData) {
    try {
      const { data, error } = await supabase
        .from("coupons")
        .insert([
          {
            couponName: formData?.couponName,
            expiryDate: formData?.expiryDate,
            minAmount: formData?.minAmount,
            maxLimit: formData?.maxLimit,
            discountPerc: formData?.discountPerc,
          },
        ])
        .select();

      if (error) {
        throw error;
      }
      if (data) {
        reset();
        toast.success("coupon created successfully");
      }
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });

      if (error.code === "23505") {
        toast.error(`coupon with name  ${formData?.couponName}  already exist`);
      }
    }
  }
  return (
    <div className="font-Poppins overflow-auto">
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onSubmit={handleSubmit(handleDiscountSubmit)}
      >
        <div className="border-b border-b-[#ccc]">
          <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg flex items-center gap-3">
            <button onClick={() => setCreateDiscount((prev) => !prev)}>
              <IoMdArrowBack size={25} />
            </button>{" "}
            Create discount
          </h2>
        </div>
        <div className="border border-[#ccc] rounded-md m-3 space-y-9">
          <div className="flex flex-col p-3 space-y-3">
            <label className="font-medium text-lg lg:text-xl text-[#000]">
              Discount code
            </label>
            <input
              {...register("couponName", {
                required: true,
                maxLength: { value: 10, message: "max 10 character " },
              })}
              placeholder="test10"
              type="text"
              required
              className="p-1 border-2 border-[#ccc]"
            />
            {errors?.couponName && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.couponName?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Discount value(In percentage)
            </label>
            <input
              type="number"
              placeholder="discount percentage"
              {...register("discountPerc", {
                required: true,
                maxLength: {
                  value: 2,
                  message: "percentage should be less than 100",
                },
                min: { value: 1, message: "value should be greater than 0" },
              })}
              required
              className="p-1 border-2 border-[#ccc] "
            />
            {errors?.discountPerc && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.discountPerc?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Minimum Purchase Amount
            </label>
            <input
              type="number"
              placeholder="₹ 999"
              required
              {...register("minAmount", {
                required: true,
                min: { value: 100, message: "min amount should be 100" },
              })}
              className="p-1 border-2 border-[#ccc] rounded-md"
            />
            {errors?.minAmount && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.minAmount?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Expiry Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              {...register("expiryDate", {
                required: true,
              })}
              className="p-1 border-2 border-[#ccc] "
              required
            />
            {errors?.expiryDate && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.expiryDate?.message}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">Max Limit</label>
            <input
              type="number"
              {...register("maxLimit", {
                required: true,
                min: { value: 1, message: "value should be greater than 0" },
              })}
              className="p-1 border-2 border-[#ccc] rounded-md"
              required
              placeholder="20"
            />
            {errors?.maxLimit && (
              <p className="text-red-800 text-sm capitalize">
                {errors?.maxLimit?.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-6 m-3">
          <button
            className="border border-[#ccc] hover:bg-gray-100 px-5 py-3 text-[#111] rounded-lg "
            type="reset"
            onClick={reset}
          >
            Discard
          </button>
          <button
            className="border border-[#ccc] px-5 py-3 text-[#fff] bg-[#374A75] hover:bg-[#6d87c4] rounded-lg "
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteDiscountWarning({ count, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-xs md:max-w-sm w-full">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Confirm Deletion
        </h3>

        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete <b>{count}</b>{" "}
          {count === 1 ? "discount" : "discounts"}?
          <br />
          <span className="text-red-500 font-medium">
            This action cannot be undone.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
