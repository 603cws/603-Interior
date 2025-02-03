import React from "react";
import { lazy, Suspense } from "react";
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

// const Homepage = lazy(() => import("./pages/Homepage"));

const Layout = lazy(() => import("./layout/pages/Layout"));

const BlogPage = lazy(() => import("./pages/Blog"));
const Carrer = lazy(() => import("./pages/Carrer"));

function App() {
  return (
    <div>
      {/* <Layout /> */}
      {/* <Boq /> */}
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Layout" element={<Layout />} />
          <Route path="/RegisterUser" element={<RegisterUser />} />
          <Route path="/boq" element={<Boq />} />
          <Route path="/Error" element={<ErrorModal />} />
          <Route path="/ProductCard" element={<ProductCard />} />
          <Route path="/ProductOverview" element={<ProductOverview />} />
          <Route path="/Addon" element={<Addon />} />
          <Route path="/Recommend" element={<RecommendComp />} />
          <Route path="/selectArea" element={<SelectArea />} />
          <Route path="/spinner" element={<SpinnerFullPage />} />
          <Route path="/Contactus" element={<Contactus />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/Blog" element={<BlogPage />} />
          <Route path="/Career" element={<Carrer />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/NumberAnimation" element={<NumberAnimation />} />
          <Route path="/JobCard" element={<JobCard />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/OurServices" element={<OurServices />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
