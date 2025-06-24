import { MdOutlineLocalShipping } from "react-icons/md";
function BottomTabs() {
  return (
    <section className=" w-full bg-[#B8CCCC]/50 lg:px-10 py-2  ">
      <div className="font-Poppins flex justify-between lg:justify-around items-center">
        <BottomTabComponent
          Icon={MdOutlineLocalShipping}
          title={"Free shipping"}
        />
        <BottomTabComponent
          Icon={MdOutlineLocalShipping}
          title={"New styles"}
        />
        <BottomTabComponent
          Icon={MdOutlineLocalShipping}
          title={"Gift cards"}
        />
        <BottomTabComponent
          Icon={MdOutlineLocalShipping}
          title={"5.0 Trustpilot rating"}
        />
      </div>
    </section>
  );
}

export default BottomTabs;

function BottomTabComponent({ Icon, title }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center">
        <Icon size={25} />
      </div>
      <button className="font-semibold text-[10px] lg:text-lg text-[#171717]">
        {title}
      </button>
    </div>
  );
}
