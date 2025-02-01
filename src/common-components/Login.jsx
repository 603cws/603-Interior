import React, { useState } from "react";
import { FaAngleLeft, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
  };
  const showForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
  };
  const backToSignIn = () => {
    setIsForgotPassword(false);
    setIsSignUp(false);
  };

  return (
    <div className="main flex justify-center gap-5 h-screen w-full bg-custom-gradient">
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
        }  gap-10`}
      >
        <div className="w-3/4">
          <h1 className="capitalize text-3xl font-bold text-white text-center">
            {isForgotPassword
              ? "Forgot password"
              : isSignUp
              ? "Create Account"
              : "Welcome back!"}
          </h1>
          <p className="capitalize text-white font-semibold text-center">
            {isForgotPassword
              ? "No worries, we'll send you reset instructions"
              : isSignUp
              ? ""
              : "Please enter your details"}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 pr-2">
          {/* Email Input */}
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
              placeholder="example@gmail.com"
              className="w-full py-2 rounded-lg pl-2 focus:outline-none"
            />
          </div>

          {/* Forgot Password View */}
          {isForgotPassword ? (
            <div>
              <button className="capitalize w-full xl:w-3/4 bg-[#1A3A36] text-white font-semibold py-2 rounded-lg mt-3">
                Reset Password
              </button>
              <p className="text-white capitalize flex items-center justify-center gap-1 w-full xl:w-3/4">
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
              {/* Sign Up Additional Fields */}
              {isSignUp && (
                <>
                  <div className="flex justify-center gap-2 xl:w-3/4">
                    {/* Company Name */}
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
                        placeholder="Your Company Name"
                        className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                      />
                    </div>

                    {/* Location */}
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
                        placeholder="Your Location"
                        className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  {/* Mobile Number */}
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
                      placeholder="Your Mobile Number"
                      className="w-full py-2 rounded-lg pl-2 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Password Input */}
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
                  placeholder="Enter Password"
                  className="py-2 rounded-lg pl-2 focus:outline-none"
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute top-[40%] right-3 cursor-pointer"
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

              {/* Confirm Password (Sign Up Only) */}
              {isSignUp && (
                <div className="xl:w-3/4 flex flex-col gap-3 relative">
                  <label
                    htmlFor="password"
                    className="capitalize text-md font-semibold text-white"
                  >
                    confirm Password <span>*</span>
                  </label>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    className="py-2 rounded-lg pl-2 focus:outline-none"
                  />
                  <div
                    onClick={togglePasswordVisibility}
                    className="absolute top-[40%] right-3 cursor-pointer"
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

              {/* Sign In/Sign Up Button */}
              <button className="capitalize xl:w-3/4 bg-[#1A3A36] text-white font-semibold py-2 rounded-lg">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>

              {/* Switch Between Forms */}
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
  );
}

export default Login;
