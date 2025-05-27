import React, { useState, useEffect, useRef } from "react";
import LandingNavbar from "../common-components/LandingNavbar";

import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";

import Slider from "react-slick";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
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
import { useApp } from "../Context/Context";
import MobileTestimonal from "../common-components/MobileTestimonal";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import beforeImage from "/images/home/before-img-one.png";
import afterImage from "/images/home/after-img-one.png";

function Landing() {
  const imageContainerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [expandedIndex, setExpandedIndex] = useState();
  // const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const heroImages = [
    "/images/home/Hero.png",
    "/images/home/Hero-image-1.png",
    "/images/home/Hero-image-2.png",
    "/images/home/Hero-image-3.png",
    "/images/home/Hero-image-4.png",
    "/images/home/Hero-image-5.png",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    isMobile,
    setTotalArea,
    setCurrentLayoutID,
    setCurrentLayoutData,
    isAuthenticated,
  } = useApp();

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000ms = 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [heroImages.length]);

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
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
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Show 3 slides only on md screens
        },
      },
    ],
  };

  const latestArticles = [
    {
      image: "/images/blogoffice.png",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      date: 5,
      month: "jun",
      name: "jon deo",
      comments: 0,
      shortdescription: "Door Windows, Home Land",
      description:
        "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
    },
    {
      image: "/images/blogoffice.png",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      date: 5,
      month: "jun",
      name: "jon deo",
      comments: 0,
      shortdescription: "Door Windows, Home Land",
      description:
        "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
    },
    {
      image: "/images/blogoffice.png",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      date: 5,
      month: "jun",
      name: "jon deo",
      comments: 0,
      shortdescription: "Door Windows, Home Land",
      description:
        "A small newly opened interior design business that aims to  cover different issues, from sustainability to social, from equal opportunities to education, from giving space",
    },
  ];

  const handleImageDrag = (e) => {
    const bounds = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX;
    if (!x) return;

    const offsetX = x - bounds.left;
    const percent = Math.max(0, Math.min((offsetX / bounds.width) * 100, 100));
    setSliderPos(percent);
  };

  return (
    <>
      {/* header section */}
      <section
        className="relative flex flex-col h-screen bg-cover bg-center bg-[url('/images/home/Home_Header.png')]"
        style={{ backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 ">
          <LandingNavbar />
          <div className="flex justify-center items-center h-svh">
            <div className="flex-1 flex flex-col gap-10 lg:gap-0 justify-center items-center text-white max-h-fit max-w-fit mx-auto lg:p-5 rounded-xl">
              <div className="lg:flex max-w-6xl px-5 py-5 space-y-10  items-stretch">
                <div className="lg:w-3/5 flex flex-col  justify-center items-center gap-6">
                  <h3 className="uppercase lg:self-end font-lato font-bold text-lg">
                    A Trendy Luxury
                  </h3>
                  <p className="font-Poppins text-right hidden lg:block">
                    Inoterior design consultancy firm that brings sensitivity to
                    the design top restaurants, hotels, offices & homes around
                    the world. We stand for quality, safety and credibility.
                  </p>
                </div>
                <div className="w-px mx-10 bg-white"></div>
                <div className="lg:w-2/5 space-y-10 flex flex-col">
                  <h2 className="text-4xl lg:text-5xl font-bold font-lato ">
                    Make Your Space For Better Experience
                  </h2>
                  <button className="capitalize bg-[#FFD074] text-base font-semibold text-black px-3 py-1.5 rounded-3xl self-center lg:self-start">
                    discover what we do
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className="about-us container py-10">
        <div className="lg:flex gap-12">
          <div className="pb-6 lg:pb-0">
            <img src="/images/home/section_1_main.png" alt="" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex justify-normal items-center">
              <span className="w-8 h-px bg-[#374A75]"></span>
              <h4 className="uppercase text-[#374A75] font-bold text-sm font-lato">
                about interior{" "}
              </h4>
            </div>
            <div className="space-y-8">
              <h3 className="text-[#232323] font-lora font-bold text-xl lg:text-4xl">
                We Create The Art Of Stylish <br /> Office Stylishly
              </h3>
              <p className="leading-7 font-lato">
                Inoterior design consultancy firm that brings sensitivity to the
                design top restaurants, hotels, offices & homes around the
                world. We stand for quality, safety and credibility, so you
                could be sure about our work. Initially we started as a company
                specializing
              </p>
            </div>
            <div className="flex w-full justify-between space-x-2 space-y-2">
              <div className="relative inline-block px-6 py-2 border-b-2 border-[#2D437A] text-[#2D437A] font-semibold cursor-pointer">
                Designing
                {/* The upward notch effect */}
                <div className="absolute left-1/2 -bottom-[6px] transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white border-l-2 border-t-2 border-[#2D437A]" />
              </div>
              <div className="px-4 pb-2 text-black font-semibold border-b-2 border-gray-200 cursor-pointer">
                Approved
              </div>
              <div className="px-4 pb-2 text-black font-semibold border-b-2 border-gray-200 cursor-pointer">
                Guaranteed
              </div>
            </div>
            <div className="flex space-x-5">
              <img src="/images/home/section_1_design.png" alt="" />
              <div className="space-y-3">
                <p>
                  We are committed to the impeccable craftsmanship and luxury is
                  reflected in all we do. We offer span furniture and many
                  accessories.
                </p>
                <div className="space-y-3">
                  <div className="flex">
                    <IoMdCheckmarkCircleOutline size={20} />
                    <p>Quality and designs checks deeply</p>
                  </div>
                  <div className="flex">
                    <IoMdCheckmarkCircleOutline size={20} />
                    <p>Periodic site review and timelines</p>
                  </div>
                  <div className="flex">
                    <IoMdCheckmarkCircleOutline size={20} />
                    <p>Design development and strategy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 3 */}
      <section className="services relative lg:bg-[url('images/home/services_bg.png')] bg-right bg-no-repeat py-10 ">
        <div className="container space-y-3 py-16">
          <div className="flex justify-normal items-center">
            <span className="w-8 h-px bg-[#374A75]"></span>
            <h4 className="uppercase text-[#374A75] font-bold text-sm font-lato">
              services we do
            </h4>
          </div>
          <h3 className="font-bold text-4xl font-lora">
            Our Featured Services <br /> Interior Design Transformations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-fit space-x-5 bg-white shadow-lg">
            <div className="font-lato space-y-7 px-3 py-5 max-w-64">
              <img src="images/icons/architecture-icon.svg" alt="" />
              <h4 className="font-bold text-xl capitalize">architecture</h4>
              <p>
                We develop the full cycle of project documentation & full
                details. Our clients satisfaction i…
              </p>
              <button className="capitalize border-2 border-black px-4 py-1.5">
                read more
              </button>
            </div>
            <div className="font-lato px-3 py-5 max-w-64 bg-[url('/images/home/interior-work-bg.svg')] text-white relative">
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative space-y-7">
                <img src="images/icons/interior.svg" alt="" />
                <h4 className="font-bold text-xl capitalize">Interior Work</h4>
                <p>
                  We will take care of the interior designs, build & management
                  of all kind of living projects
                </p>
                <button className="capitalize border-2 border-white px-4 py-1.5">
                  read more
                </button>
              </div>
            </div>
            <div className="font-lato space-y-7 px-3 py-5 max-w-64">
              <img src="images/icons/retail.svg" alt="" />
              <h4 className="font-bold text-xl capitalize">Retail Designs</h4>
              <p>
                We can help you with the retail interior design and third party
                management to create best
              </p>
              <button className="capitalize border-2 border-black px-4 py-1.5">
                read more
              </button>
            </div>
            <div className="font-lato space-y-7 px-3 py-5 max-w-64">
              <img src="images/icons/2d-3d_layout.svg" alt="" />
              <h4 className="font-bold text-xl capitalize">2D/3D Layouts</h4>
              <p>
                We offer professional online 2D and 3D interior designing which
                will help you visualize
              </p>
              <button className="capitalize border-2 border-black px-4 py-1.5">
                read more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <section className="testimonials container py-20 space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-normal items-center">
            <span className="w-8 h-px bg-[#374A75]"></span>
            <h4 className="uppercase text-[#374A75] font-bold text-sm font-lato mx-2">
              What People Say
            </h4>
            <span className="w-8 h-px bg-[#374A75]"></span>
          </div>
          <h3 className="font-bold font-lato text-4xl">Words Of Our Clients</h3>
        </div>
        <div className="flex gap-8 justify-between">
          <div className="border-r-[16px] border-b-[16px] border-[#F7F7F7] max-w-sm space-y-5">
            <div>
              <img src="/images/home/stars.svg" alt="" />
            </div>
            <p className="font-lato italic text-[#777777] ">
              I love everything that put together for my living room! I just
              bought this house and only had a few items I wanted to keep. I’am
              able to help me visualize the room”
            </p>
            <div className="flex">
              <img src="images/home/testimonial-1.png" alt="" />
              <div>
                <h5 className="text-[#232323] font-bold font-lato">
                  Natalie Kameron
                </h5>
                <h6 className="text-[#777777]">Ceo /Manger</h6>
              </div>
            </div>
          </div>
          <div className="border-r-[16px] border-b-[16px] border-[#F7F7F7] max-w-sm space-y-5">
            <div>
              <img src="/images/home/stars.svg" alt="" />
            </div>
            <p className="font-lato italic text-[#777777] ">
              I love everything that put together for my living room! I just
              bought this house and only had a few items I wanted to keep. I’am
              able to help me visualize the room”
            </p>
            <div className="flex">
              <img src="images/home/testimonial-1.png" alt="" />
              <div>
                <h5 className="text-[#232323] font-bold font-lato">
                  Natalie Kameron
                </h5>
                <h6 className="text-[#777777]">Ceo /Manger</h6>
              </div>
            </div>
          </div>
          <div className="border-r-[16px] border-b-[16px] border-[#F7F7F7] max-w-sm space-y-5">
            <div>
              <img src="/images/home/stars.svg" alt="" />
            </div>
            <p className="font-lato italic text-[#777777] ">
              I love everything that put together for my living room! I just
              bought this house and only had a few items I wanted to keep. I’am
              able to help me visualize the room”
            </p>
            <div className="flex">
              <img src="images/home/testimonial-1.png" alt="" />
              <div>
                <h5 className="text-[#232323] font-bold font-lato">
                  Natalie Kameron
                </h5>
                <h6 className="text-[#777777]">Ceo /Manger</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* section 5 */}
      <section className="before-after py-10">
        <div className="container mx-auto">
          <div className="flex justify-normal items-center">
            <span className="w-8 h-px bg-[#374A75]"></span>
            <h4 className="uppercase text-[#374A75] font-bold text-sm font-lato mx-2">
              after before
            </h4>
          </div>
          <h3 className="font-bold font-lora text-4xl">
            Let's Have A Look At What <br />
            Creativity Is!
          </h3>
        </div>
        <div
          ref={imageContainerRef}
          className="relative w-full max-w-7xl  h-[500px] overflow-hidden "
        >
          {/* Before image */}
          <img
            src={beforeImage}
            className="absolute top-0 left-0 h-full w-full object-cover"
            alt="Before"
          />

          {/* After image with dynamic width */}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={afterImage}
              className="h-full w-full object-cover"
              alt="After"
            />
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
          >
            {/* <div className="h-full w-1 bg-white shadow-md" /> */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                window.addEventListener("mousemove", handleImageDrag);
                window.addEventListener(
                  "mouseup",
                  () => {
                    window.removeEventListener("mousemove", handleImageDrag);
                  },
                  { once: true }
                );
              }}
              onTouchStart={(e) => {
                window.addEventListener("touchmove", handleImageDrag);
                window.addEventListener(
                  "touchend",
                  () => {
                    window.removeEventListener("touchmove", handleImageDrag);
                  },
                  { once: true }
                );
              }}
              className="w-6 h-6 rounded-full  border-2 border-gray-700 animate-pulse mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 cursor-ew-resize"
            />
          </div>
        </div>
      </section>

      {/* section 6 */}
      <section className="py-10">
        <div className="flex flex-col items-center space-y-4 py-3">
          <div className="flex justify-normal items-center">
            <span className="w-8 h-px bg-[#374A75]"></span>
            <h4 className="uppercase text-[#374A75] font-bold text-sm font-lato mx-2">
              our best projects
            </h4>
            <span className="w-8 h-px bg-[#374A75]"></span>
          </div>
          <h3 className="font-bold font-lato text-4xl capitalize">
            our featured projects
          </h3>
        </div>
        <div className="w-full flex justify-end">
          <div className="max-w-7xl flex justify-end gap-5">
            <img
              src="/images/home/featured-project-1.png"
              alt=""
              className="max-w-xs"
            />
            <img
              src="/images/home/featured-project-2.png"
              alt=""
              className="max-w-xs"
            />
            <img
              src="/images/home/featured-project-3.png"
              alt=""
              className="max-w-xs"
            />
            <img
              src="/images/home/featured-project-4.png"
              alt=""
              className="max-w-xs"
            />
          </div>
        </div>
      </section>

      {/* section 7 */}
      <section className="bg-[#F7F7F7] py-14">
        <div className="container  ">
          <div className="w-full flex justify-around ">
            <div className="flex justify-center items-center gap-2.5">
              <img
                src="/images/icons/creative-premium.svg"
                alt=""
                className="h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize">
                <span className="text-[#CDA174]">creative</span> <br /> premium
              </h5>
            </div>
            <div className="flex justify-center items-center gap-2.5">
              <img
                src="/images/icons/office-interior.svg"
                alt=""
                className="h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize">
                <span className="text-[#CDA174]">office</span> <br /> interior
              </h5>
            </div>
            <div className="flex justify-center items-center gap-2.5">
              <img
                src="/images/icons/comfort-furniture.svg"
                alt=""
                className="h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize">
                <span className="text-[#CDA174]">comfort</span> <br /> furniture
              </h5>
            </div>
            <div className="flex justify-center items-center gap-2.5">
              <img
                src="/images/icons/remodeling-interior.svg"
                alt=""
                className="h-14"
              />
              <h5 className="font-Poppins text-[#374A75] capitalize">
                <span className="text-[#CDA174]">remodeling</span> <br />{" "}
                interior
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* section 9 */}
      <section className="md:container  md:mx-auto my-10">
        <div>
          <div className="flex flex-col items-center space-y-4 py-3  font-bold mb-5">
            <div className="flex justify-normal items-center">
              <span className="w-8 h-px bg-[#374A75]"></span>
              <h4 className="uppercase text-[#374A75] text-xs lg:text-sm font-lato mx-2">
                Recent Articles
              </h4>
              <span className="w-8 h-px bg-[#374A75]"></span>
            </div>
            <h3 className=" font-lora text-[#232323] text-xl lg:text-[42px] capitalize">
              Read Our Latest Articles
            </h3>
          </div>
        </div>
        <div className="hidden md:flex flex-col md:flex-row  justify-center items-center gap-10  lg:gap-4">
          {latestArticles.map((article) => (
            <div className="max-w-sm">
              <div className="relative">
                <img src={article.image} alt="blogoffice" />
                <div className="absolute  left-4 bottom-0 bg-white text-center px-3 py-1 shadow-md rounded-sm">
                  <div className="text-lg font-bold">{article.date}</div>
                  <div className="text-sm text-gray-500 -mt-1 uppercase">
                    {article.month}
                  </div>
                </div>
              </div>
              <div className="font-lato border border-[#000]/10 p-4 space-y-3">
                <div className="flex items-center gap-4  text-[#777]">
                  <div className="flex items-center gap-2">
                    <FaRegUser size={20} color="#374A75" /> {article.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMessageSquare size={20} color="#374A75" />{" "}
                    {article.comments} Comments
                  </div>
                </div>
                <p className="font-bold text-[#232323] text-xl">
                  {article.title}
                </p>
                <div className=" left-0  bottom-0  transform translate-x-[5%]  translate-y-[70%] bg-[#fff] inline-block">
                  <button
                    onClick={() => {
                      navigate(`/blog/${article.title.replace(/\s/g, "_")}`);
                    }}
                    className="relative  inline-block border-[#232323] px-6 py-2 border-2 font-medium text-sm tracking-wide group"
                  >
                    <span className="relative z-10 text-[#232323] font-bold">
                      Read More
                    </span>
                    {/* Top-left line  */}
                    <span className="absolute top-0 -left-2 w-2 h-px bg-[#232323] "></span>
                    <span className="absolute -top-2 left-0 h-2 w-px bg-[#232323] "></span>

                    {/* Bottom-right line */}
                    <span className="absolute bottom-0 -right-2 w-2 h-px bg-[#232323] "></span>
                    <span className="absolute -bottom-2 right-0 h-2 w-px bg-[#232323] "></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className=" md:hidden">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={"auto"}
            spaceBetween={20}
            initialSlide={1}
            // autoplay={{
            //   delay: 1500, // 1.5 seconds per slide
            //   disableOnInteraction: true, // Keeps autoplay even after user interaction
            // }}
            modules={[Autoplay]}
          >
            {latestArticles.map((article, index) => (
              <SwiperSlide key={index}>
                <div className="max-w-sm">
                  <div className="relative">
                    <img src={article.image} alt="blogoffice" />
                    <div className="absolute  left-4 bottom-0 bg-white text-center px-3 py-1 shadow-md rounded-sm">
                      <div className="text-lg font-bold">{article.date}</div>
                      <div className="text-sm text-gray-500 -mt-1 uppercase">
                        {article.month}
                      </div>
                    </div>
                  </div>
                  <div className="font-lato border border-[#000]/10 p-4 space-y-3">
                    <div className="flex items-center gap-4  text-[#777]">
                      <div className="flex items-center gap-2">
                        <FaRegUser size={20} color="#374A75" /> {article.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMessageSquare size={20} color="#374A75" />{" "}
                        {article.comments} Comments
                      </div>
                    </div>
                    <p className="font-bold text-[#232323] text-xl">
                      {article.title}
                    </p>
                    <div className=" left-0  bottom-0  transform translate-x-[5%]  translate-y-[70%] bg-[#fff] inline-block">
                      <button
                        onClick={() => {
                          navigate(
                            `/blog/${article.title.replace(/\s/g, "_")}`
                          );
                        }}
                        className="relative  inline-block border-[#232323] px-6 py-2 border-2 font-medium text-sm tracking-wide group"
                      >
                        <span className="relative z-10 text-[#232323] font-bold">
                          Read More
                        </span>
                        {/* Top-left line  */}
                        <span className="absolute top-0 -left-2 w-2 h-px bg-[#232323] "></span>
                        <span className="absolute -top-2 left-0 h-2 w-px bg-[#232323] "></span>

                        {/* Bottom-right line */}
                        <span className="absolute bottom-0 -right-2 w-2 h-px bg-[#232323] "></span>
                        <span className="absolute -bottom-2 right-0 h-2 w-px bg-[#232323] "></span>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}

export default Landing;
