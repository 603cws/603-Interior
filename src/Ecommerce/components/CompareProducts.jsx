import { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useHandleAddToCart } from "../../utils/HelperFunction";
import { useApp } from "../../Context/Context";
import { useEcomApp } from "../../Context/EcomContext";
function CompareProducts({ product, onClose, onRemove }) {
  useEffect(() => {
    if (product.length === 0) {
      onClose();
    }
  }, [product, onClose]);
  return (
    <section>
      <div className="fixed inset-0 bg-[#000]/30 flex justify-center items-center z-20">
        <div
          className="bg-[#fff] max-w-screen-xl w-full h-[90vh] grid font-Poppins relative p-8 "
          style={{
            gridTemplateColumns: `200px repeat(${product.length}, 1fr)`,
          }}
        >
          <div className="absolute right-5 top-2 ">
            <button onClick={onClose}>
              <MdOutlineCancel color="#666666" size={25} />
            </button>
          </div>
          <div className="max-w-xs w-full flex flex-col max-h-full">
            {" "}
            <div className="w-full h-2/5">
              <h4 className="uppercase font-medium text-sm leading-[22.4px] text-[#000] mb-5">
                {product?.[0]?.title} <br />
                compare
              </h4>
              <p className="uppercase font-medium text-sm text-[#777777] leading-[22.4px]">
                {product?.length} items
              </p>
              <div className="flex gap-2 mt-10">
                <input type="checkbox" />
                <label
                  htmlFor=""
                  className="text-xs text-[#171717] leading-[28.8px]"
                >
                  Show only differences
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-4 [&_h4]:uppercase [&_h4]:font-medium [&_h4]:text-sm [&_h4]:text[#111111]">
              <h4>product name</h4>
              <h4>rating</h4>
              <h4>price</h4>
              <h4>material</h4>
              <h4>brand</h4>
            </div>
          </div>
          {product.map((product, index) => {
            return <Card product={product} onRemove={onRemove} key={index} />;
          })}
        </div>
      </div>
    </section>
  );
}

function Card({ product, onRemove }) {
  const { handleAddToCart } = useHandleAddToCart();
  const { isAuthenticated } = useApp();
  const { cartItems, localcartItems } = useEcomApp();

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
    <div
      key={product.id}
      className="max-w-xs w-full flex flex-col  relative max-h-full"
    >
      <div className="absolute top-0 right-0">
        <button
          onClick={() => {
            onRemove(product.id);
          }}
        >
          <MdOutlineCancel color="#666666" size={25} />
        </button>
      </div>{" "}
      <div className="w-5/6 h-2/5">
        <img
          src={product.image}
          alt={product.title}
          className="object-contain max-h-full"
        />
      </div>
      <div className="flex flex-col gap-4 [&_h4]:uppercase [&_h4]:font-medium [&_h4]:text-sm [&_h4]:text[#111111]">
        <h4>{product?.title}</h4>
        <h4>rating</h4>
        <h4>{product.price}</h4>
        <h4>material</h4>
        <h4>brand</h4>
      </div>
      <div className="flex flex-col text-[#212B36] items-start gap-2 [&_button]:border [&_button]:border-[#212B36] [&_button]:uppercase [&_button]:text-[15px] [&_button]:tracking-widest [&_button]:w-36 [&_button]:h-10 [&_button]:rounded-sm">
        <button onClick={() => handleAddToCart(product)}>
          {iscarted ? "added to cart" : "add to cart"}
        </button>
        <button>buy now</button>
      </div>
    </div>
  );
}

export default CompareProducts;
