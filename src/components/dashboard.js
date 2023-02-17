import { user } from "../constants/images";

import { AiOutlineUnorderedList } from "react-icons/fa";

import "../styles/coordinatorStyles/dashboard.css";

export default (props) => {
  if (props.user == "coordinator")
    return (
      <div className="page_dashboard">
        <div className="dashboard_profile">
          <div className="profile_image">
            <img
              src={user}
              alt="user"
            />
          </div>
          <div className="profile_name">
            jalleta<span className="profile_role">{props.user}</span>{" "}
          </div>
        </div>
        <div className="dashboard_menus">
          <button
            className={`btn_menu ${
              props.currentSlide == "availableStore" ? "btn_menu-active " : ""
            }`}
            onClick={props.seeAvailableDrugsInStore}>
            {" "}
            availables in store{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "availableStock" ? "btn_menu-active " : ""
            }`}
            onClick={props.seeAvailableDrugsInStock}>
            {" "}
            availables in stock{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "expired" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleCheckExpiration}>
            expired drugs{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "register" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleRegistration}>
            Register new drugs{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "addtostock" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleAddToStock}>
            add to stock{" "}
          </button>

          <button
            className={`btn_menu ${
              props.currentSlide == "request" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleSendRequest}>
            send request{" "}
          </button>
          <button
            className={`btn_menu ${
              props.notificationNum ? " btn_notification" : ""
            } ${
              props.currentSlide == "notification" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleSeeNotification}>
            notification{" "}
            {props.notificationNum ? (
              <div>
                <p className="notification_blink"></p>
                <p className="notification_number">{props.notificationNum} </p>
              </div>
            ) : null}
          </button>
          <button className="btn_menu">generate report </button>
        </div>
      </div>
    );
  if (props.user == "pharmacist")
    return (
      <div className="page_dashboard">
        <div className="dashboard_profile">
          <div className="profile_image">
            <img
              src={user}
              alt="user"
            />
          </div>
          <div className="profile_name">
            jalleta<span className="profile_role">{props.user}</span>{" "}
          </div>
        </div>
        <div className="dashboard_menus">
          <button
            className={`btn_menu ${
              props.currentSlide == "availableStock" ? "btn_menu-active " : ""
            }`}
            onClick={props.seeAvailableDrugsInStock}>
            {" "}
            availables in stock{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "expired" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleCheckExpiration}>
            check expired drugs{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "register" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleRegistration}>
            accept new drugs{" "}
          </button>

          <button
            className={`btn_menu ${
              props.currentSlide == "request" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleSendRequest}>
            send request{" "}
          </button>
          <button
            className={`btn_menu ${
              props.notificationNum ? " btn_notification" : ""
            } ${
              props.currentSlide == "notification" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleSeeNotification}>
            notification{" "}
            {props.notificationNum ? (
              <div>
                <p className="notification_blink"></p>
                <p className="notification_number">{props.notificationNum} </p>
              </div>
            ) : null}
          </button>
          <button className="btn_menu">generate report </button>
        </div>
      </div>
    );
  if (props.user == "supplier")
    return (
      <div className="page_dashboard">
        <div className="dashboard_profile">
          <div className="profile_image">
            <img
              src={user}
              alt="user"
            />
          </div>
          <div className="profile_name">
            jalleta<span className="profile_role">{props.user}</span>{" "}
          </div>
        </div>
        <div className="dashboard_menus">
          <button
            className={`btn_menu ${
              props.currentSlide == "orders" ? "btn_menu-active " : ""
            }`}
            onClick={props.onOrders}>
            {" "}
            DRUG ORDERS{" "}
          </button>

          <button
            className={`btn_menu ${
              props.currentSlide == "sendOrders" ? "btn_menu-active " : ""
            }`}
            onClick={props.onSendOrders}>
            send drugs{" "}
          </button>

          <button
            className={`btn_menu ${
              props.currentSlide == "acceptedOrders" ? "btn_menu-active " : ""
            }`}
            onClick={props.onAcceptedOrders}>
            accpted orders{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "rejectedOrdres" ? "btn_menu-active " : ""
            }`}
            onClick={props.onRejectedOrders}>
            rejected orders{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "comments" ? "btn_menu-active " : ""
            }`}
            onClick={props.onComment}>
            comments{" "}
          </button>
        </div>
      </div>
    );
  if (props.user == "manager")
    return (
      <div className="page_dashboard">
        <div className="dashboard_profile">
          <div className="profile_image">
            <img
              src={user}
              alt="user"
            />
          </div>
          <div className="profile_name">
            jalleta<span className="profile_role">{props.user}</span>{" "}
          </div>
        </div>
        <div className="dashboard_menus">
          <button
            className={`btn_menu ${
              props.currentSlide == "availableStore" ? "btn_menu-active " : ""
            }`}
            onClick={props.seeAvailableDrugsInStore}>
            {" "}
            drugs in store{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "availableStock" ? "btn_menu-active " : ""
            }`}
            onClick={props.seeAvailableDrugsInStock}>
            {" "}
            durgs in stock{" "}
          </button>
          <button
            className={`btn_menu ${
              props.currentSlide == "sold drugs" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleCheckSoldDrugs}>
            sold drugs{" "}
          </button>

          <button
            className={`btn_menu ${
              props.currentSlide == "request" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleSendRequest}>
            send order{" "}
          </button>

          <button
            className={`btn_menu ${
              props.notificationNum ? " btn_notification" : ""
            } ${
              props.currentSlide == "notification" ? "btn_menu-active " : ""
            }`}
            onClick={props.handleSeeNotification}>
            comments{" "}
            {props.notificationNum ? (
              <div>
                <p className="notification_blink"></p>
                <p className="notification_number">{props.notificationNum} </p>
              </div>
            ) : null}
          </button>

          <button className="btn_menu">generate report </button>
        </div>
      </div>
    );
};
