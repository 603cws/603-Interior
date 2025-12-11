import { lazy, Suspense } from "react";
import "./styles/Landing.css";
import { Navigate, Route, Routes } from "react-router-dom";
import SpinnerFullPage from "./common-components/SpinnerFullPage";
import { useApp } from "./Context/Context";
import PrivateRoute from "./utils/PrivateRoute";
import ScrollToTop from "./common-components/ScrollToTop";
import BrandRouter from "./pages/Brands/BrandRouter";

// lazy loading
const Contactus = lazy(() => import("./pages/Contactus"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Login = lazy(() => import("./common-components/Login"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const BrandDLink = lazy(() => import("./pages/Brands/BrandDLink"));
const DashboardInterface = lazy(() =>
  import("./pages/Admin/DashboardInterface")
);
const VendorDashboardLayout = lazy(() =>
  import("./pages/vendor/VendorDashboardLayout")
);
const Services = lazy(() => import("./pages/Services"));
const OurStory = lazy(() => import("./pages/OurStory"));
const OrderConfirm = lazy(() => import("./pages/Ecommerce/OrderConfirm"));
const AdminDashboardEcom = lazy(() =>
  import("./pages/Admin/EcommerceDashboard/AdminDashboardEcom")
);
const DynamicTitle = lazy(() => import("./common-components/DynamicTitle"));
const YouMayAlsoLike = lazy(() => import("./pages/Ecommerce/YouMayAlsoLike"));
const Welspun = lazy(() => import("./pages/Brands/Welspun"));
const BrandsOverview = lazy(() => import("./pages/Brands/BrandOverview"));
const Layout = lazy(() => import("./layout/pages/Layout"));
const Carrer = lazy(() => import("./pages/Carrer"));

const HelpnFaq = lazy(() => import("./pages/HelpnFaq"));
const TermsAndCondition = lazy(() => import("./pages/TermsAndCondition"));
const Boqcompleted = lazy(() => import("./common-components/Boqcompleted"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const ProductOverview = lazy(() => import("./boq/pages/ProductOverview"));
const JobPage = lazy(() => import("./pages/JobPage"));
const ThreeDViewer = lazy(() => import("./common-components/ThreeDViewer"));
const CompleteProfile = lazy(() =>
  import("./common-components/CompleteProfile")
);
const Privacy = lazy(() => import("./pages/Privacy"));
const InteriorBlog = lazy(() => import("./pages/InteriorBlog"));

const Products = lazy(() => import("./pages/Ecommerce/Products"));
const ProductView = lazy(() => import("./pages/Ecommerce/ProductView"));
const ShopProducts = lazy(() => import("./pages/Ecommerce/ShopProducts"));
const Cart = lazy(() => import("./pages/Ecommerce/Cart"));
const Addresspage = lazy(() => import("./pages/Ecommerce/Addresspage"));
const Wishlist = lazy(() => import("./pages/Ecommerce/Wishlist"));
const Payments = lazy(() => import("./pages/Ecommerce/Payments"));
const ELogin = lazy(() => import("./common-components/ELogin"));

const Brands = lazy(() => import("./pages/Brands/Brands"));
const ProductReview = lazy(() => import("./pages/Ecommerce/ProductReview"));
const BrandProductView = lazy(() => import("./pages/Brands/BrandProductView"));
const ProfilePage = lazy(() => import("./pages/Ecommerce/ProfilePage"));
const SeasonSpecial = lazy(() => import("./pages/Ecommerce/SeasonSpecial"));
const TopDeal = lazy(() => import("./pages/Ecommerce/TopDeal"));
const AllReviews = lazy(() => import("./pages/Ecommerce/AllReviews"));

const BrandFurniture = lazy(() => import("./pages/Brands/BrandFurniture"));
const BrandLight = lazy(() => import("./pages/Brands/BrandLight"));

const PageNotFound = lazy(() => import("./common-components/PageNotFound"));
const Boq = lazy(() => import("./boq/pages/Boq"));
const Landing = lazy(() => import("./pages/Landing"));

function App() {
  const { accountHolder, isAuthLoading } = useApp();

  if (isAuthLoading) {
    return <SpinnerFullPage />;
  }

  return (
    <div>
      <ScrollToTop />
      <DynamicTitle />
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
          <Route path="/Aboutus" element={<AboutUs />} />
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
          <Route path="/Career/:jobTitle" element={<JobPage />} />
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
          <Route
            path="/brandOverview/welspun/productview"
            element={<BrandProductView />}
          />
          <Route path="/reviews/:id" element={<AllReviews />} />
          <Route path="/brands/furniture" element={<BrandFurniture />} />
          <Route path="/brands/light" element={<BrandLight />} />
          <Route path="/brands/dlink" element={<BrandDLink />} />
          <Route path="/orderSuccess/:id" element={<OrderConfirm />} />
          <Route path="/cart/similarproducts" element={<YouMayAlsoLike />} />
          <Route path="/brandOverview" element={<BrandsOverview />} />
          <Route path="/brandOverview/:brandName" element={<BrandRouter />} />
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
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
