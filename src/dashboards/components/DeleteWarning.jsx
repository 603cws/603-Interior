function DeleteWarning({
  selectedProductview,
  setDeleteWarning,
  handleDelete,
}) {
  return (
    <div className="flex justify-center items-center fixed inset-0 z-30">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white relative py-7 px-16 md:px-20">
        <div className="flex justify-center items-center">
          <img
            src="images/icons/delete-icon.png"
            alt="delete icon"
            className="h-12 w-12"
          />
        </div>

        <h4 className="font-semibold my-5">
          Do you want to delete {selectedProductview?.title}?
        </h4>
        <div className="flex justify-between">
          <button
            onClick={() => {
              setDeleteWarning(false);
            }}
            className="px-5 py-2 bg-[#EEEEEE] hover:bg-[#c5c5c5] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedProductview)}
            className="px-5 py-2 bg-[#B4EAEA] hover:bg-[#a2d2d2] rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteWarning;
