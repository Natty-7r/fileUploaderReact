import { logo } from "../../constants/images.js";
import "../../styles/adminStyles/header.css";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
export default (props) => {
  const navigate = useNavigate();
  const logout = () => {
    navigate("/admin");
  };
  return (
    <header className="header">
      <div className="header_left">
        <p className="logo">
          <img
            src={logo}
            alt="logo"
          />
        </p>
        <h2 className="name">sewi drug store </h2>
      </div>
      <div className="header_right">
        <button
          className="btn btn_logout"
          onClick={logout}>
          logout
        </button>
      </div>
    </header>
  );
};
