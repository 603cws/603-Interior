import { useEffect, useState } from "react";
import { adminsupabase, supabase } from "../../services/supabase";
import Select from "react-select";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { handleError } from "../../common-components/handleError";

function CreateUser() {
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
  const [isloading, setIsloading] = useState(false);

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
          handleError(error, {
            prodMessage: "Error fetching categories. Please try again.",
          });
          return;
        }

        if (Array.isArray(data)) {
          const formattedCategories = data.map((category) => ({
            value: category.name,
            label: category.name,
          }));

          setCategories(formattedCategories);
        } else {
          handleError(data, {
            prodMessage:
              "Unexpected error fetching categories. Please try again.",
          });
        }
      } catch (err) {
        handleError(err, {
          prodMessage:
            "Unexpected error fetching categories. Please try again.",
        });
      }
    };

    fetchCategories();
  }, []);
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
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    category,
  ) => {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      role: role,
      location: location,
      company_name: company,
      phone: mobile,
      allowed_category: category,
    });

    if (error) {
      handleError(error, {
        prodMessage: "Error updating profile. Please try again.",
      });
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
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setIsloading(true);
      const { data, error } = await adminsupabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        phone: formData.mobile,
      });

      if (error) {
        handleError(error, {
          prodMessage: "Error creating user. Please try again.",
        });
        return;
      }

      if (data.user) {
        const userId = data.user.id;

        await updateUserProfile(
          userId,
          formData.role,
          formData.location,
          formData.company,
          formData.mobile,
          formData.category ? formData.category.map((cat) => cat.label) : [],
        );

        toast.success(`${formData.role} created successfully`);
      }
    } catch (error) {
      handleError(error, {
        prodMessage: "Error signing up. Please try again.",
      });
    }
  };

  return (
    <div className="flex-1 bg-[#FFF] mb-5 cursor-default overflow-auto">
      <div className="h-[calc(100vh-130px)] flex-col flex justify-center items-center">
        <div className=" w-11/12 h-full bg-white p-6 flex flex-col items-center text-center">
          <div className="w-full text-left font-Poppins">
            <h4 className="text-base font-semibold text-[#374A75]">
              Let&apos;s Work Together!
            </h4>
            <img
              src="images/separator.png"
              alt="separator design icon"
              className="w-20 my-4"
            />
            <h2 className="text-3xl font-semibold mb-4">
              Please Fill Your Details
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full lg:grid lg:grid-cols-2 gap-4 text-left text-base"
          >
            <div className="flex flex-col justify-center gap-5">
              <div className="flex flex-col">
                <label className="font-medium">Company Name*</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full lg:max-w-lg"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Role*</label>
                <select
                  name="role"
                  className="border p-2 rounded-md w-full lg:max-w-lg"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Position</option>
                  <option value="admin">Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="font-medium">
                  Category*{" "}
                  <span className="text-[10px] text-[#ccc]">
                    {" "}
                    (For vendors){" "}
                  </span>{" "}
                </label>
                <Select
                  options={categories}
                  isMulti
                  className="basic-multi-select w-full lg:max-w-lg"
                  classNamePrefix="select"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  placeholder="Select Category"
                  menuPortalTarget={document.body}
                  isDisabled={formData.role !== "vendor"}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Email ID*</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email ID"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 rounded-md w-full lg:max-w-lg"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-5 mt-5 lg:mt-0">
              <div className="flex flex-col">
                <label className="font-medium">Mobile Number*</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`border p-2 rounded-md ${
                    formData.role === "vendor"
                      ? "w-full lg:max-w-md"
                      : "w-full lg:max-w-md"
                  }`}
                  required
                  maxLength={10}
                />
              </div>
              <div className="flex flex-col relative w-full lg:max-w-md">
                <label className="font-medium">Password*</label>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border p-2 rounded-md"
                  required
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute top-[60%] right-10 cursor-pointer"
                >
                  {isPasswordVisible ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </div>
              </div>
              <div className="flex flex-col relative w-full lg:max-w-md">
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
                  className="absolute top-[60%] right-10 cursor-pointer"
                >
                  {isConfirmPasswordVisible ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-medium">Location*</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`border p-2 rounded-md ${
                    formData.role === "vendor"
                      ? "w-full lg:max-w-md"
                      : "w-full lg:max-w-md"
                  }`}
                  required
                />
              </div>
            </div>
            <div className="col-span-2 flex justify-start mt-5">
              <button
                type="submit"
                className="bg-[#374A75] text-white px-6 py-2 rounded border border-[#000] font-bold hover:bg-[#6d87c4]"
              >
                {isloading ? "loading.." : "submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;
