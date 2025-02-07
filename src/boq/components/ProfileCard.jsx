import { RiDashboardFill } from "react-icons/ri";

function ProfileCard() {
  const background = "images/profilebg.png";
  return (
    <div>
      {/* div for card */}
      <div className="rounded-bl-[60px] rounded-tl-[60px]  shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]  overflow-hidden max-w-sm h-[100vh] font-Poppins bg-[#fff]">
        {/* <div className="rounded-bl-[60px] rounded-tl-[60px]   overflow-hidden max-w-sm h-[100vh] font-Poppins"> */}
        {/* div for profile icon part */}
        <div className=" h-1/3 flex flex-col">
          <div
            className=" h-1/2 flex justify-center items-end"
            // style={{
            //   backgroundImage: `url(${background})`,
            // }}
          >
            <img
              src="/images/usericon.png"
              alt="usericon"
              className="w-16 h-16"
            />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center ">
            <p className="font-semibold text-lg">uername</p>
            <p className="font-sm">example@gmail.com</p>
          </div>
        </div>

        {/* seconf box for the features */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] border-y-2 border-[#ccc] flex flex-col gap-4">
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <p>dashboard</p>
          </div>
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <p>layout</p>
          </div>
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <p>How it works</p>
          </div>
        </div>
        {/* third box for the features */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] border-b-2 border-[#ccc] flex flex-col gap-4">
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <p>help</p>
          </div>
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <p>settings</p>
          </div>
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <p>sign out</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
