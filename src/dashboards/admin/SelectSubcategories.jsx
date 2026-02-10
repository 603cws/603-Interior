import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { baseImageUrl } from "../../utils/HelperConstant";
import { supabase } from "../../services/supabase";
import { specialArray } from "../../utils/AllCatArray";
import { useAllCatArray } from "../../utils/AllCatArray";
import toast from "react-hot-toast";
import { handleError } from "../../common-components/handleError";

const getDynamicSubcategories = (category, type, AllCatArray) => {
  if (!category || !type) return [];

  const normalizedCategory = category.trim().toLowerCase();
  const normalizedType = type.trim().toLowerCase();

  const special = specialArray.find(
    (item) =>
      item.name.trim().toLowerCase() === normalizedCategory &&
      item.type.trim().toLowerCase() === normalizedType,
  );
  if (special) {
    return special.subcategories;
  }
  const foundCategory = AllCatArray.find(
    (item) => item.name.trim().toLowerCase() === normalizedCategory,
  );
  if (!foundCategory) return [];
  const matchType = foundCategory.subCat1.find(
    (sub) => sub.trim().toLowerCase() === normalizedType,
  );
  if (matchType) {
    return foundCategory.subcategories;
  }
  return [];
};

//                Data Format
//       {
//     "id": "2e96ecdf-06ae-4f4b-ab41-664f3944e368",
//     "created_at": "2025-12-06T06:02:27.747939+00:00",
//     "title": "nvibijrijb",
//     "price": 118,
//     "details": "rbeqbrqebetbqetb",
//     "image": "nvibijrijb-main-02669471-24e1-4477-b66e-72bfcc1347d8",
//     "product_id": "6e83ec0a-0d8f-4f70-93dc-d4e2151d105d",
//     "additional_images": "[\"nvibijrijb-additional-0-02669471-24e1-4477-b66e-72bfcc1347d8\"]",
//     "dimensions": "120x120x100",
//     "manufacturer": "workvedDev",
//     "segment": "Exclusive",
//     "default": null,
//     "product_type": "Sofas",
//     "vendor_id": "f2bb3292-d50b-463e-8b62-9a266e538f4e",
//     "status": "pending",
//     "type": "product",
//     "reject_reason": null,
//     "ecommercePrice": {
//         "mrp": "",
//         "sellingPrice": ""
//     },
//     "stockQty": 0,
//     "productDisplayType": "boq",
//     "information": {
//         "Brand": "nijbijrbobm",
//         "Material": "stfuyjcvcvjn",
//         "BodyMaterial": "srtfuicjkiopoj",
//         "ProductColor": "black",
//         "ProductWeight": "450",
//         "SpecialFeature": "gcvyhguyui",
//         "ShortDescription": "reqbqbrqb",
//         "ProductCareInstructions": "hhuhuhih"
//     },
//     "additonalinformation": {
//         "useCase": "coffee",
//         "seatDepth": "22",
//         "seatHeight": "vfugb",
//         "seatingCapacity": "4",
//         "seatBackFillMaterial": "nnbibjbij"
//     },
//     "products": {
//         "id": "6e83ec0a-0d8f-4f70-93dc-d4e2151d105d",
//         "category": "Furniture",
//         "created_at": "2025-11-26T06:30:10.143566+00:00",
//         "subcategory": "Linear Workstation,L-Type Workstation,Md Cabin,Manager Cabin,Small Cabin,Discussion Room,Interview Room,Conference Room,Board Room,Meeting Room,Meeting Room Large,HR Room,Finance Room,Sales,Reception,Pantry,Breakout Room,Washrooms",
//         "subcategory1": "Sofas"
//     }
// }

