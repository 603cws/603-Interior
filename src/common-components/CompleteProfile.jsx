import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useApp } from "../Context/Context";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import { motion } from "framer-motion";

function CompleteProfile() {
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const { setUserId, setIsAuthenticated, setCurrentLayoutID } = useApp();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Show spinner
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.warn("No user logged in or login failed");
        navigate("/login"); // Redirect to login if login failed or canceled
        return;
      }

      setUser(userData.user);

      // Fetch profile details from Supabase
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("company_name, location, phone")
        .eq("id", userData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setLoading(false);
        return;
      } else {
        setLoading(false);
      }

      // If profile is complete, redirect to /boq
      if (profile?.company_name && profile?.location && profile?.phone) {
        handleCheck(userData.user.id);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("User not found!");

    const { data, error } = await supabase
      .from("profiles") // Ensure this table exists in Supabase
      .upsert({
        id: user.id,
        company_name: companyName,
        location: location,
        phone: mobileNumber,
        role: "user",
      });

    if (error) {
      console.error("Error saving profile:", error.message);
    } else {
      handleCheck(user.id);
    }
    toast.success("User logged in successfully!");
    console.log("User logged in successfully:", data);
  };

  const handleCheck = async (userId) => {
    setUserId(userId);
    setIsAuthenticated(true);

    try {
      // Fetch areaId and quantityId for the logged-in user
      const { data: layoutData, error } = await supabase
        .from("layout")
        .select("id")
        .eq("userId", userId)
        .order("created_at", { ascending: false }) // Order by latest entry
        .limit(1)
        .single();

      if (error) console.error("Error fetching layout:", error);

      const layoutId = layoutData?.id;

      console.log("Fetched layoutId:", layoutId);

      // Navigate based on whether areaId and quantityId exist
      if (layoutId) {
        setCurrentLayoutID(layoutId);
        localStorage.setItem("currentLayoutID", layoutId);
        console.log("Layout ID found, navigating to /boq");
        navigate("/boq");
      } else {
        console.log("No layoutId found, navigating to /Layout");
        navigate("/Layout");
      }
    } catch (fetchError) {
      console.error("Error checking area and quantity IDs:", fetchError);
      navigate("/Layout"); // Default navigation in case of an error
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <Spinner />
      </div>
    ); // Full-screen spinner

  return (
    <div className="relative p-4 md:p-0  bg-gradient-to-br from-[#334A78] to-[#68B2DC] md:bg-none md:bg-[#fff]  bg-center bg-cover bg-no-repeat font-Poppins flex gap-10 h-screen">
      {/* <div className="hidden  md:block fixed inset-0 bg-black bg-opacity-50 lg:hidden" /> */}
      <div className="hidden md:block flex-1">
        {!imageLoaded && (
          <div className="xl:max-w-lg sm:max-w-sm w-full h-[450px] bg-gray-300 rounded-2xl animate-pulse" />
        )}

        {/* Image with fade-in on load */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
          src="images/Register.png"
          alt="Register"
          loading="lazy"
          className={`w-full h-full object-cover ${
            imageLoaded ? "relative" : "invisible"
          }`}
        />
      </div>
      <div className="flex justify-center lg:justify-start items-center flex-1 relative">
        <div className="lg:py-10">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#fff] md:text-[#000] text-center my-5">
            Welcome back. Your workspace is ready.{" "}
          </h2>
          <h3 className="text-base md:text-xl font-semibold text-[#fff] md:text-[#000] text-center mb-5">
            Please enter your details
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-7">
              <div>
                <label
                  htmlFor="company"
                  className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                >
                  Company Name <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                >
                  Location <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Remove everything except letters & spaces
                  }}
                  className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                >
                  Mobile Number <span>*</span>
                </label>

                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                  }}
                  maxLength="10"
                  inputMode="numeric"
                  pattern="\d{10}"
                  className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                  required
                />
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="capitalize xl:w-1/2 bg-[#374A75] hover:bg-[#4b72cc] text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
