import LandingNavbar from "../common-components/LandingNavbar";
function HeroSection({ background, title }) {
  return (
    <div>
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase font-lora font-bold">
          <h1 className="text-4xl md:text-5xl  text-white drop-shadow-lg">
            {title}
          </h1>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
