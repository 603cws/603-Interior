import { MdCancel } from "react-icons/md";

function ErrorModal({ onclose }) {



    return (
        <div className="w-full h-svh z-10 absolute bg-[rgba(25,25,25,0.46)] flex justify-center items-center">
            {/* modal */}
            <div className="grid grid-cols-[2fr_1fr] bg-[#1A3A36] border-2 rounded-3xl w-1/2 mx-auto ">
                {/* text */}
                <div className="text-white p-5 flex flex-col justify-center gap-2 m-10">
                    {/* <p style={{ fontFamily: "'Ubuntu Sans', sans-serif" }} className="text-4xl"><span className="text-6xl"> W</span>arning</p> */}
                    <p className="text-4xl font-['UbuntuSans-Regular',_sans-serif]"><span className="text-6xl"> W</span>arning</p>
                    <p style={{ fontFamily: "'Poppins', sans-serif" }}>The input box for total area cannot be left empty</p>
                    <p>please fill in the total area in the swft before making any changes.</p>
                    {/* use this button to close the error window */}
                    {/* <button className="bg-[#FFD500] border-2 p-2 border-[#000] w-1/4"> Go Back</button> */}
                    <div class="bg-[#000000] pt-0.5 pr-2 pb-2 pl-0.5 flex flex-col gap-2.5 items-start justify-start w-[132px] relative overflow-hidden">
                        <div class="bg-[#ffd500] self-stretch shrink-0 h-[49px] relative overflow-hidden" >
                            <button onClick={onclose} class="text-[#000000] text-center font-['Poppins-Regular',_sans-serif] text-base leading-6 font-normal absolute left-6 top-3 w-[83px] h-6 flex items-center justify-center" >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
                {/* img part */}
                <div className="flex justify-center m-10 relative">
                    <img src="images/Errorimg.png" alt="Error chair" />
                    <button className="absolute -top-5 -right-5" onClick={onclose}>
                        <MdCancel size={30} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal
