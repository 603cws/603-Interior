import React from "react";
import { lazy, Suspense } from "react";
// import Layout from "./layout/pages/Layout";
import Boq from "./boq/pages/Boq";
import PageNotFound from "./components/PageNotFound";

import { Route, Routes } from "react-router-dom";
import RegisterUser from "./layout/components/RegisterUser";
import ErrorModal from "./components/ErrorModal";
import ProductCard from "./boq/components/ProductCard";
import ProductOverview from "./boq/components/ProductOverview";
import Addon from "./boq/components/Addon";
import RecommendComp from "./boq/components/RecommendComp";
import SelectArea from "./boq/components/SelectArea";
import Landing from "./pages/Landing";

import SpinnerFullPage from "./components/SpinnerFullPage";

// const Homepage = lazy(() => import("./pages/Homepage"));

const Layout = lazy(() => import("./layout/pages/Layout"));

function App() {
  return (
    <div>
      {/* <Layout /> */}
      {/* <Boq /> */}
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/RegisterUser" element={<RegisterUser />} />
          <Route path="/boq" element={<Boq />} />
          <Route path="/Error" element={<ErrorModal />} />
          <Route path="/ProductCard" element={<ProductCard />} />
          <Route path="/ProductOverview" element={<ProductOverview />} />
          <Route path="/Addon" element={<Addon />} />
          <Route path="/Recommend" element={<RecommendComp />} />
          <Route path="/selectArea" element={<SelectArea />} />
          <Route path="/spinner" element={<SpinnerFullPage />} />
          <Route path="/Home" element={<Landing />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
