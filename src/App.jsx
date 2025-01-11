import React from "react";
import Layout from "./layout/pages/Layout";
import Boq from "./boq/pages/Boq";
import PageNotFound from "./components/PageNotFound";

import { Route, Routes } from "react-router-dom";
import RegisterUser from "./components/RegisterUser";
import ErrorModal from "./components/ErrorModal";
import ProductCard from "./components/ProductCard";
import ProductOverview from "./components/ProductOverview";
import Addon from "./components/Addon";
import RecommendComp from "./components/RecommendComp";
import SelectArea from "./components/SelectArea";

function App() {
  return (
    <div>
      {/* <Layout /> */}
      {/* <Boq /> */}
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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
