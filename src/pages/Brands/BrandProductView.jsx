import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import LandingNavbar from "../../common-components/LandingNavbar";
import { FaStarOfLife } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import Footer from "../../common-components/Footer";

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

const similarproducts = [
  {
    image: "/images/brandproductview1.png",
    title: "Product Name",
  },
  {
    image: "/images/brandproductview2.png",
    title: "Product Name",
  },
  {
    image: "/images/brandproductview3.png",
    title: "Product Name",
  },
  {
    image: "/images/brandproductview4.png",
    title: "Product Name",
  },
  {
    image: "/images/brandproductview2.png",
    title: "Product Name",
  },
];
const tileSpecification = [
  {
    image: "/images/articlecode.png",
    title: "article code",
    code: "CTY00299",
  },
  {
    image: "/images/titlespecification2.png",
    title: "design code",
    code: "CA0352 (006)",
  },
  {
    image: "/images/titlespecification3.png",
    title: "type of yarn",
    code: "Nylon",
  },
  {
    image: "/images/titlespecification4.png",
    title: "tufted weight",
    code: "14.5 oz",
  },
  {
    image: "/images/titlespecification5.png",
    title: "pile thickness",
    code: "3-3.5 mm",
  },
  {
    image: "/images/titlespecification6.png",
    title: "wear layer",
    code: "4.5-5 mm",
  },
];

