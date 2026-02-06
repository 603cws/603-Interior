import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { handleError } from "../common-components/handleError";

const EcomContext = createContext();
export const EcomAppProvider = ({ children }) => {
  const [compare, setCompare] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [localcartItems, setLocalCartItems] = useState(
    JSON.parse(localStorage.getItem("cartitems")) || [],
  );
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filters, setFilters] = useState({
    category: [],
    priceRange: [0, 10000],
    brands: [],
  });
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [pendingProduct, setPendingProduct] = useState(() => {
    const stored = sessionStorage.getItem("addToWishlistProduct");
    return stored ? JSON.parse(stored) : null;
  });

  async function getCartItems() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) return [];

      const { data, error } = await supabase
        .from("userProductCollection")
        .select("*,productId(*)")
        .eq("userId", user.id);

      if (error) throw new Error(error);

      if (!data || data.length === 0) {
        setCartItems([]);
        setWishlistItems([]);
        return;
      }

      const uniqueImages = [
        ...new Set(data.map((item) => item.productId.image)),
      ];

      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon")
        .createSignedUrls(uniqueImages, 3600);

      if (signedUrlError) {
        handleError(signedUrlError, {
          prodMessage: "Error generating signed URLs. Please try again.",
        });
        return;
      }

      const urlMap = {};
      signedUrls.forEach(({ path, signedUrl }) => {
        urlMap[path] = signedUrl;
      });

      const updatedProducts = data.map((item) => ({
        ...item,
        productId: {
          ...item.productId,
          image: urlMap[item.productId.image] || item.productId.image,
        },
      }));

      const cartProductsRaw = updatedProducts.filter(
        (item) => item.type === "cart",
      );
      const wishlistProductsRaw = updatedProducts.filter(
        (item) => item.type === "wishlist",
      );

      const cartProducts = [
        ...new Map(
          cartProductsRaw.map((item) => [item.productId.id, item]),
        ).values(),
      ];
      const wishlistProducts = [
        ...new Map(
          wishlistProductsRaw.map((item) => [item.productId.id, item]),
        ).values(),
      ];

      setCartItems(cartProducts);
      setWishlistItems(wishlistProducts);
    } catch (error) {
      handleError(error, {
        prodMessage: "Something went wrong. Please try again.",
      });
    }
  }

  useEffect(() => {
    getCartItems();
  }, []);

  return (
    <EcomContext.Provider
      value={{
        compare,
        setCompare,
        cartItems,
        setCartItems,
        localcartItems,
        setLocalCartItems,
        wishlistItems,
        setWishlistItems,
        filters,
        setFilters,
        getCartItems,
        pendingProduct,
        setPendingProduct,
        showLoginPopup,
        setShowLoginPopup,
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};
export const useEcomApp = () => {
  const context = useContext(EcomContext);
  if (context === undefined) {
    throw new Error("useEcomApp must be used within a app provider");
  }
  return context;
};
