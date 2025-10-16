import { useForm } from "react-hook-form";
import { supabase } from "../../../services/supabase";
import toast from "react-hot-toast";
import { useEffect } from "react";

function Discount() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function handleDiscountSubmit(formData) {
    try {
      // insert the data into the db

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

      // if inserted successfuly clear the form
      if (data) {
        reset();
        toast.success("coupon created successfully");
        console.log("data", data);
      }
    } catch (error) {
      console.log("error", error);

      if (error.code == "23505") {
        toast.error(`coupon with name  ${formData?.couponName}  already exist`);
      }
    }
  }

  return (
    <div className="font-Poppins">
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onSubmit={handleSubmit(handleDiscountSubmit)}
      >
        <div className="border-b border-b-[#ccc]">
          <h2 className="p-2 font-semibold text-[#374A75] lg:text-2xl md:text-xl text-lg ">
            Create discount
          </h2>
        </div>
        <div className="border border-[#ccc] rounded-md m-3 space-y-9">
          <div className="flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              Discount code
            </label>
            <input
              {...register("couponName", {
                required: true,
                maxLength: { value: 10, message: "max 10 character " },
              })}
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
        <div className="flex border border-[#ccc] rounded-md m-3 ">
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
              Minimum purchase Amount
            </label>
            <input
              type="number"
              placeholder="Rs 999"
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
        <div className="flex border border-[#ccc] rounded-md m-3 ">
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">
              expiry date
            </label>
            <input
              type="date"
              {...register("expiryDate", { required: true })}
              className="p-1 border-2 border-[#ccc] "
              required
            />
          </div>
          <div className="flex-1 flex flex-col p-3 space-y-3">
            <label className="font-medium text-xl text-[#000]">max limit</label>
            <input
              type="number"
              {...register("maxLimit", { required: true })}
              className="p-1 border-2 border-[#ccc] rounded-md"
              required
            />
          </div>
        </div>
        <div className="flex justify-end space-x-6 m-3">
          <button
            className="border border-[#ccc] px-5 py-3 text-[#111] rounded-lg "
            type="reset"
            onClick={reset}
          >
            Discard
          </button>
          <button
            className="border border-[#ccc] px-5 py-3 text-[#fff] bg-[#374A75] rounded-lg "
            type="submit"
          >
            save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Discount;
