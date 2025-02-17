import { RiDashboardFill } from "react-icons/ri";
import { supabase } from "../../services/supabase";
import { useApp } from "../../Context/Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
// import useAuthRefresh from "../../Context/useAuthRefresh";

function ProfileCard() {
  const { setIsAuthenticated, accountHolder, setAccountHolder, setTotalArea } =
    useApp();
  const profileRef = useRef(null);

  //   const background = "images/profilebg.png";
  //   const [userEmail, setUserEmail] = useState("");
  //   const [companyName, setCompanyName] = useState("");

  let isadmin = accountHolder.role === "admin" ? true : false;
  const navigate = useNavigate();

  //   const { signOutUser } = useAuthRefresh(); // Get signOutUser from hook

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("User signed out successfully");
      toast.success("User signed out successfully");
      setIsAuthenticated(false);
      isadmin = false;
      setAccountHolder({
        companyName: "",
        email: "",
        phone: "",
        role: "",
        userId: "",
      });
      console.log("hello");
      setTotalArea("");
      localStorage.removeItem("currentLayoutID");
      navigate("/");
    }
  };
  //   const handleLogout = async () => {
  //     try {
  //       await supabase.auth.signOut();
  //       console.log("User signed out successfully");
  //       toast.success("User signed out successfully");

  //       setIsAuthenticated(false);
  //       localStorage.removeItem("usertoken");
  //       console.log("hello");
  //       navigate("/");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  // const handleLogout = async () => {
  //   setIsAuthenticated(false);
  //   localStorage.removeItem("usertoken");
  //   toast.success("User signed out successfully");
  //   navigate("/login");
  // };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     // Retrieve the currently authenticated user
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();

  //     if (user) {
  //       // Set the user's email
  //       setUserEmail(user.email);

  //       // Query the profiles table for the company name using the user's id
  //       const { data, error } = await supabase
  //         .from("profiles")
  //         .select("company_name")
  //         .eq("id", user.id)
  //         .single();

  //       if (error) {
  //         console.error("Error fetching profile:", error.message);
  //       } else if (data) {
  //         setCompanyName(data.company_name);
  //       }
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  return (
    <div ref={profileRef}>
      {/* div for card */}
      <div className="rounded-bl-[60px] rounded-tl-[60px]  shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]  overflow-hidden max-w-sm w-full h-[calc(100vh-50px)] font-Poppins bg-[#fff] z-20 absolute right-0 top-[50px] transition-transform duration-1000 ease-in-out ">
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
            <p className="font-semibold text-lg">
              {" "}
              {accountHolder.companyName}
            </p>
            <p className="font-sm">{accountHolder.email}</p>{" "}
          </div>
        </div>

        {/* seconf box for the features */}
        <div className="font-semibold text-lg capitalize leading-normal tracking-wide py-7 text-[#262626] border-y-2 border-[#ccc] flex flex-col gap-4">
          <div className="flex items-center mx-4 gap-3">
            <RiDashboardFill />
            <button onClick={() => navigate("/dashboard")} disabled={!isadmin}>
              dashboard
            </button>
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
            <button onClick={handleLogout}>sign out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
