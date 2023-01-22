import "../styles/coordinatorStyles/pharmacist.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { user } from "../constants/images";

const baseUrl = "http://localhost:8080/pharmacist";

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

      <p className="list list_name list-btn ">
        {
          <ListButton
            index={props.index}
            drugId={props.drug._id}
            expired={expired}
            handleSell={props.handleSell}
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

const ExpiredDrugsList = (props) => {
  if (!props.checkingExpiration) return null;
  const expriredDrugs = props.expiredDrugs.map((drug) => {
    return { index: drug.index, drugId: drug._id };
  });
  const s = expriredDrugs.sort((a, b) => b.index - a.index); // sorting in descending order by index in drugs

  const handleDiscardAll = () => {
    props.handleDiscardAll(expriredDrugs);
  };
  const handleCloseChecking = () => {
    props.setCheckingExpiration(false);
  };

  if (props.checkingExpiration) {
    if (props.expiredDrugs.length == 0) {
      return (
        <div className="expired_drugs">
          <p
            className="close_check"
            onClick={handleCloseChecking}>
            {" "}
            X{" "}
          </p>
          <h1 className="no_data_header">no drug expired found !</h1>
        </div>
      );
    } else
      return (
        <div className="expired_drugs">
          <p
            className="close_check"
            onClick={handleCloseChecking}>
            {" "}
            X{" "}
          </p>
          <div className="expired_list_header">
            <p className="expired_list">no</p>
            <p className="expired_list">name</p>
            <p className="expired_list">expire date</p>
            <p className="expired_list">expired before</p>
            <p className="expired_list">
              {" "}
              <button
                className="btn expired_list_btn expired_list_btn-discardAll"
                onClick={handleDiscardAll}>
                discard All{" "}
              </button>
            </p>
          </div>
          <div className="expired_list_body">
            {props.expiredDrugs.map((drug, order) => (
              <ExpiredDrug
                drug={drug}
                order={order}
                handleDiscard={props.handleDiscard}
              />
            ))}
          </div>
        </div>
      );
  }
};
const ExpiredDrug = (props) => {
  const handleDiscard = () => {
    props.handleDiscard(props.drug.index, props.drug._id);
  };
  return (
    <div className="expired_lists">
      <p className="expired_list">{props.order + 1}</p>
      <p className="expired_list">{props.drug.name}</p>
      <p className="expired_list">
        {new Date(props.drug.expireDate).toLocaleDateString()}
      </p>
      <p className="expired_list">{props.drug.name}</p>
      <p className="expired_list">
        <button
          className=" btn expired_list_btn expired_list_btn-discard"
          onClick={handleDiscard}>
          discard{" "}
        </button>
      </p>{" "}
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
  const [drugs, setDrugs] = useState([]);
  const [drugsInTable, setDrugsInTable] = useState();
  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/drugs`).then((response) => {
      setDrugsInTable(response.data.drugs);
      setDrugs(response.data.drugs);
      createSummary();
    });
  }, []);

  useEffect(() => {
    createSummary();
  }, [drugs]);

  const handleSell = (index) => {
    setEditing(true);
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleSellDone = (newAmount, drugId) => {
    selecteDrug.amount = newAmount;
    drugs[selectedIndex] = selecteDrug;
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
    drugs.splice(indexSelected, 1);
    setDrugs(drugs);
    setDrugsLength(drugs.length);
    createSummary();
    axios
      .delete(`${baseUrl}/drug/${drugId}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
    if (getExpiredDrugs().length == 0) setCheckingExpiration(false);
  };
  const handleDiscardAll = (expiredDrugs) => {
    let drugIds = "";
    expiredDrugs.forEach((expiredDrug) => {
      drugs.splice(expiredDrug.index, 1);
      drugIds += ":" + expiredDrug.drugId;
    });
    setDrugs(drugs);
    setDrugsLength(drugs.length);
    setCheckingExpiration(false);
    axios
      .delete(`${baseUrl}/drugs/${drugIds}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };
  const getSelectedDrug = (index) => {
    return drugs[index];
  };
  const getExpiredDrugs = () => {
    const expiredDrugs = drugs.filter((drug, index) => {
      drug.index = index;
      const expireDate = new Date(drug.expireDate);
      return expireDate < new Date();
    });
    return expiredDrugs;
  };
  const createSummary = () => {
    drugs.forEach((drug) => {
      const expireDate = new Date(drug.expireDate);

      if (expireDate < new Date()) {
        totalExpiredDrugs += drug.amount;
      } else {
        totalAvailbleDrugs += drug.amount;
      }
      totalDrugs += drug.amount;
    });
    setSummary([totalDrugs, totalAvailbleDrugs, totalExpiredDrugs]);
  };
  const searchDrug = (drugName) => {
    const searchedDrugs = drugs.filter((drug, index) => {
      drug.index = index;
      return drug.name == drugName.trim();
    });
    if (searchedDrugs.length == 0) {
      console.log("000000000000000000000000000");
    } else {
      setDrugsInTable(searchedDrugs);
    }
    return searchedDrugs;
  };
  const seeAllDrugs = () => {
    setDrugsInTable(drugs);
  };

  const handleFocus = (e) => {
    e.target.value = "";
  };
  const handleBlur = (e) => {
    e.target.value = "search";
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      const drugName = e.target.value;
      searchDrug(drugName.trim());
    }
  };
  return (
    <div className="whole_page">
      <div className="page_dashboard">
        <div className="dashboard_profile">
          <div className="profile_image">
            <img
              src={user}
              alt="user"
            />
          </div>
          <div className="profile_name">jalleta </div>
        </div>
        <div className="dashboard_menus">
          <button
            className="btn_menu btn_menu-active"
            onClick={seeAllDrugs}>
            {" "}
            available drugs{" "}
          </button>
          <button
            className={`btn_menu ${
              checkingExpiration ? "btn_menu-active " : ""
            }`}
            onClick={setCheckingExpiration.bind(true)}>
            check expired drugs{" "}
          </button>
          <button className="btn_menu">generate report </button>
          <button className="btn_menu">send requrest </button>
          <button className="btn_menu">notification </button>

          <button className="btn_menu">update profile</button>
        </div>
      </div>
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
        <div className="actions">
          <div className="search_bar">
            <input
              type="text"
              className=" search_input"
              defaultValue={"search"}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="druglist">
          <SellDrug
            editing={editing}
            setEditing={setEditing}
            handleSellDone={handleSellDone}
            selecteDrug={selecteDrug}
          />
          <ExpiredDrugsList
            checkingExpiration={checkingExpiration}
            expiredDrugs={getExpiredDrugs()}
            setCheckingExpiration={setCheckingExpiration}
            handleDiscardAll={handleDiscardAll}
            handleDiscard={handleDiscard}
          />
          <div className="list_header">
            <p className="list list_name list-no">No </p>
            <p className="list list_name list-name">Name </p>
            <p className="list list_name list-price">price </p>
            <p className="list list_name list-amount">amount </p>
            <p className="list list_name list-e_date">expired date </p>

            <p className="list list_name"> </p>
          </div>
          <div
            className={`list_body ${
              editing || checkingExpiration ? "blurred" : ""
            }`}>
            {drugs.length == 0 ? (
              <h1 className="no_data_header">
                {" "}
                No drug was found in the stock!
              </h1>
            ) : (
              drugsInTable.map((drug, index) => (
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
          <div className="list_footer"></div>
        </div>
      </div>
    </div>
  );
};
