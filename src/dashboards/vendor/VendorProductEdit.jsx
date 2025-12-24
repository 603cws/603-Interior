import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsUpload } from "react-icons/bs";
import { useEffect, useState } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { supabase } from "../../services/supabase";
import { toast } from "react-hot-toast";
import {
  useAllCatArray,
  specialArray,
  displayOptions,
} from "../../utils/AllCatArray";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  baseImageUrl,
  additionalDetailsConfig,
  productInfoFields,
} from "../../utils/HelperConstant";
import MultiImageCrop from "../components/MultiImageCrop";
import ButtonSpinner from "../../utils/ButtonSpinner";

function VendorProductEdit({
  setEditProduct,
  setIsProductRefresh,
  setProductlist,
  selectedproduct,
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(selectedproduct?.image || null);
  const [subcat, setSubcat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendordata, setVendordata] = useState();
  const [selectedSubcategories, setSelectedSubcategories] = useState();
  const [subSubCategory, setSubSubCategory] = useState(
    selectedproduct?.products?.subcategory1 || ""
  );

  const [category, setCategory] = useState(
    selectedproduct?.products?.category || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dimensions, setDimensions] = useState({
    height: selectedproduct?.dimensions?.split("x")[0] || "",
    length: selectedproduct?.dimensions?.split("x")[1] || "",
    width: selectedproduct?.dimensions?.split("x")[2] || "",
  });
  const [displayOption, setDisplayOption] = useState(
    selectedproduct?.productDisplayType
  );

  const [showCropper, setShowCropper] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [showMultiCropper, setShowMultiCropper] = useState(false);
  const [cropperFile, setCropperFile] = useState(null);

  const fileInputRef = useRef(null);

  const mulitpleimagesFileinputref = useRef(null);
  const AllCatArray = useAllCatArray();

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("allowed_category")
        .eq("id", selectedproduct?.vendor_id)
        .single();

      if (error) {
        console.error("Error fetching vendor:", error.message);
      } else {
        const parseddata = JSON.parse(data.allowed_category);
        setVendordata(parseddata);
      }
      setLoading(false);
    };

    fetchVendorData();
  }, [selectedproduct?.vendor_id]);

  const [variant, setVariant] = useState({
    title: selectedproduct?.title || "",
    price: selectedproduct?.price || "",
    details: selectedproduct?.details || "",
    mainImage: selectedproduct?.image ? [selectedproduct.image] : [],
    additionalImages: JSON.parse(selectedproduct.additional_images) || [],
    segment: selectedproduct?.segment || "",
    dimension: selectedproduct?.dimensions || "",
    manufacturer: selectedproduct?.manufacturer || "",
    vendor_id: selectedproduct?.vendor_id || "",
    product_id: selectedproduct?.product_id || "",
    selectedProductId: selectedproduct?.id || "",
    mrp: selectedproduct?.ecommercePrice?.mrp || "",
    sellingPrice: selectedproduct?.ecommercePrice?.sellingPrice || "",
    quantity: selectedproduct?.stockQty || "",
    information: selectedproduct?.information || {},
    additionalInformation: selectedproduct?.additonalinformation || {},
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setShowCropper(true);
    setFile(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];

    if (!droppedFile) return;
    setShowCropper(true);

    setFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setVariant((prev) => ({ ...prev, mainImage: null }));
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

    if (!files.length) return;
    if (variant.additionalImages.length + files.length > 5) {
      toast.error("You can upload up to 5 additional images only.");
      mulitpleimagesFileinputref.current.value = null;
      return;
    }

    setAdditionalFiles(files);
    setShowMultiCropper(true);
    mulitpleimagesFileinputref.current.value = null;
  };

  const handleAdditionalDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (!droppedFiles.length) return;

    if (variant.additionalImages.length + droppedFiles.length > 5) {
      toast.error("You can upload up to 5 additional images only.");
      return;
    }

    setAdditionalFiles(droppedFiles);
    setShowMultiCropper(true);
  };

  const handleCropped = (file) => {
    setPreview(URL.createObjectURL(file));
    setCropperFile(file);
    setVariant((prev) => ({ ...prev, mainImage: file }));
  };

  const removeAdditionalImage = async (index) => {
    let additionalimages = variant.additionalImages.filter(
      (_, i) => i !== index
    );

    setVariant((prevVariants) => ({
      ...prevVariants,
      additionalImages: [...additionalimages],
    }));

    const userimages = additionalimages.filter((el) => typeof el === "string");
    const { error } = await supabase
      .from("product_variants")
      .update({ additional_images: userimages })
      .eq("id", variant?.selectedProductId);

    if (error) {
      console.error("Error deleting additional image:", error.message);
      toast.error("error");
    }
    if (mulitpleimagesFileinputref.current) {
      mulitpleimagesFileinputref.current.value = null;
    }
  };

  useEffect(() => {
    const filtered = AllCatArray?.filter(
      (cat) => cat?.name?.toLowerCase() === category?.toLowerCase()
    );

    const subcattodisplay = filtered.flatMap((subcat) => subcat?.subCat1);
    setSubcat(subcattodisplay);
  }, [category, AllCatArray]);

  const cleanTitle = (str) => {
    return str.replace(/[^a-zA-Z0-9 ]/g, "");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      (!variant.mainImage && !file) ||
      variant.additionalImages.length === 0
    ) {
      toast.error("images are required ");
      return;
    }
    const filebasedadditionalimages = variant.additionalImages.filter(
      (el) => typeof el !== "string"
    );
    const useradditionalimages = variant.additionalImages.filter(
      (el) => typeof el === "string"
    );

    const uniqueID = uuidv4();
    setIsSubmitting(true);

    try {
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
            .eq("subcategory1", subSubCategory)
            .single();

        if (existingProductError && existingProductError.code !== "PGRST116") {
          toast.error("Error checking existing product.");
          return;
        }

        if (existingProduct) {
          productId = existingProduct.id;
        } else {
          const { data: Product, error: insertError } = await supabase
            .from("products")
            .insert({
              category: category,
              subcategory: selectedSubcategories,
              subcategory1: subSubCategory || null,
            })
            .select()
            .single();

          if (insertError) {
            console.error(insertError);
            toast.error("Error inserting new product.");
            return;
          }

          productId = Product.id;
        }
      } else {
        productId = variant.product_id;
      }
      if (variant.title && variant.price && file) {
        let cleanedTitle = cleanTitle(variant.title);
        const oldImagePath = selectedproduct?.image;
        const newImagePath = `${cleanedTitle}-main-${uniqueID}`;

        if (oldImagePath) {
          const { error: removeError } = await supabase.storage
            .from("addon")
            .remove([oldImagePath]);

          if (removeError) {
            console.warn("Failed to remove old image:", removeError.message);
          }
        }

        const { data: mainImageUpload, error: mainImageError } =
          await supabase.storage
            .from("addon")
            .upload(newImagePath, cropperFile);

        if (mainImageError) {
          toast.error(
            `Error uploading main image for variant: ${variant.title}`
          );
          throw new Error("Main image upload failed");
        }

        variant.mainImage = mainImageUpload.path;
        setPreview(mainImageUpload.path);
      }

      const previousAdditionalImages = JSON.parse(
        selectedproduct?.additional_images || "[]"
      );

      const imagesToRemove = previousAdditionalImages.filter(
        (oldPath) => !variant.additionalImages.includes(oldPath)
      );

      if (imagesToRemove.length > 0) {
        const { error: removeError } = await supabase.storage
          .from("addon")
          .remove(imagesToRemove);

        if (removeError) {
          console.warn(
            "Error removing old additional images:",
            removeError.message
          );
        }
      }

      let currentIndex = variant.additionalImages.filter(
        (img) => typeof img === "string"
      ).length;

      for (const imageFile of filebasedadditionalimages) {
        const fileUuid = uuidv4();
        let cleanedTitle = cleanTitle(variant.title);
        const filePath = `${cleanedTitle}-additional-${currentIndex}-${fileUuid}`;

        const { data: additionalImageUpload, error: additionalImageError } =
          await supabase.storage.from("addon").upload(filePath, imageFile.file);

        if (additionalImageError) {
          console.warn(
            `Failed to upload additional image at index ${currentIndex}`,
            additionalImageError.message
          );
          continue;
        }

        useradditionalimages.push(additionalImageUpload.path);
        currentIndex++;
      }

      const imagepath = file ? variant.mainImage : variant.mainImage[0];
      const { error: variantError } = await supabase
        .from("product_variants")
        .update({
          title: variant.title,
          price: +variant.price,
          details: variant.details,
          image: imagepath,
          additional_images: useradditionalimages,
          segment: variant.segment,
          dimensions: variant.dimension,
          vendor_id: selectedproduct?.vendor_id,
          product_type: subSubCategory,
          product_id: productId,
          status: "pending",
          productDisplayType: displayOption,
          stockQty: +variant.quantity,
          ecommercePrice: {
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
          },
          information: variant?.information || {},
          additonalinformation: variant?.additionalInformation || {},
        })
        .eq("id", variant.selectedProductId);

      if (variantError) {
        console.error(variantError);
        toast.error(`Error inserting variant: ${variant.title}`);
      }

      toast.success("product updated successfully");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      handleFormClear();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (category !== "HVAC" && category !== "Civil / Plumbing") {
      const filter = AllCatArray.filter((cat) => cat.name === category).flatMap(
        (subcat) => subcat.subcategories
      );
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
  }, [category, subSubCategory, AllCatArray]);

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;

    const updatedDimensions = {
      ...dimensions,
      [name]: value,
    };

    setDimensions(updatedDimensions);

    setVariant((prev) => ({
      ...prev,
      dimension: `${updatedDimensions.height}x${updatedDimensions.length}x${updatedDimensions.width}`,
    }));
  };
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

  if (loading || AllCatArray?.length === 0) {
    return (
      <div className="flex justify-center items-center">Loading ......</div>
    );
  }

  const handleChangeAdditionalInformation = (e) => {
    const { name, value } = e.target;
    setVariant((prev) => ({
      ...prev,
      additionalInformation: {
        ...prev.additionalInformation,
        [name]: value,
      },
    }));
  };
  const handleChangeInformation = (e) => {
    const { name, value } = e.target;
    setVariant((prev) => ({
      ...prev,
      information: {
        ...prev.information,
        [name]: value,
      },
    }));
  };

  const AdditonalInformation = additionalDetailsConfig.filter(
    (info) =>
      info.category.toLowerCase() === category.toLowerCase() &&
      info.subcategory.toLowerCase() === subSubCategory.toLowerCase()
  );

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
      <form
        className="lg:flex gap-5  px-5 w-full"
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="w-full lg:w-1/2">
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
                  onChange={(e) => handlecategorychange(e)}
                  required
                >
                  <option value="">Select Category</option>

                  {vendordata &&
                    vendordata?.map((cat, index) => {
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
                  disabled={!category}
                  onChange={(e) => setSubSubCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {subcat?.map((cat, index) => {
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
                  {displayOptions?.map((option, index) => {
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
              <FormInput
                label={"Short Description"}
                name={"ShortDescription"}
                type={"text"}
                value={variant?.information?.["ShortDescription"] || ""}
                placeholder={"short despcriton max 150 charcter"}
                maxLength={150}
                onChange={handleChangeInformation}
              />
              <div>
                <h4 className="text-[#7B7B7B]">product details</h4>
                <textarea
                  type="textarea"
                  name="details"
                  onChange={handleChange}
                  maxLength={150}
                  value={variant.details}
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
                    value={variant.price}
                    className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                    required
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
                      value={dimensions?.height}
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
                      value={dimensions?.length}
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
                      value={dimensions?.width}
                      onChange={handleDimensionChange}
                      className="w-20 xl:w-32 py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                      required
                    />
                    <span className="absolute top-2 right-2">W</span>
                  </div>
                </div>
              </div>

              {productInfoFields?.map((field, idx) => (
                <FormInput
                  key={idx}
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={variant?.information?.[field.name] || ""}
                  placeholder={field.placeholder}
                  onChange={handleChangeInformation}
                />
              ))}
            </div>
          </div>
          {(displayOption === "ecommerce" || displayOption === "both") && (
            <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
              <div>
                <h4 className="text-[#7B7B7B]">MRP</h4>
                <input
                  type="number"
                  name="mrp"
                  onChange={handleChange}
                  value={variant?.mrp}
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
                  value={variant?.sellingPrice}
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
                  value={variant?.quantity}
                  className="w-full py-1.5 px-2 border-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0"
                  required
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-full lg:w-1/2 ">
          {AdditonalInformation?.length > 0 && (
            <div>
              <div className="flex justify-start items-center gap-2 mb-3">
                <h3 className="capitalize text-xl font-semibold">
                  Additional details
                </h3>
              </div>
              <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
                {AdditonalInformation.map((group, index) => (
                  <div key={index} className="mb-8 space-y-4">
                    {group.fields.map((field, idx) => (
                      <FormInput
                        key={idx}
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={
                          variant?.additionalInformation?.[field.name] || ""
                        }
                        placeholder={field.placeholder}
                        onChange={handleChangeAdditionalInformation}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="flex justify-start items-center gap-2 mb-3">
              <h3 className="capitalize text-xl font-semibold">
                product images
              </h3>
              <FaRegQuestionCircle size={20} className="cursor-pointer" />
            </div>
            <div>
              <>
                <div className="px-4 py-2 bg-white border rounded-xl shadow-lg my-3 w-full">
                  <h4 className="text-[#7B7B7B] capitalize">main</h4>

                  <div className="flex items-start gap-4">
                    {!preview && (
                      <div
                        className="w-28 h-28 p-2 flex flex-col items-center justify-center border border-dashed rounded-lg text-center text-gray-500 cursor-pointer  hover:border-gray-400"
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                      >
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
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {preview && (
                      <div className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                        <img
                          src={imageUrl}
                          alt="product-image"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <button
                            type="button"
                            className="text-white text-xs bg-gray-700 px-2 py-1 rounded mb-1"
                            onClick={() => fileInputRef.current.click()}
                          >
                            Replace
                          </button>
                          <button
                            type="button"
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

                <MultiImageCrop
                  open={showCropper}
                  files={file ? [file] : []}
                  onClose={() => setShowCropper(false)}
                  onDone={(croppedFiles) => {
                    handleCropped(croppedFiles[0]);
                    setShowCropper(false);
                  }}
                />
              </>

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
                          alt={`Additional Preview ${index}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => {
                            setFile(img.file);
                            setShowMultiCropper(true);
                          }}
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

              <MultiImageCrop
                open={showMultiCropper}
                files={additionalFiles}
                onClose={() => setShowMultiCropper(false)}
                onDone={(croppedFiles) => {
                  setVariant((prev) => ({
                    ...prev,
                    additionalImages: [
                      ...prev.additionalImages,
                      ...croppedFiles.map((file) => ({
                        file,
                        preview: URL.createObjectURL(file),
                      })),
                    ],
                  }));
                  setShowMultiCropper(false);
                }}
              />
            </div>
          </div>
          <div>
            <h3 className="capitalize mb-3 text-xl font-semibold">
              plan category
            </h3>
            <div className="w-full shadow-lg border-2 p-5 my-3 rounded-xl capitalize">
              <h4 className="text-[#7B7B7B]">Segment</h4>
              <select
                name="segment"
                id="segment"
                value={variant?.segment}
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
          <div className="w-full flex items-end justify-between mt-5">
            <button
              className="border-2 px-5 py-2 bg-[#374A75] text-white capitalize rounded-lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="spinner flex justify-center items-center">
                  <ButtonSpinner />
                </div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default VendorProductEdit;

function FormInput({
  label,
  name,
  type,
  value,
  placeholder,
  onChange,
  ...rest
}) {
  return (
    <div>
      <p className="text-[#7B7B7B]">{label}</p>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full py-1.5 px-2 border-2 rounded-lg"
        {...rest}
        required
      />
    </div>
  );
}
