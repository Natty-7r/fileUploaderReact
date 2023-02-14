import { useState } from "react";
const ListButton = (props) => {
  const index = props.index;
  const handleUpdate = () => {
    props.handleUpdate(index);
  };
  const handleSell = () => {
    console.log(index);
    props.handleSell(index);
  };
  const handleSetPrice = () => {
    props.handleSetPrice(index);
  };
  const handleDiscard = () => {
    props.handleDiscard(index, props.drugCode);
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
  if (props.type == "sell") {
    return (
      <button
        className=" list_btn list_btn-update "
        onClick={handleSell}>
        sell drug
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
const SellDrug = (props) => {
  let amount = props?.selecteDrug?.amount;
  const drugCode = props?.selecteDrug?.drugCode;
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
      props.handleSellDone(amount - amountToSell, drugCode);
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
export default (props) => {
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
            drugCode={props.drug.drugCode}
            expired={expired}
            type={props.type}
            handleSell={props.handleSell}
            handleUpdate={props.handleUpdate}
            handleSetPrice={props.handleSetPrice}
            handleDiscard={props.handleDiscard}
          />
        }
      </p>
    </div>
  );
};
