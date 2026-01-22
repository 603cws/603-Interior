import { useNavigate } from "react-router-dom";
import Footer from "../../../common-components/Footer";
import LandingNavbar from "../../../landing/components/LandingNavbar";

const ourCollection = [
  "../images/brands/SmartSolutions/schneiderElectric/section8-1.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-2.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-3.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-4.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-5.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-6.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-7.png",
  "../images/brands/SmartSolutions/schneiderElectric/section8-8.png",
];

function Cisco() {
  const navigate = useNavigate();
  return (
    <div className="font-inter">
      <LandingNavbar />

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/SmartSolutions/cisco/banner.png"
            alt="cisco banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/SmartSolutions/cisco/banner2.png"
            alt="cisco banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/SmartSolutions/cisco/section3-1.png"
            alt="cisco"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <img
            src="../images/brands/SmartSolutions/cisco/section3-2.png"
            alt="cisco"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/SmartSolutions/cisco/banner4.png"
            alt="cisco banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="flex flex-col xl:flex-row gap-5">
          <img
            src="../images/brands/SmartSolutions/cisco/section5-1.png"
            alt="cisco"
            draggable={false}
            className="relative w-full h-[700px] overflow-hidden
               bg-cover bg-left bg-no-repeat flex-1 pointer-events-none select-none"
          />
          <div className="flex flex-col gap-5 flex-1">
            <img
              src="../images/brands/SmartSolutions/cisco/section5-2.png"
              alt="cisco"
              draggable={false}
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat pointer-events-none select-none"
            />
            <img
              src="../images/brands/SmartSolutions/cisco/section5-3.png"
              alt="cisco"
              draggable={false}
              className="relative w-full h-[340px] overflow-hidden
               bg-contain bg-center bg-no-repeat pointer-events-none select-none"
            />
          </div>
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/SmartSolutions/cisco/banner6.png"
            alt="cisco banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <div className="relative overflow-hidden">
          <img
            src="../images/brands/SmartSolutions/cisco/banner7.png"
            alt="cisco banner"
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        </div>
      </section>

      <section className="p-4 lg:container mx-auto">
        <img
          src="../images/brands/SmartSolutions/cisco/banner8.png"
          alt="cisco"
          className="relative w-full h-[380px] overflow-hidden
               bg-cover bg-center bg-no-repeat pointer-events-none select-none"
        />
      </section>

      <section className="p-4 lg:container mx-auto flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 items-center justify-center gap-4">
          {ourCollection.map((product, index) => (
            <div
              key={index}
              onClick={() => navigate("/shop?query=smart solutions")}
              className="border w-full h-80 p-2 flex items-center justify-center border-[#002F36] overflow-hidden hover:cursor-pointer"
            >
              <img
                src={product}
                alt="product"
                draggable={false}
                className="h-full pointer-events-none select-none"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
export default Cisco;
