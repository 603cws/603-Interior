import { useParams } from "react-router-dom";
import Welspun from "./Flooring/Welspun";
import Dlink from "./SmartSolutions/BrandDLink";
import Daikin from "./HVAC/Daikin";
import Light from "./BrandLight";
import Furniture from "./BrandFurniture";
import Lg from "./HVAC/Lg";
import Wipro from "./Furniture/Wipro";
import Godrej from "./Furniture/Godrej";
import Featherlite from "./Furniture/Featherlite";
import Hni from "./Furniture/Hni";
import Spacewood from "./Furniture/Spacewood";

const BrandRouter = () => {
  const { brandName } = useParams();

  const components = {
    welspun: <Welspun />,
    dlink: <Dlink />,
    daikin: <Daikin />,
    lighting: <Light />,
    furniture: <Furniture />,
    lg: <Lg />,
    wipro: <Wipro />,
    godrej: <Godrej />,
    featherlite: <Featherlite />,
    hni: <Hni />,
    spacewood: <Spacewood />,
  };

  return components[brandName] || <div>Brand Not Found</div>;
};

export default BrandRouter;
