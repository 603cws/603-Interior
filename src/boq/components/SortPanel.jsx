import { MdKeyboardArrowLeft } from "react-icons/md";

export const options = [
  { option: "Newest Arrival", value: "newest" },
  { option: "Price: Low to High", value: "low" },
  { option: "Price: High to Low", value: "high" },
];
function SortPanel({
  setIsMobileSortOpen,
  setIsSortOpen,
  sortOption,
  setSortOption,
}) {
  return (
    <>
      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border border-black z-20 text-sm hidden lg:block">
        {options.map(({ option, value }) => {
          const active = sortOption === value;
          return (
            <button
              key={value}
              onClick={() => {
                setSortOption(value);
                setIsSortOpen(false);
              }}
              className={
                "w-full text-left px-3 py-2 border-b last:border-b-0 " +
                (active ? "bg-[#374A75] text-white font-semibold" : "")
              }
            >
              {option}
            </button>
          );
        })}
      </div>
      <div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={() => setIsMobileSortOpen(false)}
      >
        <div
          className={`fixed bottom-0 left-0 w-full z-50 bg-white border transition-transform ease-in-out duration-500 transform animate-fade-in flex flex-col justify-center`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border-b border-b-[#ccc]">
            <button onClick={() => setIsMobileSortOpen(false)}>
              <MdKeyboardArrowLeft size={30} color="#304778" />
            </button>
            <h2 className="uppercase text-[#304778] text-sm leading-[22.4px]">
              Sort By
            </h2>
          </div>

          <div className="space-y-4 p-2">
            {options.map((opt) => {
              const active = sortOption === opt.value;
              return (
                <label
                  key={opt.value}
                  className="flex items-center justify-between space-x-3 cursor-pointer"
                  onClick={() => {
                    setSortOption(opt.value);
                  }}
                >
                  <span className="text-sm text-[#000000] font-medium">
                    {opt.option}
                  </span>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      active
                        ? "bg-[#2A3E65] border-[#2A3E65]"
                        : "border-[#2A3E65]"
                    }`}
                  ></div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default SortPanel;
