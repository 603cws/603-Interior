import { useForm } from "react-hook-form";
import { useApp } from "../../Context/Context";
import { useEffect, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";

const profileImages = ["/images/businessman.png", "/images/woman.png"];
function UserSetting() {
  const { accountHolder, setAccountHolder } = useApp();
  const { register, handleSubmit, setValue } = useForm(); //reset
  const [profileImage, setProfileImage] = useState(accountHolder.profileImage);
  const [profileImagesOption, setProfileImagesOption] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [accountHolder?.userId, setValue]);

  const fetchProfileData = async () => {
    if (!accountHolder?.userId) return;

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("Error fetching auth data:", authError);
      }
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", accountHolder.userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }
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

  const updateProfileImage = async (imgUrl) => {
    const { error } = await supabase
      .from("profiles")
      .update({ profile_image: imgUrl })
      .eq("id", accountHolder.userId);

    if (error) {
      console.error("Error updating profile image:", error);
    } else {
      setProfileImage(imgUrl);
      setAccountHolder((prev) => ({ ...prev, profile_image: imgUrl }));
    }
    setProfileImagesOption(false);
  };

  const onSubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: formData.companyName,
          phone: formData.mobileNo,
          location: formData.location,
        })
        .eq("id", accountHolder.userId);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      setAccountHolder((prev) => ({
        ...prev,
        companyName: formData.companyName,
        phone: formData.mobileNo,
      }));
      fetchProfileData();
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="flex gap-5 w-full h-full px-8 py-4">
      <div className="flex flex-col items-center px-10 pt-4 gap-2 relative">
        <div className="w-28 h-28 relative">
          <img
            src={profileImage}
            alt="profile"
            className="w-28 h-28 bg-red-200 rounded-full border-4 border-[#26B893] object-cover"
          />
          <div
            className="absolute bottom-1 right-1.5 cursor-pointer bg-[#26B893] rounded-full p-1.5"
            onClick={() => {
              setProfileImagesOption(!profileImagesOption);
            }}
          >
            <BsCameraFill size={15} color="white" />
          </div>
        </div>
        <h2 className="text-center text-[#194F48] font-bold text-xl capitalize">
          {accountHolder.companyName}
        </h2>
        {profileImagesOption && (
          <div className="absolute top-32 left-0 bg-white shadow-lg p-4 rounded-lg w-52">
            <p className="text-sm font-semibold mb-2">Select a Profile Image</p>
            <div className="grid grid-cols-3 gap-2">
              {profileImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Profile ${index}`}
                  className="w-14 h-14 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-500"
                  onClick={() => updateProfileImage(img)}
                />
              ))}
            </div>
            <button
              className="mt-3 w-full bg-red-400 text-white py-1 rounded"
              onClick={() => setProfileImagesOption(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 font-Poppins">
        <h2 className="capitalize font-bold text-[#CACED8] text-lg">
          edit profile
        </h2>

        <p className="text-base text-[#CACED8] font-bold my-4 capitalize">
          Personal
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-2">
            <h2 className="mb-2 text-[#194F48] font-bold capitalize">
              Company name
            </h2>
            <input
              type="text"
              placeholder="Enter Company Name"
              {...register("companyName", { required: true })}
              className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
            />
          </div>

          <p className="text-base text-[#CACED8] font-bold my-3 capitalize">
            contact
          </p>
          <div className="flex w-full gap-4 mb-3">
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                email
              </h2>
              <input
                type="email"
                placeholder="Enter Email"
                {...register("email", { required: true })}
                disabled
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-gray-100 placeholder:text-[#194F48]  "
              />
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                phone no
              </h2>
              <input
                type="number"
                placeholder="Enter Phone Number"
                {...register("mobileNo", { required: true })}
                className="w-full rounded-lg p-1.5  focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
          </div>
          <div className="flex w-full gap-4 mb-2">
            <div className="flex-1">
              <h2 className="mb-2 text-[#194F48] font-bold capitalize">
                Location
              </h2>
              <input
                type="text"
                placeholder="Enter Location"
                {...register("location")}
                className="w-full rounded-lg p-1.5 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-2 border-[#CACED8] bg-[#fff] placeholder:text-[#194F48]  "
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#26B893] rounded-lg px-6 py-2 text-[#fff] lg:mt-2 xl:mt-4 capitalize"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserSetting;
