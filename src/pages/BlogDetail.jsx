import LandingNavbar from "../common-components/LandingNavbar";
import { useLocation } from "react-router-dom";

import Footer from "../common-components/Footer";
import { blogImageUrl } from "../utils/HelperConstant";
import PageNotFound from "../common-components/PageNotFound";

function BlogDetail() {
  const location = useLocation();
  const blog = location.state; // Access passed state here

  // {
  //     "id": "ab0b4501-0861-48e5-8194-1fd88918858b",
  //     "created_at": "2025-10-22T11:28:36.72512+00:00",
  //     "headers": {
  //         "subtitle": "Door Windows, Home Land",
  //         "shortDescription": "A small newly opened interior design business that aims to cover different issues, from sustainability to social, from equal opportunities to education, from giving space"
  //     },
  //     "content": {
  //         "conclusion": "Workspaces are no longer just about desks and chairs. They’re evolving into experience-driven environments that foster productivity, creativity, and well-being. Is your office ready for the future? At Workved Interiors, we help businesses transform their workspaces with modern, efficient, and inspiring designs. Contact us to explore innovative office design solutions!",
  //         "description": "1. Hybrid Workspaces: The New Norm\nThe traditional 9-to-5 office setup is becoming obsolete. Companies are investing in flexible workspaces that cater to both in-office and remote employees. Hot desking, breakout zones, and collaborative meeting rooms are now essential to encourage productivity.\n\n2. Biophilic Design: Bringing Nature Indoors\nEmployees thrive in environments that feel natural and comfortable. The biophilic design trend incorporates natural elements such as indoor plants, wooden finishes, and daylight-optimized office layouts. It’s proven to reduce stress and enhance productivity.\n\n3. Smart Office Technology\nFrom AI-powered lighting and climate control to IoT-connected furniture, technology is transforming office spaces. Automated systems improve energy efficiency and create a comfortable work environment.\n\n4. Wellness-Centric Office Spaces\nCompanies are prioritizing mental and physical well-being through ergonomic furniture, standing desks, meditation rooms, and wellness programs. Offices are becoming spaces that support a healthier work-life balance.\n\n5. Sustainable and Green Office Design\nWith eco-conscious materials, energy-efficient appliances, and green certifications, businesses are creating environmentally friendly offices that align with global sustainability goals.",
  //         "introduction": "The way we design office spaces is evolving rapidly. With hybrid work models, a focus on employee well-being, and advancements in technology, companies are rethinking how they utilize their office spaces. Let’s explore the top office design trends that will shape workspaces in 2025."
  //     },
  //     "image": "sakshi-the-future-of-office-design:-trends-that-will-shape-workspaces-in-2025-2025-10-22T11-28-36-193Z",
  //     "author": "Sakshi",
  //     "tags": "[\"workved\",\"interior\",\"design\",\"office\"]",
  //     "title": "The Future of Office Design: Trends That Will Shape Workspaces in 2025",
  //     "updated_at": null
  // }

  if (!blog) {
    return <PageNotFound />;
  }
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
                // src="/images/blogoffice.png"
                src={`${blogImageUrl}/${blog?.image}`}
                alt="blog"
                className="w-full object-cover h-72"
              />
            </div>
            <div className="">
              <div className="">
                {/* Blog Title */}
                <div className="font-bold font-Georgia italic xl:text-3xl capitalize text-center mb-10 max-w-2xl mx-auto">
                  <h2 className="leading-snug">{blog?.title}</h2>
                </div>

                {/* Blog Content Wrapper */}
                <div className="font-Poppins text-sm xl:text-lg mb-5 space-y-4 ">
                  <div
                    className="[&_h1]:!text-[#374151] [&_h1]:font-bold [&_h1]:text-xl [&_p]:text-[#374151] [&_p]:mb-4 [&_h1]:mb-2"
                    // dangerouslySetInnerHTML={{ __html: blog?.content }}
                  >
                    <h1 class="font-semibold text-xl mb-2">
                      <span class="font-bold ">1. Introduction</span>
                    </h1>
                    <p class="text-gray-700 mb-4">
                      {blog?.content?.introduction}
                    </p>
                    <h1 class="font-semibold text-xl mb-2">
                      <span class="font-bold ">2. Description</span>
                    </h1>
                    {/* <h1 class="font-semibold text-xl mb-2">
                      <span class="font-bold">
                        2. The importance of networking in a coworking
                        environment
                      </span>
                    </h1> */}
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
      {/* <section className="my-10">
        <div className="px-4 lg:px-12 lg:container lg:mx-auto flex justify-center xl:max-w-7xl 2xl:px-0">
          <div className="max-w-4xl flex flex-col gap-11">
          
            <div className="flex justify-center">
              <img
                // src="/images/blogoffice.png"
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
                  <div
                    className="[&_h1]:!text-[#374151] [&_h1]:font-bold [&_h1]:text-xl [&_p]:text-[#374151] [&_p]:mb-4 [&_h1]:mb-2"
                    dangerouslySetInnerHTML={{ __html: blog?.content }}
                  ></div>
                  <div className="capitalize border-b-2 border-b-[#EFEFEF] py-5">
                    <h3 className="text-[#0E403C]">
                      Edited by :{" "}
                      <span className="text-[#34BFAD]"> {blog?.name}</span>{" "}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* footer */}
      <footer className="mt-10">
        <Footer />
      </footer>
    </div>
  );
}

export default BlogDetail;
