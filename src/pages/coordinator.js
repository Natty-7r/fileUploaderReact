import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/slide.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import NotificationSlide from "../components/notificationSlide";
import DrugList from "../components/druglist";
import Overview from "../components/overview";
import UpdateDrugInfo from "../components/updateSetInfo";

const baseUrl = "http://localhost:8080/coordinator";

export default (props) => {
  let totalDrugs = 0,
    totalAvailbleDrugsInStore = 0,
    totalAvailbleDrugsInStock = 0,
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
  const [slideChange, countSlideChange] = useState(1);

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("availableStore"); // to track the the dashboard menu and slide

  useEffect(() => {
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
  }, [
    availbleDrugs,
    expiredDrugs,
    storeOrders,
    stockRequests,
    availbleStockDrugs,
  ]);

  const handleUpdate = (index) => {
    setEditing(true);
    setEditingType("update");
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleUpdateDone = (newPrice, newAmount, drugCode) => {
    selecteDrug.price = +newPrice;
    selecteDrug.amount = +newAmount;
    availbleDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
    createSummary();

    axios
      .patch(`${baseUrl}/drug/`, {
        drugCode,
        newPrice,
        newAmount,
        currentSlide,
      })
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

  const handleDiscard = (indexSelected, drugCode) => {
    expiredDrugs.splice(indexSelected, 1);
    setExpiredDrugs(expiredDrugs);
    setDrugsLength(availbleDrugs.length);
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
    if (currentSlide == "availableStore") return availbleDrugs[index];
    if (currentSlide == "availableStock") return availbleStockDrugs[index];
    if (currentSlide == "expired") return expiredDrugs[index];
    if (currentSlide == "register") return storeOrders[index];
  };

  const createSummary = () => {
    countNotificaitonNumber();
    availbleDrugs.forEach((drug) => {
      totalAvailbleDrugsInStore += drug.amount;
    });
    availbleStockDrugs.forEach((drug) => {
      totalAvailbleDrugsInStock += drug.amount;
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
    totalDrugs += totalAvailbleDrugsInStore + totalExpiredDrugs;

    setSummary([
      totalDrugs,
      totalAvailbleDrugsInStock,
      totalExpiredDrugs,
      totalPendingDrugs,
      totalStockRequest,
    ]);
  };

  const seeAvailableDrugsInStore = () => {
    let slideNumber = slideChange;
    setCurrentSlide("availableStore");
    countSlideChange(++slideNumber);
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
        if (availbleDrug.drugCode == pendingDrug.drugCode) {
          availbleDrug.amount += pendingDrug.amount;
          availbleDrug.price = pendingDrug.price;
          availbleDrug.name = pendingDrug.name;
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
      console.log("cc");
      console.log(props.index);
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
    let requestedDrugs = []; // to fetch the drugs out of the request
    stockRequests.forEach((stockRequest) => {
      stockRequest.requestedDrugs.forEach((drug) => {
        drug.date = stockRequest.requestDate;
        requestedDrugs.push(drug);
      });
    });

    const StockRequest = (props) => {
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
            <span>date: </span>{" "}
            {new Date(props.stockRequest.date).toLocaleDateString()}
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
      console.log(drugOrder);
      if (!drugAvailable) {
        // if drug did not match
        document.querySelector(".request_error").textContent =
          "No Drug is Available with this name is the store !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      } else if (amount == "") {
        // if the amount entered is not number
        document.querySelector(".request_error").textContent =
          "Please Enter Valid Amount  !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      } else if (!Number.isInteger(+amount)) {
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
        });
      });
      const totalStoreDrugs = availbleDrugs.concat(expiredDrugs);

      setStockOrders([]);
      createSummary();

      axios
        .post(`${baseUrl}/drugs/order`, {
          availbleDrugs: totalStoreDrugs,
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
      } else if (amount == "") {
        // if the amount entered is not number
        document.querySelector(".request_error").textContent =
          "Please Enter Valid Amount  !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
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
      let orderNumber = orderedNumber;
      setOrderedNumber(--orderNumber);
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

    if (currentSlide == "availableStore") {
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
                No drug was found in the store!
              </h1>
            ) : (
              availbleDrugs.map((drug, index) => (
                <DrugList
                  drug={drug}
                  index={index}
                  hasLastCol={true}
                  key={index}
                  handleUpdate={handleUpdate}
                  handleDiscard={handleDiscard}
                />
              ))
            )}
          </div>
        </div>
      );
    }
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
                  hasLastCol={true}
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
                  hasLastCol={true}
                  type={"pendingSet"}
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
              {expiredDrugs.length != 0 ? (
                <button
                  className="btn expired_list_btn expired_list_btn-discardAll"
                  onClick={handleDiscardAll}>
                  discard All{" "}
                </button>
              ) : null}
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
                  hasLastCol={true}
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
                  {requestedDrugs.map((requestedDrug, index) => (
                    <StockRequest
                      stockRequest={requestedDrug}
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
              type=""
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
            user="coordinator"
            expiredDrugs={expiredDrugs}
            totalExpiredDrugs={totalExpiredDrugs}
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
        username={props.username}
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
        <Overview
          user="coordinator"
          summary={summary}
          stockRequest={stockRequests}
        />

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
