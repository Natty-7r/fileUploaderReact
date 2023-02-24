import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { AiFillEyeInvisible } from "react-icons/ai";
import { logo } from "../constants/images";
import "../styles/auth/signup.css";
import axios from "axios";
export default (props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nameLable, setNameLable] = useState(true);
  const [codeLabel, setCodeLabel] = useState(true);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [passcodeVisible, setPasscodeVisibility] = useState(false);
  const [visibilityIcon, setVisibilityIcon] = useState(<AiFillEyeInvisible />);

  const handleOnChangeVisibility = (e) => {
    setPasscodeVisibility(!passcodeVisible);
    if (passcodeVisible) setVisibilityIcon(<AiFillEye />);
    if (!passcodeVisible) setVisibilityIcon(<AiFillEyeInvisible />);
  };
  const handleOnLogin = (e) => {
    e.preventDefault();
    if (username == "") {
      setErrorMsg("Username filed empty !");
      setError(true);
      return;
    } else if (password == "") {
      setErrorMsg("Password filed empty !");
      setError(true);
      return;
    } else {
      axios
        .post("http://localhost:8080/auth/login", {
          username,
          password,
        })
        .then((response) => {
          const auth = response.data.auth;
          const user = response.data.user;
          if (auth) {
            localStorage.setItem("sewiUser", JSON.stringify({ auth, user }));
            setError(false);
            props.setUser(user);
            props.setAuth(auth);
            console.log(user.username);
            navigate(`/${user.role}`);
          }
          if (!auth) {
            setErrorMsg(response.data.message);
            setError(true);
          }
        });
    }
  };
  return (
    <div className="login_form_container">
      <form
        className="login_form"
        onSubmit={handleOnLogin}>
        <div className="form_header">
          <div className="form_header_image">
            <img src={logo} />
          </div>
          <h1 className="form_header_title">login here </h1>
        </div>
        <p
          className={`login_form_error ${
            error ? "login_form_error-visible" : ""
          }`}>
          {errorMsg}
        </p>
        <div className="form_content">
          <div className="input_container">
            {nameLable ? (
              <label className="lable name_label">username </label>
            ) : null}
            <input
              type="text"
              className="input input-username"
              onChange={(e) => setUsername(e.target.value)}
              onFocus={(e) => setNameLable(false)}
              onBlur={(e) => {
                if (e.target.value == "") setNameLable(true);
              }}
            />
            <FaUserAlt className="input_icon" />
          </div>
          <div className="input_container input_container-passcode">
            {codeLabel ? (
              <label className="lable code_label">password </label>
            ) : null}
            <input
              type={passcodeVisible ? "text" : "password"}
              className="input input-username"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => setCodeLabel(false)}
              onBlur={(e) => {
                if (e.target.value == "") setCodeLabel(true);
              }}
            />
            <FaLock className="input_icon" />
            <button
              className="password_visbility"
              onMouseDown={handleOnChangeVisibility}>
              {" "}
              {visibilityIcon}{" "}
            </button>
          </div>
          <button
            className=" btn_login"
            onClick={handleOnLogin}>
            login{" "}
          </button>
        </div>
      </form>
    </div>
  );
};
