import { RiArrowRightUpLine } from "react-icons/ri";
import { useState } from "react";
import ContactUsPopup from "../pages/ContactUsPopup";

function GetInTouchSection() {
  const [showContactPopup, setShowContactPopup] = useState(false);
  return (
    <>
      <section className="bg-[url('images/about-us/contact-section-bg.jpg')] bg-no-repeat bg-cover bg-center py-24">
        <div className="lg:container px-4 flex justify-center items-center text-[#fff]">
          <div className="md:flex gap-7 bg-[#000]/20 backdrop-blur-sm p-5 md:p-10 rounded-sm">
            <h2 className="font-medium text-3xl md:text-5xl">
              Unlock Your Dream <br /> Office Today!
            </h2>
            <div>
              <p className="text-sm md:text-base">
                We encourage clients to actively participate in discussions,{" "}
                <br />
                share their ideas, preferences, and feedback.
              </p>
              <div className="flex flex-col lg:flex-row gap-2 mt-5">
                <button
                  onClick={() => setShowContactPopup(true)}
                  className="bg-[#1C346B] border border-[#1C346B] px-4 py-2 rounded-3xl flex justify-center items-center gap-1 text-sm md:text-base w-fit"
                >
                  <span>Get in touch</span>
                  <RiArrowRightUpLine />
                </button>
                <a
                  href="tel:+919136036603"
                  className="bg-[#FFFFFF]/20 px-4 py-2 rounded-3xl border border-[#fff] text-sm md:text-base w-fit"
                >
                  Call us: +91-9136036603
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showContactPopup && (
        <ContactUsPopup onClose={() => setShowContactPopup(false)} />
      )}
    </>
  );
}

export default GetInTouchSection;
