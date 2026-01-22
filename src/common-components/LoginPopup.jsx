import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdClose } from "react-icons/md";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useApp } from "../Context/Context";
import { useHandleAddToCart } from "../utils/HelperFunction";
import { useBoqApp } from "../Context/BoqContext";

export default function LoginPopup({ onClose, product }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserId } = useBoqApp();
  const { setIsAuthenticated } = useApp();
  const { handleAddtoWishlist } = useHandleAddToCart();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    location: "",
    phone: "",
  });

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setStep(1);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      company: "",
      location: "",
      phone: "",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const signInWithGoogle = async () => {
    let redirectToAddress;

    if (window.location.href.includes("productview")) {
      redirectToAddress = `${window.location.origin}/products`;
    } else {
      redirectToAddress = window.location.href;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectToAddress,
      },
    });

    if (error) {
      toast.error("Google login failed");
      console.error("Google Login Error:", error.message);
    }
  };

  const updateUserProfile = async (userId, role, location, company, phone) => {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      role,
      location,
      company_name: company,
      phone,
    });

    if (error) {
      console.error("Profile update failed:", error.message);
      toast.error("Failed to save profile.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword, company, location, phone } =
      formData;

    if (isSignUp) {
      if (step === 1) {
        if (!email || !password || !confirmPassword) {
          toast.error("Please fill in all fields.");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        try {
          setLoading(true);
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          toast.success("Step 1 complete. Add profile details.");
          setStep(2);
        } catch (err) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      } else if (step === 2) {
        if (!company || !location || !phone) {
          toast.error("Please fill in all profile details.");
          return;
        }

        try {
          setLoading(true);
          const {
            data: { user },
            error: sessionError,
          } = await supabase.auth.getUser();
          if (sessionError || !user) {
            throw new Error("User session not found.");
          }
          await updateUserProfile(user.id, "user", location, company, phone);
          toast.success("Profile completed successfully!");
          setUserId(user.id);
          setIsAuthenticated(true);
          if (product) handleAddtoWishlist(product, 1, true);
          onClose?.();
        } catch (err) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      }
    } else {
      if (!email || !password) {
        toast.error("Please enter email and password.");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Login successful!");
        setUserId(data.user?.id);
        setIsAuthenticated(true);
        if (product) handleAddtoWishlist(product, 1, true);
        onClose?.();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000]/25 flex justify-center items-center z-10 font-TimesNewRoman">
      <div className="max-w-3xl lg:max-w-4xl w-full relative flex justify-center items-center">
        <div className="absolute right-0 md:right-7 lg:right-10 top-0">
          <button className="text-xl md:text-[#fff]" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className="max-w-2xl lg:max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 bg-white">
          <div className="hidden md:block">
            <img
              src="../images/bg/bg.png"
              alt="Office"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center p-8 relative"
          >
            <div className="absolute top-6 right-6 text-sm text-gray-700">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="underline ml-1"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>

            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {isSignUp
                  ? step === 1
                    ? "Create Account"
                    : "Profile Details"
                  : "Sign In"}
              </h2>

              {isSignUp && step === 1 && (
                <>
                  <label className="text-sm block mb-1 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    placeholder="you@example.com"
                  />

                  <label className="text-sm block mb-1 text-gray-700">
                    Password
                  </label>
                  <div className="relative mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md pr-16"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <label className="text-sm block mb-1 text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    placeholder="••••••••"
                  />
                </>
              )}

              {isSignUp && step === 2 && (
                <>
                  <label className="text-sm block mb-1 text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    placeholder="Your Company"
                  />

                  <label className="text-sm block mb-1 text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    placeholder="City, Area"
                  />

                  <label className="text-sm block mb-1 text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    placeholder="1234567890"
                  />
                </>
              )}

              {!isSignUp && (
                <>
                  <label className="text-sm block mb-1 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                    placeholder="you@example.com"
                  />

                  <label className="text-sm block mb-1 text-gray-700">
                    Password
                  </label>
                  <div className="relative mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md pr-16"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </>
              )}

              {!isSignUp && (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center w-full gap-2 border-2 border-gray-300 rounded-full py-2 mb-4 hover:bg-gray-100 text-sm"
                >
                  <FcGoogle />
                  <span>Continue with Google</span>
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading ? "bg-gray-300 cursor-wait" : "bg-[#1A3A36]"
                } text-white py-2 rounded-full font-semibold`}
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                  ? step === 1
                    ? "Next"
                    : "Submit"
                  : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
