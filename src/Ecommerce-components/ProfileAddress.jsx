import { useState } from "react";
import { useApp } from "../Context/Context";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";

function ProfileAddress() {
  const { accountHolder, fetchUserData, isAuthenticated } = useApp();
  const [errors, setErrors] = useState({});
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingAddressId, setRemovingAddressId] = useState(null);
  const [isAddressEdit, setIsAddressEdit] = useState(false);

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
  const [editaddressFormdata, setEditaddressFormData] = useState({
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

  const handleEditAddress = (address) => {
    setEditaddressFormData({
      id: address?.id,
      name: address?.name,
      mobile: address?.mobile,
      address: address?.address,
      pincode: address?.pincode,
      state: address?.state,
      city: address?.city,
      town: address?.town,
      ismarkedDefault: address?.ismarkedDefault,
    });

    setIsAddressEdit(true);
  };

  console.log("edited format", editaddressFormdata);

  //length of add
  const TotalAddress = accountHolder?.address?.length;

  const handleChange = (e) => {
    setaddressFormData({
      ...addressFormdata,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditAddressChange = (e) => {
    setEditaddressFormData({
      ...editaddressFormdata,
      [e.target.name]: e.target.value,
    });
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
  }
  function clearEditForm() {
    setEditaddressFormData({
      name: "",
      mobile: "",
      address: "",
      pincode: "",
      state: "",
      city: "",
      town: "",
      ismarkedDefault: false,
    });
    setIsAddressEdit(false);
    setErrors({});
  }

  const validate = (addressFormdata) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // console.log("Form submitted:", updatedAddressList);

    if (validate(addressFormdata)) {
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
  const handleEditAddressSubmit = async (e) => {
    e.preventDefault();

    // 1. Prepare the new address with an ID
    const updatedAddress = {
      ...editaddressFormdata,
    };

    // 2. Prepare the updated address list
    // let updatedAddressList = [];
    let updatedAddressList = [...(accountHolder?.address || [])].map((addr) =>
      addr.id === updatedAddress.id ? updatedAddress : addr
    );

    if (updatedAddress.ismarkedDefault) {
      updatedAddressList = updatedAddressList.map((addr) => ({
        ...addr,
        ismarkedDefault: addr.id === updatedAddress.id,
      }));
    }

    // console.log("Form submitted:", updatedAddressList);
    console.log("Form submitted:", updatedAddressList);

    if (validate(editaddressFormdata)) {
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
        // setIsAddressFormOpen(false);
        setIsAddressEdit(false);
        fetchUserData();
      }
    }
  };

  const handleAddAddress = () => {
    if (accountHolder?.address?.length < 3) {
      setIsAddressFormOpen(!isAddressFormOpen);
    }
  };

  const sortedAddressList = [...(accountHolder?.address || [])].sort(
    (a, b) => (b.ismarkedDefault === true) - (a.ismarkedDefault === true)
  );

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

  return (
    <div className="font-Poppins">
      {TotalAddress < 3 && (
        <div className="font-Poppins py-2">
          <button
            onClick={handleAddAddress}
            className="w-full text-xs leading-6 text-[#334A78] border border-[#334A78] py-2"
          >
            Add new Address
          </button>
        </div>
      )}

      {isAddressFormOpen && (
        <AddressForm
          errors={errors}
          clearForm={clearForm}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          Formdata={addressFormdata}
          setdata={setaddressFormData}
        />
      )}

      <div className="space-y-3 mt-3">
        {accountHolder?.address?.length > 0 &&
          !isAddressFormOpen &&
          sortedAddressList.map((add, index) => (
            <AddressCard
              removingAddressId={removingAddressId}
              add={add}
              handleSetDefaultAddress={handleSetDefaultAddress}
              handleRemoveAddress={handleRemoveAddress}
              handleEditAddress={handleEditAddress}
              key={index}
            />
          ))}
      </div>

      {isAddressEdit && (
        <div className=" fixed inset-0 flex justify-center items-center bg-black/30 ">
          <AddressForm
            errors={errors}
            clearForm={clearEditForm}
            handleChange={handleEditAddressChange}
            handleSubmit={handleEditAddressSubmit}
            Formdata={editaddressFormdata}
            setdata={setEditaddressFormData}
          />
        </div>
      )}
    </div>
  );
}

export default ProfileAddress;

function CustomInput({
  label,
  required = true,
  type,
  id,
  value,
  onchange,
  className,
  errors = "",
  name,
  ...rest
}) {
  // const [value, setvalue] = useState();
  const isFloating = value && value.length > 0;
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onchange}
        name={name}
        // onChange={(e) => setvalue(e.target.value)}
        placeholder={label}
        required={required}
        className={`peer placeholder:text-sm border border-[#AAA] px-2 py-2 focus:outline-none focus:[#CCCCCC] w-full rounded-md placeholder-transparent ${className}`}
        {...rest}
        // className="peer w-full px-4 pt-6 pb-2 text-black bg-white border border-gray-300 rounded-md placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <label
        htmlFor={id}
        className={`absolute left-2 px-[1px] bg-[#fff] transition-all text-sm text-gray-500 
          ${
            isFloating
              ? "-top-2 text-sm text-[#aaa]"
              : "top-2.5 text-base text-gray-400"
          } 
          peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#aaa]`}
      >
        {label}
      </label>
      {errors && (
        <p className="text-red-500 text-xs lg:text-sm mt-1">{errors}</p>
      )}
    </div>
  );
}

function AddressCard({
  add,
  handleSetDefaultAddress,
  handleRemoveAddress,
  removingAddressId,
  handleEditAddress,
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
          <button
            onClick={() => handleEditAddress(add)}
            className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function AddressForm({
  handleChange,
  handleSubmit,
  Formdata,
  setdata,
  errors,
  clearForm,
}) {
  return (
    <div className="bg-[#fff] p-4 ">
      <form onSubmit={handleSubmit} method="post">
        <h3 className="text-[#171717] text-sm leading-7 font-semibold my-3">
          ADDRESS
        </h3>
        <div className=" font-Poppins">
          <div className="mb-5 flex items-center gap-3">
            <CustomInput
              label={"Name"}
              name={"name"}
              type={"text"}
              id={"name"}
              value={Formdata.name}
              onchange={handleChange}
            />
            <CustomInput
              label={"Mobile"}
              name={"mobile"}
              value={Formdata.mobile}
              onchange={handleChange}
              type={"number"}
              id={"mobile"}
              min={0}
              errors={errors?.mobile}
              className={
                "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  [&::-webkit-inner-spin-button]:m-0 "
              }
            />
          </div>
          <div className="space-y-5">
            <CustomInput
              label={"Address (House No, Building, Street, Area)*"}
              type={"text"}
              id={"address"}
              name={"address"}
              value={Formdata.address}
              onchange={handleChange}
            />
            <CustomInput
              label={"Locality / Town*"}
              type={"text"}
              id={"town"}
              name={"town"}
              value={Formdata.town}
              onchange={handleChange}
            />

            <CustomInput
              label={"Pin Code*"}
              type={"number"}
              id={"pincode"}
              name={"pincode"}
              value={Formdata.pincode}
              onchange={handleChange}
              min={0}
              errors={errors?.pincode}
              className={
                "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  [&::-webkit-inner-spin-button]:m-0 "
              }
            />

            <div className="text-[#000] flex gap-2">
              <CustomInput
                label={"City / District*"}
                type={"text"}
                id={"city"}
                name={"city"}
                value={Formdata.city}
                onchange={handleChange}
              />
              <CustomInput
                label={"State*"}
                type={"text"}
                id={"state"}
                name={"state"}
                value={Formdata.state}
                onchange={handleChange}
              />
            </div>
          </div>
          <div className="my-6 flex gap-2">
            <input
              type="checkbox"
              checked={Formdata.ismarkedDefault}
              onChange={(e) =>
                setdata((prev) => ({
                  ...prev,
                  ismarkedDefault: e.target.checked,
                }))
              }
            />
            <h2 className="text-sm ">Make this as my default address</h2>
          </div>

          {/* button to add and clear address  */}

          <div className="flex mb-2 justify-start items-center gap-5 font-Poppins font-semibold">
            <button
              type="submit"
              className="uppercase text-xs text-[#ffffff] tracking-wider   px-12 py-3 flex justify-center items-center bg-[#334A78] border border-[#212B36]  rounded-sm font-thin"
            >
              Save
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="uppercase text-xs  tracking-wider px-12 py-3 flex justify-center items-center  border border-[#AAA]  rounded-sm font-thin"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
