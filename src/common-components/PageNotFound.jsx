import { useNavigate } from "react-router-dom";
import { useLogout } from "../utils/HelperFunction";
function PageNotFound() {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="font-Poppins flex flex-col items-center gap-3">
        <img
          src="/images/page-not-found.png"
          alt="not found of an small office setup"
          className="max-w-xs"
        />
        <h1 className="font-bold  text-[120px] text-[#374A75]">404</h1>
        <p className="text-[#8D8D8D] ">
          Opps! Looks like something went wrong
          <br />
          We’re working on it.
        </p>
        <button
          onClick={() => {
            navigate("/");
            logout();
          }}
          className="bg-[#374A75] text-[#fff] px-3 py-2 rounded-sm"
        >
          Go To Home
        </button>
      </div>
    </div>
  );
}

export default PageNotFound;
