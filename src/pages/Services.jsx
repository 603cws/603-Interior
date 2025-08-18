import { useNavigate } from "react-router-dom";
import LandingNavbar from "../common-components/LandingNavbar";
const steps = [
  {
    imagePath: "/images/DeliveryService1.png",
    title: "Plan",
    description: "Understand your space and needs",
  },
  {
    imagePath: "/images/DeliveryService1.png",
    title: "select",
    description: "Understand your space and needs",
  },
  {
    imagePath: "/images/DeliveryService1.png",
    title: "build",
    description: "Understand your space and needs",
  },
];

const FeatureCardDetails = [
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureIcon1.png",
    title: "Office Layout Planning",
  },
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureIcon1.png",
    title: "Furniture & Fixtures",
  },
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureIcon1.png",
    title: "Lighting & Electricals",
  },
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureIcon1.png",
    title: "HVAC Solutions",
  },
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureIcon1.png",
    title: "Smart Office Technology",
  },
  {
    imgpath: "/images/featureIcon1.png",
    hoveredImgPath: "/images/featureIcon1.png",
    title: "Decor & Finishing",
  },
];
function Services() {
  return (
    <div className="">
      <OfficeLayoutSection />
      <div className="flex flex-col xl:flex-row items-center justify-between  p-16 container mx-auto">
        <InfoCard />
        <InfoCard />
        <InfoCard />
      </div>
      <div className="container mx-auto">
        <FeaturesSection />
      </div>
      <div className="container mx-auto">
        <DeliverServices />
      </div>
      <div className="container mx-auto">
        <FeatureDesignSection />
      </div>
    </div>
  );
}

export default Services;

function OfficeLayoutSection() {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col lg:flex-row justify-between items-center my-10 container mx-auto">
      {/* Left Section */}
      <div>
        <h2 className="text-3xl xl:text-[44px] xl:leading-[53px] tracking-[0.3px] font-bold text-[#334A78] capitalize">
          Design your dream <br /> office-from layout <br /> to final Product
        </h2>
        <p className="text-[#334A78] mt-4 text-base md:text-2xl tracking-[0.3px]">
          Plan your workspace, add furniture & <br /> essentials, and get your
          BOQ Instantly.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gradient-to-r from-[#75A2BE] to-[#334A78] text-white px-6 py-3 rounded-md"
        >
          Start Your Layout
        </button>
      </div>

      {/* Right Section - Image */}
      <div className="flex justify-center">
        <img
          src="/images/service_1.png"
          alt="Office Layout"
          className="w-full lg:max-w-xl xl:max-w-2xl"
        />
      </div>
    </div>
  );
}

function InfoCard({ imgpath, title, description }) {
  return (
    <div className="font-lora max-w-sm px-8 space-y-3 flex flex-col justify-center items-center">
      <div className="">
        <img src="/images/service_2.png" alt="service" />
      </div>
      <h2 className="text-[#232323] font-bold text-2xl">Create Your Layout</h2>
      <p className="text-center text-[#777] text-sm tracking-[0.3px]">
        Add and remove your Workstations, Meeting rooms, Cabins, and more.
      </p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="py-16 px-5 ">
      {/* <h2 className="text-center font-lora font-bold text-[#232323] text-3xl xl:text-[42px] xl:leading-[53px] tracking-[0.3px]">
        We Provide Everything for <br /> your Office Interior
      </h2> */}
      <HeadingSection>
        We Provide Everything for <br /> your Office Interior
      </HeadingSection>
      <div className="grid grid-cols-3 place-items-center mt-11 gap-6">
        {FeatureCardDetails.map((data) => (
          <FeatureCard
            key={data?.title}
            imgpath={data?.imgpath}
            title={data?.title}
          />
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ title, imgpath }) {
  return (
    <div className="w-full border border-[#ccc] font-lora p-4 hover:bg-gradient-to-br from-[#334A78] to-[#68B2DC]  hover:text-white">
      <div className="flex flex-col justify-center items-center gap-5">
        <div>
          <img src={imgpath} alt="feature icon" className="w-20 h-20" />
        </div>
        <h3 className="text-center font-bold text-xl text-[#232323] ">
          {title}
        </h3>
      </div>
    </div>
  );
}

function DeliverServices() {
  return (
    <div className="px-4 py-16">
      <HeadingSection>How We Deliver Our Services</HeadingSection>
      <StepsSection />
    </div>
  );
}

function HeadingSection({ children }) {
  return (
    <h2 className="text-center font-lora font-bold text-[#232323] text-3xl xl:text-[42px] xl:leading-[53px] tracking-[0.3px]">
      {children}
    </h2>
  );
}
//  We Provide Everything for <br /> your Office Interior
function StepsSection() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-10 space-y-10 md:space-y-0 relative">
          {/* {steps} */}
          {steps?.map((stepdata, index) => (
            <Step
              title={stepdata?.title}
              description={stepdata?.description}
              imagePath={stepdata?.imagePath}
              key={stepdata?.title}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Step({ imagePath, title, description, index }) {
  return (
    <div className="flex-1 text-center relative">
      <div className="w-32 h-32 rounded-full border border-dashed border-gray-400 bg-white mx-auto flex items-center justify-center relative z-10">
        <img src={imagePath} alt="Plan" className="w-12 h-12" />
      </div>
      <h3 className="mt-6 text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-gray-500 mt-2 text-sm">{description}</p>
      {/* Connector Line to Step 2 */}
      {(index === 0 || index === 1) && (
        <div className="hidden md:block absolute top-16 left-1/2 w-full border-t border-dashed border-gray-400 z-0"></div>
      )}
    </div>
  );
}

function FeatureDesignSection() {
  return (
    <div className="px-4 py-16">
      <HeadingSection>Featured Designs</HeadingSection>
      <div className="flex items-center justify-between mt-11">
        <div>
          <img src="/images/FeaturedDesign1.png" alt="featured design" />
        </div>
        <div>
          <img src="/images/FeaturedDesign1.png" alt="featured design" />
        </div>
        <div>
          <img src="/images/FeaturedDesign1.png" alt="featured design" />
        </div>
      </div>
    </div>
  );
}
