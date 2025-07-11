import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"; //useHref
import { supabase } from "../../services/supabase"; // Import Supabase client
import checkIfEmailExists from "../utils/checkIfEmailExists";
import ErrorMiniModal from "../../common-components/ErrorMiniModal";
import Select from "react-select";
import toast from "react-hot-toast";
import { countries } from "countries-list";

function RegisterUser() {
  const location = useLocation();
  const areas = location.state?.areaQuantities;
  const areaValues = location.state?.areaValues;
  const totalArea = location.state?.totalArea;

  const [isLogin, setIsLogin] = useState(false);

  const countryOptions = Object.entries(countries).map(([code, details]) => ({
    value: details.phone,
    label: `+${details.phone} ${details.name} (${code})`,
  }));

  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    mobile: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [debouncedEmail, setDebouncedEmail] = useState(formData.email);
  const [debouncedMobile, setDebouncedMobile] = useState(formData.mobile); // Debounced mobile number

  const defaultCountry = countryOptions.find((c) => c.label.includes("India"));
  const [countryCode, setCountryCode] = useState(defaultCountry?.value || "");

  // const options = useMemo(() => countryList().getData(), []);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = useMemo(() => /^(?!([0-9])\1{9})\d{10}$/, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "email" || !errors.email) {
      setErrors({ ...errors, [name]: "" });
    }

    if (!isLogin) {
      if (name === "email") {
        setDebouncedEmail(value);

        if (value && !emailRegex.test(value)) {
          showErrorWithTimeout(
            "email",
            "Invalid email format. Please enter a valid email."
          );
        }
      }
    }

    if (name === "mobile") {
      setDebouncedMobile(value);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      // const timeoutId = setTimeout(() => {
      //   if (formData.password !== formData.confirmPassword) {
      //     showErrorWithTimeout("confirmPassword", "Passwords do not match.");
      //   } else {
      //     showErrorWithTimeout("confirmPassword", ""); // Clear error when passwords match
      //   }
      // }, 500);
    }
  }, [formData.password, formData.confirmPassword]); // Runs whenever password or confirmPassword changes

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (debouncedEmail) {
        const emailExists = await checkIfEmailExists(debouncedEmail);
        if (emailExists) {
          if (!errors.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Email is already registered.",
            }));
          }
        } else {
          if (errors.email) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "",
            }));
          }
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [debouncedEmail, errors.email]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedMobile && !mobileRegex.test(debouncedMobile)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "Invalid mobile number. Must be 10 unique digits.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          mobile: "",
        }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [debouncedMobile, mobileRegex]);

  const handleCountryCodeChange = (value) => {
    setCountryCode(value.value[0]);
  };

  const showErrorWithTimeout = (field, message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: message,
    }));
    setTimeout(() => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }, 3000);
  };

  const navigate = useNavigate();

  const handleRegister = async () => {
    const { email, companyName, mobile, location, password } = formData;

    try {
      // Step 1: Insert data into 'users' table and retrieve the user ID
      const { data: userData, error: userInsertError } = await supabase
        .from("users")
        .insert([
          {
            email,
            companyname: companyName,
            mobile: countryCode + mobile,
            location,
            password,
          },
        ])
        .select();

      if (userInsertError || !userData.length) {
        console.error("Error inserting new user:", userInsertError?.message);
        return;
      }

      const userId = userData[0]["userId"]; // Retrieve the generated userId

      // Step 2: Insert data into 'areas' table with the retrieved user ID
      const { error: areasInsertError } = await supabase.from("areas").insert([
        {
          userId: userId,
          linear: areaValues.linear,
          lType: areaValues.lType,
          md: areaValues.md,
          manager: areaValues.manager,
          small: areaValues.small,
          ups: areaValues.ups,
          bms: areaValues.bms,
          server: areaValues.server,
          reception: areaValues.reception,
          lounge: areaValues.lounge,
          sales: areaValues.sales,
          phoneBooth: areaValues.phoneBooth,
          discussionRoom: areaValues.discussionRoom,
          interviewRoom: areaValues.interviewRoom,
          conferenceRoom: areaValues.conferenceRoom,
          boardRoom: areaValues.boardRoom,
          meetingRoom: areaValues.meetingRoom,
          meetingRoomLarge: areaValues.meetingRoomLarge,
          hrRoom: areaValues.hrRoom,
          financeRoom: areaValues.financeRoom,
          breakoutRoom: areaValues.breakoutRoom,
          executiveWashroom: areaValues.executiveWashroom,
          videoRecordingRoom: areaValues.videoRecordingRoom,
          other: areaValues.other,
          totalArea,
        },
      ]);

      if (areasInsertError) {
        console.error(
          "Error inserting data into areas:",
          areasInsertError.message
        );
        return;
      }

      // Step 3: Insert data into 'quantity' table with the retrieved user ID
      const { error: quantityInsertError } = await supabase
        .from("quantity")
        .insert([
          {
            userId: userId,
            linear: areas.linear,
            lType: areas.lType,
            md: areas.md,
            manager: areas.manager,
            small: areas.small,
            ups: areas.ups,
            bms: areas.bms,
            server: areas.server,
            reception: areas.reception,
            lounge: areas.lounge,
            sales: areas.sales,
            phoneBooth: areas.phoneBooth,
            discussionRoom: areas.discussionRoom,
            interviewRoom: areas.interviewRoom,
            conferenceRoom: areas.conferenceRoom,
            boardRoom: areas.boardRoom,
            meetingRoom: areas.meetingRoom,
            meetingRoomLarge: areas.meetingRoomLarge,
            hrRoom: areas.hrRoom,
            financeRoom: areas.financeRoom,
            breakoutRoom: areas.breakoutRoom,
            executiveWashroom: areas.executiveWashroom,
            videoRecordingRoom: areas.videoRecordingRoom,
            other: areas.other,
          },
        ]);

      if (quantityInsertError) {
        console.error(
          "Error inserting data into quantity:",
          quantityInsertError.message
        );
        return;
      }

      console.log("User, areas, and quantity data inserted successfully!");
      toast.success("You have registered successfully !");

      // navigate('/Contact', { replace: true });
      // window.location.href = 'https://603-boq.vercel.app/';     //Goto BOQ page from here
      navigate("/boq", {
        state: { userID: userId, clearData: true },
      });
    } catch (error) {
      console.error("Unexpected error during registration:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      // if (formData.password !== formData.confirmPassword) {
      //   showErrorWithTimeout("confirmPassword", "Passwords do not match.");
      //   return;
      // }
      handleRegister();
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      companyName: "",
      mobile: "",
      location: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  const handleLogin = async () => {
    try {
      // Check if the email and password match
      const { data, error } = await supabase
        .from("users")
        .select("email, password, userId")
        .eq("email", formData.email)
        .single();

      if (error || !data) {
        showErrorWithTimeout("email", "Email not registered or incorrect.");
        return;
      }

      if (data.password !== formData.password) {
        showErrorWithTimeout("password", "Incorrect password.");
        return;
      }

      console.log("Login successful:", data);
      toast.success("Login successful!");
      // Redirect or perform actions after successful login
      navigate("/boq");
    } catch (error) {
      console.error("Unexpected error during login:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{ backgroundImage: "url('/images/RegisteruserBackground.jpeg')" }}
      className="h-screen w-screen"
    >
      <div className="w-full flex justify-center gap-5 rounded-3xl bg-transparent relative px-10 mx-auto">
        {/* form */}
        <div className="w-1/2 pt-20 pl-36">
          <p className="text-center font-bold text-lg">
            {isLogin ? "User Login" : "Register User"}
          </p>
          <div className="mt-10">
            <form action="" className="" onSubmit={handleSubmit}>
              <div className="mb-3 relative">
                <label className="block text-sm font-medium mb-2 ">
                  Email
                  {/* Email <span className="text-red-500 text-[0.85em] ml-2 whitespace-nowrap absolute left-[280px]">{errors.email}</span> */}
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email (eg- xyz@gmail.com)"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full text-sm py-1.5 border-1 rounded-md pl-2 placeholder:text-xs"
                />
                {errors.email && <ErrorMiniModal text={errors.email} />}
              </div>

              {!isLogin && (
                <div className="mb-3 relative">
                  <label className="block text-sm font-medium mb-2 ">
                    Company Name{" "}
                    <span className="text-red-500 text-[0.85em] ml-2 whitespace-nowrap absolute left-[280px]">
                      {errors.companyName}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full text-sm py-1.5 border-1 rounded-md pl-2 capitalize placeholder:text-xs"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="mb-3 relative">
                  <label className="block text-sm font-medium mb-2 ">
                    Mobile Number
                  </label>
                  <div className="flex justify-start items-center rounded-md bg-white">
                    {/* <Select
                    options={options}
                    value={value}
                    onChange={handleCountryCodeChange}
                    className="w-1/3 text-xs"
                  /> */}
                    <Select
                      options={countryOptions}
                      onChange={handleCountryCodeChange}
                      placeholder="Select a country"
                      className="w-1/3 text-xs"
                      defaultValue={defaultCountry} // Set default to India
                    />

                    {/* <p className="w-1/7 text-xs px-2">+91</p> */}
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Enter Mobile Number"
                      value={formData.mobile}
                      required
                      onChange={handleChange}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      }}
                      maxLength="10"
                      inputMode="numeric"
                      pattern="\d{10}"
                      className="w-2/3 text-sm py-1.5 border-1 rounded-md pl-2 placeholder:text-xs" //w-2/3
                    />
                    {errors.mobile && <ErrorMiniModal text={errors.mobile} />}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="mb-3 relative">
                  <label className="block text-sm font-medium mb-2 ">
                    Location{" "}
                    <span className="text-red-500 text-[0.85em] ml-2 whitespace-nowrap absolute left-[280px]">
                      {errors.location}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^A-Za-z\s]/g,
                        ""
                      ); // Remove everything except letters & spaces
                    }}
                    required
                    className="w-full py-1.5 text-sm border-1 rounded-md pl-2 placeholder:text-xs"
                  />
                </div>
              )}

              <div className="mb-3 relative">
                <label className="block text-sm font-medium mb-2 ">
                  Password{" "}
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full py-1.5 text-sm border-1 rounded-md pl-2 placeholder:text-xs"
                />
              </div>

              {!isLogin && (
                <div className="mb-3 relative">
                  <label className="block text-sm font-medium mb-2 ">
                    Confirm Password{" "}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full py-1.5 text-sm border-1 rounded-md pl-2 placeholder:text-xs"
                  />
                  {errors.confirmPassword && (
                    <ErrorMiniModal text={errors.confirmPassword} />
                  )}
                </div>
              )}

              <div className="bg-green-950 mt-10 w-3/4 mx-auto rounded-lg">
                <button className="w-full text-white py-1.5" type="submit">
                  {isLogin ? "Login" : "Register"}
                </button>
              </div>
            </form>
            <p
              onClick={toggleForm}
              className="toggle-link cursor-pointer justify-self-center py-2"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : "Already have an account? Login"}
            </p>
          </div>
        </div>
        {/* image */}
        <div className="w-1/2 h-10/12 pt-5 pl-2">
          <img
            src="images/Register.png"
            alt="sitting area"
            className="h-10/12 w-3/4 ml-5"
          />
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
