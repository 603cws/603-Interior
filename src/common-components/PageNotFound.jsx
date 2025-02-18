import { useNavigate } from "react-router-dom";
function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex justify-center items-center  h-screen relative">
        {/* image */}
        <div className="mb-5">
          <img src="images/pageNotFound.png" alt="pagenotfound" />
        </div>
        {/* text */}
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
      </div>
    </div>
  );
}

export default PageNotFound;
