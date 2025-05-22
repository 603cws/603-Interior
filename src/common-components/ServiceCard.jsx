export const ServiceCard = ({ title, description, image }) => {
  return (
    <div className="relative group border border-black border-opacity-40 p-6 hover:shadow-md transition">
      {/* Corner decorations */}
      <span className="absolute top-0 -left-2 w-2 h-px bg-black opacity-40"></span>
      <span className="absolute -top-2 left-0 h-2 w-px bg-black opacity-40"></span>
      <span className="absolute bottom-0 -right-2 w-2 h-px bg-black opacity-40"></span>
      <span className="absolute -bottom-2 right-0 h-2 w-px bg-black opacity-40"></span>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4">
          <img src={image} className="w-10 h-10 rounded" />
        </div>
        <h4 className="font-semibold text-base text-black mb-2 font-lora">
          {title}
        </h4>
        <p className="text-sm text-black text-opacity-65 font-Poppins">
          {description}
        </p>
      </div>
    </div>
  );
};

// export default ServiceCard;
