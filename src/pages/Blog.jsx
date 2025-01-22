import LandingNavbar from "../components/LandingNavbar";
import Footer from "../components/Footer";
function Blog() {
  return (
    <div>
      {/* section 1 */}
      {/* <section className="flex flex-col h-screen bg-[url('/images/BlogPage.png')] bg-cover bg-center"> */}
      <section className="flex flex-col h-screen bg-[url('/images/Blog.png')] bg-cover">
        {/* <section className="flex flex-col w-full h-auto bg-[url('/images/BlogPage.png')]"> */}
        <LandingNavbar />
        <div className="flex-1 flex items-center container mx-auto ">
          <h1 className="font-lato text-6xl font-extrabold uppercase pb-32">
            Our Blogs
          </h1>
        </div>
      </section>

      {/* section with image tag */}
      {/* <section className="h-screen">
        <img
          src="/images/BlogPage.png"
          className=" w-full h-full"
          alt="blog page"
        />
      </section> */}
      {/* footer */}
      <Footer />
    </div>
  );
}

export default Blog;
