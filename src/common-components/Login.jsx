import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { FaAngleLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
// import { use } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useResetBOQ } from "../utils/HelperFunction";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  // const [isLogin, setIsLogin] = useState(false);
  const [resetPass, setResetPass] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { setUserId, setIsAuthenticated, setCurrentLayoutID } = useApp();

  const navigate = useNavigate();
  const resetBOQ = useResetBOQ();
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    location: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const location = useLocation();

  // const from = location.state?.from;

  // console.log("helloooooo");

  // const areas = location.state?.areaQuantities;
  // const areaValues = location.state?.areaValues;
  // const totalArea = location.state?.totalArea;
  // const quantityID = location.state?.quantityId;
  // const areaID = location.state?.areaId;
  const layoutId = location.state?.layoutId;

  useEffect(() => {
    // Parse the hash parameters from the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const recoveryType = hashParams.get("type");

    if (recoveryType === "recovery") {
      setResetPass(true);
    }
  }, []); // Run only once when component mounts

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    resetForm();
  };

  const showForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    resetForm();
  };

  const backToSignIn = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      email: "",
      company: "",
      location: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateUserProfile = async (userId, role, location, company, mobile) => {
    const { data, error } = await supabase.from("profiles").upsert({
      id: userId, // Use the user ID from Supabase
      role: role,
      location: location,
      company_name: company,
      phone: mobile,
    });

    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      console.log("Profile updated:", data);
    }
  };

  const updateUserId = async (userId) => {
    try {
      // Update userId in the 'areas' table
      const { data, error } = await supabase
        .from("layout")
        .update({ userId })
        .eq("id", layoutId);

      if (data) {
        const currentLayoutID = data.id;
        sessionStorage.setItem("currentLayoutID", currentLayoutID);
      }

      if (error) {
        throw new Error(`Error updating layout table: ${error.message}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      phone: formData.mobile,
    });

    if (error) {
      alert(error);
      console.error("Error signing up:", error);
      return;
    }
    console.log("User signed up successfully:", data);
    toast.success("User signed up successfully:");

    const userId = data.user.id;

    await updateUserProfile(
      userId,
      "user",
      formData.location,
      formData.company,
      formData.mobile
    );
    if (layoutId) {
      await updateUserId(userId);
    }
    await handleLogin();
  };

  const handleLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      // alert(error.message);
      toast.error(error.message);
      console.error("Error logging in:", error);
      return;
    }

    if (data.user?.id) {
      const userId = data.user.id;
      if (layoutId) {
        await updateUserId(userId); // Ensure this function completes before proceeding
      }

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

        const { data: userData, userError } = await supabase
          .from("users_profiles")
          .select("role")
          .eq("user_id", userId);

        if (userError) console.error("Error fetching user data:", userError);

        const firstElement = userData[0];

        // Navigate based on whether areaId and quantityId exist
        if (layoutId && firstElement?.role !== "user") {
          setCurrentLayoutID(layoutId);
          sessionStorage.setItem("currentLayoutID", layoutId);
          navigate("/dashboard", { replace: true });
        } else if (layoutId && firstElement?.role === "user") {
          setCurrentLayoutID(layoutId);
          sessionStorage.setItem("currentLayoutID", layoutId);
          navigate("/boq", { replace: true });
        } else {
          navigate("/Layout", { replace: true });
        }
      } catch (fetchError) {
        console.error("Error checking area and quantity IDs:", fetchError);
        navigate("/Layout", { replace: true }); // Default navigation in case of an error
      }
    }
    // setProgress(0);
    resetBOQ();
    toast.success("User logged in successfully!");
    console.log("User logged in successfully:", data);
  };

  const ecommerceLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      // alert(error.message);
      toast.error(error.message);
      console.error("Error logging in:", error);
      return;
    }

    if (data.user?.id) {
      const userId = data.user.id;

      setUserId(userId);
      setIsAuthenticated(true);

      navigate("/cart");
    }
  };

  const handleEcommerceLogin = async () => {
    console.log("ecommerce login");
    if (!isSignUp) {
      await ecommerceLogin();
    } else {
      let { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        phone: formData.mobile,
      });

      if (error) {
        alert(error);
        console.error("Error signing up:", error);
        return;
      }
      console.log("User signed up successfully:", data);
      toast.success("User signed up successfully:");

      const userId = data.user.id;

      await updateUserProfile(
        userId,
        "user",
        formData.location,
        formData.company,
        formData.mobile
      );
      await ecommerceLogin();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location?.state?.from === "/cart") {
      handleEcommerceLogin();
    } else {
      if (isSignUp) {
        handleRegister();
      } else {
        handleLogin();
      }
    }
    localStorage.removeItem("boqCompleted");
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isSignUp) {
  //     handleRegister();
  //   } else {
  //     handleLogin();
  //   }
  //   localStorage.removeItem("boqCompleted");
  // };

  const handleForgotPassword = async () => {
    try {
      setIsSubmitting(true);
      if (!formData.email) {
        toast.error("Please enter an email address.");
        return;
      }

      // Check if email exists in Supabase Auth
      const { data, error: emailCheckError } = await supabase.rpc(
        "check_user_exists",
        {
          user_email: formData.email,
        }
      );

      if (emailCheckError || !data) {
        toast.error("Email does not exist. Please enter a registered email.");
        return;
      }

      // Proceed with sending reset email
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          // redirectTo: "https://603-interior.vercel.app/Login?type=recovery",
          redirectTo: `${window.location.origin}/Login?type=recovery`,
        }
      );

      if (error) {
        console.error("Error sending reset email:", error.message);

        toast.error("Error sending reset email. Please try again.");
      } else {
        toast.success("Password reset email sent! Check your inbox.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (error) {
      console.error("Error resetting password:", error.message);
      toast.error("Error resetting password. Please try again.");
    } else {
      toast.success("Password reset successfully! Please log in.");
      setResetPass(false);
      navigate("/Login", { replace: true });
    }
  };

  const signInWithGoogle = async () => {
    // const from = location?.state?.from || "/"; // fallback to home if undefined
    // const redirectTo = `${
    //   window.location.origin
    // }/complete-profile?from=${encodeURIComponent(from)}`;

    // const { error } = await supabase.auth.signInWithOAuth({
    //   provider: "google",
    //   options: {
    //     redirectTo,
    //   },
    // });
    resetBOQ();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/complete-profile`, // Redirect to profile completion page
      },
    });

    console.log("Window Location:", window.location.origin);

    if (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  // const signInWithFacebook = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: "facebook",
  //     options: {
  //       redirectTo: `${window.location.origin}/complete-profile`,
  //     },
  //   });

  //   if (error) {
  //     console.error("Facebook Login Error:", error.message);
  //   }
  // };

  return (
    <>
      {resetPass ? (
        <div className="flex flex-col justify-center items-center gap-5 lg:max-h-screen h-screen w-full">
          <div className="w-full sm:w-1/2 px-5 flex flex-col justify-center items-center gap-5">
            <h1 className="capitalize text-3xl font-bold text-white text-center ">
              Reset Password
            </h1>
            <div className="w-full  px-5 flex flex-col gap-3 relative">
              <label
                htmlFor="password"
                className="capitalize text-md font-semibold text-white"
              >
                New Password <span>*</span>
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter New Password"
                className="py-2 rounded-lg pl-2 focus:outline-none border"
              />
              <div
                onClick={togglePasswordVisibility}
                className={`absolute top-[60%] right-10 cursor-pointer`}
              >
                {isPasswordVisible ? (
                  <IoEyeOutline color="gray" size={20} />
                ) : (
                  <IoEyeOffOutline color="gray" size={20} />
                )}
              </div>
            </div>
            <div className="w-full  px-5 flex flex-col gap-3 relative">
              <label
                htmlFor="confirmPassword"
                className="capitalize text-md font-semibold text-white"
              >
                confirm Password <span>*</span>
              </label>
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter New Password"
                className="py-2 rounded-lg pl-2 focus:outline-none border"
              />
              <div
                onClick={toggleConfirmPasswordVisibility}
                className={`absolute top-[60%] right-10 cursor-pointer`}
              >
                {isConfirmPasswordVisible ? (
                  <IoEyeOutline color="gray" size={20} />
                ) : (
                  <IoEyeOffOutline color="gray" size={20} />
                )}
              </div>
            </div>
            <button
              onClick={handleResetPassword}
              className="capitalize w-full xl:w-3/4 bg-[#212B36] text-white font-semibold py-2 rounded-lg mt-3"
            >
              Reset Password
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="relative main flex justify-center gap-5 h-screen w-full bg-gradient-to-br from-[#334A78] to-[#68B2DC] md:bg-none md:bg-[#fff]  overflow-x-hidden">
            {/* <div className="absolute top-0 -right-20 w-52 h-1/2 rounded-full  bg-[#1A2C3A] opacity-60 blur-[60px] mix-blend-soft-light pointer-events-none z-0" />
            <div className="absolute bottom-0 -left-10 w-52 h-1/2 rounded-full bg-[#1A2C3A] opacity-70 blur-[60px] mix-blend-darken pointer-events-none z-0" /> */}
            {/* <div className="hidden  md:block fixed inset-0 bg-black bg-opacity-50 lg:hidden" /> */}
            {/* <div className="img w-1/2 p-5 flex justify-end items-center"> */}
            {/* <div className="img flex-1 p-5 lg:flex justify-end items-center hidden">
              <img
                src="images/Register.png"
                alt=""
                // className="max-h-full h-full xl:h-auto w-full xl:w-3/4"
                className="xl:max-w-lg sm:max-w-sm"
              />
            </div> */}
            <div className="img flex-1 md:block hidden relative">
              {/* Skeleton placeholder */}
              {!imageLoaded && (
                <div className=" w-full h-full bg-gray-300 rounded-2xl" />
                // <div className="xl:max-w-lg sm:max-w-sm w-full h-[450px] bg-gray-300 rounded-2xl" />
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
                // className={`xl:max-w-lg sm:max-w-sm w-full h-auto absolute top-0 left-0 ${
                //   imageLoaded ? "relative" : "invisible"
                // }`}
                className={`w-full h-full object-cover ${
                  imageLoaded ? "relative" : "invisible"
                }`}
              />
            </div>

            <div
              className={`content z-10 flex-1 max-h-full h-full flex flex-col items-center justify-center ${
                isSignUp
                  ? "justify-center lg:justify-normal md:pt-10 md:mx-6 lg:mx-0 mx-2"
                  : ""
              }   xl:gap-10`}
              // className={`content z-10 flex-1 max-h-full h-full flex flex-col items-start ${
              //   isSignUp
              //     ? "justify-center lg:justify-normal md:pt-10 md:mx-6 lg:mx-0 mx-2"
              //     : "pt-40"
              // }   xl:gap-10`}
            >
              <div className="w-full lg:w-3/4">
                <h1 className="capitalize text-2xl md:text-3xl font-bold  text-[#fff] md:text-[#000] text-center">
                  {isForgotPassword
                    ? "Forgot password"
                    : isSignUp
                    ? "Create Account"
                    : "Welcome back!"}
                </h1>
                <p className="capitalize text-[#fff] md:text-[#000] text-sm font-semibold text-center my-2">
                  {isForgotPassword
                    ? "No worries, we'll send you reset instructions"
                    : isSignUp
                    ? ""
                    : "Please enter your Credentials"}
                </p>
              </div>

              <div className="w-full flex flex-col xl:items-center gap-2 px-4 sm:px-0 sm:pr-2">
                {/* <div className="w-full flex flex-col gap-2 pr-2"> */}
                <div className="flex flex-col gap-1 xl:gap-3 xl:w-3/4">
                  <label
                    htmlFor="email"
                    className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                  >
                    Email Id <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={
                      isForgotPassword
                        ? "Enter your email"
                        : "example@gmail.com"
                    }
                    className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                  />
                </div>

                {isForgotPassword ? (
                  <div className="w-full xl:3/4">
                    <button
                      onClick={handleForgotPassword}
                      className="capitalize w-full xl:w-3/4  flex items-center justify-self-center justify-center  bg-[#374A75] text-white font-semibold py-2 rounded-lg mt-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="spinner flex justify-center items-center">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                        "Reset password"
                      )}
                    </button>
                    <button
                      onClick={backToSignIn}
                      className=" text-[#fff] justify-self-center md:text-[#000] capitalize flex items-center justify-center gap-1 w-full xl:w-3/4 my-6"
                    >
                      <span className="cursor-pointer text-[#374A75] font-bold  self-center">
                        <FaAngleLeft size={16} />
                      </span>
                      Back to log in
                    </button>
                  </div>
                ) : (
                  <>
                    {isSignUp && (
                      <>
                        <div className="flex justify-center gap-2 xl:w-3/4">
                          <div className="flex flex-col gap-1 xl:gap-3 w-1/2">
                            <label
                              htmlFor="company"
                              className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                            >
                              Company Name <span>*</span>
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              placeholder="Your Company Name"
                              className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                            />
                          </div>

                          <div className="flex flex-col gap-1 xl:gap-3 w-1/2">
                            <label
                              htmlFor="location"
                              className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                            >
                              Location <span>*</span>
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^A-Za-z\s]/g,
                                  ""
                                ); // Remove everything except letters & spaces
                              }}
                              placeholder="Your Location"
                              className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                            />
                          </div>
                        </div>

                        <div className="xl:w-3/4 flex flex-col gap-1 xl:gap-3">
                          <label
                            htmlFor="mobile"
                            className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                          >
                            Mobile Number <span>*</span>
                          </label>
                          <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                ""
                              ); // Remove non-numeric characters
                            }}
                            maxLength="10"
                            inputMode="numeric"
                            pattern="\d{10}"
                            placeholder="Your Mobile Number"
                            className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                          />
                        </div>
                      </>
                    )}

                    <div className="xl:w-3/4 flex flex-col gap-1 xl:gap-3 relative">
                      <label
                        htmlFor="password"
                        className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                      >
                        Password <span>*</span>
                      </label>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
                      />
                      <div
                        onClick={togglePasswordVisibility}
                        className={`absolute ${
                          isSignUp ? "top-[60%]" : "top-[40%]"
                        } right-3 cursor-pointer`}
                      >
                        {isPasswordVisible ? (
                          <IoEyeOutline color="gray" size={20} />
                        ) : (
                          <IoEyeOffOutline color="gray" size={20} />
                        )}
                      </div>
                      {!isSignUp && (
                        <div className="w-full flex justify-end">
                          <p
                            onClick={showForgotPassword}
                            className="capitalize text-sm md:text-base text-[#fff] md:text-[#000] underline cursor-pointer"
                          >
                            Forgot Password?
                          </p>
                        </div>
                      )}
                    </div>

                    {isSignUp && (
                      <div className="xl:w-3/4 flex flex-col gap-1 xl:gap-3 relative">
                        <label
                          htmlFor="confirmPassword"
                          className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
                        >
                          Confirm Password <span>*</span>
                        </label>
                        <input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm Password"
                          className="md:py-2 py-1 pl-1 rounded-lg md:pl-2 focus:outline-none border"
                        />
                        <div
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute top-[60%] right-3 cursor-pointer"
                        >
                          {isConfirmPasswordVisible ? (
                            <IoEyeOutline color="gray" size={20} />
                          ) : (
                            <IoEyeOffOutline color="gray" size={20} />
                          )}
                        </div>
                        {!isSignUp && (
                          <div className="w-full flex justify-end">
                            <p
                              onClick={showForgotPassword}
                              className="capitalize text-black  md:text-white underline cursor-pointer"
                            >
                              Forgot Password?
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      // onClick={handleSubmit}
                      type="submit"
                      className={`capitalize xl:w-3/4 bg-[#374A75] text-white font-semibold py-2 rounded-lg ${
                        isSignUp ? "my-1" : "my-2"
                      }`}
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </button>

                    <p className="text-[#fff] md:text-[#000] text-sm md:text-base text-center md:text-left">
                      {isSignUp ? (
                        <>
                          Already have an account?{" "}
                          <span
                            onClick={toggleForm}
                            className="cursor-pointer text-[#fff] md:text-[#374A75] underline"
                          >
                            Sign In
                          </span>
                        </>
                      ) : (
                        <>
                          Don't have an account?{" "}
                          <span
                            onClick={toggleForm}
                            className="cursor-pointer underline text-[#fff] md:text-[#374A75]"
                          >
                            Sign Up
                          </span>
                        </>
                      )}
                    </p>

                    {/* <FaFacebook
                            fill="blue"
                            size={30}
                            className="bg-white rounded-full cursor-pointer bg-contain"
                            onClick={signInWithFacebook}
                          /> */}

                    {/* Social Login */}
                    {/* {import.meta.env.MODE === "development" && ( */}
                    {/* <> */}
                    <div className="flex justify-center gap-3 items-center xl:w-3/4">
                      <hr className="w-1/2 border md:border-[#000]" />
                      <span className="text-[#fff] md:text-[#000] px-4 ">
                        or
                      </span>
                      <hr className="w-1/2 border md:border-[#000]" />
                    </div>
                    <div className="xl:w-3/4 flex justify-center gap-5 mt-3">
                      <div
                        className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-md border border-[#ccc] cursor-pointer  transition"
                        onClick={signInWithGoogle}
                      >
                        <FcGoogle size={24} />
                        <span className="font-medium">
                          Continue with Google
                        </span>
                      </div>
                    </div>
                    {/* </> */}
                    {/* )} */}
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Login;
