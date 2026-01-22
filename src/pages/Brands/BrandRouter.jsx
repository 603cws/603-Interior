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
import BlueStar from "./HVAC/BlueStar";
import Johnson from "./Flooring/Johnson";
import Kajaria from "./Flooring/Kajaria";
import Somany from "./Flooring/Somany";
import Netgear from "./SmartSolutions/Netgear";
import HoneyWell from "./SmartSolutions/HoneyWell";
import SchneiderElectric from "./SmartSolutions/SchneiderElectric";
import Philips from "./Lighting/Philips";
import WiproLight from "./Lighting/Wipro";
import Shaw from "./Flooring/Shaw";
import Voltas from "./HVAC/Voltas";
import Mitsubishi from "./HVAC/Mitsubishi";
import Cisco from "./SmartSolutions/Cisco";
import Syska from "./Lighting/Syska";
import Havells from "./Lighting/Havells";

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
    bluestar: <BlueStar />,
    johnson: <Johnson />,
    kajaria: <Kajaria />,
    somany: <Somany />,
    netgear: <Netgear />,
    honeywell: <HoneyWell />,
    schneiderElectric: <SchneiderElectric />,
    philips: <Philips />,
    wiproLight: <WiproLight />,
    shaw: <Shaw />,
    voltas: <Voltas />,
    mitsubishi: <Mitsubishi />,
    cisco: <Cisco />,
    syska: <Syska />,
    havells: <Havells />,
  };

  return components[brandName] || <div>Brand Not Found</div>;
};

export default BrandRouter;
