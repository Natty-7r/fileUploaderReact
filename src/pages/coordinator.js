import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/slide.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { user } from "../constants/images";
import Dashboard from "../components/dashboard";

const baseUrl = "http://localhost:8080/coordinator";

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
            handleUpdate={props.handleUpdate}
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
  const handleUpdate = () => {
    props.handleUpdate(index);
  };
  const handleSetPrice = () => {
    props.handleSetPrice(index);
  };
  const handleDiscard = () => {
    props.handleDiscard(index, props.drugId);
  };
  if (props.type == "pending") {
    return (
      <button
        className=" list_btn list_btn-discard "
        onClick={handleSetPrice}>
        set price
      </button>
    );
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
        onClick={handleUpdate}>
        update info
      </button>
    );
  }
};

const UpdateDrugInfo = (props) => {
  let amount = props?.selecteDrug?.amount;
  let price = props?.selecteDrug?.price;
  const drugId = props?.selecteDrug?._id;
  const updatePrice = (e) => {
    price = e.target.value;
  };
  const updateAmount = (e) => {
    amount = e.target.value;
  };
  const handleUpdateDone = () => {
    props.handleUpdateDone(price, amount, drugId);
  };
  const handleSetPriceDone = () => {
    props.handleSetPriceDone(price, drugId);
  };
  const handleCloseUpdating = () => {
    props.setEditing(false);
  };
  if (!props.editing) return null;
  if (props.editing)
    if (props.editingType == "update")
      return (
        <div className="update_druginfo">
          <button
            className="close_check"
            onClick={handleCloseUpdating}>
            {" "}
            X
          </button>
          <p className="drug_name">{"diclone"}</p>
          <div className="info">
            <label htmlFor="">price</label>
            <input
              type="text"
              className="info_input input_price"
              defaultValue={price}
              onChange={updatePrice}
            />
          </div>
          <div className="info">
            <label htmlFor="">amount</label>
            <input
              type="text"
              className="info_input input_amount"
              onChange={updateAmount}
              defaultValue={amount}
            />
          </div>
          <button
            className="btn btn_updateInfo"
            onClick={handleUpdateDone}>
            update{" "}
          </button>
        </div>
      );
  if (props.editingType == "set")
    return (
      <div className="update_druginfo">
        <button
          className="close_check"
          onClick={handleCloseUpdating}>
          {" "}
          X
        </button>
        <p className="drug_name">{"diclone"}</p>
        <div className="info">
          <label htmlFor="">price</label>
          <input
            type="text"
            className="info_input input_price"
            defaultValue={price}
            onChange={updatePrice}
          />
        </div>

        <button
          className="btn btn_updateInfo"
          onClick={handleSetPriceDone}>
          set{" "}
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
  let pendingTypes = props.storeOrders.length;
  let totalRequestedDrugs = 0;
  let requestTypes = props.stockRequests.length;

  const countNotificaitonNumber = () => {
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
  let totalDrugs = 0,
    totalAvailbleDrugs = 0,
    totalExpiredDrugs = 0,
    totalPendingDrugs = 0,
    totalStockRequest = 0;
  let expiredSummary = "";
  const [notificationNum, setNotificationNum] = useState(0);
  const [notificationMessages, setNotificationMessages] = useState([]);

  const [editing, setEditing] = useState(false);
  const [editingType, setEditingType] = useState("");

  const [checkingExpiration, setCheckingExpiration] = useState(false);
  const [summary, setSummary] = useState([0, 0, 0, 0]);
  const [selecteDrug, setSelectedDrug] = useState();
  const [selectedIndex, setSelectedIndex] = useState();

  const [availbleDrugs, setAvailbleDrugs] = useState([]);
  const [availbleStockDrugs, setAvailbleStockDrugs] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]);
  const [stockRequests, setStockRequest] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("availableStore"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/drugs`).then((response) => {
      console.log(response);
      setAvailbleDrugs(response.data.drugs.availbleStoreDrugs);
      setAvailbleStockDrugs(response.data.drugs.availbleStockDrugs);
      setStoreOrders(response.data.drugs.storeOrders);
      setStockRequest(response.data.drugs.stockRequests);
      setExpiredDrugs(response.data.drugs.expiredDrugs);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [availbleDrugs, expiredDrugs, storeOrders, stockRequests]);

  const handleUpdate = (index) => {
    setEditing(true);
    setEditingType("update");
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleUpdateDone = (newPrice, newAmount, drugId) => {
    selecteDrug.price = +newPrice;
    selecteDrug.amount = +newAmount;
    availbleDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
    createSummary();
    console.log(selecteDrug);

    axios
      .patch(`${baseUrl}/drug/`, { drugId, newPrice, newAmount, currentSlide })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const handleSetPrice = (index) => {
    setEditingType("set");
    setEditing(true);
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleSetPriceDone = (newPrice) => {
    selecteDrug.price = newPrice;
    storeOrders[selectedIndex] = selecteDrug;
    setEditing(false);
  };

  const handleDiscard = (indexSelected, drugId) => {
    expiredDrugs.splice(indexSelected, 1);
    setExpiredDrugs(expiredDrugs);
    setDrugsLength(availbleDrugs.length);
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
    if (currentSlide == "availableStore") return availbleDrugs[index];
    if (currentSlide == "availableStock") return availbleStockDrugs[index];
    if (currentSlide == "expired") return expiredDrugs[index];
    if (currentSlide == "register") return storeOrders[index];
  };

  const createSummary = () => {
    countNotificaitonNumber();
    availbleDrugs.forEach((drug) => {
      totalAvailbleDrugs += drug.amount;
    });
    expiredDrugs.forEach((drug) => {
      totalExpiredDrugs += drug.amount;
    });

    storeOrders.forEach((drug) => {
      totalPendingDrugs += drug.amount;
    });
    stockRequests.forEach((drug) => {
      totalStockRequest += drug.amount;
    });
    totalDrugs += totalAvailbleDrugs + totalExpiredDrugs;

    setSummary([
      totalDrugs,
      totalAvailbleDrugs,
      totalExpiredDrugs,
      totalPendingDrugs,
      totalStockRequest,
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
  const handleAddToStock = () => {
    setCurrentSlide("addtostock");
  };
  const handleRegistration = () => {
    setCurrentSlide("register");
  };

  const handleRegistrationDone = () => {
    const existingDrugs = [];
    const newDrugs = [];

    availbleDrugs.forEach((availbleDrug) => {
      storeOrders.forEach((pendingDrug, pendingIndex) => {
        // updai=ting existing ones
        if (availbleDrug.name.trim() == pendingDrug.name.trim()) {
          availbleDrug.amount += pendingDrug.amount;
          availbleDrug.price = pendingDrug.price;
          storeOrders.splice(pendingIndex, 1);
        }
      });
    });
    const updatedDrugs = availbleDrugs.concat(storeOrders);
    setAvailbleDrugs(updatedDrugs); // adding new drugs
    setStoreOrders([]);

    setCurrentSlide("availableStore");
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
  const StockOrderResultContent = (props) => {
    if (props.stockOrders.length == 0) return null;
    else
      return (
        <div className="request_main">
          <div className="request_results">
            {props.stockOrders.map((order, index) => (
              <RequestOrderResult
                index={index}
                key={index}
                type={"order"}
                requestOrder={order}
                handleRemove={props.handleRemove}
              />
            ))}
          </div>
          <button
            className="btn btn_request-send"
            onClick={props.handleAddToStockDone}>
            Add to stock
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
    if (storeOrders.length > 0) {
      notificationNumber++;
      notificationMessages.push("new");
    }
    if (stockRequests.length > 0) {
      notificationNumber++;
      notificationMessages.push("request");
    }
    setNotificationNum(notificationNumber);
    setNotificationMessages(notificationMessagesToadd);
  };

  const SlideContent = (props) => {
    const [requestResults, setRequests] = useState([]);
    const [stockOrders, setStockOrders] = useState([]);
    const [orderedNumber, setOrderedNumber] = useState(0);
    const [errorMsg, setErrorMsg] = useState(false);
    const [requstNumber, setRequstNumber] = useState(0);
    const [stockRequestSize, setStockRequestSize] = useState(
      stockRequests.length
    );
    let stockRequestExits = stockRequestSize > 0 ? true : false;

    const StockRequest = (props) => {
      const date = new Date(props.stockRequest.requestDate);
      let dateFormatted = date.toLocaleDateString();

      return (
        <div className="requested_drug">
          <p className="request_name">
            <span>{props.index + 1} </span>
          </p>
          <p className="request_name">
            <span>name: </span> {props.stockRequest.name}
          </p>
          <p className="request_amount">
            <span>amount: </span> {props.stockRequest.amount}
          </p>
          <p className="request_name">
            <span>date: </span> {dateFormatted}
          </p>
        </div>
      );
    };

    const handleGoToAddToStock = () => {
      props.handleAddToStock();
    };
    const handleAddToStock = () => {
      let name = document.querySelector(".input_name-request").value;
      let amount = +document.querySelector(".input_amount-request").value;
      const currentOrders = stockOrders;
      let drugOrder = undefined;
      let amountDeficit = 0; // if drug was added to order the previous amount
      let drugOrderIndex = null;
      let drugAvailable = false;
      let drugInOrder = false;

      currentOrders.forEach((currentOrder, index) => {
        // checking if it is order already
        if (currentOrder.name.trim() == name.trim()) {
          amountDeficit = currentOrder.amount;
          drugOrderIndex = index;
          drugInOrder = true;
        }
      });

      availbleDrugs.forEach((drug) => {
        // matching order drug name with database
        if (drug.name.trim() == name.trim()) {
          drugAvailable = true;
          drugOrder = Object.assign({}, drug);
        }
      });
      if (!drugAvailable) {
        // if drug did not match
        document.querySelector(".request_error").textContent =
          "No Drug is Available with this name is the store !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      } else if (!Number.isInteger(amount)) {
        // if the amount entered is not number
        document.querySelector(".request_error").textContent =
          "Please Enter Valid Amount  !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      } else if (amount + amountDeficit + 1 > drugOrder.amount) {
        //  if  the amount required is way more greater
        document.querySelector(
          ".request_error"
        ).textContent = `Insufficent amount of ${
          drugOrder.name
        } is store ,  maximum  amount is  ${
          drugOrder.amount - amountDeficit - 1
        }`;
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      }
      if (drugInOrder) {
        currentOrders[drugOrderIndex].amount += amount;
        setStockOrders(currentOrders);
        let orderNumber = orderedNumber;
        setOrderedNumber(++orderNumber);
      }
      if (!drugInOrder) {
        drugOrder.amount = amount;
        currentOrders.push(drugOrder);
        setStockOrders(stockOrders);
        let orderNumber = orderedNumber;
        setOrderedNumber(++orderNumber);
      }

      document.querySelector(".input_name-request").value = "";
      document.querySelector(".input_amount-request").value = "";
    };
    const handleAddToStockDone = () => {
      stockOrders.forEach((stockOrder) => {
        availbleDrugs.forEach((availbleDrug) => {
          if (stockOrder.name.trim() == availbleDrug.name.trim())
            availbleDrug.amount -= stockOrder.amount;
          delete stockOrder._id;
        });
      });

      setStockOrders([]);
      createSummary();

      axios
        .post(`${baseUrl}/drugs/order`, {
          availbleDrugs,
          stockOrders,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };
    const handleClearStockRequest = () => {
      setStockRequest([]);
      axios
        .delete(`${baseUrl}/request`, {})
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };

    const handleAddRequest = () => {
      let name = document.querySelector(".input_name-request").value;
      let amount = +document.querySelector(".input_amount-request").value;
      const currentRequests = requestResults;
      if (name.length < 3) {
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
      currentRequests.push({ name, amount });
      setRequests(currentRequests);
      setRequstNumber(currentRequests.length);

      document.querySelector(".input_name-request").value = "";
      document.querySelector(".input_amount-request").value = "";
    };
    const handleRemoveRequest = (index) => {
      const currentRequests = requestResults;
      currentRequests.splice(index, 1);
      setRequests(currentRequests);
      setRequstNumber(currentRequests.length);
    };
    const handleRemoveOrder = (index) => {
      const currentOrders = stockOrders;
      currentOrders.splice(index, 1);
      setStockOrders(currentOrders);
      setRequstNumber(currentOrders.length);
    };

    const handleSendRequestDone = () => {
      setRequests([]);
      setRequstNumber(0);
      axios
        .post(`${baseUrl}/drugs/request`, {
          storeRequest: requestResults,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };

    if (currentSlide == "availableStore")
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
            {availbleDrugs.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the stock!
              </h1>
            ) : (
              availbleDrugs.map((drug, index) => (
                <DrugList
                  drug={drug}
                  index={index}
                  key={index}
                  handleUpdate={handleUpdate}
                  handleDiscard={handleDiscard}
                />
              ))
            )}
          </div>
        </div>
      );
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
            {availbleDrugs.length == 0 ? (
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
                  handleUpdate={handleUpdate}
                  handleDiscard={handleDiscard}
                />
              ))
            )}
          </div>
        </div>
      );
    if (currentSlide == "register") {
      if (storeOrders.length == 0)
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
            {storeOrders.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the stock!
              </h1>
            ) : (
              storeOrders.map((drug, index) => (
                <DrugList
                  drug={drug}
                  index={index}
                  key={index}
                  type={"pending"}
                  handleUpdate={handleUpdate}
                  handleSetPrice={handleSetPrice}
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
                  handleUpdate={handleUpdate}
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
    if (currentSlide == "addtostock")
      return (
        <div className="request_slide">
          <h1 className="slide_header">add to stock </h1>
          <div className="request_content ">
            <div className="addToStock">
              <div
                className={`requested_drugs_card  ${
                  stockRequestExits ? "" : "requested_drugs_card-hidden"
                }`}>
                <div className="requested_drug_header">
                  <h1 className="requested_drug_header-title">
                    {" "}
                    request from stock
                  </h1>
                  <p>
                    {" "}
                    <button
                      className="btn btn_clear_requesst"
                      onClick={handleClearStockRequest}>
                      clear request
                    </button>
                  </p>
                </div>
                <div className="requested_drugs ">
                  {stockRequests.map((stockRequest, index) => (
                    <StockRequest
                      stockRequest={stockRequest}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <div
                className={`request_form  ${
                  stockRequestExits ? "" : "request_form-full"
                }`}>
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
                  onClick={handleAddToStock}>
                  + add{" "}
                </button>
              </div>
            </div>
            <StockOrderResultContent
              stockOrders={stockOrders}
              handleRemove={handleRemoveOrder}
              handleAddToStockDone={handleAddToStockDone}
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
            storeOrders={storeOrders}
            totalPendingDrugs={totalPendingDrugs}
            handleCheckExpiration={handleCheckExpiration}
            notificationNum={notificationNum}
            handleRegistration={handleRegistration}
            stockRequests={stockRequests}
            handleGoToAddToStock={handleGoToAddToStock}
          />
        </div>
      );
  };

  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        user="coordinator"
        notificationNum={notificationNum}
        currentSlide={currentSlide}
        seeAvailableDrugsInStore={seeAvailableDrugsInStore}
        seeAvailableDrugsInStock={seeAvailableDrugsInStock}
        handleCheckExpiration={handleCheckExpiration}
        handleSeeNotification={handleSeeNotification}
        handleSendRequest={handleSendRequest}
        handleAddToStock={handleAddToStock}
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
          {stockRequests ? (
            <div className="summary">
              <p className="summary_name">stock requests </p>
              <p className="summary_value">{summary[4]}</p>
            </div>
          ) : null}
        </div>
        <div className="druglist">
          <UpdateDrugInfo
            editing={editing}
            editingType={editingType}
            setEditing={setEditing}
            handleUpdateDone={handleUpdateDone}
            handleSetPriceDone={handleSetPriceDone}
            selecteDrug={selecteDrug}
          />

          <div className="page_slide">
            <SlideContent
              notificationNum={notificationNum}
              handleAddToStock={handleAddToStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
