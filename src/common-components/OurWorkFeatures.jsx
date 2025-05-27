function OurWorkFeatures({
  interiorfeatureslist,
  title,
  description,
  image,
  rowReverse,
}) {
  return (
    <div
      className={`flex ${
        rowReverse
          ? "flex-col-reverse md:flex-row-reverse"
          : "flex-col md:flex-row "
      } items-center gap-4 lg:gap-0`}
    >
      <div className="flex-1">
        <div className="flex  items-center gap-3">
          <div>
            <img src="/images/tick.png" alt="tick" />
          </div>
          <div className="flex flex-col justify-center font-lora">
            <h3 className=" font-bold text-xl">{title}</h3>
            <p className="text-[15px] text-[#777]">{description}</p>
          </div>
        </div>
        <div>
          {" "}
          <ul className="space-y-2 mt-4">
            {interiorfeatureslist.map((feature) => (
              <li className="flex items-start" key={feature.title}>
                <span className="mr-2 mt-1 w-4 h-4 rounded-full border-2 border-blue-800 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-800"></span>
                </span>
                <span className="font-lora text-[15px] text-[#181818]">
                  {feature.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <div>
          <img src={`/images/${image}`} alt="use of interior" />
        </div>
      </div>
    </div>
  );
}

export default OurWorkFeatures;
