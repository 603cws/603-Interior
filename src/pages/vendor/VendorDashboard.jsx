import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useState } from "react";
import { MdCancel, MdKeyboardArrowLeft, MdOutlineCancel } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { FaRegQuestionCircle } from "react-icons/fa";
function VendorDashboard() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(true);
  const [iseditopen, setIsEditopen] = useState(true);
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isAddonHovered, setIsAddonHovered] = useState(false);
  const [addNewProduct, setAddNewProduct] = useState(false);
  const [addNewAddon, setAddNewAddon] = useState(false);
  const [file, setFile] = useState(null);
  // const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);

  const navigate = useNavigate();
  const {
    setIsAuthenticated,
    accountHolder,
    setAccountHolder,
    setTotalArea,
    isAuthLoading,
    setIsAuthLoading,
  } = useApp();

  const handlesetting = () => {
    setIsProductOpen(false);
    setIsSettingOpen(true);
  };
  const handleproduct = () => {
    setIsSettingOpen(false);
    setIsProductOpen(true);
  };

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Error signing out:", error.message);
      } else {
        toast.success("User signed out successfully");
        setAccountHolder({
          companyName: "",
          email: "",
          phone: "",
          role: "",
          userId: "",
        });
        console.log("hello");
        setTotalArea("");
        localStorage.removeItem("currentLayoutID");
        navigate("/");
        setIsAuthenticated(false);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleAdditionalImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length && additionalImages.length + files.length <= 5) {
      setAdditionalImages((prev) => [
        ...prev,
        ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
      ]);
    } else {
      alert("You can upload up to 5 additional images only.");
    }
  };

  const handleAdditionalDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);

    if (
      droppedFiles.length &&
      additionalImages.length + droppedFiles.length <= 5
    ) {
      setAdditionalImages((prev) => [
        ...prev,
        ...droppedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    } else {
      alert("You can upload up to 5 additional images only.");
    }
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="">
      <div className="flex gap-3 max-h-screen overflow-y-hidden">
        {/* sidebar */}
        {/* <div className="h-screen max-w-sm bg-red-600"> */}
        <div className="h-screen max-w-sm  sticky left-0 top-0 bottom-0">
          {/* logo */}
          <div className="cursor-pointer flex justify-center items-center">
            <img src="/logo/logo.png" alt="Logo" className="h-20 w-32" />
          </div>

          {/* main */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">main</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={() => navigate("/")}>Home</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>vendor dashboard</p>
            </div>
            <div
              className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer ${
                isProductOpen ? "bg-[#b4eaea]" : ""
              }`}
            >
              <RiDashboardFill />
              <button onClick={handleproduct}>product</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>dashboard</p>
            </div>
          </div>
          {/* others */}
          <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626]  flex flex-col gap-4 px-7">
            <h3 className="capitalize text-[#A1A1A1] mx-4">others</h3>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <p>Help</p>
            </div>
            <div
              className={`flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer ${
                isSettingOpen ? "bg-[#b4eaea]" : ""
              }`}
            >
              <RiDashboardFill />
              <button onClick={handlesetting}>setting</button>
            </div>
            <div className="flex items-center mx-4 gap-3 hover:bg-[#B4EAEA] cursor-pointer">
              <RiDashboardFill />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3 relative h-full px-2">
          {/* header for dashboard */}
          <div className="flex justify-between items-center border-2 rounded-3xl mt-2 sticky top-3 z-10 bg-white h-[50px]">
            <div className="mx-3">
              <h3 className="font-bold text-lg capitalize ">companyName</h3>
            </div>
            <div className="mx-3">
              <img src="/images/usericon.png" alt="usericon" />
            </div>
          </div>

          {/* div for content */}
          <div className="flex-1  border-2 border-gray-400 rounded-3xl">
            {/* for dashboard */}
            {isProductOpen && (
              <div className="overflow-y-auto scrollbar-hide h-[calc(100vh-100px)] rounded-3xl relative">
                {addNewProduct ? (
                  // Show only Add New Product section
                  <div className="flex flex-col justify-center items-start font-Poppins relative">
                    <div className="px-5 py-2 border-b-2 bg-white w-full border-b-gray-400 sticky top-0">
                      <button
                        onClick={() => {
                          setAddNewProduct(false);
                        }}
                        className="border-none flex justify-center items-center text-[#A1A1A1]"
                      >
                        <MdKeyboardArrowLeft />
                        Back to product list
                      </button>
                      <h3 className="capitalize font-semibold text-xl ">
                        add new products
                      </h3>
                    </div>
                    <div className="flex gap-5 py-3 px-5 w-full">
                      <div className="w-1/2">
                        {/* div for category */}
                        <div>
                          <h3 className="capitalize mb-3 text-xl font-semibold">
                            category
                          </h3>
                          <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
                            <div>
                              <h4 className="text-[#7B7B7B]">
                                product category
                              </h4>
                              <select
                                name="category"
                                id="category"
                                className="w-full border-2 py-1.5 px-2 rounded-lg"
                              >
                                <option value="" disabled>
                                  Select Category
                                </option>
                                <option value="Furniture">Furniture</option>
                                <option value="HVAC">HVAC</option>
                                <option value="Paint">Paint</option>
                              </select>
                            </div>
                            <div>
                              <h4 className="text-[#7B7B7B]">
                                product subcategory
                              </h4>
                              <select
                                name="subcategory"
                                id="subcategory"
                                className="w-full border-2 py-1.5 px-2 rounded-lg"
                              >
                                <option value="" disabled>
                                  Select Sub-Category
                                </option>
                                <option value="Furniture">Table</option>
                                <option value="HVAC">Chair</option>
                                <option value="Paint">Storage</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* div for description */}
                        <div>
                          <h3 className="capitalize mb-3 text-xl font-semibold">
                            Description
                          </h3>
                          <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
                            <div>
                              <h4 className="text-[#7B7B7B]">product name</h4>
                              <input
                                type="text"
                                name="productName"
                                className="w-full py-1.5 px-2 border-2 rounded-lg"
                              />
                            </div>
                            <div>
                              <h4 className="text-[#7B7B7B]">
                                product details
                              </h4>
                              <textarea
                                type="textarea"
                                name="productDetails"
                                className="w-full py-1.5 px-2 border-2 rounded-lg"
                              />
                            </div>
                            <div>
                              <h4 className="text-[#7B7B7B]">product price</h4>
                              <input
                                type="number"
                                name="productPrice"
                                className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                              />
                            </div>
                            <div>
                              <h4 className="text-[#7B7B7B]">
                                product dimension:(H x L x W)
                              </h4>
                              <div className="flex gap-5">
                                <div className="relative">
                                  <input
                                    type="number"
                                    name="height"
                                    className="w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                                  />
                                  <span className="absolute right-2 top-2">
                                    H
                                  </span>
                                </div>
                                <div className="relative">
                                  <input
                                    type="number"
                                    name="length"
                                    className="w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                                  />
                                  <span className="absolute top-2 right-2">
                                    L
                                  </span>
                                </div>
                                <div className="relative">
                                  <input
                                    type="number"
                                    name="width"
                                    className="w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                                  />
                                  <span className="absolute top-2 right-2">
                                    W
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2 ">
                        {/* div for images */}
                        <div>
                          <div className="flex justify-start items-center gap-2 mb-3">
                            <h3 className="capitalize text-xl font-semibold">
                              product images
                            </h3>
                            <FaRegQuestionCircle
                              size={20}
                              className="cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="px-4 py-2 bg-white border rounded-xl shadow-lg my-3 w-full">
                              {/* Upload Box */}
                              <h4 className="text-[#7B7B7B] capitalize">
                                main{" "}
                              </h4>
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-28 h-28 p-2 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-400"
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={handleDrop}
                                >
                                  <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                  />
                                  <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center"
                                  >
                                    <BsUpload className="w-6 h-6 mb-1 text-gray-500" />
                                    <span className="text-xs">
                                      <span className="text-blue-500 cursor-pointer underline">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop
                                    </span>
                                  </label>
                                </div>
                                {/* Image Preview */}
                                {preview && (
                                  <div className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                                    <img
                                      src={preview}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <label
                                        htmlFor="file-upload"
                                        className="text-white text-xs bg-gray-700 px-2 py-1 rounded cursor-pointer mb-1"
                                      >
                                        Replace
                                      </label>
                                      <button
                                        onClick={removeFile}
                                        className="text-white text-xs bg-red-600 px-2 py-1 rounded"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="px-4 py-2 bg-white border rounded-xl shadow-lg my-3 w-full">
                              <h4 className="text-[#7B7B7B] capitalize">
                                additional{" "}
                              </h4>
                              <div className="flex flex-wrap gap-4">
                                <div
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={handleAdditionalDrop}
                                  className="w-28 h-28 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-400 p-2"
                                >
                                  <input
                                    type="file"
                                    id="additional-file-upload"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAdditionalImagesChange}
                                  />
                                  <label
                                    htmlFor="additional-file-upload"
                                    className="flex flex-col items-center"
                                  >
                                    <BsUpload className="w-6 h-6 mb-1 text-gray-500" />
                                    <span className="text-xs">
                                      <span className="text-blue-500 cursor-pointer underline">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop
                                    </span>
                                  </label>
                                </div>

                                {additionalImages.map((img, index) => (
                                  <div
                                    key={index}
                                    className="relative w-24 h-24 border rounded-lg overflow-hidden group"
                                  >
                                    <img
                                      src={img.preview}
                                      alt={`Additional Preview ${index}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() =>
                                          removeAdditionalImage(index)
                                        }
                                        className="text-white text-xs bg-red-600 px-2 py-1 rounded"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* div for plan selection */}
                        <div>
                          <h3 className="capitalize mb-3 text-xl font-semibold">
                            plan category
                          </h3>
                          <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
                            <h4 className="text-[#7B7B7B]">Segment</h4>
                            <select
                              name="segment"
                              id="segment"
                              className="w-full border-2 py-1.5 px-2 rounded-lg"
                            >
                              <option value="" disabled>
                                select plan
                              </option>
                              <option value="Minimal">Minimal</option>
                              <option value="Exclusive">Exclusive</option>
                              <option value="Luxury">Luxury</option>
                            </select>
                          </div>
                        </div>
                        {/* div for buttons */}
                        <div className="w-full flex items-end justify-between mt-5">
                          <button className="border-2 px-5 py-2 capitalize rounded-lg">
                            Discard
                          </button>
                          <button className="border-2 px-5 py-2 bg-[#194F48] text-white capitalize rounded-lg">
                            add product
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : addNewAddon ? (
                  // Show only Add New Addon section
                  <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                    <h2>New Addon Section</h2>
                  </div>
                ) : (
                  // Default product list and add product UI
                  <>
                    <div className="flex justify-between items-center px-4 py-2 border-b-2 border-b-gray-400 sticky top-0">
                      <h3 className="capitalize font-semibold text-xl ">
                        product list
                      </h3>
                      <button
                        onClick={() => setIsAddProduct(true)}
                        className="capitalize shadow-sm py-2 px-4 text-sm flex justify-center items-center border-2"
                      >
                        <IoIosAdd size={20} />
                        add product
                      </button>
                    </div>

                    {isAddProduct ? (
                      <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                        <div className="border-2 border-gray-200 px-28 py-14 flex justify-center items-center gap-10 rounded-2xl shadow-lg capitalize relative">
                          {/* Product Card */}
                          <div
                            onClick={() => {
                              setAddNewProduct(true);
                              setIsAddProduct(false);
                            }}
                            onMouseEnter={() => setIsProductHovered(true)}
                            onMouseLeave={() => setIsProductHovered(false)}
                            className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,50)] font-bold rounded-xl cursor-pointer hover:bg-[#194F48] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
                          >
                            <img
                              src={
                                isProductHovered
                                  ? "images/product-icon-2.png"
                                  : "images/product-icon-1.png"
                              }
                              alt=""
                            />
                            <h2 className="text-lg">product</h2>
                          </div>

                          {/* Addon Card */}
                          <div
                            onClick={() => {
                              setAddNewAddon(true);
                              setIsAddProduct(false);
                            }}
                            onMouseEnter={() => setIsAddonHovered(true)}
                            onMouseLeave={() => setIsAddonHovered(false)}
                            className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,100)] font-bold rounded-xl cursor-pointer hover:bg-[#194F48] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
                          >
                            <img
                              src={
                                isAddonHovered
                                  ? "images/addOn-icon-2.png"
                                  : "images/addOn-icon-1.png"
                              }
                              alt=""
                            />
                            <h2 className="text-lg">add ons</h2>
                          </div>

                          <div className="absolute top-2 right-2">
                            <MdOutlineCancel
                              onClick={() => setIsAddProduct(false)}
                              size={25}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // No Data Found UI
                      <div className="flex flex-col justify-center items-center h-[90%] font-Poppins">
                        <div className="border-2 border-gray-200 px-28 py-14 flex flex-col justify-center items-center gap-6 rounded-2xl shadow-lg">
                          <IoIosAdd
                            size={80}
                            color="gray"
                            className="cursor-pointer"
                          />
                          <h4 className="font-bold text-lg">No data found</h4>
                          <h6 className="text-[#B1B1B1]">
                            Add category list to add your product menu.
                          </h6>
                          <button
                            onClick={() => setIsAddProduct(true)}
                            className="flex justify-center items-center px-7 py-2.5 bg-[#194F48] rounded-xl capitalize text-white font-semibold"
                          >
                            <IoIosAdd /> add product
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* setting */}
            {isSettingOpen && (
              <div className="overflow-y-hidden scrollbar-hide h-[calc(100vh-100px)] py-2 relative">
                <div className="flex flex-col justify-between  pt-2 sticky top-0">
                  <h3 className="capitalize font-semibold px-4 text-xl border-b-2 border-b-[#ccc]">
                    setting
                  </h3>
                  <div className="border-b-2 border-b-[#ccc] py-2 px-4">
                    <button className="capitalize font-medium text-base px-10 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA]">
                      Profile
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center h-[90%] font-Poppins ">
                  {iseditopen ? (
                    <div className="flex justify-center items-center w-full  h-full">
                      {/*  */}
                      <div className="sm:w-[400px] lg:w-[500px] shadow-2xl   rounded-3xl">
                        <div className="flex justify-end items-center px-10 lg:px-16  lg:pb-3 pt-2 w-full ">
                          <button className="capitalize font-medium text-base px-5 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA] ">
                            edit
                          </button>
                        </div>
                        <div className="px-10 lg:mp-16  pb-4 lg:pb-8 pt-2 p-5 w-full ">
                          <div className="flex justify-center  items-center">
                            <img
                              src="/images/Profile.png"
                              alt="profile"
                              className="w-28 h-28"
                            />
                          </div>
                          <h2 className="text-center text-[#194F48] font-bold text-xl">
                            user name
                          </h2>
                          <div className="flex items-center justify-start gap-4 w-full my-2">
                            <h3 className="text-[#CACED8]  capitalize w-1/2 ">
                              email
                            </h3>
                            <p className="text-[#194F48] w-1/2">
                              yunayong@gmail.com
                            </p>
                          </div>
                          <div className="flex   items-center gap-4 text-nowrap my-2">
                            <h3 className="text-[#CACED8] text-lg capitalize flex-1">
                              Phone Number
                            </h3>
                            <p className="text-[#194F48] flex-1">1234567890</p>
                          </div>
                          <div className="flex justify-center  gap-4 text-nowrap my-2">
                            <h3 className="text-[#CACED8] text-lg capitalize flex-1">
                              Company Name
                            </h3>
                            <p className="text-[#194F48] flex-1">xyz company</p>
                          </div>
                          {/* <div className="grid grid-col2 gap-4 px-4 my-2">
                          <h3 className="text-[#CACED8] text-lg capitalize">
                            Company Name
                          </h3>
                          <p className="text-[#194F48]">xyz company</p>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full">
                      {/*  */}
                      <div className=" lg:w-[500px] shadow-2xl   rounded-3xl">
                        <div className="flex justify-end items-center px-10 lg:px-16  lg:pb-3 pt-2 w-full ">
                          <button className="capitalize font-medium text-base px-5 py-2 rounded-2xl border-[#000] border bg-[#B4EAEA] ">
                            edit
                          </button>
                        </div>
                        <div className="px-10 lg:mp-16  pb-4 lg:pb-8 pt-2 p-5 w-full ">
                          <div className="flex justify-center  items-center">
                            <img
                              src="/images/Profile.png"
                              alt="profile"
                              className="w-28 h-28"
                            />
                          </div>
                          <h2 className="text-center text-[#194F48] font-bold text-xl">
                            user name
                          </h2>
                          <div className="flex items-center justify-start gap-4 w-full my-2">
                            <h3 className="text-[#CACED8] text-lg capitalize w-1/2 ">
                              email
                            </h3>
                            <p className="text-[#194F48] w-1/2">
                              yunayong@gmail.com
                            </p>
                          </div>
                          <div className="flex   items-center gap-4 text-nowrap my-2">
                            <h3 className="text-[#CACED8] text-lg capitalize flex-1">
                              Phone Number
                            </h3>
                            <p className="text-[#194F48] flex-1">1234567890</p>
                          </div>
                          <div className="flex justify-center  gap-4 text-nowrap my-2">
                            <h3 className="text-[#CACED8] text-lg capitalize flex-1">
                              Company Name
                            </h3>
                            <p className="text-[#194F48] flex-1">xyz company</p>
                          </div>
                          {/* <div className="grid grid-col2 gap-4 px-4 my-2">
                          <h3 className="text-[#CACED8] text-lg capitalize">
                            Company Name
                          </h3>
                          <p className="text-[#194F48]">xyz company</p>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;
