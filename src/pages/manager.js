// expried drugs means sold drugs
import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/slide.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import NotificationSlide from "../components/pharCoordComponents/notificationSlide";
import DrugList from "../components/pharCoordComponents/druglist";
import Overview from "../components/pharCoordComponents/overview";
import UpdateDrugInfo from "../components/pharCoordComponents/updateSetInfo";

const baseUrl = "http://localhost:8080/manager";

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
  const [statusChange, setStatusChange] = useState(0);

  const [checkingExpiration, setCheckingExpiration] = useState(false);
  const [summary, setSummary] = useState([0, 0, 0, 0]);
  const [selecteDrug, setSelectedDrug] = useState();
  const [selectedIndex, setSelectedIndex] = useState();

  const [availbleDrugs, setAvailbleDrugs] = useState([]);
  const [availbleStockDrugs, setAvailbleStockDrugs] = useState([]);
  const [comments, setComments] = useState([]);
  const [storeOrders, setStoreOrders] = useState([]);
  const [stockRequests, setStockRequest] = useState([]);
  const [storeRequests, setStoreRequest] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [slideChange, countSlideChange] = useState(1);

  const [searchKey, setSearchKey] = useState("");
  const [searchView, setSearchView] = useState(""); //  determine where the search was made on stock or store , with value fo store or stock
  const [searchError, setSearchError] = useState(false);
  const [searchErrorMsg, setSearchErrorMsg] = useState("");
  const [replacedDrugs, setReplacedDrugs] = useState([]); // determine where the stock or store is replaced

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("availableStore"); // to track the the dashboard menu and slide

  useEffect(() => {
    axios.get(`${baseUrl}/drugs`).then((response) => {
      console.log(response);
      setAvailbleDrugs(response.data.drugs.availbleStoreDrugs);
      setComments(response.data.drugs.comments);
      setAvailbleStockDrugs(response.data.drugs.availbleStockDrugs);
      setStoreOrders(response.data.drugs.storeOrders);
      setStockRequest(response.data.drugs.stockRequests);
      setStoreRequest(response.data.drugs.storeRequests);
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
  const handleSearchDrugs = (e) => {
    let from = "store";
    e.preventDefault();
    if (searchKey.trim() == "") return;
    if (currentSlide == "availableStock") from = "stock";
    if (currentSlide == "availableStore") from = "store";

    axios
      .post(`${baseUrl}/search`, { searchKey, from })
      .then((response) => {
        if (response.data.status == "fail") {
          searchErrorMsg(` no data associated with your search in ${from}`);
          setSearchError(true);
          setSearchView("");
          setTimeout(() => {
            setSearchError(false);
          }, 3000);
        } else if (response.data.searchResult.length == 0) {
          setSearchErrorMsg(` no data associated with your search in ${from}`);
          setSearchError(true);
          setSearchView("");
          setTimeout(() => {
            setSearchError(false);
          }, 3000);
        } else {
          setSearchError(false);
          if (from == "store") {
            setReplacedDrugs(availbleDrugs);
            setAvailbleDrugs(response.data.searchResult);
            setSearchView("store");
          }
          if (from == "stock") {
            setReplacedDrugs(availbleStockDrugs);
            setAvailbleStockDrugs(response.data.searchResult);
            setSearchView("stock");
          }
        }
      })
      .catch((error) => {
        setSearchErrorMsg("unable to make search please try again");
        setSearchError(true);
        setSearchView("");
        setTimeout(() => {
          setSearchError(false);
        }, 3000);
      });
  };
  const handleUpdate = (index) => {
    setEditing(true);
    setEditingType("update");
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleUpdateDone = (drugCode) => {
    createSummary();

    axios
      .delete(`${baseUrl}/drug/${drugCode}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };
  const handleRemoveComment = (commentIndex) => {
    const commentId = comments[commentIndex].id;
    console.log(commentId);
    comments.splice(commentIndex, 1);
    setComments(comments);
    countNotificaitonNumber();
    axios
      .delete(`${baseUrl}/comment/${commentId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };
  const handleChangeCommentStatus = (commentIndex) => {
    const comment = comments[commentIndex];
    comment.status = comment.status == "read" ? "unread" : "read";
    const newStatus = comment.status;
    const commentId = comment.id;
    setStatusChange(statusChange + 1);
    axios
      .patch(`${baseUrl}/comment/`, {
        commentId,
        newStatus,
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
    if (currentSlide == "sold drugs") return expiredDrugs[index];
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

    setSummary([
      totalAvailbleDrugsInStore,
      totalAvailbleDrugsInStock,
      totalExpiredDrugs,
      totalPendingDrugs,
    ]);
  };
  const seeAvailableDrugsInStore = () => {
    let slideNumber = slideChange;
    if (searchView == "store") {
      setAvailbleDrugs(replacedDrugs);
    }
    setCurrentSlide("availableStore");
    setSearchView("");
    setSearchKey("");
    countSlideChange(++slideNumber);
  };
  const seeAvailableDrugsInStock = () => {
    let slideNumber = slideChange;
    if (searchView == "stock") {
      setAvailbleStockDrugs(replacedDrugs);
      countSlideChange(++slideNumber);
    }
    setSearchKey("");
    setSearchView("");
    setCurrentSlide("availableStock");
  };
  const handleCheckSoldDrugs = () => {
    setCurrentSlide("sold drugs");
  };
  const handleSeeNotification = () => {
    setCurrentSlide("notification");
  };
  const handleSendRequest = () => {
    setCurrentSlide("request");
  };
  const handleSendOrder = () => {
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
            onClick={props.handleSendOrderDone}>
            {props.type == "order" ? "send order" : "Add to stock"}
          </button>
        </div>
      );
  };

  const countNotificaitonNumber = () => {
    let notificationNumber = 0;
    let notificationMessagesToadd = [];

    if (comments.length > 0) {
      notificationNumber = comments.length;
      notificationMessages.push("comments");
    }
    setNotificationNum(notificationNumber);
    setNotificationMessages(notificationMessagesToadd);
  };

  const SlideContent = (props) => {
    const [requestResults, setRequests] = useState([]);
    const [storeOrders, setStoreOrders] = useState([]);
    const [orderedNumber, setOrderedNumber] = useState(0);
    const [errorMsg, setErrorMsg] = useState(false);
    const [requstNumber, setRequstNumber] = useState(0);
    const [stockRequestSize, setStockRequestSize] = useState(
      stockRequests.length
    );
    let storeRequestExits = storeRequests.length > 0 ? true : false;
    let requestedDrugs = []; // to fetch the drugs out of the request
    if (storeRequestExits)
      storeRequests.forEach((storeRequest) => {
        storeRequest.requestedDrugs.forEach((drug) => {
          drug.date = storeRequest.requestDate;
          requestedDrugs.push(drug);
        });
      });
    const StoreRequest = (props) => {
      return (
        <div className="requested_drug">
          <p className="request_name">
            <span>{props.index + 1} </span>
          </p>
          <p className="request_name">
            <span>name: </span> {props.requestedDrug.name}
          </p>
          <p className="request_amount">
            <span>amount: </span> {props.requestedDrug.amount}
          </p>
          <p className="request_name">
            <span>date: </span>{" "}
            {new Date(props.requestedDrug.date).toLocaleDateString()}
          </p>
        </div>
      );
    };

    const handleGoToAddToStock = () => {
      props.handleSendOrder();
    };
    const handleSendOrder = () => {
      let name = document.querySelector(".input_name-request").value;
      let amount = +document.querySelector(".input_amount-request").value;
      const currentOrders = storeOrders;
      let drugOrder = undefined;
      let amountDeficit = 0; // if drug was added to order the previous amount
      let drugOrderIndex = null;
      let drugInOrder = false;

      currentOrders.forEach((currentOrder, index) => {
        // checking if it is order already
        if (currentOrder.name.trim() == name.trim()) {
          amountDeficit = currentOrder.amount;
          drugOrderIndex = index;
          drugInOrder = true;
          drugOrder = currentOrder;
        }
      });

      if (name.length < 3) {
        // if drug did not match
        document.querySelector(".request_error").textContent =
          "Name of drug must be atleast 3 character  !";
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
      }
      if (drugInOrder) {
        currentOrders[drugOrderIndex].amount += amount;
        setStoreOrders(currentOrders);
        let orderNumber = orderedNumber;
        setOrderedNumber(++orderNumber);
      }
      if (!drugInOrder) {
        currentOrders.push({ name, amount });
        setStoreOrders(storeOrders);
        let orderNumber = orderedNumber;
        setOrderedNumber(++orderNumber);
      }

      document.querySelector(".input_name-request").value = "";
      document.querySelector(".input_amount-request").value = "";
    };
    const handleSendOrderDone = () => {
      setStoreOrders([]);
      createSummary();
      axios
        .post(`${baseUrl}/drugs/order`, {
          storeOrders,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };
    const handleClearStoreRequest = () => {
      setStoreRequest([]);
      axios
        .delete(`${baseUrl}/request`, {})
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };

    const handleRemoveOrder = (index) => {
      const currentOrders = storeOrders;
      currentOrders.splice(index, 1);
      setStoreOrders(currentOrders);
      let orderNumber = orderedNumber;
      setOrderedNumber(--orderNumber);
    };

    if (currentSlide == "availableStore") {
      return (
        <div className="drguList noLastCol">
          <div className="list_header">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">supllied date </p>
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
                  key={index}
                  hasLastCol={false}
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
        <div className="drguList noLastCol">
          <div className="list_header">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">supllied date </p>
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
                  hasLastCol={false}
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
    if (currentSlide == "sold drugs")
      return (
        <div className="drguList ">
          <div className="list_header list_header-expired">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">sold date </p>
            <p className="list list_name list_name_discardAll">
              {" "}
              <button
                className="btn expired_list_btn expired_list_btn-discardAll"
                onClick={handleDiscardAll}>
                clear All{" "}
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
                  type="sold"
                  hasLastCol={true}
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
          <h1 className="slide_header">Order drugs</h1>
          <div className="request_content ">
            <div className="addToStock">
              <div
                className={`requested_drugs_card  ${
                  storeRequestExits ? "" : "requested_drugs_card-hidden"
                }`}>
                <div className="requested_drug_header">
                  <h1 className="requested_drug_header-title">
                    {" "}
                    request from store
                  </h1>
                  <p>
                    {" "}
                    <button
                      className="btn btn_clear_requesst"
                      onClick={handleClearStoreRequest}>
                      clear request
                    </button>
                  </p>
                </div>
                <div className="requested_drugs ">
                  {requestedDrugs.map((requestedDrug, index) => (
                    <StoreRequest
                      requestedDrug={requestedDrug}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <div
                className={`request_form  ${
                  storeRequestExits ? "" : "request_form-full"
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
                  onClick={handleSendOrder}>
                  + add{" "}
                </button>
              </div>
            </div>
            <StockOrderResultContent
              type="order"
              stockOrders={storeOrders}
              handleRemove={handleRemoveOrder}
              handleSendOrderDone={handleSendOrderDone}
            />
          </div>
        </div>
      );
    if (currentSlide == "notification")
      return (
        <div className="notification_slide">
          <h1 className="slide_header">Comments </h1>
          <NotificationSlide
            user={"manager"}
            handleRemoveComment={handleRemoveComment}
            handleChangeCommentStatus={handleChangeCommentStatus}
            expiredDrugs={expiredDrugs}
            totalExpiredDrugs={totalExpiredDrugs}
            storeOrders={storeOrders}
            comments={comments}
            totalPendingDrugs={totalPendingDrugs}
            handleCheckSoldDrugs={handleCheckSoldDrugs}
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
        user="manager"
        notificationNum={notificationNum}
        currentSlide={currentSlide}
        seeAvailableDrugsInStore={seeAvailableDrugsInStore}
        seeAvailableDrugsInStock={seeAvailableDrugsInStock}
        handleCheckSoldDrugs={handleCheckSoldDrugs}
        handleSeeNotification={handleSeeNotification}
        handleSendRequest={handleSendRequest}
        handleSendOrder={handleSendOrder}
        handleRegistration={handleRegistration}
      />
      <div className="main_page">
        <Overview
          user="manager"
          summary={summary}
          stockRequest={stockRequests}
        />
        <div className="actions">
          {" "}
          {searchError ? (
            <div className="search_error">{searchErrorMsg}</div>
          ) : null}
          {searchView != "" ? (
            <div className="search_error search_error-result ">
              search result for<p className="search_key">'{searchKey}' </p> in{" "}
              {currentSlide == "availableStock" ? "stock " : "store"}
            </div>
          ) : null}
          <form
            className="search_form"
            onSubmit={handleSearchDrugs}>
            <input
              type="text"
              placeholder="search"
              className="input input-serach"
              onChange={(e) => {
                if (e.target.value == "") {
                  if (searchView == "store") {
                    seeAvailableDrugsInStore();
                  }
                  if (searchView == "stock") {
                    seeAvailableDrugsInStock();
                  }
                  setSearchError(false);
                  setSearchView("");
                }
                setSearchKey(e.target.value);
              }}
            />
            <p className="btn btn-search">[]</p>
          </form>
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
              handleSendOrder={handleSendOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
