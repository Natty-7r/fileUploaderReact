// import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/supplier.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { user } from "../constants/images";
import Dashboard from "../components/dashboard";
import DrugList from "../components/pharCoordComponents/druglist";
import NotificationSlide from "../components/pharCoordComponents/notificationSlide";
import Overview from "../components/pharCoordComponents/overview";

const baseUrl = "http://localhost:8080/supplier";

const SellDrug = (props) => {
  let amount = props?.selecteDrug?.amount;
  const drugCode = props?.selecteDrug?.drugCode;
  let amountToSell;
  const [errorType, setErrorType] = useState(0);
  const [errorMsgContent, setErrorMsgContent] = useState("");

  const getAmount = (e) => {
    amountToSell = e.target.value.trim();
  };
  amountToSell = document.querySelector(".input_amount-sell")?.value;
  const handleSellDone = () => {
    console.log(amountToSell);

    if (amountToSell == undefined) {
      setErrorMsgContent("Invalid  amount ");
      setErrorType(1);
      setTimeout(() => {
        setErrorType(0);
      }, 2000);
      return;
    } else if (!Number.isInteger(+amountToSell)) {
      setErrorMsgContent("Invalid  amount ");
      setErrorType(1);
      setTimeout(() => {
        setErrorType(0);
      }, 2000);
      return;
    } else if (amountToSell > amount) {
      setErrorMsgContent("Insufficent amount ");
      setErrorType(2);
      setTimeout(() => {
        setErrorType(0);
      }, 2000);
    } else {
      props.handleSellDone(amount - amountToSell, drugCode);
    }
  };
  const handleCloseSell = () => {
    props.setEditing(false);
  };
  const handleSendRequest = () => {
    handleCloseSell();
    props.handleSendRequest();
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
        {errorType != 0 ? (
          <div className="sell_error">
            <p>{errorMsgContent}</p>
            {errorType == 2 ? (
              <button
                onClick={handleSendRequest}
                className="btn">
                send request
              </button>
            ) : null}
          </div>
        ) : null}

        <p className="drug_name">{"diclone"}</p>

        <div className="info">
          <label htmlFor="">amount</label>
          <input
            type="text"
            className="info_input input_amount  input_amount-sell"
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
  const [orders, setOrders] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("availableStock"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/index`).then((response) => {
      console.log(response);
      // setAvailbleStockDrugs(response.data.drugs.availbleStockDrugs);
      // setStockOrders(response.data.drugs.stockOrders);
      // setExpiredDrugs(response.data.drugs.expiredDrugs);
      setOrders(response.data.drugs.orders);
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
  const handleSellDone = (newAmount, drugCode) => {
    selecteDrug.amount = newAmount;
    availbleStockDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
    if (newAmount != 0) {
      axios
        .patch(`${baseUrl}/drug`, { drugCode, newAmount })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    }
    if (newAmount == 0) {
      // if all sold discard the drug
      handleDiscard(selecteDrug, drugCode);
    }
  };

  const handleDiscard = (indexSelected, drugCode) => {
    expiredDrugs.splice(indexSelected, 1);
    setExpiredDrugs(expiredDrugs);
    setDrugsLength(availbleStockDrugs.length);
    createSummary();

    axios
      .delete(`${baseUrl}/drug/${drugCode}`)
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
    let drugCodes = "";
    expiredDrugs.forEach((expiredDrug) => {
      drugCodes += ":" + expiredDrug.drugCode;
    });
    axios
      .delete(`${baseUrl}/drugs/${drugCodes}`)
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
    let newDrugs = [];

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
    newDrugs = updatedDrugs.concat(expiredDrugs);
    setAvailbleStockDrugs(updatedDrugs); // adding new drugs
    setStockOrders([]);

    setCurrentSlide("availableStock");
    axios
      .post(`${baseUrl}/drugs/register`, { newDrugs: newDrugs })
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
        <div className="orders">
          <h1 className="orders_header">drugs order</h1>
          <div className="orders_main">
            <div className="order">
              <div className="order_left">
                <div className="order_header">order one </div>
                <p className="order_content ">
                  <span className="order_content_value order_content_value-type">
                    {12}
                  </span>{" "}
                  types type of drugs{" "}
                </p>
                <p className="order_content ">
                  {" "}
                  <span className="order_content_value order_content_value-type">
                    {" "}
                    {12}
                  </span>{" "}
                  total drugs 
                </p>
                <button className=" btn_order btn_order-detail">detail</button>
              </div>
              <div className="order_right">
                <p className="order_date">12/12/12</p>
                <button className=" btn_order btn_order-accept">accept</button>
                <button className=" btn_order btn_order-accept">reject</button>
              </div>
            </div>
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
                  hasLastCol={true}
                  key={index}
                  type={"pendingAccept"}
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
  };

  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        user="supplier"
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
        <div className="druglist">
          <SellDrug
            handleSendRequest={handleSendRequest}
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
