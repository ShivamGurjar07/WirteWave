import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8080/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((userInfo) => {
        if (!userInfo.error) {
          setUserInfo(userInfo);
        }
      })
      .catch((err) => console.log("Error fetching profile:", err));
  }, []);

  function logout() {
    fetch("http://localhost:8080/logout", {
      credentials: "include",
      method: "POST",
    })
      .then(() => {
        setUserInfo(null);
      })
      .catch((err) => console.log("Error logging out:", err));
  }

  const username = userInfo?.username;

  return (
    <div>
      <header>
        <Link to="/" className="logo">WriteWave</Link>
        <nav className="header">
          {username ? (
            <div className="header">
              <div><h3>Hello, {username}</h3></div>
              <div><Link to="/create"><button> Create new post</button></Link></div>
              <div><button className="logout"onClick={logout}>Logout</button></div>
            </div>
          ):(
            <div className="header">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Header;
