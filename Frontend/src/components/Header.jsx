import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <header>
        <Link to="/" href="" className="logo">
          WriteWave
        </Link>
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
    </div>
  );
};

export default Header;
