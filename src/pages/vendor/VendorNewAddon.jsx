import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";

import { supabase } from "../../services/supabase";
import { toast, Toaster } from "react-hot-toast";
import { useApp } from "../../Context/Context";
import { AllCatArray, specialArray } from "../../utils/AllCatArray";

function VendorNewAddon({ setAddNewProduct, setProductlist }) {
  const [file, setFile] = useState(null);
  // const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);

  // let resources = [];
  const [resources, setResources] = useState([]);
  const [subcat, setSubcat] = useState([]);

  const [selectedSubcategories, setSelectedSubcategories] = useState();
  const [subSubCategory, setSubSubCategory] = useState("");

  const [category, setCategory] = useState("");

  //dimension
  //   const [dimensionHeight, setDimensionHeight] = useState();
  //   const [dimensionwidth, setDimensionwidth] = useState();
  //   const [dimensionLength, setDimensionLength] = useState();

  // const [selectedSubcategories, setSelectedSubcategories] = useState();
  // const [variant, setVariant] = useState({
  //   title: "",
  //   price: 0,
  //   details: "",
  //   mainImage: null,
  //   additionalImages: [],
  //   segment: "",
  //   dimension: "",
  //   manufacturer: "",
  // });

  const [addon, setAddon] = useState({
    title: "",
    price: "",
    image: null,
  });

  const { accountHolder } = useApp();

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];

  //   variant.mainImage = selectedFile;
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //     console.log("hiii");

  //     setPreview(URL.createObjectURL(selectedFile));
  //   }
  // };

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddon((prevAddon) => ({
      ...prevAddon,
      [name]: value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setAddon((prevVariants) => ({
        ...prevVariants,
        image: file, // Update mainImage field
      }));
      setFile(file);
      console.log("hiii");
      setPreview(URL.createObjectURL(file));
    }
  };

  console.log(addon);

  useEffect(() => {
    accountHolder.allowedCategory.map((category) => {
      console.log(category);

      const filtered = AllCatArray.filter((cat) => cat.name === category);
      console.log(filtered);

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
    toast.success("submit got trriggered");
    try {
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
        console.log(existingProductError);
        toast.error("Error checking existing product.");
        return;
      }

      let productId;
      if (existingProduct) {
        // If the product already exists, use the existing product ID
        productId = existingProduct.id;
        toast.success(
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
        toast.success("New product inserted successfully.");
      }

      // Handle the addons
      const { data: addonCategory, error: addonCategoryError } = await supabase
        .from("addons")
        .insert({ title: subSubCategory, productid: productId })
        .select()
        .single();

      if (addonCategoryError) {
        console.error("Error inserting addon category:", addonCategoryError);
        toast.error("Failed to save addon category.");
        return;
      }

      const addonId = addonCategory.id;
      toast.success("Addon category saved successfully.");

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
          toast.error(`Failed to upload image for addon variant: ${title}`);
        }

        const { error: addonVariantError } = await supabase
          .from("addon_variants")
          .insert({
            addonid: addonId,
            title,
            price,
            image: addonVariantImage.path,
          });

        if (addonVariantError) {
          console.error("Error inserting addon variant:", addonVariantError);
          toast.error(`Failed to save addon variant: ${title}`);
          return;
        } else {
          toast.success(`Addon variant ${title} added successfully.`);
        }
      }

      // Success message
      toast.success("Data inserted successfully!");
    } catch (error) {
      console.log("Error in onSubmit:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  // get the categories based on the category and type
  useEffect(() => {
    if (category !== "HVAC" && category !== "Civil / Plumbing") {
      console.log(category);
      const filter = AllCatArray.filter((cat) => cat.name === category).flatMap(
        (subcat) => subcat.subcategories
      );
      setSelectedSubcategories(filter);
    }

    if (category === "Civil / Plumbing") {
      if (subSubCategory === "Pods") {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === subSubCategory)
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter);
      } else {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === "other")
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter);
      }
    }

    if (category === "HVAC") {
      console.log(subSubCategory);

      if (subSubCategory === "Centralized AC") {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === subSubCategory)
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter);
      } else {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === "other")
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter);
      }
    }
  }, [category, subSubCategory]);

  console.log(selectedSubcategories);

  // clear the form
  const handleFormClear = () => {
    setAddon({
      title: "",
      price: "",
      image: null,
    });
    removeFile();
  };

  return (
    <div className="flex flex-col justify-center items-start font-Poppins relative">
      <div className="px-5 py-2 border-b-2 bg-white w-full border-b-gray-400 sticky top-0 z-10">
        <button
          onClick={() => {
            setAddNewProduct(false);
            setProductlist(true);
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
                  className="w-full border-2 py-1.5 px-2 rounded-lg"
                  onChange={(e) => setCategory(e.target.value)}
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
                >
                  <option value="" disabled>
                    Select Category
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
                />
              </div>
              <div>
                <h4 className="text-[#7B7B7B]">Addon price</h4>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={addon.price}
                  className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 ">
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
              className="border-2 px-5 py-2 bg-[#194F48] text-white capitalize rounded-lg"
              type="submit"
              // onClick={onsubmit}
            >
              add product
            </button>
          </div>
        </div>
      </form>
      {/* </form> */}
    </div>
  );
}

export default VendorNewAddon;
