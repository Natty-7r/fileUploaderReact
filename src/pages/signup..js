import "../styles/auth/signup.css";
export default () => {
  return (
    <div
      action=""
      className="form signupForm">
      <div className="formContainer">
        <div className="inputContainer">
          <input
            type="text"
            className="input"
            placeholder="a"
          />
          <label
            for=""
            className="label">
            Email
          </label>
        </div>

        <div className="inputContainer">
          <input
            type="text"
            className="input"
            placeholder="a"
          />
          <label
            for=""
            className="label">
            Username
          </label>
        </div>

        <div className="inputContainer">
          <input
            type="password"
            className="input"
            placeholder="a"
          />
          <label
            for=""
            className="label">
            Password
          </label>
        </div>

        <div className="inputContainer">
          <input
            type="password"
            className="input"
            placeholder="a"
          />
          <label
            for=""
            className="label">
            Confirm password
          </label>
        </div>
        <div className="inputContanier buttonContainer">
          <button
            className="btn btn_submit"
            value="login ">
            login{" "}
          </button>
          <button className="link link_forgot">forgot password?</button>
        </div>
      </div>
    </div>
  );
};