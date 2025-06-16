export function ReadMoreBtn({ borderColor = "#000000", onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        className="capitalize border-2 px-4 py-1.5 relative group"
        style={{ borderColor }}
      >
        <span
          className="w-2 h-2 absolute top-0 left-0 -translate-x-full -translate-y-full border-b-2 border-r-2"
          style={{ borderColor }}
        ></span>
        <span
          className="w-2 h-2 absolute bottom-0 right-0 translate-x-full translate-y-full border-l-2 border-t-2 "
          style={{ borderColor }}
        ></span>
        read more
      </button>
    </div>
  );
}
export function PlaceOrderBtn({ title, disabled }) {
  return (
    <div>
      <button
        disabled={disabled}
        className="bg-[#334A78] border border-[#212B36] text-sm text-white tracking-wider w-full uppercase py-3 active:scale-90 transition-transform ease-in-out duration-500 disabled:opacity-75"
      >
        {title}
      </button>
    </div>
  );
}
