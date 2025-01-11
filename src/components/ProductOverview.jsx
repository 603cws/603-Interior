function ProductOverview() {
  return (
    // grid
    <>
      <div className="grid grid-cols-2  ">
        {/* grid component 1 */}
        <div className=" ">
          {/* main div for image */}
          <div className="flex items-center justify-center">
            <img
              src="images/chair/image.png"
              // width={600}
              // height={600}
              className="object-cover"
              alt=""
            />
          </div>
          {/* flex box for other images  */}
          <div className="flex justify-start gap-1 mx-6">
            <img src="images/chair/1.png" width={100} height={100} alt="" />
            <img src="images/chair/2.png" width={100} height={100} alt="" />
            <img src="images/chair/3.png" width={100} height={100} alt="" />
            <img src="images/chair/4.png" width={100} height={100} alt="" />
            <img src="images/chair/5.png" width={100} height={100} alt="" />
          </div>
        </div>
        {/* grid component 2 */}
        <div className=" flex flex-col">
          {/* product info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[36px] font-bold mb-3">Product Name</h2>
            <span className="text-2xl font-medium text-[#334A78] mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
              error sit dolores dolorem accusamus qui.
            </span>
            <p className="text-3xl font-semibold mb-2">7000</p>
            {/* <span className="text-2xl font-semibold line-through mb-3">
            Mrp 13202
          </span> */}
          </div>
          {/* final price section */}
          <div className="mt-3">
            <p className="text-2xl font-medium text-[#334A78]  mb-3">
              Final Price
            </p>
            <p className="text-3xl font-bold mb-3">Price</p>
            <p className="text-2xl font-medium text-[#334A78]  mb-3">
              Total Quantity{" "}
              <span className="border-2 py-2 border-[#334A78] text-[#1a1b1c] rounded-xl px-5 ">
                5
              </span>{" "}
            </p>
            <button className=" border-2 border-[#212B36] p-5 text-2xl w-1/2  mb-3 mt-2">
              Add to cart
            </button>
          </div>
          {/* product description */}
          <div className="mt-5">
            <h2 className="text-3xl uppercase font-bold text-[#334A78]  border-b-2 mb-3">
              Product Details
            </h2>
            {/* manufacture */}
            <div className="border-b-2">
              <p className="text-2xl uppercase font-bold text-[#334A78] mb-3">
                Manufacturer
              </p>
              <span className="text-xl text-[#334A78] mb-2">
                Name of the manufacturer
              </span>
            </div>
            {/* dimensions */}
            <div className="border-b-2 mt-3">
              <p className="text-2xl uppercase font-bold text-[#334A78] mb-3">
                dimensions(H x l x W)
              </p>
              <span className="text-xl text-[#334A78] mb-2">
                dimension value
              </span>
            </div>
            {/* instruction  */}
            {/* <div>
            <p> instruction</p>
            <span>instruction text</span>
          </div> */}
            <div className="border-b-2 mt-3">
              <p className="text-2xl uppercase font-bold text-[#334A78] mb-3">
                instruction
              </p>
              <span className="text-xl text-[#334A78] mb-2">
                Lorem ipsum dolor sit amet.
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className=" w-60 h-64 bg-white flex-col justify-center items-center inline-flex overflow-hidden">
        <div className=" w-60 h-64 relative flex-col justify-start items-start flex overflow-hidden">
          <img className="relative  w-60 h-64" src="images/chair/1.png" />
          <div className="absolute bottom-10 right-10 w-36 px-16 py-4 bg-white rounded-sm border border-gray-800 justify-center items-center gap-2.5 inline-flex">
            <div className=" text-center text-gray-800 text-xs font-normal font-['Poppins'] uppercase leading-none tracking-wider">
              aDD TO Cart
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default ProductOverview;
