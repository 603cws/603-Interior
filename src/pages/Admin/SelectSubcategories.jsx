import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { baseImageUrl } from "../../utils/HelperConstant";
import { supabase } from "../../services/supabase";
import { specialArray } from "../../utils/AllCatArray";
import { useAllCatArray } from "../../utils/AllCatArray";
import toast from "react-hot-toast";

const getDynamicSubcategories = (category, type, AllCatArray) => {
  if (!category || !type) return [];

  const normalizedCategory = category.trim().toLowerCase();
  const normalizedType = type.trim().toLowerCase();

  const special = specialArray.find(
    (item) =>
      item.name.trim().toLowerCase() === normalizedCategory &&
      item.type.trim().toLowerCase() === normalizedType
  );
  if (special) {
    return special.subcategories;
  }
  const foundCategory = AllCatArray.find(
    (item) => item.name.trim().toLowerCase() === normalizedCategory
  );
  if (!foundCategory) return [];
  const matchType = foundCategory.subCat1.find(
    (sub) => sub.trim().toLowerCase() === normalizedType
  );
  if (matchType) {
    return foundCategory.subcategories;
  }
  return [];
};

function SelectSubcategories({
  onClose,
  product,
  handleUpdateStatus,
  setRejectReason,
}) {
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const AllCatArray = useAllCatArray();
  const category = product?.products?.category;
  const type = product?.products?.subcategory1;

  const subcategories = getDynamicSubcategories(category, type, AllCatArray);

  const handleSelect = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  const updateSubcategories = async () => {
    if (selectedSubcategories?.length <= 0) {
      toast?.error("please select the subcategory");
      return;
    }

    try {
      const category = product?.products?.category;
      const subcategory1 = product?.products?.subcategory1;
      const subcategoryString = selectedSubcategories.join(",");

      const { data: existingProducts, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("subcategory", subcategoryString)
        .eq("subcategory1", subcategory1)
        .limit(1);
      if (fetchError) {
        console.error("Fetch error:", fetchError);
        return;
      }
      let productId;
      if (existingProducts && existingProducts.length > 0) {
        productId = existingProducts[0].id;
      } else {
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert([
            {
              category,
              subcategory: subcategoryString,
              subcategory1,
            },
          ])
          .select()
          .single();
        if (insertError) {
          console.error("Insert error:", insertError);
          return;
        }
        productId = newProduct.id;
      }
      const { error: updateError } = await supabase
        .from("product_variants")
        .update({
          product_id: productId,
        })
        .eq("id", product.id);
      if (updateError) {
        console.error("Update variant error:", updateError);
        return;
      }
      handleUpdateStatus(product, "approved");
      setRejectReason("");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000]/30 z-50">
      <div className="flex gap-7 bg-[#fff] p-5 rounded-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2">
          <IoIosCloseCircleOutline size={25} color="#334A78" />
        </button>
        <div className="flex-1">
          <h2 className="text-center text-lg font-semibold capitalize">
            Select subcategories{" "}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
            {subcategories?.map((subcategory, index) => (
              <button
                key={index}
                onClick={() => handleSelect(subcategory)}
                className={`px-4 py-2 border text-xs lg:text-base rounded-md transition w-full  hover:bg-gradient-to-r from-[#334A78] to-[#68B2DC] text-black hover:text-white ${
                  selectedSubcategories.includes(subcategory)
                    ? "bg-[#334A78] text-white"
                    : "bg-gray-200"
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center mt-4">
            <button
              onClick={updateSubcategories}
              className="bg-[#374A75] rounded-lg text-xs lg:text-sm py-2 px-10 border-2 text-white"
            >
              Done
            </button>
          </div>
        </div>
        <div>
          <div className="max-w-xs flex justify-center items-center">
            <img
              src={`${baseImageUrl}${product.image}`}
              alt={product.title}
              className="aspect-square object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2>Title</h2>
              <p>{product?.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <h2>category</h2>
              <p>{product?.products?.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSubcategories;
