import { useState, useRef, useEffect } from "react";
import { baseImageUrl } from "../../utils/HelperConstant";
import { HiDotsVertical } from "react-icons/hi";
import { PiEyeLight, PiPencilSimpleLight } from "react-icons/pi";

function ItemList({
  handleProductPreview,
  items,
  handleProductEdit,
  handleAddonEdit,
  isExpanded,
}) {
  // testing items
  //   const items = Array.from({ length: 55 }, (_, index) => ({
  //     id: index + 1,
  //     name: `Item ${index + 1}`,
  //   }));

  // pagination

  const itemsPerPage = 20;
  //   const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const scrollContainerRef = useRef(null);

  // Slice the items for pagination
  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <>
      <div
        ref={scrollContainerRef}
        className={`grid grid-cols-2  gap-4 p-2 
      h-5/6  overflow-y-auto ${
        isExpanded
          ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          : "md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4"
      }`}
      >
        {paginatedItems?.length > 0 &&
          paginatedItems?.map((item) => (
            <ItemCard
              handleProductPreview={handleProductPreview}
              handleAddonEdit={handleAddonEdit}
              handleProductEdit={handleProductEdit}
              item={item}
              key={item?.id}
            />
          ))}
        {/* {Array.from({ length: paginatedItems?.length }, (_, i) => (
          <ItemCard key={i} />
        ))} */}
      </div>
      <div className="p-2 ">
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2  z-30 sticky bottom-0  bg-white  text-[#3d194f]">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1) ? (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center  ${
                    currentPage === page
                      ? "bg-[#aca9d3] text-white rounded-full "
                      : "rounded-md text-[#3d194f]"
                  }`}
                >
                  {page}
                </button>
              ) : page === currentPage + 2 || page === currentPage - 2 ? (
                <span key={page} className="px-2">
                  ...
                </span>
              ) : null
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 text-[#3d194f]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ItemList;

function ItemCard({
  handleProductPreview,
  item,
  handleProductEdit,
  handleAddonEdit,
}) {
  const [isoptionOpen, setIsoptionOpen] = useState(false);
  const optionboxref = useRef(null);

  // Detect outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        optionboxref.current &&
        !optionboxref.current.contains(event.target)
      ) {
        setIsoptionOpen(false);
      }
    }

    if (isoptionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isoptionOpen]);

  return (
    <div>
      {/* <div onClick={() => handleProductPreview(item)} className="cursor-pointer"> */}
      <div className="relative max-w-xs md:w-44 md:h-44 flex justify-center items-center rounded-2xl shadow-sm border border-[#ccc] ">
        <img
          src={`${baseImageUrl}/${item?.image}`}
          alt="chair"
          className="w-28 h-36 md:w-40 md:h-40 p-2"
        />
        <div className="absolute right-0 bottom-2 text-xl" ref={optionboxref}>
          {isoptionOpen ? (
            <button onClick={() => setIsoptionOpen((prev) => !prev)}>
              <OptionBox
                handleAddonEdit={handleAddonEdit}
                handleProductEdit={handleProductEdit}
                handleProductPreview={handleProductPreview}
                item={item}
              />
            </button>
          ) : (
            <button onClick={() => setIsoptionOpen((prev) => !prev)}>
              <HiDotsVertical />
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-[#444444] font-bold">
        {item?.title || "NA"}
      </p>
    </div>
  );
}

function OptionBox({
  handleAddonEdit,
  handleProductEdit,
  handleProductPreview,
  item,
}) {
  const isItemProduct = item?.type === "product";

  return (
    <div className="bg-[#F9f9f9] rounded-lg p-2 w-[110px] shadow-md">
      {/* View Button */}
      <button
        onClick={() => handleProductPreview(item)}
        className="w-full text-xs  flex items-center justify-center gap-2 bg-[#334A78] text-white rounded-md py-2 hover:bg-[#2c3e67]"
      >
        <PiEyeLight size={16} />
        View
      </button>

      {/* Edit Button */}
      <button
        onClick={() =>
          isItemProduct ? handleProductEdit(item) : handleAddonEdit(item)
        }
        className="w-full text-xs flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 mt-2 hover:bg-gray-100"
      >
        <PiPencilSimpleLight size={16} />
        Edit
      </button>
    </div>
  );
}
