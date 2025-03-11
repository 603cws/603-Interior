import React from "react";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { PiWarningCircleFill } from "react-icons/pi";

function RejectedProduct({ onClose, product }) {
  console.log("rejected product", product);

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-40 z-30 p-4">
      <div className="bg-white py-10 px-6 rounded-[50px] shadow-xl max-w-sm border border-gray-200">
        <div className="flex justify-end items-center mb-4">
          <MdClose
            className="text-xl cursor-pointer text-gray-600"
            onClick={onClose}
          />
        </div>
        <h3 className="text-lg font-semibold my-3 text-gray-900">Status</h3>
        <div className="flex items-center bg-orange-100 border-[#D59E61] border-2 px-3 py-1.5 rounded-lg">
          <PiWarningCircleFill size={27} color="#D59E61" className="mr-2" />
          <p className="text-xs text-gray-700">
            This product does not meet qualifying criteria
          </p>
        </div>
        <div className="border border-gray-300 p-4 mt-4 rounded-lg">
          <div className="border-b border-gray-200 pb-2 mb-2">
            <h4 className="font-semibold text-base text-gray-900 capitalize">
              {product.status}
            </h4>
            <span className="text-[11px]">{product.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="flex flex-col gap-1.5">
              <div className="border border-gray-300 p-2 rounded-md text-[#000]">
                Product Name
                <br />
                <span className="text-[#717171] font-medium">
                  {" "}
                  {product.title}
                </span>
              </div>
              <div className="border border-gray-300 p-2 rounded-md text-[#000]">
                Price
                <br />
                <span className="text-green-600 font-medium">
                  &#x20B9;{product.price}
                </span>
              </div>
            </div>

            <div className="border border-gray-300 p-2 rounded-md text-[#000]">
              Description
              <br />
              <span className="text-[#717171] font-medium">
                {product.dimensions}
                <br />
                {product.details}
              </span>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 p-4 mt-4 rounded-lg">
          <div className="border-b border-gray-200 pb-2 mb-2">
            <h4 className="font-semibold text-base text-gray-900">Reason</h4>
          </div>
          <p className="text-sm text-gray-700">{product.reject_reason}</p>
        </div>
      </div>
    </div>
  );
}

export default RejectedProduct;
