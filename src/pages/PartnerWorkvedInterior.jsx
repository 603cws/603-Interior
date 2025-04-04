import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

import TrustedPartnerReview from "../common-components/TrustedPartnerReview";

function PartnerWorkvedInterior() {
  const background = "/images/services/servicepage.png";

  // review array
  const partnerReview = [
    {
      starcount: 5,
      companyname: "TechCorp Solutions",
      partnertype: "Technology Partner",
      companylogo: "trustedpartner",
      review:
        "The collaboration has helped us expand our market reach by 200% in just 6 months.",
    },
    {
      starcount: 5,
      companyname: "Retail Dyanmics",
      partnertype: "REtail Partner",
      companylogo: "trustedpartner2",
      review:
        "Our partnership has revolutionized our supply chain efficiency and customer satisfaction",
    },
    {
      starcount: 5,
      companyname: "Creative Minds",
      partnertype: "Creative partner",
      companylogo: "trustedpartner3",
      review:
        "The collaborative environment innovaction and led to award winning company",
    },
  ];

  return (
    <div className="font-Poppins">
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase font-lato font-extrabold">
          <h1 className="text-5xl lg:text-7xl text-white drop-shadow-lg">
            Partner with workved interior
          </h1>
        </div>
      </section>

      {/* section 2 our trusted partners  */}
      <section>
        <div className="text-center my-3">
          <h3 className="capitalize text-semibold text-2xl">
            our trusted partners{" "}
          </h3>
          <p className="text-[#A0A0A0]">
            Discover the success stories of business that have with us
          </p>
        </div>

        {/* div for the trusted brand review */}
        <div className="flex justify-center items-center">
          {partnerReview.map((partRev, index) => (
            <TrustedPartnerReview
              companylogo={partRev.companylogo}
              companyname={partRev.companyname}
              partnertype={partRev.partnertype}
              review={partRev.review}
              starcount={partRev.starcount}
              key={index}
            />
          ))}
        </div>
      </section>

      {/* section 3 */}
      <section>
        <div className="text-center my-3">
          <h3 className="capitalize text-semibold text-2xl">
            Featured Products{" "}
          </h3>
          <p className="text-[#A0A0A0]">
            Discover amazing products from our partners
          </p>
        </div>

        <div className=" flex justify-center items-center">
          <ul className="flex gap-2 border-2 border-[#000] font-semibold capitalize p-2 my-2 border-opacity-20 ">
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Furniture
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Lighting
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Paint
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Civil Plumbing
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Flooring
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Partition/Ceiling
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                HVAC
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                Smart Solution
              </button>
            </li>
            <li>
              <button className="hover:bg-[#1A3A36] hover:text-white px-4 py-2">
                LUX
              </button>
            </li>
          </ul>
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default PartnerWorkvedInterior;
