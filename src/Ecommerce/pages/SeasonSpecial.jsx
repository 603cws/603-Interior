import BottomTabs from "../components/BottomTabs";

import Header from "../components/Header";
import MobileHeader from "./../../common-components/MobileHeader";
function SeasonSpecial() {
  return (
    <>
      <div className="hidden lg:block">
        <Header />
      </div>

      <div className="lg:hidden">
        <MobileHeader title={"Season Special"} isCartShown={true} />
      </div>

      <div className="py-6 lg:py-10 flex flex-col justify-center items-center gap-5 font-Poppins">
        <h2 className="text-xl lg:text-3xl leading-4">Season Special Deal</h2>
        <p className="leading-4 text-[#aaa]">15 Item</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 lg:container lg:mx-auto mb-6 px-3 lg:px-12">
        {Array.from({ length: 14 }, (_, i) => (
          <Card
            image="/images/cabin chair.png"
            title="Chairs"
            subtitle="Special Offer"
            key={i}
          />
        ))}
      </div>

      <div>
        <BottomTabs />
      </div>
    </>
  );
}

export default SeasonSpecial;

function Card({ image, title, subtitle }) {
  return (
    <div className="max-w-sm shadow-sm border border-[#CCCCCC] p-2">
      <img src={image} alt={title} className="w-full h-48 object-contain" />
      <h3 className="text-sm lg:text-2xl leading-[24px] tracking-[0.96px] font-medium mt-2 mb-1 lg:mb-2 font-Poppins ml-2">
        {title}
      </h3>
      <p className="text-[#378DDB] leading-[24px] tracking-[0.96px] font-medium font-Poppins text-sm lg:text-xl ml-2">
        {subtitle}
      </p>
    </div>
  );
}
