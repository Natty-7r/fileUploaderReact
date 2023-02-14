export default (props) => {
  let amount = props?.selecteDrug?.amount;
  let price = props?.selecteDrug?.price;
  const drugCode = props?.selecteDrug?.drugCode;
  const updatePrice = (e) => {
    price = e.target.value;
  };
  const updateAmount = (e) => {
    amount = e.target.value;
  };
  const handleUpdateDone = () => {
    props.handleUpdateDone(price, amount, drugCode);
  };
  const handleSetPriceDone = () => {
    props.handleSetPriceDone(price, drugCode);
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
