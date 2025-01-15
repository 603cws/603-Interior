import { MdOutlineCancel } from "react-icons/md";

function SelectArea({ setShowSelectArea, image, subCategories }) {
  return (
    <div className="bg-[#ffff] border-8 border-[#1A3A36] fixed top-1/4 left-1/4 z-10 w-[1000px] rounded-xl">
      <div className="p-4 border-2 border-[#FFD500] rounded-xl relative">
        {/* Title */}
        <div className="flex justify-center items-center mb-4">
          <p className="text-center font-semibold text-xl">Select Your Area</p>
        </div>

        {/* Content */}
        <div className="flex justify-center gap-4">
          {/* Subcategories Checkbox List */}
          <div className="grid grid-cols-5 gap-4 p-4">
            {subCategories.map((name, id) => (
              <div key={id} className="mb-2 flex gap-2 ">
                <input
                  type="checkbox"
                  id={`subCategory-${id}`}
                  name={`subCategory-${id}`}
                  value={name}
                />
                <label htmlFor={`subCategory-${id}`}>{name}</label>
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div>
            <img
              src={image}
              width={150}
              height={200}
              alt="select area"
              className="object-cover rounded-md"
            />
          </div>
        </div>

        {/* Close Button */}
        <MdOutlineCancel
          size={30}
          color="gray"
          className="absolute right-2 top-2 cursor-pointer"
          onClick={() => setShowSelectArea(false)}
        />

        {/* Done Button */}
        <div className="flex justify-center items-center">
          <button
            className="bg-[#1A3A36] mt-2 rounded-xl text-sm py-2 px-5 text-white"
            onClick={() => setShowSelectArea(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelectArea;
