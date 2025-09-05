function GobackLayoutWarning({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
      <div className="max-w-lg w-full bg-gradient-to-br from-[#334A78] to-[#68B2DC] p-4 rounded-2xl">
        <div className="bg-white rounded-lg text-center py-10">
          <p className="mt-5">Are you sure you want to Go Back to layout</p>
          <div className="mt-7 flex justify-around space-x-4">
            <button
              onClick={onCancel}
              // className=" w-28 px-2 py-2 bg-[#FFD500] text-black border-r-4 border-b-4 border-black rounded-md shadow-md hover:bg-yellow-400"
              className="w-28 px-2 py-2 text-[#000] hover:text-[#fff] border-2 border-[#000] hover:border-[#fff] hover:bg-gradient-to-r from-[#334A78] to-[#68B2DC] transition-all duration-500 ease-in-out"
            >
              No
            </button>
            <button
              // onClick={handleProceed}
              onClick={onConfirm}
              // className="w-28 px-2 py-2 bg-[#FFD500] text-black border-r-4 border-b-4 border-black rounded-md shadow-md hover:bg-yellow-400"
              className="w-28 px-2 py-2 text-[#fff] hover:text-[#fff] border-2 border-[#000] hover:border-[#fff] bg-[#334A78] hover:bg-gradient-to-r from-[#334A78] to-[#68B2DC] transition-all duration-500 ease-in-out"
            >
              yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GobackLayoutWarning;