function SelectSubcategories({
  onClose,
  product,
  handleUpdateStatus,
  setRejectReason,
}) {
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [markDefault, setMarkDefault] = useState(false);
  const AllCatArray = useAllCatArray();
  const category = product?.products?.category;
  const type = product?.products?.subcategory1;

  const subcategories = getDynamicSubcategories(category, type, AllCatArray);

  const handleSelect = (subcategory) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory],
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

      // if defaultproducts exists
      if (markDefault) {
        //1)find all the product in this subcategory1,segment,default,approved status
        const { data: getAllDefaultProducts, error: fetchError } =
          await supabase
            .from("product_variants")
            .select("id,title,product_id,defaultSubCat")
            .eq("product_type", subcategory1)
            .neq("id", product?.id)
            .eq("default", product?.segment)
            .eq("segment", product?.segment);

        if (fetchError) {
          handleError(fetchError, {
            prodMessage: "Something went wrong. Please try again.",
          });
          return;
        }

        if (getAllDefaultProducts && getAllDefaultProducts?.length > 0) {
          const updated = getAllDefaultProducts?.map((item) => {
            if (!item.defaultSubCat) return { ...item, filtered: null };

            // Convert defaultSubCat → array + lowercase
            const arr = item.defaultSubCat.split(",").map((v) => v.trim());

            const filtered = arr.filter(
              (v) =>
                !selectedSubcategories
                  .map((s) => s.toLowerCase())
                  .includes(v.toLowerCase()),
            );

            return {
              ...item,
              filtered: filtered?.length > 0 ? filtered.join(",") : null,
            };
          });

          for (const item of updated) {
            const defaultSubCat = item.filtered;

            const { error } = await supabase
              .from("product_variants")
              .update({ defaultSubCat })
              .eq("id", item.id)
              .select();

            if (error)
              handleError(error, {
                prodMessage: "Something went wrong. Please try again.",
              });
          }
        }
      }

      const { data: existingProducts, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .eq("subcategory", subcategoryString)
        .eq("subcategory1", subcategory1)
        .limit(1);
      if (fetchError) {
        handleError(fetchError, {
          prodMessage: "Something went wrong. Please try again.",
        });
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
          handleError(insertError, {
            prodMessage: "Something went wrong. Please try again.",
          });
          return;
        }
        productId = newProduct.id;
      }
      if (markDefault) {
        const { error: updateError } = await supabase
          .from("product_variants")
          .update({
            product_id: productId,
            default: product?.segment,
            defaultSubCat: selectedSubcategories?.join(","),
          })
          .eq("id", product.id);
        if (updateError) {
          handleError(updateError, {
            prodMessage: "Something went wrong. Please try again.",
          });
          return;
        }
      } else {
        const { error: updateError } = await supabase
          .from("product_variants")
          .update({
            product_id: productId,
          })
          .eq("id", product.id);
        if (updateError) {
          handleError(updateError, {
            prodMessage: "Something went wrong. Please try again.",
          });
          return;
        }
      }
      handleUpdateStatus(product, "approved");
      setRejectReason("");
      onClose();
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    } finally {
      setMarkDefault(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-[#000]/30 z-50">
      <div className=" max-w-xs sm:max-w-sm md:max-w-2xl  lg:max-w-none mx-auto p-4 md:p-5 rounded-lg md:rounded-xl border-2 relative bg-white max-h-[85vh] overflow-y-auto gradient-scrollbar">
        <div className="flex  justify-end items-center">
          <button onClick={onClose} className="">
            <IoIosCloseCircleOutline size={25} color="#334A78" />
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <h2 className="text-center text-lg font-semibold capitalize">
              Select subcategories
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
            <div className="flex gap-3 mt-4">
              <input
                type="checkbox"
                name="defaultcheckbox"
                checked={markDefault}
                onChange={(e) => setMarkDefault(e.target.checked)}
              />
              <p>Choose this product as Default</p>
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
          <div className="">
            <div className="max-w-xs flex justify-center items-center">
              <img
                src={`${baseImageUrl}${product.image}`}
                alt={product.title}
                className="aspect-square object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[#334A78]">Title</h2>
                <p>{product?.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-[#334A78]">category</h2>
                <p>{product?.products?.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectSubcategories;
