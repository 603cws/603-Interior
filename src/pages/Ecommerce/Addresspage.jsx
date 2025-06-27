import Header from "./Header";
import { useState } from "react";
import { useApp } from "../../Context/Context";
import BottomTabs from "./BottomTabs";
import { supabase } from "../../services/supabase";
import AddressForm from "./AddressForm";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import CheckoutStepper from "../../common-components/CheckoutStepper";
import { MdOutlineCancel, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AppliedCoupon from "../../common-components/AppliedCoupon";
import PriceDetail from "../../common-components/PriceDetail";

function Addresspage() {
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [removingAddressId, setRemovingAddressId] = useState(null);
  const [isAddressChangeOpen, setIsAddressChangeOpen] = useState(false);

  const [ismobilenewAddressOpen, setIsMobilenewAddressOpen] = useState(false);

  const navigate = useNavigate();

  const { accountHolder, fetchUserData, isAuthenticated } = useApp();

  //   console.log(accountHolder);

  const [addressFormdata, setaddressFormData] = useState({
    id: "" || undefined,
    name: "",
    mobile: "",
    address: "",
    pincode: "",
    state: "",
    city: "",
    town: "",
    ismarkedDefault: false,
  });

  const sortedAddressList = [...(accountHolder?.address || [])].sort(
    (a, b) => (b.ismarkedDefault === true) - (a.ismarkedDefault === true)
  );

  const getDefaultAddress = sortedAddressList.filter(
    (add) => add.ismarkedDefault === true
  );

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!addressFormdata.name.trim()) [newErrors.name] = "Name is required";
    if (!/^[6-9]\d{9}$/.test(addressFormdata.mobile))
      newErrors.mobile = "Invalid mobile number";
    if (!addressFormdata.address.trim())
      newErrors.address = "Address is required";
    if (!/^\d{6}$/.test(addressFormdata.pincode))
      newErrors.pincode = "Pincode must be 6 digits";
    if (!addressFormdata.state.trim()) newErrors.state = "State is required";
    if (!addressFormdata.city.trim()) newErrors.city = "City is required";
    if (!addressFormdata.town.trim()) newErrors.town = "Town is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setaddressFormData({
      ...addressFormdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("form data", addressFormdata);

    const uniqueID = uuidv4();

    const isFirstAddress = accountHolder?.address?.length === 0;

    // 1. Prepare the new address with an ID
    const newAddress = {
      ...addressFormdata,
      id: uniqueID,
      ismarkedDefault: isFirstAddress ? true : addressFormdata.ismarkedDefault,
    };

    // 2. Prepare the updated address list
    let updatedAddressList = [];

    if (newAddress.ismarkedDefault) {
      // If the new address is default, reset previous defaults
      updatedAddressList = (accountHolder?.address || []).map((addr) => ({
        ...addr,
        ismarkedDefault: false,
      }));
    } else {
      updatedAddressList = [...(accountHolder?.address || [])];
    }

    // Add the new address to the list
    updatedAddressList.push(newAddress);

    if (validate()) {
      console.log("Form submitted:", updatedAddressList);

      try {
        console.log("trying to update the supabase with new add");

        const { error } = await supabase
          .from("profiles")
          .update({ address: updatedAddressList })
          .eq("id", accountHolder?.userId);

        if (error) {
          console.log(error);
          return;
        }

        //  clear the form on succesful submission
        clearForm();
      } catch (error) {
        console.log(error);
      } finally {
        setIsAddressFormOpen(false);
        fetchUserData();
      }
    }
  };

  function clearForm() {
    setaddressFormData({
      name: "",
      mobile: "",
      address: "",
      pincode: "",
      state: "",
      city: "",
      town: "",
      ismarkedDefault: false,
    });

    setIsAddressFormOpen(false);
    setIsMobilenewAddressOpen(false);
  }

  // get the cart items from the cart table
  const { cartItems } = useApp();

  // created a reduce function to calculate the total price
  const totalPrice = cartItems?.reduce(
    (acc, curr) => acc + curr.productId?.price * curr.quantity,
    0
  );

  //new address
  const handlenewAddress = () => {
    if (accountHolder?.address?.length < 3) {
      setIsAddressFormOpen(true);
    } else {
      toast.error("Max 3 Address can be added");
    }
  };

  //remove address from the list
  const handleRemoveAddress = async (address) => {
    setRemovingAddressId(address.id);
    try {
      setIsSubmitting(true);
      if (address.ismarkedDefault) {
        toast.error("Default address cant be removed");
        return;
      }
      const updatedAddresslist = accountHolder?.address.filter(
        (add) => add.id !== address.id
      );

      const { error } = await supabase
        .from("profiles")
        .update({ address: updatedAddresslist })
        .eq("id", accountHolder?.userId);

      if (error) {
        console.log(error);
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchUserData();
      setIsSubmitting(false);
      setRemovingAddressId(null);
    }
  };

  //change default address
  const handleSetDefaultAddress = async (selectedId) => {
    const updatedAddressList = accountHolder.address.map((addr) => ({
      ...addr,
      ismarkedDefault: addr.id === selectedId, // only selected becomes true
    }));

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ address: updatedAddressList })
        .eq("id", accountHolder?.userId);

      if (error) {
        console.error("Failed to update default address:", error);
        return;
      }

      fetchUserData(); // refreshes the user and address list
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // handle the continue click
  const handleContinue = () => {
    if (isAuthenticated) {
      navigate("/payments");
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>
      <div className="lg:container lg:mx-auto px-3">
        <div className="hidden lg:block">
          <CheckoutStepper highlighted={"address"} />
        </div>

        <div className="flex justify-start items-center lg:hidden border-b border-b-[#ccc] mb-2 py-3">
          <button onClick={() => navigate(-1)}>
            <MdOutlineKeyboardArrowLeft size={25} />
          </button>
          <h2 className="font-Poppins font-medium text-sm leading-[22.5px] text-[#304778]">
            Address
          </h2>
        </div>

        <section>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 font-Poppins">
            {/* 1st half  */}
            <div className="flex-1 lg:space-y-5">
              <div className="lg:hidden">
                {accountHolder?.address?.length === 0 && (
                  <div>
                    <button
                      onClick={handlenewAddress}
                      className="font-Poppins text-[#334A78] w-full border border-[#334A78] py-2"
                    >
                      ADD ADDRESS
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden lg:block">
                {accountHolder?.address?.length === 0 && (
                  <AddressForm
                    handleChange={handleChange}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    clearForm={clearForm}
                    addressFormdata={addressFormdata}
                    setaddressFormData={setaddressFormData}
                  />
                )}
              </div>

              {accountHolder?.address?.length > 0 && (
                <div className="hidden lg:block">
                  <div className="font-Poppins flex justify-between items-center font-semibold">
                    <h2 className="text-[#171717] text-sm leading-[28.8px]">
                      Select Delivery Address
                    </h2>
                    <button
                      onClick={handlenewAddress}
                      className="px-5 py-2 border border-[#334A78] text-[10px] leading-[24px] text-[#334A78]"
                    >
                      ADD NEW ADDRESS
                    </button>
                  </div>
                  <h4 className="text-[#787878] font-Poppins font-medium text-xs leading-[28.8px]">
                    DEFAULT ADDRESS
                  </h4>
                </div>
              )}

              <div className="lg:hidden">
                {accountHolder?.address?.length > 0 &&
                  getDefaultAddress.map((add, index) => (
                    <div
                      key={index}
                      className="font-Poppins flex items-start gap-12 border border-[#ccc] p-5 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <h2 className="text-[#000000] font-medium text-sm leading-[28.8px] ">
                            {add.name}
                          </h2>
                        </div>
                        <div>
                          <p className="text-[#000000]/60  text-xs leading-[28.8px]">
                            {" "}
                            {`${add?.address}, ${add?.town}`}
                            <br />
                            {`${add?.city}, ${add?.state} - ${add?.pincode}`}
                          </p>
                        </div>
                        <p className="text-[#000000]/60  text-xs leading-[28.8px]">
                          Mobile:{" "}
                          <span className="!text-[#000] font-medium">
                            {add.mobile}
                          </span>
                        </p>
                      </div>
                      <div>
                        <button
                          // onClick={handlenewAddress}
                          onClick={() => setIsAddressChangeOpen(true)}
                          className="text-[#F87171] text-[10px] font-Poppins font-medium leading-7"
                        >
                          change
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {isAddressChangeOpen && (
                <div className="lg:hidden inset-0 fixed top-0 z-10 bg-[#000]/20 sm:flex sm:justify-center sm:items-center">
                  <div className=" bg-[#fff] p-2 h-[100vh] sm:h-[90vh] flex flex-col font-Poppins">
                    <div className="flex justify-start items-center lg:hidden border-b border-b-[#ccc] mb-2 py-3">
                      <button onClick={() => setIsAddressChangeOpen(false)}>
                        <MdOutlineKeyboardArrowLeft size={25} />
                      </button>
                      <h2 className="font-Poppins font-medium text-sm leading-[22.5px] text-[#304778]">
                        Select Address
                      </h2>
                    </div>
                    {!ismobilenewAddressOpen && (
                      <div>
                        <div>
                          <button
                            onClick={() => setIsMobilenewAddressOpen(true)}
                            className="font-Poppins text-[#334A78] w-full border border-[#334A78] py-2"
                          >
                            ADD NEW ADDRESS
                          </button>
                        </div>
                      </div>
                    )}

                    {ismobilenewAddressOpen && (
                      <div className="bg-[#fff] lg:hidden">
                        <form onSubmit={handleSubmit} method="post">
                          <div className="border border-[#CCCCCC] rounded-lg font-Poppins">
                            <div className="p-4 space-y-2 lg:space-y-3">
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
                              <h2 className="text-sm ">
                                Make this as my default address
                              </h2>
                            </div>

                            {/* button to add and clear address  */}

                            <div className="flex mx-2 md:mb-0 mt-2 lg:mt-6  justify-around items-center gap-10 font-Poppins font-semibold">
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
                    )}

                    {!ismobilenewAddressOpen && (
                      <div className="mt-6 flex-1 overflow-y-scroll space-y-2">
                        {accountHolder?.address?.length > 0 &&
                          sortedAddressList.map((add, index) => (
                            <AddressCard
                              removingAddressId={removingAddressId}
                              add={add}
                              handleSetDefaultAddress={handleSetDefaultAddress}
                              handleRemoveAddress={handleRemoveAddress}
                              key={index}
                            />
                          ))}
                      </div>
                    )}

                    {/* {!ismobilenewAddressOpen && (
                      <div className=" flex justify-between items-center font-Poppins gap-2">
                        <button className="w-full text-[#fff] bg-[#304778] border border-[#213625] py-2">
                          Apply
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              )}

              <div className="space-y-3 hidden lg:block">
                {accountHolder?.address?.length > 0 &&
                  sortedAddressList.map((add, index) => (
                    <AddressCard
                      removingAddressId={removingAddressId}
                      add={add}
                      handleSetDefaultAddress={handleSetDefaultAddress}
                      handleRemoveAddress={handleRemoveAddress}
                      key={index}
                    />
                  ))}
              </div>

              {accountHolder?.address?.length > 0 && (
                <div className="hidden lg:block border boder-[#ccc] p-4 rounded-md">
                  <button
                    onClick={handlenewAddress}
                    className="text-[#334A78] text-sm leading-[28.8px] font-Poppins font-semibold"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
            {/* second half */}
            <div className="flex-1 lg:border-l-[1px] lg:pl-10 font-Poppins ">
              <div className="mb-6">
                <h2>DELIVERY ESTIMATES</h2>

                {cartItems?.map((item, index) => (
                  <DeliveryEstimate product={item} key={index} />
                ))}
              </div>
              <div className="mb-12 lg:mb-0 text-sm lg:text-base">
                <h4 className="uppercase mb-7 text-[#111]  font-medium">
                  price details ({cartItems?.length} Items)
                </h4>
                <div className="space-y-6 pb-6">
                  <div className="flex justify-between">
                    <h5 className="font-medium  text-[#111111]/80">
                      Total MRP
                    </h5>
                    <h5 className="font-medium  text-[#111111]/80 ">
                      Rs {totalPrice || 0}
                    </h5>
                  </div>

                  <div className="flex justify-between">
                    <h5 className="font-medium  text-[#111111]/80">
                      Discount on MRP
                    </h5>
                    <h5 className="font-medium  text-[#34BFAD]/80 ">-$3,600</h5>
                  </div>

                  <div className="flex justify-between">
                    <h5 className="font-medium  text-[#111111]/80">
                      Coupon Discount
                    </h5>
                    <h5 className="font-medium  text-[#F87171]">
                      Apply Coupon
                    </h5>
                  </div>

                  <div className="flex justify-between border-b-[1px]">
                    <div>
                      <h5 className="font-medium  text-[#111111]/80">
                        Shipping Fee
                      </h5>
                      <p className="text-xs text-[#111111]/50 font-medium pb-2">
                        Free Shipping for you
                      </p>
                    </div>
                    <h5 className="font-medium  text-[#34BFAD]/80 uppercase">
                      Free
                    </h5>
                  </div>

                  <div className="flex justify-between">
                    <h5 className="font-medium lg:text-xl text-[#111111] uppercase">
                      Total Amount
                    </h5>
                    <h5 className="font-medium lg:text-xl text-[#111111] ">
                      $3,196
                    </h5>
                  </div>
                </div>
              </div>

              {/* <PriceDetail /> */}

              {accountHolder?.address?.length > 0 && (
                <button
                  onClick={handleContinue}
                  className="hidden uppercase text-xl text-[#ffffff] tracking-wider w-full lg:flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      <div className="hidden lg:block mt-10">
        <BottomTabs />
      </div>

      {accountHolder?.address?.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-center items-center mb-2">
          <div className="w-[90%]">
            <button
              onClick={handleContinue}
              className="uppercase text-xl text-white tracking-wider w-full bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/*  && accountHolder?.address?.length < 3 */}

      {isAddressFormOpen && accountHolder?.address?.length < 3 && (
        <div className="fixed z-10 bg-black/30 inset-0 flex justify-center items-center">
          <AddressForm
            handleChange={handleChange}
            errors={errors}
            handleSubmit={handleSubmit}
            clearForm={clearForm}
            addressFormdata={addressFormdata}
            setaddressFormData={setaddressFormData}
            isAddressnew={true}
          />
        </div>
      )}
    </>
  );
}

export default Addresspage;

function AddressCard({
  add,
  handleSetDefaultAddress,
  handleRemoveAddress,
  removingAddressId,
}) {
  return (
    <div className="font-Poppins flex items-start gap-3 border border-[#ccc] p-5 rounded-md  ">
      <div className="mt-1">
        <input
          type="checkbox"
          checked={add.ismarkedDefault}
          onChange={() => handleSetDefaultAddress(add.id)}
          className="cursor-pointer"
        />
      </div>
      <div className="">
        <div className="flex gap-2">
          <h2 className="text-[#000000] font-medium text-sm leading-[28.8px] ">
            {add.name}
          </h2>
        </div>
        <div>
          <p className="text-[#000000]/60  text-sm leading-[24.8px]">
            {" "}
            {`${add?.address}, ${add?.town}`}
            <br />
            {`${add?.city}, ${add?.state} - ${add?.pincode}`}
          </p>
        </div>
        <p className="text-[#000000]/60  text-sm leading-[28.8px]">
          Mobile: <span className="!text-[#000]">{add.mobile}</span>
        </p>
        <div className="flex items-center gap-5">
          <button
            onClick={() => handleRemoveAddress(add)}
            className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md"
            disabled={removingAddressId === add.id}
          >
            {removingAddressId === add.id ? (
              <div className="spinner flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Remove"
            )}
          </button>
          <button className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function DeliveryEstimate({ product }) {
  return (
    <div className="flex lg:border-b lg:border-b-[#ccc] p-4 font-Poppins font-medium items-center gap-2">
      <div>
        <img
          src={product.productId.image}
          alt="sample prodcut "
          className="w-16 object-contain"
        />
      </div>
      <p className="text-sm text-[#111]/60 leading-[22.4px]">
        Estimated delivery by {/* date-month-year  */}
        <span className="text-[#111]">9 Jun 2025</span>{" "}
      </p>
    </div>
  );
}
