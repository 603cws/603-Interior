import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function Privacy() {
  const background = "/images/contact-us/contactpage.png";
  const termsAndConditions = [
    {
      title: "Information We Collect",
      description: [
        "Personal Information: Name, email, phone number, and company details when you sign up or contact us.",
        "User Account: Details related to your account, including preferences and settings.",
        "Project Details: Information about your office space, design preferences, and BOQ selections.",
        "Payment Information: If you make a purchase, we collect billing details (processed securely through third-party payment gateways).",
        "Technical Data: IP address, device type, browser type, and cookies to improve website functionality.",
      ],
    },
    {
      title: "How We Use Your Information",
      description: [
        "Provide and improve our interior design services.",
        "Generate customized office layouts and BOQs.",
        "Respond to your inquiries and provide customer support.",
        "Send updates, promotions, and service-related communications (you can opt out anytime).",
        "Enhance website security and user experience.",
      ],
    },
    {
      title: "How We Share Your Information",
      description: [
        "Trusted Vendors & Partners: To help execute your design projects.",
        "Service Providers: For payment processing, website analytics, and customer support.",
        "Legal Authorities: If required to comply with legal obligations.",
      ],
    },
    {
      title: "Data Security & Protection",
      description: [
        "We implement strict security measures to protect your data from unauthorized access, misuse, or loss. However, no online transmission is 100% secure, so we recommend using strong passwords and protecting your personal information.",
      ],
    },
    {
      title: "Cookies & Tracking Technologies",
      description: [
        "Improve your browsing experience.",
        "Remember your preferences.",
        "Analyze website traffic.",
        "You can manage cookie settings through your browser.",
      ],
    },
    {
      title: "Your Rights & Choices",
      description: [
        "Access, update, or delete your personal information.",
        "Opt out of marketing emails at any time.",
        "Request details on how your data is used.",
      ],
    },
    {
      title: "Third-Party Links",
      description: [
        "Our website may contain links to third-party websites. We are not responsible for their privacy practices, so please review their policies before sharing any information.",
      ],
    },
    {
      title: "Changes to This Policy",
      description: [
        "We may update this Privacy Policy occasionally. Any changes will be posted here with an updated Effective Date.",
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
            Privacy Policy
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
                <h2 className="leading-snug">Privacy Policy</h2>
              </div> */}
              <p className="text-sm lg:text-lg xl:text-xl mb-5">
                Welcome to Workved Interiors. Your privacy is important to us.
                This Privacy Policy explains how we collect, use, share, and
                protect your personal information when you visit our website and
                use our services.
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

export default Privacy;
