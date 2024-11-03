import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/layout/Page/Home";
import RootPage from "./components/layout/Page/RootPage";
import LinearPage from "./components/layout/Page/LinearPage";
import DiffPage from "./components/layout/Page/DiffPage";
import InterpolationPage from "./components/layout/Page/InterpolationPage";
import ExtrapolationPage from "./components/layout/Page/ExtrapolationPage";
import IntegrationPage from "./components/layout/Page/IntegrationPage";


function App() {
return (
  <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        
        {/* Root of Equation routes */}
        <Route path="/root" element={<RootPage />} />
        
        {/* Linear Algebra routes */}
        <Route path="/linear" element={<LinearPage />} />

        {/* Numerical Differentiation routes */}
        <Route path="/diff" element={<DiffPage />} />

        {/* Interpolation routes */}
        <Route path="/interpolation" element={<InterpolationPage />} />

        {/* Extrapolation routes */}
        <Route path="/extrapolation" element={<ExtrapolationPage />} />

        {/* Integration routes */}
        <Route path="/integration" element={<IntegrationPage />} />


      </Routes>
    </Router>
  );
}

export default App;
