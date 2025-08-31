import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function TermsAndCondition() {
  const background = "/images/contact-us/contactpage.png";
  const termsAndConditions = [
    {
      title: "General",
      description: [
        "These Terms & Conditions apply to all users of our website and services, including those exploring our platform, creating layouts, or engaging with listed vendors.",
        "We may update these terms periodically, so we encourage you to review them regularly.",
      ],
    },
    {
      title: "Use of Our Website",
      description: [
        "Our website is designed to help businesses create office layouts, browse interior solutions, and connect with vendors for office furniture, HVAC, lighting, and automation products.",
        "Users must ensure that the information they provide on our platform is accurate and used responsibly.",
        "Any misuse, unauthorized access, or fraudulent activity on our platform may result in restricted access or account suspension.",
      ],
    },
    {
      title: "Content & Intellectual Property",
      description: [
        "All content, including text, images, designs, and software on our website, is the property of Workved Interiors and is protected by copyright laws.",
        "You may not copy, distribute, or use any content from our website without prior written permission.",
        "Vendor products, images, and descriptions belong to their respective owners, and Workved Interiors is not responsible for any inaccuracies or changes in product details.",
      ],
    },
    {
      title: "Vendor Listings & Products",
      description: [
        "We collaborate with third-party brands to showcase products, but we do not manufacture, sell, or guarantee these products.",
        "Prices, specifications, and availability of products are determined by the vendors and may change at their discretion.",
        "Any concerns regarding a product’s quality, delivery, or warranty should be addressed directly with the vendor.",
      ],
    },
    {
      title: "Payments & Transactions",
      description: [
        "If you choose to purchase a product or service through our platform, all transactions will be managed by the respective vendor.",
        "Workved Interiors is not responsible for refunds, returns, or disputes related to payments made to vendors.",
        "We recommend reviewing the vendor’s terms before making any purchases.",
      ],
    },
    {
      title: "Limitation of Liability",
      description: [
        "While we strive to provide accurate and up-to-date information, we do not guarantee that our platform will always be error-free or uninterrupted.",
        "We are not liable for any loss, damage, or inconvenience caused due to inaccuracies in vendor listings, delayed deliveries, or any third-party actions.",
      ],
    },
    {
      title: "Privacy & Data Protection",
      description: [
        "We value your privacy and take appropriate measures to protect your data.",
        "By using our website, you agree to our Privacy Policy, which details how we collect, use, and safeguard your information.",
        "We do not sell or share your personal data with third parties without your consent.",
      ],
    },
    {
      title: "Service Changes & Updates",
      description: [
        "Workved Interiors reserves the right to modify or discontinue any part of its services, website features, or vendor collaborations without prior notice.",
      ],
    },
    {
      title: "Governing Law",
      description: [
        "These Terms & Conditions shall be governed by and construed in accordance with the laws of Mumbai, India.",
        "Any legal disputes arising from these terms will be subject to the jurisdiction of the courts in Mumbai.",
      ],
    },
  ];

  console.log(termsAndConditions);

  return (
    <>
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[40vh] flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10  uppercase font-lato font-extrabold pt-10">
          <h1 className="text-2xl lg:text-4xl text-white drop-shadow-lg ">
            Terms & conditions
          </h1>
        </div>
      </section>

      {/* context */}
      <section>
        <div className="lg:container lg:mx-auto mx-2 my-10">
          <div className="font-Poppins flex justify-center">
            <div className="mx-6 lg:mx-10 max-w-4xl ">
              {/* title */}
              {/* <div className="font-semibold xl:text-5xl capitalize text-center mb-10">
                <h2 className="leading-snug">Terms & Conditions</h2>
              </div> */}
              <p className="text-sm lg:text-lg xl:text-xl mb-5">
                Welcome to Workved Interiors! By accessing and using our
                website, you agree to the following terms and conditions. These
                ensure a smooth experience for all users and help us maintain
                transparency in our services. Please read them carefully.
              </p>
              {/* <div>
                <h2 className="text-lg font-bold">1. General</h2>
                <ul className="">
                  <li className="relative before:content-['●'] before:absolute before:left-0 before:text-black before:text-lg pl-6">
                    These Terms & Conditions apply to all users of our website
                    and services, including those exploring our platform,
                    creating layouts, or engaging with listed vendors.
                  </li>
                  <li className="relative before:content-['●'] before:absolute before:left-0 before:text-black before:text-lg pl-6">
                    We may update these terms periodically, so we encourage you
                    to review them regularly.
                  </li>
                </ul>
              </div> */}
              <div className="space-y-6">
                {termsAndConditions.map((term, index) => (
                  <div key={index}>
                    <h2 className="text-lg font-bold">
                      {index + 1}. {term.title}
                    </h2>
                    <ul>
                      {term.description.map((point, i) => (
                        <li
                          key={i}
                          className="relative before:content-['●'] before:absolute before:left-0 before:text-black before:text-lg lg:text-lg text-sm pl-6"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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

export default TermsAndCondition;
