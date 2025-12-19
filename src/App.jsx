import { lazy, Suspense } from "react";
import "./styles/Landing.css";
import { Navigate, Route, Routes } from "react-router-dom";
import SpinnerFullPage from "./common-components/SpinnerFullPage";
import { useApp } from "./Context/Context";
import PrivateRoute from "./utils/PrivateRoute";
import ScrollToTop from "./common-components/ScrollToTop";
import BrandRouter from "./pages/Brands/BrandRouter";
const Contactus = lazy(() => import("./landing/pages/Contactus"));
const AboutUs = lazy(() => import("./landing/pages/AboutUs"));
const Login = lazy(() => import("./common-components/Login"));
const BlogDetail = lazy(() => import("./landing/pages/BlogDetail"));
const Dashboard = lazy(() => import("./dashboards/user/Dashboard"));
const BrandDLink = lazy(() => import("./pages/Brands/BrandDLink"));
const DashboardInterface = lazy(() =>
  import("./dashboards/admin/DashboardInterface")
);
const VendorDashboardLayout = lazy(() =>
  import("./dashboards/vendor/VendorDashboardLayout")
);
const Services = lazy(() => import("./landing/pages/Services"));
const OurStory = lazy(() => import("./landing/pages/OurStory"));
const OrderConfirm = lazy(() => import("./Ecommerce/components/OrderConfirm"));
const AdminDashboardEcom = lazy(() =>
  import("./dashboards/admin/EcommerceDashboard/AdminDashboardEcom")
);
const DynamicTitle = lazy(() => import("./common-components/DynamicTitle"));
const YouMayAlsoLike = lazy(() => import("./Ecommerce/pages/YouMayAlsoLike"));
const BrandsOverview = lazy(() => import("./pages/Brands/BrandOverview"));
const Layout = lazy(() => import("./layout/pages/Layout"));
const Career = lazy(() => import("./landing/pages/Career"));

const HelpnFaq = lazy(() => import("./landing/pages/HelpnFaq"));
const TermsAndCondition = lazy(() =>
  import("./landing/pages/TermsAndCondition")
);
const Boqcompleted = lazy(() => import("./common-components/Boqcompleted"));
const AdminDashboard = lazy(() => import("./dashboards/admin/AdminDashboard"));
const ProductOverview = lazy(() => import("./boq/pages/ProductOverview"));
const JobPage = lazy(() => import("./landing/pages/JobPage"));
const ThreeDViewer = lazy(() => import("./common-components/ThreeDViewer"));
const CompleteProfile = lazy(() =>
  import("./common-components/CompleteProfile")
);
const Privacy = lazy(() => import("./landing/pages/Privacy"));
const InteriorBlog = lazy(() => import("./landing/pages/InteriorBlog"));

const Products = lazy(() => import("./Ecommerce/pages/Products"));
const ProductView = lazy(() => import("./Ecommerce/pages/ProductView"));
const ShopProducts = lazy(() => import("./Ecommerce/pages/ShopProducts"));
const Cart = lazy(() => import("./Ecommerce/pages/Cart"));
const Addresspage = lazy(() => import("./Ecommerce/pages/Addresspage"));
const Wishlist = lazy(() => import("./Ecommerce/pages/Wishlist"));
const ELogin = lazy(() => import("./common-components/ELogin"));

const Brands = lazy(() => import("./pages/Brands/Brands"));
const ProductReview = lazy(() =>
  import("./Ecommerce/components/ProductReview")
);
const BrandProductView = lazy(() => import("./pages/Brands/BrandProductView"));
const ProfilePage = lazy(() => import("./Ecommerce/pages/ProfilePage"));
const SeasonSpecial = lazy(() => import("./Ecommerce/pages/SeasonSpecial"));
const TopDeal = lazy(() => import("./Ecommerce/pages/TopDeal"));
const AllReviews = lazy(() => import("./Ecommerce/pages/AllReviews"));

const BrandFurniture = lazy(() => import("./pages/Brands/BrandFurniture"));
const BrandLight = lazy(() => import("./pages/Brands/BrandLight"));

const PageNotFound = lazy(() => import("./common-components/PageNotFound"));
const Boq = lazy(() => import("./boq/pages/Boq"));
const Landing = lazy(() => import("./landing/pages/Landing"));

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
          <Route path="/Career" element={<Career />} />
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
                    <DashboardInterface />
                  ) : accountHolder.role === "vendor" ? (
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
                {accountHolder?.role && accountHolder?.role === "admin" && (
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
