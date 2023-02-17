// import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/supplier.css";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import DatePicker from "react-datepicker";
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
export default (props) => {
  let totalDrugs = 0,
    totalAvailbleDrugs = 0,
    totalExpiredDrugs = 0,
    totalPendingDrugs = 0,
    totalDrugsOrderd,
    orderedrugs;
  let orderdate;
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
  const [orders, setOrders] = useState([]); // to mean pending orders
  const [accpredOrders, setAcceptedOrders] = useState([]); // to mean pending orders
  const [rejectedOrders, setRejectedOrders] = useState([]); // to mean pending orders
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [overviewVisible, setOverviewVisible] = useState(true);

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("sendOrders"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/index`).then((response) => {
      console.log(response);
      setOrders(response.data.orders.pendingOrders);
      setAcceptedOrders(response.data.orders.acceptedOrders);
      setRejectedOrders(response.data.orders.rejectedOrders);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [availbleStockDrugs, expiredDrugs, stockOrders]);

  const supplier = () => {
    let totalOrders = 0;
    orderedrugs = orders.length;
    orders.forEach((order) => {
      orderdate = order.requestDate;
      totalOrders += order.amount;
    });
    totalDrugsOrderd = totalOrders;
  };
  supplier();
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
    let totalOrders = 0;
    orderedrugs = orders.length;
    orders.forEach((order) => {
      orderdate = order.requestDate;
      totalOrders += order.amount;
    });
    totalDrugsOrderd = totalOrders;

    setSummary([
      totalDrugsOrderd,
      orders.length,
      totalExpiredDrugs,
      totalPendingDrugs,
    ]);
  };

  const onOrders = () => {
    setCurrentSlide("orders");
    setOverviewVisible(true);
  };
  const onSendOrders = () => {
    setCurrentSlide("sendOrders");
    setOverviewVisible(false);
  };
  const onAcceptedOrders = () => {
    setCurrentSlide("acceptedOrders");
    setOverviewVisible(true);
  };
  const onRejectedOrders = () => {
    setCurrentSlide("rejectedOrders");
    setOverviewVisible(true);
  };
  const onComment = () => {
    setCurrentSlide("comments");
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
    let timer;
    const [requestResults, setRequests] = useState([]);
    const [errorMsg, setErrorMsg] = useState(false);
    const [requstNumber, setRequstNumber] = useState(0);

    const [orderNumber, setOrderNumber] = useState(0);
    const [orderResult, setOrderResult] = useState([]);
    const [orderDetail, setOrderDetail] = useState(false);
    const [formError, setFormError] = useState(false);
    const [formErrorMsg, setFormErrorMsg] = useState("");
    const handleSeeDetail = () => {
      setOrderDetail(true);
    };
    const handleBackToOrders = () => {
      setOrderDetail(false);
    };
    const handleRemoveOrder = (index) => {
      orderResult.splice(index, 1);
      setOrderResult(orderResult);
      setOrderNumber(orderNumber - 1);
    };

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
    const OrderedDrug = (props) => {
      const handleRemove = () => {
        props.handleRemoveOrder(props.number);
      };
      return (
        <div className="order_result_drug">
          {" "}
          <p className="order_result_list order_result_list-no">
            {props.number}
          </p>
          <p className="order_result_list"> {props.order.name}</p>
          <p className="order_result_list">{props.order.amount}</p>
          <p className="order_result_list">{props.order.price}</p>
          <p className="order_result_list">{props.order.expireDate}</p>
          <p className="order_result_list">{props.order.supplier}</p>
          <p className="order_result_list order_result_list-btn">
            <button
              className="btn_order btn_order-remove"
              onClick={handleRemove}>
              remove
            </button>
          </p>
        </div>
      );
    };
    const handleOrderDrug = () => {
      const inputCode = document.querySelector(".input-code").value;
      const inputName = document.querySelector(".input-name").value;
      const inputAmount = document.querySelector(".input-amount").value;
      const inputPrice = document.querySelector(".input-price").value;
      const inputDate = document.querySelector(".input-date").value;
      const inputSupplier = document.querySelector(".input-supplier").value;
      {
        {
          // drug code validation
          if (inputCode.trim() == "") {
            setFormErrorMsg("drug code can not be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (!Number.isInteger(+inputCode)) {
            setFormErrorMsg("drug code must be integer digit !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
        }
        {
          // drug name validation
          if (inputName == "") {
            setFormErrorMsg("drug name field can't be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (inputName.length < 5) {
            setFormErrorMsg("drug name must be more than 4 charaters!");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
        }
        {
          // drug amount validation
          if (inputAmount.trim() == "") {
            setFormErrorMsg("drug amount  can not be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (!Number.isInteger(+inputAmount)) {
            setFormErrorMsg("drug amount must be integer digit !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (+inputAmount <= 0) {
            setFormErrorMsg("drug amount must be grater than zero  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
        }
        {
          // drug initial price  validation
          if (inputPrice.trim() == "") {
            setFormErrorMsg("drug price  can not be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (!Number.isInteger(+inputPrice)) {
            setFormErrorMsg("drug price must be integer digit !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (+inputPrice <= 0) {
            setFormErrorMsg("drug price must be grater than zero  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
        }
        {
          // drug supplier name  validation
          if (inputSupplier == "") {
            setFormErrorMsg("supplier name field can't be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          } else if (inputSupplier.length < 5) {
            setFormErrorMsg(" supplier name  must be more than 4 charaters!");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
        }
        {
          // drug name validation
          if (inputDate == "") {
            setFormErrorMsg("expried date field can't be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
        }
        {
          // if all validation passed
          const order = {
            name: inputName,
            drugCode: inputCode,
            amount: inputAmount,
            price: inputPrice,
            supplier: inputSupplier,
            expireDate: inputDate,
          };
          orderResult.push(order);
          setOrderResult(orderResult);
          setOrderNumber(orderNumber + 1);
        }
      }
    };
    if (currentSlide == "orders")
      return (
        <div className="orders">
          <h1 className="slide_header">Drug orders</h1>
          {orders.length == 0 ? (
            <h1 className="no_data_header">no orders recieved yet !</h1>
          ) : (
            <div className="orders_main">
              <div
                className={`order_detail ${
                  orderDetail ? "order_detail_visible" : ""
                }`}>
                <div className="order_detail_header">
                  <h1 className="">order detail </h1>
                  <button
                    className="left btn_order btn_order-detail"
                    onClick={handleBackToOrders}>
                    close
                  </button>
                </div>
                <div className="order_detail_main">
                  {orders.map((order) => (
                    <div className="order_detail_content">
                      <div className="order_drug">
                        {" "}
                        Drug name :
                        <p className="order_drug-value">{order.name} </p>
                      </div>
                      <div className="order_drug ">
                        {" "}
                        requested amount :
                        <p className="order_drug-value">{order.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order_detail_footer">
                  <button className="left btn_order btn_order-detail">
                    accept
                  </button>
                  <button className="right btn_order btn_order-reject">
                    reject
                  </button>
                </div>
              </div>
              <div
                className={`orders_list ${
                  orderDetail ? "orders_list-blurred" : ""
                }`}>
                <div className="order">
                  <div className="order_header order_part">
                    {" "}
                    <div className="left">order one </div>
                    <div className="right">{formatDates(orderdate)} </div>
                  </div>
                  <div className="order_content order_part">
                    <p className="left">
                      {" "}
                      order for
                      <span className="order_content_value order_content_value-type">
                        {totalDrugsOrderd}
                      </span>
                      drugs from
                      <span className="order_content_value order_content_value-type">
                        {orderedrugs}
                      </span>
                      types of drugs
                    </p>
                    <button className="right btn_order btn_order-accept  ">
                      accept
                    </button>
                  </div>

                  <div className="order_bottom order_part">
                    <button
                      className="left btn_order btn_order-detail"
                      onClick={handleSeeDetail}>
                      detail
                    </button>
                    <button className="right btn_order btn_order-reject">
                      reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    if (currentSlide == "sendOrders")
      return (
        <div className="send_orders">
          <div class="order_form">
            <div class="form">
              <h1 class="title">Add drugs </h1>
              <div
                className={`form_error ${
                  formError ? "form_error-visible" : ""
                }`}>
                {formErrorMsg}
              </div>
              <div className="form_row">
                <div class="inputContainer">
                  <input
                    type="text"
                    class="input input-code"
                    placeholder="a"
                  />
                  <label
                    htmlFor=""
                    class="label">
                    drug code
                  </label>
                </div>

                <div class="inputContainer">
                  <input
                    type="text"
                    class="input input-name"
                    placeholder="a"
                  />
                  <label
                    htmlFor=""
                    class="label">
                    drug name
                  </label>
                </div>
              </div>
              <div className="form_row">
                <div class="inputContainer">
                  <input
                    type="text"
                    class="input input-amount"
                    placeholder="a"
                  />
                  <label
                    htmlFor=""
                    class="label">
                    drug amount
                  </label>
                </div>

                <div class="inputContainer">
                  <input
                    type="text"
                    class="input input-price"
                    placeholder="a"
                  />
                  <label
                    htmlFor=""
                    class="label">
                    initail price
                  </label>
                </div>
              </div>
              <div className="form_row">
                <div class="inputContainer">
                  <input
                    type="text"
                    class="input input-date"
                    placeholder="a"
                  />

                  <label
                    htmlFor=""
                    class="label">
                    expire date
                  </label>
                </div>

                <div class="inputContainer">
                  <input
                    type="text"
                    class="input input-supplier"
                    placeholder="a"
                  />
                  <label
                    htmlFor=""
                    class="label">
                    supplier
                  </label>
                </div>
              </div>
              <button
                className="btn btn_add"
                onClick={handleOrderDrug}>
                +add
              </button>
            </div>
          </div>
          {orderResult.length > 0 ? (
            <div className="order_result">
              <div className="order_result_header">
                <p className="order_result_header_list order_header_list-no">
                  no
                </p>
                <p className="order_result_header_list">name</p>
                <p className="order_result_header_list">amount</p>
                <p className="order_result_header_list">initial price</p>
                <p className="order_result_header_list">expried date</p>
                <p className="order_result_header_list">supplier</p>
                <p className="order_result_header_list"></p>
                <p className="order_result_header_list-last"></p>
              </div>
              <div className="order_result_main">
                {orderResult.map((order, number) => (
                  <OrderedDrug
                    handleRemoveOrder={handleRemoveOrder}
                    order={order}
                    number={number}
                  />
                ))}
              </div>
              <div className="order_result_footer">
                <button className="btn btn_sendOrder">send order</button>
              </div>
            </div>
          ) : null}
        </div>
      );
    if (currentSlide == "acceptedOrders")
      return (
        <div className="orders">
          <h1 className="slide_header">accepted orders</h1>

          <div className="orders_main">
            <div
              className={`order_detail ${
                orderDetail ? "order_detail_visible" : ""
              }`}>
              <div className="order_detail_header">
                <h1 className="">order detail </h1>
                <button
                  className="left btn_order btn_order-detail"
                  onClick={handleBackToOrders}>
                  close
                </button>
              </div>
              <div className="order_detail_main">
                {orders.map((order) => (
                  <div className="order_detail_content">
                    <div className="order_drug">
                      {" "}
                      Drug name :
                      <p className="order_drug-value">{order.name} </p>
                    </div>
                    <div className="order_drug ">
                      {" "}
                      requested amount :
                      <p className="order_drug-value">{order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_detail_footer">
                <button className="right btn_order btn_order-reject">
                  clear
                </button>
              </div>
            </div>
            <div
              className={`orders_list ${
                orderDetail ? "orders_list-blurred" : ""
              }`}>
              <div className="order">
                <div className="order_header order_part">
                  {" "}
                  <div className="left">order one </div>
                  <div className="right">{formatDates(orderdate)} </div>
                </div>
                <div className="order_content order_part">
                  <p className="left">
                    {" "}
                    order for
                    <span className="order_content_value order_content_value-type">
                      {totalDrugsOrderd}
                    </span>
                    drugs from
                    <span className="order_content_value order_content_value-type">
                      {orderedrugs}
                    </span>
                    types of drugs
                  </p>
                  <p className="right  btn_order-accept  ">accepted</p>
                </div>

                <div className="order_bottom order_part">
                  <button
                    className="left btn_order btn_order-detail"
                    onClick={handleSeeDetail}>
                    detail
                  </button>
                  <button className="right btn_order btn_order-clear">
                    clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    if (currentSlide == "rejectedOrders")
      return (
        <div className="orders">
          <h1 className="slide_header">rejected orders</h1>

          <div className="orders_main">
            <div
              className={`order_detail ${
                orderDetail ? "order_detail_visible" : ""
              }`}>
              <div className="order_detail_header">
                <h1 className="">order detail </h1>
                <button
                  className="left btn_order btn_order-detail"
                  onClick={handleBackToOrders}>
                  close
                </button>
              </div>
              <div className="order_detail_main">
                {orders.map((order) => (
                  <div className="order_detail_content">
                    <div className="order_drug">
                      {" "}
                      Drug name :
                      <p className="order_drug-value">{order.name} </p>
                    </div>
                    <div className="order_drug ">
                      {" "}
                      requested amount :
                      <p className="order_drug-value">{order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order_detail_footer">
                <button className="right btn_order btn_order-reject">
                  clear
                </button>
              </div>
            </div>
            <div
              className={`orders_list ${
                orderDetail ? "orders_list-blurred" : ""
              }`}>
              <div className="order">
                <div className="order_header order_part">
                  {" "}
                  <div className="left">order one </div>
                  <div className="right">{formatDates(orderdate)} </div>
                </div>
                <div className="order_content order_part">
                  <p className="left">
                    {" "}
                    order for
                    <span className="order_content_value order_content_value-type">
                      {totalDrugsOrderd}
                    </span>
                    drugs from
                    <span className="order_content_value order_content_value-type">
                      {orderedrugs}
                    </span>
                    types of drugs
                  </p>
                  <p className="right  btn_order-accept  ">rejected</p>
                </div>

                <div className="order_bottom order_part">
                  <button
                    className="left btn_order btn_order-detail"
                    onClick={handleSeeDetail}>
                    detail
                  </button>
                  <button className="right btn_order btn_order-clear">
                    clear
                  </button>
                </div>
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
        onOrders={onOrders}
        onAcceptedOrders={onAcceptedOrders}
        onRejectedOrders={onRejectedOrders}
        onComment={onComment}
        onSendOrders={onSendOrders}
      />
      <div className="main_page">
        {overviewVisible ? (
          <Overview
            user="supplier"
            summary={[totalDrugsOrderd, orders.length, 0, 0]}
            stockRequest={[]}
          />
        ) : null}
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
