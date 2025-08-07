import { baseImageUrl } from "../../utils/HelperConstant";

function ProductView({ onClose, product, handleDelete }) {
  const additionalImages = product?.additional_images
    ? JSON.parse(product.additional_images)
    : [];

  return (
    <div className="fixed inset-0 z-50 font-Poppins  flex justify-center items-center">
      <div className=" max-w-sm  lg:max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md border border-[#ccc]">
        {/* Top section with image and details */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Image Section */}
          <div className="flex-1">
            <div className="w-[200px] h-[200px]  md:w-[300px] lg:[350px]">
              <img
                src={`${baseImageUrl}${product.image}`}
                alt="product"
                className=" "
              />
            </div>
            <div className="flex gap-2 ">
              {additionalImages.lenght > 0 ? (
                additionalImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`${baseImageUrl}${image}`}
                      alt="product"
                      className="aspect-auto w-12"
                    />
                  </div>
                ))
              ) : (
                <h3 className="pt-3 uppercase">No Additional Images</h3>
              )}
            </div>
          </div>

          {/* Right Details Section */}
          <div className="flex-1 px-2">
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
                <p className=" w-1/2"> {product?.dimension || "NA"}</p>
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