const careInstructions = [
  "Preventative Maintenance: Containing the soil entering the building using the walk-off mats at entrances. This includes outside matting, inside matting, and mats at certain other high-traffic areas",
  "Vaccuming: It is the single most important part of a maintenance program designed to remove soil or dust from the top surface",
  "Quick removal of spills is key to reducing any chance of stain",
  "Interim Cleaning: Several different methods can be used. Regularly scheduled interim cleaning can prolong the need for restorative cleaning",
];
function BrandProductView() {
  return (
    <div>
      <div className="">
        <LandingNavbar />
      </div>

      <div className="lg:container lg:mx-auto px-3 lg:px-12 mt-10 lg:mt-10">
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
        <div
          className={`flex flex-col lg:flex-row lg:justify-between  lg:pt-5 lg:gap-6  mb-12`}
        >
          <div className="lg:w-[60%]">
            <div className="flex ">
              <div>
                {additionalImagesArray.length > 0 ? (
                  <div className="flex flex-col gap-3 mx-6 ">
                    {additionalImagesArray.map((img, idx) => (
                      <div className="w-12 lg:w-32" key={idx}>
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
                <img src="/images/productviewsample1.jpg" alt="product name" />
              </div>
            </div>
          </div>

          <div className="lg:w-[40%] flex flex-col mt-2  md:mt-6 lg:mt-0 font-TimesNewRoman ">
            <h2 className="text-xl lg:text-[41.28px] leading-[41.3px] tracking-[0.75px] text-[#000] mb-2 lg:mb-8">
              Gemini (Archer)
            </h2>
            <p className="text-sm leading-[18px] mb-8">
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

            <div className="flex justify-between text-xs mb-3">
              <p>More From Eden</p>
              <p>View More</p>
            </div>

            <div className="flex flex-wrap  gap-6 mb-3">
              {Array.from({ length: 12 }, (_, i) => (
                <div className="max-w-xs">
                  <img
                    src="/images/Edencolor.png"
                    alt="eden color"
                    className="w-10 h-9"
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
          </div>
        </div>

        <FeatureRow features={features} />

        <div className="flex justify-center items-center gap-2 mb-12 mt-24">
          <div>
            <FaStarOfLife className="text-[#2A3E65] text-xs" />
          </div>
          <h2>TILE SPECIFICATIONS</h2>
        </div>

        <div className="flex gap-4 lg:gap-0 flex-wrap lg:flex-nowrap justify-around mb-2 lg:mb-10">
          {tileSpecification?.map((tile, idx) => (
            <Specifications key={idx} product={tile} />
          ))}
        </div>

        <div className="flex flex-col gap-6 mt-8 lg:mt-[89px] mb-3 lg:mb-16">
          <h2 className="text-[#1E148F] uppercase text-[12.75px] leading-[12.8px] tracking-[1px]">
            CARE INSTRUCTIONS
          </h2>
          <h3 className="text-[#000] text-lg lg:text-[45px] lg:leading-[45px] mb-4 lg:mx-6">
            Few care instructions for home flooring{" "}
            <br className="hidden lg:block" /> tiles to keep them looking their
            best
          </h3>
        </div>

        <div>
          <FeatureRow features={careInstructions} type={false} />
        </div>

        <div className="my-10 font-TimesNewRoman">
          <h3 className="text-[#171717] text-2xl lg:text-3xl  uppercase mb-3 font-semibold">
            Similar Products
          </h3>

          <div className=" grid grid-cols-2 gap-2 lg:gap-0 lg:flex justify-between items-center">
            {similarproducts?.map((similarProd, idx) => (
              <Card key={idx} product={similarProd} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BrandProductView;

function FeatureRow({ features, type = true }) {
  return (
    <div className="flex flex-wrap gap-3 lg:gap-0 lg:flex-nowrap justify-between items-start mb-4 lg:mb-10 ">
      {features.map((text, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col  items-center relative text-center px-4"
        >
          {/* Top Star and Divider */}
          <div className="flex items-center w-full mb-2 lg:mb-4">
            <FaStarOfLife className="text-[#2A3E65] text-xs" />
            <div className="w-full h-px bg-gray-300" />
          </div>

          {/* Text */}
          <p
            className={`${
              type ? "text-sm lg:text-[22.5px]" : "text-xs"
            } text-[#2A3E65] text-start lg:leading-8 line-clamp-6 lg:line-clamp-none`}
          >
            {text}
          </p>

          {/* Right vertical divider (except last item) */}
          {i !== features.length - 1 && (
            <div className="absolute right-0 top-2 lg:top-4 h-full w-px bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

function Specifications({ product }) {
  return (
    <div className="flex-1 md:flex-none flex p-5 flex-col  justify-around items-center gap-6 border border-[#000] font-inter ">
      <div>
        <img src={product?.image} alt="article code" />
      </div>
      <h2 className="text-xs lg:leading-[12px] lg:tracking-[2.25px] capitalize">
        {product?.title}
      </h2>
      <p className="text-[13.5px] tracking-[2.25px] text-[#1E148F] lg:mb-5">
        {product?.code}
      </p>
    </div>
  );
}

function Card({ product }) {
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
    <div className="font-TimesNewRoman max-w-xs lg:w-[245px] lg:h-[310px] border border-[#ccc]">
      {/* <div className="font-Poppins max-w-xs lg:w-[245px] lg:h-[340px] border border-[#ccc]"> */}
      <div
        // onClick={() => naviagte(`/productview/${product.id}`)}
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt="cabin chair"
          className="h-40 lg:h-52 w-full"
        />
        {/* <img src={product.image } alt="chair" className="h-52 object-contain" /> */}
      </div>
      <div className="bg-[#fff] p-2">
        <div className="flex ">
          <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] ">
            <div className="flex justify-between items-center lg:flex-none">
              <h4 className="font-medium text-sm leading-[22.4px] capitalize">
                {product?.title}
              </h4>
              <div
                // onClick={() => handleAddtoWishlist(product)}
                className=" text-[#ccc] hover:text-red-950 cursor-pointer lg:hidden"
              >
                {/* {isWishlisted ? (
                <AiFillHeart size={26} color="red" />
              ) : (
                <GoHeart size={25} />
              )} */}
                {/* <GoHeart size={22} /> */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className=" ">Rs {"3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs 5678
              </p>
              <p className="text-[#C20000]">sale</p>
            </div>
          </div>
          {/* <div
            // onClick={() => handleAddtoWishlist(product)}
            className=" text-[#ccc] hover:text-red-950 cursor-pointer hidden lg:block"
          >
            {isWishlisted ? (
              <AiFillHeart size={26} color="red" />
            ) : (
              <GoHeart size={25} />
            )}
            <GoHeart size={20} />
          </div> */}
        </div>
        {/* <button
            onClick={() => handleAddToCart(product)}
          className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm "
        >
          {iscarted ? "added to cart" : "add to cart"}
          add to cart
        </button> */}
      </div>
    </div>
  );
}
