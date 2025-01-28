// import Spacebar from "./Spacebar"


function BoqNavbar() {
    return (
        <div>
            <div className="flex justify-evenly bg-[#1A3A36]  py-2 items-center rounded-full">
                {/* logo */}
                <div className=" ">
                <button className="bg-[#fff] mt-2 rounded-full text-sm py-2 px-5 text-black text-center">
                    Save BOQ
                 </button>
                </div>
                {/*progress bar percentage */}
                <div className="flex justify-between w-1/2 items-center border-1 rounded-full  overflow-hidden bg-[#385682] text-sm ">
                    {/* used space */}
                   <div className="bg-[#54DED3] text-white w-3/4 border-1 rounded-xl ">
                       <p className="px-4">Used space</p>
                  </div>
                      {/* unused space */}
                      <div className="bg-[#385682] text-black  w-1/4 border-1 rounded-xl">
                        <p className="px-4">Unused space</p>
                      </div>
                 </div>
                {/* button for generate boq */}
                <div className="flex gap-4">
                 <button className="bg-[#fff] mt-2 rounded-full text-sm py-2 px-5 text-black">
                    Save BOQ
                 </button>
                 {/* download */}
                 <button className=" mt-2 rounded-full text-sm py-2 px-5 text-black border-2 border-[##34BFAD] ">
                    Download
                 </button>
                 {/* total price */}
                 <button className="bg-[#fff] mt-2 rounded-full text-sm py-2 px-5 text-black">
                    $4000
                 </button>
                </div>
            </div>
        </div>
    )
}

export default BoqNavbar
