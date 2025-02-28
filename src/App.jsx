import React from "react";
import { lazy, Suspense, useEffect } from "react";
// import Layout from "./layout/pages/Layout";
import Boq from "./boq/pages/Boq";
import PageNotFound from "./common-components/PageNotFound";

import { Route, Routes } from "react-router-dom";
import RegisterUser from "./layout/components/RegisterUser";
import ErrorModal from "./common-components/ErrorModal";
import ProductCard from "./boq/components/ProductCard";
import ProductOverview from "./boq/components/ProductOverview";
import Addon from "./boq/components/Addon";
import RecommendComp from "./boq/components/RecommendComp";
import SelectArea from "./boq/components/SelectArea";
import Landing from "./pages/Landing";
import NumberAnimation from "./common-components/NumberAnimation";
import JobCard from "./common-components/JobCard";

import SpinnerFullPage from "./common-components/SpinnerFullPage";
import Contactus from "./pages/Contactus";
import AboutUs from "./pages/AboutUs";
import Login from "./common-components/Login";
import OurServices from "./pages/OurServices";

import BlogDetail from "./pages/BlogDetail";
import ProfileCard from "./boq/components/ProfileCard";
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./common-components/ScrollToTop";
// import useAuthRefresh from "./Context/useAuthRefresh"; // Import the hook
import BecomeSeller from "./pages/BecomeSeller";
import { useApp } from "./Context/Context";
import Plans from "./common-components/Plans";
import HelpnFaq from "./pages/HelpnFaq";

import TermsAndCondition from "./pages/TermsAndCondition";

import Boqcompleted from "./common-components/Boqcompleted";
import Howtosell from "./pages/Howtosell";

import VendorDashboard from "./pages/vendor/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
// import DashboardProductCard from "./common-components/DashboardProductCard";
import DashboardGetPlan from "./common-components/DashboardGetPlan";
import PricingCard from "./common-components/PricingCard";
import VendorRegister from "./pages/vendor/VendorRegister";

// const Homepage = lazy(() => import("./pages/Homepage"));

const Layout = lazy(() => import("./layout/pages/Layout"));

const BlogPage = lazy(() => import("./pages/Blog"));
const Carrer = lazy(() => import("./pages/Carrer"));

function App() {
  // useAuthRefresh(); // Automatically handles user inactivity

  const { accountHolder, isAuthenticated, isAuthLoading } = useApp();

  // While authentication is loading, show a spinner
  if (isAuthLoading) {
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
            <Route path="/RegisterUser" element={<RegisterUser />} />
            <Route path="/boq" element={<Boq />} />
            <Route path="/Recommend" element={<RecommendComp />} />
            <Route path="/selectArea" element={<SelectArea />} />
            <Route path="/spinner" element={<SpinnerFullPage />} />
            <Route path="/Contactus" element={<Contactus />} />
            <Route path="/Aboutus" element={<AboutUs />} />
            <Route path="/Blog" element={<BlogPage />} />
            <Route path="/Blog/:title" element={<BlogDetail />} />
            <Route path="/Career" element={<Carrer />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/OurServices" element={<OurServices />} />
            <Route path="/profile" element={<ProfileCard />} />
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
            <Route path="/termsNcondtion" element={<TermsAndCondition />} />
            <Route path="/boqcompleted" element={<Boqcompleted />} />
            <Route path="/howtosell" element={<Howtosell />} />
            <Route path="/vendordashboard" element={<VendorDashboard />} />
            <Route path="/vendorregister" element={<VendorRegister />} />
            {/* <Route path="/dashprod" element={<DashboardProductCard />} /> */}
            <Route path="/getplan" element={<PricingCard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Layout" element={<Layout />} />
            <Route path="/RegisterUser" element={<RegisterUser />} />
            <Route path="/Error" element={<ErrorModal />} />
            <Route path="/Contactus" element={<Contactus />} />
            <Route path="/Aboutus" element={<AboutUs />} />
            <Route path="/Blog" element={<BlogPage />} />
            <Route path="/Blog/:title" element={<BlogDetail />} />
            <Route path="/Career" element={<Carrer />} />
            {/* <Route path="*" element={<PageNotFound />} /> */}
            <Route path="/Login" element={<Login />} />
            <Route path="/OurServices" element={<OurServices />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/becomeseller" element={<BecomeSeller />} />
            <Route path="/help" element={<HelpnFaq />} />
            <Route path="/termsNcondtion" element={<TermsAndCondition />} />
            {/* <Route path="/vendordashboard" element={<VendorDashboard />} /> */}
          </Routes>
        )}
      </Suspense>
    </div>
  );
}

export default App;
