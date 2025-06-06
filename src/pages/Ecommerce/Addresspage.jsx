import Header from "./Header";
import { useState } from "react";
import { useApp } from "../../Context/Context";
import BottomTabs from "./BottomTabs";
import { supabase } from "../../services/supabase";
import AddressForm from "./AddressForm";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

function Addresspage() {
  const [isaddressPresent, setIsaddressPresnt] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);

  const { accountHolder, fetchUserData } = useApp();

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

    // 1. Prepare the new address with an ID
    const newAddress = {
      ...addressFormdata,
      id: uniqueID,
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
  }

  // get the cart items from the cart table
  const { cartItems } = useApp();

  // created a reduce function to calculate the total price
  const totalPrice = cartItems?.reduce(
    (acc, curr) => acc + curr.productId?.price * curr.quantity,
    0
  );

  //   new address
  const handlenewAddress = () => {
    if (accountHolder?.address?.length < 3) {
      setIsAddressFormOpen(true);
    } else {
      toast.error("Max 3 Address can be added");
    }
  };

  //remove address from the list
  const handleRemoveAddress = async (address) => {
    try {
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
    }
  };
  return (
    <>
      <Header />
      <div className="container">
        <div className="!my-10 flex items-center justify-center text-[#334A78] text-lg capitalize font-Poppins leading-[16.8px]">
          <div className="flex items-center gap-2">
            <p className="text-[#334A78]">cart</p>
            <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p className="text-[#549DC7]">Address</p>
            <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
            <p>Payment</p>
          </div>
        </div>

        <section>
          <div className="flex gap-10 font-Poppins">
            {/* 1st half  */}
            <div className="flex-1 space-y-5">
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

              {accountHolder?.address?.length > 0 && (
                <div>
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

              <div className="space-y-3">
                {accountHolder?.address?.length > 0 &&
                  accountHolder?.address.map((add, index) => (
                    <div
                      key={index}
                      className="font-Poppins flex items-start gap-3 border border-[#ccc] p-5 rounded-md  "
                    >
                      <div className="mt-1">
                        <input
                          type="checkbox"
                          checked={add.ismarkedDefault}
                          readOnly
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
                          Mobile:{" "}
                          <span className="!text-[#000]">{add.mobile}</span>
                        </p>
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => handleRemoveAddress(add)}
                            className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md"
                          >
                            Remove
                          </button>
                          <button className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {accountHolder?.address?.length > 0 && (
                <div className="border boder-[#ccc] p-4 rounded-md">
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
            <div className="flex-1 border-l-[1px] pl-10">
              <h4 className="uppercase mb-7">
                price details ({cartItems?.length} Items)
              </h4>
              <div className="space-y-6 pb-6">
                <div className="flex justify-between">
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Total MRP
                  </h5>
                  <h5 className="font-medium text-base text-[#111111]/80 ">
                    Rs {totalPrice || 0}
                  </h5>
                </div>

                <div className="flex justify-between">
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Discount on MRP
                  </h5>
                  <h5 className="font-medium text-base text-[#34BFAD]/80 ">
                    -$3,600
                  </h5>
                </div>

                <div className="flex justify-between">
                  <h5 className="font-medium text-base text-[#111111]/80">
                    Coupon Discount
                  </h5>
                  <h5 className="font-medium text-base text-[#F87171]">
                    Apply Coupon
                  </h5>
                </div>

                <div className="flex justify-between border-b-[1px]">
                  <div>
                    <h5 className="font-medium text-base text-[#111111]/80">
                      Shipping Fee
                    </h5>
                    <p className="text-xs text-[#111111]/50 font-medium pb-2">
                      Free Shipping for you
                    </p>
                  </div>
                  <h5 className="font-medium text-base text-[#34BFAD]/80 uppercase">
                    Free
                  </h5>
                </div>

                <div className="flex justify-between">
                  <h5 className="font-medium text-xl text-[#111111] uppercase">
                    Total Amount
                  </h5>
                  <h5 className="font-medium text-xl text-[#111111] ">
                    $3,196
                  </h5>
                </div>
              </div>

              {isaddressPresent && (
                <button className="uppercase text-xl text-[#ffffff] tracking-wider w-full flex justify-center items-center bg-[#334A78] border border-[#212B36] py-3 rounded-sm font-thin">
                  place ORDER
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      <div className="mt-10">
        <BottomTabs />
      </div>

      {/*  && accountHolder?.address?.length < 3 */}

      {isAddressFormOpen && accountHolder?.address?.length < 3 && (
        <div className="fixed  bg-black/30 inset-0 flex justify-center items-center">
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
