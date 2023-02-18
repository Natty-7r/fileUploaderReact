import { useState } from "react";
import { GrCheckboxSelected } from "react-icons/fa";
import { user } from "../../constants/images";
import "../../styles/coordinatorStyles/notification.css";
const Notification = (props) => {
  return (
    <div className={`notification notification-${props.type}`}>
      <div className="notification_image">
        <img src={user} />
      </div>
      <NotificationMessage
        index={props.index}
        type={props.type}
        handleChangeCommentStatus={props.handleChangeCommentStatus}
        handleRemoveComment={props.handleRemoveComment}
        comment={props.comment || null}
        message={props.message || null}
        totalExpiredDrugs={props.totalExpiredDrugs}
        totalPendigDrugs={props.totalPendigDrugs}
        pendingTypes={props.pendingTypes}
        expiredTypes={props.expiredTypes}
        requestTypes={props.requestTypes}
        totalRequestedDrugs={props.totalRequestedDrugs}
      />
      <NotificationButton
        handleCheckExpiration={props.handleCheckExpiration}
        handleRegistration={props.handleRegistration}
        handleGoToAddToStock={props.handleGoToAddToStock}
        type={props.type}
      />
    </div>
  );
};
const NotificationMessage = (props) => {
  const commentIndex = props.index;
  const [detailMsg, setDetailMsg] = useState(false);

  const [status, setStatus] = useState(props?.comment?.status);
  const handleChangeStatus = () => {
    props.handleChangeCommentStatus(commentIndex);
  };
  const handleRemoveComment = () => {
    props.handleRemoveComment(commentIndex);
  };

  const formatDates = function (dateAccepted) {
    const date = new Date(dateAccepted);
    let now = new Date();

    const dayLong = Math.abs(Math.round((date - now) / (1000 * 60 * 60 * 24)));

    let dateDisplayed;
    if (dayLong == 0) dateDisplayed = "Today";
    else if (dayLong == 1) dateDisplayed = "Yesterday";
    else if (dayLong <= 7) dateDisplayed = `${dayLong}  days ago`;
    else if (dayLong <= 30) dateDisplayed = `${dayLong % 7} weeks ago`;
    else if (dayLong == 30) dateDisplayed = `last month `;
    else if (dayLong <= 365) dateDisplayed = `${dayLong % 30} month ago`;
    // else dateDisplayed = Intl.DateTimeFormat("am-Et").format(now);

    return dateDisplayed;
  };
  if (props.type == "new")
    return (
      <div className="notification_massage">
        <div className="notification_massage_header">new drugs </div>
        <div className="notification_massage_content">
          There are
          <span className="expired_amount">{props.totalPendigDrugs}</span>new
          arriving drugs in from
          <span className="expired_amount">{props.pendingTypes}</span> type of
          drugs
        </div>
      </div>
    );
  if (props.type == "comment")
    return (
      <div className="notification_massage notification_massage-comment">
        <div className="notification_massage_header">
          <div className="left_message">
            <span className="sender_name">{props.comment.name}</span>
            <span className="comment_content">{props.comment.message}</span>
          </div>
          <div className="right_message">
            <span className="comment_date">
              {formatDates(props.comment.createdAt)}
            </span>
          </div>
        </div>
        <div className="notification_massage_subheader">
          <div className="left_message">
            <span className="sender_type">{props.comment.sender}</span>
            <button
              className=" btn-remove-comment"
              onClick={handleRemoveComment}>
              remove
            </button>
          </div>
          <div className="right_message">
            <button
              className={`read_link${status == "read" ? "-read" : ""}`}
              onClick={handleChangeStatus}>
              {status}
            </button>
          </div>
        </div>
      </div>
    );
  if (props.type == "expiration")
    return (
      <div className="notification_massage">
        <div className="notification_massage_header">expired drugs </div>
        <div className="notification_massage_content">
          There are
          <span className="expired_amount">{props.totalExpiredDrugs}</span>new
          expired drugs from
          <span className="expired_amount">{props.expiredTypes}</span> type of
          drugs
        </div>
      </div>
    );

  if (props.type == "request")
    return (
      <div className="notification_massage">
        <div className="notification_massage_header">stock requests </div>
        <div className="notification_massage_content">
          There is request from stock for
          <span className="expired_amount">{props.totalRequestedDrugs}</span>
          drugs from
          <span className="expired_amount">{props.requestTypes}</span> type of
          drugs
        </div>
      </div>
    );
};
const NotificationButton = (props) => {
  if (props.type == "expiration")
    return (
      <button
        className="btn btn_notificaion"
        onClick={props.handleCheckExpiration}>
        check expired{" "}
      </button>
    );
  if (props.type == "comment") return null;
  if (props.type == "new")
    return (
      <button
        className="btn btn_notificaion"
        onClick={props.handleRegistration}>
        Register drugs{" "}
      </button>
    );
  if (props.type == "request")
    return (
      <button
        className="btn btn_notificaion"
        onClick={props.handleGoToAddToStock}>
        see request{" "}
      </button>
    );
};
export default (props) => {
  const [commentSlide, setCommentSlide] = useState(2);
  let notificationNumber = 0,
    notificationMessages = [];
  let totalExpiredDrugs = 0;
  let expiredTypes = props?.expiredDrugs?.length || 0;
  let totalPendigDrugs = 0;
  let pendingTypes = props?.storeOrders?.length || 0;
  let totalRequestedDrugs = 0;
  let requestTypes = props?.stockRequests?.length || 0;
  const goToAddComments = () => {
    setCommentSlide(1);
  };
  const goToSeeComments = () => {
    setCommentSlide(2);
  };
  const countNotificaitonNumber = () => {
    if (props.user == "coordinator") {
      if (props.expiredDrugs.length > 0) {
        notificationNumber++;
        notificationMessages.push("expiration");
      }
      if (props.storeOrders.length > 0) {
        notificationNumber++;
        notificationMessages.push("new");
      }
      if (props.stockRequests.length > 0) {
        notificationNumber++;
        notificationMessages.push("request");
      }
      props.expiredDrugs.forEach((drug) => {
        totalExpiredDrugs += drug.amount;
      });
      props.storeOrders.forEach((drug) => {
        totalPendigDrugs += drug.amount;
      });
      props.stockRequests.forEach((drug) => {
        totalRequestedDrugs += drug.amount;
      });
    }
    if (props.user == "pharmacist") {
      if (props.expiredDrugs.length > 0) {
        notificationNumber++;
        notificationMessages.push("expiration");
      }
      if (props.stockOrders.length > 0) {
        notificationNumber++;
        notificationMessages.push("new");
      }
      props.expiredDrugs.forEach((drug) => {
        totalExpiredDrugs += drug.amount;
      });
      props.stockOrders.forEach((drug) => {
        totalPendigDrugs += drug.amount;
      });
    }
    if (props.user == "manager") {
      if (props.comments.length > 0) {
        props.comments.forEach((comment) => {
          notificationNumber++;
          notificationMessages.push("comment");
        });
      }
    }
  };
  countNotificaitonNumber();
  if (props.user == "supplier") {
    return (
      <div className="comments_slide">
        <div className="selectedButtons">
          <button
            className={`bnt_selector ${
              commentSlide == 1 ? "bnt_selector-active" : ""
            } `}
            onClick={goToAddComments}>
            add comment
          </button>
          <button
            className={`bnt_selector ${
              commentSlide == 2 ? "bnt_selector-active" : ""
            } `}
            onClick={goToSeeComments}>
            previous comments
          </button>
        </div>
        {commentSlide == 1 ? (
          <div className="comment_form">
            <h2 className="form_header">add Comment</h2>
            <textarea className="input input-comment"></textarea>
            <button className="btn btn-comment">submit</button>
          </div>
        ) : notificationNumber == 0 ? (
          <div className="notificaton_content">
            <h1 className="no_data_headers">Notification stack is empty </h1>;
          </div>
        ) : (
          <div className="notificaton_content">
            {props.comments.map((comment, index) => (
              <Notification
                key={index}
                index={index}
                type={"comment"}
                comment={comment}
                handleChangeCommentStatus={props.handleChangeCommentStatus}
                handleRemoveComment={props.handleRemoveComment}
                handleCheckExpiration={props.handleCheckExpiration}
                handleRegistration={props.handleRegistration}
                totalExpiredDrugs={totalExpiredDrugs}
                totalPendigDrugs={totalPendigDrugs}
                pendingTypes={pendingTypes}
                expiredTypes={expiredTypes}
                totalRequestedDrugs={totalRequestedDrugs}
                requestTypes={requestTypes}
                handleGoToAddToStock={props.handleGoToAddToStock}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
  if (notificationNumber == 0)
    return (
      <div className="notificaton_content">
        <h1 className="no_data_header">Notification stack is empty </h1>;
      </div>
    );
  if (notificationNumber > 0) {
    if (props.user == "manager")
      return (
        <div className="notificaton_content">
          {props.comments.map((comment, index) => (
            <Notification
              key={index}
              index={index}
              type={"comment"}
              comment={comment}
              handleChangeCommentStatus={props.handleChangeCommentStatus}
              handleRemoveComment={props.handleRemoveComment}
              handleCheckExpiration={props.handleCheckExpiration}
              handleRegistration={props.handleRegistration}
              totalExpiredDrugs={totalExpiredDrugs}
              totalPendigDrugs={totalPendigDrugs}
              pendingTypes={pendingTypes}
              expiredTypes={expiredTypes}
              totalRequestedDrugs={totalRequestedDrugs}
              requestTypes={requestTypes}
              handleGoToAddToStock={props.handleGoToAddToStock}
            />
          ))}
        </div>
      );
    else
      return (
        <div className="notificaton_content">
          {notificationMessages.map((message, index) => (
            <Notification
              key={index}
              type={message}
              handleCheckExpiration={props.handleCheckExpiration}
              handleRegistration={props.handleRegistration}
              totalExpiredDrugs={totalExpiredDrugs}
              totalPendigDrugs={totalPendigDrugs}
              pendingTypes={pendingTypes}
              expiredTypes={expiredTypes}
              totalRequestedDrugs={totalRequestedDrugs}
              requestTypes={requestTypes}
              handleGoToAddToStock={props.handleGoToAddToStock}
            />
          ))}
        </div>
      );
  }
};
