import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from './components/Sidebar';
import Home from "./components/Home";
import CreateInvoice from "./components/CreateInvoice";

const App: FC = () => {
  return (
    <>
      <Router>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/invoice' element={<CreateInvoice />} />
          <Route path='/edit' element={<CreateInvoice />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
