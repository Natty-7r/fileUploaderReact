import "../styles/coordinatorStyles/coordinator.css";
import axios from "axios";
import { useEffect, useState } from "react";
const baseUrl = "http://localhost:8080";

const storeDrugs = [
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/41",
    suppliedDate: "13/13/13",
  },
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
  {
    name: "paracetamol",
    price: 25,
    amount: 60,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
  {
    name: "diclone",
    price: 15,
    amount: 50,
    supplier: "Abo store",
    expireDate: "12/12/42",
    suppliedDate: "13/13/13",
  },
];
const fetchDrugs = async () => {
  let drugsFetched = [];
  const response = await axios.get(`${baseUrl}/drugs`);
  drugsFetched = response.data.drugs;
  // axios
  //   .get(`${baseUrl}/drugs`)
  //   .then((response) => {
  //     drugsFetched = response.data.drugs;
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
  return drugsFetched;
};

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
  let index = props.index;
  const handleDiscard = () => {
    props.handleDiscard(index, props.drug._id);
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
  const [editing, setEditing] = useState(false);
  const [checkingExpiration, setCheckingExpiration] = useState(false);
  const [selecteDrug, setSelectedDrug] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [drugs, setDrugs] = useState([]);
  const [drugsLength, setDrugsLength] = useState(5); // just to nofity the app there is changed
  useEffect(() => {
    let drugsFetched = [];
    axios.get(`${baseUrl}/drugs`).then((response) => {
      setDrugs(response.data.drugs);
    });
  }, []);

  const handleUpdate = (index) => {
    setEditing(true);
    setSelectedIndex(index);
    setSelectedDrug(getSelectedDrug(index));
  };
  const handleUpdateDone = (newPrice, newAmount, drugId) => {
    selecteDrug.price = newPrice;
    selecteDrug.amount = newAmount;
    drugs[selectedIndex] = selecteDrug;
    setEditing(false);
    axios
      .patch(`${baseUrl}/drug`, { drugId, newPrice, newAmount })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));
  };
  const handleDiscard = (indexSelected, drugId) => {
    console.log(drugId);
    drugs.splice(indexSelected, 1);
    setDrugs(drugs);
    setDrugsLength(drugs.length);
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
  return (
    <div className="coordinator_page">
      <div className="coordinator_main">
        <div className="overview">
          <div className="summary">
            <p className="summary_name">total drugs in stock </p>
            <p className="summary_value">500</p>
          </div>
          <div className="summary">
            <p className="summary_name">availbles drugs </p>
            <p className="summary_value">500</p>
          </div>
          <div className="summary">
            <p className="summary_name">expired drugs </p>
            <p className="summary_value">500</p>
          </div>
          <div className="summary">
            <p className="summary_name">pending drugs </p>
            <p className="summary_value">500</p>
          </div>
        </div>
        <div className="actions">
          <button className="btn btn_action btn_action-add">
            Add new drugs
          </button>
          <button
            className="btn btn_action btn_action-check"
            onClick={setCheckingExpiration.bind(true)}>
            check expired drugs
          </button>
        </div>
        <div className="druglist">
          <UpdateDrugInfo
            editing={editing}
            setEditing={setEditing}
            handleUpdateDone={handleUpdateDone}
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
            <p className="list list_name list-supplier">supplier </p>
            <p className="list list_name list-s_date">supllied date </p>
            <p className="list list_name"> </p>
          </div>
          <div
            className={`list_body ${
              editing || checkingExpiration ? "blurred" : ""
            }`}>
            {drugs.map((drug, index) => (
              <DrugList
                drug={drug}
                index={index}
                key={index}
                handleUpdate={handleUpdate}
                handleDiscard={handleDiscard}
              />
            ))}
          </div>
          <div className="list_footer"></div>
        </div>
      </div>
    </div>
  );
};