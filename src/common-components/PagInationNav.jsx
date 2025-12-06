import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

function PagInationNav({ totalPages, currentPage, handlePageChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center py-2 px-4 space-x-1 sticky bottom-0 bg-white">
      <div className="flex border border-[#CCCCCC] rounded-lg px-3 py-2">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed text-[#194F48]"
        >
          <MdKeyboardArrowLeft />
          <span className="hidden sm:block">Previous</span>
        </button>

        {/* Page Numbers */}
        {(() => {
          const pages = [];
          const start = Math.max(2, currentPage - 1);
          const end = Math.min(totalPages - 1, currentPage + 1);

          // page 1
          pages.push(
            <button
              key={1}
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === 1
                  ? "text-white bg-[#334A78]"
                  : "hover:bg-[#F1F1F1]"
              }`}
            >
              1
            </button>
          );

          // first ellipsis
          if (start > 2) pages.push(<span key="dots1">...</span>);

          // middle pages
          for (let i = start; i <= end; i++) {
            pages.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i
                    ? "text-white bg-[#334A78]"
                    : "hover:bg-[#F1F1F1]"
                }`}
              >
                {i}
              </button>
            );
          }

          // second ellipsis
          if (end < totalPages - 1) pages.push(<span key="dots2">...</span>);

          // last page
          if (totalPages > 1) {
            pages.push(
              <button
                key={totalPages}
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages
                    ? "text-white bg-[#334A78]"
                    : "hover:bg-[#F1F1F1]"
                }`}
              >
                {totalPages}
              </button>
            );
          }

          return pages;
        })()}

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed text-[#194F48]"
        >
          <span className="hidden sm:block">Next</span>
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
}

export default PagInationNav;
