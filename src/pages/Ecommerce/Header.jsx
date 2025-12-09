import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { GoHeart } from "react-icons/go";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../Context/Context";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useHandleAddToCart, useLogout } from "../../utils/HelperFunction";
import LoginPopup from "../../common-components/LoginPopup";
import { supabase } from "../../services/supabase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CiSearch } from "react-icons/ci";

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setshowProfile] = useState(false);
  const [products, setProducts] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const logout = useLogout();
  const location = useLocation();

  const profileRef = useRef(null);
  const buttonRef = useRef(null);

  const {
    cartItems,
    isAuthenticated,
    localcartItems,
    wishlistItems,
    accountHolder,
    showLoginPopup,
    setShowLoginPopup,
    setIsAuthenticated,
    setUserId,
    pendingProduct,
    setPendingProduct,
  } = useApp();

  let hasShownToast = false;
  const pathname = window.location.pathname;
  const { handleAddtoWishlist } = useHandleAddToCart();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasAccessToken = hashParams.has("access_token");

    async function checkOAuthLogin() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) return;

      if (session && hasAccessToken && !hasShownToast) {
        setUserId(session.user.id);
        setIsAuthenticated(true);
        toast.success("Logged in successfully with Google");
        hasShownToast = true;

        // ✅ Run handleAddtoWishlist only once if pendingProduct exists
        if (pendingProduct) {
          handleAddtoWishlist(pendingProduct, 1, true);
        }

        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    checkOAuthLogin();
  }, [pendingProduct]); // <-- include pendingProduct if it comes from context

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setshowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  function checkLoggedIn() {
    if (isAuthenticated) {
      setshowProfile(!showProfile);
    } else {
      setShowLoginPopup(true);
      // navigate("/login");
    }
  }
  const fetchProducts = async () => {
    try {
      const { data } = await supabase
        .from("product_variants")
        .select(`* ,product_id(*)`)
        .order("created_at", { ascending: false })
        .neq("productDisplayType", "boq");

      const filtered = data.filter(
        (item) =>
          item.status === "approved" &&
          item.product_id.category !== "Partitions / Ceilings" &&
          item.product_id.category !== "Civil / Plumbing"
      );
      setProducts(filtered);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Read query from URL and update search field
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || "";
    setSearchTerm(query);
  }, [location.search]); // runs whenever route changes

  // Handle search input change
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter suggestions (based on title or product_type)
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = products.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.product_type.toLowerCase().includes(value.toLowerCase()) ||
        item.product_id.category.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5)); // show max 5 suggestions
  };

  // On click of search icon → redirect
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/shop?query=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]); // clear suggestions
    }
  };

  // On clicking a suggestion
  const handleSuggestionClick = (item) => {
    setSearchTerm(item.title);
    navigate(`/shop?query=${encodeURIComponent(item.title)}`);
    setSuggestions([]);
  };

  return (
    <>
      <header>
        <div className="px-3 lg:container relative">
          {showProfile && (
            <div
              ref={profileRef}
              className="absolute right-2 top-14 md:right-24 xl:right-20 3xl:right-64 w-40 xl:w-56 mt-1 font-Poppins bg-white text-black rounded-xl shadow-[3px_0px_8px_#000] z-50"
            >
              <p className="px-4 py-3 font-semibold border-b border-[#CCCCCC]">
                {/* <span className="ml-2"> */}
                Hello {accountHolder?.companyName || "User Profile"}
                {/* </span> */}
              </p>
              <ul className="py-2 text-sm [&_li]:cursor-pointer">
                <li
                  onClick={() => navigate("/profilePage")}
                  className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]"
                >
                  <img
                    src="../images/ecommerce/icon6.svg"
                    color="#ffffff"
                    alt="Orders icon"
                  />
                  <span className="ml-2">View Profile</span>
                </li>
                <li className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]">
                  <img
                    src="../images/ecommerce/icon1.svg"
                    color="#ffffff"
                    alt="Orders icon"
                  />
                  <span className="ml-2">Orders</span>
                </li>
                <li
                  className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]"
                  onClick={() => navigate("/wishlist")}
                >
                  <img
                    src="../images/ecommerce/icon2.svg"
                    alt="Wishlist icon"
                  />
                  <span className="ml-2">Wishlist</span>
                </li>
                <li className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]">
                  <img
                    src="../images/ecommerce/icon3.svg"
                    alt="Gift Card icon"
                  />
                  <span className="ml-2">Gift Cards</span>
                </li>
                <li className="flex items-center px-4 py-2 ml-2 hover:bg-[#f9f9f9]">
                  <img src="../images/ecommerce/icon4.svg" alt="Coupon icon" />
                  <span className="ml-2">Coupons</span>
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-[#f9f9f9] border-t border-[#CCCCCC] mt-2"
                  onClick={logout}
                >
                  <p className="ml-2">
                    <img
                      src="../images/ecommerce/icon5.svg"
                      alt="Logout icon"
                    />
                  </p>
                  <span className="ml-2">Logout</span>
                </li>
              </ul>
            </div>
          )}

          {/* desktop  */}
          <div className="hidden lg:flex justify-between 3xl:justify-around py-3">
            <ul className="flex items-center gap-7 [&_li]:cursor-pointer uppercase text-xs xl:text-sm font-bold [&_li]:tracking-widest font-TimesNewRoman text-[#334A78] flex-1">
              <li
                onClick={() => navigate("/products")}
                className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                  pathname === "/products" ? "after:w-full" : "after:w-0"
                } hover:after:w-full`}
              >
                home
              </li>
              <li
                onClick={() => navigate("/shop")}
                className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                  pathname === "/shop" ? "after:w-full" : "after:w-0"
                } hover:after:w-full`}
              >
                shop
              </li>
              <li
                onClick={() => navigate("/Aboutus")}
                className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                  pathname === "/Aboutus" ? "after:w-full" : "after:w-0"
                } hover:after:w-full text-nowrap`}
              >
                about us
              </li>
              {/* <li
                onClick={() => navigate("/OurServices")}
                className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                  pathname === "/OurServices" ? "after:w-full" : "after:w-0"
                } hover:after:w-full`}
              >
                our services
              </li> */}
              <li
                onClick={() => navigate("/Contactus")}
                className={`cursor-pointer relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[1px] after:bg-[#FFC900] after:transition-all after:duration-300 ${
                  pathname === "/Contactus" ? "after:w-full" : "after:w-0"
                } hover:after:w-full text-nowrap`}
              >
                contact us
              </li>
            </ul>
            <div className="flex-1 flex justify-center">
              <button onClick={() => navigate("/")}>
                <img
                  src="/logo/workved-interior.png"
                  alt="workved interior logo"
                  className="h-[60px] w-[140px] cursor-pointer "
                />
              </button>
            </div>
            <div className="flex items-center flex-1 gap-5">
              <div className="relative flex-[3_1_auto] border-[2px] rounded py-1 px-1 text-sm flex">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleChange}
                  className="flex-1 focus:outline-none border-r-[2px] text-[#334A78]"
                />
                <button onClick={handleSearch} className="px-0.5">
                  <CiSearch color="#334A78" size={18} />
                </button>
                {suggestions.length > 0 && (
                  <ul className="absolute top-[110%] left-0 right-0 bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-48 overflow-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSuggestionClick(item)}
                        className="px-3 py-1 text-[#334A78] hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {item.title} —{" "}
                        <span className="text-gray-500">
                          {item.product_type}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify-between py-5 flex-[1_3_auto]">
                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative"
                >
                  <GoHeart size={22} color="#334A78" />
                  <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                    {wishlistItems?.length}
                  </span>
                </button>
                <button className="relative" onClick={() => navigate("/cart")}>
                  <BsCart2 size={23} color="#334A78" />
                  <span className="absolute -top-1/4 -right-1/3 font-semibold text-[8px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-4 w-4 flex justify-center items-center">
                    {isAuthenticated
                      ? cartItems?.length
                      : localcartItems?.length}
                  </span>
                </button>
                <button onClick={checkLoggedIn} ref={buttonRef}>
                  {isAuthenticated ? (
                    <FaRegUser size={20} color="#334A78" />
                  ) : (
                    <img
                      src="/images/icons/sign-in.png"
                      alt="sign in icon"
                      className="h-5 w-5"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* mobile view */}
          <div className="mx-3 flex lg:hidden justify-between 3xl:justify-around ">
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <FiX className="size-6 text-[#334A78]" />
                ) : (
                  <FiMenu className="size-6 text-[#334A78]" />
                )}
              </button>
            </div>

            <button onClick={() => navigate("/")} className="">
              <img
                src="/logo/workved-interior.png"
                alt="w"
                className="h-10 cursor-pointer"
              />
            </button>
            <div className="flex items-center">
              <div className="flex gap-5 py-5">
                <button
                  onClick={() => navigate("/wishlist")}
                  className="relative"
                >
                  <GoHeart size={20} color="#334A78" />
                  <span className="absolute -top-1/4 -right-1/3 font-semibold text-[7px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-3.5 w-3.5 flex justify-center items-center">
                    {wishlistItems?.length}
                  </span>
                </button>
                <button className="relative" onClick={() => navigate("/cart")}>
                  <BsCart2 size={20} color="#334A78" />
                  <span className="absolute -top-1/4 -right-1/3 font-semibold text-[7px] bg-[#C16452] text-[#ffffff] rounded-full p-1 h-3.5 w-3.5 flex justify-center items-center">
                    {isAuthenticated
                      ? cartItems?.length
                      : localcartItems?.length}
                  </span>
                </button>
                <button onClick={checkLoggedIn}>
                  {isAuthenticated ? (
                    <FaRegUser size={20} color="#334A78" />
                  ) : (
                    <img
                      src="/images/icons/sign-in.png"
                      alt="sign in icon"
                      className="h-5 w-5"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{
                scaleY: isMobileMenuOpen ? 1 : 0,
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              style={{
                transformOrigin: "top",
                overflow: "hidden",
                pointerEvents: isMobileMenuOpen ? "auto" : "none",
              }}
              className="bg-white w-full absolute top-full left-0 px-2 py-3 overflow-hidden z-10"
            >
              <ul className="text-sm font-bold text-[#334A78] uppercase space-y-5">
                <li onClick={() => navigate("/shop")}>shop</li>
                <li onClick={() => navigate("/Aboutus")}>about us</li>
                <li onClick={() => navigate("/Contactus")}>contact us</li>
              </ul>
            </motion.div>
          )}
        </div>
        {showLoginPopup && (
          <LoginPopup onClose={() => setShowLoginPopup(false)} />
        )}
      </header>
    </>
  );
}

export default Header;
