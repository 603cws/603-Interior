import React from "react";
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
import AboutUs from "./pages/AboutUs";
import AboutUs2 from "./pages/AboutUs2";
import Login from "./common-components/Login";
import OurServices from "./pages/OurServices";
import OurServices2 from "./pages/OurServices2";
import BlogDetail from "./pages/BlogDetail";
import ProfileCard from "./boq/components/ProfileCard";
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./common-components/ScrollToTop";
import BecomeSeller from "./pages/BecomeSeller";
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

// const Homepage = lazy(() => import("./pages/Homepage"));
const Layout = lazy(() => import("./layout/pages/Layout"));
const BlogPage = lazy(() => import("./pages/Blog"));
const Carrer = lazy(() => import("./pages/Carrer"));

function App() {
  const { accountHolder, isAuthenticated, isAuthLoading } = useApp();

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
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Layout" element={<Layout />} />
            {/* <Route path="/RegisterUser" element={<RegisterUser />} /> */}
            <Route path="/boq" element={<Boq />} />
            <Route path="/boq/:id" element={<ProductOverview />} />
            <Route path="/Recommend" element={<RecommendComp />} />
            <Route path="/selectArea" element={<SelectArea />} />
            <Route path="/spinner" element={<SpinnerFullPage />} />
            <Route path="/Contactus" element={<Contactus />} />
            <Route path="/Aboutus" element={<AboutUs2 />} />
            {/* <Route path="/Aboutus2" element={<AboutUs2 />} /> */}
            <Route path="/Blog" element={<BlogPage />} />
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
            {/* <Route path="/OurServices2" element={<OurServices2 />} /> */}
            <Route path="/Career/:jobTitle" element={<JobPage />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/scroll" element={<DoorScrollEffect />} />
            <Route
              path="/dashboard"
              element={
                accountHolder?.role ? (
                  accountHolder.role === "admin" ? (
                    // <Dashboard />
                    <AdminDashboard />
                  ) : accountHolder.role === "vendor" ? (
                    <VendorDashboard />
                  ) : accountHolder.role === "user" ? (
                    <Dashboard />
                  ) : (
                    <PageNotFound />
                  )
                ) : (
                  <SpinnerFullPage />
                )
              }
            />
            <Route path="/becomeseller" element={<BecomeSeller />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/help" element={<HelpnFaq />} />
            <Route path="/termsNcondition" element={<TermsAndCondition />} />
            <Route path="/boqcompleted" element={<Boqcompleted />} />
            <Route path="/howtosell" element={<Howtosell />} />
            <Route path="/vendordashboard" element={<VendorDashboard />} />
            <Route path="/vendorregister" element={<VendorRegister />} />
            {/* <Route path="/dashprod" element={<DashboardProductCard />} /> */}
            <Route path="/getplan" element={<PricingCard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/bookappointment" element={<BookAppointment />} />
            <Route path="/sessiontimeout" element={<Sessiontimeout />} />
            <Route path="/brokenlink" element={<Brokenlink />} />
            <Route path="/tokenExpired" element={<TokenExpired />} />
            <Route path="/partnerwithus" element={<PartnerWorkvedInterior />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Layout" element={<Layout />} />
            {/* <Route path="/RegisterUser" element={<RegisterUser />} /> */}
            <Route path="/Error" element={<ErrorModal />} />
            <Route path="/Contactus" element={<Contactus />} />
            <Route path="/Aboutus" element={<AboutUs2 />} />
            {/* <Route path="/Aboutus2" element={<AboutUs2 />} /> */}
            <Route path="/Blog" element={<BlogPage />} />
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
            {/* <Route path="/OurServices2" element={<OurServices2 />} /> */}
            <Route path="/Career/:jobTitle" element={<JobPage />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/becomeseller" element={<BecomeSeller />} />
            <Route path="/help" element={<HelpnFaq />} />
            <Route path="/termsNcondition" element={<TermsAndCondition />} />
            {/* <Route path="/vendordashboard" element={<VendorDashboard />} /> */}
            <Route path="/bookappointment" element={<BookAppointment />} />
            <Route path="/howtosell" element={<Howtosell />} />
            <Route path="/partnerwithus" element={<PartnerWorkvedInterior />} />
          </Routes>
        )}
      </Suspense>
    </div>
  );
}

export default App;
