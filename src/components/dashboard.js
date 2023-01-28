import { user } from "../constants/images";
import "../styles/coordinatorStyles/dashboard.css";

export default (props) => {
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
          jalleta<span className="profile_role">coordinator</span>{" "}
        </div>
      </div>
      <div className="dashboard_menus">
        <button
          className={`btn_menu ${
            props.currentSlide == "available" ? "btn_menu-active " : ""
          }`}
          onClick={props.seeAllDrugs}>
          {" "}
          available drugs{" "}
        </button>
        <button
          className={`btn_menu ${
            props.currentSlide == "expired" ? "btn_menu-active " : ""
          }`}
          onClick={props.handleCheckExpiration}>
          check expired drugs{" "}
        </button>
        <button className="btn_menu">generate report </button>
        <button
          className={`btn_menu ${
            props.currentSlide == "request" ? "btn_menu-active " : ""
          }`}
          onClick={props.handleSendRequest}>
          send requrest{" "}
        </button>
        <button
          className={`btn_menu ${
            props.notificationNum ? " btn_notification" : ""
          } ${props.currentSlide == "notification" ? "btn_menu-active " : ""}`}
          onClick={props.handleSeeNotification}>
          notification{" "}
          {props.notificationNum ? (
            <div>
              <p className="notification_blink"></p>
              <p className="notification_number">{props.notificationNum} </p>
            </div>
          ) : null}
        </button>

        <button className="btn_menu">update profile</button>
      </div>
    </div>
  );
};
