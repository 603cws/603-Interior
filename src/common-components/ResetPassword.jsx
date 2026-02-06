import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { supabase } from "../services/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { handleError } from "./handleError";

function ResetPassword({ setResetPass }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    company: "",
    location: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      handleError(error, {
        prodMessage: "Error resetting password. Please try again.",
      });
    } else {
      toast.success("Password reset successfully! Please log in.");
      setResetPass(false);
      navigate("/Login", { replace: true });
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-5 lg:max-h-screen h-screen w-full">
      <div className="w-full sm:w-1/2 px-5 flex flex-col justify-center items-center gap-5">
        <h1 className="capitalize text-3xl font-bold  text-center ">
          Reset Password
        </h1>
        <div className="w-full  px-5 flex flex-col gap-3 relative">
          <label
            htmlFor="password"
            className="capitalize text-md font-semibold "
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
        <div className="w-full px-5 flex flex-col gap-3 relative">
          <label
            htmlFor="confirmPassword"
            className="capitalize text-md font-semibold "
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
          className="capitalize w-full xl:w-3/4 bg-[#212B36]  font-semibold py-2 rounded-lg mt-3"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
