import { useEffect, useState } from "react";
import LandingNavbar from "../common-components/LandingNavbar";
import { useParams } from "react-router-dom";

import BlogData from "./BlogData";
import Footer from "../common-components/Footer";

function BlogDetail() {
  const { title } = useParams();
  const [blog, setBlog] = useState({});
  useEffect(() => {
    if (title) {
      const decodedTitle = decodeURIComponent(title.replace(/_/g, " ")); //decode the title
      const foundblog = BlogData.find((blog) => blog.title === decodedTitle);
      setBlog(foundblog);
    }
  }, [title]);

  const background = "/images/blognewpage.png";
  return (
    <div>
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center text-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100"
        style={{
          backgroundImage: `url(${background})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 uppercase mt-10 ">
          <h1 className="text-3xl sm:text-2xl lg:text-4xl font-extrabold font-lato  text-white drop-shadow-lg tracking-wider">
            blogs
          </h1>
        </div>
      </section>

      {/* blog section */}

      <section className="my-10">
        <div className="lg:container lg:mx-auto flex justify-center">
          <div className="max-w-4xl flex flex-col gap-20">
            {/* div for image */}
            <div className="flex justify-center">
              <img
                src="/images/blogoffice.png"
                alt="blog"
                className="w-full object-cover h-72"
              />
            </div>

            {/* <div className="font-Poppins ">
              <div className="mx-10">
                <div className="font-semibold xl:text-5xl capitalize text-center mb-10">
                  <h2 className="leading-snug"> {blog.title}</h2>
                </div>
                <div
                  className="xl:text-xl mb-5 text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>
              </div>
            </div> */}
            <div className="font-Poppins">
              <div className="mx-10">
                {/* Blog Title */}
                <div className="font-semibold xl:text-3xl capitalize text-center mb-10">
                  <h2 className="leading-snug">{blog.title}</h2>
                </div>

                {/* Blog Content Wrapper */}
                <div className="font-Poppins text-sm xl:text-lg mb-5 text-[#374151] space-y-4 [&_h1]:font-bold [&_h1]:text-xl [&_p]:text-[#374151] [&_p]:mb-4 [&_h1]:mb-2">
                  <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                  <div className="capitalize border-b-2 border-b-[#EFEFEF] py-5">
                    <h3 className="text-[#0E403C]">
                      Edited by :{" "}
                      <span className="text-[#34BFAD]"> {blog.name}</span>{" "}
                    </h3>
                  </div>
                  {/* <div>
                    <h3>Was this page helpful?</h3>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mt-10">
        <Footer />
      </footer>
    </div>
  );
}

export default BlogDetail;
