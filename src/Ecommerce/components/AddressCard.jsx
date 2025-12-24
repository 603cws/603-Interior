function AddressCard({
  add,
  handleSetDefaultAddress,
  handleRemoveAddress,
  removingAddressId,
}) {
  return (
    <div className="font-Poppins flex items-start gap-3 border border-[#ccc] p-5 rounded-md  ">
      <div className="mt-1">
        <input
          type="checkbox"
          checked={add.ismarkedDefault}
          onChange={() => handleSetDefaultAddress(add.id)}
          className="cursor-pointer"
        />
      </div>
      <div className="">
        <div className="flex gap-2">
          <h2 className="text-[#000000] font-medium text-sm leading-[28.8px] ">
            {add.name}
          </h2>
        </div>
        <div>
          <p className="text-[#000000]/60  text-sm leading-[24.8px]">
            {" "}
            {`${add?.address}, ${add?.town}`}
            <br />
            {`${add?.city}, ${add?.state} - ${add?.pincode}`}
          </p>
        </div>
        <p className="text-[#000000]/60  text-sm leading-[28.8px]">
          Mobile: <span className="!text-[#000]">{add.mobile}</span>
        </p>
        <div className="flex items-center gap-5">
          <button
            onClick={() => handleRemoveAddress(add)}
            className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md"
            disabled={removingAddressId === add.id}
          >
            {removingAddressId === add.id ? (
              <div className="spinner flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Remove"
            )}
          </button>
          <button className="border boder-[#ccc] text-[#000]/60 px-5 py-2 rounded-md">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
