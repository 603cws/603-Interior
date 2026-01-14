import LandingNavbar from "../components/LandingNavbar";
import Footer from "../../common-components/Footer";
import HeroSection from "../components/HeroSection";

const privacyPolicy = [
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
function Privacy() {
  return (
    <>
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar className="relative" />
      </header>

      <HeroSection
        title={"Privacy & Policies"}
        description={
          "Learn How We Secure Your \n Data and Maintain Transparency\n in All Our Practices."
        }
        imagePath={"/images/privacypolicy.png"}
        showBtn={false}
      />

      <section>
        <div className="lg:container lg:mx-auto mx-2 my-10">
          <div className="font-TimesNewRoman flex justify-center">
            <div className="mx-6 lg:mx-10 max-w-4xl ">
              <p className="text-sm lg:text-lg xl:text-xl mb-5">
                Welcome to Workved Interiors. Your privacy is important to us.
                This Privacy Policy explains how we collect, use, share, and
                protect your personal information when you visit our website and
                use our services.
              </p>
              <div className="space-y-6">
                {privacyPolicy.map((term, index) => (
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
      <Footer />
    </>
  );
}

export default Privacy;
