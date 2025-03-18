import { useNavigate } from "react-router-dom";

function TokenExpired() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen font-Poppins">
      <div className="max-w-xl inset-0">
        <div className="">
          <img src="/images/tokenexpired.png" alt="session timeout" />
        </div>
        <h4 className="font-bold text-[#00898B] text-3xl text-center mb-3">
          Token Expired
        </h4>
        <p className="text-[#8D8D8D] text-lg text-center ">
          You are being timed-out due to inactivity. Please choose to stay
          <br /> signed in or to logoff. Otherwise, you will log off
          automatically.
        </p>
        <div className="flex justify-center items-center">
          {" "}
          {/* <button
            // onClick={() => navigate("/login")}
            className="px-7 py-3 text-[#fff] bg-[#00898B] "
          >
            Try Again
          </button>
          <p className="text-[#8D8D8D] text-lg uppercase ">or</p> */}
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 text-[#fff] bg-[#00898B] "
          >
            login
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenExpired;
