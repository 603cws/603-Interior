import { useState } from "react";
import CompareProducts from "./CompareProducts";
import { useEcomApp } from "../../Context/EcomContext";
import { MdOutlineCancel } from "react-icons/md";

function ComparePreview() {
  const [showCompare, setShowCompare] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { compare, setCompare } = useEcomApp();
  const handleRemoveCompare = (id) => {
    setCompare((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCompareClear = () => {
    setCompare([]);
    setShowPreview(false);
  };

  return (
    <>
      {compare?.length > 0 && (
        <div className="hidden lg:block fixed bottom-20 right-5 z-50">
          <div
            className="relative"
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => setShowPreview(false)}
          >
            <button
              onClick={() => setShowCompare(true)}
              className="px-3 py-1 bg-[#304778] border border-[#212B36] text-white uppercase animate-blink rounded"
            >
              compare{" "}
              <span className="text-white bg-[#627BB1] rounded-full px-2">
                {compare?.length}
              </span>
            </button>

            {showPreview && !showCompare && (
              <div className="absolute transform transition-all ease-in border border-[#ccc] bottom-full mb-2 left-0 -translate-x-[55%] translate-y-[20%] bg-white shadow-lg rounded-lg p-4 w-[350px] h-[300px]">
                <div className="flex  gap-3">
                  {compare?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col border-r border-[#ccc] items-center gap-3"
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-[200px] w-[200px] object-contain"
                        />

                        <button
                          onClick={() => {
                            handleRemoveCompare(item.id);
                          }}
                          className="absolute top-0 right-0"
                        >
                          <MdOutlineCancel color="#666666" size={20} />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-3 my-2">
                  <button
                    onClick={handleCompareClear}
                    className="border border-[#ccc] font-semibold text-sm text-[#212B36] px-3 py-1 uppercase"
                  >
                    remove all
                  </button>
                  <button
                    onClick={() => setShowCompare(true)}
                    className="px-3 py-1 bg-[#304778] border border-[#212B36]  uppercase text-white  rounded"
                  >
                    compare{" "}
                    <span className="text-white bg-[#627BB1] rounded-full px-2">
                      {compare?.length}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* compare window */}
      {showCompare && (
        <CompareProducts
          product={compare}
          onClose={() => setShowCompare(false)}
          onRemove={handleRemoveCompare}
        />
      )}
    </>
  );
}

export default ComparePreview;
