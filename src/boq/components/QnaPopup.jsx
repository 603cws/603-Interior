/* eslint-disable react/prop-types */
function QnaPopup({ question }) {

  // console.log(question)
  return (
    <div className="bg-[#ffff] border-8 border-[#1A3A36]  w-[350px] rounded-xl ">
      <div className="p-4 border-2 border-[#FFD500]  ">
        <p>Answer These Question</p>
        <p>{question}</p>
        <div className="flex justify-around ">
          <label>
            <input
              type="radio"
              name="yesNo"
              value="yes"
            // checked={selectedOption === "yes"}
            // onChange={handleOptionChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="yesNo"
              value="No"
            // checked={selectedOption === "yes"}
            // onChange={handleOptionChange}
            />
            No
          </label>
        </div>
        <div className="flex gap-4 justify-around">
          <button className="bg-[#1A3A36] mt-2 rounded-xl text-sm py-2 px-5 text-white">
            previous
          </button>
          <button className="bg-[#fff] border-2 border-[#000000] mt-2 rounded-xl text-sm py-2 px-5 text-black">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default QnaPopup
