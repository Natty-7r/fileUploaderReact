import { user } from "../../constants/images";
const Notification = (props) => {
  console.log(props);
  return (
    <div className="notification">
      <div className="notification_image">
        <img src={user} />
      </div>
      <NotificationMessage
        type={props.type}
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
  let notificationNumber = 0,
    notificationMessages = [];
  let totalExpiredDrugs = 0;
  let expiredTypes = props.expiredDrugs.length;
  let totalPendigDrugs = 0;
  let pendingTypes = props.storeOrders.length;
  let totalRequestedDrugs = 0;
  let requestTypes = props.stockRequests.length;

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
  };
  countNotificaitonNumber();

  if (notificationNumber == 0)
    return (
      <div className="notificaton_content">
        <h1 className="no_data_header">Notification stack is empty </h1>;
      </div>
    );
  if (notificationNumber > 0)
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
};
