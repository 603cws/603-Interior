import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardInterface() {
  return (
    <div className="h-screen flex flex-col md:flex-row justify-center gap-10 items-center  border-[20px] border-[#334A78] ">
      <Item
        title={"Ecommerce"}
        img1={"images/pantry-white.png"}
        img2={"images/pantry-blue.png"}
        navigateTo={"/ecommerceadmin"}
      />
      <Item
        title={"Boq"}
        img1={"images/chair-white.png"}
        img2={"images/chair-blue.png"}
        navigateTo={"/admindashboard"}
      />
    </div>
  );
}

export default DashboardInterface;

function Item({ title, img1, img2, navigateTo }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(navigateTo)}
      className="flex flex-col border border-[#ccc] justify-center items-center gap-5 p-10 shadow-lg font-bold rounded-xl cursor-pointer hover:bg-[#374A75] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
      // className="flex flex-col justify-center items-center gap-5 p-10 shadow-[0_4px_10px_rgba(180,234,234,50)] font-bold rounded-xl cursor-pointer hover:bg-[#374A75] hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out"
    >
      <img src={isHovered ? img1 : img2} alt="item" className="w-28" />
      <h2 className="text-lg">{title}</h2>
    </div>
  );
}
