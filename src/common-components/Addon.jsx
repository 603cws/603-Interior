import { useNavigate } from "react-router-dom";
import { baseImageUrl } from "../utils/HelperConstant";
import { useBoqApp } from "../Context/BoqContext";

function Addon({ imagepath, product }) {
  const { setSelectedProductView } = useBoqApp();
  const navigate = useNavigate();
  return (
    <div className=" border border-[#ccc] p-2 font-Poppins">
      <div className="relative ">
        <div className="flex justify-center">
          <img
            className=" w-[240px] h-24 lg:h-48 object-contain"
            src={`${baseImageUrl}/${imagepath}`}
            alt={imagepath}
          />
        </div>
        <button
          onClick={() => {
            setSelectedProductView({});
            navigate(`/boq/${product?.id}`);
          }}
          className="flex justify-self-center text-black border-[#212B36]  text-xs  border px-8 py-2 hover:bg-[#334A78] hover:text-white"
        >
          View
        </button>
      </div>
    </div>
  );
}

export default Addon;
