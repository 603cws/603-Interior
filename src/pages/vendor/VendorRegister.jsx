import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import Select from "react-select";

function VendorRegister() {
  const navigate = useNavigate();
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
      alert("All fields are required!");
      return;
    }

    if (formData.role === "vendor" && formData.category.length === 0) {
      alert("Category is required for Vendors!");
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

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
    alert("User signed up successfully:", data);

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
    <div className="bg-[url('images/admin/Admin.png')] bg-cover bg-center bg-no-repeat  p-5 max-h-full">
      <div className="flex gap-3 overflow-hidden bg-white rounded-xl">
        {/* Sidebar */}
        <div className=" max-w-sm sticky left-0 top-0 bottom-0">
          {/* Logo */}
          <div className="cursor-pointer flex justify-center items-center mt-8">
            <img
              src="/logo/workved-interior.png"
              alt="Logo"
              className="h-20 w-32"
            />
          </div>

          {/* Main Menu */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={() => navigate("/")}>Home</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Client</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Vendor</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Products</p>
            </div>
          </div>

          {/* Others Menu */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">others</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Setting</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Helps</p>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Logout</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-3 relative px-2 overflow-x-auto">
          {/* Header */}
          <div className="mt-2 sticky top-3 z-10 h-[50px] rounded-3xl p-[2px] bg-gradient-to-r from-[#B4BEEA] to-[#191B4F]">
            <div className="flex justify-between items-center h-full rounded-3xl bg-[#EBF0FF] px-3">
              <div className="">
                <h3 className="font-extrabold text-xl capitalize">Vendor</h3>
              </div>
              <div>
                <img
                  src="/images/usericon.png"
                  alt="usericon"
                  className="w-8 h-8"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 rounded-xl bg-[#EBF0FF] mb-5 cursor-default overflow-hidden ">
            <div className="h-[calc(100vh-130px)] flex-col flex justify-center items-center">
              <div className=" w-11/12 bg-white p-6 border border-black rounded-xl shadow-md flex flex-col items-center text-center">
                {/* Header Section */}
                <div className="w-full text-left font-Poppins ml-20 mt-5">
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
                      className="border p-2 rounded-md max-w-md"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>

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

                  {/* Category (Only for Vendor) */}
                  {formData.role === "vendor" && (
                    <div className="flex flex-col">
                      <label className="font-medium">Category*</label>
                      <Select
                        options={categories}
                        isMulti
                        className="basic-multi-select max-w-md"
                        classNamePrefix="select"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                      />
                    </div>
                  )}

                  {/* Mobile Number - Fixed Position */}
                  <div className="flex flex-col">
                    <label className="font-medium">Mobile Number*</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`border p-2 rounded-md ${
                        formData.role === "vendor" ? "max-w-lg" : "max-w-md"
                      }`}
                      required
                      maxLength={10}
                    />
                    {/* </div> */}
                  </div>

                  {/* Password - Always on Right Side */}
                  <div className="flex flex-col">
                    <label className="font-medium">Password*</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`border p-2 rounded-md ${
                        formData.role === "vendor" ? "max-w-md" : "max-w-lg"
                      }`}
                      required
                    />
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
                        formData.role === "vendor" ? "max-w-lg" : "max-w-md"
                      }`}
                      required
                    />
                  </div>

                  {/* Confirm Password - Always on Right Side */}
                  <div className="flex flex-col">
                    <label className="font-medium">Confirm Password*</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`border p-2 rounded-md ${
                        formData.role === "vendor" ? "max-w-md" : "max-w-lg"
                      }`}
                      required
                    />
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
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;
