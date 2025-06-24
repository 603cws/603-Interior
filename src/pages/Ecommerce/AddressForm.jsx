import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

function AddressForm({
  handleSubmit,
  addressFormdata,
  handleChange,
  errors,
  setaddressFormData,
  clearForm,
  isAddressnew = false,
}) {
  return (
    <div className="bg-[#fff]">
      <form onSubmit={handleSubmit} method="post">
        <div className="border border-[#CCCCCC] rounded-lg font-Poppins">
          <div className="p-4 space-y-2 lg:space-y-3">
            {isAddressnew && (
              // <div className="my-6 border-b  border-b-[#ccc]">
              //   <h1 className="font-semibold text-[#171717] text-sm leading-[28.8px]">
              //     ADD NEW ADDRESS
              //   </h1>
              // </div>
              <div className="flex justify-start items-center lg:hidden border-b border-b-[#ccc] mb-2 py-3">
                <button className="cursor-pointer">
                  <MdOutlineKeyboardArrowLeft size={25} />
                </button>
                <h2 className="font-Poppins font-medium text-xs lg:text-sm leading-[22.5px] text-[#304778]">
                  ADD NEW ADDRESS
                </h2>
              </div>
            )}
            <h2 className="font-semibold text-[#171717] text-xs lg:text-sm leading-[28.8px]">
              CONTACT DETAILS
            </h2>
            <div className="text-[#AAAAAA]  w-full">
              <input
                type="text"
                placeholder="Name*"
                name="name"
                value={addressFormdata.name}
                onChange={(e) => handleChange(e)}
                required
                className="placeholder:text-sm border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
              />
            </div>
            <div className="text-[#AAAAAA] w-full">
              <input
                type="number"
                placeholder="Mobile No*"
                name="mobile"
                value={addressFormdata.mobile}
                min={0}
                onChange={(e) => handleChange(e)}
                required
                className="placeholder:text-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:m-0 border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs lg:text-sm-sm mt-1">
                  {errors.mobile}
                </p>
              )}
            </div>
          </div>
          <div className="p-4 space-y-2 lg:space-y-3">
            <h2 className="font-semibold text-[#171717] text-xs lg:text-sm">
              ADDRESS
            </h2>
            <div className="text-[#AAAAAA] w-full">
              <input
                type="text"
                placeholder="Address (House No, Building, Street, Area)*"
                name="address"
                value={addressFormdata.address}
                onChange={(e) => handleChange(e)}
                required
                className="border placeholder:text-sm border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
              />
            </div>
            <div className="text-[#AAAAAA] w-full">
              <input
                type="text"
                placeholder="Locality / Town*"
                name="town"
                value={addressFormdata.town}
                onChange={(e) => handleChange(e)}
                required
                className=" placeholder:text-sm border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
              />
            </div>
            <div className="text-[#AAAAAA] w-full">
              <input
                type="number"
                placeholder="Pin Code*"
                name="pincode"
                value={addressFormdata.pincode}
                onChange={(e) => handleChange(e)}
                min={0}
                required
                className="placeholder:text-sm appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:m-0 border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs lg:text-sm mt-1">
                  {errors.pincode}
                </p>
              )}
            </div>
            <div className="text-[#AAAAAA] flex gap-2">
              <input
                type="text"
                placeholder="City / District*"
                name="city"
                value={addressFormdata.city}
                onChange={(e) => handleChange(e)}
                required
                className="placeholder:text-sm border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-1/2 rounded-md"
              />
              <input
                type="text"
                placeholder="State*"
                name="state"
                value={addressFormdata.state}
                onChange={(e) => handleChange(e)}
                required
                className="placeholder:text-sm border border-[#CCCCCC] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-1/2 rounded-md"
              />
            </div>
          </div>
          <div className="p-2 lg:p-4 flex gap-2">
            <input
              type="checkbox"
              checked={addressFormdata.ismarkedDefault}
              onChange={(e) =>
                setaddressFormData((prev) => ({
                  ...prev,
                  ismarkedDefault: e.target.checked,
                }))
              }
            />
            <h2 className="text-sm ">Make this as my default address</h2>
          </div>

          {/* button to add and clear address  */}

          <div className="flex mx-2 mt-3 lg:mt-6 mb-2 justify-around items-center gap-10 font-Poppins font-semibold">
            <button
              type="button"
              onClick={clearForm}
              className="uppercase text-lg lg:text-xl  tracking-wider w-1/2  flex justify-center items-center  border border-[#CCCCCC] py-3 rounded-sm font-thin"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="uppercase text-lg lg:text-xl text-[#ffffff] tracking-wider w-1/2   flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddressForm;
