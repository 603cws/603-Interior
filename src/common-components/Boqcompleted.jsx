import completeBoqAnimation from "../assets/completeBoqAnimation.json";
import Lottie from "lottie-react";

function Boqcompleted({ setCompleted100 }) {
  const handleDoneClick = () => {
    localStorage.setItem("boqCompleted", "done");
    setCompleted100(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-lg bg-[#374A75] font-Poppins flex flex-col items-center rounded-2xl p-6 gap-4 shadow-lg">
        <div className="max-w-sm ">
          <Lottie animationData={completeBoqAnimation} loop={false} />
        </div>

        <div className="text-[#fff] flex flex-col items-center gap-3 text-center">
          <h3 className="text-3xl uppercase">Congrats</h3>
          <p className="text-xs capitalize">You have reached 100%</p>

          <div className="flex gap-4">
            <button
              className="px-5 py-2 border-[#AAA] border-2 rounded-lg text-sm text-white transition"
              onClick={handleDoneClick}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boqcompleted;
