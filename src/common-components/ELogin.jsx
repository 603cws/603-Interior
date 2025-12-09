import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function ELogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block h-screen">
        <img
          src="./images/bg/bg.png"
          alt="Office"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      <div className="flex flex-col justify-center items-center p-8 relative">
        <div className="absolute top-6 right-6 text-sm text-gray-700">
          Don’t have an account? <button className="underline">Sign up</button>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign in</h2>

          <button className="flex items-center justify-center w-full gap-2 border-2 border-gray-300 rounded-full py-2 mb-6 hover:bg-gray-100 text-sm">
            <FcGoogle />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <label className="text-sm block mb-1 text-gray-700">
            User name or email address
          </label>
          <input
            type="text"
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            placeholder="you@example.com"
          />

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

          <div className="text-right text-sm mb-4">
            <button className="text-gray-600 underline">
              Forget your password
            </button>
          </div>

          <button
            className="w-full bg-gray-300 text-white py-2 rounded-full font-semibold cursor-not-allowed"
            disabled
          >
            Sign in
          </button>

          <p className="text-sm text-center mt-4 text-gray-700">
            Don’t have an account?{" "}
            <button className="underline">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
