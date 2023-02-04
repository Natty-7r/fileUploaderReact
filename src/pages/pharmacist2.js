import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/slide.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { user } from "../constants/images";
import Dashboard from "../components/dashboard";

// const baseUrl = "http://localhost:8080/coordinator";
const baseUrl = "http://localhost:8080/pharmacist";

const DrugList = function (props) {
  const expireDate = new Date(props.drug.expireDate);
  const expired = expireDate < new Date();

  return (
    <div
      className={`lists ${expired ? "expired" : ""}  ${
        props.type == "pending" ? "pending" : ""
      }`}>
      <p className="list list_name list-no">{props.index + 1}</p>
      <p className="list list_name list-name">{props.drug.name} </p>
      <p className="list list_name list-price">{props.drug.price} birr </p>
      <p className="list list_name list-amount">{props.drug.amount} </p>
      <p className="list list_name list-e_date ">
        {new Date(props.drug.expireDate).toLocaleDateString()}{" "}
      </p>
      <p className="list list_name list-supplier">{props.drug.supplier}</p>
      <p className="list list_name list-s_date">
        {new Date(props.drug.suppliedDate).toLocaleDateString()}{" "}
      </p>
      <p className="list list_name list-btn ">
        {
          <ListButton
            index={props.index}
            drugId={props.drug._id}
            expired={expired}
            type={props.type}
            handleSell={props.handleSell}
            handleSetPrice={props.handleSetPrice}
            handleDiscard={props.handleDiscard}
          />
        }
      </p>
    </div>
  );
};
const ListButton = (props) => {
  const index = props.index;
  const handleSell = () => {
    props.handleSell(index);
  };
  const handleSetPrice = () => {
    props.handleSetPrice(index);
  };
  const handleDiscard = () => {
    props.handleDiscard(index, props.drugId);
  };
  if (props.type == "pending") {
    return <p className=" list_btn list_btn-name">new</p>;
  }
  if (props.expired) {
    return (
      <button
        className=" list_btn list_btn-discard "
        onClick={handleDiscard}>
        discard drug
      </button>
    );
  }

  if (!props.expired) {
    return (
      <button
        className=" list_btn list_btn-update "
        onClick={handleSell}>
        sell drug
      </button>
    );
  }
};

const SellDrug = (props) => {
  let amount = props?.selecteDrug?.amount;
  const drugId = props?.selecteDrug?._id;
  let amountToSell;
  const [errorMsg, setErrorMsg] = useState(false);

  const getAmount = (e) => {
    amountToSell = e.target.value;
  };
  const handleSellDone = () => {
    if (amountToSell > amount) {
      setErrorMsg(true);
      setTimeout(() => {
        setErrorMsg(false);
      }, 2000);
    } else {
      props.handleSellDone(amount - amountToSell, drugId);
    }
  };
  const handleCloseSell = () => {
    props.setEditing(false);
  };
  if (!props.editing) return null;
  if (props.editing)
    return (
      <div className="update_druginfo">
        <button
          className="close_check"
          onClick={handleCloseSell}>
          {" "}
          X
        </button>
        {errorMsg ? (
          <div className="sell_error">
            <p>No sufficient drug</p>
            <button className="btn">send request</button>
          </div>
        ) : null}

        <p className="drug_name">{"diclone"}</p>

        <div className="info">
          <label htmlFor="">amount</label>
          <input
            type="text"
            className="info_input input_amount"
            onChange={getAmount}
          />
        </div>
        <button
          className="btn btn_updateInfo"
          onClick={handleSellDone}>
          sell drug{" "}
        </button>
      </div>
    );
};

const NotificationSlide = (props) => {
  let notificationNumber = 0,
    notificationMessages = [];
  let totalExpiredDrugs = 0;
  let expiredTypes = props.expiredDrugs.length;
  let totalPendigDrugs = 0;
  let pendingTypes = props.stockOrders.length;

  const countNotificaitonNumber = () => {
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
          />
        ))}
      </div>
    );
};
const Notification = (props) => {
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
      />
      <NotificationButton
        handleCheckExpiration={props.handleCheckExpiration}
        handleRegistration={props.handleRegistration}
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
};

