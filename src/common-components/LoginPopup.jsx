import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { MdClose } from "react-icons/md";

export default function LoginPopup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-[#000]/30 flex justify-center items-center z-10">
      <div className="max-w-3xl lg:max-w-4xl w-full relative flex justify-center items-center">
        <div className="absolute right-0 md:right-7 lg:right-10 top-0">
          <button className="text-xl md:text-[#fff]">
            <MdClose />
          </button>
        </div>
        <div className="max-w-2xl lg:max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#fff]">
          {/* Left Image Section */}
          <div className="hidden md:block">
            <img
              src="./images/bg/bg.png"
              alt="Office"
              className="w-full h-full object-cover object-bottom"
            />
          </div>

          {/* Right Login Form */}
          <div className="flex flex-col justify-center items-center p-8 relative">
            {/* Top Sign-up */}
            <div className="absolute top-6 right-6 text-sm text-gray-700">
              Don’t have an account?{" "}
              <a href="#" className="underline">
                Sign up
              </a>
            </div>

            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Sign in
              </h2>

              {/* Google Button */}
              <button className="flex items-center justify-center w-full gap-2 border-2 border-gray-300 rounded-full py-2 mb-6 hover:bg-gray-100 text-sm">
                <FcGoogle />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <hr className="flex-grow border-gray-300" />
                <span className="text-gray-400">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Email */}
              <label className="text-sm block mb-1 text-gray-700">
                User name or email address
              </label>
              <input
                type="text"
                className="w-full mb-4 p-2 border border-gray-300 rounded-md"
                placeholder="you@example.com"
              />

              {/* Password */}
              <label className="text-sm block mb-1 text-gray-700">
                Your password
              </label>
              <div className="relative mb-1">
                <input
                  type={showPassword ? "text" : "password"}
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

              {/* Forgot Password */}
              <div className="text-right text-sm mb-4">
                <a href="#" className="text-gray-600 underline">
                  Forget your password
                </a>
              </div>

              {/* Sign In */}
              <button
                className="w-full bg-gray-300 text-white py-2 rounded-full font-semibold cursor-not-allowed"
                disabled
              >
                Sign in
              </button>

              {/* Bottom Sign-up */}
              <p className="text-sm text-center mt-4 text-gray-700">
                Don’t have an account?{" "}
                <a href="#" className="underline">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
