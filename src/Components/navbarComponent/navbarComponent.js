import React from "react";
import { Link } from "react-router-dom";
import './navbarComponent.css';

const NavbarComponent = () => {
  return (
    <nav className="navbar">
      <div className="links">
        <Link to="/" style = {{marginLeft: "15px"}}>Home</Link>
        <Link to="/Historical_Data" style = {{marginLeft: "15px"}}>Historical conversion rate</Link>
        <Link to="/chart" style = {{marginLeft: "15px"}}>Chart</Link>
      </div>
    </nav>
  );
}
 
export default NavbarComponent;
