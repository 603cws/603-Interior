function OurWorkTestimonal({ testimonal, name, position, image }) {
  return (
    <div className="p-10 border border-[#777777]/20 bg-[#000]/0">
      <div className="space-y-4">
        <p className="font-Poppins text-sm leading-6 ">{testimonal}</p>
        <div className="flex gap-4 items-center">
          <div>
            <img src={`/images/${image}`} alt="testimonal user" />
          </div>
          <div className="flex flex-col justify-center font-lato">
            <h3 className=" font-bold text-[17px] text-[#232323]">{name}</h3>
            <p className="font-lora text-[14px] text-[#777]">{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurWorkTestimonal;
