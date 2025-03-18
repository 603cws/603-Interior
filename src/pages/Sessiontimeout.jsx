import { useNavigate } from "react-router-dom";

function Sessiontimeout() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen font-Poppins">
      <div className="max-w-xl inset-0">
        <div className="">
          <img src="/images/Card.png" alt="session timeout" />
        </div>
        <h4 className="font-bold text-[#00898B] text-3xl text-center mb-3">
          Session Expired
        </h4>
        <p className="text-[#8D8D8D] text-lg text-center ">
          Your current session has been expired.
        </p>
        <p className="text-[#8D8D8D] text-lg text-center mb-3">
          Please click on the button below to log in again.
        </p>
        <div className="flex justify-center items-center">
          {" "}
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 text-[#fff] bg-[#00898B] "
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sessiontimeout;
