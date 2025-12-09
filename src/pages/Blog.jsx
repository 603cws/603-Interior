import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Blog() {
  const background = "/images/blognewpage.png";

  const navigate = useNavigate();

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

  return (
    <>
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

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

      <section>
        <div className="container mx-auto my-5">
          <h2 className="capitalize text-2xl font-lato lg:text-5xl text-center my-3 lg:my-5 xl:my-10 ">
            latest news
          </h2>

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
                  <div>
                    <img
                      src={blog.blogimage}
                      alt={`Blog ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                  <div className="font-Poppins mx-5">
                    <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                      <div className="w-10 h-10">
                        <img src={blog.profileicon} alt="user icon" />
                      </div>

                      <h3 className="text-[#B1B1B1]">{blog.name}</h3>
                    </div>
                    <h6 className="font-semibold text-xl capitalize mb-1">
                      {blog.title}
                    </h6>
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

      <footer className="mt-10">
        <Footer />
      </footer>
    </>
  );
}

export default Blog;
