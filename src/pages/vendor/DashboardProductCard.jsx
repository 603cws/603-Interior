import { MdDeleteOutline } from "react-icons/md";

function DashboardProductCard({ onClose, product }) {
  console.log("product preview", product);
  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  return (
    <div className="flex justify-center items-center h-screen absolute z-20 top-0 w-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="font-Poppins max-w-xl p-10 rounded-3xl border-2 relative bg-white">
        <div className="flex gap-4">
          <div className="flex-1">
            <img src={`${baseImageUrl}${product.image}`} alt="product" />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2">
            <h2 className="font-semibold text-3xl text-[#111] uppercase">
              {product.title}
            </h2>
            <h4 className="uppercase text-[#334A78] font-medium text-sm">
              {product.details}
            </h4>
            <p className="text-[#334A78] text-sm font-medium">Final Price</p>
            <p className="font-semibold text-[#000] text-xl">
              ₹{product.price} 
            </p>
          </div>
        </div>
        <div className="flex text-[#000] justify-between  w-full p-4">
          <div>
            <button className="px-3 py-2 capitalize border-[#FF6666] border-2 rounded-2xl flex justify-center items-center gap-2">
              <MdDeleteOutline /> delete
            </button>
          </div>
          <div>
            <button
              onClick={onClose}
              className=" px-3 py-2 capitalize border-[#BBBBBB] border-2 bg-[#fff] rounded-2xl"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardProductCard;
