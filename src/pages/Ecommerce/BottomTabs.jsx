import { MdOutlineLocalShipping } from "react-icons/md";
function BottomTabs() {
  return (
    <section className=" w-full bg-[#B8CCCC]/50 px-10 py-2  ">
      <div className="font-Poppins flex  justify-around items-center">
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <MdOutlineLocalShipping size={25} />
          </div>
          <button className="font-semibold text-lg text-[#171717]">
            Free shipping
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <MdOutlineLocalShipping size={25} />
          </div>
          <button className="font-semibold text-lg text-[#171717]">
            New styles
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <MdOutlineLocalShipping size={25} />
          </div>
          <button className="font-semibold text-lg text-[#171717]">
            Gift cards
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <MdOutlineLocalShipping size={25} />
          </div>
          <button className="font-semibold text-lg text-[#171717]">
            5.0 Trustpilot rating
          </button>
        </div>
      </div>
    </section>
  );
}

export default BottomTabs;
