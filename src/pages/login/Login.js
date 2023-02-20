import React, { useEffect, useState } from "react";
import lock from "./lock.jpg";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillWarning } from "react-icons/ai";
import "./Login.css";
import axios from "axios";
import { Navigate, redirect, useNavigate } from "react-router";

export default function Login() {
  const [passType, setPassType] = useState("password");
  const [show, setShow] = useState(<AiFillEyeInvisible />);
  const [error, setError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("ddd");
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });
      const data = response?.data;
      let userData = JSON.stringify(data.userData);
      localStorage.setItem("userData", userData);
      localStorage.setItem("auth", data.auth);
      if (data.auth) {
        setError(false);
        Navigate("/viewall");
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //show or hide password
  const showPass = (e) => {
    e.preventDefault();
    if (passType === "password") {
      setPassType("text");
      setShow(<AiFillEye />);
    } else {
      setPassType("password");
      setShow(<AiFillEyeInvisible />);
    }
  };

  return (
    <div className="contents-x-login">
      <div className="LoginContainers">
        <div className="fluid-container">
          <div className="graph__container">
            <img
              src={lock}
              alt=""
              className="graph"
            />
          </div>

          <div className="sign__in_container">
            <div className="sing__elements">
              <h2 className="login-h2">Log in</h2>
              {error && (
                <div className="error__credential">
                  <AiFillWarning />
                  <p>You have entered invalid credentials!</p>
                </div>
              )}

              <div className="form__input">
                <div className="inputs">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email "
                    className="emailInput"
                  />
                </div>
                <div className="inputs pswd__area">
                  <input
                    type={passType}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="pswd__area passwordInput"
                  />

                  <button
                    className="show__pswd"
                    onClick={showPass}>
                    {" "}
                    {show}{" "}
                  </button>
                </div>

                <button
                  onClick={handleSubmit}
                  name=""
                  className="sign-btn">
                  login in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
