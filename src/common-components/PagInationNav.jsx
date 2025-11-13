import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

function PagInationNav({ totalPages, handlePageChange, currentPage }) {
  return (
    <div>
      {totalPages > 1 && (
        <div className=" flex justify-center items-center mt-2 gap-2 border px-7 py-1 rounded place-self-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 disabled:opacity-50 flex items-center gap-0.5 text-[#334A78]"
          >
            <MdKeyboardArrowLeft /> Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-sm  ${
                currentPage === index + 1
                  ? "bg-[#334A78] text-white"
                  : "text-[#334A78]"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 disabled:opacity-50 flex items-center gap-0.5 text-[#334A78]"
          >
            Next <MdKeyboardArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}

export default PagInationNav;
