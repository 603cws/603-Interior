// import { useNavigate } from "react-router-dom";
// function PageNotFound() {
//   const navigate = useNavigate();
//   return (
//     <div className="flex justify-center items-center  h-screen">
//       <div className="max-w-3xl">
//         <img src="images/404Error.gif" alt="pagenotfound" />
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import { useLogout } from "../utils/HelperFunction";
function PageNotFound() {
  const navigate = useNavigate();
  const logout = useLogout();

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      {/* <img
        src="./images/bg/error-page-bg-wave.png"
        alt=""
        className="w-full object-cover"
      />
      <div className="relative">
        <div className="absolute h-32 w-8 top-0 left-[5%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[3px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-5 w-5 rounded-full bottom-1 bg-[#000]" />
          </div>
          <div className="absolute h-8 w-8 rounded-full left-0 -bottom-4 bg-[#FFD500]" />
        </div>

        <div className="absolute h-20 w-4 top-0 left-[18%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[2px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-2 w-2 rounded-full bottom-0 bg-[#000]" />
          </div>
          <div className="absolute h-4 w-4 rounded-full left-0 -bottom-3 bg-[#FFD500]" />
        </div>

        <div className="absolute h-40 w-10 top-0 left-[30%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[3px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-5 w-5 rounded-full bottom-3 bg-[#000]" />
          </div>
          <div className="absolute h-10 w-10 rounded-full left-0 -bottom-4 bg-[#FFD500]" />
        </div>

        <div className="absolute h-16 w-4 top-0 left-[40%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[2px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-2 w-2 rounded-full bottom-0 bg-[#000]" />
          </div>
          <div className="absolute h-4 w-4 rounded-full left-0 -bottom-3 bg-[#FFD500]" />
        </div>

        <div className="absolute h-80 w-14 top-0 left-[50%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[3px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-7 w-7 rounded-full bottom-3 bg-[#000]" />
          </div>
          <div className="absolute h-14 w-14 rounded-full left-0 -bottom-7 bg-[#FFD500]" />
        </div>

        <div className="absolute h-12 w-4 top-0 left-[60%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[2px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-2 w-2 rounded-full bottom-0 bg-[#000]" />
          </div>
          <div className="absolute h-4 w-4 rounded-full left-0 -bottom-3 bg-[#FFD500]" />
        </div>

        <div className="absolute h-36 w-11 top-0 left-[70%]">
          <div className="flex justify-center w-full h-full">
            <div className="h-full w-[3px] bg-[#000]" />
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="absolute h-6 w-6 rounded-full bottom-1 bg-[#000]" />
          </div>
          <div className="absolute h-11 w-11 rounded-full left-0 -bottom-6 bg-[#FFD500]" />
        </div>

        <div className="h-52 w-60 border border-[#718FB3] border-t-0 absolute right-[5%] flex justify-center">
          <div className="h-[80%] w-[80%] border border-[#718FB3] border-t-0 flex justify-center">
            <div className="h-[80%] w-[80%] border border-[#718FB3] border-t-0"></div>
          </div>
        </div>
      </div>

      <div className="absolute top-80 left-[50%] -translate-x-1/3 -translate-y-10 flex justify-center items-center">
        <div className="flex justify-between w-72 font-vampiroOne text-[#fff]">
          <h1 className="text-[150px]">4</h1>
          <h1 className="text-[150px]">4</h1>
        </div>
      </div> */}

      <div className="font-Poppins flex flex-col items-center gap-3">
        <img src="/images/page-not-found.png" alt="" className="max-w-xs" />
        <h1 className="font-bold  text-[120px] text-[#374A75]">404</h1>
        <p className="text-[#8D8D8D]">
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
      {/* <div className="flex justify-center items-center  h-screen relative">
        image
        <div className="mb-5">
          <img src="images/pageNotFound.png" alt="pagenotfound" />
        </div>
        <div className="absolute text-white flex flex-col justify-center items-center mt-10 pt-16">
          <h2 className="font-zcool text-2xl"> whoops....</h2>
          <p className="font-Poppins">Looks like something went wrong</p>
          <p className="font-Poppins mb-3">page Not Found</p>

          <button
            className="capitalize font-semibold text-xl px-3 py-2 rounded-lg border-2 border-[#fff]"
            onClick={() => navigate("/")}
          >
            go to home{" "}
          </button>
        </div>
      </div> */}
    </div>
  );
}

export default PageNotFound;
