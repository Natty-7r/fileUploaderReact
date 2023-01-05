import { isArguments } from "lodash";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./navbar.scss";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggleNavlist = this.toggleNavlist.bind(this);

    this.state = { listHidden: true };
  }
  toggleNavlist() {
    this.setState((prevState) => ({ listHidden: !prevState.listHidden }));
  }

  NavbarList() {
    // if (this.state.listHidden) return null;
    return (
      <div
        className={`mobile_navlist  ${
          this.state.listHidden
            ? "mobile_navlist_hidden"
            : "mobile_navlist_visible"
        }`}>
        <FontAwesomeIcon icon="fa-light fa-xmark" />
        <FontAwesomeIcon icon="fa-light fa-xmark" />
        <p
          className="btn btn_close"
          onClick={this.toggleNavlist}>
          {" "}
          X{" "}
        </p>
        <li>
          <a href="">home</a>
        </li>
        <li>
          <a href="">about</a>
        </li>
        <li>
          <a href="">catagories</a>
        </li>
        <li>
          <a href="">products</a>
        </li>
        <li>
          <a href="">contact</a>
        </li>
      </div>
    );
  }
  render() {
    return (
      <navbar className="navbar mobile_navbar">
        <div
          className="humburger"
          onClick={this.toggleNavlist}>
          <span className="bar bar_1"></span>
          <span className="bar bar_2"></span>
          <span className="bar bar_3"></span>
        </div>
        {this.NavbarList()}
        <div className="logo_div">
          nane <br />
          furniture
        </div>
        <button className="btn btn_lang">Amh</button>
      </navbar>
    );
  }
}
