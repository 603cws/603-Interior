function ProductCard({ seatingtype, chainame }) {
  return (
    <div className="">
      <div className="flex flex-col max-w-max">
        <div>
          <img
            src="images/table.jpg"
            width={350}
            height={350}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <p className="pl-3 text-sm uppercase text-[#AEAEAE]">
              {/* Board Room seating */}
              {seatingtype}
            </p>
          </div>
          <div>
            <p className="pl-3 text-sm uppercase font-medium text-[#111111]">
              {/* Aspire High Black chair */}
              {chainame}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
