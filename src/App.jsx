import { lazy, Suspense } from "react";
// import Layout from "./layout/pages/Layout";
import Boq from "./boq/pages/Boq";
import PageNotFound from "./common-components/PageNotFound";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrorModal from "./common-components/ErrorModal";
import RecommendComp from "./boq/components/RecommendComp";
import SelectArea from "./boq/components/SelectArea";
import Landing from "./pages/Landing";
import SpinnerFullPage from "./common-components/SpinnerFullPage";
import Contactus from "./pages/Contactus";
// import AboutUs from "./pages/AboutUs";
import AboutUs2 from "./pages/AboutUs2";
import Login from "./common-components/Login";
// import OurServices from "./pages/OurServices";
import OurServices2 from "./pages/OurServices2";
import BlogDetail from "./pages/BlogDetail";
import ProfileCard from "./boq/components/ProfileCard";
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./common-components/ScrollToTop";
// import BecomeSeller from "./pages/BecomeSeller";
import { useApp } from "./Context/Context";
import Plans from "./common-components/Plans";
import HelpnFaq from "./pages/HelpnFaq";
import TermsAndCondition from "./pages/TermsAndCondition";
import Boqcompleted from "./common-components/Boqcompleted";
import Howtosell from "./pages/Howtosell";
import VendorDashboard from "./pages/vendor/VendorDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PricingCard from "./common-components/PricingCard";
import VendorRegister from "./pages/vendor/VendorRegister";
import DoorScrollEffect from "./pages/DoorScrollEffect";
import BookAppointment from "./boq/components/BookAppointment";
import ProductOverview from "./boq/pages/ProductOverview";
import Sessiontimeout from "./pages/Sessiontimeout";
import Brokenlink from "./pages/Brokenlink";
import TokenExpired from "./pages/TokenExpired";
import JobPage from "./pages/JobPage";
import ThreeDViewer from "./common-components/ThreeDViewer";
import CompleteProfile from "./common-components/CompleteProfile";
import PartnerWorkvedInterior from "./pages/PartnerWorkvedInterior";
import Privacy from "./pages/Privacy";
import OurWork from "./pages/OurWork";
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

const Home = lazy(() => import("./pages/Home"));

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
          <Route path="/Aboutus" element={<AboutUs2 />} />

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
          <Route path="/OurServices" element={<OurServices2 />} />
          <Route path="/services" element={<Services />} />

          <Route path="/Career/:jobTitle" element={<JobPage />} />
          <Route path="/scroll" element={<DoorScrollEffect />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {accountHolder?.role ? (
                  accountHolder.role === "admin" ? (
                    <AdminDashboard />
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

          <Route path="/becomeseller" element={<OurWork />} />
          <Route path="/help" element={<HelpnFaq />} />
          <Route path="/termsNcondition" element={<TermsAndCondition />} />
          <Route path="/howtosell" element={<Howtosell />} />
          <Route path="/sessiontimeout" element={<Sessiontimeout />} />
          <Route path="/brokenlink" element={<Brokenlink />} />
          <Route path="/tokenExpired" element={<TokenExpired />} />
          <Route path="/partnerwithus" element={<PartnerWorkvedInterior />} />
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
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
