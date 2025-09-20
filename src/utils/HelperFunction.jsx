import toast from "react-hot-toast";
import { useApp } from "../Context/Context";
import { supabase } from "../services/supabase";
import { AddToCartToast } from "./AddToCartToast";
import { useNavigate } from "react-router-dom";

export const useHandleAddToCart = () => {
  const {
    isAuthenticated,
    setLocalCartItems,
    getCartItems,
    accountHolder,
    setShowLoginPopup,
  } = useApp();

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

      // toast.dark(`${product.title} added to cart succesfully`, {
      //   position: "bottom-right",
      //   transition: Slide, // Change this to Zoom, Bounce, Flip for different effects
      // });
    } else {
      try {
        console.log("acc", accountHolder);

        const {
          data: { user }, //error: authError,
        } = await supabase.auth.getUser();

        const { data: cartdata } = await supabase
          .from("userProductCollection")
          .select("*,productId(*)")
          .eq("userId", user.id);

        // check if the product is already in the db with this user

        console.log("cartdata", cartdata);

        const cartproductid = cartdata?.map((item) => item.productId.id);

        console.log(cartproductid, "cardproductids");

        // check if the product is already in the db with this user
        // const cartproductid = cartItems.map((item) => item.productId.id);

        // console.log(cartproductid, "cardproductids");

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

        // toast.dark(`${product.title} added to cart succesfully`, {
        //   position: "bottom-right",
        //   transition: Slide, // Change this to Zoom, Bounce, Flip for different effects
        // });

        AddToCartToast(product);
      } catch (error) {
        console.error(error);
      } finally {
        getCartItems();
      }
    }
  };

  const handleAddtoWishlist = async (product, productQuantity = 1) => {
    if (isAuthenticated) {
      try {
        const {
          data: { user }, //error: authError,
        } = await supabase.auth.getUser();

        const { data: cartdata } = await supabase
          .from("userProductCollection")
          .select("*,productId(*)")
          .eq("userId", user.id)
          .eq("type", "wishlist");

        // check if the product is already in the db with this user

        console.log("cartdata", cartdata);

        const cartproductid = cartdata?.map((item) => item.productId.id);

        console.log(cartproductid, "cardproductids");

        if (cartproductid.includes(product.id)) {
          return;
        }

        const { error } = await supabase.from("userProductCollection").insert([
          {
            productId: product.id,
            type: "wishlist",
            quantity: productQuantity,
            userId: user.id,
          },
        ]);
        if (error) throw new Error(error.message);
        AddToCartToast(product, "wishlist");
      } catch (error) {
        console.error(error);
      } finally {
        getCartItems();
      }
    } else {
      // toast.error("please login to add items to whishlist");
      setShowLoginPopup(true);
    }
  };

  return { handleAddToCart, handleAddtoWishlist };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const {
    setAccountHolder,
    setIsAuthLoading,
    setIsAuthenticated,
    setTotalArea,
    setSelectedData,
    setSelectedPlan,
    setBOQTitle,
    setBOQID,
    setProgress,
  } = useApp();

  const handleLogout = async () => {
    try {
      setIsAuthLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log("Error signing out:", error.message);
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
  } = useApp();
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
