import LandingNavbar from "../common-components/LandingNavbar";
import Footer from "../common-components/Footer";

function Blog() {
  const background = "/images/blognewpage.png";

  const blogs = [
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/usericon.png",
      name: "name",
      title: " developing usefull product that would meet user’s needs",
      des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/usericon.png",
      name: "name",
      title: " developing usefull product that would meet user’s needs",
      des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/usericon.png",
      name: "name",
      title: " developing usefull product that would meet user’s needs",
      des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/usericon.png",
      name: "name",
      title: " developing usefull product that would meet user’s needs",
      des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/usericon.png",
      name: "name",
      title: " developing usefull product that would meet user’s needs",
      des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
    },
    {
      blogimage: "/images/contact1.png",
      profileicon: "/images/usericon.png",
      name: "name",
      title: " developing usefull product that would meet user’s needs",
      des: "Lorem Ipsum is simply dummy text of the printing andtypesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an",
    },
  ];

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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-lato  text-white drop-shadow-lg tracking-wider">
            blogs
          </h1>
        </div>
      </section>

      {/* latest blog section */}

      <section>
        <div className="container mx-auto my-5">
          {/* header */}
          <h2 className="capitalize text-2xl font-lato lg:text-5xl text-center my-3 lg:my-5 ">
            latest news
          </h2>

          {/* div for grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-y-24 justify-items-center ">
            {/* card */}
            {blogs.map((blog) => {
              return (
                <>
                  <div className="max-w-sm rounded overflow-hidden shadow-lg">
                    {/* image */}
                    <div>
                      <img
                        // src="/images/contact1.png"
                        src={blog.blogimage}
                        alt="image of blog"
                        className="w-full"
                      />
                    </div>
                    {/* text */}
                    <div className="font-Poppins mx-5">
                      {/* user div */}
                      <div className="flex justify-start items-center w-3/4 gap-5 my-4">
                        <div>
                          <img src={blog.profileicon} alt="user icon" />
                        </div>

                        <h3 className="text-[#B1B1B1]">Name</h3>
                      </div>
                      {/* <h6 className="font-semibold text-xl capitalize mb-1">
                        developing usefull product that would meet user’s needs
                      </h6> */}
                      <h6 className="font-semibold text-xl capitalize mb-1">
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
                        <img src="/images/blogicon.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;
