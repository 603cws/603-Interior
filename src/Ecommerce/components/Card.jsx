import { useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { useEcomApp } from "../../Context/EcomContext";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { useEffect, useState } from "react";
import { GoHeart } from "react-icons/go";
import { AiFillHeart } from "react-icons/ai";
import { supabase } from "../../services/supabase";
import { MdOutlineDelete } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { showRemoveFromCartToast } from "../../utils/AddToCartToast";
import { handleError } from "../../common-components/handleError";

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
    (item) => item.productId?.id === product.id,
  );

  const naviagte = useNavigate();

  const { handleAddtoWishlist, handleAddToCart } = useHandleAddToCart();

  const [iscarted, setIsCarted] = useState(false);

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id,
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id,
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
              <p className=" ">₹ {product?.price || "3,0000"}</p>
              <p className="line-through text-[#111] text-opacity-50">₹ 5678</p>
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
            className="cursor-pointer"
          />
          <label htmlFor="" className="text-xs">
            Add to compare
          </label>
        </div>
      </div>
    </div>
  );
}

export function ShopCard({ product }) {
  const { handleAddToCart, handleAddtoWishlist } = useHandleAddToCart();
  const { isAuthenticated } = useApp();
  const { cartItems, localcartItems, wishlistItems } = useEcomApp();

  const isWishlisted = wishlistItems?.some(
    (item) => item.productId?.id === product.id,
  );

  const [iscarted, setIsCarted] = useState(false);

  const naviagte = useNavigate();

  useEffect(() => {
    if (!product?.id) return;

    if (isAuthenticated) {
      const check = cartItems?.some(
        (item) => item.productId?.id === product.id,
      );
      setIsCarted(check);
    } else {
      const check = localcartItems?.some(
        (item) => item.productId?.id === product.id,
      );
      setIsCarted(check);
    }
  }, [isAuthenticated, cartItems, localcartItems, product?.id]);

  return (
    <div className="font-TimesNewRoman max-w-sm max-h-sm border-2 border-[#ccc]">
      <div
        onClick={() =>
          naviagte(`/productview/${product.id}`, { state: { from: "shop" } })
        }
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.product_id?.category}
          className="h-52 object-contain"
        />
      </div>
      <div className="bg-[#fff] p-1.5 lg:p-2">
        <div className="flex flex-col md:flex-row ">
          <div className="flex-1 text-sm leading-[22.4px] text-[#111]">
            <h4
              title={product?.title}
              className="font-medium text-sm leading-[22.4px] line-clamp-1 capitalize"
            >
              {product?.title}
            </h4>
            <div className="flex items-center gap-2 flex-wrap xl:flex-nowrap">
              <p className="text-nowrap">
                ₹ {product?.ecommercePrice?.sellingPrice || "3,0000"}
              </p>
              <p className="line-through text-[#111] text-opacity-50 text-nowrap">
                ₹ {product?.ecommercePrice?.mrp || "3,0000"}
              </p>
              <p className="text-[#C20000] uppercase">sale</p>
            </div>
          </div>
          <div
            onClick={() => handleAddtoWishlist(product)}
            className="text-[#ccc] hover:text-red-600 cursor-pointer"
          >
            {isWishlisted ? (
              <AiFillHeart size={20} color="red" />
            ) : (
              <GoHeart size={20} />
            )}
          </div>
        </div>
        {product?.stockQty > 0 ? (
          <button
            onClick={() => handleAddToCart(product, iscarted)}
            className="bg-[#334A78] text-[#fff] text-xs lg:text-sm px-3.5 py-1.5 capitalize font-bold rounded-sm hover:bg-[#4C69A4] transition"
          >
            {iscarted ? "Go to cart" : "Add to cart"}{" "}
          </button>
        ) : (
          <span className="text-xs text-red-500 font-semibold">
            Out of stock
          </span>
        )}
      </div>
    </div>
  );
}

