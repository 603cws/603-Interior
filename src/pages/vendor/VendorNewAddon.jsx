import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";

import { supabase } from "../../services/supabase";
import { toast } from "react-hot-toast"; //Toaster
import { useApp } from "../../Context/Context";
import {
  useAllCatArray,
  displayOptions,
  specialArray,
} from "../../utils/AllCatArray";

function VendorNewAddon({
  setAddNewProduct,
  setIsAddonRefresh,
  setProductlist,
}) {
  const [file, setFile] = useState(null);
  // const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // let resources = [];
  const [resources, setResources] = useState([]);
  const [subcat, setSubcat] = useState([]);

  const [selectedSubcategories, setSelectedSubcategories] = useState();
  const [subSubCategory, setSubSubCategory] = useState("");

  const [category, setCategory] = useState("");

  const fileInputRef = useRef(null);

  const [dimensions, setDimensions] = useState({
    height: "",
    length: "",
    width: "",
  });

  const [addon, setAddon] = useState({
    title: "",
    price: "",
    image: null,
    dimension: "",
    mrp: "",
    sellingPrice: "",
    quantity: "",
  });
  const [displayOption, setDisplayOption] = useState("");

  const { accountHolder } = useApp();
  const AllCatArray = useAllCatArray();

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;

    const updatedDimensions = {
      ...dimensions,
      [name]: value,
    };

    setDimensions(updatedDimensions);

    // Update variant.dimension
    setAddon((prev) => ({
      ...prev,
      dimension: `${updatedDimensions.height}x${updatedDimensions.length}x${updatedDimensions.width}`,
    }));
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

    // Reset file input value to allow same file selection again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddon((prevAddon) => ({
      ...prevAddon,
      [name]: value,
    }));
  };

  // handle dimention
  // const handledimension = (e) => {
  //   e.preventDefault();
  //   const newWidth = e.target.value;
  //   setDimensionwidth(newWidth);
  //   setAddon((prevVariants) => ({
  //     ...prevVariants,
  //     dimension: `${dimensionHeight}x${dimensionLength}x${newWidth}`, // Update mainImage field
  //   }));
  // };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setAddon((prevVariants) => ({
        ...prevVariants,
        image: file, // Update mainImage field
      }));
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    accountHolder.allowedCategory.map((category) => {
      const filtered = AllCatArray.filter((cat) => cat.name === category);

      const subcattodisplay = filtered.flatMap((subcat) => subcat.subCat1);
      console.log(subcattodisplay);
      // setResources(filtered);
      // setSubcat(subcattodisplay);
    });
  }, []);

  useEffect(() => {
    const filtered = AllCatArray.filter((cat) => cat.name === category);
    const subcattodisplay = filtered.flatMap((subcat) => subcat.subCat1);
    setSubcat(subcattodisplay);
    setResources(filtered);
  }, [category]);

  // console.log(subSubCategory);
  // console.log(resources);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("addon", addon);

    if (!addon.image) {
      toast.error("Add image");
      return;
    }

    try {
      setIsSubmitting(true);
      // Check if the product already exists based on category, subcategory, and subSubCategory
      const { data: existingProduct, error: existingProductError } =
        await supabase
          .from("products")
          .select("id")
          .eq("category", category)
          .eq("subcategory", selectedSubcategories)
          .eq("subcategory1", subSubCategory) // subSubCategory is from the state
          .single();

      if (existingProductError && existingProductError.code !== "PGRST116") {
        console.log("Error checking existing product.");
        return;
      }

      let productId;
      if (existingProduct) {
        // If the product already exists, use the existing product ID
        productId = existingProduct.id;
        console.log(
          "Product already exists. Proceeding with variants and addons."
        );
      } else {
        // Insert a new product if it doesn't exist
        const { data: Product, error: insertError } = await supabase
          .from("products")
          .insert({
            category: category,
            subcategory: selectedSubcategories,
            subcategory1: subSubCategory || null, // Insert subSubCategory (from state)
          })
          .select()
          .single();

        if (insertError) {
          console.error(insertError);
          toast.error("Error inserting new product.");
          return;
        }

        productId = Product.id;
        // toast.success("New product inserted successfully.");
      }

      // Handle the addons
      const { data: addonCategory, error: addonCategoryError } = await supabase
        .from("addons")
        .insert({ title: subSubCategory, productid: productId })
        .select()
        .single();

      if (addonCategoryError) {
        console.error("Error inserting addon category:", addonCategoryError);
        // toast.error("Failed to save addon category.");
        return;
      }

      const addonId = addonCategory.id;
      // toast.success("Addon category saved successfully.");

      const { image, title, price } = addon;

      if (image && title && price) {
        const { data: addonVariantImage, error: addonVariantImageError } =
          await supabase.storage
            .from("addon")
            .upload(`${title}-${addonId}`, image);

        if (addonVariantImageError) {
          console.error(
            "Error uploading addon variant image:",
            addonVariantImageError
          );
          console.log(`Failed to upload image for addon variant: ${title}`);
        }

        const { error: addonVariantError } = await supabase
          .from("addon_variants")
          .insert({
            addonid: addonId,
            title,
            price,
            image: addonVariantImage.path,
            vendorId: accountHolder.userId,
            category: category,
            specifications: subSubCategory,
            dimensions: addon?.dimension,
            productDisplayType: displayOption,
            stockQty: addon.quantity || 0,
            ecommercePrice: {
              mrp: addon.mrp,
              sellingPrice: addon.sellingPrice,
            },
          });

        if (addonVariantError) {
          console.error("Error inserting addon variant:", addonVariantError);
          // toast.error(`Failed to save addon variant: ${title}`);
          return;
        } else {
          toast.success(`Addon variant ${title} added successfully.`);
        }
      }

      // Success message
      // toast.success("Data inserted successfully!");
    } catch (error) {
      console.log("Error in onSubmit:", error);
      // toast.error("An unexpected error occurred.");
    } finally {
      handleFormClear();
      setIsSubmitting(false);
    }
  };

  // get the categories based on the category and type
  useEffect(() => {
    if (category !== "HVAC" && category !== "Civil / Plumbing") {
      const filter = AllCatArray.filter((cat) => cat.name === category).flatMap(
        (subcat) => subcat.subcategories
      );
      // setSelectedSubcategories(filter);
      setSelectedSubcategories(filter.join(","));
    }

    if (category === "Civil / Plumbing") {
      if (subSubCategory === "Pods") {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === subSubCategory)
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
      } else {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === "other")
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
      }
    }

    if (category === "HVAC") {
      if (subSubCategory === "Centralized AC") {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === subSubCategory)
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
      } else {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === "other")
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
      }
    }
  }, [category, subSubCategory]);

  // clear the form
  const handleFormClear = () => {
    setAddon({
      title: "",
      price: "",
      image: null,
      dimension: "",
      mrp: "",
      sellingPrice: "",
      quantity: "",
    });
    setDimensions({
      height: "",
      length: "",
      width: "",
    });
    setCategory("");
    setSubSubCategory("");
    removeFile();
    setDisplayOption("");
  };

  const handlecategorychange = (e) => {
    setCategory(e.target.value);
    setSubSubCategory("");
  };

  return (
    <div className="flex flex-col justify-center items-start font-Poppins relative">
      <div className="px-5 py-2 border-b-2 bg-white w-full border-b-gray-400 sticky top-0 z-10">
        <button
          onClick={() => {
            setAddNewProduct(false);
            setProductlist(true);
            setIsAddonRefresh((prev) => !prev);
          }}
          className="border-none flex justify-center items-center text-[#A1A1A1]"
        >
          <MdKeyboardArrowLeft />
          Back to product list
        </button>
        <h3 className="capitalize font-semibold text-xl ">Add New Add Ons</h3>
      </div>
      {/* <form action=""> */}
      <form
        className="lg:flex gap-5 py-3 px-5 w-full"
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="w-full lg:w-1/2">
          {/* div for category */}
          <div>
            <h3 className="capitalize mb-3 text-xl font-semibold">category</h3>
            <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
              <div>
                <h4 className="text-[#7B7B7B]">Segment</h4>
                <select
                  name="category"
                  id="category"
                  value={category}
                  className="w-full border-2 py-1.5 px-2 rounded-lg"
                  onChange={(e) => handlecategorychange(e)}
                  required
                  // onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>

                  {accountHolder.allowedCategory.map((cat, index) => {
                    return (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <h4 className="text-[#7B7B7B]">product subcategory</h4>
                <select
                  name="category"
                  id="category"
                  className="w-full border-2 py-1.5 px-2 rounded-lg"
                  value={subSubCategory}
                  onChange={(e) => setSubSubCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select subcatgory
                  </option>
                  {subcat.map((cat, index) => {
                    return (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <h4 className="text-[#7B7B7B]">
                  Select where to display the product
                </h4>
                <select
                  name="displayType"
                  id="displayType"
                  className="w-full border-2 py-1.5 px-2 rounded-lg"
                  value={displayOption}
                  onChange={(e) => setDisplayOption(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select display option
                  </option>
                  {displayOptions.map((option, index) => {
                    return (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    );
                  })}
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
                <h4 className="text-[#7B7B7B]">Addon name</h4>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={addon.title}
                  className="w-full py-1.5 px-2 border-2 rounded-lg"
                  required
                />
              </div>
              {(displayOption === "boq" || displayOption === "both") && (
                <div>
                  <h4 className="text-[#7B7B7B]">BOQ price</h4>
                  <input
                    type="number"
                    name="price"
                    onChange={handleChange}
                    value={addon.price}
                    required
                    className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                  />
                </div>
              )}
              <div>
                <h4 className="text-[#7B7B7B]">
                  product dimension:(H x L x W)
                </h4>
                <div className="flex gap-5">
                  <div className="relative">
                    <input
                      type="number"
                      name="height"
                      value={dimensions.height}
                      onChange={handleDimensionChange}
                      className="w-20 xl:w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                      required
                    />
                    <span className="absolute right-2 top-2">H</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="length"
                      value={dimensions.length}
                      onChange={handleDimensionChange}
                      className="w-20 xl:w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                      required
                    />
                    <span className="absolute top-2 right-2">L</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="width"
                      value={dimensions.width}
                      onChange={handleDimensionChange}
                      className="w-20 xl:w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                      required
                    />
                    <span className="absolute top-2 right-2">W</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 ">
          {(displayOption === "ecommerce" || displayOption === "both") && (
            <>
              <h3 className="capitalize text-xl font-semibold">
                E-commerce Details
              </h3>
              <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
                <div>
                  <h4 className="text-[#7B7B7B]">MRP</h4>
                  <input
                    type="number"
                    name="mrp"
                    onChange={handleChange}
                    value={addon.mrp}
                    className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <h4 className="text-[#7B7B7B]">Selling price</h4>
                  <input
                    type="number"
                    name="sellingPrice"
                    onChange={handleChange}
                    value={addon.sellingPrice}
                    className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                    required
                  />
                </div>
                <div>
                  <h4 className="text-[#7B7B7B]">Quantity</h4>
                  <input
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    value={addon.quantity}
                    className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {/* div for images */}
          <div>
            <div className="flex justify-start items-center gap-2 mb-3">
              <h3 className="capitalize text-xl font-semibold">
                product images
              </h3>
              <FaRegQuestionCircle size={20} className="cursor-pointer" />
            </div>
            <div>
              <div className="px-4 py-2 bg-white border rounded-xl shadow-lg my-3 w-full">
                {/* Upload Box */}
                <h4 className="text-[#7B7B7B] capitalize">main </h4>
                <div className="flex items-start gap-4">
                  <div
                    className="w-28 h-28 p-2 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-400"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleMainImageChange}
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
                          type="button"
                          className="text-white text-xs bg-red-600 px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* div for plan selection */}
          {/* <div>
            <h3 className="capitalize mb-3 text-xl font-semibold">
              plan category
            </h3>
            <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
              <h4 className="text-[#7B7B7B]">Segment</h4>
              <select
                name="segment"
                id="segment"
                className="w-full border-2 py-1.5 px-2 rounded-lg"
                onChange={handleChange}
              >
                <option value="">select plan</option>
                <option value="Minimal">Minimal</option>
                <option value="Exclusive">Exclusive</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div> */}
          {/* div for buttons */}
          <div className="w-full flex items-end justify-between mt-5">
            <button
              className="border-2 px-5 py-2 capitalize rounded-lg"
              type="button"
              onClick={handleFormClear}
            >
              Discard
            </button>
            <button
              className="border-2 px-5 py-2 bg-[#374A75] text-white capitalize rounded-lg"
              type="submit"
              // onClick={onsubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "add product"
              )}
            </button>
          </div>
        </div>
      </form>
      {/* </form> */}
    </div>
  );
}

export default VendorNewAddon;
