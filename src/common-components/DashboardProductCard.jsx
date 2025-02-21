import { MdDeleteOutline } from "react-icons/md";

function DashboardProductCard() {
  return (
    <div className="font-Poppins max-w-xl p-10 rounded-3xl border-2">
      <div className="flex gap-4">
        <div className="flex-1">
          <img src="/images/dashprodcard.png" alt="product" />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <h2 className="font-semibold text-3xl text-[#111] uppercase">Doan</h2>
          <h4 className="uppercase text-[#334A78] font-medium text-sm">
            PRODUCT Description
          </h4>
          <p className="text-[#334A78] text-sm font-medium">Final Price</p>
          <p className="font-semibold text-[#000] text-xl">₹7999 </p>
        </div>
      </div>
      <div className="flex text-[#000] justify-between  w-full p-4">
        <div>
          <button className="px-3 py-2 capitalize border-[#FF6666] border-2 rounded-2xl flex justify-center items-center gap-2">
            <MdDeleteOutline /> delete
          </button>
        </div>
        <div>
          <button className=" px-3 py-2 capitalize border-[#BBBBBB] border-2 bg-[#fff] rounded-2xl">
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardProductCard;
