import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { FaAngleLeft, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
import { use } from "react";
import toast from "react-hot-toast";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [resetPass, setResetPass] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUserId, setTotalArea } = useApp();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    company: "",
    location: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const location = useLocation();
  const areas = location.state?.areaQuantities;
  const areaValues = location.state?.areaValues;
  const totalArea = location.state?.totalArea;
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

  // const showErrorWithTimeout = (field, message) => {
  //   setErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [field]: message,
  //   }));
  //   setTimeout(() => {
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       [field]: "",
  //     }));
  //   }, 3000);
  // };

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
      const { error: error } = await supabase
        .from("layout")
        .update({ userId })
        .eq("id", layoutId);

      if (error) {
        throw new Error(`Error updating layout table: ${error.message}`);
      }

      // Update userId in the 'quantity' table
      // const { error: quantityUpdateError } = await supabase
      //   .from("quantity")
      //   .update({ userId })
      //   .eq("quantityId", quantityID);

      // if (quantityUpdateError) {
      //   throw new Error(
      //     `Error updating areas table: ${quantityUpdateError.message}`
      //   );
      // }
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
    alert("User signed up successfully:", data);

    const userId = data.user.id;

    await updateUserProfile(
      userId,
      "user",
      formData.location,
      formData.company,
      formData.mobile
    );
    await updateUserId(userId);
    await handleLogin();
  };

  const handleLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(error.message);
      console.error("Error logging in:", error);
      return;
    }

    if (data.user?.id) {
      const userId = data.user.id;
      await updateUserId(userId); // Ensure this function completes before proceeding

      setUserId(userId);

      try {
        // Fetch areaId and quantityId for the logged-in user
        const { data: layoutData, error: error } = await supabase
          .from("layout")
          .select("id")
          .eq("userId", userId)
          .order("created_at", { ascending: false }) // Order by latest entry
          .limit(1)
          .single();

        // const { data: quantityData, error: quantityError } = await supabase
        //   .from("quantity")
        //   .select("quantityId")
        //   .eq("userId", userId)
        //   .order("created_at", { ascending: false }) // Order by latest entry
        //   .limit(1)
        //   .single();

        if (error) console.error("Error fetching layout:", error);
        // if (quantityError)
        //   console.error("Error fetching quantityId:", quantityError);

        const layoutId = layoutData?.id;
        // const quantityId = quantityData?.quantityId;

        console.log(
          "Fetched layoutId:",
          layoutId
          // "Fetched quantityId:",
          // quantityId
        );

        // Navigate based on whether areaId and quantityId exist
        if (layoutId) {
          navigate("/boq");
        } else {
          navigate("/Layout");
        }
      } catch (fetchError) {
        console.error("Error checking area and quantity IDs:", fetchError);
        navigate("/Layout"); // Default navigation in case of an error
      }
    }

    alert("User logged in successfully!");
    console.log("User logged in successfully:", data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      handleRegister();
    } else {
      // if (formData.password !== formData.confirmPassword) {
      //   // showErrorWithTimeout("confirmPassword", "Passwords do not match.");
      //   return;
      // }
      handleLogin();
    }
  };

  const handleForgotPassword = async () => {
    try {
      setIsSubmitting(true);
      if (!formData.email) {
        // alert("Please enter an email address.");
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
        // alert("Email does not exist. Please enter a registered email.");
        toast.error("Email does not exist. Please enter a registered email.");
        return;
      }

      // Proceed with sending reset email
      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: "https://603-interior.vercel.app/Login?type=recovery",
        }
      );

      if (error) {
        console.error("Error sending reset email:", error.message);
        // alert("Error sending reset email. Please try again.");
        toast.error("Error sending reset email. Please try again.");
      } else {
        // alert("Password reset email sent! Check your inbox.");
        toast.success("Password reset email sent! Check your inbox.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  // const handleForgotPassword = async () => {
  //   if (!formData.email) {
  //     alert("Please enter an email address.");
  //     return;
  //   }

  //   // Check if email exists in Supabase Auth
  //   const { data, error: emailCheckError } = await supabase.rpc(
  //     "check_user_exists",
  //     {
  //       user_email: formData.email,
  //     }
  //   );

  //   if (emailCheckError || !data) {
  //     alert("Email does not exist. Please enter a registered email.");
  //     return;
  //   }

  //   // Proceed with sending reset email
  //   const { error } = await supabase.auth.resetPasswordForEmail(
  //     formData.email,
  //     {
  //       redirectTo: "https://603-interior.vercel.app/Login?type=recovery",
  //     }
  //   );

  //   if (error) {
  //     console.error("Error sending reset email:", error.message);
  //     alert("Error sending reset email. Please try again.");
  //   } else {
  //     alert("Password reset email sent! Check your inbox.");
  //   }
  // };

  const handleResetPassword = async () => {
    if (formData.password !== formData.confirmPassword) {
      // alert("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (error) {
      console.error("Error resetting password:", error.message);
      // alert("Error resetting password. Please try again.");
      toast.error("Error resetting password. Please try again.");
    } else {
      alert("Password reset successfully! Please log in.");
      navigate("/login");
    }
  };

  return (
    <>
      {resetPass ? (
        <div className="flex flex-col justify-center items-center gap-5 h-screen w-full bg-login-custom-gradient">
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
                className="py-2 rounded-lg pl-2 focus:outline-none"
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
                className="py-2 rounded-lg pl-2 focus:outline-none"
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
              className="capitalize w-full xl:w-3/4 bg-[#1A3A36] text-white font-semibold py-2 rounded-lg mt-3"
            >
              Reset Password
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="main flex justify-center gap-5 h-screen w-full bg-login-custom-gradient">
            <div className="img w-1/2 p-5 flex justify-end items-center">
              <img
                src="images/Register.png"
                alt=""
                className="max-h-full h-full xl:h-auto w-full xl:w-3/4"
              />
            </div>
            <div
              className={`content w-1/2 max-h-full h-full flex flex-col items-start ${
                isSignUp ? "pt-10" : "pt-40"
              } gap-10`}
            >
              <div className="w-3/4">
                <h1 className="capitalize text-3xl font-bold text-white text-center">
                  {isForgotPassword
                    ? "Forgot password"
                    : isSignUp
                    ? "Create Account"
                    : "Welcome back!"}
                </h1>
                <p className="capitalize text-white font-semibold text-center my-2">
                  {isForgotPassword
                    ? "No worries, we'll send you reset instructions"
                    : isSignUp
                    ? ""
                    : "Please enter your Credentials"}
                </p>
              </div>

              <div className="w-full flex flex-col gap-2 pr-2">
                <div className="flex flex-col gap-3 xl:w-3/4">
                  <label
                    htmlFor="email"
                    className="capitalize text-md font-semibold text-white"
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
                    className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                  />
                </div>

                {isForgotPassword ? (
                  <div>
                    <button
                      onClick={handleForgotPassword}
                      className="capitalize w-full xl:w-3/4 bg-[#1A3A36] text-white font-semibold py-2 rounded-lg mt-3"
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
                    <p className="text-white capitalize flex items-center justify-center gap-1 w-full xl:w-3/4 my-6">
                      <span
                        onClick={backToSignIn}
                        className="cursor-pointer text-black self-center"
                      >
                        <FaAngleLeft size={16} />
                      </span>
                      Back to log in
                    </p>
                  </div>
                ) : (
                  <>
                    {isSignUp && (
                      <>
                        <div className="flex justify-center gap-2 xl:w-3/4">
                          <div className="flex flex-col gap-3 w-1/2">
                            <label
                              htmlFor="company"
                              className="capitalize text-md font-semibold text-white"
                            >
                              Company Name <span>*</span>
                            </label>
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              placeholder="Your Company Name"
                              className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-3 w-1/2">
                            <label
                              htmlFor="location"
                              className="capitalize text-md font-semibold text-white"
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
                              className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="xl:w-3/4 flex flex-col gap-3">
                          <label
                            htmlFor="mobile"
                            className="capitalize text-md font-semibold text-white"
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
                            className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                          />
                        </div>
                      </>
                    )}

                    <div className="xl:w-3/4 flex flex-col gap-3 relative">
                      <label
                        htmlFor="password"
                        className="capitalize text-md font-semibold text-white"
                      >
                        Password <span>*</span>
                      </label>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className="py-2 rounded-lg pl-2 focus:outline-none"
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
                            className="capitalize text-white underline cursor-pointer"
                          >
                            Forgot Password?
                          </p>
                        </div>
                      )}
                    </div>

                    {isSignUp && (
                      <div className="xl:w-3/4 flex flex-col gap-3 relative">
                        <label
                          htmlFor="confirmPassword"
                          className="capitalize text-md font-semibold text-white"
                        >
                          Confirm Password <span>*</span>
                        </label>
                        <input
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm Password"
                          className="py-2 rounded-lg pl-2 focus:outline-none"
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
                              className="capitalize text-white underline cursor-pointer"
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
                      className={`capitalize xl:w-3/4 bg-[#1A3A36] text-white font-semibold py-2 rounded-lg ${
                        isSignUp ? "my-1" : "my-2"
                      }`}
                    >
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </button>

                    <p className="text-white">
                      {isSignUp ? (
                        <>
                          Already have an account?{" "}
                          <span
                            onClick={toggleForm}
                            className="cursor-pointer text-black"
                          >
                            Sign In
                          </span>
                        </>
                      ) : (
                        <>
                          Don't have an account?{" "}
                          <span
                            onClick={toggleForm}
                            className="cursor-pointer text-black"
                          >
                            Sign Up
                          </span>
                        </>
                      )}
                    </p>

                    {/* Social Login */}
                    <div className="flex justify-center gap-3 items-center xl:w-3/4">
                      <hr className="w-2/5" />
                      <span className="text-white">or</span>
                      <hr className="w-2/5" />
                    </div>
                    <div className="xl:w-3/4 flex justify-center gap-5">
                      <FcGoogle size={30} className="cursor-pointer" />
                      <FaFacebook
                        fill="blue"
                        size={30}
                        className="bg-white rounded-full cursor-pointer bg-contain"
                      />
                    </div>
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