export default (props) => {
  let totalDrugs = 0,
    totalAvailbleDrugs = 0,
    totalExpiredDrugs = 0,
    totalPendingDrugs = 0;
  let expiredSummary = "";
  const [notificationNum, setNotificationNum] = useState(0);
  const [notificationMessages, setNotificationMessages] = useState([]);

  const [editing, setEditing] = useState(false);
  const [editingType, setEditingType] = useState("");

  const [checkingExpiration, setCheckingExpiration] = useState(false);
  const [summary, setSummary] = useState([0, 0, 0, 0]);
  const [selecteDrug, setSelectedDrug] = useState();
  const [selectedIndex, setSelectedIndex] = useState();

  const [availbleStockDrugs, setAvailbleStockDrugs] = useState([]);
  const [stockOrders, setStockOrders] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("availableStock"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/drugs`).then((response) => {
      setAvailbleStockDrugs(response.data.drugs.availbleStockDrugs);
      setStockOrders(response.data.drugs.stockOrders);
      setExpiredDrugs(response.data.drugs.expiredDrugs);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [availbleStockDrugs, expiredDrugs, stockOrders]);

  const handleSell = (index) => {
    setEditing(true);
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleSellDone = (newAmount, drugId) => {
    selecteDrug.amount = newAmount;
    availbleStockDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
    if (newAmount != 0) {
      axios
        .patch(`${baseUrl}/drug`, { drugId, newAmount })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    }
    if (newAmount == 0) {
      // if all sold discard the drug
      handleDiscard(selecteDrug, drugId);
    }
  };

  const handleDiscard = (indexSelected, drugId) => {
    expiredDrugs.splice(indexSelected, 1);
    setExpiredDrugs(expiredDrugs);
    setDrugsLength(availbleStockDrugs.length);
    createSummary();

    axios
      .delete(`${baseUrl}/drug/${drugId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
    if (expiredDrugs.length == 0) setCheckingExpiration(false);
  };
  const handleDiscardAll = () => {
    setExpiredDrugs([]);
    createSummary();
    setCheckingExpiration(false);
    let drugIds = "";
    expiredDrugs.forEach((expiredDrug) => {
      drugIds += ":" + expiredDrug._id;
    });
    axios
      .delete(`${baseUrl}/drugs/${drugIds}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const getSelectedDrug = (index) => {
    if (currentSlide == "availableStock") return availbleStockDrugs[index];
    if (currentSlide == "expired") return expiredDrugs[index];
    if (currentSlide == "register") return stockOrders[index];
  };

  const createSummary = () => {
    countNotificaitonNumber();
    availbleStockDrugs.forEach((drug) => {
      totalAvailbleDrugs += drug.amount;
    });
    expiredDrugs.forEach((drug) => {
      totalExpiredDrugs += drug.amount;
    });

    stockOrders.forEach((drug) => {
      totalPendingDrugs += drug.amount;
    });
    totalDrugs += totalAvailbleDrugs + totalExpiredDrugs;

    setSummary([
      totalDrugs,
      totalAvailbleDrugs,
      totalExpiredDrugs,
      totalPendingDrugs,
    ]);
  };

  const seeAvailableDrugsInStore = () => {
    setCurrentSlide("availableStore");
  };
  const seeAvailableDrugsInStock = () => {
    setCurrentSlide("availableStock");
  };
  const handleCheckExpiration = () => {
    setCurrentSlide("expired");
  };
  const handleSeeNotification = () => {
    setCurrentSlide("notification");
  };
  const handleSendRequest = () => {
    setCurrentSlide("request");
  };

  const handleRegistration = () => {
    setCurrentSlide("register");
  };

  const handleRegistrationDone = () => {
    const existingDrugs = [];
    const newDrugs = [];

    availbleStockDrugs.forEach((availbleDrug) => {
      stockOrders.forEach((pendingDrug, pendingIndex) => {
        // updai=ting existing ones
        if (availbleDrug.name.trim() == pendingDrug.name.trim()) {
          availbleDrug.amount += pendingDrug.amount;
          availbleDrug.price = pendingDrug.price;
          stockOrders.splice(pendingIndex, 1);
        }
      });
    });
    const updatedDrugs = availbleStockDrugs.concat(stockOrders);
    setAvailbleStockDrugs(updatedDrugs); // adding new drugs
    setStockOrders([]);

    setCurrentSlide("availableStock");
    axios
      .post(`${baseUrl}/drugs/register`, { newDrugs: updatedDrugs })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };
  const RequestOrderResult = (props) => {
    const handleRemove = () => {
      props.handleRemove(props.index);
    };
    if (props.type == "order")
      return (
        <div className="request_result">
          <p className="request_name">
            <span>name</span> {props.requestOrder.name}
          </p>
          <p className="request_amount">
            <span>amount</span> {props.requestOrder.amount}
          </p>
          <button
            className="request_btn request_btn-remove"
            onClick={handleRemove}>
            cancel sending
          </button>
        </div>
      );
    if (props.type == "request")
      return (
        <div className="request_result">
          <p className="request_name">
            <span>name</span> {props.requestOrder.name}
          </p>
          <p className="request_amount">
            <span>amount</span> {props.requestOrder.amount}
          </p>
          <button
            className="request_btn request_btn-remove"
            onClick={handleRemove}>
            cancel request
          </button>
        </div>
      );
  };

  const RequestResultContent = (props) => {
    if (props.requestResults.length == 0) return null;
    else
      return (
        <div className="request_main">
          <div className="request_results">
            {props.requestResults.map((request, index) => (
              <RequestOrderResult
                index={index}
                key={index}
                requestOrder={request}
                type={"request"}
                handleRemove={props.handleRemove}
              />
            ))}
          </div>
          <button
            className="btn btn_request-send"
            onClick={props.handleSendRequestDone}>
            send request
          </button>
        </div>
      );
  };

  const countNotificaitonNumber = () => {
    let notificationNumber = 0;
    let notificationMessagesToadd = [];
    if (expiredDrugs.length > 0) {
      notificationNumber++;
      notificationMessages.push("expiration");
    }
    if (stockOrders.length > 0) {
      notificationNumber++;
      notificationMessages.push("new");
    }
    setNotificationNum(notificationNumber);
    setNotificationMessages(notificationMessagesToadd);
  };

  const SlideContent = (props) => {
    const [requestResults, setRequests] = useState([]);
    const [errorMsg, setErrorMsg] = useState(false);
    const [requstNumber, setRequstNumber] = useState(0);

    const handleAddRequest = () => {
      let requestExist = false;
      let name = document.querySelector(".input_name-request").value;
      let amount = +document.querySelector(".input_amount-request").value;
      const currentRequests = requestResults;
      if (name.length < 3) {
        document.querySelector(".request_error").textContent =
          "Please enter valid drug Name  !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 1000);
        return;
      } else if (amount == "") {
        document.querySelector(".request_error").textContent =
          "Please enter valid drug amount !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 1000);
        return;
      } else if (!Number.isInteger(amount)) {
        document.querySelector(".request_error").textContent =
          "Please enter valid drug amount !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 1000);
        return;
      }

      currentRequests.forEach((currentRequest, index) => {
        // checking if it is order already
        if (currentRequest.name.trim() == name.trim()) {
          requestExist = true;
          currentRequest.amount += amount;
        }
      });

      if (requestExist) {
        let requestNumberNOw = requstNumber;
        setRequstNumber(++requestNumberNOw);
      }
      if (!requestExist) {
        currentRequests.push({ name, amount });
        setRequests(currentRequests);
        setRequstNumber(currentRequests.length);
      }

      document.querySelector(".input_name-request").value = "";
      document.querySelector(".input_amount-request").value = "";
    };
    const handleRemoveRequest = (index) => {
      const currentRequests = requestResults;
      currentRequests.splice(index, 1);
      setRequests(currentRequests);
      setRequstNumber(currentRequests.length);
    };
    const handleSendRequestDone = () => {
      setRequests([]);
      setRequstNumber(0);
      axios
        .post(`${baseUrl}/drugs/request`, {
          stockRequest: requestResults,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };
    if (currentSlide == "availableStock")
      return (
        <div className="drguList">
          <div className="list_header">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">supllied date </p>
            <p className="list list_name"> </p>
          </div>
          <div
            className={`list_body ${
              editing || checkingExpiration ? "blurred" : ""
            }`}>
            {availbleStockDrugs.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the stock!
              </h1>
            ) : (
              availbleStockDrugs.map((drug, index) => (
                <DrugList
                  drug={drug}
                  index={index}
                  key={index}
                  handleSell={handleSell}
                  handleDiscard={handleDiscard}
                />
              ))
            )}
          </div>
        </div>
      );
    if (currentSlide == "register") {
      if (stockOrders.length == 0)
        return (
          <div className="drguList registration_list">
            <h1 className="slide_header">Drug Registration</h1>
            <div
              className={`list_body ${
                editing || checkingExpiration ? "blurred" : ""
              }`}>
              <h1 className="no_data_header"> There is No unRegistred Drug</h1>
            </div>
          </div>
        );
      return (
        <div className="drguList registration_list">
          <div className="list_header">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">supllied date </p>
            <p className="list list_name"> </p>
          </div>
          <div
            className={`list_body ${
              editing || checkingExpiration ? "blurred" : ""
            }`}>
            {stockOrders.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the stock!
              </h1>
            ) : (
              stockOrders.map((drug, index) => (
                <DrugList
                  drug={drug}
                  index={index}
                  key={index}
                  type={"pending"}
                  handleDiscard={handleDiscard}
                />
              ))
            )}
          </div>
          <button
            className="btn btn_register"
            onClick={handleRegistrationDone}>
            register all{" "}
          </button>
        </div>
      );
    }
    if (currentSlide == "expired")
      return (
        <div className="drguList">
          <div className="list_header list_header-expired">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">supllied date </p>
            <p className="list list_name list_name_discardAll">
              {" "}
              <button
                className="btn expired_list_btn expired_list_btn-discardAll"
                onClick={handleDiscardAll}>
                discard All{" "}
              </button>{" "}
            </p>
          </div>
          <div
            className={`list_body ${
              editing || checkingExpiration ? "blurred" : ""
            }`}>
            {expiredDrugs.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the store !
              </h1>
            ) : (
              expiredDrugs.map((drug, index) => (
                <DrugList
                  drug={drug}
                  index={index}
                  key={index}
                  handleDiscard={handleDiscard}
                />
              ))
            )}
          </div>
        </div>
      );
    if (currentSlide == "request")
      return (
        <div className="request_slide">
          <h1 className="slide_header">send drug request</h1>
          <div className="request_content">
            <div className="request_form">
              <div
                className={`request_error ${
                  errorMsg ? "request_error-visible" : ""
                }`}>
                hey bad inputs man{" "}
              </div>
              <div className="request_info">
                <label htmlFor="">name </label>
                <input
                  type="text"
                  className="info_input input_name input_name-request"
                  // onChange={handleAddName}
                />
              </div>
              <div className="request_info">
                <label htmlFor="">amount</label>
                <input
                  type="text"
                  className="info_input input_amount  input_amount-request"
                  // onChange={handleAddAmount}
                />
              </div>
              <button
                className="btn btn_request-add"
                onClick={handleAddRequest}>
                + add{" "}
              </button>
            </div>
            <RequestResultContent
              requestResults={requestResults}
              handleRemove={handleRemoveRequest}
              handleSendRequestDone={handleSendRequestDone}
            />
          </div>
        </div>
      );
    if (currentSlide == "notification")
      return (
        <div className="notification_slide">
          <h1 className="slide_header">notification</h1>
          <NotificationSlide
            expiredDrugs={expiredDrugs}
            totalExpiredDrugs={totalAvailbleDrugs}
            stockOrders={stockOrders}
            totalPendingDrugs={totalPendingDrugs}
            handleCheckExpiration={handleCheckExpiration}
            notificationNum={notificationNum}
            handleRegistration={handleRegistration}
          />
        </div>
      );
  };

  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        user="pharmacist"
        notificationNum={notificationNum}
        currentSlide={currentSlide}
        seeAvailableDrugsInStore={seeAvailableDrugsInStore}
        seeAvailableDrugsInStock={seeAvailableDrugsInStock}
        handleCheckExpiration={handleCheckExpiration}
        handleSeeNotification={handleSeeNotification}
        handleSendRequest={handleSendRequest}
        handleRegistration={handleRegistration}
      />
      <div className="main_page">
        <div className="overview">
          <div className="summary">
            <p className="summary_name">total drugs in stock </p>
            <p className="summary_value">{summary[0]}</p>
          </div>
          <div className="summary">
            <p className="summary_name">availbles drugs </p>
            <p className="summary_value">{summary[1]}</p>
          </div>
          <div className="summary">
            <p className="summary_name">expired drugs </p>
            <p className="summary_value">{summary[2]}</p>
          </div>
          <div className="summary">
            <p className="summary_name">pending drugs </p>
            <p className="summary_value">{summary[3]}</p>
          </div>
        </div>
        <div className="druglist">
          <SellDrug
            editing={editing}
            editingType={editingType}
            setEditing={setEditing}
            handleSellDone={handleSellDone}
            selecteDrug={selecteDrug}
          />

          <div className="page_slide">
            <SlideContent notificationNum={notificationNum} />
          </div>
        </div>
      </div>
    </div>
  );
};
