import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
import { useState } from "react";
function Contactus() {
  const [source] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.863450465455!2d72.83606987497727!3d19.069740382133556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c92c0d0b6e99%3A0xef5042f332e3cb5a!2s603%20The%20Coworking%20Space!5e0!3m2!1sen!2sin!4v1737093785204!5m2!1sen!2sin"
  );
  return (
    <div className="">
      {/* section 1 */}
      <section className="flex flex-col h-screen bg-[url('/images/Contactus.png')] bg-cover bg-center">
        {/* <section className="flex flex-col h-[75vh]  bg-[url('/images/resize2.png')] bg-white bg-cover bg-center bg-no-repeat"> */}
        <div>
          <LandingNavbar />
        </div>

        <div className="flex-1  flex justify-end items-center">
          <div className="mx-10 font-lato font-extrabold uppercase">
            <h1 className=" text-6xl">contact Us</h1>
            <p className="text-xl text-end">connect with us</p>
          </div>
        </div>
      </section>

      {/* section2 */}
      <section>
        {/* container */}
        <div className="container mx-auto"></div>
      </section>

      {/* section 3 */}
      <section>
        <div className="flex my-2">
          {/* div for text */}
          <div className="flex justify-center items-center mx-32">
            <div className="font-Poppins">
              <h2 className=" font-medium text-4xl">SEE US AT:</h2>
              <p className="text-sm">
                Makhija Arcade, 35th Rd, Khar West,
                <br />
                Mumbai Maharashtra 400052
              </p>
            </div>
          </div>

          {/* div for map */}
          <div className="flex-1 bg-gradient-to-r from-gray-100 to-yellow-100">
            <iframe
              src={source}
              className="w-full h-80 rounded-lg shadow-lg"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <Footer />

      {/* contatus form button  */}
      {/* <button className="rotate-90 absolute top-50 right-0 bg-red-600 px-5 py-2">
        Contact Form
      </button> */}
    </div>
  );
}

export default Contactus;
