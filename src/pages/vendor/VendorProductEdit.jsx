import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { supabase } from "../../services/supabase";
import { toast } from "react-hot-toast";
import { useApp } from "../../Context/Context";
import { AllCatArray, specialArray } from "../../utils/AllCatArray";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function VendorProductEdit({
  setEditProduct,
  setIsProductRefresh,
  setProductlist,
  selectedproduct,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(selectedproduct?.image || null);
  const [resources, setResources] = useState([]);
  const [subcat, setSubcat] = useState([]);

  console.log("selected product", selectedproduct);

  const [selectedSubcategories, setSelectedSubcategories] = useState();
  const [subSubCategory, setSubSubCategory] = useState(
    selectedproduct?.products?.subcategory1 || ""
  );

  const [category, setCategory] = useState(
    selectedproduct?.products?.category || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dimensions, setDimensions] = useState({
    height: selectedproduct?.dimensions.split("x")[0] || "",
    length: selectedproduct?.dimensions.split("x")[1] || "",
    width: selectedproduct?.dimensions.split("x")[2] || "",
  });

  const fileInputRef = useRef(null);

  const mulitpleimagesFileinputref = useRef(null);

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const additionalImages = selectedproduct?.additional_images
    ? JSON.parse(selectedproduct.additional_images)
    : [];

  // const [selectedSubcategories, setSelectedSubcategories] = useState();
  const [variant, setVariant] = useState({
    title: selectedproduct?.title || "",
    price: selectedproduct?.price || "",
    details: selectedproduct?.details || "",
    mainImage: [selectedproduct?.image] || [],
    additionalImages: JSON.parse(selectedproduct.additional_images) || [],
    segment: selectedproduct?.segment || "",
    dimension: selectedproduct?.dimensions || "",
    manufacturer: selectedproduct?.manufacturer || "",
    vendor_id: selectedproduct?.vendor_id || "",
    product_id: selectedproduct?.product_id || "",
    selectedProductId: selectedproduct?.id || "",
  });
  //   const [variant, setVariant] = useState({
  //     title: "",
  //     price: "",
  //     details: "",
  //     mainImage: [],
  //     additionalImages: [],
  //     segment: "",
  //     dimension: "",
  //     manufacturer: "",
  //     vendor_id: "",
  //   });

  const { accountHolder } = useApp();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // variant.mainImage = selectedFile;
    setVariant((prev) => ({ ...prev, mainImage: selectedFile }));
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    setVariant((prev) => ({ ...prev, mainImage: droppedFile }));
    if (droppedFile) {
      setFile(droppedFile);
      console.log(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  };

  // remove file is for main image
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setVariant((prev) => ({ ...prev, mainImage: null }));

    // Reset file input value to allow same file selection again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariant((prevVariants) => ({
      ...prevVariants,
      [name]: value,
    }));
  };

  const handleAdditionalImagesChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length && variant.additionalImages.length + files.length <= 5) {
      setVariant((prevVariants) => ({
        ...prevVariants,
        additionalImages: [
          ...prevVariants.additionalImages, // Preserve existing ones
          ...files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
        ], // Add a new image
      }));
    } else {
      toast.error("You can upload up to 5 additional images only.");
      // alert("You can upload up to 5 additional images only.");
    }
  };

  const handleAdditionalDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);

    if (
      droppedFiles.length &&
      variant?.additionalImages.length + droppedFiles.length <= 5
    ) {
      setVariant((prevVariants) => ({
        ...prevVariants,
        additionalImages: [
          ...droppedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
          })),
        ], // Add a new image
      }));
    } else {
      toast.error("You can upload up to 5 additional images only.");
    }
  };

  const removeAdditionalImage = async (index) => {
    console.log("index", index);

    // setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    let additionalimages = variant.additionalImages.filter(
      (_, i) => i !== index
    );

    const removedelement = variant.additionalImages.find(
      (el, i) => i === index
    );

    console.log(typeof removedelement); //if new image then its object , if it was previous existing image then its string

    setVariant((prevVariants) => ({
      ...prevVariants,
      additionalImages: [...additionalimages], // Add a new image
    }));

    console.log("additional images", additionalimages);

    const userimages = additionalimages.filter((el) => typeof el === "string");

    console.log("user images", userimages);

    // look into this later
    // if (typeof removedelement === "string") {
    //   const { storageError } = await supabase.storage
    //     .from("addon")
    //     .remove(removedelement);

    //   console.log("item removed ");
    //   console.log("removed element", removedelement);

    //   console.log("storage error", storageError);
    // }
    // Update the database only for image that was previous product
    const { error } = await supabase
      .from("product_variants")
      .update({ additional_images: userimages })
      .eq("id", variant?.selectedProductId);

    if (error) {
      console.error("Error deleting additional image:", error.message);
      toast.error("error");
    }
    // Reset file input value to allow same file selection again
    if (mulitpleimagesFileinputref.current) {
      mulitpleimagesFileinputref.current.value = null;
    }
  };

  useEffect(() => {
    accountHolder.allowedCategory.map((category) => {
      const filtered = AllCatArray.filter((cat) => cat.name === category);

      const subcattodisplay = filtered.flatMap((subcat) => subcat.subCat1);
      console.log(subcattodisplay);
      return subcattodisplay;
    });
  }, []);

  useEffect(() => {
    const filtered = AllCatArray.filter((cat) => cat.name === category);
    const subcattodisplay = filtered.flatMap((subcat) => subcat.subCat1);
    setSubcat(subcattodisplay);
    setResources(filtered);
  }, [category]);

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("variant", variant);
    if (
      (!variant.mainImage && !file) ||
      variant.additionalImages.length === 0
    ) {
      console.log("images not found", variant);

      toast.error("images are required ");
      return;
    }

    console.log("file", file);

    //file based additionalimages
    const filebasedadditionalimages = variant.additionalImages.filter(
      (el) => typeof el !== "string"
    );

    // user previous additional images
    const useradditionalimages = variant.additionalImages.filter(
      (el) => typeof el === "string"
    );

    const uniqueID = uuidv4();
    setIsSubmitting(true);

    try {
      // Check if the product already exists based on category, subcategory, and subSubCategory
      let productId;
      if (
        selectedproduct?.products?.category !== category ||
        selectedproduct?.products.subcategory !== selectedSubcategories ||
        selectedproduct?.products.subcategory1 !== subSubCategory
      ) {
        const { data: existingProduct, error: existingProductError } =
          await supabase
            .from("products")
            .select("id")
            .eq("category", category)
            .eq("subcategory", selectedSubcategories)
            .eq("subcategory1", subSubCategory) // subSubCategory is from the state
            .single();

        if (existingProductError && existingProductError.code !== "PGRST116") {
          toast.error("Error checking existing product.");
          return;
        }

        if (existingProduct) {
          // If the product already exists, use the existing product ID
          productId = existingProduct.id;
          // toast.success(
          //   "Product already exists. Proceeding with variants and addons."
          // );
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
      } else {
        productId = variant.product_id;
      }

      // Now proceed with adding variants
      if (variant.title && variant.price && file) {
        const mainImageArray = [file];
        // Upload the main image to Supabase storage
        const { data: mainImageUpload, error: mainImageError } =
          await supabase.storage
            .from("addon")
            .upload(`${variant.title}-main-${uniqueID}`, mainImageArray[0]);

        if (mainImageError) {
          toast.error(
            `Error uploading main image for variant: ${variant.title}`
          );
          throw new Error("main image error");
        }

        // setVariant((prev) => ({ ...prev, mainImage: mainImageUpload.path }));

        variant.mainImage = mainImageUpload.path;
      }
      // additonal images
      if (filebasedadditionalimages.length > 0) {
        for (const [index, imageFile] of filebasedadditionalimages.entries()) {
          const { data: additionalImageUpload } = await supabase.storage
            .from("addon")
            .upload(
              `${variant.title}-additional-${index}-${uniqueID}`,
              imageFile.file
            );
          useradditionalimages.push(additionalImageUpload.path);
        }
      }

      // Insert the variant into the product_variants table

      //   console.log("main image", variant.mainImage);
      const imagepath = file ? variant.mainImage : variant.mainImage[0];
      const { error: variantError } = await supabase
        .from("product_variants")
        .update({
          title: variant.title,
          price: variant.price,
          details: variant.details,
          image: imagepath, // Store the main image path
          additional_images: useradditionalimages, // Store paths of additional images
          segment: variant.segment, // Store segment
          dimensions: variant.dimension, // Store dimension
          manufacturer: accountHolder?.companyName || variant.manufacturer, // Store manufacturer
          vendor_id: accountHolder.userId, // Store vendor ID
          product_type: subSubCategory,
          product_id: productId,
          status: "pending",
        })
        .eq("id", variant.selectedProductId); // Use the correct column and value to match the row you want to update

      if (variantError) {
        console.error(variantError);
        toast.error(`Error inserting variant: ${variant.title}`);
      }

      toast.success("product updated successfully");
      //   setEditProduct(false);
      //   setProductlist(true);
      //   setIsProductRefresh((prev) => !prev);
    } catch (error) {
      console.log("Error in onSubmit:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      //   handleFormClear();
      setIsSubmitting(false);
    }

    console.log("varaint data", variant);
  };
  //   const onSubmit = async (e) => {
  //     e.preventDefault();

  //     console.log("variant", variant);
  //     if (
  //       !variant.mainImage ||
  //       variant.mainImage.length === 0 ||
  //       variant.additionalImages.length === 0
  //     ) {
  //       console.log("images not found", variant);

  //       toast.error("images are required ");
  //       return;
  //     }
  //     setIsSubmitting(true);
  //     try {
  //       // Check if the product already exists based on category, subcategory, and subSubCategory
  //       const { data: existingProduct, error: existingProductError } =
  //         await supabase
  //           .from("products")
  //           .select("id")
  //           .eq("category", category)
  //           .eq("subcategory", selectedSubcategories)
  //           .eq("subcategory1", subSubCategory) // subSubCategory is from the state
  //           .single();

  //       if (existingProductError && existingProductError.code !== "PGRST116") {
  //         toast.error("Error checking existing product.");
  //         return;
  //       }

  //       let productId;
  //       if (existingProduct) {
  //         // If the product already exists, use the existing product ID
  //         productId = existingProduct.id;
  //         // toast.success(
  //         //   "Product already exists. Proceeding with variants and addons."
  //         // );
  //       } else {
  //         // Insert a new product if it doesn't exist
  //         const { data: Product, error: insertError } = await supabase
  //           .from("products")
  //           .insert({
  //             category: category,
  //             subcategory: selectedSubcategories,
  //             subcategory1: subSubCategory || null, // Insert subSubCategory (from state)
  //           })
  //           .select()
  //           .single();

  //         if (insertError) {
  //           console.error(insertError);
  //           toast.error("Error inserting new product.");
  //           return;
  //         }

  //         productId = Product.id;
  //         // toast.success("New product inserted successfully.");
  //       }

  //       // Now proceed with adding variants

  //       if (variant.title && variant.price && variant.mainImage) {
  //         // Upload the main image to Supabase storage
  //         const { data: mainImageUpload } = await supabase.storage
  //           .from("addon")
  //           .upload(`${variant.title}-main-${productId}`, variant.mainImage);

  //         // if (mainImageError) {
  //         //   console.error(mainImageError);
  //         //   toast.error(
  //         //     `Error uploading main image for variant: ${variant.title}`
  //         //   );
  //         // }

  //         // Upload additional images
  //         const additionalImagePaths = [];
  //         for (const [index, imageFile] of variant.additionalImages.entries()) {
  //           const { data: additionalImageUpload } = await supabase.storage
  //             .from("addon")
  //             .upload(
  //               `${variant.title}-additional-${index}-${productId}`,
  //               imageFile.file
  //             );

  //           // if (additionalImageError) {
  //           //   console.error(additionalImageError);
  //           //   toast.error(
  //           //     `Error uploading additional image ${index + 1} for variant: ${
  //           //       variant.title
  //           //     }`
  //           //   );
  //           //   continue;
  //           // }
  //           additionalImagePaths.push(additionalImageUpload.path);
  //         }

  //         // Insert the variant into the product_variants table
  //         const { error: variantError } = await supabase
  //           .from("product_variants")
  //           .insert({
  //             product_id: productId,
  //             title: variant.title,
  //             price: variant.price,
  //             details: variant.details,
  //             image: mainImageUpload.path, // Store the main image path
  //             additional_images: additionalImagePaths, // Store paths of additional images
  //             segment: variant.segment, // Store segment
  //             dimensions: variant.dimension, // Store dimension
  //             manufacturer: accountHolder?.companyName || variant.manufacturer, // Store manufacturer
  //             vendor_id: accountHolder.userId, // Store vendor ID
  //             product_type: subSubCategory,
  //           });

  //         if (variantError) {
  //           console.error(variantError);
  //           toast.error(`Error inserting variant: ${variant.title}`);
  //         }
  //         // toast.success(`Variant ${variant.title} added successfully.`);
  //       }

  //       // Handle the addons

  //       // Success message
  //       toast.success("Data inserted successfully!");
  //     } catch (error) {
  //       console.log("Error in onSubmit:", error);
  //       toast.error("An unexpected error occurred.");
  //     } finally {
  //       handleFormClear();
  //       setIsSubmitting(false);
  //     }
  //   };

  // get the categories based on the category and type
  useEffect(() => {
    if (category !== "HVAC" && category !== "Civil / Plumbing") {
      const filter = AllCatArray.filter((cat) => cat.name === category).flatMap(
        (subcat) => subcat.subcategories
      );
      setSelectedSubcategories(filter.join(","));
      console.log(filter);
      console.log(filter.join(","));
    }

    if (category === "Civil / Plumbing") {
      if (subSubCategory === "Pods") {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === subSubCategory)
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
        console.log(filter);
        console.log(filter.join(","));
      } else {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === "other")
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
        console.log(filter);
        console.log(filter.join(","));
      }
    }

    if (category === "HVAC") {
      if (subSubCategory === "Centralized AC") {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === subSubCategory)
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
        console.log(filter);
        console.log(filter.join(","));
      } else {
        const filter = specialArray
          .filter((cat) => cat.name === category && cat.type === "other")
          .flatMap((subcat) => subcat.subcategories);
        setSelectedSubcategories(filter.join(","));
        console.log(filter);
        console.log(filter.join(","));
      }
    }
  }, [category, subSubCategory]);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;

    const updatedDimensions = {
      ...dimensions,
      [name]: value,
    };

    setDimensions(updatedDimensions);

    // Update variant.dimension
    setVariant((prev) => ({
      ...prev,
      dimension: `${updatedDimensions.height}x${updatedDimensions.length}x${updatedDimensions.width}`,
    }));
  };

  // clear the form
  const handleFormClear = () => {
    setVariant((prevVariants) => ({
      ...prevVariants,
      title: "",
      price: "",
      details: "",
      mainImage: null,
      additionalImages: [],
      segment: "",
      dimension: "",
    }));
    setFile(null);
    setPreview(null);
    setCategory("");
    setSubSubCategory("");
    setDimensions({
      height: "",
      length: "",
      width: "",
    });
  };

  const handlecategorychange = (e) => {
    setCategory(e.target.value);
    setSubSubCategory("");
  };
  let imageUrl;
  if (variant?.mainImage) {
    imageUrl =
      typeof variant.mainImage[0] === "string"
        ? `${baseImageUrl}/${preview}`
        : `${preview}`;
  }

  console.log("imageurl", imageUrl);
  console.log("typeof main image", typeof variant.mainImage === "string");

  return (
    <div className="flex flex-col justify-center items-start font-Poppins relative">
      <div className="px-5 py-2 border-b-2 bg-white w-full border-b-gray-400 sticky top-0 z-10">
        <button
          onClick={() => {
            setEditProduct(false);
            setProductlist(true);
            setIsProductRefresh((prev) => !prev);
          }}
          className="border-none flex justify-center items-center text-[#A1A1A1]"
        >
          <MdKeyboardArrowLeft />
          Back to product list
        </button>
        <h3 className="capitalize font-semibold text-xl ">Edit product</h3>
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
                <h4 className="text-[#7B7B7B]">product category</h4>
                <select
                  name="category"
                  id="category"
                  value={category}
                  className="w-full border-2 py-1.5 px-2 rounded-lg"
                  // onChange={(e) => setCategory(e.target.value)}
                  onChange={(e) => handlecategorychange(e)}
                  required
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
                <h4 className="text-[#7B7B7B]">product name</h4>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={variant.title}
                  className="w-full py-1.5 px-2 border-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <h4 className="text-[#7B7B7B]">product details</h4>
                <textarea
                  type="textarea"
                  name="details"
                  onChange={handleChange}
                  value={variant.details}
                  className="w-full py-1.5 px-2 border-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <h4 className="text-[#7B7B7B]">product price</h4>
                <input
                  type="number"
                  name="price"
                  onChange={handleChange}
                  value={variant.price}
                  className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                  required
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

                  {preview && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                      <img
                        src={imageUrl}
                        // src={`${baseImageUrl}/${preview}`}
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
              <div className="px-4 py-2 bg-white border rounded-xl shadow-lg my-3 w-full">
                <h4 className="text-[#7B7B7B] capitalize">additional </h4>
                <div className="flex flex-wrap gap-4">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleAdditionalDrop}
                    className="w-28 h-28 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-400 p-2"
                  >
                    <input
                      type="file"
                      id="additional-file-upload"
                      ref={mulitpleimagesFileinputref}
                      name="additionalImages"
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

                  {variant.additionalImages.map((img, index) => {
                    const imageUrl =
                      typeof img === "string"
                        ? `${baseImageUrl}/${img}`
                        : img.preview;

                    return (
                      <div
                        key={index}
                        className="relative w-24 h-24 border rounded-lg overflow-hidden group"
                      >
                        <img
                          src={imageUrl}
                          // src={img.preview}
                          alt={`Additional Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => removeAdditionalImage(index)}
                            className="text-white text-xs bg-red-600 px-2 py-1 rounded"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
                value={variant.segment}
                className="w-full border-2 py-1.5 px-2 rounded-lg"
                onChange={handleChange}
                required
              >
                <option value="">select plan</option>
                <option value="Minimal">Minimal</option>
                <option value="Exclusive">Exclusive</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>
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
                "Update"
              )}
            </button>
          </div>
        </div>
      </form>
      {/* </form> */}
    </div>
  );
}

export default VendorProductEdit;
