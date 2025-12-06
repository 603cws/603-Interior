import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Blog() {
  const background = "/images/blognewpage.png";

  const navigate = useNavigate();

  // const settingsProduct = {
  //   dots: true,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   initialSlide: 0,
  //   autoplay: true,
  //   autoplaySpeed: 2000,
  //   infinite: true,
  //   arrows: false,
  //   // pauseOnHover: true,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 3,
  //         slidesToScroll: 3,
  //         dots: true,
  //       },
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2,
  //         initialSlide: 2,
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //       },
  //     },
  //   ],
  // };

  const blogs = [
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/userprofilenew.png",
      name: "sakshi",
      title:
        "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
      des: "The way we design office spaces is evolving rapidly. With hybrid work models, a focus on employee well-being, and advancements in technology, companies are rethinking how they utilize their office spaces. ",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/userprofilenew.png",
      name: "Sakshi ",
      title: "How to Design a Productive Office Space: A Step-by-Step Guide",
      des: "A well-designed office isn’t just about aesthetics—it directly impacts employee productivity, engagement, and overall job satisfaction",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/userprofilenew.png",
      name: "Sakshi ",
      title: "How AI & Automation Are Changing Interior Design for Offices",
      des: "Gone are the days of manual floor plans and traditional office setups. AI and automation are revolutionizing how companies design their workspaces, making office planning faster, smarter, and more cost-effective. ",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/userprofilenew.png",
      name: "Sakshi ",
      title: "How Office Design Impacts Employee Productivity & Well-Being",
      des: "Your office space is more than just a place to work—it influences mood, motivation, and overall productivity. A well-designed workspace can enhance focus, reduce stress, and foster collaboration, while a poorly planned office can lead to distractions, fatigue, and disengagement.",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/userprofilenew.png",
      name: "Sakshi ",
      title: "10 Office Design Mistakes That Are Killing Your Productivity",
      des: "Your officeYour office layout might be working against you. From poor lighting to cluttered spaces, minor design flaws can impact focus and efficiency. layout might be working against you. From poor lighting to cluttered spaces, minor design flaws can impact focus and efficiency.",
    },
  ];
  // const blogs = [
  //   {
  //     blogimage: "/images/contact1.png",
  //     profileicon: "/images/usericon.png",
  //     name: "name",
  //     title:
  //       "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
  //     des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
  //   },
  //   {
  //     blogimage: "/images/contact1.png",
  //     profileicon: "/images/usericon.png",
  //     name: "name",
  //     title: "developing usefull product that would meet user’s needs",
  //     des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
  //   },
  //   {
  //     blogimage: "/images/contact1.png",
  //     profileicon: "/images/usericon.png",
  //     name: "name",
  //     title: "developing usefull product that would meet user’s needs",
  //     des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
  //   },
  //   {
  //     blogimage: "/images/contact1.png",
  //     profileicon: "/images/usericon.png",
  //     name: "name",
  //     title: "developing usefull product that would meet user’s needs",
  //     des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
  //   },
  //   {
  //     blogimage: "/images/contact1.png",
  //     profileicon: "/images/usericon.png",
  //     name: "name",
  //     title: "developing usefull product that would meet user’s needs",
  //     des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
  //   },
  //   {
  //     blogimage: "/images/contact1.png",
  //     profileicon: "/images/usericon.png",
  //     name: "name",
  //     title: "developing usefull product that would meet user’s needs",
  //     des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
  //   },
  // ];

  return (
    <>
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase">
          <h1 className="text-5xl lg:text-7xl font-extrabold font-lato  text-white drop-shadow-lg tracking-wider">
            blogs
          </h1>
        </div>
      </section>

      {/* latest blog section */}
      <section>
        <div className="container mx-auto my-5">
          {/* header */}
          <h2 className="capitalize text-2xl font-lato lg:text-5xl text-center my-3 lg:my-5 xl:my-10 ">
            latest news
          </h2>

          {/* div for grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-y-24 justify-items-center ">
            {blogs.map((blog, index) => {
              return (
                <div
                  className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer"
                  key={index}
                  onClick={() => {
                    navigate(`${blog.title.replace(/\s/g, "_")}`);
                  }}
                >
                  {/* image */}
                  <div>
                    <img
                      // src="/images/contact1.png"
                      src={blog.blogimage}
                      alt={`Blog ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                  {/* text */}
                  <div className="font-Poppins mx-5">
                    {/* user div */}
                    <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                      <div className="w-10 h-10">
                        <img src={blog.profileicon} alt="user icon" />
                      </div>

                      <h3 className="text-[#B1B1B1]">{blog.name}</h3>
                    </div>
                    {/* <h6 className="font-semibold text-xl capitalize mb-1">
                        developing usefull product that would meet user’s needs
                      </h6> */}
                    <h6
                      className="font-semibold text-xl capitalize mb-1"
                      // onClick={() => navigate(`${blog.title}`)}
                    >
                      {blog.title}
                    </h6>
                    {/* <p className="text-[#000] tracking-wide text-sm">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an{" "}
                      </p> */}
                    <p className="text-[#000] tracking-wide text-sm">
                      {blog.des}
                    </p>

                    <div className="flex justify-end items-center my-5">
                      <img src="/images/blogicon.svg" alt="blog icon" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* new latest section */}
      {/* <section>
        <div className="container mx-auto my-10">
          <h2 className="capitalize text-2xl font-lato lg:text-5xl text-center my-3 lg:my-5 xl:my-10 ">
            latest news
          </h2>

          <div className="xl:flex justify-around">
            <div className="xl:max-w-2xl 2xl:max-w-4xl rounded overflow-hidden shadow-lg">
              <div className="">
                <img
                  src="/images/contact1.png"
                  alt="blog"
                  className="w-full h-[380px]"
                />
              </div>

              <div className="font-Poppins mx-5">
                <div className="flex justify-start items-center w-3/4 gap-5 my-4 xl:my-6">
                  <div>
                    <img src="/images/usericon.png" alt="user icon" />
                  </div>

                  <h3 className="text-[#B1B1B1]">Name surname</h3>
                </div>
                <h6 className="font-semibold xl:text-3xl capitalize mb-1 xl:mb-3">
                  developing usefull product that would meet user’s needs
                </h6>
                <p className="text-[#000] tracking-wide text-xl">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an{" "}
                </p>
              </div>
            </div>
            <div className=" flex justify-around mt-10 xl:flex-col xl:mt-0">
              <div className="max-w-sm rounded overflow-hidden shadow-lg mb-4">
                <div>
                  <img
                    src="/images/contact1.png"
                    alt="blog"
                    className="w-full h-[150px]"
                  />
                </div>

                <div className="font-Poppins mx-5">
                  <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                    <div>
                      <img src="/images/usericon.png" alt="user icon" />
                    </div>

                    <h3 className="text-[#B1B1B1]">Name</h3>
                  </div>
                  <h6 className="font-semibold  capitalize mb-1">
                    developing usefull product that would meet user’s needs
                  </h6>
                  <p className="text-[#000] tracking-wide text-sm mb-2">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an{" "}
                  </p>
                </div>
              </div>

              <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div>
                  <img
                    src="/images/contact1.png"
                    alt="blog"
                    className="w-full h-[150px]"
                  />
                </div>

                <div className="font-Poppins mx-5">
                  <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                    <div>
                      <img src="/images/usericon.png" alt="user icon" />
                    </div>

                    <h3 className="text-[#B1B1B1]">Name</h3>
                  </div>
                  <h6 className="font-semibold text-xl capitalize mb-1">
                    developing usefull product that would meet user’s needs
                  </h6>
                  <p className="text-[#000] tracking-wide text-sm mb-2">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Daily highlights */}
      {/* <section className="container mx-auto">
        <h3 className="capitalize xl:text-5xl font-lato text-center my-8">
          daily highlights
        </h3>
        <div className="slider-container  mx-auto">
          <Slider {...settingsProduct}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
   
              <div>
                <img src="/images/contact1.png" alt="blog" className="w-full" />
              </div>

              <div className="font-Poppins mx-5">
  
                <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                  <div>
                    <img src="/images/usericon.png" alt="user icon" />
                  </div>

                  <h3 className="text-[#B1B1B1]">Name</h3>
                </div>
                <h6 className="font-semibold text-xl capitalize mb-1">
                  developing usefull product that would meet user’s needs
                </h6>
                <p className="text-[#000] tracking-wide text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an{" "}
                </p>

                <div className="flex justify-end items-center my-5">
                  <img src="/images/blogicon.svg" alt="" />
                </div>
              </div>
            </div>
 
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
          
              <div>
                <img src="/images/contact1.png" alt="blog" className="w-full" />
              </div>
        
              <div className="font-Poppins mx-5">
              
                <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                  <div>
                    <img src="/images/usericon.png" alt="user icon" />
                  </div>

                  <h3 className="text-[#B1B1B1]">Name</h3>
                </div>
                <h6 className="font-semibold text-xl capitalize mb-1">
                  developing usefull product that would meet user’s needs
                </h6>
                <p className="text-[#000] tracking-wide text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an{" "}
                </p>

                <div className="flex justify-end items-center my-5">
                  <img src="/images/blogicon.svg" alt="" />
                </div>
              </div>
            </div>
       
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
             
              <div>
                <img src="/images/contact1.png" alt="blog" className="w-full" />
              </div>
           
              <div className="font-Poppins mx-5">
            
                <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                  <div>
                    <img src="/images/usericon.png" alt="user icon" />
                  </div>

                  <h3 className="text-[#B1B1B1]">Name</h3>
                </div>
                <h6 className="font-semibold text-xl capitalize mb-1">
                  developing usefull product that would meet user’s needs
                </h6>
                <p className="text-[#000] tracking-wide text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an{" "}
                </p>

                <div className="flex justify-end items-center my-5">
                  <img src="/images/blogicon.svg" alt="" />
                </div>
              </div>
            </div>
      
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
         
              <div>
                <img src="/images/contact1.png" alt="blog" className="w-full" />
              </div>
   
              <div className="font-Poppins mx-5">
              
                <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                  <div>
                    <img src="/images/usericon.png" alt="user icon" />
                  </div>

                  <h3 className="text-[#B1B1B1]">Name</h3>
                </div>
                <h6 className="font-semibold text-xl capitalize mb-1">
                  developing usefull product that would meet user’s needs
                </h6>
                <p className="text-[#000] tracking-wide text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an{" "}
                </p>

                <div className="flex justify-end items-center my-5">
                  <img src="/images/blogicon.svg" alt="" />
                </div>
              </div>
            </div>
        
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
          
              <div>
                <img src="/images/contact1.png" alt="blog" className="w-full" />
              </div>
        
              <div className="font-Poppins mx-5">
            
                <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                  <div>
                    <img src="/images/usericon.png" alt="user icon" />
                  </div>

                  <h3 className="text-[#B1B1B1]">Name</h3>
                </div>
                <h6 className="font-semibold text-xl capitalize mb-1">
                  developing usefull product that would meet user’s needs
                </h6>
                <p className="text-[#000] tracking-wide text-sm">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an{" "}
                </p>

                <div className="flex justify-end items-center my-5">
                  <img src="/images/blogicon.svg" alt="" />
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section> */}

      {/* footer */}
      <footer className="mt-10">
        <Footer />
      </footer>
    </>
  );
}

export default Blog;
