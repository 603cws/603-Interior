import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import { IoCallOutline } from "react-icons/io5";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Landing() {
  const [expandedIndex, setExpandedIndex] = useState();

  const navigate = useNavigate();
  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Enables smooth scrolling
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
  };
  const settingsWork = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    // pauseOnHover: true,
    arrows: false,
  };
  const settingsProduct = {
    // vertical: true,
    // verticalSwiping: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
  };

  const accordionItems = [
    { title: "How can i contact support ?", content: "Content for section 1." },
    { title: "How can i contact support ?", content: "Content for section 1." },
    { title: "How can i contact support ?", content: "Content for section 1." },
    { title: "How can i contact support ?", content: "Content for section 1." },
    { title: "How can i contact support ?", content: "Content for section 1." },
  ];

  return (
    <div>
      {/* section 1 */}
      <section className="flex flex-col h-screen bg-[url('/images/Hero.png')] bg-cover bg-center">
        <LandingNavbar />

        {/* text div */}
        <div className="flex-1 flex flex-col justify-center items-center text-white">
          <h1 className="font-lato text-[64px]">Create your Space</h1>
          <p className="font-Poppins text-[32px]">
            We create unique style and design for your office
          </p>
          <button
            className="border border-transparent px-5 bg-[#1F5C54] py-3 mt-3 font-Poppins font-bold transform transition-transform duration-300 ease-in-out hover:scale-110 "
            onClick={() => navigate("/Layout")}
          >
            Make Your space
          </button>
        </div>
      </section>
      {/* section 2 */}
      <section className="bg-[#1F5C54] ">
        <div className="container mx-auto  flex flex-col text-white ">
          {/* div for the text */}
          <div className="flex flex-col justify-center items-center mt-7 font-sans mb-5">
            <h2 className="text-[#34BFAD]">Luxurious Office Interiors</h2>
            <img src="/images/serviceIcon.png" alt="service icon" />
            <p className="font-lato text-5xl font-semibold mb-2">
              We Offer Top Notch
            </p>
            <p className="text-center text-[12px] font-Poppins">
              We offer top-notch products designed to meet all your <br></br>
              office space needs..
            </p>
          </div>
          {/* div for the carousel */}
          <div className="flex-1 my-5 ">
            {/* div for images  */}
            <div className="flex justify-center items-center gap-10 mb-20">
              {/* image 1 */}
              <div className="hover:bg-white group text-center hover:border hover:rounded-xl hover:transition duration-700 ease-in-out">
                <img
                  src="/images/section2-img1.png"
                  alt="pantary"
                  className="group-hover:m-5"
                />
                <p className="hidden group-hover:block font-lora font-bold text-[#333333] mb-1">
                  Meeting Room
                </p>
                <p className=" hidden group-hover:block text-[#34BFAD] font-sans font-bold mb-2">
                  Create Space
                </p>
              </div>
              {/* image 1 */}
              <div className="bg-white group text-center hover:border hover:rounded-xl hover:transition duration-700 ease-in-out">
                <img
                  src="/images/section2-img2.png"
                  alt="pantary"
                  className="group-hover:m-5"
                />
                <p className="hidden group-hover:block font-lora font-bold text-[#333333] mb-1">
                  Meeting Room
                </p>
                <p className=" hidden group-hover:block text-[#34BFAD] font-sans font-bold mb-2">
                  Create Space
                </p>
              </div>
              {/* image 1 */}
              <div className="bg-white group text-center hover:border hover:rounded-xl hover:transition duration-700 ease-in-out">
                <img
                  src="/images/section2-img3.png"
                  alt="pantary"
                  className="group-hover:m-5"
                />
                <p className="hidden group-hover:block font-lora font-bold text-[#333333] mb-1">
                  Meeting Room
                </p>
                <p className=" hidden group-hover:block text-[#34BFAD] font-sans font-bold mb-2">
                  Create Space
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 3 */}
      <section className="bg-[#F4F4F4]">
        {/* <div className="container mx-auto flex my-10 gap-32"> */}
        <div className="container mx-auto flex py-10 gap-32">
          {/* div for textual part */}
          <div>
            <div className="flex flex-col justify-center items-center gap-2 mb-3">
              <p className="text-[#1F5C54] font-sans font-bold ">our story</p>
              <img src="/images/serviceIcon.png" alt="service icon" />
              <h2 className="text-center text-[#212121] font-bold text-5xl font-lato">
                Welcome to 603 <br /> Interiors
              </h2>
            </div>
            <p className="text-[#212121] font-sans mb-3">
              At 603 Interiors, we believe that the right workspace can
              transform the way <br /> you work. Our expertise in designing
              functional, aesthetically pleasing, and <br /> customized office
              spaces sets us apart. With a dedicated in-house design <br /> team
              that has successfully crafted inspiring environments for 603 The{" "}
              <br />
              Coworking Space, we bring the same innovation and precision to
              your <br /> corporate office. Whether you're looking to redesign
              your existing office or <br /> create a new space from scratch,
              603 Interiors offers end-to-end solutions <br /> tailored to your
              business needs. Experience the perfect blend of creativity,
              <br /> efficiency, and functionality with 603 Interiors – where
              every space is <br /> designed with purpose.
            </p>
            {/* buton and call div */}
            <div className="flex justify-around items-center">
              <button
                onClick={() => navigate("/AboutUs")}
                className="px-5 py-3 border border-[#34BFAD] font-sans font-bold text-[#34BFAD] hover:bg-[#34BFAD] hover:text-[#212121]"
              >
                Read More
              </button>
              <div>
                {/* image  */}
                <div className="flex justify-center items-center gap-2">
                  <div
                    className="bg-[#34BFAD] w-[32px] h-[32px] rounded-full flex justify-center items-center cursor-pointer"
                    onClick={() => navigate("/ContactUs")}
                  >
                    <IoCallOutline size={20} color="white" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-sans font-bold text-[#212121]">
                      Book Through Call
                    </p>
                    <p className="font-sans text-[#34BFAD]">+91 9136036603</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* div for image */}
          <div className="flex-1 flex justify-center items-center">
            <img src="/images/section3Welcome.png" alt="welcome interior" />
          </div>
        </div>
      </section>

      {/* section buy our product */}
      <section>
        {/* div for container */}
        <div className="container mx-auto relative my-10">
          {/* div for text */}
          <div className="flex flex-col gap-5 justify-center items-center absolute w-1/2 top-[80px] left-[-150px]">
            <div className="flex flex-col justify-center items-center">
              <p className="font-sans"> our products</p>
              <img src="/images/serviceIcon.png" alt="service icon" />
              <h3 className="font-Poppins text-3xl font-semibold">
                Buy Our Product
              </h3>
            </div>
            <div>
              <button className=" bg-[#34BFAD] px-5 py-2">View More</button>
            </div>
          </div>
          {/* div for caurosel */}
          <div className="slider-container w-3/4 ml-auto">
            <Slider {...settingsProduct}>
              <div className=" bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
                <img
                  className="object-center"
                  src="images/sectionproduct1.png "
                  alt="sectionproduct"
                />
                <div className="text-center w-1/2 text-[#111111] text-sm font-bold font-Poppins capitalize">
                  <span>Table Lamp</span>
                </div>{" "}
              </div>
              <div className=" bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
                <img
                  className="object-center"
                  src="images/sectionproduct2.png "
                  alt="sectionproduct"
                />
                <div className="text-center w-1/2  text-[#111111] text-sm font-bold font-Poppins capitalize">
                  <span>Table Lamp</span>
                </div>{" "}
              </div>
              <div className=" bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
                <img
                  className="object-center"
                  src="images/sectionproduct3.png "
                  alt="sectionproduct"
                />
                <div className="text-center w-1/2  text-[#111111] text-sm font-bold font-Poppins capitalize">
                  <span>Table Lamp</span>
                </div>{" "}
              </div>
              <div className=" bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
                <img
                  className="object-center"
                  src="images/sectionproduct4.png "
                  alt="sectionproduct"
                />
                <div className="text-center w-1/2  text-[#111111] text-sm font-bold font-Poppins capitalize">
                  <span>Table Lamp</span>
                </div>{" "}
              </div>
              <div className=" bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
                <img
                  className="object-center"
                  src="images/sectionproduct5.png "
                  alt="sectionproduct"
                />
                <div className="text-center w-1/2  text-[#111111] text-sm font-bold font-Poppins capitalize">
                  <span>Table Lamp</span>
                </div>{" "}
              </div>
              {/* <div className="bg-green-800 ">
                <img
                  src="/images/sectionproduct1.png"
                  alt="section product"
                  className="bg-yellow-600 object-contain"
                />
                <p className="">lamps</p>
              </div>
              <div>
                <img src="/images/sectionproduct2.png" alt="section product" />
              </div>
              <div>
                <img src="/images/sectionproduct3.png" alt="section product" />
              </div>
              <div>
                <img src="/images/sectionproduct4.png" alt="section product" />
              </div>
              <div>
                <img src="/images/sectionproduct5.png" alt="section product" />
              </div> */}
              {/* <div>
                <img src="/images/sectionproduct1.png" alt="section product" />
              </div>
              <div>
                <img src="/images/sectionproduct1.png" alt="section product" />
              </div> */}
            </Slider>
          </div>
        </div>
      </section>

      {/* section for buy  */}

      {/* section our Work */}
      <section>
        {/* container */}
        <div className="container mx-auto flex flex-col gap-10">
          {/* textual part */}
          <div className="flex flex-col justify-center items-center">
            <p className="text-[#1F5C54]">our work</p>
            <img src="/images/serviceIcon.png" alt="service icon" />
            <h3 className="text-5xl font-lato font-semibold">Our Works</h3>
          </div>

          {/* slider for images */}

          <div className="flex-1">
            <Slider {...settingsWork}>
              <div>
                <img src="/images/sectionwork1.png" alt="work section" />
              </div>
              <div>
                <img src="/images/sectionwork2.png" alt="work section" />
              </div>
              <div>
                <img src="/images/sectionwork3.png" alt="work section" />
              </div>
              <div>
                <img src="/images/sectionwork4.png" alt="work section" />
              </div>
              <div>
                <img src="/images/sectionwork5.png" alt="work section" />
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* section 5 */}
      <section className="bg-[#1F5C54]">
        {/* container */}
        <div className="container mx-auto flex flex-col py-10">
          {/* text */}
          <div className="flex flex-col justify-center items-center mb-3">
            <p className="text-white font-semibold font-sans">Our Client</p>
            <img src="/images/serviceIcon.png" alt="service icon" />
          </div>
          {/* logo slider */}
          <div>
            <Slider {...settings}>
              <div>
                <img src="/images/facebook.png" alt="facebook" />
              </div>
              <div>
                <img src="/images/bajaj.png" alt="bajaj" />
              </div>
              <div>
                <img src="/images/facebook.png" alt="facebook" />
              </div>
              <div>
                <img src="/images/bajaj.png" alt="bajaj" />
              </div>
              <div>
                <img src="/images/facebook.png" alt="facebook" />
              </div>
              <div>
                <img src="/images/bajaj.png" alt="bajaj" />
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* section6 */}
      <section className="bg-gradient-to-t from-[#f4f4f4] via-[#f4f4f4] to-[#D0D0D0] ">
        <div className="container mx-auto flex justify-around items-center py-10 ">
          {/* <div className="w-[350px] h-[520.78px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tr-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex "> */}
          <div className="w-[350px] h-[450px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tr-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex relative z-10">
            <div className="h-[255px] relative">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-white text-[15px] font-normal font-['Lora'] leading-normal" */}
              <div className="w-[250px] h-[255px] right-[-100px] top-0 absolute text-center text-white text-sm font-normal font-['Lora'] leading-normal">
                Creativity flows freely at 603 The Coworking Space. As a content
                creator, I find the ambiance truly inspiring. Being surrounded
                by fellow creatives has led to unexpected collaborations and
                projects. It's like working in a hub of innovation, and I
                couldn't be happier with my choice.
              </div>
            </div>
            <img
              className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
              src="/images/testimonalicon.png"
              alt="testimonal person "
            />
            <div className="self-stretch h-[18.89px] text-center text-white text-lg font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Sakshi
            </div>
            <div className="self-stretch h-[18.89px] text-center text-[#33bead] text-lg font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Manager
            </div>
            <div className="absolute right-[-20px] top-0">
              <img src="/images/testimonalicon1.png" alt="testimonalicon" />
            </div>
          </div>
          {/* second div */}
          {/* <div className="w-[350px] h-[525px] p-[30px] bg-white rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px] border border-[#33bead] flex-col justify-start items-center gap-[18px] inline-flex"> */}
          <div className="w-[350px] h-[450px] p-[30px] bg-white rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px] border border-[#33bead] flex-col justify-start items-center gap-[18px] inline-flex">
            <div className="h-[255px] relative">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-[#141515] text-[15px] font-normal font-['Lora'] leading-normal"> */}
              <div className="w-[250px] h-[255px] right-[-110px] top-5 absolute text-center text-[#141515] text-sm font-normal font-['Lora'] leading-normal">
                Creativity flows freely at 603 The Coworking Space. As a content
                creator, I find the ambiance truly inspiring. Being surrounded
                by fellow creatives has led to unexpected collaborations and
                projects. It's like working in a hub of innovation, and I
                couldn't be happier with my choice.
              </div>
            </div>
            <img
              className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
              src="/images/testimonal2.png"
              alt="testimonal person "
            />
            <div className="self-stretch h-[18.89px] text-center text-[#1a3a36] text-lg font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Sakshi
            </div>
            <div className="self-stretch h-[18.89px] text-center text-[#33bead] text-lg font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Manager
            </div>
          </div>

          {/* div 3 */}
          {/* <div className="w-[350px] h-[520.78px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tl-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex"> */}
          <div className="w-[350px] h-[450px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tl-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex relative">
            <div className="h-[255px] relative">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-white text-[15px] font-normal font-['Lora'] leading-normal"> */}
              <div className="w-[250px] h-[255px] right-[-115px] top-3 absolute text-center text-white text-sm font-normal font-['Lora'] leading-normal">
                Creativity flows freely at 603 The Coworking Space. As a content
                creator, I find the ambiance truly inspiring. Being surrounded
                by fellow creatives has led to unexpected collaborations and
                projects. It's like working in a hub of innovation, and I
                couldn't be happier with my choice.
              </div>
            </div>
            <img
              className="w-[100px] h-[100px] relative rounded-[100px] border border-[#1a3a36]"
              src="/images/testimonalicon.png"
              alt="testimonal person "
            />
            <div className="self-stretch h-[18.89px] text-center text-white text-lg font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Sakshi
            </div>
            <div className="self-stretch h-[18.89px] text-center text-[#33bead] text-lg font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[3.52px]">
              Manager
            </div>
            <div className="absolute right-[-20px] bottom-0">
              <img src="/images/testimonalicon2.png" alt="testimonalicon" />
            </div>
          </div>
        </div>
      </section>

      {/* section FAQ */}
      <section className="bg-gradient-to-t from-[#f4f4f4] via-[#f4f4f4] to-[#D0D0D0]">
        {/* container */}
        <div className="container mx-auto flex">
          {/* a div for image */}
          <div>
            <img src="/images/sectionFAQ.png" alt="FAQ Section" />
          </div>
          {/* div for Faq */}
          <div className="flex-1 ">
            <h2 className="font-bold font-Poppins text-3xl text-center my-10">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col m-auto ">
              {accordionItems.map((item, index) => (
                // <div key={index} className="border-b last:border-b-0">
                <div
                  key={index}
                  className="mb-3 text-[#141515] font-Poppins font-medium"
                >
                  <div
                    className="flex w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none justify-between cursor-pointer rounded-xl"
                    onClick={() => handleToggle(index)}
                  >
                    <button
                    // className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    // className="w-full text-left p-4 "
                    // onClick={() => handleToggle(index)}
                    >
                      {item.title}
                    </button>
                    {expandedIndex === index ? <FaAngleUp /> : <FaAngleDown />}
                  </div>
                  {expandedIndex === index && (
                    <div className="p-4 bg-white border-t rounded-xl">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;

// // section 4
// {/* section 4 */}
// <section className="">
// {/* container */}
// <div className="container mx-auto py-10 flex">
//   {/* div 1 */}
//   <div className="flex flex-col gap-10 ">

//   </div>

//   {/* carosauel */}
//   <div className="flex-1 flex">
//     {/* <p>hello world</p> */}
//     <Slider {...settinsSelectProduct}>
//       <div>
//         <img src="/images/facebook.png" alt="facebook" />
//       </div>
//       <div>
//         <img src="/images/bajaj.png" alt="bajaj" />
//       </div>
//       <div>
//         <img src="/images/facebook.png" alt="facebook" />
//       </div>
//       <div>
//         <img src="/images/bajaj.png" alt="bajaj" />
//       </div>
//       <div>
//         <img src="/images/facebook.png" alt="facebook" />
//       </div>
//       <div>
//         <img src="/images/bajaj.png" alt="bajaj" />
//       </div>
//     </Slider>
//   </div>
// </div>
// </section>

// <section>
// <div className="w-[1440px] h-[588px] relative bg-[#f4f4f4]  overflow-hidden">
//   <div className="w-[151px] h-[13px] left-[154px] top-[160px] absolute text-center text-[#1f5c54] text-xs font-bold font-['DM Sans'] uppercase leading-[29.60px] tracking-[4.80px]">
//     Our Products
//   </div>
//   <div className="w-[145px] h-[29px] left-[157px] top-[187px] absolute">
//     <div className="w-[145px] h-[30px] left-0 top-0 absolute  overflow-hidden">
//       <div className="w-[145px] h-[13px] left-0 top-[8px] absolute  overflow-hidden" />
//     </div>
//   </div>
//   <div className="w-[367px] h-[81px] left-[46px] top-[239px] absolute text-center text-[#1f5c54] text-[40px] font-semibold font-['Poppins'] leading-[81.60px]">
//     Buy Our Products
//   </div>
//   <div className="w-6 h-6 left-[973px] top-[505px] absolute border-l-2 border-t-2 border-[#33bead]  overflow-hidden">
//     <div className="w-6 h-6 px-1 py-1.5 left-[24px] top-0 absolute origin-top-left rotate-180 border-l-2 border-b-2 border-[#1f5c54] flex-col justify-center items-center gap-2.5 inline-flex" />
//   </div>
//   <div className="w-6 h-6 left-[953px] top-[505px] absolute origin-top-left rotate-180  overflow-hidden">
//     <div className="w-6 h-6 px-1 py-1.5 left-[24px] top-0 absolute origin-top-left rotate-180 border-2 border-[#1f5c54] flex-col justify-center items-center gap-2.5 inline-flex" />
//   </div>
//   <div className="w-[318px] h-[287px] left-[1098px] top-[74px] absolute bg-[#c2cece]" />
//   <div className="w-[88px] h-10 pl-px pr-1 pt-px pb-1 left-[186px] top-[406px] absolute bg-black flex-col justify-start items-start gap-2.5 inline-flex">
//     <div className="w-[83px] h-[35px] relative bg-[#33bead]  overflow-hidden">
//       <div className="w-[83px] h-[35px] left-0 top-0 absolute text-center text-black text-xs font-normal font-['Poppins'] leading-normal">
//         View More
//       </div>
//     </div>
//   </div>
//   <div className="py-5 left-[487px] top-[111px] absolute justify-start items-center gap-10 flex flex-col">
//     <div className="flex gap-10">
//       <div className="w-[221px] h-[327px] pb-[30px] bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
//         <img
//           className="self-stretch h-[248px]"
//           src="images/sectionproduct1.png "
//         />
//         <div className="self-stretch h-[29px] text-center text-[#111111] text-xs font-bold font-['Poppins'] capitalize leading-[15px] tracking-wider">
//           Table Lamp
//         </div>
//       </div>
//       <div className="w-[221px] h-[327px] pb-[30px] bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
//         <img
//           className="self-stretch h-[248px]"
//           src="images/sectionproduct1.png
//         "
//         />
//         <div className="self-stretch h-[29px] text-center text-[#111111] text-xs font-bold font-['Poppins'] capitalize leading-[15px] tracking-wider">
//           Arm Chair
//         </div>
//       </div>
//       <div className="w-[221px] h-[327px] pb-[30px] bg-gradient-to-tr from-[#d9d9d9] to-neutral-500 flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
//         <img
//           className="self-stretch h-[248px]"
//           src="images/sectionproduct1.png
//         "
//         />
//         <div className="self-stretch h-[29px] text-center text-[#111111] text-xs font-bold font-['Poppins'] capitalize leading-[15px] tracking-wider">
//           Hanging Light
//         </div>
//       </div>
//       <div className="w-[221px] h-[327px] pb-[30px] bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
//         <img
//           className="self-stretch h-[248px]"
//           src="images/sectionproduct1.png
//         "
//         />
//         <div className="self-stretch h-[29px] text-center text-[#111111] text-xs font-bold font-['Poppins'] capitalize leading-[15px] tracking-wider">
//           Executive Chair
//         </div>
//       </div>
//       <div className="w-[221px] h-[327px] pb-[30px] bg-[#f2f2f2] flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
//         <img
//           className="self-stretch h-[248px]"
//           src="images/sectionproduct1.png
//         "
//         />
//         <div className="self-stretch h-[29px] text-center text-[#111111] text-xs font-bold font-['Poppins'] capitalize leading-[15px] tracking-wider">
//           Chairs
//         </div>
//       </div>
//       <div className="w-[221px] h-[327px] pb-[30px] bg-white flex-col justify-center items-center gap-5 inline-flex overflow-hidden">
//         <img
//           className="self-stretch h-[245px]"
//           src="images/sectionproduct1.png"
//         />
//         <div className="self-stretch h-[29px] text-center text-[#111111] text-xs font-bold font-['Poppins'] capitalize leading-[15px] tracking-wider">
//           Table Clock
//         </div>
//       </div>
//     </div>
//     {/* div for button */}
//     <div className="flex justify-around gap-10">
//       <FaArrowLeft />
//       <FaArrowRight />
//     </div>
//   </div>
// </div>
// </section>
