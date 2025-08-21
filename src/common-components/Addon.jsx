import { useNavigate } from "react-router-dom";
import { baseImageUrl } from "../utils/HelperConstant";
import { useApp } from "../Context/Context";

function Addon({ imagepath, product }) {
  const { setSelectedProductView } = useApp();
  const navigate = useNavigate();
  return (
    <div className=" border border-[#ccc] p-2 font-Poppins">
      <div className="relative ">
        <div className="flex justify-center">
          <img
            className=" w-[240px] h-24 lg:h-48"
            src={`${baseImageUrl}/${imagepath}`}
            alt={imagepath}
          />
        </div>
        <button
          onClick={() => {
            setSelectedProductView({});
            navigate(`/boq/${product?.id}`);
          }}
          className="flex justify-self-center text-black border-[#212B36]  text-xs  border px-8 py-2"
        >
          View
        </button>
        {/* <button className="absolute text-black border-[#212B36] transform -translate-y-2/3 translate-x-1/2  font-bold  uppercase border px-3 py-2">
          ADD TO Cart
        </button> */}
      </div>
    </div>
  );
}

export default Addon;
