import { useNavigate } from "react-router-dom";

function Brokenlink() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen font-Poppins">
      <div className="max-w-xl inset-0">
        <div className="">
          <img src="/images/brokenlink.png" alt="session timeout" />
        </div>
        <h4 className="font-bold text-[#00898B] text-3xl text-center mb-3">
          Oh no..a broken link
        </h4>
        <p className="text-[#8D8D8D] text-lg text-center mb-3">
          The page you were looking for seems to have gone missing.
        </p>
        <div className="flex justify-center items-center">
          {" "}
          <button
            onClick={() => navigate("/")}
            className="px-7 py-3 text-[#fff] bg-[#00898B] "
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Brokenlink;
