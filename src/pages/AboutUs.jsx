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
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-500 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            {/* Text */}
            <h3 className="absolute text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              design
            </h3>
          </div>

          <div className="relative w-1/4 h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us-what-we-do-2.png')] bg-cover bg-center flex justify-center items-center">
            {/* Black Overlay with Bottom to Top Transition */}
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-500 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
            {/* Text */}
            <h3 className="absolute text-3xl uppercase z-10 text-white hidden group-hover:block transition-opacity duration-300 ease-in-out">
              redesign
            </h3>
          </div>

          <div className="relative w-1/4 h-[438px] cursor-pointer rounded-[100px] group overflow-hidden bg-[url('/images/about-us-what-we-do-3.png')] bg-cover bg-center flex justify-center items-center">
            {/* Black Overlay with Bottom to Top Transition */}
            <div className="absolute inset-0 before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-black/50 before:transition-all before:duration-500 before:ease-in-out group-hover:before:h-full rounded-[100px]"></div>
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

//  return (
//     <div>
//       {/* <section className="flex flex-col h-[80vh] bg-[url('/images/AboutUs.png')] bg-cover bg-center">
//         <div>
//           <LandingNavbar />
//         </div>

//         <div className="flex-1  flex justify-end items-center">
//           <div className="mx-10 font-lato font-extrabold">
//             <h1 className=" text-6xl"> ABOUT US</h1>
//             <p className="text-xl text-end">THIS IS WHO WE ARE</p>
//           </div>
//         </div>
//       </section> */}

//       <section className="bg-[url('/images/AboutUsbg.png')] bg-cover bg-center">
//         <div className="">
//           <LandingNavbar />
//         </div>
//         <div className="flex-1 flex">
//           {/* img */}
//           <div className="">
//             <img
//               src="/images/aboutimg.png"
//               alt="about us"
//               className="bg-contain"
//             />
//           </div>
//           {/* text */}
//           <div className=" flex justify-end items-center">
//             <div className="mx-10 font-lato font-extrabold">
//               <h1 className=" text-6xl"> ABOUT US</h1>
//               <p className="text-xl text-end">THIS IS WHO WE ARE</p>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* why choose us section */}
//       <section className="container mx-auto">
//         <div className="flex justify-center items-center lg:py-8">
//           <h2 className="uppercase lg:text-5xl font-extrabold font-Poppins">
//             Why Choose us?
//           </h2>
//         </div>
//       </section>
//       {/* why choose us cards */}
//       <section className="container mx-auto my-4 lg:my-6">
//         {/* div for cards */}
//         <div className="flex  gap-2">
//           {/* div for each card */}
//           <div className="border-r-2 flex flex-col gap-3  border-[#1F5C54]">
//             {/* div for text */}
//             <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
//               <h3 className="font-extrabold lg:text-2xl text-center ">
//                 Experience
//               </h3>
//               <p className="text-center  text-sm">
//                  With a proven track record in designing our own coworking
//                 spaces, we have the expertise to handle projects of any scale.
//               </p>
//             </div>
//             {/* div for image */}
//             <div>
//               <img src="/images/aboutuscard1.png" alt="" />
//             </div>
//           </div>
//           {/* div for each card */}
//           <div className="border-r-2 flex flex-col gap-3  border-[#1F5C54]">
//             {/* div for text */}
//             <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
//               <h3 className="font-extrabold lg:text-2xl text-center ">
//                 Customization
//               </h3>
//               <p className="text-center  text-sm">
//                 Every project is unique, and we take pride in offering
//                 personalized solutions that meet your specific requirements.
//               </p>
//             </div>
//             {/* div for image */}
//             <div>
//               <img src="/images/aboutuscard2.png" alt="customization" />
//             </div>
//           </div>
//           {/* div for each card */}
//           <div className="border-r-2 flex flex-col gap-3  border-[#1F5C54]">
//             {/* div for text */}
//             <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
//               <h3 className="font-extrabold lg:text-2xl text-center ">
//                 quality
//               </h3>
//               <p className="text-center  text-sm">
//                 We are committed to maintaining the highest standards of quality
//                 in every aspect of our work, from materials to craftsmanship.
//               </p>
//             </div>
//             {/* div for image */}
//             <div>
//               <img src="/images/aboutuscard3.png" alt="quality" />
//             </div>
//           </div>
//           {/* div for each card */}
//           <div className=" flex flex-col gap-3  ">
//             {/* div for text */}
//             <div className="font-Poppins flex flex-col  gap-4 lg:gap-8  text-[#1A3A36] uppercase py-8">
//               <h3 className="font-extrabold lg:text-2xl text-center ">
//                 Innovation
//               </h3>
//               <p className="text-center  text-sm">
//                 Our designs are forward-thinking, integrating the latest trends
//                 and technologies to create future-ready work spaces.
//               </p>
//             </div>
//             {/* div for image */}
//             <div>
//               <img src="/images/aboutuscard4.png" alt="innovaction" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* footer */}
//       <Footer />
//     </div>
//   );
