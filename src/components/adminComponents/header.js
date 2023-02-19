import { logo } from "../../constants/images.js";

export default (props) => {
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
        <button className="btn btn_logout">logout</button>
      </div>
    </header>
  );
};
