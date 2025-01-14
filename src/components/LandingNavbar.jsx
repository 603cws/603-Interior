function LandingNavbar() {
  return (
    <div className=" mx-3 mt-3 border rounded-3xl">
      {/* flex box */}
      <div className="bg-[#FFFFFF] flex justify-between items-center border rounded-3xl">
        {/* logo */}
        <div className="mx-3">
          <img src="/logo/logo.png" alt="603 logo" className="h-12 w-20 " />
        </div>
        {/* middle section */}
        <div className=" bg-yellow-600">
          <ul className="flex gap-2">
            <li>Home</li>
            <li>Spaces</li>
            <li>About Us</li>
            <li>Our services</li>
            <li>Blog</li>
            <li>Images</li>
          </ul>
        </div>

        {/* last button */}
        <div className="mx-4">
          <button className="px-2 py-1 bg-green-700 border rounded-3xl">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingNavbar;
