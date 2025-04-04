function MobileTestimonal({ message, name, companyname, userprofile }) {
  return (
    <div className="max-w-sm  rounded-3xl bg-[#1f5c54]  flex-col justify-start items-center gap-[18px] inline-flex relative z-10">
      <div className=" flex items-center justify-center px-2">
        <p className="mt-10 text-justify text-white text-sm ">{message}</p>
      </div>
      <div>
        <img
          className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
          src={`/images/${userprofile}.png`}
          alt="testimonal person "
        />
      </div>
      <div className="  text-center text-white text-sm font-bold  uppercase leading-[29.60px] tracking-[3.52px]">
        {name}
      </div>
      <div className="mb-3 text-center text-[#33bead] text-sm font-bold  uppercase leading-[29.60px] tracking-[3.52px]">
        {companyname}
      </div>
    </div>
  );
}

export default MobileTestimonal;
