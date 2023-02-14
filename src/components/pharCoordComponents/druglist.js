const ListButton = (props) => {
  const index = props.index;
  const handleUpdate = () => {
    props.handleUpdate(index);
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
            handleUpdate={props.handleUpdate}
            handleSetPrice={props.handleSetPrice}
            handleDiscard={props.handleDiscard}
          />
        }
      </p>
    </div>
  );
};
