import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineInventory2 } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdRemoveShoppingCart } from "react-icons/md";

export const AddToCartToast = (product, type = "cart") => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-center justify-between gap-4 pr-2">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <MdOutlineInventory2 className="text-green-600 text-xl" />
          </div>
          <p className="text-sm font-medium text-black">
            {product.title} added to {type} successfully
          </p>
        </div>
        <button onClick={closeToast} className="text-gray-600 hover:text-black">
          <IoClose className="text-lg" />
        </button>
      </div>
    ),
    {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: false,
      hideProgressBar: false,
      closeButton: false,
      className: "bg-green-50 border border-green-400 rounded-lg shadow-sm",
      progressClassName: "bg-green-500",
      transition: Slide,
    }
  );
};

export const RemoveFromCartToast = (product, type = "cart") => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-center justify-between gap-4 pr-2">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <MdOutlineInventory2 className="text-red-600 text-xl" />
          </div>
          <p className="text-sm font-medium text-black">
            {product.title} removed from {type} successfully
          </p>
        </div>
        <button onClick={closeToast} className="text-gray-600 hover:text-black">
          <IoClose className="text-lg" />
        </button>
      </div>
    ),
    {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: false,
      hideProgressBar: false,
      closeButton: false,
      className: "bg-red-50 border border-red-400 rounded-lg shadow-sm",
      progressClassName: "bg-red-500",
      transition: Slide,
    }
  );
};

export const showRemoveFromCartToast = (product, type = "cart") => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-center justify-between gap-4 pr-2">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <MdRemoveShoppingCart className="text-red-600 text-xl" />
          </div>
          <p className="text-sm font-medium text-black">
            {product.productId?.title} removed from {type} successfully
          </p>
        </div>
        <button onClick={closeToast} className="text-gray-600 hover:text-black">
          <IoClose className="text-lg" />
        </button>
      </div>
    ),
    {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: false,
      hideProgressBar: false,
      closeButton: false,
      className: "bg-red-50 border border-red-400 rounded-lg shadow-sm",
      progressClassName: "bg-red-500",
      transition: Slide,
    }
  );
};

export const showLimitReachedToast = () => {
  toast.error(
    <div className="flex items-center gap-2 ">
      <span className="text-red-500 text-sm">⚠️</span>
      <span className="text-sm">You can compare a maximum of 3 products</span>
      <button
        onClick={() => {
          toast.dismiss();
        }}
        className="text-nowrap text-yellow-400 text-sm  hover:underline"
      >
        cancel
      </button>
    </div>,
    {
      className: "bg-[#1a1a1a] text-white rounded-lg px-4 py-3 font-Poppins",
      icon: false,
      closeButton: false,
      autoClose: true,
      position: "bottom-center",
    }
  );
};
