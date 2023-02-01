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
  console.log(props);
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
  console.log(props);
  let notificationNumber = 0,
    notificationMessages = [];
  let totalExpiredDrugs = 0;
  let expiredTypes = props.expiredDrugs.length;
  let totalPendigDrugs = 0;
  let pendingTypes = props.pendingDrugs.length;

  const countNotificaitonNumber = () => {
    if (props.expiredDrugs.length > 0) {
      notificationNumber++;
      notificationMessages.push("expiration");
    }
    if (props.pendingDrugs.length > 0) {
      notificationNumber++;
      notificationMessages.push("new");
    }
    props.expiredDrugs.forEach((drug) => {
      totalExpiredDrugs += drug.amount;
    });
    props.pendingDrugs.forEach((drug) => {
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

  const [availbleDrugs, setAvailbleDrugs] = useState([]);
  const [pendingDrugs, setPendingDrugs] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [drugsInTable, setDrugsInTable] = useState();

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("addtostock"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/drugs`).then((response) => {
      setAvailbleDrugs(response.data.drugs.availbleDrugs);
      setPendingDrugs(response.data.drugs.storeOrders);
      setDrugsInTable(response.data.drugs.availbleDrugs);
      setExpiredDrugs(response.data.drugs.expiredDrugs);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [availbleDrugs, expiredDrugs, pendingDrugs]);

  const handleUpdate = (index) => {
    setEditing(true);
    setEditingType("update");
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleSetPrice = (index) => {
    setEditingType("set");
    setEditing(true);
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleSetPriceDone = (newPrice) => {
    selecteDrug.price = newPrice;
    pendingDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
  };
  const handleRegistrationDone = () => {
    const existingDrugs = [];
    const newDrugs = [];

    availbleDrugs.forEach((availbleDrug) => {
      pendingDrugs.forEach((pendingDrug, pendingIndex) => {
        // updai=ting existing ones
        if (availbleDrug.name.trim() == pendingDrug.name.trim()) {
          availbleDrug.amount += pendingDrug.amount;
          availbleDrug.price = pendingDrug.price;
          pendingDrugs.splice(pendingIndex, 1);
        }
      });
    });
    const updatedDrugs = availbleDrugs.concat(pendingDrugs);
    setAvailbleDrugs(updatedDrugs); // adding new drugs
    setPendingDrugs([]);

    setCurrentSlide("available");
    axios
      .post(`${baseUrl}/drugs/store`, { newDrugs: updatedDrugs })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const handleUpdateDone = (newPrice, newAmount, drugId) => {
    selecteDrug.price = newPrice;
    selecteDrug.amount = newAmount;
    availbleDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
    axios
      .patch(`${baseUrl}/drug/`, { drugId, newPrice, newAmount })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
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
    if (getExpiredDrugs().length == 0) setCheckingExpiration(false);
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

  const handleCheckExpiration = () => {
    // setCheckingExpiration(true);
    setCurrentSlide("expired");
  };
  const getSelectedDrug = (index) => {
    if (currentSlide == "available") return availbleDrugs[index];
    if (currentSlide == "expired") return expiredDrugs[index];
    if (currentSlide == "register") return pendingDrugs[index];
  };
  const getExpiredDrugs = () => {
    // const expiredDrugs = drugs.filter((drug, index) => {
    //   drug.index = index;
    //   const expireDate = new Date(drug.expireDate);
    //   return expireDate < new Date();
    // });
    return expiredDrugs;
  };
  const createSummary = () => {
    countNotificaitonNumber();
    availbleDrugs.forEach((drug) => {
      totalAvailbleDrugs += drug.amount;
    });
    expiredDrugs.forEach((drug) => {
      totalExpiredDrugs += drug.amount;
    });

    pendingDrugs.forEach((drug) => {
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

  const seeAllDrugs = () => {
    setDrugsInTable(availbleDrugs);
    setCurrentSlide("available");
  };
  const handleSeeNotification = () => {
    setDrugsInTable(availbleDrugs);
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

  const RequestOrderResult = (props) => {
    const handleRemove = () => {
      props.handleRemove(props.index);
    };
    if (props.type == "order")
      return (
        <div className="request_result">
          <p className="request_name">
            <span>name</span> {props.request.drug.name}
          </p>
          <p className="request_amount">
            <span>amount</span> {props.request.drug.amount}
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
            <span>name</span> {props.request.name}
          </p>
          <p className="request_amount">
            <span>amount</span> {props.request.amount}
          </p>
          <button
            className="request_btn request_btn-remove"
            onClick={handleRemove}>
            cancel request
          </button>
        </div>
      );
  };
  const StockOrderResult = (props) => {
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
                request={order}
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
                request={request}
                type={"reqeust"}
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
    if (pendingDrugs.length > 0) {
      notificationNumber++;
      notificationMessages.push("new");
    }
    setNotificationNum(notificationNumber);
    setNotificationMessages(notificationMessagesToadd);
  };
  const SlideContent = (props) => {
    const [requestResults, setRequests] = useState([]);
    const [stockOrders, setStockOrders] = useState([]);
    const [errorMsg, setErrorMsg] = useState(false);
    const [r, R] = useState(0);
    const handleAddToStock = () => {
      let name = document.querySelector(".input_name-request").value;
      let amount = +document.querySelector(".input_amount-request").value;
      const currentOrders = stockOrders;
      let drugFound = undefined;

      let drugAvailable = false;
      availbleDrugs.forEach((drug) => {
        if (drug.name.trim() == name.trim()) {
          drugAvailable = true;
          drugFound = drug;
        }
      });
      if (!drugAvailable) {
        document.querySelector(".request_error").textContent =
          "No Drug is Available with this name is the store !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      } else if (!Number.isInteger(amount)) {
        alert("ddd");
        document.querySelector(".request_error").textContent =
          "Please Enter Valid Amount  !";
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      } else if (amount + 1 > drugFound.amount) {
        document.querySelector(
          ".request_error"
        ).textContent = `Insufficent amount of ${
          drugFound.name
        } is store ,  maximum  amount is  ${drugFound.amount - 1}`;
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
        return;
      }
      drugFound.amount = amount;
      currentOrders.push({ drug: drugFound, from: "coordinator" });
      setStockOrders(currentOrders);
      R(currentOrders.length);

      document.querySelector(".input_name-request").value = "";
      document.querySelector(".input_amount-request").value = "";
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
      currentRequests.push({ name, amount, from: "coordinator" });
      setRequests(currentRequests);
      R(currentRequests.length);

      document.querySelector(".input_name-request").value = "";
      document.querySelector(".input_amount-request").value = "";
    };
    const handleRemoveRequest = (index) => {
      const currentRequests = requestResults;
      currentRequests.splice(index, 1);
      setRequests(currentRequests);
      R(currentRequests.length);
    };
    const handleRemoveOrder = (index) => {
      const currentOrders = stockOrders;
      currentOrders.splice(index, 1);
      setStockOrders(currentOrders);
      R(currentOrders.length);
    };

    const handleSendRequestDone = () => {
      setRequests([]);
      R(0);
      axios
        .post(`${baseUrl}/request`, {
          requests: requestResults,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };

    const handleAddToStockDone = () => {
      stockOrders.forEach((stockOrder) => {
        availbleDrugs.forEach((availbleDrug) => {
          alert(stockOrder.drug.amount);
          if (stockOrder.drug.name.trim() == availbleDrug.name.trim())
            availbleDrug.amount -= stockOrder.drug.amount;
        });
      });

      setStockOrders([]);
      createSummary();
      R(0);
      axios
        .post(`${baseUrl}/drugs/orders`, {
          availbleDrugs,
          stockOrders,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };

    if (currentSlide == "available")
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
    if (currentSlide == "register") {
      if (pendingDrugs.length == 0)
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
            {pendingDrugs.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the stock!
              </h1>
            ) : (
              pendingDrugs.map((drug, index) => (
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
                No drug was found in the stock!
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
                onClick={handleAddToStock}>
                + add{" "}
              </button>
            </div>
            <RequestResultContent
              requestResults={requestResults}
              handleRemove={handleRemoveRequest}
              handleSendRequestDone={handleSendRequestDone}
            />
            <StockOrderResult
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
            pendingDrugs={pendingDrugs}
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
        notificationNum={notificationNum}
        currentSlide={currentSlide}
        seeAllDrugs={seeAllDrugs}
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
            <SlideContent notificationNum={notificationNum} />
          </div>
        </div>
      </div>
    </div>
  );
};
