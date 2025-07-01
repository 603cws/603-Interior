// components/CardSection.jsx
import { useNavigate } from "react-router-dom";
import Card from "./Card";

export default function CardSection({ title }) {
  const naviagte = useNavigate();
  return (
    <div className="lg:bg-[#F9FFF7] rounded-md lg:p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base lg:text-2xl font-lora">{title}</h2>
        <button
          onClick={() => naviagte("seasonspecial")}
          className="w-5 h-5 flex items-center justify-center border-2 border-[#304778] bg-[#304778] hover:bg-[#566587] text-white text-xl rounded-full"
        >
          ›
        </button>
      </div>
      {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2  gap-4"> */}
      <div className="flex flex-wrap md:flex-nowrap lg:flex-wrap gap-4">
        <Card
          image="/images/cabin chair.png"
          title="Chairs"
          subtitle="Special Offer"
        />
        <Card image="/images/table.jpg" title="Table" subtitle="Min. 10% OFF" />
        <Card
          image="/images/Executive chair.png"
          title="Sofa"
          subtitle="Min. 10% OFF"
        />
        <Card
          image="/images/banner-chair.jpg"
          title="Lights"
          subtitle="Min. 30% OFF"
        />
      </div>
    </div>
  );
}
