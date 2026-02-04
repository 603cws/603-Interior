import { IoIosArrowBack } from "react-icons/io";

const BackButton = ({
  label = "Back",
  onClick,
  className = "",
  showUnderline = true,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group
        capitalize
        font-semibold
        flex items-center gap-1
        text-xs
        text-[#A1A1A1]
        transition-all duration-200 ease-out
        hover:text-[#334A78]
        ${className}
      `}
    >
      <IoIosArrowBack className="transition-transform duration-200 group-hover:-translate-x-1" />

      <span className="relative">
        {label}
        {showUnderline && (
          <span
            className="
              absolute left-0 -bottom-[2px]
              w-0 h-[1px]
              bg-[#334A78]
              transition-all duration-200
              group-hover:w-full
            "
          />
        )}
      </span>
    </button>
  );
};

export default BackButton;
