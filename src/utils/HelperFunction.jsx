import toast from "react-hot-toast";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import { AddToCartToast, RemoveFromCartToast } from "./AddToCartToast";
import { useNavigate } from "react-router-dom";
import { useEcomApp } from "../Context/EcomContext";
import { useBoqApp } from "../Context/BoqContext";
import { handleError } from "../common-components/handleError";

export const useHandleAddToCart = () => {
  const { isAuthenticated } = useApp();
  const {
    getCartItems,
    setLocalCartItems,
    setPendingProduct,
    setShowLoginPopup,
  } = useEcomApp();

  const navigate = useNavigate();
  const handleAddToCart = async (product, iscarted, productQuantity = 1) => {
    if (iscarted) {
      navigate("/cart");
      return;
    }

    if (!isAuthenticated) {
      const formattedproductforcart = {
        productId: product,
        type: "cart",
        quantity: productQuantity,
      };

      setLocalCartItems((prev) => {
        const exists = prev.some((item) => item?.productId?.id === product.id);
        if (exists) return prev;

        const updated = [...prev, formattedproductforcart];
        localStorage.setItem("cartitems", JSON.stringify(updated));
        return updated;
      });

      AddToCartToast(product);
    } else {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: cartdata } = await supabase
          .from("userProductCollection")
          .select("*,productId(*)")
          .eq("userId", user.id)
          .eq("type", "cart");

        const cartproductid = cartdata?.map((item) => item.productId.id);

        if (cartproductid.includes(product.id)) {
          return;
        }

        const { error } = await supabase.from("userProductCollection").insert([
          {
            productId: product.id,
            type: "cart",
            quantity: productQuantity,
            userId: user.id,
          },
        ]);
        if (error) throw new Error(error.message);

        AddToCartToast(product);
      } catch (error) {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
      } finally {
        getCartItems();
      }
    }
  };

  const handleAddtoWishlist = async (
    product,
    productQuantity = 1,
    isUserSignUp = false,
  ) => {
    if (isAuthenticated || isUserSignUp) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: cartdata } = await supabase
          .from("userProductCollection")
          .select("id, productId(*)")
          .eq("userId", user.id)
          .eq("type", "wishlist");

        const existingItem = cartdata?.find(
          (item) => item.productId.id === product.id,
        );

        if (existingItem) {
          const { error } = await supabase
            .from("userProductCollection")
            .delete()
            .eq("id", existingItem.id);

          if (error) throw new Error(error.message);
          RemoveFromCartToast(product, "wishlist");
        } else {
          const { error } = await supabase
            .from("userProductCollection")
            .insert([
              {
                productId: product.id,
                type: "wishlist",
                quantity: productQuantity,
                userId: user.id,
              },
            ]);

          if (error) throw new Error(error.message);
          setPendingProduct(null);
          sessionStorage.removeItem("addToWishlistProduct");
          AddToCartToast(product, "wishlist");
        }
      } catch (error) {
        handleError(error, {
          prodMessage: "Something went wrong. Please try again.",
        });
      } finally {
        getCartItems();
      }
    } else {
      setShowLoginPopup(true);
    }
  };

  return { handleAddToCart, handleAddtoWishlist };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { setAccountHolder, setIsAuthLoading, setIsAuthenticated } = useApp();

  const {
    setTotalArea,
    setSelectedData,
    setSelectedPlan,
    setBOQTitle,
    setBOQID,
    setProgress,
  } = useBoqApp();

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        handleError(error, {
          prodMessage: "Error signing out. Please try again.",
        });
      } else {
        toast.success("User signed out successfully");
        setAccountHolder({
          companyName: "",
          email: "",
          phone: "",
          role: "",
          userId: "",
        });
        setTotalArea("");
        localStorage.removeItem("currentLayoutID");
        localStorage.removeItem("session");
        localStorage.removeItem("usertoken");
        localStorage.removeItem("BOQID");
        localStorage.removeItem("selectedPlan");
        localStorage.removeItem("selectedData");
        sessionStorage.removeItem("BOQTitle");
        sessionStorage.removeItem("BOQID");
        sessionStorage.removeItem("selectedPlan");
        localStorage.removeItem("answers");
        setSelectedPlan(null);
        setSelectedData([]);
        setBOQID("");
        setBOQTitle("");
        setProgress(0);
        navigate("/");
        setIsAuthenticated(false);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  return handleLogout;
};

export const useResetBOQ = () => {
  const {
    setSelectedData,
    setSelectedPlan,
    setBOQTitle,
    setBOQID,
    setProgress,
  } = useBoqApp();

  const resetBOQ = () => {
    localStorage.removeItem("BOQID");
    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("selectedData");
    sessionStorage.removeItem("BOQTitle");
    sessionStorage.removeItem("BOQID");
    sessionStorage.removeItem("selectedPlan");
    localStorage.removeItem("answers");
    setSelectedPlan(null);
    setSelectedData([]);
    setBOQID("");
    setBOQTitle("");
    setProgress(0);
  };

  return resetBOQ;
};
