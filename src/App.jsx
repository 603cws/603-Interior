import { lazy, Suspense } from "react";
// import Layout from "./layout/pages/Layout";
import Boq from "./boq/pages/Boq";
import PageNotFound from "./common-components/PageNotFound";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import SpinnerFullPage from "./common-components/SpinnerFullPage";
import Contactus from "./pages/Contactus";
// import AboutUs from "./pages/AboutUs";
import AboutUs2 from "./pages/AboutUs2";
import Login from "./common-components/Login";
// import OurServices from "./pages/OurServices";
import OurServices2 from "./pages/OurServices2";
import BlogDetail from "./pages/BlogDetail";
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./common-components/ScrollToTop";
// import BecomeSeller from "./pages/BecomeSeller";
import { useApp } from "./Context/Context";
import HelpnFaq from "./pages/HelpnFaq";
import TermsAndCondition from "./pages/TermsAndCondition";
import Boqcompleted from "./common-components/Boqcompleted";
// import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import DoorScrollEffect from "./pages/DoorScrollEffect";
import ProductOverview from "./boq/pages/ProductOverview";
import JobPage from "./pages/JobPage";
import ThreeDViewer from "./common-components/ThreeDViewer";
import CompleteProfile from "./common-components/CompleteProfile";
import Privacy from "./pages/Privacy";
import InteriorBlog from "./pages/InteriorBlog";
import Products from "./pages/Ecommerce/Products";
import ProductView from "./pages/Ecommerce/ProductView";
import ShopProducts from "./pages/Ecommerce/ShopProducts";
import Cart from "./pages/Ecommerce/Cart";
import Addresspage from "./pages/Ecommerce/Addresspage";
import Wishlist from "./pages/Ecommerce/Wishlist";
import Payments from "./pages/Ecommerce/Payments";
import ELogin from "./common-components/ELogin";
import Brands from "./pages/Ecommerce/Brands";
import ProductReview from "./pages/Ecommerce/ProductReview";
import BrandProductView from "./pages/BrandProductView";
import ProfilePage from "./pages/Ecommerce/ProfilePage";
import SeasonSpecial from "./pages/Ecommerce/SeasonSpecial";
import TopDeal from "./pages/Ecommerce/TopDeal";
import AllReviews from "./pages/Ecommerce/AllReviews";
import BrandFurniture from "./pages/Ecommerce/BrandFurniture";
import BrandLight from "./pages/Ecommerce/BrandLight";
import BrandHVAC from "./pages/Ecommerce/BrandHVAC";
import BrandDLink from "./pages/Ecommerce/BrandDLink";
import VendorDashboardLayout from "./pages/vendor/VendorDashboardLayout";
import PrivateRoute from "./utils/PrivateRoute";
import Services from "./pages/Services";
import OurStory from "./pages/OurStory";
import OrderConfirm from "./pages/Ecommerce/OrderConfirm";
import AdminDashboardEcom from "./pages/Admin/EcommerceDashboard/AdminDashboardEcom";
import DashboardInterface from "./pages/Admin/DashboardInterface";
import YouMayAlsoLike from "./pages/Ecommerce/YouMayAlsoLike";
import DynamicTitle from "./common-components/DynamicTitle";

// const Homepage = lazy(() => import("./pages/Homepage"));
const Layout = lazy(() => import("./layout/pages/Layout"));
// const BlogPage = lazy(() => import("./pages/Blog"));
const Carrer = lazy(() => import("./pages/Carrer"));

function App() {
  const { accountHolder, isAuthLoading } = useApp();

  // While authentication is loading, show a spinner
  if (isAuthLoading) {
    // console.log(isAuthLoading);
    return <SpinnerFullPage />;
  }

  return (
    <div>
      <ScrollToTop />
      <DynamicTitle />
      {/* <Layout /> */}
      {/* <Boq /> */}
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Layout" element={<Layout />} />
          <Route
            path="/boq"
            element={
              <PrivateRoute>
                <Boq />
              </PrivateRoute>
            }
          />
          <Route
            path="/boq/:id"
            element={
              <PrivateRoute>
                <ProductOverview />
              </PrivateRoute>
            }
          />
          <Route path="/Contactus" element={<Contactus />} />
          {/* <Route path="/newContactus" element={<Contactus />} /> */}
          <Route path="/Aboutus" element={<AboutUs2 />} />
          <Route path="/ourstory" element={<OurStory />} />

          <Route path="/Blog" element={<InteriorBlog />} />
          <Route path="/Blog/:title" element={<BlogDetail />} />
          <Route path="/Career" element={<Carrer />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/ThreeDViewer" element={<ThreeDViewer />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route
            path="/complete-profile/*"
            element={<Navigate to="/complete-profile" />}
          />
          <Route path="/OurServices" element={<Services />} />
          {/* <Route path="/OurServices" element={<OurServices2 />} /> */}
          {/* <Route path="/services" element={<Services />} /> */}

          <Route path="/Career/:jobTitle" element={<JobPage />} />
          <Route path="/scroll" element={<DoorScrollEffect />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {accountHolder?.role ? (
                  accountHolder.role === "admin" ? (
                    // <AdminDashboard />
                    <DashboardInterface />
                  ) : accountHolder.role === "vendor" ? (
                    // <VendorDashboard />
                    <VendorDashboardLayout />
                  ) : accountHolder.role === "user" ? (
                    <Dashboard />
                  ) : (
                    <PageNotFound />
                  )
                ) : (
                  <SpinnerFullPage />
                )}
              </PrivateRoute>
            }
          />

          <Route
            path="/admindashboard"
            element={
              <PrivateRoute>
                {accountHolder?.role && accountHolder.role === "admin" && (
                  <AdminDashboard />
                )}
              </PrivateRoute>
            }
          />

          <Route path="/help" element={<HelpnFaq />} />
          <Route path="/termsNcondition" element={<TermsAndCondition />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/topdeal" element={<TopDeal />} />
          <Route path="/products/seasonspecial" element={<SeasonSpecial />} />
          <Route path="/productview" element={<ProductView />} />
          <Route path="/productview/:id" element={<ProductView />} />
          <Route path="/shop" element={<ShopProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<Addresspage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/productReview" element={<ProductReview />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/eLogin" element={<ELogin />} />
          <Route path="/profilePage" element={<ProfilePage />} />
          <Route path="/brands/productview" element={<BrandProductView />} />
          <Route path="/reviews/:id" element={<AllReviews />} />
          <Route path="/brands/hvac" element={<BrandHVAC />} />
          <Route path="/brands/furniture" element={<BrandFurniture />} />
          <Route path="/brands/light" element={<BrandLight />} />
          <Route path="/brands/dlink" element={<BrandDLink />} />
          <Route path="/orderSuccess/:id" element={<OrderConfirm />} />
          <Route path="/cart/similarproducts" element={<YouMayAlsoLike />} />
          {/* testing route */}
          <Route path="/boqcompleted" element={<Boqcompleted />} />
          <Route
            path="/ecommerceadmin"
            element={
              <PrivateRoute>
                {accountHolder?.role && accountHolder.role === "admin" && (
                  <AdminDashboardEcom />
                )}
              </PrivateRoute>
            }
          />
          <Route
            path="/admindashboardinterface"
            element={
              <PrivateRoute>
                {accountHolder?.role && accountHolder.role === "admin" && (
                  <DashboardInterface />
                )}
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
