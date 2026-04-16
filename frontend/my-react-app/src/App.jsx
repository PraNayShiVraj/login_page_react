import React from "react";
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Page from "./Page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Page />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
