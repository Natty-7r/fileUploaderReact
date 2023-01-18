import { user } from "../../constants/images.js";
import "../../styles/adminStyles/accountDetail.css";
import { useState } from "react";
export default (props) => {
  const [active, setActive] = useState(true);
  const hadleClick = () => {
    setActive(!active);
    props.account.active = !props.account.active;
  };
  const handleClose = () => {
    props.handleDetailVisiblity(false, props.index, false, true);
  };
  if (!props.visibility) return null;
  return (
    <div className="account_detail ">
      <div className="detail_header">
        <button
          className="close "
          onClick={handleClose}>
          X
        </button>{" "}
        <p
          className={`${
            props.account.active ? "active" : "inactive"
          } account_state`}>
          {`${props.account.active ? "active" : "inactive"}`}
        </p>
      </div>
      <div className="detail_image">
        <img
          src={user}
          alt="userimage"
        />
      </div>
      <div className="detail_text">
        <p className="detail f_name">
          <span className="key key-fname">first name</span>
          <span className="value value-fname">{props.account.firstName}</span>
        </p>
        <p className="detail l_name">
          <span className="key key-lname">last name</span>
          <span className="value value-lname">{props.account.lastName} </span>
        </p>

        <p className="detail email">
          <span className="key key-email">email/phone no.</span>
          <span className="value value-email">{props.account.email}</span>
        </p>
        <p className="detail role">
          <span className="key key-role">role</span>
          <span className="value value-email">{props.account.role} </span>
        </p>
        <p className="detail date_assigned">
          <span className="key key-date">assigned date</span>
          <span className="value value-date">{props.account.date}</span>
        </p>
      </div>
      <div className="detail_btns">
        <button
          className="btn btn_deactive"
          onClick={hadleClick}>{`${
          props.account.active ? "deactivate" : "activate"
        }`}</button>
        <button className="btn btn_delete">delete</button>
      </div>
    </div>
  );
};
