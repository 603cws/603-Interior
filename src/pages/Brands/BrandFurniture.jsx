import Header from "../Ecommerce/Header";

function BrandFurniture() {
  return (
    <>
      <div className="font-Poppins ">
        <Header />
        <section className="lg:container justify-center flex items-center">
          <img
            src="/images/brands/furnitureHeader.png"
            alt="Furniture header"
          />
        </section>

        <section className="lg:container px-4 my-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase text-center my-10">
            Shop By Categry
          </h2>
          <div className="grid grid-cols-2 justify-items-center gap-y-3 md:gap-y-7">
            <div className="relative max-w-sm lg:max-w-[500px] w-full">
              <img
                src="/images/brands/modula-logo.png"
                alt="modula logo"
                className="absolute h-[10%] w-[20%] top-5 right-3 md:right-10"
              />
              <img src="/images/brands/brand-chair-1.png" alt="Brand chair 1" />
            </div>
            <div className="relative max-w-sm lg:max-w-[500px] w-full">
              <img
                src="/images/brands/modula-logo.png"
                alt="modula logo"
                className="absolute h-[10%] w-[20%]  top-5 right-3 md:right-10"
              />
              <img
                src="/images/brands/brand-chair-2.png"
                alt="Brand chair 2"
                className=" border-8"
              />
            </div>

            <div className="relative max-w-sm lg:max-w-[500px] w-full">
              <img
                src="/images/brands/modula-logo.png"
                alt="modula logo"
                className="absolute h-[10%] w-[20%]  top-5 right-3 md:right-10"
              />
              <img
                src="/images/brands/brand-chair-3.png"
                alt="Brand chair 3"
                className=" border-8"
              />
            </div>
            <div className="relative max-w-sm lg:max-w-[500px] w-full">
              <img
                src="/images/brands/modula-logo.png"
                alt="modula logo"
                className="absolute h-[10%] w-[20%]  top-5 right-3 md:right-10"
              />
              <img
                src="/images/brands/brand-chair-4.png"
                alt="Brand chair 4"
                className=" border-8"
              />
            </div>

            <div className="relative max-w-sm lg:max-w-[500px] w-full">
              <img
                src="/images/brands/modula-logo.png"
                alt="modula logo"
                className="absolute h-[10%] w-[20%]  top-5 right-3 md:right-10"
              />
              <img
                src="/images/brands/brand-chair-5.png"
                alt="Brand chair 5"
                className=""
              />
            </div>
            <div className="relative max-w-sm lg:max-w-[500px] w-full">
              <img
                src="/images/brands/modula-logo.png"
                alt="modula logo"
                className="absolute h-[10%] w-[20%]  top-5 right-3 md:right-10"
              />
              <img
                src="/images/brands/brand-chair-6.png"
                alt="Brand chair 6"
                className=""
              />
            </div>
          </div>
        </section>

        <section className="my-5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl uppercase text-center my-10">
            our usp
          </h2>
          <div>
            <div className="h-80 w-screen bg-[url('/images/our-usp-bg.png')] bg-center bg-cover bg-no-repeat flex justify-center items-center">
              <h1 className="font-semibold text-5xl lg:text-6xl text-center text-[#fff]">
                Browse our collection
              </h1>
            </div>
          </div>
        </section>

        <section className="lg:container px-4 grid grid-cols-2 lg:grid-cols-4">
          <img
            src="/images/brands/brand-chair-1.png"
            alt="Brand chair 1"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-2.png"
            alt="Brand chair 2"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-3.png"
            alt="Brand chair 3"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-4.png"
            alt="Brand chair 4"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-5.png"
            alt="Brand chair 5"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-6.png"
            alt="Brand chair 6"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-1.png"
            alt="Brand chair 1"
            className=" w-full "
          />
          <img
            src="/images/brands/brand-chair-2.png"
            alt="Brand chair 2"
            className=" w-full "
          />
        </section>
      </div>
    </>
  );
}

export default BrandFurniture;
