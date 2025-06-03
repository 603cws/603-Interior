function ShopProducts() {
  const categoryies = [
    {
      name: "Furniture",
      imagename: "/images/icons/Furniture.png",
    },
    {
      name: "Lighting",
      imagename: "/images/icons/Lighting.png",
    },
    {
      name: "Paint",
      imagename: "/images/icons/Paint.png",
    },
    {
      name: `Civil & Plumbing`,
      imagename: "/images/icons/CivilPlumbing.png",
    },
    {
      name: "Flooring",
      imagename: "/images/icons/Flooring.png",
    },
    {
      name: "Partition",
      imagename: "/images/icons/PartitionsCeilings.png",
    },
    {
      name: "HVAC",
      imagename: "/images/icons/HVAC.png",
    },
    {
      name: "Smart Solution",
      imagename: "/images/icons/SmartSolutions.png",
    },
    {
      name: "Lux",
      imagename: "/images/icons/Lux.png",
    },
  ];
  return (
    <div>
      <section>
        <div className="lg:container lg:mx-auto my-10">
          <SectionHeader title={"Shop "} isborder={false} />
          <div className="flex overflow-x-auto items-center justify-around my-10 gap-6">
            {categoryies.map((cat) => (
              <div
                className="flex flex-col lg:justify-center  lg:items-center gap-3"
                key={cat.name}
              >
                <div className="bg-[#F8F8F8] border border-[#ccc] p-4 w-16 h-16 xl:w-20 xl:h-20">
                  <img src={cat.imagename} alt="category" className="" />
                </div>
                <h3 className="font-lora text-[#111] text-xs lg:text-sm">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShopProducts;

function SectionHeader({ title, isborder = true }) {
  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <h3 className="font-lora text-2xl text-[#111] tracking-wider uppercase mb-2">
        {title}
      </h3>
      {isborder && (
        <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75] "></p>
      )}
    </div>
  );
}
