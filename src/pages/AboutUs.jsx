import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function AboutUs() {
  return (
    <>
      {/* Hero image */}
      <section
        className="bg-[url('/images/about-us-bg.png')] w-full h-screen bg-no-repeat bg-cover"
        style={{ backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="z-10 relative">
          <LandingNavbar />
          <div className="flex flex-col justify-center items-center h-screen text-white font-lato gap-3">
            <h1 className="text-7xl font-extrabold ">About Us</h1>
            <p className="text-2xl font-extrabold">THIS IS WHO WE ARE</p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="what-we-do container mx-auto py-10 bg-[url('/images/about-us-s2-bg.png')] bg-no-repeat bg-top bg-[length:100%_50%]">
        <div className="text-center">
          <img
            src="/images/serviceIcon.png"
            alt="service icon"
            className="mx-auto"
          />
          <h3 className="font-extrabold uppercase text-2xl font-Poppins my-5">
            what we do
          </h3>
          <p className="font-Poppins font-semibold text-xl uppercase">
            We help anyone create great design <br />
            for their office
          </p>
        </div>
        <div className="flex justify-center gap-10 font-Poppins font-bold text-white my-10 pt-5">
          <div className="relative w-1/4 h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us-what-we-do-1.png')] bg-cover bg-center flex justify-center items-center">
            {/* Black Overlay with Bottom to Top Transition */}
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            {/* Text */}
            <h3 className="absolute text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              design
            </h3>
          </div>

          <div className="relative w-1/4 h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us-what-we-do-2.png')] bg-cover bg-center flex justify-center items-center">
            {/* Black Overlay with Bottom to Top Transition */}
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            {/* Text */}
            <h3 className="absolute text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              redesign
            </h3>
          </div>

          <div className="relative w-1/4 h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us-what-we-do-3.png')] bg-cover bg-center flex justify-center items-center">
            {/* Black Overlay with Bottom to Top Transition */}
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-700 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            {/* Text */}
            <h3 className="absolute text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              production
            </h3>
          </div>
        </div>
      </section>

      {/* our team */}
      <section className="our-team container mx-auto my-10">
        <div className="text-center">
          <img
            src="/images/serviceIcon.png"
            alt="service icon"
            className="mx-auto"
          />
          <h3 className="font-extrabold uppercase text-2xl font-Poppins my-5">
            our team
          </h3>
          <p className="font-Poppins font-semibold text-xl uppercase">
            We help anyone create great design <br />
            for their office
          </p>
        </div>
        <div className="w-full flex justify-center gap-6 font-Poppins font-bold text-3xl uppercase text-center mt-10">
          <div className="w-1/4 ">
            <img src="/images/our-team.png" alt="team-member" />
            <h2 className="my-3">kean Olivia</h2>
            <h2 className="text-[#B1B1B1]">designer</h2>
          </div>
          <div className="w-1/4 ">
            <img src="/images/our-team.png" alt="team-member" />
            <h2 className="my-3">kean Olivia</h2>
            <h2 className="text-[#B1B1B1]">designer</h2>
          </div>
          <div className="w-1/4">
            <img src="/images/our-team.png" alt="team-member" />
            <h2 className="my-3">kean Olivia</h2>
            <h2 className="text-[#B1B1B1]">designer</h2>
          </div>
        </div>
      </section>

      {/* contact us */}
      <section className="contact-us bg-[url('/images/about-us-s3-bg.png')] bg-no-repeat bg-cover py-10 relative">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white font-Poppins flex flex-col justify-between items-center gap-20 text-center my-7">
          <h2 className="font-extrabold uppercase text-4xl">
            need to redesign your work space
            <br />
            contact us now
          </h2>
          <button className="capitalize bg-[#34BFAD] border-[1px] border-black rounded-lg px-10 py-3">
            contact us
          </button>
        </div>
      </section>

      {/* footer */}
      <Footer />
    </>
  );
}

export default AboutUs;
