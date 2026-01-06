import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { useEcomApp } from "../../Context/EcomContext";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { useEffect, useState } from "react";
import { GoHeart } from "react-icons/go";
import { AiFillHeart } from "react-icons/ai";

export default function Card({ image, title, subtitle }) {
  return (
    <div className="w-[calc(50%-0.5rem)] shadow-sm border border-[#CCCCCC] p-2">
      <img src={image} alt={title} className="w-full h-48 object-contain" />
      <h3 className="text-sm lg:text-2xl leading-[24px] tracking-[0.96px] font-medium mt-2 mb-1 lg:mb-2 font-Poppins ml-2">
        {title}
      </h3>
      <p className="text-[#378DDB] leading-[24px] tracking-[0.96px] font-medium font-Poppins text-sm lg:text-xl ml-2">
        {subtitle}
      </p>
    </div>
  );
}

export function CardWithCompare({ product, handleCompareToggle, compare }) {
  const { isAuthenticated } = useApp();
  const { cartItems, wishlistItems, localcartItems } = useEcomApp();
  const isWishlisted = wishlistItems?.some(
    (item) => item.productId?.id === product.id
  );

  const naviagte = useNavigate();

  const { handleAddtoWishlist, handleAddToCart } = useHandleAddToCart();

  const [iscarted, setIsCarted] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id
      );

      setIsCarted(check);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  return (
    <div className="font-Poppins max-w-xs lg:w-[245px] h-[350px] md:h-[320px]  lg:h-[400px] border border-[#ccc]">
      <div
        onClick={() => naviagte(`/productview/${product.id}`)}
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          className="h-44 lg:h-52 object-contain"
        />
      </div>
      <div className="bg-[#fff] p-1.5 lg:p-2">
        <div className="flex ">
          <div className="flex-1 text-sm leading-[22.4px] text-[#111] ">
            <h4 className="font-medium line-clamp-2 text-xs lg:text-sm leading-[22.4px] ">
              {product?.title}
            </h4>
            <div className="flex text-xs lg:text-sm items-center gap-2">
              <p className=" ">Rs {product?.price || "Rs 3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">
                Rs 5678
              </p>
              <p className="text-[#C20000] hidden md:block">sale</p>
            </div>
            <p className="text-[#C20000] md:hidden block uppercase">sale</p>
          </div>
          <div
            onClick={() => handleAddtoWishlist(product)}
            className=" text-[#ccc] hover:text-red-950 cursor-pointer"
          >
            {isWishlisted ? (
              <AiFillHeart size={26} color="red" />
            ) : (
              <GoHeart size={25} />
            )}
          </div>
        </div>
        <button
          onClick={() => handleAddToCart(product, iscarted)}
          className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2 py-2 my-2 lg:my-4 rounded-sm hover:bg-[#DDDDDD]"
        >
          {iscarted ? "go to cart" : "add to cart"}
        </button>
        <div className="hidden lg:flex gap-3">
          <input
            type="checkbox"
            name="compare"
            id={`compare-${product.id}`}
            checked={compare?.some((item) => item.id === product.id)}
            onChange={() => handleCompareToggle(product)}
          />
          <label htmlFor="" className="text-xs">
            Add to compare
          </label>
        </div>
      </div>
    </div>
  );
}
