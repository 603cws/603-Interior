import { useForm } from "react-hook-form";
import { useApp } from "../../Context/Context";
import { useEffect } from "react";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";

function UserProfileEdit({ setIsEditopen }) {
  const { accountHolder, setAccountHolder } = useApp();
  const { register, handleSubmit, setValue } = useForm(); //reset

  useEffect(() => {
    fetchProfileData();
  }, [accountHolder?.userId, setValue]);

  const fetchProfileData = async () => {
    if (!accountHolder?.userId) return;

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.log("Error fetching auth data:", authError);
      }

      // Fetch profile data from "profiles" table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", accountHolder.userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Set form values with fetched data
      if (profileData) {
        setValue("companyName", profileData.company_name || "");
        setValue("mobileNo", profileData.phone || "");
        setValue("location", profileData.location || "");
      }

      if (authData) {
        setValue("email", authData.user.email || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSubmit = async (formData) => {
    try {
      if (
        formData.companyName === accountHolder?.companyName &&
        formData.mobileNo === accountHolder?.phone &&
        formData.location === accountHolder?.location
      )
        return;
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: formData.companyName,
          phone: formData.mobileNo,
          location: formData.location,
        })
        .eq("id", accountHolder.userId); // Update only the current user’s profile

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");

      //  Update accountHolder state after successful update
      setAccountHolder((prev) => ({
        ...prev,
        companyName: formData.companyName,
        phone: formData.mobileNo,
      }));

      //  Fetch updated profile data after successful update
      fetchProfileData();
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsEditopen((isedit) => !isedit);
    }
  };

  return (
    <div className=" w-full h-full border-2 border-[#374a75] md:border-none font-Poppins  ">
      <div className="h-16 bg-gradient-to-r from-[#374A75] to-[#B4CBEA] "></div>
      <div className="flex flex-col gap-2 px-4 ">
        <div className="flex items-center gap-3 mt-4">
          <div
            className="rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to top left, #5B73AF 0%, rgba(255, 255, 255, 0.5) 48%, #1F335C 100%)",
            }}
          >
            <img
              src={accountHolder?.profileImage}
              alt="profile"
              className="w-16 h-16 p-1"
            />
          </div>
          <div className="">
            <h2 className="  text-[#000] text-lg">
              {accountHolder?.companyName}
            </h2>
            <p className="text-[#000] text-sm  lg:text-base">
              {accountHolder?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 font-Poppins px-4 text-sm md:text-base text-black">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-2">
            <h2 className="mb-2  capitalize">Company name</h2>
            <input
              type="text"
              placeholder="Enter Company Name"
              {...register("companyName", { required: true })}
              className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#000]/40  "
            />
          </div>
          <div className="flex flex-col md:flex-row w-full gap-4 mb-3">
            <div className="flex-1">
              <h2 className="mb-2 capitalize">email</h2>
              <input
                type="email"
                placeholder="Enter Email"
                {...register("email", { required: true })}
                disabled
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-gray-100 placeholder:text-[#000]/40  "
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 capitalize">phone no</h2>
              <input
                type="number"
                placeholder="Enter Phone Number"
                {...register("mobileNo", { required: true })}
                className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#000]/40 "
              />
            </div>
          </div>
          <div className="flex w-full gap-4 mb-2">
            <div className="flex-1">
              <h2 className="mb-2  capitalize">Location</h2>
              <input
                type="text"
                placeholder="Enter Location"
                {...register("location")}
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#000]/40 "
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#374A75]  px-6 py-2 text-[#fff] lg:mt-2 xl:mt-4 capitalize"
          >
            save changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfileEdit;
