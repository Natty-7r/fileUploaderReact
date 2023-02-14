export default (props) => {
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
