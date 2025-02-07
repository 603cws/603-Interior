import { RiDashboardFill } from "react-icons/ri";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthRefresh from "../../Context/useAuthRefresh";

function ProfileCard() {
  const { setIsAuthenticated } = useApp();
  const background = "images/profilebg.png";

  const navigate = useNavigate();
  const { signOutUser } = useAuthRefresh(); // Get signOutUser from hook

  // const handleLogout = async () => {

  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.error("Error signing out:", error.message);
  //   } else {
  //     console.log("User signed out successfully");
  //     toast.success("User signed out successfully");
  //     setIsAuthenticated(false);
  //     localStorage.removeItem("usertoken");
  //     navigate("/login");
  //   }
  // };

  // const handleLogout = async () => {
  //   setIsAuthenticated(false);
  //   localStorage.removeItem("usertoken");
  //   toast.success("User signed out successfully");
  //   navigate("/login");
  // };

  return (
    <div>
      {/* div for card */}
      <div className="rounded-bl-[60px] rounded-tl-[60px]  shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]  overflow-hidden max-w-sm w-full h-[calc(100vh-50px)] font-Poppins bg-[#fff] z-20 absolute right-0 top-[50px] transition-transform duration-1000 ease-in-out ">
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
            <button onClick={signOutUser}>sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
