import { useState, useRef } from "react";
import { baseImageUrl } from "../../utils/HelperConstant";

function ItemList({ handleProductPreview, items }) {
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
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 p-2 
      h-5/6  overflow-y-auto"
      >
        {paginatedItems?.map((item) => (
          <ItemCard
            handleProductPreview={handleProductPreview}
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

function ItemCard({ handleProductPreview, item }) {
  // console.log("item", item);
  //   {
  //     "id": "b0b9a4de-3821-473f-b49a-83d6cb8df429",
  //     "created_at": "2025-08-12T04:48:37.460192+00:00",
  //     "title": "test ",
  //     "price": 1600,
  //     "details": "add products for test",
  //     "image": "test -main-7877aadd-ed3f-46df-98c4-45a759064927",
  //     "product_id": "7877aadd-ed3f-46df-98c4-45a759064927",
  //     "additional_images": "[\"test -additional-0-7877aadd-ed3f-46df-98c4-45a759064927\",\"test -additional-1-7877aadd-ed3f-46df-98c4-45a759064927\"]",
  //     "dimensions": "130x140x150",
  //     "manufacturer": "workvedDev",
  //     "segment": "Exclusive",
  //     "default": null,
  //     "product_type": "Tile",
  //     "vendor_id": "f2bb3292-d50b-463e-8b62-9a266e538f4e",
  //     "status": "pending",
  //     "type": "product",
  //     "reject_reason": null,
  //     "products": {
  //         "category": "Flooring",
  //         "subcategory": "Open Workspaces,Cabins,Meeting Rooms,Public Spaces",
  //         "subcategory1": "Tile"
  //     }
  // }

  return (
    <div onClick={() => handleProductPreview(item)} className="cursor-pointer">
      <div className="max-w-xs md:w-44 md:h-44 flex justify-center items-center rounded-2xl shadow-xl border border-[#ccc] ">
        <img
          src={`${baseImageUrl}/${item?.image}`}
          alt="chair"
          className="w-28 h-36 md:w-40 md:h-40"
        />
      </div>
      <p className="text-center text-[#444444] font-bold">
        {item?.title || "NA"}
      </p>
    </div>
  );
}
