import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { FaAngleLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../Context/Context";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useResetBOQ } from "../utils/HelperFunction";
import { useBoqApp } from "../Context/BoqContext";
import ResetPassword from "../common-components/ResetPassword";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetPass, setResetPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogingIn, setIsLogingIn] = useState(false);
  const { setIsAuthenticated } = useApp();
  const { setUserId, setCurrentLayoutID } = useBoqApp();
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
  const layoutId = location.state?.layoutId;

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const recoveryType = hashParams.get("type");
    if (recoveryType === "recovery") {
      setResetPass(true);
    }
  }, []);

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
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      role: role,
      location: location,
      company_name: company,
      phone: mobile,
    });

    if (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const updateUserId = async (userId) => {
    try {
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
    if (
      !formData?.email ||
      !formData?.password ||
      !formData?.mobile ||
      !formData?.location ||
      !formData?.company
    ) {
      toast.error("Fill all the required fields");
      return;
    }
    let { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      phone: formData.mobile,
    });

    if (error) {
      toast.error(error);
      console.error("Error signing up:", error);
      return;
    }
    toast.success("User signed up successfully:");

    const userId = data.user.id;

    await updateUserProfile(
      userId,
      "user",
      formData.location,
      formData.company,
      formData.mobile,
    );
    await SendWelcomeEmail(formData?.email, formData?.company);
    if (layoutId) {
      await updateUserId(userId);
    }
    await handleLogin();
  };

  async function SendWelcomeEmail(email, companyName) {
    await fetch(
      "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/functions/v1/swift-function",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          companyName: companyName,
        }),
      },
    );
  }

  const handleLogin = async () => {
    setIsLogingIn(true);

    if (!formData?.email || !formData?.password) {
      toast.error("please enter the credentials");
      setIsLogingIn(false);
      return;
    }
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast.error(error.message);
      console.error("Error logging in:", error);
      setIsLogingIn(false);
      return;
    }

    if (data.user?.id) {
      const userId = data.user.id;
      if (layoutId) {
        await updateUserId(userId);
      }

      setUserId(userId);
      setIsAuthenticated(true);

      try {
        const { data: layoutData, error } = await supabase
          .from("layout")
          .select("id")
          .eq("userId", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) console.error("Error fetching layout:", error);

        const layoutId = layoutData?.id;

        const { data: userData, userError } = await supabase
          .from("users_profiles")
          .select("role")
          .eq("user_id", userId);

        if (userError) console.error("Error fetching user data:", userError);

        const firstElement = userData[0];

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
        navigate("/Layout", { replace: true });
      } finally {
        setIsLogingIn(false);
      }
    }
    resetBOQ();
    toast.success("User logged in successfully!");
  };

  const ecommerceLogin = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
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
    if (!isSignUp) {
      await ecommerceLogin();
    } else {
      let { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        phone: formData.mobile,
      });

      if (error) {
        toast.error(error);
        console.error("Error signing up:", error);
        return;
      }
      toast.success("User signed up successfully:");
      const userId = data.user.id;
      await updateUserProfile(
        userId,
        "user",
        formData.location,
        formData.company,
        formData.mobile,
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

  const handleForgotPassword = async () => {
    try {
      setIsSubmitting(true);
      if (!formData.email) {
        toast.error("Please enter an email address.");
        return;
      }

      const { data, error: emailCheckError } = await supabase.rpc(
        "check_user_exists",
        {
          user_email: formData.email,
        },
      );

      if (emailCheckError || !data) {
        toast.error("Email does not exist. Please enter a registered email.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        formData.email,
        {
          redirectTo: `${window.location.origin}/Login?type=recovery`,
        },
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

  const signInWithGoogle = async () => {
    resetBOQ();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/complete-profile`,
      },
    });
    if (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  return (
    <>
      {resetPass ? (
        <ResetPassword setResetPass={setResetPass} />
      ) : (
        <>
          <div className="relative main flex justify-center gap-5 h-screen w-full bg-gradient-to-br from-[#334A78] to-[#68B2DC] md:bg-none md:bg-[#fff] overflow-x-hidden font-Poppins">
            <SideImage />

            <form
              onSubmit={handleSubmit}
              className="content z-10 flex-1 max-h-full h-full flex flex-col items-center justify-center gap-2 px-5"
            >
              <Header isSignUp={isSignUp} isForgotPassword={isForgotPassword} />

              {isForgotPassword ? (
                <ForgotPasswordForm
                  formData={formData}
                  handleChange={handleChange}
                  handleForgotPassword={handleForgotPassword}
                  isSubmitting={isSubmitting}
                  backToSignIn={backToSignIn}
                />
              ) : isSignUp ? (
                <SignUpForm
                  formData={formData}
                  handleChange={handleChange}
                  toggleForm={toggleForm}
                  signInWithGoogle={signInWithGoogle}
                  isLogingIn={isLogingIn}
                />
              ) : (
                <SignInForm
                  formData={formData}
                  handleChange={handleChange}
                  showForgotPassword={showForgotPassword}
                  toggleForm={toggleForm}
                  signInWithGoogle={signInWithGoogle}
                  isLogingIn={isLogingIn}
                />
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default Login;

function SideImage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div className="img flex-1 md:block hidden relative">
      {!imageLoaded && (
        <div className=" w-full h-full bg-gray-300 rounded-2xl" />
      )}

      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => setImageLoaded(true)}
        src="images/Register.webp"
        alt="Register"
        loading="lazy"
        className={`w-full h-full object-cover flex-1 ${
          imageLoaded ? "relative" : "invisible"
        }`}
      />
    </div>
  );
}

function Header({ isSignUp, isForgotPassword }) {
  return (
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
  );
}

function EmailField({ formData, handleChange }) {
  return (
    <div className="flex flex-col gap-1 xl:gap-3 w-full xl:w-3/4">
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
        placeholder="example@gmail.com"
        className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
        required
      />
    </div>
  );
}

function CompanyLocationFields({ formData, handleChange }) {
  return (
    <div className="flex justify-center gap-2 w-full xl:w-3/4">
      <div className="flex flex-col gap-1 xl:gap-3 w-1/2">
        <label className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]">
          Company Name <span>*</span>
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Your Company Name"
          className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
          required
        />
      </div>

      <div className="flex flex-col gap-1 xl:gap-3 w-1/2">
        <label className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]">
          Location <span>*</span>
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          onInput={(e) =>
            (e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""))
          }
          placeholder="Your Location"
          className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
          required
        />
      </div>
    </div>
  );
}
function MobileField({ formData, handleChange }) {
  return (
    <div className="w-full xl:w-3/4 flex flex-col gap-1 xl:gap-3">
      <label className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]">
        Mobile Number <span>*</span>
      </label>
      <input
        type="number"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
        maxLength="10"
        inputMode="numeric"
        pattern="\d{10}"
        placeholder="Your Mobile Number"
        className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border  [appearance:textfield]
    [&::-webkit-inner-spin-button]:appearance-none
    [&::-webkit-outer-spin-button]:appearance-none"
        required
      />
    </div>
  );
}

function PasswordField({ label, name, value, onChange }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative flex flex-col gap-1 xl:gap-3 w-full xl:w-3/4">
      <label
        htmlFor="password"
        className="capitalize text-sm md:text-md font-semibold text-[#fff] md:text-[#000]"
      >
        {label} <span>*</span>
      </label>
      <input
        type={isPasswordVisible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={
          name === "password" ? "Enter Password" : "Conform Password"
        }
        className="w-full py-1 pl-1 md:py-2 rounded-lg md:pl-2 focus:outline-none border"
        required
      />
      <span
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 translate-y-1/2"
      >
        {isPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
      </span>
    </div>
  );
}

function SignUpForm({
  formData,
  handleChange,
  toggleForm,
  signInWithGoogle,
  isLogingIn,
}) {
  return (
    <>
      <EmailField formData={formData} handleChange={handleChange} />

      <CompanyLocationFields formData={formData} handleChange={handleChange} />

      <MobileField formData={formData} handleChange={handleChange} />

      <PasswordField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <PasswordField
        label="Confirm Password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      <SubmitButton text="Sign Up" isLogingIn={isLogingIn} />
      <AuthSwitch
        text="Already have an account?"
        actionText="Sign In"
        onClick={toggleForm}
      />
      <OAuthDivider />
      <GoogleButton onClick={signInWithGoogle} />
    </>
  );
}

function SignInForm({
  formData,
  handleChange,
  showForgotPassword,
  toggleForm,
  signInWithGoogle,
  isLogingIn,
}) {
  return (
    <>
      <EmailField formData={formData} handleChange={handleChange} />

      <PasswordField
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <div className="flex justify-end w-full lg:w-3/4">
        <p
          onClick={showForgotPassword}
          className="capitalize text-[#fff] md:text-[#000] underline cursor-pointer "
        >
          Forgot Password?
        </p>
      </div>

      <SubmitButton text="Sign In" isLogingIn={isLogingIn} />

      <AuthSwitch
        text="Don't have an account?"
        actionText="Sign Up"
        onClick={toggleForm}
      />

      <OAuthDivider />
      <GoogleButton onClick={signInWithGoogle} />
    </>
  );
}

function ForgotPasswordForm({
  formData,
  handleChange,
  handleForgotPassword,
  isSubmitting,
  backToSignIn,
}) {
  return (
    <>
      <EmailField formData={formData} handleChange={handleChange} />

      <button
        type="button"
        onClick={handleForgotPassword}
        disabled={isSubmitting}
        className="w-full lg:w-3/4 bg-[#374A75] text-white py-2 rounded-lg mt-3"
      >
        {isSubmitting ? "Sending..." : "Reset Password"}
      </button>

      <button
        type="button"
        onClick={backToSignIn}
        className="flex items-center gap-2 mt-4"
      >
        <FaAngleLeft /> Back to login
      </button>
    </>
  );
}

function SubmitButton({ text, isLogingIn }) {
  return (
    <button
      type="submit"
      className="capitalize w-full xl:w-3/4 bg-[#374A75] text-white font-semibold py-2 rounded-lg my-2"
    >
      {isLogingIn ? "Logging in..." : text}
    </button>
  );
}

function AuthSwitch({ text, actionText, onClick }) {
  return (
    <p className="text-[#fff] md:text-[#000] text-sm md:text-base text-center md:text-left">
      {text}{" "}
      <span
        onClick={onClick}
        className="cursor-pointer underline text-[#fff] md:text-[#374A75]"
      >
        {actionText}
      </span>
    </p>
  );
}

function OAuthDivider() {
  return (
    <div className="flex justify-center gap-3 items-center w-full xl:w-3/4 my-3">
      <hr className="w-1/2 border md:border-[#000]" />
      <span className="text-[#fff] md:text-[#000] px-4">or</span>
      <hr className="w-1/2 border md:border-[#000]" />
    </div>
  );
}

function GoogleButton({ onClick }) {
  return (
    <div
      className="xl:w-3/4 w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-md border border-[#ccc] cursor-pointer"
      onClick={onClick}
    >
      <FcGoogle size={24} />
      <span className="font-medium">Continue with Google</span>
    </div>
  );
}
