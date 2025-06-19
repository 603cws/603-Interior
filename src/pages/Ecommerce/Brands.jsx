import CardComp from "./Card";

function Brands() {
  const brands = [
    { name: "wellspun", image: "/images/ecommerce/image-1.png" },
    { name: "ikea", image: "/images/ecommerce/image-2.png" },
    { name: "ikea", image: "/images/ecommerce/image-3.png" },
    { name: "ikea", image: "/images/ecommerce/image-4.png" },
    { name: "ikea", image: "/images/ecommerce/image-5.png" },
    { name: "ikea", image: "/images/ecommerce/image-6.png" },
  ];

  return (
    <div>
      <section className="container px-4 lg:px-12 mx-auto my-10">
        <img
          src="images/ecommerce/header1.png"
          alt="dfsfd"
          className="w-full object-contain"
        />
      </section>

      <section className="container px-4 lg:px-12 mx-auto my-10">
        <img
          src="images/ecommerce/header2.png"
          alt="dfsfd"
          className="w-full object-contain"
        />
      </section>

      <section className="container px-4 lg:px-12 mx-auto my-5">
        <div className="bg-[#F7FAFF] rounded-md p-4">
          <h2 className="text-3xl font-lora text-center mb-4">
            New & Trending Products
          </h2>
          <div className="flex gap-4">
            <CardComp
              image="/images/cabin chair.png"
              title="Chairs"
              subtitle="Special Offer"
            />
            <CardComp
              image="/images/table.jpg"
              title="Table"
              subtitle="Min. 10% OFF"
            />
            <CardComp
              image="/images/Executive chair.png"
              title="Sofa"
              subtitle="Min. 10% OFF"
            />
            <CardComp
              image="/images/banner-chair.jpg"
              title="Lights"
              subtitle="Min. 30% OFF"
            />
          </div>
        </div>
      </section>

      <section className="container px-4 lg:px-12 mx-auto py-14">
        <h3 className="font-lora text-3xl text-[#111] items-center justify-center flex">
          Shop from your favorite brands 
        </h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 py-8">
          {brands.map((brand, index) => (
            <div className="flex justify-center w-full h-28" key={index}>
              <img src={brand.image} alt={brand.name} className=" h-52 w-52" />
            </div>
          ))}
        </div>
      </section>

      <section className="container px-4 lg:px-12 mx-auto py-14">
        <div className="bg-[#F7FAFF] rounded-md p-4">
          <h2 className="text-3xl font-lora text-center mb-4">
            New & Trending Products
          </h2>
          <div className="flex gap-4 items-center justify-self-center w-full p-4">
            <img src="/images/ecommerce/image-7.png" className="w-full" />
            <img src="/images/ecommerce/image-8.png" className="w-full" />
            <img src="/images/ecommerce/image-9.png" className="w-full" />
          </div>
        </div>
      </section>

      <section className="container px-4 lg:px-12 mx-auto">
        <img src="/images/ecommerce/Featured Product.png" className="w-full" />
        <img src="/images/ecommerce/product.png" className="w-full" />
      </section>
    </div>
  );
}

export default Brands;
