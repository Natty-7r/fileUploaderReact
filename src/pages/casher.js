// expried drugs means sold drugs
import "../styles/coordinatorStyles/coordinator.css";
import "../styles/coordinatorStyles/slide.css";
import "../styles/coordinatorStyles/casher.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import DrugList from "../components/pharCoordComponents/druglist";
import Overview from "../components/pharCoordComponents/overview";
import UpdateDrugInfo from "../components/pharCoordComponents/updateSetInfo";

const baseUrl = "http://localhost:8080/casher";

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
  const [unbilledDrugs, setUnbilledDrugs] = useState([]);

  const [billedToday, setBilledToday] = useState([]);
  const [drugsToBill, setDrugsToBill] = useState([]);
  const [drugsBilled, setDrugsBilled] = useState([]);
  const [billing, setBilling] = useState(false);

  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  const [currentSlide, setCurrentSlide] = useState("unbilled"); // to track the the dashboard menu and slide

  useEffect(() => {
    axios.get(`${baseUrl}/index`).then((response) => {
      console.log(response);
      setUnbilledDrugs(response.data.unbilledDrugs);
      setBilledToday(response.data.billedToday);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [unbilledDrugs, billedToday]);

  const createSummary = () => {
    setSummary([unbilledDrugs.length, billedToday.length]);
  };

  const handleOnUnbilledDrugs = () => {
    setCurrentSlide("unbilled");
  };
  const handleOnBilledToday = () => {
    setCurrentSlide("billedToday");
  };

  const SlideContent = (props) => {
    const [totalPrice, setTotalPrice] = useState(0);
    let storeRequestExits = storeRequests.length > 0 ? true : false;
    let requestedDrugs = []; // to fetch the drugs out of the request
    if (storeRequestExits)
      storeRequests.forEach((storeRequest) => {
        storeRequest.requestedDrugs.forEach((drug) => {
          drug.date = storeRequest.requestDate;
          requestedDrugs.push(drug);
        });
      });

    const handleCloseBilling = () => {
      setBilling(false);
    };
    const handlePrepareBillForAll = () => {
      setDrugsToBill(unbilledDrugs);
      setBilling(true);
    };
    const SoldDrug = ({ drugSold }) => {
      const handlePrepareBill = () => {
        setDrugsToBill([drugSold]);
        setBilling(true);
      };
      return (
        <div className="sold_drug">
          <div className="sold_drug_left">
            <div className="sold_drug_left-header">
              <span className="drug_name">{drugSold.name}</span> was sold at{" "}
              <span className="sold_time">
                {new Date(drugSold.soldDate).toLocaleTimeString()}
              </span>
            </div>
            <div className="sold_drug_left-footer">
              {" "}
              <div>
                {" "}
                amount :<span className="drug_amount">{drugSold.amount}</span>
              </div>
              <div>
                {" "}
                status :{" "}
                <span className="drug_status"> {drugSold.status} </span>
              </div>
            </div>
          </div>

          <div className="sold_drug_right">
            <button
              className="btn btn-bill"
              onClick={handlePrepareBill}>
              prepare bill
            </button>
          </div>
        </div>
      );
    };
    const BilledDrug = ({ drugToBill }) => {
      let priceSum = 0;
      drugsToBill.forEach((drugToBill) => (priceSum += drugToBill.price));
      setTotalPrice(priceSum);
      return (
        <div className="sold_item">
          <p className="sold_item-name">Name : {drugToBill.name}</p>
          <p className="sold_item-amount">Amount : {drugToBill.amount}</p>
          <p className="sold_item-price">Price : {drugToBill.price} birr</p>
        </div>
      );
    };
    const BillCard = () => {
      return (
        <div className="bill_card">
          <button
            className="close"
            onClick={handleCloseBilling}>
            X
          </button>
          <div className="bill_card_header">bill prepared</div>

          <div className="bill_card_body">
            <div className="sold_items">
              {drugsToBill.map((drugToBill, index) => (
                <BilledDrug
                  drugToBill={drugToBill}
                  key={index}
                  index={index}
                />
              ))}
            </div>
            <div className="billed_price">
              total price :<span className="price"> {totalPrice}</span>
            </div>
          </div>
          <button className="btn bill_card_footer"> print reciept </button>
        </div>
      );
    };

    if (currentSlide == "unbilled")
      return (
        <div className="sold_drug_slide">
          <h1 className="slide_header">unbilled drugs </h1>
          <div className="sold_drugs_main">
            <div
              className={`sold_drugs ${
                unbilledDrugs.length > 1 ? "sold_drugs-multiple" : ""
              } ${billing ? "sold_drugs-blurred" : ""}`}>
              {unbilledDrugs.map((drugSold, index) => (
                <SoldDrug
                  drugSold={drugSold}
                  key={index}
                />
              ))}
            </div>
            {billing ? <BillCard /> : null}

            {unbilledDrugs.length == 1 || billing ? null : (
              <button
                className="btn btn-bill btn-billAll "
                onClick={handlePrepareBillForAll}>
                preper bill for all
              </button>
            )}
          </div>
          )
        </div>
      );
    if (currentSlide == "billedToday")
      return (
        <div className="sold_drug_slide">
          <h1 className="slide_header">drug billed today </h1>
          <div className="sold_drugs_main">
            {billedToday.length == 0 ? (
              <div className="no_data_header">
                no drug was sold within previous 24 hours !{" "}
              </div>
            ) : (
              <div
                className={`sold_drugs ${
                  billedToday.length > 1 ? "sold_drugs-multiple" : ""
                }`}>
                {billedToday.map((drugSold, index) => (
                  <SoldDrug
                    drugSold={drugSold}
                    key={index}
                  />
                ))}
              </div>
            )}
          </div>
          )
        </div>
      );
  };

  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        username={props.username}
        user="cashier"
        currentSlide={currentSlide}
        handleOnUnbilledDrugs={handleOnUnbilledDrugs}
        handleOnBilledToday={handleOnBilledToday}
      />
      <div className="main_page">
        <Overview
          user="casher"
          summary={summary}
          stockRequest={stockRequests}
        />
        <div className="page_slide">
          <SlideContent />
        </div>
      </div>
    </div>
  );
};
