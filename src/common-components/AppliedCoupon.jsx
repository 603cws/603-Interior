function AppliedCoupon({ code, savedamount, handleRemove }) {
  return (
    <div className="border border-[#34BFAD] rounded-md px-2 lg:px-4 py-2 flex items-center justify-between font-Poppins w-full">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="border border-dashed border-[#34BFAD] px-4 py-2 rounded-md bg-[#00864B]/10">
          <span className="text-black font-semibold">{code}</span>
        </div>
        <span className="text-[#34BFAD] font-medium">
          Saved ₹{savedamount.toFixed(2) || 0}
        </span>
      </div>
      <button
        onClick={handleRemove}
        className="text-[#F87171] font-medium hover:underline"
      >
        Remove
      </button>
    </div>
  );
}

export default AppliedCoupon;
