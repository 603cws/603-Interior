function FilterButton({
  children,
  iconSrc,
  altText,
  className = "",
  ...props
}) {
  return (
    <button
      className={`border flex border-gray-300 bg-[#374A75] text-white gap-2 text-sm px-3 py-1 rounded-lg ${className}`}
      {...props}
    >
      {children}
      {iconSrc && (
        <img src={iconSrc} alt={altText || "icon"} className="w-5 h-5" />
      )}
    </button>
  );
}

export default FilterButton;
