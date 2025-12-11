import { useParams } from "react-router-dom";
import Welspun from "./Welspun";
import Dlink from "./BrandDLink";
import Daikin from "./Daikin";
import Light from "./BrandLight";
import Furniture from "./BrandFurniture";

const BrandRouter = () => {
  const { brandName } = useParams();

  const components = {
    welspun: <Welspun />,
    dlink: <Dlink />,
    daikin: <Daikin />,
    lighting: <Light />,
    furniture: <Furniture />,
  };

  return components[brandName] || <div>Brand Not Found</div>;
};

export default BrandRouter;
