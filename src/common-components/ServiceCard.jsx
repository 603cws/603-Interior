import { useState } from "react";

export const ServiceCard = ({ title, description, image, hoveredImage }) => {
  const [ishovered, setIshovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIshovered(true)}
      onMouseLeave={() => setIshovered(false)}
      className={`relative font-Georgia group border-2 border-black border-opacity-20 p-6 hover:shadow-md transition hover:bg-gradient-to-br from-[#334A78] to-[#68B2DC]`}
    >
      <span
        className={`w-2 h-2 absolute top-0 ${
          ishovered
            ? "right-0 translate-x-full -translate-y-full border-l-2 border-b-2"
            : "left-0 -translate-x-full -translate-y-full border-b-2 border-r-2"
        }  border-black border-opacity-20 transition-all duration-300 ease-in-out`}
      />
      <span
        className={`w-2 h-2 absolute bottom-0 ${
          ishovered
            ? "left-0 -translate-x-full translate-y-full border-r-2 border-t-2"
            : "right-0 translate-x-full translate-y-full border-l-2 border-t-2"
        }  border-black border-opacity-20 transition-all duration-300 ease-in-out`}
      />

      {/* Content */}
      <div className="relative z-10 cursor-pointer">
        <div className="mb-4 relative w-10 h-10">
          {/* Default image */}
          <img
            src={image}
            alt={title}
            className={`absolute top-0 left-0 w-10 h-10 rounded transition-opacity duration-500 ease-in-out ${
              ishovered ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Hovered image */}
          <img
            src={hoveredImage}
            alt={title}
            className={`absolute top-0 left-0 w-10 h-10 rounded transition-opacity duration-500 ease-in-out ${
              ishovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <h4 className="font-bold italic text-base text-black group-hover:text-[#fff] mb-2 transition-all duration-500 ease-in-out">
          {title}
        </h4>
        <p className="text-sm text-black group-hover:text-[#fff] text-opacity-65 transition-all duration-500 ease-in-out">
          {description}
        </p>
      </div>
    </div>
  );
};

// export default ServiceCard;
