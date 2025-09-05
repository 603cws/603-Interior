import { baseImageUrl } from "../../utils/HelperConstant";

function ProductView({ onClose, product, handleDelete }) {
  console.log("product", product);

  //   {
  //     "id": "2bd93ead-202f-4a12-bee5-ce3cda8ba3fb",
  //     "created_at": "2025-01-08T13:53:03.14322+00:00",
  //     "title": "Rustic Stone Tile",
  //     "price": 79,
  //     "details": "Natural stone tiles with a rustic finish, perfect for creating an earthy look.",
  //     "image": "Rustic Stone Tile-main-64351a96-9d5c-4b61-860b-8e55af78e41b",
  //     "product_id": "64351a96-9d5c-4b61-860b-8e55af78e41b",
  //     "additional_images": "[]",
  //     "dimensions": null,
  //     "manufacturer": "Workved",
  //     "segment": "Exclusive",
  //     "default": "Exclusive",
  //     "product_type": "Tile",
  //     "vendor_id": null,
  //     "status": "approved",
  //     "type": "product",
  //     "reject_reason": null,
  //     "products": {
  //         "id": "64351a96-9d5c-4b61-860b-8e55af78e41b",
  //         "category": "Flooring",
  //         "created_at": "2025-01-08T13:50:29.024283+00:00",
  //         "subcategory": "Open Workspaces,Cabins,Meeting Rooms,Public Spaces,All Areas",
  //         "subcategory1": "Tile"
  //     }
  // }

  const additionalImages = product?.additional_images
    ? JSON.parse(product.additional_images)
    : [];

  return (
    <div className="fixed inset-0 z-50 font-Poppins  flex justify-center items-center bg-[#000]/20 backdrop-blur-[1px] ">
      <div className="max-w-xs sm:max-w-sm md:max-w-2xl  lg:max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-[#ccc] max-h-[85vh] overflow-y-auto gradient-scrollbar">
        {/* Top section with image and details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Image Section */}
          <div className="flex-1 flex flex-col">
            {/* <div className="w-[200px] h-[200px]  md:w-[300px] lg:[350px]"> */}
            <div className="flex-1">
              <img
                src={`${baseImageUrl}${product.image}`}
                alt="product"
                className="object-cover max-h-full"
              />
            </div>
            <div className="flex gap-2 ">
              {additionalImages.length > 0 ? (
                additionalImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`${baseImageUrl}${image}`}
                      alt="product"
                      className="aspect-auto w-12 object-contain"
                    />
                  </div>
                ))
              ) : (
                <h3 className="pt-3 uppercase text-[10px] md:text-xs">
                  No Additional Images
                </h3>
              )}
            </div>
          </div>

          {/* Right Details Section */}
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl  font-semibold text-[#374A75]">
              {product?.title || "NA"}
            </h2>
            <p className="text-[#374A75] font-semibold text-xl lg:text-2xl mt-1">
              Rs: {product?.price || "NA"}
            </p>
            <p className="mt-2 text-black text-sm">
              {product?.details || "NA"}
            </p>

            <div className="mt-4 text-sm space-y-1 text-black">
              <div className="flex items-center justify-start  w-full my-2">
                <h3 className="font-semibold  capitalize w-1/2 ">category:</h3>
                <p className=" w-1/2"> {product?.products?.category || "NA"}</p>
              </div>
              {/* <div className="flex  justify-start  w-full my-2">
                <h3 className="font-semibold  capitalize w-1/2 ">
                  Sub-categories:
                </h3>
                <p className=" w-1/2">
                  {" "}
                  {product?.products?.subcategory || "NA"}
                </p>
              </div> */}
              <div className="flex items-center justify-start  w-full my-2">
                <h3 className="font-semibold  capitalize w-1/2 ">
                  Specification:
                </h3>
                <p className=" w-1/2">
                  {" "}
                  {product?.products?.subcategory1 || "NA"}
                </p>
              </div>
              <div className="flex items-center justify-start  w-full my-2">
                <h3 className="font-semibold  capitalize w-1/2 ">Dimension:</h3>
                <p className=" w-1/2">
                  {" "}
                  {product?.dimensions || "NA"}
                  {/* {product?.dimensions?.replaceAll(",", " x ") || "NA"} */}
                </p>
              </div>
              <div className="flex items-center justify-start  w-full my-2">
                <h3 className="font-semibold  capitalize w-1/2 ">Segment:</h3>
                <p className=" w-1/2"> {product?.segment || "NA"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded-md"
          >
            Back
          </button>
          <button
            onClick={handleDelete}
            className="hidden px-4 py-2 text-white bg-red-500 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductView;
