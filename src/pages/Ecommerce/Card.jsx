// components/Card.jsx
export default function Card({ image, title, subtitle }) {
  return (
    <div className="w-[calc(50%-0.5rem)] shadow-sm border border-[#CCCCCC] p-2">
      <img src={image} alt={title} className="w-full h-48 object-contain" />
      <h3 className="text-2xl mt-2 font-Poppins ml-2">{title}</h3>
      <p className="text-[#378DDB] font-Poppins text-xl ml-2">{subtitle}</p>
    </div>
  );
}
