function Boqcompleted({ setCompleted100 }) {
  const handleDoneClick = () => {
    console.log("Done clicked");
    localStorage.setItem("boqCompleted", "done"); // ✅ Ensure "done" is set
    setCompleted100(false); // Hide modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-lg bg-[#132824] font-Poppins flex flex-col items-center rounded-2xl p-6 gap-4 shadow-lg">
        {/* Image */}
        <div className="max-w-sm">
          <img src="/images/Chat-bot.gif" alt="gif" />
        </div>

        {/* Text & Button */}
        <div className="text-[#fff] flex flex-col items-center gap-3 text-center">
          <h3 className="text-3xl uppercase">Congrats</h3>
          <p className="text-xs capitalize">You have reached 100%</p>

          <button
            className="px-5 py-2 border-[#AAA] border-2 bg-[#1D413D] rounded-lg text-sm hover:bg-[#25534E] transition"
            onClick={handleDoneClick}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default Boqcompleted;
