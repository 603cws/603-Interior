import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { FaAngleLeft, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [resetPass, setResetPass] = useState(false);

  const { userId, setUserId, setTotalArea } = useApp();

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
  const quantityID = location.state?.quantityId;
  const areaID = location.state?.areaId;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
      const { error: areasUpdateError } = await supabase
        .from("areas")
        .update({ userId })
        .eq("areaId", areaID);

      if (areasUpdateError) {
        throw new Error(
          `Error updating areas table: ${areasUpdateError.message}`
        );
      }

      // Update userId in the 'quantity' table
      const { error: quantityUpdateError } = await supabase
        .from("quantity")
        .update({ userId })
        .eq("quantityId", quantityID);

      if (quantityUpdateError) {
        throw new Error(
          `Error updating areas table: ${quantityUpdateError.message}`
        );
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

    if (data.user.id) {
      const userId = data.user.id;
      setUserId(userId);

      try {
        // Fetch areaId and quantityId for the logged-in user
        const { data: areaData, error: areaError } = await supabase
          .from("areas")
          .select("areaId")
          .eq("userId", userId)
          .order("created_at", { ascending: false }) // Order by latest entry
          .limit(1)
          .single();

        const { data: quantityData, error: quantityError } = await supabase
          .from("quantity")
          .select("quantityId")
          .eq("userId", userId)
          .order("created_at", { ascending: false }) // Order by latest entry
          .limit(1)
          .single();

        if (areaError) console.error("Error fetching areaId:", areaError);
        if (quantityError)
          console.error("Error fetching quantityId:", quantityError);

        const areaId = areaData?.areaId;
        const quantityId = quantityData?.quantityId;

        console.log(
          "Fetched areaId:",
          areaId,
          "Fetched quantityId:",
          quantityId
        );

        // Navigate based on whether areaId and quantityId exist
        if (areaId && quantityId) {
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

  return (
    <>
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
                : "Please enter your details"}
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
                  isForgotPassword ? "Enter your email" : "example@gmail.com"
                }
                className="w-full py-2 rounded-lg pl-2 focus:outline-none"
              />
            </div>

            {isForgotPassword ? (
              <div>
                <button className="capitalize w-full xl:w-3/4 bg-[#1A3A36] text-white font-semibold py-2 rounded-lg mt-3">
                  Reset Password
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
                          e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
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
                      type={isPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="py-2 rounded-lg pl-2 focus:outline-none"
                    />
                    <div
                      onClick={togglePasswordVisibility}
                      className="absolute top-[60%] right-3 cursor-pointer"
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
                )}

                <button
                  onClick={handleSubmit}
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
      {resetPass && (
        <div className="flex justify-center gap-5 h-screen w-full bg-login-custom-gradient">
          <h1>Reset Password</h1>
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
          <label
            htmlFor="confirmPassword"
            className="capitalize text-md font-semibold text-white"
          >
            Confirm Password <span>*</span>
          </label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="py-2 rounded-lg pl-2 focus:outline-none"
          />
        </div>
      )}
    </>
  );
}

export default Login;
