import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../../../services/supabase";
import Spinner from "../../../common-components/Spinner";
import BackButton from "../../../common-components/BackButton";

function EditDiscount({ coupon, onClose, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      couponName: coupon?.couponName ?? "",
      discountPerc: coupon?.discountPerc ?? "",
      minAmount: coupon?.minAmount ?? "",
      expiryDate: coupon?.expiryDate ?? "",
      maxLimit: coupon?.maxLimit ?? "",
    },
  });

  // Keep form in sync if a different coupon arrives
  useEffect(() => {
    if (!coupon) return;
    reset({
      couponName: coupon.couponName ?? "",
      discountPerc: coupon.discountPerc ?? "",
      minAmount: coupon.minAmount ?? "",
      expiryDate: coupon.expiryDate ?? "",
      maxLimit: coupon.maxLimit ?? "",
    });
  }, [coupon, reset]);

  // Ensure number fields stay numbers in state (optional but helps prevent string writes)
  const coerceNumbers = (data) => ({
    ...data,
    discountPerc: data.discountPerc ? Number(data.discountPerc) : null,
    minAmount: data.minAmount ? Number(data.minAmount) : null,
    maxLimit: data.maxLimit ? Number(data.maxLimit) : null,
  });

  async function handleDiscountUpdate(formData) {
    if (!coupon?.id) {
      toast.error("Missing coupon id.");
      return;
    }
    setUpdating(true);
    try {
      const payload = coerceNumbers(formData);

      const { error } = await supabase
        .from("coupons")
        .update({
          couponName: payload.couponName,
          expiryDate: payload.expiryDate,
          minAmount: payload.minAmount,
          maxLimit: payload.maxLimit,
          discountPerc: payload.discountPerc,
        })
        .eq("id", coupon.id);

      if (error) {
        if (error.code === "23505") {
          toast.error(`Coupon with name ${payload.couponName} already exists.`);
        } else {
          toast.error(error.message || "Failed to update coupon.");
        }
        return;
      }

      toast.success("Coupon updated successfully");
      onUpdate && onUpdate();
      onClose && onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Unexpected error while updating coupon.");
    } finally {
      setUpdating(false);
    }
  }

  const handleDiscard = () => {
    reset({
      couponName: coupon?.couponName ?? "",
      discountPerc: coupon?.discountPerc ?? "",
      minAmount: coupon?.minAmount ?? "",
      expiryDate: coupon?.expiryDate ?? "",
      maxLimit: coupon?.maxLimit ?? "",
    });
  };

  const todayIso = new Date().toISOString().split("T")[0];

  return (
    <>
      {updating ? (
        <div className="flex flex-col justify-center items-center h-full relative">
          <p className="absolute top-1/3 text-xl font-Poppins text-[#ccc] font-semibold">
            Hold On! Data is being updated...
          </p>
          <Spinner />
        </div>
      ) : (
        <div className="font-Poppins overflow-auto">
          <div className="border-b border-b-[#ccc]">
            <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg flex items-center gap-3">
              Edit discount
            </h2>
            <BackButton
              label="Back to blog list"
              onClick={onClose}
              className="ml-3 mb-3"
            />
          </div>

          <form
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            onSubmit={handleSubmit(handleDiscountUpdate)}
            className="p-2 md:p-4"
          >
            <div className="border border-[#ccc] rounded-md m-3 space-y-3 p-3 space-x-2">
              <label className="font-medium text-lg lg:text-xl text-[#000]">
                Discount code
              </label>
              <input
                {...register("couponName", {
                  required: true,
                  maxLength: { value: 10, message: "max 10 character" },
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
            <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3">
              <div className="flex-1 flex flex-col p-3 space-y-3">
                <label className="font-medium text-xl text-[#000]">
                  Discount value (In percentage)
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
                    min: {
                      value: 1,
                      message: "value should be greater than 0",
                    },
                  })}
                  required
                  className="p-1 border-2 border-[#ccc]"
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
            <div className="flex flex-col md:flex-row border border-[#ccc] rounded-md m-3">
              <div className="flex-1 flex flex-col p-3 space-y-3">
                <label className="font-medium text-xl text-[#000]">
                  Expiry Date
                </label>
                <input
                  type="date"
                  min={todayIso}
                  {...register("expiryDate", { required: true })}
                  className="p-1 border-2 border-[#ccc]"
                  required
                />
                {errors?.expiryDate && (
                  <p className="text-red-800 text-sm capitalize">
                    {errors?.expiryDate?.message}
                  </p>
                )}
              </div>

              <div className="flex-1 flex flex-col p-3 space-y-3">
                <label className="font-medium text-xl text-[#000]">
                  Max Limit
                </label>
                <input
                  type="number"
                  {...register("maxLimit", {
                    required: true,
                    min: {
                      value: 1,
                      message: "value should be greater than 0",
                    },
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

            {/* Actions */}
            <div className="flex justify-end space-x-6 m-3">
              <button
                className="border border-[#ccc] hover:bg-gray-100 px-5 py-3 text-[#111] rounded-lg disabled:cursor-not-allowed"
                type="button"
                onClick={handleDiscard}
                disabled={!isDirty}
                title={!isDirty ? "No changes to discard" : "Discard changes"}
              >
                Discard
              </button>
              <button
                className="border border-[#ccc] px-5 py-3 text-[#fff] bg-[#374A75] hover:bg-[#6d87c4] rounded-lg disabled:opacity-60"
                type="submit"
                disabled={updating}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EditDiscount;
