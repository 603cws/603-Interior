function CheckoutStepper({ highlighted }) {
  return (
    <div className="!my-10 flex items-center justify-center text-[#334A78] text-lg capitalize font-Poppins leading-[16.8px]">
      <div className="flex items-center gap-2">
        <p
          className={`${highlighted === "cart" && "text-[#549DC7] underline"}`}
        >
          cart
        </p>
        <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
        <p
          className={`${
            highlighted === "address" && "text-[#549DC7] underline"
          }`}
        >
          Address
        </p>
        <hr className="border-t-2 border-dashed border-[#334A78] h-1 w-24 " />
        <p
          className={`${
            highlighted === "payment" && "text-[#549DC7] underline"
          }`}
        >
          Payment
        </p>
      </div>
    </div>
  );
}

export default CheckoutStepper;
