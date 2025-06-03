import HeroSection from "./HeroSection";
import OurWorkFeatures from "../common-components/OurWorkFeatures";
import OurWorkTestimonal from "../common-components/OurWorkTestimonal";
import { PiPhoneCall } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import Footer from "../common-components/Footer";

const background = "/images/career-page-bg.png";

const interiorfeatureslist = [
  { title: "We provide high quality design services." },
  { title: "Project on time and Latest Design." },
  { title: "Scientific Skills For getting a better result." },
  { title: "Renovations Benefit of Service" },
  { title: "We are confident about our projects." },
];
const interiorfeatureslist2 = [
  { title: "We provide high quality design services." },
  { title: "Project on time and Latest Design." },
  { title: "Scientific Skills For getting a better result." },
  { title: "Renovations Benefit of Service" },
  { title: "We are confident about our projects." },
];

const contactDetails = [
  {
    icon: <PiPhoneCall color="#777777" size={30} />,
    title: "Phone Number",
    description: "+91-9136036603",
  },
  {
    icon: <AiOutlineMail color="#777777" size={30} />,
    title: "Email Address",
    description: "sales@603thecoworkingspace.com",
  },
  {
    icon: <CiLocationOn color="#777777" size={30} />,
    title: "Location",
    description: "Makhija Arcade, 35th Rd, Khar West,Mumbai Maharashtra 400052",
  },
];

function OurWork() {
  return (
    <>
      <HeroSection background={background} title={"Interior Work"} />

      {/* layout */}
      <section className="my-10">
        <div className="md:container md:mx-auto ">
          <div className="flex  flex-col-reverse xl:grid  xl:grid-cols-[1fr,3fr] gap-x-20">
            <aside className="space-y-4 px-3 lg:px-0">
              <div className="bg-[#F7F7F7]  font-lato py-2 ">
                <div className="lg:p-4 ">
                  <h3 className="border-b border-b-[#232323] text-lg font-bold">
                    More Services
                  </h3>
                  <ul className="[&_li]:font-bold text-[15px] text-[#232323] [&_li]:mx-2 lg:[&_li]:mx-6 [&_li]:my-3 [&_li]:px-6 [&_li]:py-3 [&_li]:bg-[#fff] ">
                    <li>Architecture</li>
                    <li>Interior Work</li>
                    <li>Retail Designs</li>
                    <li>2D/3D Layouts</li>
                    <li>Inter Design</li>
                    <li>Decoration Art</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#F7F7F7]  font-lato py-2 ">
                <div className="lg:p-4 ">
                  <h3 className="border-b border-b-[#232323] text-lg font-bold">
                    Contact
                  </h3>
                  <ul className="[&_li]:font-bold text-[15px] text-[#232323] [&_li]:mx-2 lg:[&_li]:mx-6 [&_li]:my-3 [&_li]:px-6 [&_li]:py-3 [&_li]:bg-[#fff] ">
                    {contactDetails.map((contact) => (
                      <li key={contact.title}>
                        {" "}
                        <div className="flex  items-center gap-3">
                          <div>{contact.icon}</div>
                          <div className="flex flex-col justify-center font-lato ">
                            <h3 className=" font-bold text-[15px] text-[#232323]">
                              {contact.title}
                            </h3>
                            <p className="font-lora text-[14px] text-[#777]">
                              {contact.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-[#F7F7F7]  font-lato  ">
                <div className="lg:p-4 space-y-3 ">
                  <h3 className="border-b border-b-[#232323] text-lg font-bold">
                    Gallery
                  </h3>
                  <div>
                    <img src="/images/ourworkgallery.png" alt="gallery" />
                  </div>
                </div>
              </div>
            </aside>
            <div>
              <div className=" space-y-4">
                <h4 className="font-lora text-xl md:text-3xl font-bold text-[#232323] px-2 lg:px-0">
                  Creative Solutions By Interior Professional Designers
                </h4>
                <div className="max-w-4xl">
                  <img
                    src="/images/interiorwork.png"
                    alt="creative solutions"
                  />
                </div>
                <div className="text-[#777] text-[15px] px-3 lg:px-0">
                  <p>
                    Since 1999, we have been providing great flooring solutions
                    and customer service for homeowners and commercial clients.
                    among flooring materials, none is more elegant and luxurious
                    than natural stone. Give your consent, we design a perfect
                    bend choose the style, we complete with our file.
                  </p>
                </div>
              </div>
              <div className="space-y-4 mt-4 lg:mt-10 px-3 lg:px-0">
                <p className="font-lora text-[#777] text-[15px]">
                  A wonderful serenity has taken possession of my entire soul,
                  like these sweet mornings of spring which I enjoy with my
                  whole heart and its very blessed.
                </p>
                <div>
                  <OurWorkFeatures
                    title={"Use of Interior"}
                    description={"Giving your home a new style every style"}
                    image={"useOfInterior.png"}
                    interiorfeatureslist={interiorfeatureslist}
                    rowReverse={false}
                  />
                </div>
                <div>
                  <OurWorkFeatures
                    title={"Make An Art"}
                    description={"Giving your home a new style every style"}
                    image={"interiorwork2.png"}
                    interiorfeatureslist={interiorfeatureslist2}
                    rowReverse={true}
                  />
                </div>
              </div>
              <div className="font-lato px-3 lg:px-0 ">
                <h2 className="font-bold text-3xl text-[#232323] mt-10 mb-8">
                  Words From Our Customers
                </h2>
                <div className="flex flex-col md:flex-row gap-10">
                  <OurWorkTestimonal
                    name={"Hussain Patel"}
                    position={"Director, Tripjack"}
                    image={"images/tripjack-logo.png"}
                    testimonal={`“Workved Interiors transformed our office into a space that perfectly blends functionality with modern aesthetics. Their team understood our requirements and executed the project seamlessly, ensuring a workspace that enhances productivity and employee well-being. The attention to detail and quality craftsmanship truly set them apart!”`}
                  />
                  <OurWorkTestimonal
                    name={"Kunal Kataria"}
                    position={"Founder, 603 CWS"}
                    image={"logo/logo.png"}
                    testimonal={`“Workved Interiors has played a key role in shaping our coworking spaces into inspiring and productive environments. Their ability to design offices that are both stylish and highly functional  has been a game-changer for our members. Their expertise, professionalism, and commitment to delivering excellence make them a trusted partner in workspace design.””`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default OurWork;
