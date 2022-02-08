import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar';
import Home from "./components/Home";
import ManageInvoice from "./components/ManageInvoice";

const App: FC = () => {
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/invoice' element={<ManageInvoice />} />
          <Route path='/edit/:id' element={<ManageInvoice />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
