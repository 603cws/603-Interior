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

  console.log("blog", blog);

  const background = "/images/blognewpage.png";
  return (
    <div>
      {/* Navbar Section */}
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar />
      </header>

      {/* blog section */}
      <section className="my-10">
        <div className="px-4 lg:px-12 lg:container lg:mx-auto flex justify-center xl:max-w-7xl 2xl:px-0">
          <div className="max-w-4xl flex flex-col gap-11">
            {/* div for image */}
            <div className="flex justify-center">
              <img
                src="/images/blogoffice.png"
                //  src={blog?.blogimage}
                alt="blog"
                className="w-full object-cover h-72"
              />
            </div>
            <div className="">
              <div className="">
                {/* Blog Title */}
                <div className="font-bold font-Georgia italic xl:text-3xl capitalize text-center mb-10 max-w-2xl mx-auto">
                  <h2 className="leading-snug">{blog.title}</h2>
                </div>

                {/* Blog Content Wrapper */}
                <div className="font-Poppins text-sm xl:text-lg mb-5 space-y-4 ">
                  <div
                    className="[&_h1]:!text-[#374151] [&_h1]:font-bold [&_h1]:text-xl [&_p]:text-[#374151] [&_p]:mb-4 [&_h1]:mb-2"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  ></div>
                  <div className="capitalize border-b-2 border-b-[#EFEFEF] py-5">
                    <h3 className="text-[#0E403C]">
                      Edited by :{" "}
                      <span className="text-[#34BFAD]"> {blog.name}</span>{" "}
                    </h3>
                  </div>
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
