import React, { useState, useEffect } from "react";
import LandingNavbar from "../common-components/LandingNavbar";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Slider from "react-slick";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import "../styles/Landing.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useNavigate } from "react-router-dom";
import Footer from "../common-components/Footer";
import {
  BiSolidLeftArrowSquare,
  BiSolidRightArrowSquare,
} from "react-icons/bi";
import { IoIosCall } from "react-icons/io";

function Landing() {
  const [expandedIndex, setExpandedIndex] = useState();
  const heroImages = [
    "/images/Hero.png",
    "/images/Hero-image-1.png",
    "/images/Hero-image-2.png",
    "/images/Hero-image-3.png",
    "/images/Hero-image-4.png",
    "/images/Hero-image-5.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [heroImages.length]);

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
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1800, // Tailwind's custom 3xl breakpoint
        settings: {
          slidesToShow: 5, // Show 5 slides only on 3xl screens
        },
      },
    ],
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
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false, //true
  };

  const accordionItems = [
    {
      title: "1.What is 603 Interiors?",
      content:
        "603 Interiors is a tech-driven platform that helps corporates design and set up their office spaces with instant layouts, smart BOQs, and vendor partnerships, ensuring a hassle-free experience",
    },
    {
      title: "2.Who can use 603 Interiors?",
      content:
        "Our platform is designed for corporates, startups, office administrators, HR teams, and real estate decision-makers looking for efficient office space planning and execution.",
    },
    {
      title: "3.How does 603 Interiors simplify office setup?",
      content:
        "We eliminate the need for lengthy consultations by offering instant office layouts, predefined and custom BOQs, and direct vendor collaboration, saving you time and costs.",
    },
    {
      title: "4.Is 603 Interiors only for large businesses?",
      content:
        "No, we cater to businesses of all sizes, from small startups to large corporations, providing scalable solutions for workspace design.",
    },
    {
      title: "5.Can I get a customized office layout?",
      content:
        "Yes! You can input your office requirements, and our system generates a tailored layout to match your needs.",
    },
  ];

  return (
    <div>
      {/* section 1 */}
      <section
        className={`relative flex flex-col h-screen bg-cover bg-center transition-all duration-1000`}
        style={{
          backgroundImage: `url(${heroImages[currentImageIndex]})`,
          backgroundAttachment: "fixed",
        }}
      >
        {/* Add a dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Content */}
        <div className="relative z-10 ">
          <LandingNavbar />

          {/* Text div */}
          <div className="flex justify-center items-center h-svh">
            <div className="flex-1 flex flex-col justify-center items-center text-white max-h-fit max-w-fit mx-auto p-5 rounded-xl mt-14 ">
              <h1 className="font-lato text-[64px]">Create your Space</h1>
              <p className="font-Poppins text-[32px]">
                We create unique style and design for your office
              </p>
              <button
                className="border border-transparent px-5 bg-[#1F5C54] py-3 mt-3 font-Poppins font-bold transform transition-transform duration-300 ease-in-out hover:scale-110"
                onClick={() => navigate("/Layout")}
              >
                Make Your Space
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* section 2 */}
      <section className="bg-[#1F5C54] md:h-[600px] lg:h-[700px] xl:h-[750px]">
        <div className="container mx-auto  flex flex-col text-white ">
          {/* div for the text */}
          <div className="flex flex-col justify-center items-center mt-7 font-sans mb-5">
            <p
              className="text-[#34BFAD] uppercase text-sm font-[10]"
              style={{ wordSpacing: "0.3em", letterSpacing: "0.2rem" }}
            >
              Luxurious Office Interiors
            </p>
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
          <div className="flex-1 my-7">
            {/* Container for Images */}
            <div className="flex justify-center gap-14 relative px-20 pb-10">
              {/* Image Card 1 */}
              <div className="group relative text-center w-1/3 h-auto overflow-hidden rounded-xl transition-all duration-700 ease-in-out">
                {/* <div className="group relative text-center max-w-sm h-auto overflow-hidden rounded-xl transition-all duration-700 ease-in-out"> */}
                <div className="flex flex-col items-center justify-center p-4 bg-transparent transition-all duration-700 ease-in-out group-hover:bg-white group-hover:scale-105 group-hover:py-8">
                  <img
                    src="/images/section2-img1.png"
                    alt="pantary"
                    className="mx-auto transition-transform duration-700 ease-in-out group-hover:scale-95 group-hover:origin-center"
                  />
                  <p className="hidden group-hover:block font-lora font-bold text-[#333333] mt-2">
                    Smart Office Layouts
                  </p>
                  <p className="hidden group-hover:block text-[#34BFAD] font-sans font-bold mt-1 uppercase tracking-widest text-xs ">
                    Space-optimized layouts tailored to your team’s needs.
                  </p>
                </div>
              </div>

              {/* Image Card 2 */}
              <div className="group relative text-center w-1/3 h-auto overflow-hidden rounded-xl transition-all duration-700 ease-in-out">
                {/* <div className="group relative text-center max-w-sm h-auto overflow-hidden rounded-xl transition-all duration-700 ease-in-out"> */}
                <div className="flex flex-col items-center justify-center p-4 bg-transparent transition-all duration-700 ease-in-out group-hover:bg-white group-hover:scale-105 group-hover:py-8">
                  <img
                    src="/images/section2-img2.png"
                    alt="pantary"
                    className="mx-auto transition-transform duration-700 ease-in-out group-hover:scale-95 group-hover:origin-center"
                  />
                  <p className="hidden group-hover:block font-lora font-bold text-[#333333] mt-2">
                    Custom BOQ
                  </p>
                  <p className="hidden group-hover:block text-[#34BFAD] font-sans font-bold mt-1 uppercase tracking-widest text-xs ">
                    fully customizable BOQs with trusted vendor recommendations
                  </p>
                </div>
              </div>

              {/* Image Card 3 */}
              <div className="group relative text-center w-1/3 h-auto overflow-hidden rounded-xl transition-all duration-700 ease-in-out">
                {/* <div className="group relative text-center max-w-sm h-auto overflow-hidden rounded-xl transition-all duration-700 ease-in-out"> */}
                <div className="flex flex-col items-center justify-center p-4 bg-transparent transition-all duration-700 ease-in-out group-hover:bg-white group-hover:scale-105 group-hover:py-8">
                  <img
                    src="/images/section2-img3.png"
                    alt="pantary"
                    className="mx-auto transition-transform duration-700 ease-in-out group-hover:scale-95 group-hover:origin-center"
                  />
                  <p className="hidden group-hover:block font-lora font-bold text-[#333333] mt-2">
                    End-to-End Execution
                  </p>
                  <p className="hidden group-hover:block text-[#34BFAD] font-sans font-bold mt-1 uppercase tracking-widest text-xs ">
                    From planning to procurement and setup, we ensure quality
                    and efficiency at every step
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 3 */}
      <section className="bg-[#F4F4F4] pb-24">
        {/* <div className="container mx-auto flex my-10 gap-32"> */}
        <div className="container mx-auto flex py-10 justify-around">
          {/* div for textual part */}
          <div>
            <div className="flex flex-col justify-center items-center gap-1">
              <p
                className="text-[#1F5C54] font-sans font-bold uppercase text-sm "
                style={{ wordSpacing: "0.3em", letterSpacing: "0.2rem" }}
              >
                our story
              </p>
              <img src="/images/serviceIcon.png" alt="service icon" />
            </div>
            <h2 className="text-center text-[#212121] font-bold text-5xl font-lato mb-3">
              Welcome to 603 <br /> Interiors
            </h2>

            <p className="text-[#212121] font-sans mb-10 text-justify">
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
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/AboutUs")}
                className="px-10 py-3.5 border border-[#34BFAD] font-sans text-[#34BFAD] hover:bg-[#34BFAD] hover:text-[#212121] uppercase font-thin text-sm tracking-wider"
              >
                Read More
              </button>
              {/* image  */}
              <div className=" w-1/2 flex justify-center items-center gap-2">
                <div
                  className="bg-[#34BFAD] w-[50px] h-[50px] rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => navigate("/ContactUs")}
                >
                  <IoIosCall size={35} color="white" />
                </div>
                <div className="flex flex-col">
                  <p className="font-sans font-bold text-[#212121] text-sm text-center">
                    Book Through Call
                  </p>
                  <p className="font-sans text-[#34BFAD] text-lg">
                    +91 9136036603
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* div for image */}
          <div className=" flex justify-end items-center h-full w-1/2">
            <img src="/images/welcome to interior.png" alt="welcome interior" />
          </div>
        </div>
      </section>

      {/* section buy our product */}
      <section className="bg-[url('/images/produt.png')] bg-cover bg-center py-4 h-1/2 pb-20">
        {/* div for container */}
        <div className="container mx-auto relative py-10 ">
          {/* div for text */}
          <div className="flex flex-col gap-12 justify-center items-center absolute w-1/2 top-[40px] left-[-200px] ">
            <div className="flex flex-col justify-center items-center pb-3">
              <p className="font-sans mb-1 text-[#1F5C54] font-bold uppercase text-sm">
                {" "}
                our products
              </p>
              <img src="/images/serviceIcon.png" alt="service icon" />
              <h3 className="font-Poppins text-3xl font-semibold my-4 text-[#1F5C54]">
                Buy Our Product
              </h3>
            </div>
            <div className="pt-16 pb-5">
              <button className=" bg-[#34BFAD] px-5 py-2 border-[1px] border-r-4 border-b-4 drop-shadow-xl border-black text-center text-black text-xs font-normal font-['Poppins'] leading-normal hover:scale-110 transition-transform">
                View More
              </button>
            </div>
          </div>
          {/* div for caurosel */}
          <div className="slider-container w-3/4 ml-auto">
            <Slider {...settingsProduct}>
              <div className="overflow-hidden">
                <div className="bg-white lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/sectionproduct1.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Table Lamp</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/sectionproduct2.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Chair</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/sectionproduct3.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Lights</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/sectionproduct4.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Chair</span>
                  </div>{" "}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="bg-white w-1/2 lg:w-[220px] lg:h-[320px] ">
                  <img
                    className=""
                    src="images/sectionproduct5.png "
                    alt="sectionproduct"
                  />
                  <div className="text-center text-[#111111] text-sm font-bold font-Poppins capitalize py-2">
                    <span>Table Lamp</span>
                  </div>{" "}
                </div>
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
      <section className="py-6">
        {/* container */}
        <div className="container max-w-full overflow-x-hidden py-2">
          {/* textual part */}
          <div className="flex flex-col justify-center items-center">
            <p className="font-sans mb-1 text-[#1F5C54] font-bold text-sm uppercase text tracking-wider">
              our work
            </p>
            <img src="/images/serviceIcon.png" alt="service icon" />
            <h3 className="text-5xl font-lato font-semibold uppercase">
              Our WORK
            </h3>
          </div>

          {/* slider for images */}
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={"auto"} // Ensures 5 slides are visible
            spaceBetween={30} // Adds spacing between slides
            initialSlide={3}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 100,
              modifier: 0.8,
            }}
            // pagination={{ el: ".swiper-pagination", clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
              clickable: true,
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="swiper_container max-w-screen overflow-x-hidden"
          >
            <SwiperSlide>
              <img src="/images/our-work/our-work-1.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-2.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-3.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-4.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-5.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-6.jpg" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-7.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-8.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-9.png" alt="work section" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/our-work/our-work-1.png" alt="work section" />
            </SwiperSlide>
            <div className="slider-controler">
              <div className="swiper-button-prev slider-arrow !static ml-[12%]">
                <BiSolidLeftArrowSquare
                  name="arrow-back-outline"
                  color={"#1A3A36"}
                />
              </div>
              <div className="swiper-button-next slider-arrow !static ml-6">
                <BiSolidRightArrowSquare
                  name="arrow-back-outline"
                  color={"#1A3A36"}
                />
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>
      </section>

      {/* section 5 */}
      <section className="mt-6 relative bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.1),0px_-5px_15px_rgba(0,0,0,0.1)]">
        {/* container */}
        <div className="container mx-auto flex flex-col py-10">
          {/* text */}
          <div className="flex flex-col justify-center items-center mb-3">
            <p className="font-sans mb-1 text-[#1F5C54] font-bold uppercase text-sm tracking-wider">
              Our Clients
            </p>
            <img src="/images/serviceIcon.png" alt="service icon" />
          </div>
          {/* logo slider */}
          <div className="flex justify-center items-center mx-4 w-full max-w-screen">
            <Slider {...settings} className="w-full">
              <div>
                <img
                  src="/images/iide-logo.svg"
                  alt="iide"
                  className="w-56 h-16"
                />
              </div>
              <div>
                <img
                  src="/images/credilio-svg-logo.svg"
                  alt="credilio"
                  className="w-56 h-16"
                />
              </div>
              <div>
                <img
                  src="/images/tripjack-logo.png"
                  alt="tripjack"
                  className="w-56 h-16"
                />
              </div>
              <div>
                <img
                  src="/images/bajaj-electricals-logo.jpg"
                  alt="bajaj"
                  className="w-40 h-[70px]"
                />
              </div>
              {/* <div>
                <img
                  src="/images/Mindshare-logo.jpg"
                  alt="facebook"
                  className="w-56 h-16"
                />
              </div> */}
              <div>
                <img src="/logo/logo.png" alt="603" className="w-40 h-16" />
              </div>
            </Slider>
          </div>
        </div>
      </section>

      {/* section6 */}
      {/* <section className="bg-gradient-to-t from-[#f4f4f4] via-[#f4f4f4] to-[#D0D0D0] "> */}
      <section className=" ">
        <div className="container mx-auto flex justify-around items-center py-10 ">
          <div>
            {/* <div className="w-[350px] h-[520.78px] px-[30px] py-[37px] bg-[#1f5c54] rounded-tr-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex "> */}
            <div className="relative top-20 left-[290px]">
              <img src="/images/testimonalicon1.png" alt="testimonalicon" />
            </div>
            <div className="w-[350px] h-[500px] px-[30px] top-[-40px] py-[37px] bg-[#1f5c54] rounded-tr-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex relative z-10">
              <div className="h-[255px] flex items-center justify-center px-2">
                {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-white text-[15px] font-normal font-['Lora'] leading-normal" */}
                <p className="mt-10 text-justify text-white text-sm font-['Lora'] leading-normal">
                  Creativity flows freely at 603 The Coworking Space. As a
                  content creator, I find the ambiance truly inspiring. Being
                  surrounded by fellow creatives has led to unexpected
                  collaborations and projects. It's like working in a hub of
                  innovation, and I couldn't be happier with my choice.
                </p>
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
            </div>
          </div>
          {/* second div */}
          {/* <div className="w-[350px] h-[525px] p-[30px] bg-white rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px] border border-[#33bead] flex-col justify-start items-center gap-[18px] inline-flex"> */}
          <div className="w-[350px] h-[500px] p-[30px] bg-white rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[200px] border border-[#33bead] flex-col justify-start items-center gap-[18px] inline-flex">
            <div className="h-[255px] flex items-center justify-center">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-[#141515] text-[15px] font-normal font-['Lora'] leading-normal"> */}
              <div className="text-justify mt-10 text-[#141515] text-sm font-normal font-['Lora'] leading-normal">
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
          <div className="w-[350px] h-[500px] px-[30px]  py-[37px] bg-[#1f5c54] rounded-tl-[200px] rounded-bl-[200px] rounded-br-[200px] flex-col justify-start items-center gap-[18px] inline-flex relative">
            <div className="h-[255px] flex items-center justify-center">
              {/* <div className="w-[300px] h-[255px] left-[-5px] top-0 absolute text-center text-white text-[15px] font-normal font-['Lora'] leading-normal"> */}
              <div className="text-justify mt-10 text-white text-sm font-normal font-['Lora'] leading-normal">
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
      {/* <section className="bg-gradient-to-t from-[#f4f4f4] via-[#f4f4f4] to-[#D0D0D0]"> */}
      <section className="">
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
