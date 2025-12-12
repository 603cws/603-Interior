import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import CategoryIcons from "../utils/CategoryIcons";
import { CategorySvgMap } from "./CategorySvgMap";

function CategorySvg({ selectedCategory, setSelectedCategory }) {
  const scrollRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setHasOverflow(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  });

  return (
    <>
      {hasOverflow && (
        <div className="absolute right-0 top-0 flex gap-2 z-20">
          <button
            onClick={() => {
              document.querySelector(".cat-scroll")?.scrollBy({
                left: -150,
                behavior: "smooth",
              });
            }}
            className="p-0.5 text-[#374A75] border border-[#ccc]"
          >
            <MdKeyboardArrowLeft size={20} />
          </button>
          <button
            onClick={() => {
              document.querySelector(".cat-scroll")?.scrollBy({
                left: 150,
                behavior: "smooth",
              });
            }}
            className="p-0.5 text-[#374A75] border border-[#ccc]"
          >
            <MdKeyboardArrowRight size={20} />
          </button>
        </div>
      )}
      <div
        ref={scrollRef}
        className="flex cat-scroll overflow-x-auto scrollbar-hide items-center justify-around gap-6 lg:px-10"
      >
        {Object.keys(CategorySvgMap)
          .slice(0, 7)
          .map((catName) => (
            <div
              key={catName}
              className="flex flex-col lg:justify-center lg:items-center gap-3 cursor-pointer group"
              onClick={() => setSelectedCategory(catName)}
            >
              <div
                className={`border border-[#ccc] p-4 w-16 h-16 xl:w-20 xl:h-20 flex items-center justify-center rounded-full ${
                  selectedCategory === catName
                    ? "bg-gradient-to-r from-[#334A78] to-[#68B2DC]"
                    : ""
                }`}
              >
                {/* default resolver will handle string selectedCategory */}
                <CategoryIcons
                  category={catName}
                  selectedCategory={selectedCategory}
                  className="h-12 w-12"
                />
              </div>

              <h3 className="font-TimesNewRoman text-[#111] text-[10px] text-center lg:text-sm">
                {catName}
              </h3>
            </div>
          ))}
      </div>
    </>
  );
}

export default CategorySvg;
