import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md"; //MdOutlineKeyboardArrowLeft
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";

import { useNavigate } from "react-router-dom";

function ProductView() {
  const [mainImageHovered, setMainImageHovered] = useState(false); // For main image hover effect
  const [hoveredImage, setHoveredImage] = useState(null); // For additional image hover effect
  const [product, setproduct] = useState();
  const [productqunatity, setProductquantity] = useState(1);

  const navigate = useNavigate();

  //   get the product based on the product id
  const { id: productid } = useParams();

  console.log(productid);

  async function fetchproductbyid() {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*") // or specify fields like "name, price"
        .eq("id", productid)
        .single();

      if (error) throw new Error(error);

      const productwithoutimage = data;

      // 1. Extract image name
      const imageName = productwithoutimage.image;

      // 2. Generate signed URL from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls([imageName], 3600); // pass as array, 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URL:", signedUrlError);
        return;
      }

      // 3. Get the signed URL
      const signedUrl = signedUrls[0]?.signedUrl;

      // 4. Replace image name with the signed URL
      const productwithimage = {
        ...productwithoutimage,
        image: signedUrl || productwithoutimage.image, // fallback in case URL not generated
      };

      console.log(productwithimage);
      setproduct(productwithimage);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchproductbyid();
  }, [productid]);

  const baseImageUrl =
    "https://bwxzfwsoxwtzhjbzbdzs.supabase.co/storage/v1/object/public/addon/";

  const additionalImagesArray = product?.additional_images
    ? JSON.parse(product?.additional_images).map(
        (imageName) => `${baseImageUrl}${imageName}`
      )
    : [];

  console.log("additonal images ", additionalImagesArray);

  const handleProductQuantityInc = () => {
    if (productqunatity >= 1) {
      setProductquantity((prev) => prev + 1);
    }
  };
  const handleProductQuantityDec = () => {
    if (productqunatity > 1) {
      setProductquantity((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        {/* breadcumbs */}
        <div className="mt-10">
          <div className="flex mx-10 items-center text-[#334A78] text-sm mt-4 mb-4 md:mb-0">
            <button onClick={() => navigate("/products")}>Home</button>
            <MdOutlineKeyboardArrowRight
              size={15}
              style={{ color: "#334A78" }}
            />
            <button>{product?.title}</button>
          </div>
        </div>
        <div className={`flex p-2 lg:p-5 gap-1`}>
          <div className="flex-1">
            {product && (
              <div>
                <div
                  className="max-w-xl"
                  onMouseEnter={() => setMainImageHovered(true)}
                  onMouseLeave={() => setMainImageHovered(false)}
                  style={{ zIndex: mainImageHovered ? 10 : 1 }}
                >
                  <img
                    src={hoveredImage || product.image}
                    className=""
                    alt="product name "
                  />
                </div>
                {additionalImagesArray.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-3 mx-6 ml-16 mt-3">
                    {additionalImagesArray.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        width={50}
                        height={50}
                        onMouseEnter={() => setHoveredImage(img)}
                        onMouseLeave={() => setHoveredImage(null)}
                        className="cursor-pointer rounded-lg border-2 border-transparent"
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>no additional images </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col mt-2 md:mt-0 font-Poppins ">
            {/* product info */}
            <div className="flex flex-col justify-center">
              <div className="">
                <h2 className="font-semibold text-3xl text-[#111]">
                  {product?.title || "product title"}
                </h2>
                <p className="text-[#A5A6AD] text-base leading-[38.4px]">
                  Square bag
                </p>

                <div className="border border-[#ccc] p-1 w-32">
                  <p className="flex gap-1">
                    <span className="text-[#000] font-medium text-[10px]">
                      2.7
                    </span>{" "}
                    <AiFillStar color="#F5B92B" size={14} />
                    <span className="border-l border-l-[#CCCCCC] text-[#666] text-[10px]">
                      78 Ratings
                    </span>
                  </p>
                </div>
              </div>

              {/* product price section */}
              <div className="my-3">
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-[#334A78] leading-[38.4px]">
                    Rs {product?.price || "Rs 3,0000"}
                  </p>
                  <p className="text-lg text-[#898994] leading-[38.4px]">
                    MRP <span className="line-through">$5678</span>
                  </p>
                  <p className="text-[#F69E60]">(Rs.2678 OFF)</p>
                </div>
                <p className="text-xs text-[#3AA495]">inclusive of all taxes</p>
              </div>

              <div className="my-3">
                <p className="text-[#334A78] text-sm ">colors</p>
                <div className="flex gap-3">
                  <div className="px-5 py-2 bg-[#000]/5 inline-block text-sm text-[#334A78] uppercase text-center border border-[#334A78]">
                    black
                  </div>
                  <div className="px-4 py-2 bg-[#fff] inline-block text-sm text-[#334A78] uppercase text-center border border-[#ccc]">
                    GREEN
                  </div>
                </div>
              </div>

              {/* qunatiy counter */}
              <div>
                <h2 className="font-semibold text-[#334A78] text-sm capitalize">
                  Quantity
                </h2>
                <div className=" flex  gap-3 my-2">
                  <div className="flex items-start justify-start gap-2">
                    <button
                      className="border-2 px-2 w-12 py-2 font-semibold"
                      onClick={handleProductQuantityDec}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="border-2 px-2 w-12 py-2 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                      min={1}
                      value={productqunatity}
                    />
                    <button
                      className="border-2 px-2 w-12 py-2 font-semibold"
                      onClick={handleProductQuantityInc}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* add to card and buy now */}
              <div className="my-4 flex gap-8 ">
                <button className="text-[#212B36] uppercase bg-[#FFFFFF] border border-[#212B36] w-52 px-10 py-4 rounded-sm ">
                  aDD TO CART
                </button>
                <button className="text-[#212B36] uppercase bg-[#FFFFFF] border border-[#212B36] w-52 px-10 py-4 rounded-sm ">
                  buy now
                </button>
              </div>
            </div>
            {/* product description */}
            <div className="mt-2 md:mt-5 text-[#334A78] font-Poppins xl:w-2/3 ">
              <h3 className="text-sm  uppercase font-bold  border-b-2">
                Product Details
              </h3>
              {/* material and water*/}
              <ProductDetailreusable
                title1={"MATERIAL:"}
                desc1={"PU Material"}
                title2={"WATER RESISTANT:"}
                desc2={"Yes"}
              />
              <ProductDetailreusable
                title1={"PATTERN:"}
                desc1={"Yes"}
                title2={"COMPARTMENT:"}
                desc2={"Yes"}
              />
              <ProductDetailreusable
                title1={"DIMENSIONS (H x L x W):"}
                desc1={"18x22x12 cm"}
                title2={"POCKETS:"}
                desc2={"Yes"}
              />
              <ProductDetailreusable
                title1={"HANDLE:"}
                desc1={"Yes"}
                title2={"CLOSURE:"}
                desc2={"Snap Lock"}
              />
              <ProductDetailreusable
                title1={"CARE INSTRUCTION:"}
                desc1={"Wipe with clean, soft cloth"}
                title2={"WHAT ALL CAN FIT IN:"}
                desc2={"Mobile can fit in"}
              />
            </div>
          </div>
        </div>

        {/* cusstomer review */}
        <div className="flex justify-between items-center border-2 border-[#334A78]/20 mt-10 mb-10 p-4 font-Poppins">
          <div>
            <h3 className="text-[#171717] font-semibold text-2xl">
              Customer Reviews
            </h3>
            <p className="text-[#334A78] text-sm">No reviews yet</p>
          </div>
          <div>
            <p className="text-[#C16452] text-sm">Write a review</p>
          </div>
        </div>

        <div className="my-10 font-Poppins">
          <h3 className="text-[#171717] text-2xl  font-semibold">
            Similar Products
          </h3>
          {product && <Card product={product} />}
        </div>
      </div>

      {/* bottom tabs  */}
      <section className=" w-full bg-[#B8CCCC]/50 px-10 py-2  ">
        <div className="font-Poppins flex  justify-around items-center">
          <div className="flex flex-col justify-center">
            <div className="flex justify-center">
              <MdOutlineLocalShipping size={25} />
            </div>
            <button className="font-semibold text-lg text-[#171717]">
              Free shipping
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex justify-center">
              <MdOutlineLocalShipping size={25} />
            </div>
            <button className="font-semibold text-lg text-[#171717]">
              New styles
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex justify-center">
              <MdOutlineLocalShipping size={25} />
            </div>
            <button className="font-semibold text-lg text-[#171717]">
              Gift cards
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex justify-center">
              <MdOutlineLocalShipping size={25} />
            </div>
            <button className="font-semibold text-lg text-[#171717]">
              5.0 Trustpilot rating
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductView;

function ProductDetailreusable({ title1, title2, desc1, desc2 }) {
  return (
    <div className=" border-b-2 pt-2 pb-1 flex gap-2">
      <div className="flex-1">
        <p className="text-xs md:text-sm uppercase font-bold ">{title1}</p>
        <span className="text-xs  ">{desc1}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs md:text-sm uppercase font-bold ">{title2}</p>
        <span className="text-xs  ">{desc2}</span>
      </div>
    </div>
  );
}

function Card({ product }) {
  return (
    <div>
      <div className="max-w-xs">
        <img src="/images/productChair.png" alt="chair" />
      </div>
      <div>
        <h4>FLAMINGO SLING</h4>
        <div className="">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-[#334A78] ">
              Rs {product?.price || "Rs 3,0000"}
            </p>
            <p className="text-lg text-[#898994] ">
              MRP <span className="line-through">$5678</span>
            </p>
            <p className="text-[#F69E60]">(Rs.2678 OFF)</p>
          </div>
          <p className="text-xs text-[#3AA495]">inclusive of all taxes</p>
        </div>
        <button className="text-[#212B36] uppercase bg-[#FFFFFF] text-xs border border-[#212B36] w-32  py-2 rounded-sm ">
          aDD TO CART
        </button>
      </div>
    </div>
  );
}
