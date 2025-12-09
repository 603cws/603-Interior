import { useApp } from "../../Context/Context";
import { baseImageUrl } from "../../utils/HelperConstant";
import { HiDotsVertical } from "react-icons/hi";

function MobileTabProductCard({ product, handleProductPreview }) {
  const { accountHolder } = useApp();

  const statusColors = {
    pending: "bg-[#FDF1E8] text-[#E46A11]",
    approved: "bg-[#E7F4EE] text-[#0D894F]",
    rejected: "bg-[#FFBEBE] text-[#FF0000]",
  };

  return (
    <div className="max-w-md md:max-w-4xl md:w-full bg-white shadow-md rounded-lg p-2 flex flex-col md:flex-row md:gap-6  items-start relative border-b border-b-[#ccc]">
      <div className="flex-1 flex gap-2 items-center">
        <div>
          <img
            src={`${baseImageUrl}/${product?.image}`}
            alt="Product"
            className="w-28 h-28 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start font-semibold text-sm">
            <h4 className=" ">{product?.title || "NA"}</h4>
            <span className="">Rs:{product?.price || "NA"}</span>
          </div>
          <p className="text-xs mt-1">{product?.details || ""}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1  text-sm space-y-1 w-full">
        <ContentCard title={"Category:"} value={product?.products?.category} />
        <ContentCard
          title={"Specification:"}
          value={product?.products?.subcategory1}
        />
        <ContentCard title={"Dimensions:"} value={product?.dimension} />
        {accountHolder.role !== "user" && (
          <ContentCard
            title={"Status:"}
            value={product?.status}
            className={`${
              statusColors[product?.status]
            } p-1 rounded-lg || "bg-gray-200"`}
          />
        )}
      </div>

      {/* 3-dot Menu */}
      <div className="absolute right-0 bottom-0">
        <button
          onClick={() => handleProductPreview(product)}
          className="text-gray-500 text-xl"
        >
          {" "}
          <HiDotsVertical size={20} />{" "}
        </button>
      </div>
    </div>
  );
}

export default MobileTabProductCard;

function ContentCard({ title, value, className }) {
  return (
    <div className="flex justify-between gap-2">
      <h2 className="font-semibold w-28 text-xs">{title}</h2>
      <p className={`text-xs flex-1 text-start ${className}`}>
        {value || "NA"}
      </p>
    </div>
  );
}
