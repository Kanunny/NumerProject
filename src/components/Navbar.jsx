import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="navbar bg-cyan-700">
        <div className="flex-1">
          <Link to="/" className="text-blue-50 text-xl">NumerProject</Link> {/* ทำให้ NumerProject กดได้ */}
        </div>
        <div className="flex-none"> 
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/" className="text-blue-50">Home</Link> 
            </li>
          </ul>
        </div>
      </div>

      <ul className="menu menu-vertical lg:menu-horizontal w-full bg-cyan-700 text-blue-50">
        <li>
          <a onClick={() => navigate("/root")}>Root of Equation</a>
        </li>
        <li>
          <a onClick={() => navigate("/linear")}>Linear Algebra</a>
        </li>
        <li>
          <a onClick={() => navigate("/interpolation")}>Interpolation</a>
        </li>
        <li>
          <a onClick={() => navigate("/extrapolation")}>Extrapolation</a>
        </li>
        <li>
          <a onClick={() => navigate("/integration")}>Integration</a>
        </li>
        <li>
          <a onClick={() => navigate("/diff")}>Numerical Differentiation</a>
        </li>
      </ul>
    </>
  );
}

export default Navbar;
