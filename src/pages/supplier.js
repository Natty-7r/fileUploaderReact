// import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/supplier.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import Overview from "../components/overview";

const baseUrl = "http://localhost:8080/supplier";

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
  const username = props.username;

  let orderedrugs;
  let orderdate;

  const [notificationNum, setNotificationNum] = useState(0);
  const [summary, setSummary] = useState([0, 0, 0, 0]);

  const [comments, setComments] = useState([]);
  const [commentSent, setCommentSent] = useState(false);
  const [orders, setOrders] = useState([]); // to mean pending orders
  const [acceptedOrders, setAcceptedOrders] = useState([]); // to mean pending orders
  const [rejectedOrders, setRejectedOrders] = useState([]); // to mean pending orders
  const [overviewVisible, setOverviewVisible] = useState(true);
  const [orderType, setOrderType] = useState("pending");
  const [currentSlide, setCurrentSlide] = useState("orders"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/index`).then((response) => {
      console.log(response);
      setOrders(response.data.orders.pendingOrders);
      setAcceptedOrders(response.data.orders.acceptedOrders);
      setRejectedOrders(response.data.orders.rejectedOrders);
      setComments(response.data.orders.comments);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [orders, acceptedOrders, rejectedOrders]);

  const createSummary = () => {
    let totaldrugsOrderd = 0;
    orderedrugs = orders.length;
    orders.forEach((order) => {
      order.requestedDrugs.forEach((drug) => {
        totaldrugsOrderd += drug.amount;
      });
    });

    setSummary([
      totaldrugsOrderd,
      orders.length,
      acceptedOrders.length,
      rejectedOrders.length,
    ]);
  };

  const onOrders = () => {
    setCurrentSlide("orders");
    setOrderType("pending");
    setOverviewVisible(true);
  };
  const onSendOrders = () => {
    setCurrentSlide("sendOrders");
    setOverviewVisible(false);
  };
  const onAcceptedOrders = () => {
    setCurrentSlide("acceptedOrders");
    setOrderType("accepted");
    setOverviewVisible(true);
  };
  const onRejectedOrders = () => {
    setOrderType("rejected");
    setCurrentSlide("rejectedOrders");
    setOverviewVisible(true);
  };
  const onComment = () => {
    setOverviewVisible(true);
    setCurrentSlide("comments");
  };

  const SlideContent = (props) => {
    let timer;

    const [orderNumber, setOrderNumber] = useState(0);
    const [orderResult, setOrderResult] = useState([]);
    const [orderDetail, setOrderDetail] = useState(false);
    const [formError, setFormError] = useState(false);
    const [formErrorMsg, setFormErrorMsg] = useState("");
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

    const handleBackToOrders = () => {
      setOrderDetail(false);
    };
    const handleRemoveOrder = (index) => {
      orderResult.splice(index, 1);
      setOrderResult(orderResult);
      setOrderNumber(orderNumber - 1);
    };
    // -------------------------------------
    const handleOnAcceptOrder = (index) => {
      const orderToAccept = orders[index];
      acceptedOrders.push(orderToAccept);
      orders.splice(index, 1);
      setAcceptedOrders(acceptedOrders);
      setOrders(orders);
      createSummary();
      axios
        .patch(`${baseUrl}/order`, {
          requestId: orderToAccept.id,
          status: "accepted",
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };
    const handleOnRejectOrder = (index) => {
      const orderToReject = orders[index];
      rejectedOrders.push(orderToReject);
      orders.splice(index, 1);
      setRejectedOrders(rejectedOrders);
      setOrders(orders);
      createSummary();
      axios
        .patch(`${baseUrl}/order`, {
          requestId: orderToReject.id,
          status: "rejected",
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
    };
    const handleOnClearOrder = ({ index, type }) => {
      let orderToClear;
      if (type == "rejected") {
        orderToClear = rejectedOrders[index];
        rejectedOrders.splice(index, 1);
        setRejectedOrders(rejectedOrders);
      }
      if (type == "accepted") {
        orderToClear = acceptedOrders[index];
        acceptedOrders.splice(index, 1);
        setAcceptedOrders(acceptedOrders);
      }
      const requestId = orderToClear.id;
      axios
        .delete(`${baseUrl}/order/${requestId}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));

      createSummary();
    };
    const OnSendComment = () => {
      const commentInput = document.querySelector(".input-comment");

      const comment = commentInput.value;
      if (comment == "") return;

      axios
        .post(`${baseUrl}/comment`, {
          message: comment,
          username: username,
        })
        .then((response) => {
          if (response.data.status == "success") {
            setCommentSent(true);
            commentInput.value = "";
            setTimeout(() => {
              setCommentSent(false);
            }, 3000);
          }
        });
    };

    // -------------------------

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
      const sixMonthHead = new Date(Date.now() + 6 * 30 * 24 * 3600 * 1000);
      const insertedTime = new Date(inputDate);
      const currentTime = new Date();

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
          if (insertedTime < currentTime) {
            setFormErrorMsg("The Drug is already Expired !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout(() => {
              setFormError(false);
            }, 3000);
            return;
          }
          if (insertedTime < sixMonthHead) {
            setFormErrorMsg("the drug should not expire before 6 months !");
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
          // if all validation passed
          const order = {
            name: inputName,
            drugCode: inputCode,
            amount: inputAmount,
            price: inputPrice,
            supplier: inputSupplier,
            expireDate: inputDate,
            suppliedDate: new Date(),
            status: "unbilled",
          };
          orderResult.push(order);
          setOrderResult(orderResult);
          setOrderNumber(orderNumber + 1);
        }
      }
    };
    const handleOnSendOrder = () => {
      axios
        .post(`${baseUrl}/register`, { orders: orderResult })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
      setOrderResult([]);
    };

    const OrderCard = (props) => {
      const handleSeeDetail = () => {
        setOrderDetail(true);
        setSelectedOrderIndex(props.index);
      };
      let totalDrugsOrdered = 0;
      let totalOrdersType = props.order.requestedDrugs.length;
      props.order.requestedDrugs.forEach((drug) => {
        totalDrugsOrdered += drug.amount;
      });
      const onAcceptOrder = () => {
        handleOnAcceptOrder(props.index);
      };
      const onRejectOrder = () => {
        handleOnRejectOrder(props.index);
      };
      const onClearOrder = () => {
        handleOnClearOrder({ index: props.index, type: props.type });
      };
      return (
        <div className="order">
          <div className="order_header order_part">
            {" "}
            <div className="left">order -{props.index + 1} </div>
            <div className="right">{formatDates(props.order.requestDate)} </div>
          </div>
          <div className="order_content order_part">
            <p className="left">
              {" "}
              order for
              <span className="order_content_value order_content_value-type">
                {totalDrugsOrdered}
              </span>
              drugs from
              <span className="order_content_value order_content_value-type">
                {totalOrdersType}
              </span>
              types of drugs
            </p>

            {props.type == "pending" ? (
              <button
                className="right btn_order btn_order-accept  "
                onClick={onAcceptOrder}>
                accept
              </button>
            ) : (
              <p className="right btn_order btn_order-accept  ">{props.type}</p>
            )}
          </div>

          <div className="order_bottom order_part">
            <button
              className="left btn_order btn_order-detail"
              onClick={handleSeeDetail}>
              detail
            </button>
            {props.type == "pending" ? (
              <button
                className="right btn_order btn_order-reject"
                onClick={onRejectOrder}>
                reject
              </button>
            ) : (
              <button
                className="right btn_order btn_order-reject"
                onClick={onClearOrder}>
                clear
              </button>
            )}
          </div>
        </div>
      );
    };
    const OrderDetailCard = (props) => {
      let order;
      if (orderType == "pending") order = orders[props.selectedOrderIndex];
      if (orderType == "accepted")
        order = acceptedOrders[props.selectedOrderIndex];
      if (orderType == "rejected")
        order = rejectedOrders[props.selectedOrderIndex];

      const onAcceptOrder = () => {
        handleOnAcceptOrder(props.selectedOrderIndex);
      };
      const onRejectOrder = () => {
        handleOnRejectOrder(props.selectedOrderIndex);
      };
      const onClearOrder = () => {
        handleOnClearOrder({
          index: props.selectedOrderIndex,
          type: orderType,
        });
      };
      return (
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
            {order.requestedDrugs.map((drug) => (
              <div className="order_detail_content">
                <div className="order_drug">
                  {" "}
                  Drug name :<p className="order_drug-value">{drug.name} </p>
                </div>
                <div className="order_drug ">
                  {" "}
                  requested amount :
                  <p className="order_drug-value">{drug.amount}</p>
                </div>
              </div>
            ))}
          </div>
          {orderType == "pending" ? (
            <div className="order_detail_footer">
              <button
                className="left btn_order btn_order-detail"
                onClick={onAcceptOrder}>
                accept
              </button>
              <button
                className="right btn_order btn_order-reject"
                onClick={onRejectOrder}>
                reject
              </button>
            </div>
          ) : (
            <div className="order_detail_footer">
              <button
                className="right btn_order btn_order-reject"
                onClick={onClearOrder}>
                clear
              </button>
            </div>
          )}
        </div>
      );
    };
    if (currentSlide == "orders")
      return (
        <div className="orders">
          <h1 className="slide_header">Drug orders</h1>
          {orders.length == 0 ? (
            <h1 className="no_data_header">no orders recieved yet !</h1>
          ) : (
            <div className="orders_main">
              <OrderDetailCard selectedOrderIndex={selectedOrderIndex} />
              <div
                className={`orders_list ${
                  orderDetail ? "orders_list-blurred" : ""
                }`}>
                {orders.map((order, index) => (
                  <OrderCard
                    type="pending"
                    order={order}
                    index={index}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    if (currentSlide == "sendOrders")
      return (
        <div className="send_orders">
          <div className="supplier_sendOrder_header"></div>
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
                    defaultValue={new Date()}
                    type="date"
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
                <button
                  className="btn btn_sendOrder"
                  onClick={handleOnSendOrder}>
                  send order
                </button>
              </div>
            </div>
          ) : null}
        </div>
      );
    if (currentSlide == "acceptedOrders")
      return (
        <div className="orders">
          <h1 className="slide_header">accepted orders</h1>
          {acceptedOrders.length == 0 ? (
            <h1 className="no_data_header">
              no orders recieved is accepted yet !
            </h1>
          ) : (
            <div className="orders_main">
              <OrderDetailCard selectedOrderIndex={selectedOrderIndex} />
              <div
                className={`orders_list ${
                  orderDetail ? "orders_list-blurred" : ""
                }`}>
                {acceptedOrders.map((order, index) => (
                  <OrderCard
                    type="accepted"
                    order={order}
                    index={index}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    if (currentSlide == "rejectedOrders")
      return (
        <div className="orders">
          <h1 className="slide_header">rejected orders</h1>
          {rejectedOrders.length == 0 ? (
            <h1 className="no_data_header">
              no orders recieved is rejected yet !
            </h1>
          ) : (
            <div className="orders_main">
              <OrderDetailCard selectedOrderIndex={selectedOrderIndex} />
              <div
                className={`orders_list ${
                  orderDetail ? "orders_list-blurred" : ""
                }`}>
                {rejectedOrders.map((order, index) => (
                  <OrderCard
                    type="rejected"
                    order={order}
                    index={index}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    if (currentSlide == "comments") {
      return (
        <div className="comments_slide">
          <h1 className="slide_header">Add comment </h1>
          <div className="comment_form">
            {commentSent ? (
              <div className="comment_succes"> Comment accepted </div>
            ) : null}
            <h2 className="form_header">add Comment Here</h2>
            <textarea className="input input-comment"></textarea>
            <button
              className="btn btn-comment"
              onClick={OnSendComment}>
              submit
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        username={username}
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
            summary={summary}
            stockRequest={[]}
          />
        ) : null}
        <div className="druglist">
          <div className="page_slide">
            <SlideContent notificationNum={notificationNum} />
          </div>
        </div>
      </div>
    </div>
  );
};
