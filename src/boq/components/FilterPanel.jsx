import { FaStar } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoMdSettings } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { PiStarFourFill } from "react-icons/pi";
import { RiVipCrown2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.35,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.2,
        delay: 0.05,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.25,
        ease: "easeInOut",
      },
      opacity: {
        duration: 0.15,
      },
    },
  },
};

function FilterPanel({
  toggleSection,
  openSection,
  selectedPlanFilter,
  setSelectedPlanFilter,
  brandsList,
  selectedBrands,
  setSelectedBrands,
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  paginatedVariants,
  priceRange,
  setPriceRange,
}) {
  const planOptions = ["Minimal", "Exclusive", "Luxury", "Custom"];

  return (
    <>
      <div className="absolute mt-2 w-36 bg-white shadow-lg z-20 hidden lg:block">
        <div className="border-x border-t">
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-sm"
            onClick={() => toggleSection("plan")}
          >
            <span className="font-semibold text-[#334A78]">Plan</span>
            <span className="text-sm">
              {openSection === "plan" ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>{" "}
          </button>

          <AnimatePresence initial={false}>
            {openSection === "plan" && (
              <motion.div
                variants={accordionVariants}
                initial="collapsed"
                animate="open"
                exit="exit"
                className="overflow-hidden border-t border-black"
              >
                {planOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedPlanFilter(option)}
                    className={
                      "flex items-center justify-between w-full px-4 py-3 border-b border-black text-sm " +
                      (selectedPlanFilter === option
                        ? "bg-[#374A75] text-white font-semibold"
                        : "bg-white text-black")
                    }
                  >
                    <span className="flex items-center">
                      {option === "Exclusive" && (
                        <div className="relative">
                          <PiStarFourFill
                            className="absolute -top-1 -right-1"
                            size={8}
                            color={
                              selectedPlanFilter === option ? "#fff" : "#334A78"
                            }
                          />
                          <PiStarFourFill
                            size={16}
                            color={
                              selectedPlanFilter === option ? "#fff" : "#334A78"
                            }
                          />
                        </div>
                      )}
                      {option === "Luxury" && (
                        <RiVipCrown2Fill
                          size={16}
                          color={
                            selectedPlanFilter === option ? "#fff" : "#334A78"
                          }
                        />
                      )}
                      {option === "Minimal" && (
                        <FaStar
                          size={16}
                          color={
                            selectedPlanFilter === option ? "#fff" : "#334A78"
                          }
                        />
                      )}
                      {option === "Custom" && (
                        <IoMdSettings
                          size={18}
                          color={
                            selectedPlanFilter === option ? "#fff" : "#334A78"
                          }
                        />
                      )}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border">
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-sm"
            onClick={() => toggleSection("brand")}
          >
            <span className="font-semibold text-[#334A78]">Brand</span>
            <span className="text-sm">
              {openSection === "brand" ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>{" "}
          </button>

          <AnimatePresence initial={false}>
            {openSection === "brand" && (
              <motion.div
                variants={accordionVariants}
                initial="collapsed"
                animate="open"
                exit="exit"
                className="overflow-hidden border-t border-black"
                // className=" px-4 py-3 space-y-2 text-sm"
              >
                <div className="px-4 py-3 space-y-2 text-sm bg-white">
                  {brandsList.map((brand) => {
                    const checked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 border border-black"
                          checked={checked}
                          onChange={() => {
                            setSelectedBrands((prev) =>
                              checked
                                ? prev.filter((b) => b !== brand)
                                : [...prev, brand],
                            );
                          }}
                        />
                        <span className="flex-1">{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border">
          <button
            className="flex w-full items-center justify-between px-4 py-3 text-sm"
            onClick={() => toggleSection("price")}
          >
            <span className="font-semibold text-[#334A78]">Price</span>
            <span className="text-sm">
              {openSection === "price" ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {openSection === "price" && (
              <motion.div
                variants={accordionVariants}
                initial="collapsed"
                animate="open"
                exit="exit"
                className="overflow-hidden border-t border-black bg-white"
              >
                <div className="px-4 py-4 space-y-4 text-sm">
                  {/* Range display */}
                  <div className="flex justify-between text-xs font-semibold text-[#334A78]">
                    <span>₹ {priceRange[0].toLocaleString()}</span>
                    <span>₹ {priceRange[1].toLocaleString()}</span>
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    min={500}
                    max={100000}
                    step={500}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full accent-[#334A78] cursor-pointer"
                  />

                  {/* Presets */}
                  <div className="flex flex-wrap gap-2">
                    {[25000, 50000, 75000, 100000].map((value) => (
                      <button
                        key={value}
                        onClick={() => setPriceRange([0, value])}
                        className={`px-3 py-1 border text-xs font-semibold ${
                          priceRange[1] === value
                            ? "bg-[#334A78] text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        Up to ₹{value / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={() => setIsMobileFilterOpen(false)}
      >
        <div
          className={`fixed bottom-0 left-0 w-full z-50 bg-white border transition-transform ease-in-out duration-500 transform animate-fade-in flex flex-col justify-between ${
            isMobileFilterOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center border-b border-b-[#ccc] px-3 py-2">
            <button onClick={() => setIsMobileFilterOpen(false)}>
              <MdKeyboardArrowLeft size={30} color="#304778" />
            </button>
            <h2 className="ml-2 uppercase text-[#304778] text-sm leading-[22.4px]">
              Filter
            </h2>
          </div>

          {/* Body */}
          <div className="p-3 space-y-5 font-TimesNewRoman text-sm overflow-y-auto max-h-[60vh]">
            <div className="border border-[#ccc] rounded">
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase text-[#334A78]"
                onClick={() => toggleSection("plan")}
              >
                <span>Plan</span>
                <span className="text-xs">
                  {openSection === "plan" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </button>

              {openSection === "plan" && (
                <div className="border-t border-[#ccc]">
                  {planOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedPlanFilter(option)}
                      className={
                        "flex items-center justify-between w-full px-4 py-2 border-b last:border-b-0 border-[#ccc] text-xs " +
                        (selectedPlanFilter === option
                          ? "bg-[#374A75] text-white font-semibold"
                          : "bg-white text-black")
                      }
                    >
                      <span className="flex items-center">
                        {option === "Exclusive" && (
                          <div className="relative">
                            <PiStarFourFill
                              className="absolute -top-1 -right-1"
                              size={8}
                              color={
                                selectedPlanFilter === option
                                  ? "#fff"
                                  : "#334A78"
                              }
                            />
                            <PiStarFourFill
                              size={16}
                              color={
                                selectedPlanFilter === option
                                  ? "#fff"
                                  : "#334A78"
                              }
                            />
                          </div>
                        )}
                        {option === "Luxury" && (
                          <RiVipCrown2Fill
                            size={16}
                            color={
                              selectedPlanFilter === option ? "#fff" : "#334A78"
                            }
                          />
                        )}
                        {option === "Minimal" && (
                          <FaStar
                            size={16}
                            color={
                              selectedPlanFilter === option ? "#fff" : "#334A78"
                            }
                          />
                        )}
                        {option === "Custom" && (
                          <IoMdSettings
                            size={18}
                            color={
                              selectedPlanFilter === option ? "#fff" : "#334A78"
                            }
                          />
                        )}
                      </span>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#ccc] rounded">
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase text-[#334A78]"
                onClick={() => toggleSection("brand")}
              >
                <span>Brand</span>
                <span className="text-xs">
                  {openSection === "brand" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </button>

              {openSection === "brand" && (
                <div className="border-t border-[#ccc] px-4 py-3 space-y-3 text-xs">
                  {brandsList.map((brand) => {
                    const checked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-[#000000]">{brand}</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 border border-black"
                          checked={checked}
                          onChange={() => {
                            setSelectedBrands((prev) => {
                              const current = Array.isArray(prev) ? prev : [];
                              return current.includes(brand)
                                ? current.filter((b) => b !== brand)
                                : [...current, brand];
                            });
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border border-[#ccc] rounded">
              <button
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase text-[#334A78]"
                onClick={() => toggleSection("price")}
              >
                <span>Price</span>
                <span className="text-xs">
                  {openSection === "price" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </button>

              {openSection === "price" && (
                <div className="border-t border-[#ccc] px-4 py-4 space-y-4 text-xs">
                  {/* Range display */}
                  <div className="flex justify-between font-semibold text-[#334A78]">
                    <span>₹ {priceRange[0].toLocaleString()}</span>
                    <span>₹ {priceRange[1].toLocaleString()}</span>
                  </div>

                  {/* Slider */}
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full accent-[#334A78]"
                  />

                  {/* Presets */}
                  <div className="flex flex-wrap gap-2">
                    {[25000, 50000, 75000, 100000].map((value) => (
                      <button
                        key={value}
                        onClick={() => setPriceRange([0, value])}
                        className={`px-3 py-1 border text-[11px] font-semibold ${
                          priceRange[1] === value
                            ? "bg-[#334A78] text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        Up to ₹{value / 1000}k
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center px-4 py-3 border-t border-[#eee] font-TimesNewRoman text-xs">
            <div>
              <h2 className="text-[#000] font-semibold text-base tracking-[1px]">
                {paginatedVariants?.length}
              </h2>
              <p className="text-[#ccc] text-[11px] leading-4 -tracking-[0.5px] font-semibold">
                product found
              </p>
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="px-4 py-[8px] bg-[#334A78] text-white border border-[#212B36] font-semibold text-xs tracking-[1px]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterPanel;
