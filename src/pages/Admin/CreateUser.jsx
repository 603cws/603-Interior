import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import Select from "react-select";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";

function CreateUser() {
  // const [role, setRole] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    email: "",
    category: [],
    mobile: "",
    countryCode: "+91",
    location: "",
    password: "",
    confirmPassword: "",
  });
  // const [selectedCategories, setSelectedCategories] = useState([]); // Stores selected categories

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("name");

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        if (Array.isArray(data)) {
          // Format data for react-select
          const formattedCategories = data.map((category) => ({
            value: category.name,
            label: category.name,
          }));

          setCategories(formattedCategories);
        } else {
          console.error("Invalid categories data format:", data);
        }
      } catch (err) {
        console.error("Unexpected error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Reset category when switching to Admin
  useEffect(() => {
    if (formData.role !== "vendor") {
      setFormData((prev) => ({
        ...prev,
        category: [],
      }));
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      // Allow only numbers and limit to 10 digits
      if (!/^\d*$/.test(value)) return; // Prevent non-numeric input
      if (value.length > 10) return; // Restrict to 10 digits
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Multi-Select Category Change
  const handleCategoryChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedOptions,
    }));
  };

  const updateUserProfile = async (
    userId,
    role,
    location,
    company,
    mobile,
    category
  ) => {
    const { data, error } = await supabase.from("profiles").upsert({
      id: userId, // Use the user ID from Supabase
      role: role,
      location: location,
      company_name: company,
      phone: mobile,
      allowed_category: category,
    });

    if (error) {
      console.error("Error updating profile:", error.message);
    } else {
      console.log("Profile updated:", data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.company ||
      !formData.role ||
      !formData.email ||
      !formData.mobile ||
      !formData.location ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.role === "vendor" && formData.category.length === 0) {
      toast.error("Category is required for Vendors!");
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
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
    console.log("User signed up successfully:", data);
    toast.success(`${formData.role} created successfully`);

    const userId = data.user.id;

    await updateUserProfile(
      userId,
      formData.role,
      formData.location,
      formData.company,
      formData.mobile,
      formData.category ? formData.category.map((cat) => cat.label) : []
    );
  };
  return (
    // <div className="">
    <div className="flex-1 rounded-xl bg-[#EBF0FF] mb-5 cursor-default overflow-hidden ">
      <div className="h-[calc(100vh-130px)] flex-col flex justify-center items-center">
        <div className=" w-11/12 bg-white p-6 border border-black rounded-xl shadow-md flex flex-col items-center text-center">
          {/* Header Section */}
          <div className="w-full text-left font-Poppins">
            <h4 className="text-xl font-semibold mb-2 text-[#231F5C]">
              Let's Work Together!
            </h4>
            <h2 className="text-3xl font-bold mb-4">
              Please Fill Your Details.
            </h2>
          </div>

          {/* Form Fields */}
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-2 gap-4 text-left text-base ml-20"
          >
            <div className="flex flex-col justify-center gap-2">
              {/* Company Name */}
              <div className="flex flex-col">
                <label className="font-medium">Company Name*</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="border p-2 rounded-md max-w-lg"
                  required
                />
              </div>

              {/* Role */}
              <div className="flex flex-col">
                <label className="font-medium">Role*</label>
                <select
                  name="role"
                  className="border p-2 rounded-md max-w-lg"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Position</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              {/* Category (Only for Vendor) */}
              {formData.role === "vendor" && (
                <div className="flex flex-col">
                  <label className="font-medium">Category*</label>
                  <Select
                    options={categories}
                    isMulti
                    className="basic-multi-select max-w-lg"
                    classNamePrefix="select"
                    value={formData.category}
                    onChange={handleCategoryChange}
                    placeholder="Select Category"
                  />
                </div>
              )}

              {/* Email ID */}
              <div className="flex flex-col">
                <label className="font-medium">Email ID*</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 rounded-md max-w-lg"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              {/* Mobile Number - Fixed Position */}
              <div className="flex flex-col">
                <label className="font-medium">Mobile Number*</label>
                {/* <div className="flex gap-2"> */}
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`border p-2 rounded-md ${
                    formData.role === "vendor" ? "max-w-md" : "max-w-md"
                  }`}
                  required
                  maxLength={10}
                />
                {/* </div> */}
              </div>

              {/* Password - Always on Right Side */}
              <div className="flex flex-col relative max-w-md">
                <label className="font-medium">Password*</label>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`border p-2 rounded-md`}
                  required
                />
                <div
                  onClick={togglePasswordVisibility}
                  className={`absolute top-[60%] right-10 cursor-pointer`}
                >
                  {isPasswordVisible ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </div>
              </div>

              {/* Confirm Password - Always on Right Side */}
              <div className="flex flex-col relative max-w-md">
                <label className="font-medium">Confirm Password*</label>
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`border p-2 rounded-md`}
                  required
                />
                <div
                  onClick={toggleConfirmPasswordVisibility}
                  className={`absolute top-[60%] right-10 cursor-pointer`}
                >
                  {isConfirmPasswordVisible ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </div>
              </div>

              {/* Location - Fixed Position */}
              <div className="flex flex-col">
                <label className="font-medium">Location*</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`border p-2 rounded-md ${
                    formData.role === "vendor" ? "max-w-md" : "max-w-md"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}

            <div className="col-span-2 flex justify-center mt-5">
              <button
                type="submit"
                className="bg-[#231F5C] text-white px-6 py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
