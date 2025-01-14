import { MdOutlineCancel } from "react-icons/md";
function SelectArea() {
  return (
    // <div className="bg-[#1A3A36]">
    //   <div>
    //     <p>select your Area</p>
    //     {/* flex box for image and 2 col for category */}
    //     <div className="flex gap-3 bg-gray-950 justify-center">
    //       {/* col 1 */}
    //       <div className="bg-red-600">
    //         {/* each tick component */}
    //         <div>
    //           <input
    //             type="checkbox"
    //             id="LinearWorkstation"
    //             name="LinearWorkstation"
    //             value="LinearWorkstation"
    //           />
    //           <label for="LinearWorkstation"> LinearWorkstation</label>
    //         </div>
    //       </div>
    //       {/* col 2 */}
    //       <div className="bg-yellow-500">
    //         {/* each tick component */}
    //         <div>
    //           <input
    //             type="checkbox"
    //             id="LinearWorkstation"
    //             name="LinearWorkstation"
    //             value="LinearWorkstation"
    //           />
    //           <label for="LinearWorkstation"> LinearWorkstation</label>
    //         </div>
    //       </div>
    //       {/* image */}
    //       <div className="bg-blue-950">
    //         <img src="images/selectArea.png" alt="select area" />
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="bg-[#ffff] border-8 border-[#1A3A36] relative w-[600px] rounded-xl ">
      <div className="p-4 border-2 border-[#FFD500]  ">
        <div className="flex justify-center items-center mb-4">
          <p className="text-center font-semibold text-xl">Select Your Area</p>
        </div>
        <div className="flex justify-center gap-4 ">
          {/* first div */}
          <div className=" p-4">
            {/* each tick component */}
            <div className="mb-2 flex gap-2">
              <input
                type="checkbox"
                id="LinearWorkstation"
                name="LinearWorkstation"
                value="LinearWorkstation"
              />
              <label for="LinearWorkstation"> LinearWorkstation</label>
            </div>
            <div className="mb-2 flex gap-2">
              <input
                type="checkbox"
                id="LinearWorkstation"
                name="LinearWorkstation"
                value="LinearWorkstation"
              />
              <label for="LinearWorkstation"> LinearWorkstation</label>
            </div>
            <div className="mb-2 flex gap-2">
              <input
                type="checkbox"
                id="LinearWorkstation"
                name="LinearWorkstation"
                value="LinearWorkstation"
              />
              <label for="LinearWorkstation"> LinearWorkstation</label>
            </div>
          </div>
          {/* second */}
          <div className=" p-4">
            {/* each tick component */}
            <div className="mb-2 flex gap-2">
              <input
                type="checkbox"
                id="LinearWorkstation"
                name="LinearWorkstation"
                value="LinearWorkstation"
              />
              <label for="LinearWorkstation"> LinearWorkstation</label>
            </div>
            <div className="mb-2 flex gap-2">
              <input
                type="checkbox"
                id="LinearWorkstation"
                name="LinearWorkstation"
                value="LinearWorkstation"
              />
              <label for="LinearWorkstation"> LinearWorkstation</label>
            </div>
            <div className="mb-2 flex gap-2">
              <input
                type="checkbox"
                id="LinearWorkstation"
                name="LinearWorkstation"
                value="LinearWorkstation"
              />
              <label for="LinearWorkstation"> LinearWorkstation</label>
            </div>
          </div>
          {/* third for image */}
          <div>
            <img
              src="images/selectArea.png"
              width={150}
              height={200}
              alt="select area"
              className="object-cover"
            />
          </div>
        </div>
        {/* <div className="flex gap-4 justify-around">
          <button className="bg-[#1A3A36] mt-2 rounded-xl text-sm py-2 px-5 text-white">
            previous
          </button>
          <button className="bg-[#fff] border-2 border-[#000000] mt-2 rounded-xl text-sm py-2 px-5 text-black">
            Next
          </button>
        </div> */}
        <MdOutlineCancel
          size={30}
          color="gray"
          className="absolute right-0 top-0"
        />
        <div className="flex justify-center items-center">
          <button className="bg-[#1A3A36] mt-2 rounded-xl text-sm py-2 px-5 text-white">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectArea;
