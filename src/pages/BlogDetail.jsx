import LandingNavbar from "../common-components/LandingNavbar";
import { useLocation } from "react-router-dom";

import Footer from "../common-components/Footer";
import { blogImageUrl } from "../utils/HelperConstant";
import PageNotFound from "../common-components/PageNotFound";

function BlogDetail() {
  const location = useLocation();
  const blog = location.state;

  if (!blog) {
    return <PageNotFound />;
  }
  return (
    <div>
      <header className="bg-white shadow-lg z-50 relative">
        <LandingNavbar className="relative" />
      </header>

      <section className="my-10">
        <div className="px-4 lg:px-12 lg:container lg:mx-auto flex justify-center xl:max-w-7xl 2xl:px-0">
          <div className="max-w-4xl flex flex-col gap-11">
            <div className="flex justify-center">
              <img
                src={`${blogImageUrl}/${blog?.image}`}
                alt="blog"
                className="w-full object-cover h-72"
              />
            </div>
            <div className="">
              <div className="">
                <div className="font-bold font-Georgia italic xl:text-3xl capitalize text-center mb-10 max-w-2xl mx-auto">
                  <h2 className="leading-snug">{blog?.title}</h2>
                </div>

                <div className="font-Poppins text-sm xl:text-lg mb-5 space-y-4 ">
                  <div className="[&_h1]:!text-[#374151] [&_h1]:font-bold [&_h1]:text-xl [&_p]:text-[#374151] [&_p]:mb-4 [&_h1]:mb-2">
                    <h1 class="font-semibold text-xl mb-2">
                      <span class="font-bold ">1. Introduction</span>
                    </h1>
                    <p class="text-gray-700 mb-4">
                      {blog?.content?.introduction}
                    </p>
                    <h1 class="font-semibold text-xl mb-2">
                      <span class="font-bold ">2. Description</span>
                    </h1>
                    <p class="text-gray-700 mb-4">
                      {blog?.content?.description}
                    </p>
                    <h2 class="font-semibold text-xl mb-2">
                      <span class="font-bold ">3. Conclusion</span>
                    </h2>
                    <p class="text-gray-700 mb-4">
                      {blog?.content?.conclusion}
                    </p>
                  </div>
                  <div className="capitalize border-b-2 border-b-[#EFEFEF] py-5">
                    <h3 className="text-[#0E403C]">
                      Edited by :{" "}
                      <span className="text-[#34BFAD]"> {blog?.author}</span>{" "}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="mt-10">
        <Footer />
      </footer>
    </div>
  );
}

export default BlogDetail;
