function DeliveryEstimate({ product }) {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliverDays);
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = deliveryDate.toLocaleDateString("en-US", options);

  return (
    <div className="flex lg:border-b lg:border-b-[#ccc] p-4 font-Poppins font-medium items-center gap-2">
      <div>
        <img
          src={product.productId.image}
          alt="sample product"
          className="w-16 object-contain"
        />
      </div>
      <p className="text-sm text-[#111]/60 leading-[22.4px]">
        Estimated delivery by{" "}
        <span className="text-[#111]">{formattedDate}</span>
      </p>
    </div>
  );
}

export default DeliveryEstimate;
