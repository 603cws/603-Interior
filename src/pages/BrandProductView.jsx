import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import LandingNavbar from "../common-components/LandingNavbar";
import { FaStarOfLife } from "react-icons/fa";
import { GoHeart } from "react-icons/go";

function BrandProductView() {
  const additionalImagesArray = [
    { img: "/images/productviewsample2.jpg" },
    { img: "/images/productviewsample2.jpg" },
    { img: "/images/productviewsample2.jpg" },
    { img: "/images/productviewsample2.jpg" },
  ];

  const features = [
    "Multiple Design Possibilities",
    "Highly Resilient Fiber",
    "Stain Resistant",
    "Fade Resistant",
  ];

  const careInstructions = [
    "Preventative Maintenance: Containing the soil entering the building using the walk-off mats at entrances. This includes outside matting, inside matting, and mats at certain other high-traffic areas",
    "Vaccuming: It is the single most important part of a maintenance program designed to remove soil or dust from the top surface",
    "Quick removal of spills is key to reducing any chance of stain",
    "Interim Cleaning: Several different methods can be used. Regularly scheduled interim cleaning can prolong the need for restorative cleaning",
  ];
  return (
    <div>
      <div className="">
        <LandingNavbar />
      </div>

      <div className="lg:container lg:mx-auto px-4 lg:px-12 mt-24">
        {/* breadcumbs */}
        <div className="mt-10">
          <div className="flex lg:mx-10 items-start lg:items-center text-[#334A78] text-sm mt-4 mb-4 md:mb-0">
            <button>Home</button>
            <MdOutlineKeyboardArrowRight
              size={20}
              style={{ color: "#334A78" }}
            />
            <button>Aged Oak</button>
          </div>
        </div>

        {/* <div className={`grid grid-cols-[2fr,1fr] pt-5`}>
          <div className="">
            <div className="flex">
              <div>
                {additionalImagesArray.length > 0 ? (
                  <div className="flex flex-col  gap-3 mx-6 ml-16 ">
                    {additionalImagesArray.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.img}
                        alt={`Angle ${idx + 1}`}
                        className="w-44 h-36 cursor-pointer  border-2 border-transparent"
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>no additional images </p>
                  </div>
                )}
              </div>
              <div className="max-w-xl">
                <img
                  src="/images/productviewsample1.jpg"
                  className=""
                  alt="product name "
                />
              </div>
            </div>
          </div>

          <div className=" flex flex-col mt-2 md:mt-0 font-Poppins ">
            <h2 className="text-[41.28px] leading-[41.3px] tracking-[0.75px] text-[#000]">
              Gemini (Archer)
            </h2>
            <p className="text-[12.75px] leading-[18px] ">
              Experience the epitome of creativity and grace with the Celestial
              collection's Archer range of the . Archer's solid texture and the
              splash of blue is an ideal combinations to make your house look
              stunning.
            </p>

            <button className="">DOWNLOAD HI-RES TILE IMAGES</button>
          </div>
        </div> */}
        <div className={`flex flex-col lg:flex-row pt-5 gap-10 mb-12`}>
          <div className="w-[60%]">
            <div className="flex">
              <div>
                {additionalImagesArray.length > 0 ? (
                  <div className="flex flex-col  gap-3 mx-6 ml-16 ">
                    {additionalImagesArray.map((img, idx) => (
                      <div className="w-32" key={idx}>
                        <img
                          src={img.img}
                          alt={`Angle ${idx + 1}`}
                          className="w-full cursor-pointer rounded-lg border-2 border-transparent"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>no additional images </p>
                  </div>
                )}
              </div>
              <div className="max-w-xl">
                <img
                  src="/images/productviewsample1.jpg"
                  className=""
                  alt="product name "
                />
              </div>
            </div>
          </div>

          <div className="w-[40%] flex flex-col mt-2 md:mt-0 font-Poppins ">
            <h2 className="text-[41.28px] leading-[41.3px] tracking-[0.75px] text-[#000] mb-8">
              Gemini (Archer)
            </h2>
            <p className="text-[12.75px] leading-[18px] mb-8">
              Experience the epitome of creativity and grace with the Celestial
              collection's Archer range of the . Archer's solid texture and the
              splash of blue is an ideal combinations to make your house look
              stunning.
            </p>

            <button className="border-[#000] border py-2 text-[10.5px] mb-5">
              DOWNLOAD HI-RES TILE IMAGES
            </button>
            <button className="border-[#000] border py-2 text-[10.5px] mb-10">
              WARRANTY
            </button>

            <div className="flex justify-between text-[11.25px]">
              <p>More From Eden</p>
              <p>View More</p>
            </div>

            <div className="flex gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div className="max-w-xs">
                  <img
                    src="/images/Edencolor.png"
                    alt="color"
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-around">
              <p className="text-[10.5px] leading-[10.5px] tracking-[2px]">
                MAKE AN ENQUIRY
              </p>
              <div className="flex items-center gap-1">
                <div className="w-12 h-12 bg-[#1E148F]"></div>
                <p className="text-[10.5px] leading-[10.5px] tracking-[2px]">
                  DOWNLOAD LOOKBOOK
                </p>
              </div>
            </div>

            {/* <div>
              <div>
                <img src="/images/Edencolor.png" alt="color" />{" "}
              </div>
            </div> */}
          </div>
        </div>

        <FeatureRow features={features} />

        <div className="flex justify-center items-center gap-2 mb-12 mt-24">
          <div>
            <FaStarOfLife className="text-[#2A3E65] text-xs" />
          </div>
          <h2>TILE SPECIFICATIONS</h2>
        </div>

        <div className="flex justify-around mb-10">
          <Specifications />
          <Specifications />
          <Specifications />
          <Specifications />
          <Specifications />
          <Specifications />
        </div>

        <div className="flex flex-col gap-6 mt-[89px] mb-16">
          <h2 className="text-[#1E148F] uppercase text-[12.75px] leading-[12.8px] tracking-[1px]">
            CARE INSTRUCTIONS
          </h2>
          <h3 className="text-[#000] text-[45px] leading-[45px] mb-4 mx-6">
            Few care instructions for home flooring <br /> tiles to keep them
            looking their best
          </h3>
        </div>

        <div>
          <FeatureRow features={careInstructions} type={false} />
        </div>

        <div className="my-10 font-Poppins">
          <h3 className="text-[#171717] text-2xl lg:text-3xl  uppercase mb-3 font-semibold">
            Similar Products
          </h3>

          <div className="flex justify-around items-center">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandProductView;

function FeatureRow({ features, type = true }) {
  return (
    <div className="flex justify-between items-start mb-10 ">
      {features.map((text, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center relative text-center px-4"
        >
          {/* Top Star and Divider */}
          <div className="flex items-center w-full mb-4">
            <FaStarOfLife className="text-[#2A3E65] text-xs" />
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Text */}
          <p
            className={`${
              type ? "text-[22.5px]" : "text-xs"
            } text-[#2A3E65] text-start leading-8`}
          >
            {text}
          </p>

          {/* Right vertical divider (except last item) */}
          {i !== features.length - 1 && (
            <div className="absolute right-0 top-4 h-full w-px bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

function Specifications() {
  return (
    <div className="flex p-5 flex-col justify-around items-center gap-6 border border-[#000] font-inter ">
      <div>
        <img src="/images/articlecode.png" alt="articlecode" />
      </div>
      <h2 className="text-xs leading-[12px] tracking-[2.25px]">Article Code</h2>
      <p className="text-[13.5px] tracking-[2.25px] text-[#1E148F] mb-5">
        CTY00299
      </p>
    </div>
  );
}

function Card() {
  // function Card({ product, handleCompareToggle, compare }) {
  //   const { isAuthenticated, localcartItems, cartItems, wishlistItems } =
  //     useApp();
  //   const isWishlisted = wishlistItems?.some(
  //     (item) => item.productId?.id === product.id
  //   );

  //   const naviagte = useNavigate();

  //   const { handleAddtoWishlist, handleAddToCart } = useHandleAddToCart();

  //   const [iscarted, setIsCarted] = useState(false);

  //   useEffect(() => {
  //     if (!product?.id) return;

  //     if (isAuthenticated) {
  //       const check = cartItems?.some(
  //         (item) => item.productId?.id === product.id
  //       );
  //       setIsCarted(check);
  //     } else {
  //       const check = localcartItems?.some(
  //         (item) => item.productId?.id === product.id
  //       );
  //       // console.log("check", check);

  //       setIsCarted(check);
  //       // console.log("iscarted", iscarted);
  //     }
  //   }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  return (
    <div className="font-Poppins max-w-xs lg:w-[245px] lg:h-[360px] border border-[#ccc]">
      <div
        // onClick={() => naviagte(`/productview/${product.id}`)}
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src="/images/blogoffice.png"
          alt="chair"
          className="h-52 object-contain"
        />
        {/* <img src={product.image } alt="chair" className="h-52 object-contain" /> */}
      </div>
      <div className="bg-[#fff] p-2">
        <div className="flex ">
          <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] ">
            <h4 className="font-medium text-sm leading-[22.4px] ">
              {/* {product?.title} */}enijfioejfo
            </h4>
            <div className="flex items-center gap-2">
              <p className=" ">Rs {"Rs 3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs $5678
              </p>
              <p className="text-[#C20000]">sale</p>
            </div>
          </div>
          <div
            // onClick={() => handleAddtoWishlist(product)}
            className=" text-[#ccc] hover:text-red-950 cursor-pointer"
          >
            {/* {isWishlisted ? (
              <AiFillHeart size={26} color="red" />
            ) : (
              <GoHeart size={25} />
            )} */}
            <GoHeart size={25} />
          </div>
        </div>
        <button
          //   onClick={() => handleAddToCart(product)}
          className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm "
        >
          {/* {iscarted ? "added to cart" : "add to cart"} */}
          add to cart
        </button>
      </div>
    </div>
  );
}
