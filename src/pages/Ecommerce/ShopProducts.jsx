import { useEffect, useRef, useState } from "react";

import { supabase } from "../../services/supabase";
import SpinnerFullPage from "../../common-components/SpinnerFullPage";

import { useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from "react-icons/md";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";

import Header from "./Header";

function ShopProducts() {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [productsloading, setProductsloading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  let items = products;
  let itemsPerPage = 20;

  // Calculate total pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const end = Math.min(indexOfLastItem, items.length);

  const resultText = `Showing ${indexOfFirstItem + 1}–${end} of ${
    items.length
  } results`;

  console.log(
    "totalpages",
    totalPages,
    "indexoflastitem",
    indexOfLastItem,
    "indexoffirstitem",
    indexOfFirstItem,
    "currentitems",
    currentItems
  );

  // Handle page change
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // fetchdata();
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setProductsloading(true);
      const { data, error } = await supabase
        .from("product_variants")
        .select(`* ,product_id(*)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter products where it is approved
      const filtered = data.filter(
        (item) =>
          item.status === "approved" &&
          item.product_id.category !== "Partitions / Ceilings" &&
          item.product_id.category !== "Civil / Plumbing"
      );

      // 1. Extract unique image names
      const uniqueImages = [...new Set(filtered.map((item) => item.image))];

      // 2. Generate signed URLs from Supabase Storage
      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon") // your bucket name
        .createSignedUrls(uniqueImages, 3600); // 1 hour expiry

      if (signedUrlError) {
        console.error("Error generating signed URLs:", signedUrlError);
        return;
      }

      // 3. Create a map from image name to signed URL
      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      // 4. Replace image names with URLs in the array
      const updatedProducts = filtered.map((item) => ({
        ...item,
        image: urlMap[item.image] || item.image, // fallback if URL not found
      }));

      console.log(updatedProducts);

      setData(filtered);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setProductsloading(false);
    }
  };
  const categoryies = [
    {
      name: "Furniture",
      imagename: "/images/icons/Furniture.png",
    },
    {
      name: "Lighting",
      imagename: "/images/icons/Lighting.png",
    },
    {
      name: "Paint",
      imagename: "/images/icons/Paint.png",
    },
    // {
    //   name: `Civil & Plumbing`,
    //   imagename: "/images/icons/CivilPlumbing.png",
    // },
    {
      name: "Flooring",
      imagename: "/images/icons/Flooring.png",
    },
    // {
    //   name: "Partition",
    //   imagename: "/images/icons/PartitionsCeilings.png",
    // },
    {
      name: "HVAC",
      imagename: "/images/icons/HVAC.png",
    },
    {
      name: "Smart Solution",
      imagename: "/images/icons/SmartSolutions.png",
    },
    {
      name: "Lux",
      imagename: "/images/icons/Lux.png",
    },
  ];
  return (
    <div>
      <Header />
      <section>
        <div className="lg:container lg:mx-auto my-10">
          <SectionHeader title={"Shop "} isborder={false} />
          <div className="flex overflow-x-auto items-center justify-around my-10 gap-6">
            {categoryies.map((cat) => (
              <div
                className="flex flex-col lg:justify-center  lg:items-center gap-3"
                key={cat.name}
              >
                <div className="bg-[#F8F8F8] border border-[#ccc] p-4 w-16 h-16 xl:w-20 xl:h-20">
                  <img src={cat.imagename} alt="category" className="" />
                </div>
                <h3 className="font-lora text-[#111] text-xs lg:text-sm">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className="font-Poppins container mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side banners */}
          <div className="flex flex-col items-center gap-6 md:w-[20%] w-full ">
            <div className="w-full space-y-4">
              <div className="flex justify-start gap-2 items-center text-[#334A78] ">
                <div>
                  <IoFilter size={20} />
                </div>
                <h3 className="font-semibold text-sm">Filter(1) </h3>
                <div>
                  <MdKeyboardArrowLeft size={20} />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[#334A78] text-[15px] font-semibold leading-[24px]">
                    Out of stock
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#334A78]  ">show</button>
                  <button className="text-[15px] text-[#334A78] border border-[#334A78] p-1">
                    Hide
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  Shop by Categories
                </h4>
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  price
                </h4>
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  color
                </h4>
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
              <div className="flex justify-between items-center text-[#334A78]">
                <h4 className="text-[15px] font-semibold leading-[24px]">
                  brand
                </h4>
                <div className="">
                  <MdKeyboardArrowDown size={25} />
                </div>
              </div>
            </div>
          </div>
          {!productsloading ? (
            <div className="md:w-[80%] w-full ">
              <div className="flex justify-between items-center font-lora border-b border-b-[#CCCCCC] mb-3 pb-2">
                <p className="text-[#191716]  text-[13px] leading-3 tracking-[1px]">
                  {resultText}
                </p>
                <div className="flex font-Poppins text-[#334A78] text-[15px] leading-[24px] border border-[#CCCCCC] p-1">
                  <p>Sort by:</p>
                  <select name="popularity" id="" className="font-semibold">
                    <option value="popular">popular</option>
                    <option value="popular">famous</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-8 ">
                {currentItems.map((product, index) => (
                  <div>
                    <Card product={product} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center my-10">
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-5 py-2  rounded disabled:hidden"
                  >
                    <FaArrowLeftLong />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`px-5 py-2 rounded font-lora font-semibold ${
                        currentPage === i + 1
                          ? "bg-[#304778] text-white"
                          : "bg-[#fff] text-[#232323]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-5 py-2 rounded disabled:hidden"
                  >
                    <FaArrowRightLong />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              <SpinnerFullPage />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ShopProducts;

function SectionHeader({ title, isborder = true }) {
  return (
    <div className="flex flex-col justify-center items-center mb-10">
      <h3 className="font-lora text-2xl text-[#111] tracking-wider uppercase mb-2">
        {title}
      </h3>
      {isborder && (
        <p className="w-[20%] lg:w-[4%] h-[1.5px] bg-[#374A75] "></p>
      )}
    </div>
  );
}

function Card({ product }) {
  return (
    <div className="font-Poppins max-w-sm max-h-sm  border border-[#ccc]">
      <div className="flex justify-center items-center p-2">
        <img src={product.image} alt="chair" className="h-52 object-contain" />
      </div>
      <div className="bg-[#fff] p-2">
        <div className="flex ">
          <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] ">
            <h4 className="font-medium text-sm leading-[22.4px] ">
              {product?.title}
            </h4>
            <div className="flex items-center gap-2">
              <p className=" ">Rs {product?.price || "Rs 3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs $5678
              </p>
              <p className="text-[#C20000]">sale</p>
            </div>
          </div>
          <div className=" text-[#ccc] hover:text-red-950 ">
            <FaHeart size={25} />
          </div>
        </div>
        <button className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm ">
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

function BannerProduct() {
  const naviagte = useNavigate();
  return (
    <div className="max-w-60 w-full h-96 relative rounded overflow-hidden shadow-lg">
      <img
        src="/images/banner-chair.jpg"
        alt="Meeting Chairs"
        className="w-full h-full object-cover"
      />

      <div
        className="absolute top-0 left-0 w-full bg-[#e0f4ff] text-black flex flex-col justify-evenly px-6"
        style={{
          clipPath: "ellipse(95% 100% at 25% 0%)",
          height: "45%",
        }}
      >
        <p className="text-xs uppercase tracking-[3px] font-lora">
          New collection
        </p>
        <h2 className="text-lg font-lora tracking-wide">
          MEETING <br /> CHAIRS
        </h2>
        <button
          onClick={() => naviagte("/shop")}
          className="mt-1 text-sm underline underline-offset-4 decoration-[#aaaaaa] flex items-center gap-2 group overflow-hidden relative hover:scale-105 transition-transform duration-700 ease-in-out"
        >
          <span className="relative z-10">Discover more</span>
          <BsArrowRight
            size={15}
            className="absolute opacity-0 group-hover:opacity-100 translate-x-[550%] group-hover:translate-x-[700%] transition-transform duration-700 ease-in-out"
          />
        </button>
      </div>
    </div>
  );
}
