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
    <div className={`lists ${expired ? "expired" : ""}`}>
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
            handleUpdate={props.handleUpdate}
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
  const handleDiscard = () => {
    props.handleDiscard(index, props.drugId);
  };

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
  const handleCloseUpdating = () => {
    props.setEditing(false);
  };
  if (!props.editing) return null;
  if (props.editing)
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
};

export default (props) => {
  let totalDrugs = 0,
    totalAvailbleDrugs = 0,
    totalExpiredDrugs = 0;
  const [editing, setEditing] = useState(false);
  const [checkingExpiration, setCheckingExpiration] = useState(false);
  const [summary, setSummary] = useState([0, 0, 0]);
  const [selecteDrug, setSelectedDrug] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [availbleDrugs, setAvailbleDrugs] = useState([]);
  const [expiredDrugs, setExpiredDrugs] = useState([]);
  const [drugsInTable, setDrugsInTable] = useState();
  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("notification"); // to track the the dashboard menu and slide

  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/drugs`).then((response) => {
      setAvailbleDrugs(response.data.availbleDrugs);
      setDrugsInTable(response.data.availbleDrugs);
      setExpiredDrugs(response.data.expiredDrugs);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [availbleDrugs]);

  const handleUpdate = (index) => {
    setEditing(true);
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleUpdateDone = (newPrice, newAmount, drugId) => {
    selecteDrug.price = newPrice;
    selecteDrug.amount = newAmount;
    availbleDrugs[selectedIndex] = selecteDrug;
    setEditing(false);
    axios
      .patch(`${baseUrl}/drug`, { drugId, newPrice, newAmount })
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
    setExpiredDrugs([]);
    setCheckingExpiration(false);
  };
  const handleCheckExpiration = () => {
    // setCheckingExpiration(true);
    setCurrentSlide("expired");
  };
  const getSelectedDrug = (index) => {
    console.log(index);
    if (currentSlide == "available") return availbleDrugs[index];
    if (currentSlide == "expired") return expiredDrugs[index];
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
    availbleDrugs.forEach((drug) => {
      totalAvailbleDrugs += drug.amount;
    });
    expiredDrugs.forEach((drug) => {
      totalExpiredDrugs += drug.amount;
    });
    totalDrugs += totalAvailbleDrugs + totalExpiredDrugs;
    setSummary([totalDrugs, totalAvailbleDrugs, totalExpiredDrugs]);
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
  const RequestResult = (props) => {
    const handleRemove = () => {
      props.handleRemove(props.index);
    };
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
  const RequestResultContent = (props) => {
    if (props.requestResults.length == 0) return null;
    else
      return (
        <div className="request_main">
          <div className="request_results">
            {props.requestResults.map((request, index) => (
              <RequestResult
                index={index}
                key={index}
                request={request}
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
  const SlideContent = () => {
    const [requestResults, setRequests] = useState([]);
    const [errorMsg, setErrorMsg] = useState(false);
    const [r, R] = useState(0);
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
    if (currentSlide == "notification")
      return (
        <div className="notification_slide">
          <h1 className="slide_header">notification</h1>
          <div className="notificaton_content">
            <div className="notification">
              <div className="notification_image">
                <img src={user} />
              </div>
              <div className="notification_massage">
                <div className="notification_massage_header">
                  expired drugs{" "}
                </div>
                <div className="notification_massage_content">
                  ther ave been 50 drugs found int the stock{" "}
                </div>
              </div>
              <button className="btn btn_notificaion">check </button>
            </div>
          </div>
        </div>
      );
  };
  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        currentSlide={currentSlide}
        seeAllDrugs={seeAllDrugs}
        handleCheckExpiration={handleCheckExpiration}
        handleSeeNotification={handleSeeNotification}
        handleSendRequest={handleSendRequest}
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
            <p className="summary_value">500</p>
          </div>
        </div>
        <div className="druglist">
          <UpdateDrugInfo
            editing={editing}
            setEditing={setEditing}
            handleUpdateDone={handleUpdateDone}
            selecteDrug={selecteDrug}
          />

          <div className="page_slide">
            <SlideContent />
          </div>
        </div>
      </div>
    </div>
  );
};
