import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function TermsAndCondition() {
  const background = "/images/contact-us/contactpage.png";
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
            Terms & condition
          </h1>
        </div>
      </section>

      {/* context */}
      <section>
        <div className="container mx-auto my-10">
          <div className="font-Poppins flex justify-center">
            <div className="mx-10 max-w-4xl ">
              {/* blog title */}
              <div className="font-semibold xl:text-5xl capitalize text-center mb-10">
                {/* <h2>
                    developing usefull product that would meet user’s needs
                  </h2> */}
                <h2 className="leading-snug">
                  developing usefull product that would meet user’s needs
                </h2>
              </div>
              <p className="xl:text-xl mb-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an
              </p>
              <p className="xl:text-xl mb-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an
              </p>
              <p className="xl:text-xl mb-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an
              </p>
              <p className="xl:text-xl mb-5">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an
              </p>
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