export function CartCard({ cartitem }) {
  const [loadingQty, setLoadingQty] = useState(false);
  const [signedUrl, setSignedUrl] = useState(cartitem.productId.image);

  const { isAuthenticated } = useApp();
  const { getCartItems, localcartItems, setLocalCartItems } = useEcomApp();
  const navigate = useNavigate();

  async function handleRemoveItem(product) {
    if (isAuthenticated) {
      try {
        const { error } = await supabase
          .from("userProductCollection")
          .delete()
          .eq("id", product.id);

        showRemoveFromCartToast(product);
        if (error) throw new Error(error);
      } catch (error) {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
      } finally {
        getCartItems();
      }
    } else {
      const removeproductfromlocalCartitems = localcartItems.filter(
        (item) => item.productId.id !== product?.productId?.id,
      );

      localStorage.setItem(
        "cartitems",
        JSON.stringify(removeproductfromlocalCartitems),
      );
      setLocalCartItems(removeproductfromlocalCartitems);
      showRemoveFromCartToast(product);
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    setLoadingQty(true);
    try {
      const { error } = await supabase
        .from("userProductCollection")
        .update({ quantity: newQuantity })
        .eq("productId", productId);
      if (error) {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
      }
      setLoadingQty(false);
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    } finally {
      setLoadingQty(false);
      getCartItems();
    }
  };

  const handleProductQuantityDec = (product, quantity) => {
    if (isAuthenticated) {
      if (quantity === 1) {
        handleRemoveItem(product);
      } else {
        updateQuantity(product.productId?.id, quantity - 1);
      }
    } else {
      if (quantity === 1) {
        handleRemoveItem(product);
        return;
      }
      const updatedLocalItems = localcartItems.map((item) =>
        item.productId.id === product.productId.id
          ? { ...item, quantity: quantity - 1 }
          : item,
      );
      localStorage.setItem("cartitems", JSON.stringify(updatedLocalItems));
      setLocalCartItems(updatedLocalItems);
    }
  };

  const handleProductQuantityInc = (product, quantity) => {
    if (isAuthenticated && product.productId?.stockQty > quantity) {
      updateQuantity(product.productId?.id, quantity + 1);
    } else {
      if (product.productId?.stockQty > quantity) {
        const updatedLocalItems = localcartItems.map((item) =>
          item.productId.id === product.productId.id
            ? { ...item, quantity: quantity + 1 }
            : item,
        );
        setLocalCartItems(updatedLocalItems);
        localStorage.setItem("cartitems", JSON.stringify(updatedLocalItems));
      } else {
        toast.error("Not Available");
      }
    }
  };

  const refreshSignedUrl = async () => {
    try {
      const fullSignedUrl = cartitem.productId.image;
      let imagePath = fullSignedUrl.split("/object/sign/")[1]?.split("?")[0];
      if (imagePath.startsWith("addon/")) {
        imagePath = imagePath.replace(/^addon\//, "");
      }
      const { data, error } = await supabase.storage
        .from("addon")
        .createSignedUrl(imagePath, 3600);
      if (!error && data?.signedUrl) {
        setSignedUrl(data.signedUrl);
        const updatedItems = localcartItems.map((item) =>
          item.productId.id === cartitem.productId.id
            ? {
                ...item,
                productId: {
                  ...item.productId,
                  image: data.signedUrl,
                },
              }
            : item,
        );
        localStorage.setItem("cartitems", JSON.stringify(updatedItems));
        setLocalCartItems(updatedItems);
      } else {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      handleError(err, {
        prodMessage: "Something went wrong. Please try again.",
      });
    }
  };
  const cartItemTotal =
    cartitem?.productId?.ecommercePrice?.sellingPrice * cartitem?.quantity;

  return (
    <>
      <div className="flex items-center gap-2 lg:border border-[#CCCCCC] rounded-lg relative py-2">
        <img
          src={signedUrl}
          alt="cart"
          className="w-24 h-24 md:h-32 md:w-28 lg:h-40 lg:w-36 object-contain cursor-pointer"
          onClick={() => navigate(`/productview/${cartitem.productId?.id}`)}
          onError={refreshSignedUrl}
        />
        <div className="flex-1 font-Poppins space-y-3 font-medium text-[10px] lg:text-sm">
          <div>
            <h5
              onClick={() => navigate(`/productview/${cartitem.productId?.id}`)}
              className="leading-[22.5px] font-medium text-[#111111] uppercase cursor-pointer"
            >
              {cartitem.productId?.title}
            </h5>
            <h5 className=" text-[#111111]/50 capitalize">
              {cartitem.productId?.product_type}
            </h5>
          </div>

          <div className=" flex  gap-3 my-2">
            <div className="flex items-start justify-start gap-2">
              <button
                className="border w-8 h-7 flex justify-center items-center font-semibold"
                onClick={() =>
                  handleProductQuantityDec(cartitem, cartitem?.quantity)
                }
                disabled={loadingQty}
              >
                {loadingQty ? (
                  <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin inline-block"></span>
                ) : cartitem?.quantity === 1 ? (
                  <div className="hover:animate-shake hover:text-red-400 w-full h-full flex justify-center items-center">
                    <MdOutlineDelete className="mx-auto" />
                  </div>
                ) : (
                  "-"
                )}
              </button>
              <input
                type="number"
                className="border  w-12 h-7 rounded text-center [&::-webkit-inner-spin-button]:appearance-none  focus:outline-none focus:ring-0 text-xs md:text-[13px] leading-6"
                // min={1}
                value={cartitem?.quantity || "NA"}
                readOnly
              />
              <button
                className="border  w-8 h-7 flex justify-center items-center font-semibold"
                onClick={() =>
                  handleProductQuantityInc(cartitem, cartitem?.quantity)
                }
                disabled={loadingQty}
              >
                {loadingQty ? (
                  <span className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin inline-block"></span>
                ) : (
                  "+"
                )}
              </button>
            </div>
          </div>
          {cartitem?.productId?.stockQty < 10 && (
            <span className="text-xs text-[#F87171]">
              Hurry Up! Only {cartitem?.productId?.stockQty} left.
            </span>
          )}
          <div className="flex gap-3">
            <h5 className=" font-medium text-[#111111]">
              ₹{" "}
              {cartitem?.productId?.ecommercePrice?.sellingPrice ||
                cartitem?.productId?.price}
            </h5>
            <h5 className=" font-medium text-[#111111]/50">
              <del>{cartitem?.productId?.ecommercePrice?.mrp || ""}</del>
            </h5>{" "}
            <h5 className="font-medium text-[#C20000]/50">
              ₹{" "}
              {cartitem?.productId?.ecommercePrice?.mrp -
                cartitem?.productId?.ecommercePrice?.sellingPrice}{" "}
              OFF
            </h5>
          </div>
          <p className="text-xs font-bold text-[#111]">
            Total : ₹ {cartItemTotal}
          </p>
        </div>
        <div className="absolute top-2 right-2">
          <button onClick={() => handleRemoveItem(cartitem)}>
            <IoClose />
          </button>
        </div>
      </div>
    </>
  );
}

export function AlsoLikeCard({ product }) {
  const { handleAddToCart, handleAddtoWishlist } = useHandleAddToCart();
  const { wishlistItems } = useEcomApp();

  const isWishlisted = wishlistItems?.some(
    (item) => item.productId?.id === product.id,
  );

  const naviagte = useNavigate();
  return (
    <div className="font-TimesNewRoman max-w-sm max-h-sm  border border-[#ccc]">
      <div
        onClick={() =>
          naviagte(`/productview/${product.id}`, { state: { from: "shop" } })
        }
        className="flex justify-center items-center p-2 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.product_id?.category}
          className="h-52 object-contain"
        />
      </div>
      <div className="bg-[#fff] p-2">
        <div className="flex flex-col md:flex-row ">
          <div className="flex-1 text-sm  leading-[22.4px]  text-[#111] ">
            <h4
              title={product?.title}
              className="font-medium text-sm leading-[22.4px] line-clamp-1"
            >
              {product?.title}
            </h4>
            <div className="flex items-center gap-2">
              <p className=" ">
                ₹ {product?.ecommercePrice?.sellingPrice || "3,0000"}
              </p>
              <p className="line-through text-[#111] text-opacity-50">
                ₹ {product?.ecommercePrice?.mrp || "3,0000"}
              </p>
              <p className="text-[#C20000]">sale</p>
            </div>
          </div>
          <div
            onClick={() => handleAddtoWishlist(product)}
            className="text-[#ccc] hover:text-red-600 cursor-pointer"
          >
            {isWishlisted ? (
              <AiFillHeart size={20} color="red" />
            ) : (
              <GoHeart size={20} />
            )}
          </div>
        </div>
        {product.stockQty > 0 ? (
          <button
            onClick={() => handleAddToCart(product)}
            className="text-[#000] uppercase bg-[#FFFFFF] text-xs border border-[#ccc] px-2  py-2 rounded-sm "
          >
            add to cart
          </button>
        ) : (
          <span className="text-xs text-red-500 font-semibold">
            Out of stock
          </span>
        )}
      </div>
    </div>
  );
}

export function YouMayAlsoLikeCard({
  image,
  title,
  subtitle,
  productID,
  category,
}) {
  const naviagte = useNavigate();
  return (
    <div className="max-w-sm shadow-sm border border-[#CCCCCC] p-2">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-contain cursor-pointer"
        onClick={() =>
          naviagte(`/productview/${productID}`, {
            state: { from: `products/topdeal/?category=${category}` },
          })
        }
      />
      <h3 className="text-sm lg:text-xl leading-[24px] tracking-[0.96px] font-medium mt-2 mb-1 lg:mb-2 font-Poppins ml-2">
        {title}
      </h3>
      <p className="text-[#378DDB] leading-[24px] tracking-[0.96px] font-medium font-Poppins text-sm line-clamp-2  ml-2">
        {subtitle}
      </p>
    </div>
  );
}

export function TopDealCard({ image, title, subtitle, productID, category }) {
  const naviagte = useNavigate();
  return (
    <div className="max-w-sm shadow-sm border border-[#CCCCCC] p-2">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-contain cursor-pointer"
        onClick={() =>
          naviagte(`/productview/${productID}`, {
            state: { from: `products/topdeal/?category=${category}` },
          })
        }
      />
      <h3 className="text-sm lg:text-xl leading-[24px] tracking-[0.96px] font-medium mt-2 mb-1 lg:mb-2 font-Poppins ml-2">
        {title}
      </h3>
      <p className="text-[#378DDB] leading-[24px] tracking-[0.96px] font-medium font-Poppins text-sm line-clamp-2  ml-2">
        {subtitle}
      </p>
    </div>
  );
}
