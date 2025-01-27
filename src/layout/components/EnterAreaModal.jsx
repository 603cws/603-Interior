import { MdCancel } from "react-icons/md";
import { useApp } from "../../Context/Context";

function EnterAreaModal({ onclose }) {
  const { setTotalArea } = useApp(); // Call the `useApp` hook to access the context

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value) || 0; // Convert the input to a number or set to 0 if empty
    setTotalArea(value); // Update the totalArea value in the global context
  };

  return (
    <div className="w-full h-svh z-10 absolute bg-[rgba(25,25,25,0.46)] flex justify-center items-center">
      {/* modal */}
      <div className="grid grid-cols-[2fr_1fr] bg-[#A9D3CE] border-2 rounded-3xl w-1/2 mx-auto px-4">
        {/* text */}
        <div className="flex flex-col justify-center gap-2 pr-4">
          <p className="text-4xl font-['UbuntuSans-Regular',_sans-serif]">
            <span className="text-6xl">O</span>ops!
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif" }}>
            You Forgot To Enter Your Area.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif" }}>
            Please Enter Your Area.
          </p>
          <input
            type="number"
            onChange={handleInputChange} // Update totalArea when input changes
            placeholder="Enter Your Area"
            className="py-2 bg-transparent border-[1px] border-black px-2 rounded-lg [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0 w-3/4"
          />
          <div className="bg-[#000000] pt-0.5 pr-2 pb-2 pl-0.5 flex flex-col gap-2.5 items-start justify-start w-[132px] relative overflow-hidden mt-4">
            <div className="bg-[#ffd500] self-stretch shrink-0 h-[49px] relative overflow-hidden">
              <button
                onClick={onclose}
                className="text-[#000000] text-center font-['Poppins-Regular',_sans-serif] text-base leading-6 font-normal absolute left-6 top-3 w-[83px] h-6 flex items-center justify-center"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {/* img part */}
        <div className="flex justify-center my-10 relative">
          <img src="images/No-data.gif" alt="Error chair" />
          {/* <button className="absolute -top-5 right-0" onClick={onclose}>
            <MdCancel size={30} />
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default EnterAreaModal;
