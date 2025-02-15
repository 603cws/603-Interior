function Boqcompleted() {
  return (
    <div>
      <div className="max-w-lg bg-[#1A3A36] font-Poppins flex flex-col justify-center items-center rounded-2xl p-4 gap-4">
        <div className="max-w-sm">
          <img src="/images/Chat-bot.gif" alt="gif" />
        </div>
        <div className="text-[#fff] flex justify-center items-center flex-col gap-2 mb-5">
          <h3 className="text-3xl uppercase">congrats</h3>
          <p className="text-xs capitalize text-center">
            You have reached 100%
          </p>
          <button className="px-5 py-2 border-[#AAA] border-2 bg-[#1D413D] rounded-lg text-sm ">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default Boqcompleted;
