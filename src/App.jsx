import React from 'react'
import Layout from './layout/pages/Layout';
import Boq from './boq/pages/Boq';
import PageNotFound from './components/PageNotFound';

import { Route, Routes } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';


function App() {
  return (
    <div>
      {/* <Layout /> */}
      {/* <Boq /> */}
     <Routes>
       <Route path='/' element={<Layout/>} />
       <Route path='/RegisterUser' element={<RegisterUser/>} />
       <Route path='/boq' element={<Boq/>} />
       <Route path='*' element={<PageNotFound/>} />
     </Routes>
    </div>
  )
}

export default App