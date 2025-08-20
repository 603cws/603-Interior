export const ServiceCard = ({ title, description, image }) => {
  return (
    <div
      className={`relative group border-2 border-black border-opacity-20 p-6 hover:shadow-md transition hover:bg-gradient-to-br from-[#334A78] to-[#68B2DC]`}
    >
      <span
        className={`w-2 h-2 absolute top-0 left-0 -translate-x-full -translate-y-full border-b-2 border-r-2 border-black border-opacity-20`}
      />
      <span
        className={`w-2 h-2 absolute bottom-0 right-0 translate-x-full translate-y-full border-l-2 border-t-2 border-black border-opacity-20`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4">
          <img src={image} alt={title} className="w-10 h-10 rounded" />
        </div>
        <h4 className="font-semibold text-base text-black group-hover:text-[#fff] mb-2 font-lora">
          {title}
        </h4>
        <p className="text-sm text-black group-hover:text-[#fff] text-opacity-65 font-Poppins">
          {description}
        </p>
      </div>
    </div>
  );
};

// export default ServiceCard;
